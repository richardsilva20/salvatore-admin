import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { days } = await request.json();
    const client = await clientPromise;
    const db = client.db("robo_salvatore");

    // Adiciona dias para todos que não são vitalícios
    const result = await db.collection("licencas").updateMany(
      { vitalicio: false },
      [
        {
          $set: {
            vencimento: {
              $dateAdd: {
                startDate: "$vencimento",
                unit: "day",
                amount: parseInt(days)
              }
            }
          }
        }
      ]
    );

    return NextResponse.json(result);
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
