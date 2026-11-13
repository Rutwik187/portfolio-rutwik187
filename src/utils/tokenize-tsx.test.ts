import { describe, expect, it } from "vitest"

import { tokenizeTsx, type Token } from "./tokenize-tsx"

const types = (line: Token[]) =>
  line.filter((token) => token.type !== "plain").map((token) => token.type)

describe("tokenizeTsx", () => {
  it("returns one token list per line", () => {
    expect(tokenizeTsx("a\nb\n")).toHaveLength(3)
  })

  it("keeps every character of the source", () => {
    const source = `import { cn } from "@/lib/utils"\n\nexport function A() {\n  return <div className="p-4">{1}</div>\n}\n`
    const rebuilt = tokenizeTsx(source)
      .map((line) => line.map((token) => token.text).join(""))
      .join("\n")
    expect(rebuilt).toBe(source)
  })

  it("finds keywords, strings and JSX", () => {
    const [line] = tokenizeTsx(`return <Panel id="work" max={4}>`)
    expect(types(line)).toEqual([
      "keyword",
      "tag",
      "attr",
      "string",
      "attr",
      "number",
    ])
  })

  it("does not colour keywords inside strings or comments", () => {
    const [stringLine] = tokenizeTsx(`"import from export"`)
    expect(types(stringLine)).toEqual(["string"])

    const [commentLine] = tokenizeTsx(`// return const`)
    expect(types(commentLine)).toEqual(["comment"])
  })

  it("does not match a keyword inside a longer name", () => {
    const [line] = tokenizeTsx("exported constant")
    expect(types(line)).toEqual([])
  })

  it("splits a block comment across its lines", () => {
    const lines = tokenizeTsx("/* one\ntwo */ const")
    expect(types(lines[0])).toEqual(["comment"])
    expect(types(lines[1])).toEqual(["comment", "keyword"])
  })

  it("reads closing tags and template strings", () => {
    const [line] = tokenizeTsx("</Panel> `#${ID}`")
    expect(types(line)).toEqual(["tag", "string"])
  })
})
