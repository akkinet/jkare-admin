import { NextResponse } from 'next/server';
import db from "@/lib/mongodb"

export const GET = async (req, ctx) => {
  try {
    const { searchParams } = new URL(req.url);

    // Connect to MongoDB
    const ordersCollection = db.collection('Orders');

    // Build the query
    const query = {};
    if (searchParams.has("email") && searchParams.has("os")) {
      query.customer_email = searchParams.get("email");
      query.order_status = searchParams.get("os");
    }

    // Fetch orders from the collection
    const orders = await ordersCollection.find(query).toArray();

    return NextResponse.json(orders, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};