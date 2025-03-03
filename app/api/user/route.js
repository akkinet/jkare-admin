import { NextResponse } from "next/server";
import db from "@/lib/mongodb";

export const GET = async (req) => {
  try {
    const {searchParams} = new URL(req.url);

    const collection = db.collection('AdminUsers');

    // Build the query
    let query = {};
    if (searchParams.has("email")) {
      query.email = { $regex: searchParams.get("email"), $options: 'i' }; // Case-insensitive search
    }

    // Fetch users from the collection
    const users = await collection.find(query).toArray();

    return NextResponse.json(
      users,
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};
