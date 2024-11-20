import Dashboard from '@/components/Dashboard'

const page = async () => {
  const res = await fetch(`${process.env.API_URL}/dashboard`)
  const data = await res.json();
  return <Dashboard data={data} />
}

export default page;