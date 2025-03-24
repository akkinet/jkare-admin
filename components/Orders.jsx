"use client";
import React, { useState } from 'react';

const Orders = ({ initialOrders }) => {

  const sortedOrders = [...initialOrders].sort(
    (a, b) => new Date(b.order_date) - new Date(a.order_date)
  );

  const [orders] = useState(sortedOrders);
  const [filteredOrders, setFilteredOrders] = useState(sortedOrders);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');


  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (query === '') {
      setFilteredOrders(orders);
    } else {
      const filtered = orders.filter((order) =>
        order._id.toLowerCase().includes(query.toLowerCase()) ||
        order.customer_email.toLowerCase().includes(query.toLowerCase())
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
        <span className="text-gray-700 font-medium mr-10 ">Total Orders: {filteredOrders.length}</span>
      </div>

      <div className="overflow-x-auto overflow-y-auto max-h-[56vh]">
        <table className="min-w-full bg-white shadow-md rounded-lg">
          <thead className="bg-gray-200 text-gray-700 sticky top-0 z-10">
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
              <tr key={order._id} className="border-b last:border-none">
                <td className="px-6 py-2 text-sm text-center">{index + 1}</td>
                <td className="px-6 py-2 text-sm text-center">{order._id}</td>
                <td className="px-6 py-2 text-sm text-center">{order.customer_email}</td>
                <td className="px-6 py-2 text-sm text-center">{order.order_date}</td>
                <td className="px-6 py-2 text-sm text-center">
                  <span
                    className={`inline-block px-4 py-2  text-center rounded text-white font-semibold ${order.order_status === 'Completed'
                      ? 'bg-green-500'
                      : order.order_status === 'Pending'
                        ? 'bg-yellow-500'
                        : order.order_status === 'Cancelled'
                          ? 'bg-red-500'
                          : 'bg-gray-500'
                      }`}
                  >
                    {order.order_status === 'Completed' ? 'Ready to Ship' : order.order_status}
                  </span>

                </td>


                <td className="px-6 py-2 text-sm text-center">
                  {order.prescription_status === '' ? 'Not Required' : order.prescription_status}
                </td>

                <td className="px-6 py-2 text-sm text-center">
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
          <div className="bg-white rounded-lg shadow-lg max-w-5xl w-full p-6 overflow-y-auto">
            <h3 className="text-xl font-bold mb-2 text-left border-b-2 border-customBlue pb-2">Order Details</h3>

            {/* Two-Column Layout for Order Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-b-2 border-customBlue pb-2">
              <div>
                <p><strong>Order ID:</strong> {selectedOrder._id}</p>
                <p><strong>Customer Name:</strong> {selectedOrder.customer_name}</p>
                <p><strong>Customer Email:</strong> {selectedOrder.customer_email}</p>
                <p><strong>Customer Phone:</strong> {selectedOrder.customer_phone}</p>
                <p><strong>Order Date:</strong> {selectedOrder.order_date}</p>
                <p><strong>Order Status:</strong> {selectedOrder.order_status === 'Completed' ? 'Ready to Ship ✅' : selectedOrder.order_status}</p>
                <p>
                  <strong>Prescription Status:</strong>{" "}
                  {selectedOrder.prescription_status
                    ? selectedOrder.prescription_status
                    : "Not Required"}
                </p>
              </div>
              <div>
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

                {/* Insurance Section */}
                <div className=" flex justify-between items-center">
                  <p>
                    <strong>Insurance Recieved :</strong>{" "}
                    {selectedOrder.insurance_pdf
                      ? selectedOrder.insurance_company
                      : "No"}
                  </p>
                  {selectedOrder.insurance_pdf && (
                    <div className="mt-2">
                      <a
                        href={selectedOrder.insurance_pdf}
                        download
                        className="bg-customBlue text-white px-4 py-2 rounded hover:bg-customPink transition duration-200"
                      >
                        Download
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Items Table */}
            <h4 className="text-lg font-bold mt-6">Items</h4>
            <div className="overflow-x-auto max-h-60">
              <table className="min-w-full bg-white border border-gray-300">
                <thead className="bg-gray-100 sticky top-0">
                  <tr>
                    <th className="px-4 py-2 text-left border">S.No</th>
                    <th className="px-4 py-2 text-left border">Image</th>
                    <th className="px-4 py-2 text-left border">Product Name</th>
                    <th className="px-4 py-2 text-left border">Quantity</th>
                    <th className="px-4 py-2 text-left border">Price</th>
                    <th className="px-4 py-2 text-left border">Total</th>
                    <th className="px-4 py-2 text-left border">Prescription</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedOrder.items.map((item, index) => (
                    <tr key={index} className="border-t">
                      <td className="px-4 py-2 border text-center">{index + 1}</td>
                      <td className="px-4 py-2 border">
                        <img
                          src={item.image}
                          alt={item.product_name}
                          className="w-16 h-16 object-cover rounded-md"
                        />
                      </td>
                      <td className="px-4 py-2 border">{item.product_name}</td>
                      <td className="px-4 py-2 border text-center">{item.quantity}</td>
                      <td className="px-4 py-2 border text-left">${item.price}</td>
                      <td className="px-4 py-2 border text-left">
                        ${(item.price * item.quantity).toFixed(2)}
                      </td>
                      <td className="px-4 py-1 border text-center">
                        {item.prescription_required ? (
                          item.prescription_file ? (
                            <div className="flex flex-col items-center space-y-2">
                              <p className="text-gray-600 text-sm">
                                {item.prescription_file
                                  .split("/")
                                  .pop()
                                  .slice(0, 12)}
                                ...
                              </p>
                              <a
                                href={item.prescription_file}
                                download
                                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-200"
                              >
                                View
                              </a>
                            </div>
                          ) : (
                            <span className="text-red-500">
                              Required
                            </span>
                          )
                        ) : (
                          "Not Required"
                        )}
                      </td>

                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Close Button */}
            <div className="text-right mt-6">
              <button
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                onClick={closeModal}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}


    </div>
  );
};

export default Orders;
