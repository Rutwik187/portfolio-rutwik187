import { escapeXml } from "@/utils/string"
import { z } from "zod"

export const BRIEF_KINDS = [
  "Freelance project",
  "Full-time role",
  "Contract",
] as const

export type BriefKind = (typeof BRIEF_KINDS)[number]

/** One brief, as the dialog sends it and the route checks it. */
export const briefSchema = z.object({
  name: z.string().trim().min(1, "Add your name.").max(80),
  email: z
    .string()
    .trim()
    .email("Add an email address I can reply to.")
    .max(200),
  kind: z.enum(BRIEF_KINDS),
  message: z
    .string()
    .trim()
    .min(10, "Write a few more words about it.")
    .max(3000, "Keep it under 3,000 characters."),
  // A field people never see. Bots fill it in, and the route then drops the
  // brief without sending it.
  website: z.string().max(200).optional().default(""),
})

export type Brief = z.infer<typeof briefSchema>

/** The email Rutwik gets: a plain text part, and a simple HTML part. */
export function formatBriefEmail(brief: Brief) {
  // A name with line breaks must not break the subject header.
  const name = brief.name.replace(/\s+/g, " ")
  const subject = `New brief from ${name} (${brief.kind.toLowerCase()})`

  const text = [
    `From: ${name} <${brief.email}>`,
    `About: ${brief.kind}`,
    "",
    brief.message,
    "",
    "Reply to this email to answer them.",
  ].join("\n")

  const muted = "color:#6b6578;font-size:13px"
  const html = `<div style="font-family:-apple-system,'Segoe UI',Helvetica,Arial,sans-serif;font-size:15px;line-height:1.6;color:#1d1a24;max-width:560px">
  <p style="margin:0 0 4px;${muted}">New brief from your portfolio</p>
  <h1 style="margin:0 0 16px;font-size:22px;font-weight:600">${escapeXml(name)}</h1>
  <p style="margin:0 0 4px"><span style="${muted}">Email</span>&nbsp; <a href="mailto:${escapeXml(brief.email)}" style="color:#1d1a24">${escapeXml(brief.email)}</a></p>
  <p style="margin:0 0 20px"><span style="${muted}">About</span>&nbsp; ${escapeXml(brief.kind)}</p>
  <p style="margin:0 0 24px;padding:16px;border-left:3px solid #ff9933;background:#f6f5f9;white-space:pre-wrap">${escapeXml(brief.message)}</p>
  <p style="margin:0;${muted}">Reply to this email to answer ${escapeXml(name)}.</p>
</div>`

  return { subject, text, html }
}
