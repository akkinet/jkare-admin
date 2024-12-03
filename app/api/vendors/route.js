import { NextResponse } from "next/server"
import { ddbDocClient } from "@/config/docClient";
import { ScanCommand } from "@aws-sdk/lib-dynamodb";

export const GET = async req => {
  try{
    const params = {
      TableName: "VendorAlt", 
      // Limit: 10,                
    };
    const result = await ddbDocClient.send(new ScanCommand(params));
    const vendors = result.Count > 0 ? result.Items : [];
    return NextResponse.json(vendors, {status: 200})
  }catch(error){
    console.error(error);
    return NextResponse.json({error: error.message}, {status: 500})
  }
}