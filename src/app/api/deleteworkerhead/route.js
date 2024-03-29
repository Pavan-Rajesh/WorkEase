import { NextResponse } from "next/server";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { client } from "@/db";
export const dynamic = "force-dynamic";
export async function POST(request) {
  const supabase = createServerComponentClient({ cookies });
  const {
    data: { session },
  } = await supabase.auth.getSession();
  const { id, email } = session.user;
  const workerdata = await request.json();

  // console.log(workerdata);
  //   { example response
  //     workerid: "d5fc617c-b543-4d47-aab3-f03fe82a84b2";
  //   }
  /**
   *   here we are removing the workers id from the array that are present in the head
   *
   */
  try {
    const query =
      await client`update head set workers = ARRAY_REMOVE(workers,${workerdata.workerid}),noofworkers=noofworkers-1 where id = ${id}`;
    // console.log(query);
    const query2 =
      await client`update workers set head=null where userid=${workerdata.workerid}`;
  } catch (e) {
    console.log(e);
  }
  return NextResponse.json({
    everything: "ok",
  });
}
