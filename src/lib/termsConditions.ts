export interface ParsedCondition {
  title?: string
  content: string
}

export function parseConditions(raw?: unknown): ParsedCondition[] {
  if (!raw) return []

  if (Array.isArray(raw)) {
    return raw.flatMap((item) => parseConditions(item))
  }

  if (typeof raw === "object") {
    const obj = raw as Record<string, unknown>
    if (obj.conditions) return parseConditions(obj.conditions)
    if (obj.condition) return parseConditions(obj.condition)
    if (obj.content) return parseConditions(obj.content)
    if (obj.title || obj.detail) {
      return [
        {
          title: obj.title ? String(obj.title) : undefined,
          content: String(obj.detail || obj.title || ""),
        },
      ]
    }
    return [{ content: JSON.stringify(raw) ?? String(raw) }]
  }

  let str = typeof raw === "string" ? raw : String(raw)
  str = str.trim()
  if (!str) return []

  try {
    const parsed = JSON.parse(str)
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed.flatMap((item) => parseConditions(item))
    }
    if (typeof parsed === "object" && parsed !== null) {
      return parseConditions(parsed)
    }
  } catch {
    // Plain-text conditions are parsed below.
  }

  if (str.includes("\n\n")) {
    const blocks = str
      .split(/\n\s*\n/)
      .map((block) => block.trim())
      .filter(Boolean)

    if (blocks.length > 1) {
      return blocks.map((block) => {
        const lines = block
          .split(/\r?\n/)
          .map((line) => line.trim())
          .filter(Boolean)

        if (lines.length > 1 && lines[0].length < 60 && !lines[0].startsWith("กรณี")) {
          return {
            title: lines[0],
            content: lines.slice(1).join("\n"),
          }
        }
        return { content: block }
      })
    }
  }

  const lines = str
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
  if (lines.length <= 1) {
    return [{ content: str }]
  }

  const hasBulletsOrNumbers = lines.some((line) =>
    /^[•\-\*]|\d+[\.\)]\s*|^ข้อ\s*\d+/i.test(line),
  )

  if (hasBulletsOrNumbers) {
    const items: ParsedCondition[] = []
    let current: ParsedCondition | null = null

    for (const line of lines) {
      if (/^[•\-\*]|\d+[\.\)]\s*|^ข้อ\s*\d+/i.test(line)) {
        if (current) items.push(current)
        current = {
          content: line.replace(/^[•\-\*]\s*|^\d+[\.\)]\s*|^ข้อ\s*\d+[:\.\s]*/i, "").trim(),
        }
      } else if (current) {
        current.content += "\n" + line
      } else {
        current = { content: line }
      }
    }

    if (current) items.push(current)
    if (items.length > 0) return items
  }

  const items: ParsedCondition[] = []
  let index = 0
  while (index < lines.length) {
    const line = lines[index]
    if (
      index + 1 < lines.length &&
      line.length < 60 &&
      !line.startsWith("กรณี") &&
      !line.startsWith("หาก") &&
      !line.includes("ขอสงวนสิทธิ์") &&
      !line.endsWith("ได้") &&
      !line.endsWith("กรณี")
    ) {
      const title = line
      const contentLines = [lines[index + 1]]
      index += 2
      while (
        index < lines.length &&
        (lines[index].startsWith(" ") ||
          lines[index].startsWith("-") ||
          lines[index].startsWith("•") ||
          lines[index].length > 60 ||
          lines[index].startsWith("กรณี"))
      ) {
        contentLines.push(lines[index])
        index += 1
      }
      items.push({
        title,
        content: contentLines.join("\n"),
      })
    } else {
      items.push({ content: line })
      index += 1
    }
  }

  return items
}
