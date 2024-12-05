// ServerOrders.jsx
import React from 'react';
import Orders from '../../../components/Orders';

async function fetchOrders() {
  const response = await fetch('http://localhost:3000/api/order', { cache: 'no-store' });
  if (!response.ok) {
    throw new Error('Failed to fetch orders');
  }
  return response.json();
}

const ServerOrders = async () => {
  try {
    const orders = await fetchOrders();
    return <Orders initialOrders={orders} />;
  } catch (error) {
    return <div>Error fetching orders: {error.message}</div>;
  }
};

export default ServerOrders;
