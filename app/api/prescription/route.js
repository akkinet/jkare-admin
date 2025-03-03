import { NextResponse } from 'next/server';
import db from "@/lib/db";

export const GET = async (req) => {
  try {
    const { searchParams } = new URL(req.url);
    const pStat = searchParams.get('pstat'); // Prescription status
    const oStat = searchParams.get('ostat'); // Order status
    const fields = searchParams.get('fields'); // Fields to search in
    const query = searchParams.get('query'); // Search query

    // Connect to MongoDB
    const ordersCollection = db.collection('Orders');

    // Build the base query
    const baseQuery = {};
    if (pStat && oStat) {
      baseQuery.prescription_status = pStat;
      baseQuery.order_status = oStat;
    } else {
      baseQuery.order_status = oStat ?? 'Pending';
      baseQuery.prescription_status = { $in: ['Pending', 'Received'] };
    }

    // Add search query if provided
    if (query && fields) {
      const searchFields = fields.split(',');
      const searchQuery = searchFields.map((field) => ({
        [field]: { $regex: query, $options: 'i' }, // Case-insensitive regex search
      }));

      baseQuery.$or = searchQuery; // Combine search fields with OR condition
    }

    // Fetch orders from the collection
    const orders = await ordersCollection.find(baseQuery).toArray();

    return NextResponse.json(orders, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};