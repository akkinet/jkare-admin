import { NextResponse } from "next/server";
import db from "@/lib/mongodb";
const collection = db.collection("AdminUsers");
export const DELETE = async (req, ctx) => {
  try {
    await collection.deleteOne({ email: (await ctx.params).id });

    return NextResponse.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};

export const PUT = async (req, ctx) => {
  const updates = await req.json();
  const email = (await ctx.params).id;

  // Filter out undefined values
  const validUpdates = Object.keys(updates).reduce((acc, key) => {
    if (updates[key] !== undefined) {
      acc[key] = updates[key];
    }
    return acc;
  }, {});

  if (Object.keys(validUpdates).length === 0) {
    throw new Error("No valid fields to update");
  }

  try {
    const result = await collection.findOneAndUpdate(
      { email }, // Filter by email
      { $set: validUpdates }, // Update operation
      { returnDocument: "after", projection: { password: 0 } } // Return the updated document
    );

    return NextResponse.json(result);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};
