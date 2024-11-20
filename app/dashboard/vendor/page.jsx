import Vendor from "@/components/Vendor";

const page = async () => {
  try {
    const res = await fetch(`${process.env.API_URL}/vendors`);
    if (!res.ok) {
      throw new Error(`Failed to fetch: ${res.status} ${res.statusText}`);
    }
    const vendors = await res.json();
    return <Vendor list={vendors} />;
  } catch (error) {
    console.error("Failed to fetch vendors:", error);
    return <Vendor list={[]} />; // Return empty or fallback content
  }
  
};

export default page;
