import Prescription from "@/components/Prescription";
export const dynamic = 'force-dynamic';

async function fetchPrescriptions() {
  try {
    const response = await fetch(`${process.env.API_URL}/prescription`);
    if (!response.ok) throw new Error("Failed to fetch orders");

    const orders = await response.json();
    return { orders, error: null };
  } catch (error) {
    return { orders: [], error: error.message };
  }
}

export default async function Page() {
  const { orders, error } = await fetchPrescriptions();
  return (
    <div>
      <Prescription initialOrders={orders} error={error} />
    </div>
  );
}
