import clientPromise from "../../../../lib/mongodb";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

export async function PATCH(request, { params }) {
  try {
    const { id } = params;
    const body = await request.json();
    const client = await clientPromise;
    const db = client.db("robo_salvatore");

    const result = await db.collection("licencas").updateOne(
      { _id: new ObjectId(id) },
      { $set: body }
    );

    return NextResponse.json(result);
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    const client = await clientPromise;
    const db = client.db("robo_salvatore");

    const result = await db.collection("licencas").deleteOne({ _id: new ObjectId(id) });
    return NextResponse.json(result);
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
