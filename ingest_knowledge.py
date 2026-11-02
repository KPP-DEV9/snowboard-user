import glob
import json
import os
import sys
import urllib.error
import urllib.request
import uuid

# --- Configuration ---
WORKSPACE_ROOT = "/Users/p4/Documents/GitHub/snowboard-admin"
MAC_MINI_IP = "192.168.1.53"
OLLAMA_EMBED_URL = f"http://{MAC_MINI_IP}:11434/api/embeddings"
QDRANT_URL = f"http://{MAC_MINI_IP}:6333"
COLLECTION_NAME = "knowledge_base"
EMBED_MODEL = "nomic-embed-text"

# ระบุ Pattern ของไฟล์เอกสารและ Guidelines ที่ต้องการ Ingest
DOC_PATTERNS = [
    os.path.join(WORKSPACE_ROOT, "docs", "**", "*.md"),
    os.path.join(WORKSPACE_ROOT, "*.md"),
]


def chunk_text(text: str, max_chars: int = 800, overlap: int = 120) -> list[str]:
    """แบ่งข้อความเป็นก้อนย่อย โดยตัดตามบรรทัดเพื่อรักษาความหมายของข้อความ"""
    lines = text.split("\n")
    chunks = []
    current_chunk = []
    current_length = 0

    for line in lines:
        line_len = len(line) + 1
        if current_length + line_len > max_chars and current_chunk:
            chunk_content = "\n".join(current_chunk).strip()
            if chunk_content:
                chunks.append(chunk_content)

            # เก็บ overlap จากบรรทัดท้ายๆ
            overlap_lines = []
            overlap_len = 0
            for prev_line in reversed(current_chunk):
                if overlap_len + len(prev_line) + 1 <= overlap:
                    overlap_lines.insert(0, prev_line)
                    overlap_len += len(prev_line) + 1
                else:
                    break
            current_chunk = overlap_lines
            current_length = overlap_len

        current_chunk.append(line)
        current_length += line_len

    if current_chunk:
        chunk_content = "\n".join(current_chunk).strip()
        if chunk_content:
            chunks.append(chunk_content)

    return chunks


def get_embedding(text: str) -> list[float]:
    payload = json.dumps({"model": EMBED_MODEL, "prompt": text}).encode("utf-8")
    req = urllib.request.Request(
        OLLAMA_EMBED_URL,
        data=payload,
        headers={"Content-Type": "application/json"},
        method="POST",
    )
    try:
        with urllib.request.urlopen(req, timeout=30.0) as resp:
            data = json.loads(resp.read().decode("utf-8"))
            return data.get("embedding", [])
    except Exception as e:
        sys.stderr.write(f"Error getting embedding: {e}\n")
        return []


def upsert_points(points: list[dict]):
    payload = json.dumps({"points": points}).encode("utf-8")
    req = urllib.request.Request(
        f"{QDRANT_URL}/collections/{COLLECTION_NAME}/points?wait=true",
        data=payload,
        headers={"Content-Type": "application/json"},
        method="PUT",
    )
    with urllib.request.urlopen(req, timeout=30.0) as resp:
        return resp.read().decode("utf-8")


def main():
    target_files = []
    for pattern in DOC_PATTERNS:
        target_files.extend(glob.glob(pattern, recursive=True))

    target_files = sorted(list(set(target_files)))

    # กรองไฟล์ขยะและ dependency ทิ้ง
    ignore_patterns = ["node_modules", ".next", "dist", ".git"]
    filtered_files = [
        f for f in target_files if not any(p in f for p in ignore_patterns)
    ]

    if not filtered_files:
        print("❌ ไม่พบไฟล์เอกสารตาม Path ที่ระบุ")
        return

    print(f"🚀 เตรียม Ingest ทั้งหมด {len(filtered_files)} ไฟล์ เข้า Qdrant...")

    batch_points = []
    total_chunks = 0

    for file_path in filtered_files:
        rel_path = os.path.relpath(file_path, WORKSPACE_ROOT)
        try:
            with open(file_path, "r", encoding="utf-8") as f:
                content = f.read().strip()
        except Exception as e:
            print(f"⚠️ ข้ามไฟล์ {rel_path}: {e}")
            continue

        if not content:
            continue

        chunks = chunk_text(content)
        print(f"📄 อ่าน {rel_path} -> {len(chunks)} chunks")

        for idx, chunk in enumerate(chunks):
            vector = get_embedding(chunk)
            if not vector:
                continue

            point_id = str(uuid.uuid4())
            batch_points.append(
                {
                    "id": point_id,
                    "vector": vector,
                    "payload": {
                        "source": rel_path,
                        "chunk_index": idx,
                        "content": chunk,
                    },
                }
            )
            total_chunks += 1

            # ส่งเป็น Batch ละ 15 จุด เพื่อความเสถียรของ network
            if len(batch_points) >= 15:
                upsert_points(batch_points)
                batch_points.clear()
                print(f"  ⚡ Ingest แล้วสะสม {total_chunks} chunks...")

    # ส่งก้อนที่เหลือ
    if batch_points:
        upsert_points(batch_points)

    print(f"\n✅ Ingest เสร็จสิ้น! รวมทั้งหมด {total_chunks} vectors ลงใน '{COLLECTION_NAME}'")


if __name__ == "__main__":
    main()