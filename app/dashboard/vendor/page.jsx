import Vendor from "@/components/Vendor";

const VendorTable = async () => {
  const res  = await fetch(`${process.env.API_URL}/vendors`)
  const vendors = await res.json();

  return <Vendor list={vendors} />
};

export default VendorTable;
