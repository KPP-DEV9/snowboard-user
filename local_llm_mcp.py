import sys
from mcp.server import Server
import mcp.types as types
import requests

# สร้าง MCP Server instance
server = Server("local-llm-bridge")

@server.list_tools()
async def handle_list_tools() -> list[types.Tool]:
    return [
        types.Tool(
            name="mi",
            description="ส่งข้อความให้ Local LLM ในเครื่องช่วยคิดหรือประมวลผลข้อมูล",
            inputSchema={
                "type": "object",
                "properties": {
                    "prompt": {"type": "string", "description": "คำถามหรือข้อความที่ต้องการส่งให้ Local LLM"}
                },
                "required": ["prompt"]
            }
        )
    ]

@server.call_tool()
async def handle_call_tool(name: str, arguments: dict) -> list[types.TextContent]:
    if name == "mi":
        prompt = arguments.get("prompt", "")
        # ตัวอย่างยิงไปที่ Ollama ในเครื่อง
        response = requests.post("http://192.168.1.49:11434/api/generate", json={
            "model": "qwen3-coder:30b", # ระบุชื่อโมเดลตามที่โฮสต์ไว้บน Mac Mini
            "prompt": prompt,
            "stream": False
        })
        result = response.json().get("response", "No response from local LLM")
        return [types.TextContent(type="text", text=result)]
    raise ValueError(f"Unknown tool: {name}")

if __name__ == "__main__":
    import asyncio
    from mcp.server.stdio import stdio_server
    async def main():
        async with stdio_server() as (read_stream, write_stream):
            await server.run(read_stream, write_stream, server.create_initialization_options())
    asyncio.run(main())