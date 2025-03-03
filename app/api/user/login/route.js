import { NextResponse } from "next/server";
import { GetCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";
import { ddbDocClient } from "@/config/docClient";
import bcrypt from "bcryptjs";
import db from "@/lib/mongodb";

export const POST = async (req) => {
  try {
    const { email, password } = await req.json();
    const collection = db.collection("AdminUsers");
    const user = await collection.findOne({ email });

    if (!user)
      return NextResponse.json({ msg: "User not found!" }, { status: 404 });

    const isMatch = bcrypt.compareSync(password, user.password);

    if (!isMatch)
      return NextResponse.json({ msg: "Password is wrong!" }, { status: 400 });

    delete user.password;

    const roleData = await db.collection("Role").findOne({ name: user.role });

    return NextResponse.json(
      { ...user, role: roleData.name, actions: Array.from(roleData.actions) },
      { status: 200 }
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
};
