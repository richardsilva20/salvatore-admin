import clientPromise from "../../../lib/mongodb";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("robo_salvatore");
    const licencas = await db.collection("licencas").find({}).sort({ created_at: -1 }).toArray();
    return NextResponse.json(licencas);
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const client = await clientPromise;
    const db = client.db("robo_salvatore");

    let vencimento = new Date();
    if (body.plano === "TESTE") vencimento.setDate(vencimento.getDate() + 1);
    else if (body.plano === "1_MES") vencimento.setMonth(vencimento.getMonth() + 1);
    else if (body.plano === "3_MESES") vencimento.setMonth(vencimento.getMonth() + 3);

    const novaLicenca = {
      cliente_id: parseInt(body.cliente_id),
      email: body.email,
      nome: body.nome,
      ativa: true,
      vencimento: vencimento,
      vitalicio: body.plano === "VITALICIO",
      marketing_mode: body.marketing_mode || false,
      hardware_id: null,
      created_at: new Date()
    };

    const result = await db.collection("licencas").insertOne(novaLicenca);
    return NextResponse.json(result);
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
