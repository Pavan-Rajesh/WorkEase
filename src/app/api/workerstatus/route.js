import { NextResponse } from "next/server";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { client } from "@/db";
export const dynamic = "force-dynamic";
export async function GET(request) {
  const supabase = createServerComponentClient({ cookies });
  const {
    data: { session },
  } = await supabase.auth.getSession();
  const { id, email } = session.user;
  const [{ owner }] =
    await client`select owner from workers where userid=${id}`;
  if (owner) {
    const ownerData =
      await client`select name,address,aadhar,phone,id from users where id=${owner}`;
    return NextResponse.json({
      owner: {
        assigned: true,
        ownerData,
      },
    });
  } else {
    return NextResponse.json({
      assigned: false,
    });
  }
}

export async function POST(request) {
  const supabase = createServerComponentClient({ cookies });
  const {
    data: { session },
  } = await supabase.auth.getSession();
  const { id, email } = session.user;
  const { ownerid, status } = await request.json();
  if (status) {
    const acceptWork = await client`select workerAccept(${id},${ownerid})`;
  } else {
    const rejectwork = await client`select workerReject(${id},${ownerid})`;
  }
  return NextResponse.json({
    ok: "ok",
  });
}
