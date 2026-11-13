export type TokenType =
  | "comment"
  | "string"
  | "tag"
  | "keyword"
  | "number"
  | "attr"
  | "plain"

export type Token = { type: TokenType; text: string }

const KEYWORDS = [
  "as",
  "async",
  "await",
  "const",
  "default",
  "else",
  "export",
  "extends",
  "false",
  "for",
  "from",
  "function",
  "if",
  "import",
  "in",
  "interface",
  "keyof",
  "let",
  "new",
  "null",
  "of",
  "return",
  "true",
  "type",
  "typeof",
  "undefined",
]

// One pass, first match wins, so the order of the groups matters: comments
// and strings must win over anything that could appear inside them.
const TOKEN_PATTERN = new RegExp(
  [
    String.raw`(\/\/[^\n]*|\/\*[\s\S]*?\*\/)`, // 1 comment
    String.raw`("(?:[^"\\\n]|\\.)*"|'(?:[^'\\\n]|\\.)*'|` +
      "`(?:[^`\\\\]|\\\\.)*`)", // 2 string
    String.raw`(<\/?[A-Za-z][\w.]*)`, // 3 JSX tag
    String.raw`\b(${KEYWORDS.join("|")})\b`, // 4 keyword
    String.raw`\b(\d[\d_.]*)\b`, // 5 number
    String.raw`([A-Za-z_][\w-]*)(?==)`, // 6 JSX attribute or prop
  ].join("|"),
  "g"
)

const GROUP_TYPES: TokenType[] = [
  "comment",
  "string",
  "tag",
  "keyword",
  "number",
  "attr",
]

/**
 * A small TSX highlighter: good enough to colour source code for display, with
 * no parser and no dependency. It returns one token list per source line.
 */
export function tokenizeTsx(source: string): Token[][] {
  const tokens: Token[] = []
  let cursor = 0

  for (const match of source.matchAll(TOKEN_PATTERN)) {
    const index = match.index
    if (index > cursor) {
      tokens.push({ type: "plain", text: source.slice(cursor, index) })
    }

    const group = match.slice(1).findIndex((value) => value !== undefined)
    tokens.push({ type: GROUP_TYPES[group], text: match[0] })
    cursor = index + match[0].length
  }

  if (cursor < source.length) {
    tokens.push({ type: "plain", text: source.slice(cursor) })
  }

  return splitIntoLines(tokens)
}

/** Breaks tokens at newlines, so a block comment can span several lines. */
function splitIntoLines(tokens: Token[]): Token[][] {
  const lines: Token[][] = [[]]

  for (const token of tokens) {
    const parts = token.text.split("\n")
    parts.forEach((part, index) => {
      if (index > 0) lines.push([])
      if (part) lines[lines.length - 1].push({ type: token.type, text: part })
    })
  }

  return lines
}
