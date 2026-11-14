import { PrismaClient } from "@prisma/client"
import { catalogProblems } from "../data/geo"
import { industries } from "../data/industries"
import { sampleJobs } from "../data/jobs"
import { locations } from "../data/locations"
import { sampleCandidates } from "../data/samples"

const prisma = new PrismaClient()

async function main() {
  const problems = catalogProblems()
  if (problems.length > 0) {
    throw new Error(`Seed catalog is inconsistent:\n${problems.join("\n")}`)
  }

  for (const [index, industry] of industries.entries()) {
    await prisma.industry.upsert({
      where: { slug: industry.slug },
      create: {
        slug: industry.slug,
        name: industry.name,
        geoPrefix: industry.geoPrefix,
        sortOrder: index,
      },
      update: {
        name: industry.name,
        geoPrefix: industry.geoPrefix,
        sortOrder: index,
      },
    })
  }

  for (const [index, location] of locations.entries()) {
    const data = {
      city: location.city,
      state: location.state,
      stateName: location.stateName,
      county: location.county,
      filterGroup: location.filterGroup,
      isFiberMarket: location.isFiberMarket,
      fiberTier: location.fiberTier,
      sortOrder: index,
    }
    await prisma.location.upsert({
      where: { slug: location.slug },
      create: { slug: location.slug, ...data },
      update: data,
    })
  }

  for (const sample of sampleCandidates) {
    const record = await prisma.candidate.upsert({
      where: { slug: sample.slug },
      create: {
        slug: sample.slug,
        realName: sample.realName,
        phone: sample.phone,
        email: sample.email,
        interviewNotes: sample.interviewNotes,
        pseudonym: sample.pseudonym,
        headline: sample.headline,
        summary: sample.summary,
        background: sample.background,
        experience: sample.experience,
        personality: sample.personality,
        lookingFor: sample.lookingFor,
        yearsExperience: sample.yearsExperience,
        salesType: sample.salesType,
        availability: sample.availability,
        willingToTravel: sample.willingToTravel,
        payStructure: sample.payStructure,
        workStyle: sample.workStyle,
        schedule: sample.schedule,
        locationSlug: sample.locationSlug,
        isSample: true,
        isPublished: true,
        generationSource: "seed",
        publishedAt: new Date(sample.publishedAt),
      },
      update: {
        realName: sample.realName,
        phone: sample.phone,
        email: sample.email,
        interviewNotes: sample.interviewNotes,
        pseudonym: sample.pseudonym,
        headline: sample.headline,
        summary: sample.summary,
        background: sample.background,
        experience: sample.experience,
        personality: sample.personality,
        lookingFor: sample.lookingFor,
        yearsExperience: sample.yearsExperience,
        salesType: sample.salesType,
        availability: sample.availability,
        willingToTravel: sample.willingToTravel,
        payStructure: sample.payStructure,
        workStyle: sample.workStyle,
        schedule: sample.schedule,
        locationSlug: sample.locationSlug,
        isSample: true,
        isPublished: true,
        generationSource: "seed",
        publishedAt: new Date(sample.publishedAt),
      },
    })
    await prisma.candidateIndustry.deleteMany({ where: { candidateId: record.id } })
    await prisma.candidateIndustry.createMany({
      data: sample.industries.map((industrySlug) => ({
        candidateId: record.id,
        industrySlug,
      })),
    })
  }

  for (const job of sampleJobs) {
    await prisma.job.upsert({
      where: { slug: job.slug },
      create: { ...job, isSample: true, isPublished: true },
      update: { ...job, isSample: true, isPublished: true },
    })
  }
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (error) => {
    console.error(error)
    await prisma.$disconnect()
    process.exit(1)
  })
