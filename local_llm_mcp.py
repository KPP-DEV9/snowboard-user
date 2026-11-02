import json
import os
import re
import sys
import urllib.error
import urllib.request

WORKSPACE_ROOT = "/Users/p4/Documents/GitHub/snowboard-admin"
MAC_MINI_IP = "192.168.1.53"
OLLAMA_GEN_URL = f"http://{MAC_MINI_IP}:11434/api/generate"
OLLAMA_EMBED_URL = f"http://{MAC_MINI_IP}:11434/api/embeddings"
QDRANT_URL = f"http://{MAC_MINI_IP}:6333"
MODEL_NAME = "qwen3-coder:30b"
EMBED_MODEL = "nomic-embed-text"


def log_debug(msg: str):
    """Log ข้อความออกทาง stderr เท่านั้น เพื่อไม่ให้กวน JSON-RPC บน stdout"""
    sys.stderr.write(f"[kpp-bridge] {msg}\n")
    sys.stderr.flush()


def resolve_workspace_path(rel_or_abs: str) -> str:
    path = rel_or_abs.strip()
    if not os.path.isabs(path):
        path = os.path.join(WORKSPACE_ROOT, path)
    return os.path.abspath(path)


def call_ollama(prompt: str, temperature: float = 0.1) -> str:
    payload = json.dumps(
        {
            "model": MODEL_NAME,
            "prompt": prompt,
            "stream": False,
            "options": {
                "temperature": temperature,
                "num_ctx": 16384,  # ป้องกัน context เต็มเวลาส่งไฟล์ยาวๆ
            },
        },
        ensure_ascii=False,
    ).encode("utf-8")
    req = urllib.request.Request(
        OLLAMA_GEN_URL,
        data=payload,
        headers={"Content-Type": "application/json"},
        method="POST",
    )
    try:
        with urllib.request.urlopen(req, timeout=180.0) as resp:
            body = resp.read().decode("utf-8")
            return json.loads(body).get("response", "No response from local LLM")
    except Exception as e:
        return f"Error calling Ollama on Mac mini: {e}"


def get_embedding(text: str) -> list:
    if not text or not isinstance(text, str):
        return []

    payload = json.dumps({"model": EMBED_MODEL, "prompt": text}).encode("utf-8")
    req = urllib.request.Request(
        OLLAMA_EMBED_URL,
        data=payload,
        headers={"Content-Type": "application/json"},
        method="POST",
    )
    try:
        with urllib.request.urlopen(req, timeout=30.0) as resp:
            body = resp.read().decode("utf-8")
            result = json.loads(body)
            return result.get("embedding", [])
    except Exception as e:
        log_debug(f"Error getting embedding: {e}")
        return []


def check_qdrant_status(collection_name="knowledge_base") -> str:
    try:
        req = urllib.request.Request(
            f"{QDRANT_URL}/collections/{collection_name}",
            method="GET",
        )
        with urllib.request.urlopen(req, timeout=5.0) as resp:
            return f"Qdrant is available and collection '{collection_name}' exists"
    except urllib.error.HTTPError as e:
        if e.code == 404:
            return f"Qdrant is available but collection '{collection_name}' does not exist"
        return f"Qdrant error: {e.code} - {e.reason}"
    except urllib.error.URLError as e:
        return f"Cannot reach Qdrant: {e.reason}"
    except Exception as e:
        return f"Error checking Qdrant status: {str(e)}"


def query_qdrant(query_text: str, collection_name="knowledge_base", limit=3) -> str:
    try:
        vector = get_embedding(query_text)
        if not vector:
            return "Failed to generate embedding"

        search_payload = json.dumps(
            {"vector": vector, "limit": limit, "with_payload": True}
        ).encode("utf-8")

        search_req = urllib.request.Request(
            f"{QDRANT_URL}/collections/{collection_name}/points/search",
            data=search_payload,
            headers={"Content-Type": "application/json"},
            method="POST",
        )

        with urllib.request.urlopen(search_req, timeout=30.0) as resp:
            data = json.loads(resp.read().decode("utf-8"))
            results = data.get("result", []) or data.get("points", [])

            if not results:
                return "No relevant context found in Qdrant."

            extracted = []
            for item in results:
                score = item.get("score", 0.0)
                payload = item.get("payload", {}) or item
                extracted.append(
                    f"[Score: {score:.3f}]\nPayload: {json.dumps(payload, ensure_ascii=False)}"
                )
            return "\n\n---\n\n".join(extracted)
    except urllib.error.HTTPError as e:
        return f"HTTP Error querying Qdrant: {e.code} - {e.reason}"
    except urllib.error.URLError as e:
        return f"URL Error querying Qdrant: {e.reason}"
    except Exception as e:
        return f"Error querying Qdrant: {str(e)}"


def ask_kpp_with_rag(prompt: str) -> str:
    rag_context = query_qdrant(prompt, limit=3)

    if "No relevant context found" in rag_context or "Error querying Qdrant" in rag_context:
        return call_ollama(prompt)

    full_prompt = f"""Use the following context from project knowledge base to answer the request:

---
{rag_context}
---

Request: {prompt}"""
    return call_ollama(full_prompt)


def execute_kpp_file_task(
    instruction: str,
    source_files: list,
    target_files: list,
    use_rag: bool = False,
) -> str:
    file_contexts = []
    for src in source_files:
        abs_path = resolve_workspace_path(src)
        rel_path = os.path.relpath(abs_path, WORKSPACE_ROOT)
        if os.path.exists(abs_path):
            with open(abs_path, "r", encoding="utf-8") as f:
                content = f.read()
            file_contexts.append(f'<source_file path="{rel_path}">\n{content}\n</source_file>')
        else:
            file_contexts.append(f'<source_file path="{rel_path}" status="missing" />')

    target_hint = (
        f"Target files to output: {', '.join(target_files)}"
        if target_files
        else "Output all modified or newly created files."
    )

    rag_section = ""
    if use_rag:
        rag_context = query_qdrant(instruction, limit=3)
        if "No relevant context found" not in rag_context and "Error" not in rag_context:
            rag_section = f"\nProject Knowledge / Guidelines:\n---\n{rag_context}\n---\n"

    full_prompt = f"""You are an expert TypeScript / Next.js 16 refactoring engine.
Follow these strict rules:
1. Preserve existing UI classes, Tailwind styles, props, and behavior unless explicitly instructed to change them.
2. Output COMPLETE file contents (never truncate with `// ... rest of code`).
3. Wrap EVERY output file inside `<file path="relative/path/from/workspace">...full code...</file>` tags. Do NOT wrap the code inside markdown backticks inside `<file>`.
4. After all `<file>` blocks, write a 1-line `<summary>...</summary>`.

{rag_section}
{target_hint}

Instruction:
{instruction}

Source Files:
{chr(10).join(file_contexts)}
"""

    raw_response = call_ollama(full_prompt, temperature=0.05)
    if raw_response.startswith("Error calling Ollama"):
        return raw_response

    pattern = re.compile(r'<file\s+path=["\']([^"\']+)["\']\s*>\n?(.*?)\n?</file>', re.DOTALL)
    matches = pattern.findall(raw_response)

    if not matches:
        return f"Local LLM did not return <file> blocks. Raw response:\n{raw_response}"

    written = []
    for rel_path, code in matches:
        cleaned = re.sub(r"^```[a-zA-Z]*\n", "", code.strip())
        cleaned = re.sub(r"\n```$", "", cleaned)

        abs_target = resolve_workspace_path(rel_path)
        # ป้องกัน directory traversal หลุดนอก WORKSPACE_ROOT
        try:
            if os.path.commonpath([WORKSPACE_ROOT, abs_target]) != WORKSPACE_ROOT:
                continue
        except ValueError:
            continue

        os.makedirs(os.path.dirname(abs_target), exist_ok=True)
        with open(abs_target, "w", encoding="utf-8") as f:
            f.write(cleaned + "\n")
        line_count = len(cleaned.splitlines())
        written.append(f"{os.path.relpath(abs_target, WORKSPACE_ROOT)} ({line_count} lines)")

    summary_match = re.search(r"<summary>(.*?)</summary>", raw_response, re.DOTALL)
    summary_text = summary_match.group(1).strip() if summary_match else "Completed file updates."

    return f"✅ kpp wrote {len(written)} file(s): {', '.join(written)}\nSummary: {summary_text}"


def send_response(msg_id, result=None, error=None):
    response = {"jsonrpc": "2.0", "id": msg_id}
    if error is not None:
        response["error"] = error
    else:
        response["result"] = result
    sys.stdout.write(json.dumps(response, ensure_ascii=False) + "\n")
    sys.stdout.flush()


def handle_message(msg: dict):
    method = msg.get("method")
    msg_id = msg.get("id")
    params = msg.get("params") or {}

    if msg_id is None:
        return

    if method == "initialize":
        protocol_version = params.get("protocolVersion", "2024-11-05")
        send_response(
            msg_id,
            {
                "protocolVersion": protocol_version,
                "capabilities": {"tools": {}},
                "serverInfo": {"name": "local-llm-bridge", "version": "1.1.0"},
            },
        )
    elif method == "ping":
        send_response(msg_id, {})
    elif method == "tools/list":
        send_response(
            msg_id,
            {
                "tools": [
                    {
                        "name": "kpp",
                        "description": (
                            "ส่งคำสั่งให้ Local LLM (qwen3-coder:30b) ประมวลผล หรืออ่าน/แก้ไขไฟล์ลงดิสก์โดยตรงเพื่อประหยัด Token "
                            "(ถ้าระบุ source_files ตัว Python จะอ่านไฟล์และเขียนไฟล์ที่แก้แล้วลงดิสก์ให้เองโดยไม่ต้องส่งโค้ดผ่านแชท)"
                        ),
                        "inputSchema": {
                            "type": "object",
                            "properties": {
                                "prompt": {
                                    "type": "string",
                                    "description": "คำถามหรือคำสั่งที่ต้องการให้ Local LLM ทำ",
                                },
                                "source_files": {
                                    "type": "array",
                                    "items": {"type": "string"},
                                    "description": "รายชื่อไฟล์ต้นทาง (เช่น ['src/app/page.tsx']) ให้ Python อ่านส่งเข้า Local LLM โดยตรง",
                                },
                                "target_files": {
                                    "type": "array",
                                    "items": {"type": "string"},
                                    "description": "รายชื่อไฟล์ปลายทางที่ต้องการให้ Local LLM สร้างหรือแก้ไขลงดิสก์โดยตรง",
                                },
                                "use_rag": {
                                    "type": "boolean",
                                    "description": "ตั้งเป็น true เพื่อดึง Context จาก Qdrant มาร่วมตอบหรือแก้ไขไฟล์",
                                },
                            },
                            "required": ["prompt"],
                        },
                    },
                    {
                        "name": "kpp_search",
                        "description": "ค้นหา Vector Documentation/Context จาก Qdrant บน Mac mini",
                        "inputSchema": {
                            "type": "object",
                            "properties": {
                                "query": {
                                    "type": "string",
                                    "description": "คำค้นหาหรือหัวข้อที่ต้องการค้นหาในฐานข้อมูล",
                                },
                                "collection_name": {
                                    "type": "string",
                                    "description": "ชื่อ collection ที่ต้องการค้นหา (ค่าเริ่มต้น 'knowledge_base')",
                                    "default": "knowledge_base",
                                },
                            },
                            "required": ["query"],
                        },
                    },
                ]
            },
        )
    elif method == "tools/call":
        tool_name = params.get("name")
        arguments = params.get("arguments") or {}

        if tool_name == "kpp":
            prompt = arguments.get("prompt", "")
            source_files = arguments.get("source_files") or []
            target_files = arguments.get("target_files") or []
            use_rag = bool(arguments.get("use_rag", False))

            if source_files or target_files:
                result_text = execute_kpp_file_task(prompt, source_files, target_files, use_rag=use_rag)
            elif use_rag:
                result_text = ask_kpp_with_rag(prompt)
            else:
                result_text = call_ollama(prompt)

            send_response(msg_id, {"content": [{"type": "text", "text": result_text}]})
        elif tool_name == "kpp_search":
            query = arguments.get("query", "")
            collection_name = arguments.get("collection_name", "knowledge_base")
            result_text = query_qdrant(query, collection_name)
            send_response(msg_id, {"content": [{"type": "text", "text": result_text}]})
        else:
            send_response(
                msg_id, error={"code": -32601, "message": f"Unknown tool: {tool_name}"}
            )
    elif method in ["resources/list", "prompts/list"]:
        send_response(msg_id, {method.split("/")[0]: []})
    else:
        send_response(
            msg_id, error={"code": -32601, "message": f"Method not found: {method}"}
        )


def main():
    log_debug("Testing Qdrant connection...")
    status = check_qdrant_status()
    log_debug(status)

    for line in sys.stdin:
        line = line.strip()
        if not line:
            continue
        try:
            msg = json.loads(line)
            handle_message(msg)
        except Exception as e:
            log_debug(f"Error processing message: {e}")


if __name__ == "__main__":
    main()