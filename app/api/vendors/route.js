import { NextResponse } from "next/server"
import db from "@/lib/mongodb"

export const GET = async req => {
  try{
    const collection = db.collection("VendorAlt");
    const vendors = await collection.find({}).toArray();
    
    return NextResponse.json(vendors, {status: 200})
  }catch(error){
    console.error(error);
    return NextResponse.json({error: error.message}, {status: 500})
  }
}