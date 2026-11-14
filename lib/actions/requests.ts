"use server"

import { redirect } from "next/navigation"
import { getSession } from "../auth"
import { prisma } from "../db"
import { sendDeskEmail } from "../email"
import { readRequestForm } from "../validators"

export async function submitRequest(
  slug: string,
  type: "invite" | "meeting",
  _prev: { error: string } | null,
  formData: FormData,
) {
  const parsed = readRequestForm(formData, type)
  if (!parsed.ok) return { error: parsed.error }
  if (parsed.spam) redirect(`/candidates/${slug}?sent=${type}#${type}`)

  const candidate = await prisma.candidate.findFirst({
    where: { slug, isPublished: true },
    select: {
      id: true,
      pseudonym: true,
      realName: true,
      isSample: true,
      location: { select: { city: true, state: true } },
    },
  })
  if (!candidate) return { error: "That profile is not available." }

  const created = await prisma.contactRequest.create({
    data: {
      candidateId: candidate.id,
      type,
      name: parsed.data.name,
      company: parsed.data.company,
      email: parsed.data.email,
      phone: parsed.data.phone,
      message: parsed.data.message,
      preferredTimes: parsed.data.preferredTimes,
      emailStatus: "pending",
    },
  })

  const label = type === "meeting" ? "Meeting request" : "Invite"
  const emailStatus = await sendDeskEmail({
    subject: `${label}: ${candidate.pseudonym} — ${parsed.data.company}`,
    text: [
      `${label} for ${candidate.pseudonym}${candidate.isSample ? " (sample profile)" : ""}.`,
      `Legal name on file: ${candidate.realName}`,
      `Market: ${candidate.location.city}, ${candidate.location.state}`,
      "",
      `From: ${parsed.data.name}`,
      `Company: ${parsed.data.company}`,
      `Email: ${parsed.data.email}`,
      `Phone: ${parsed.data.phone}`,
      parsed.data.preferredTimes ? `Times: ${parsed.data.preferredTimes}` : "",
      "",
      parsed.data.message,
      "",
      `Request id: ${created.id}`,
    ]
      .filter(Boolean)
      .join("\n"),
  })

  await prisma.contactRequest.update({
    where: { id: created.id },
    data: { emailStatus },
  })

  redirect(`/candidates/${slug}?sent=${type}#${type}`)
}

export async function setRequestStatus(id: string, formData: FormData) {
  if (!(await getSession())) redirect("/admin/login")
  const status = String(formData.get("status") ?? "")
  if (!["new", "reviewed", "closed"].includes(status)) redirect("/admin/requests?error=Unknown+status")
  await prisma.contactRequest.update({ where: { id }, data: { status } })
  redirect("/admin/requests?saved=1")
}
