import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import db from "@/lib/mongodb"

export const POST = async (req) => {
  try {
    const body = await req.json();

    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(body.password, salt);
    delete body.password;

    const collection = db.collection("AdminUsers");
    await collection.insertOne({
      ...body,
      password: hashedPassword, 
    });

    return NextResponse.json(
      { message: "successfully signed up" },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};
