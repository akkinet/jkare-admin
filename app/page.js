import Dashboard from '@/components/Dashboard'

const Home = async () => {
  const today = new Date();
  const res = await fetch(`${process.env.API_URL}/dashboard?year=${today.getFullYear()}`)
  const data = await res.json();
  return <Dashboard data={data} />
}

export default Home;