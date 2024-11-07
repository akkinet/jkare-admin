import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { ddbDocClient } from "@/config/docClient";
import { PutCommand } from "@aws-sdk/lib-dynamodb";

export const POST = async (req) => {
  try {
    const body = await req.json();

    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(body.password, salt);
    delete body.password;

    const params = {
      TableName: "AdminUsers",
      Item: {
        ...body,
        password: hashedPassword,
      },
    };

    await ddbDocClient.send(new PutCommand(params));

    return NextResponse.json(
      { message: "successfully signed up" },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};
