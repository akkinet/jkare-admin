import { ObjectId } from "mongodb";
import { transaction, getTransaction } from "../../../lib/shippo";
import db from "@/lib/mongodb"

export async function PUT(req) {
  const { rate, order_id } = await req.json();
  try {
    const res = await transaction(rate);
    const Order = db.collection("Order");
    await Order.updateOne(
      {
        "_id": new ObjectId(order_id)
      },
      { $set: { tracking_number: res.tracking_number || "SHIPPO_TRANSIT", carrier: res.carrier || "shippo" } },
      // { new: true }
    );

    return Response.json(res, { status: 200 });
  } catch (error) {
    console.error(error)
    return Response.json(
      { error: "Failed to track shipment" },
      { status: 500 }
    );
  }
}

export async function GET(request){
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  if (!id) {
    return Response.json({ error: 'Transaction ID is required' }, { status: 400 });
  }

  try {
    const res = await getTransaction(id);
    return Response.json(res, { status: 200 });
  } catch (error) {
    return Response.json(
      { error: "Failed to fetch transaction" },
      { status: 500 }
    );
  }
}