import { connection } from "next/server";
import { CandidateForm } from "@/components/candidate-form";

export default async function NewCandidatePage(props: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  await connection();
  const flash = await props.searchParams;
  return (
    <div className="grid gap-4">
      <h1 className="text-4xl">New candidate</h1>
      <CandidateForm candidate={null} flash={flash} />
    </div>
  );
}
