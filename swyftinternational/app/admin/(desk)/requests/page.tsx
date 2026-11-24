import { connection } from "next/server";
import { Flash } from "@/components/flash";
import { reviewRequest } from "@/lib/actions/desk";
import { formatDate } from "@/lib/format";
import { listRequests } from "@/lib/queries";

export default async function RequestsPage(props: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  await connection();
  const requests = listRequests();
  return (
    <div className="grid gap-4">
      <h1 className="text-4xl">Meeting requests</h1>
      <Flash searchParams={await props.searchParams} />
      <ul className="grid gap-3">
        {requests.map((request) => (
          <li key={request.id} className="rounded-2xl bg-foam p-4 text-sm ring-1 ring-ink/10">
            <p className="font-medium">{request.name} · {request.company}</p>
            <p className="text-ink/70">{request.candidateName} · {request.email} · {request.phone} · {formatDate(request.createdAt)}</p>
            <p className="mt-2">{request.message}</p>
            {request.preferredTimes ? <p className="text-ink/60">Times: {request.preferredTimes}</p> : null}
            <form action={reviewRequest} className="mt-3 flex gap-2">
              <input type="hidden" name="id" value={request.id} />
              <select className="input w-40" name="status" defaultValue={request.status}>
                <option value="new">New</option>
                <option value="reviewed">Reviewed</option>
                <option value="closed">Closed</option>
              </select>
              <button className="h-11 rounded-full bg-ink px-4 text-sm text-paper" type="submit">Update</button>
            </form>
          </li>
        ))}
      </ul>
    </div>
  );
}
