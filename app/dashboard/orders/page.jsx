"use client";
import React, { useState, useEffect } from 'react';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/order');
        if (!response.ok) {
          throw new Error('Failed to fetch orders');
        }
        const data = await response.json();
        setOrders(data);
        setFilteredOrders(data);
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };

    fetchOrders();
  }, []);

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (query === '') {
      setFilteredOrders(orders);
    } else {
      const filtered = orders.filter((order) =>
        order.id.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredOrders(filtered);
    }
  };

  const openModal = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedOrder(null);
    setIsModalOpen(false);
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-center text-4xl font-bold text-customBlue mb-4">All Orders</h1>

      <div className="mb-4 flex justify-between items-center">
        <input
          type="text"
          placeholder="Search by Order ID"
          value={searchQuery}
          onChange={handleSearch}
          className="border rounded px-4 py-2 w-1/2"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead className="bg-gray-200 text-gray-700">
            <tr>
              <th className="px-6 py-3 text-center text-sm font-medium">S.No</th>
              <th className="px-6 py-3 text-center text-sm font-medium">Order ID</th>
              <th className="px-6 py-3 text-center text-sm font-medium">Customer Email</th>
              <th className="px-6 py-3 text-center text-sm font-medium">Order Date</th>
              <th className="px-6 py-3 text-center text-sm font-medium">Order Status</th>
              <th className="px-6 py-3 text-center text-sm font-medium">Prescription Status</th>
              <th className="px-6 py-3 text-center text-sm font-medium">Order Details</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order, index) => (
              <tr key={order.id} className="border-b last:border-none">
                <td className="px-6 py-2 text-sm">{index + 1}</td>
                <td className="px-6 py-2 text-sm">{order.id}</td>
                <td className="px-6 py-2 text-sm">{order.customer_email}</td>
                <td className="px-6 py-2 text-sm">{order.order_date}</td>
                <td className="px-6 py-2 text-sm">
                  <span
                    className={`inline-block px-4 py-2 w-24 text-center rounded text-white font-semibold ${order.order_status === 'Completed'
                      ? 'bg-green-500'
                      : order.order_status === 'Pending'
                        ? 'bg-yellow-500'
                        : order.order_status === 'Cancelled'
                          ? 'bg-red-500'
                          : 'bg-gray-500'
                      }`}
                  >
                    {order.order_status}
                  </span>
                </td>


                <td className="px-6 py-2 text-sm">
                  {order.prescription_status === '' ? 'Not Required' : order.prescription_status}
                </td>

                <td className="px-6 py-2 text-sm">
                  <button
                    className="bg-customPink text-white px-4 py-2 rounded hover:bg-customBlue"
                    onClick={() => openModal(order)}
                  >
                    View 
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-lg w-full p-6 overflow-y-auto">
            <h3 className="text-xl font-bold mb-4">Order Details</h3>
            <p><strong>Order ID:</strong> {selectedOrder.id}</p>
            <p><strong>Customer Name:</strong> {selectedOrder.customer_name}</p>
            <p><strong>Customer Email:</strong> {selectedOrder.customer_email}</p>
            <p><strong>Customer Phone:</strong> {selectedOrder.customer_phone}</p>
            <p><strong>Order Date:</strong> {selectedOrder.order_date}</p>
            <p><strong>Order Status:</strong> {selectedOrder.order_status}</p>
            <p><strong>Prescription Status:</strong> {selectedOrder.prescription_status}</p>
            <p>
              <strong>Shipping Address:</strong> {selectedOrder.shipping_address.line1},{' '}
              {selectedOrder.shipping_address.city}, {selectedOrder.shipping_address.state},{' '}
              {selectedOrder.shipping_address.postal_code}, {selectedOrder.shipping_address.country}
            </p>
            <p>
              <strong>Billing Address:</strong> {selectedOrder.billing_address.line1},{' '}
              {selectedOrder.billing_address.city}, {selectedOrder.billing_address.state},{' '}
              {selectedOrder.billing_address.postal_code}, {selectedOrder.billing_address.country}
            </p>
            <p><strong>Total Amount:</strong> ${selectedOrder.total_amount}</p>
            <h4 className="text-lg font-bold mt-4">Items</h4>
            <ul className="list-disc pl-5">
              {selectedOrder.items.map((item, index) => (
                <li key={index}>
                  <strong>{item.product_name}</strong> - ${item.price} x {item.quantity}
                </li>
              ))}
            </ul>
            <button
              className="mt-6 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              onClick={closeModal}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;
