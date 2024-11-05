"use client";
import { useState } from "react";

const initialOrders = [
  {
    id: 99582412,
    customerName: "Shivam Awasthi",
    email: "shivamawasthi@gmail.com",
    phoneNumber: "9876543210",
    date: "12/Sep/2023",
    price: "25,999",
    status: "pending",
    prescriptionReceived: true,
    insuranceReceived: true,
    insuranceCompany: "State Farm",
    insuranceFile: "insurance_file.pdf",
    billingAddress: "123 Main St, Cityville, USA",
    shippingAddress: "456 Elm St, Cityville, USA",
    details: [
      {
        productId: 1446529,
        productName: "Hospital Bed",
        price: 2520,
        quantity: 2,
        prescriptionRequired: true,
        prescriptionFile: "hospital_bed_prescription.pdf",
        productImage: "https://res.cloudinary.com/dduiqwdtr/image/upload/v1722071148/61NYFV%2BrKRL.jpg",
        productDescription: "A high-quality hospital bed.",
      },
      {
        productId: 1446556,
        productName: "Pulse Oximeter",
        price: 1200,
        quantity: 3,
        prescriptionRequired: true,
        prescriptionFile: "oximeter_prescription.pdf",
        productImage: "https://res.cloudinary.com/dduiqwdtr/image/upload/v1722071126/6189MAMYiqL.jpg",
        productDescription: "Measures oxygen levels.",
      },
      {
        productId: 4446524,
        productName: "Thermometer",
        price: 130,
        quantity: 1,
        prescriptionRequired: true,
        prescriptionFile: "Thermometer_prescription.pdf",
        productImage: "https://res.cloudinary.com/dduiqwdtr/image/upload/v1722071133/71ycPEEoEnL.jpg",
        productDescription: "Digital thermometer for accurate measurements.",
      },
      {
        productId: 5446545,
        productName: "Band Aid",
        price: 12,
        quantity: 7,
        prescriptionRequired: true,
        prescriptionFile: "bandAid_prescription.pdf",
        productImage: "https://rukminim2.flixcart.com/image/850/1000/js4yljk0/adhesive-band-aid/g/4/w/band-aid-tape-water-proof-100-strips-100-pmw-original-imafdqnkfzyntggs.jpeg?q=20&crop=false",
        productDescription: "Simple band aid for wounds.",
      },
      {
        productId: 2446567,
        productName: "CPAP Machines",
        price: 2300,
        quantity: 5,
        prescriptionRequired: false,
        productImage: "https://www.cpapmiami.com/cdn/shop/products/AirMini-0_029dc1e1-ba36-4371-9e63-5cea669869f0.png?v=1699379298&width=600",
        productDescription: "CPAP machines for respiratory support.",
      },
      {
        productId: 1446598,
        productName: "Syringe",
        price: 15,
        quantity: 20,
        prescriptionRequired: true,
        prescriptionFile: "syringe_prescription.pdf",
        productImage: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ0GEnCANfhAyGbYuKnFvYcW_OrYuDGUJE1adLo0JdbHh3E9YxcWlJnP__FUpJsw4yYDp8&usqp=CAU",
        productDescription: "Disposable syringes for injections.",
      },
    ],
  },
  {
    id: 99582235,
    customerName: "Akash Sharma",
    email: "akkiwebs11843@gmail.com",
    phoneNumber: "9876543210",
    date: "12/Sep/2023",
    price: "25,999",
    status: "pending",
    prescriptionReceived: false,
    insuranceReceived: false,
    insuranceCompany: null,
    billingAddress: "123 Main St, Cityville, USA",
    shippingAddress: "456 Elm St, Cityville, USA",
    details: [
      {
        productId: 1446529,
        productName: "Hospital Bed",
        price: 2520,
        quantity: 2,
        prescriptionRequired: true,
        productImage: "https://res.cloudinary.com/dduiqwdtr/image/upload/v1722071148/61NYFV%2BrKRL.jpg",
        productDescription: "A high-quality hospital bed.",
      },
      {
        productId: 1446556,
        productName: "Pulse Oximeter",
        price: 1200,
        quantity: 3,
        prescriptionRequired: true,
        productImage: "https://res.cloudinary.com/dduiqwdtr/image/upload/v1722071126/6189MAMYiqL.jpg",
        productDescription: "Measures oxygen levels.",
      },
      {
        productId: 1445689,
        productName: "Patient Monitor",
        price: 4000,
        quantity: 5,
        prescriptionRequired: false,
        productImage: "https://res.cloudinary.com/dduiqwdtr/image/upload/v1722071168/resparray-patient-monitor-alternate-display-right-prod.jpg",
        productDescription: "Used To get a visual representation of heart beat's",
      },
    ],
  },
  {
    id: 12548365,
    customerName: "Akshay Bairwa",
    email: "bairwaaks325@gamil.com",
    phoneNumber: "9856321456",
    date: "11/Sep/2023",
    price: "25,231",
    status: "pending",
    prescriptionReceived: true,
    insuranceReceived: true,
    insuranceCompany: "Liberty Mutual",
    insuranceFile: "insurance_bed_prescription.pdf",
    billingAddress: "789 Oak St, Townsville, USA",
    shippingAddress: "321 Pine St, Townsville, USA",
    details: [
      {
        productId: 1446529,
        productName: "Hospital Bed",
        price: 2520,
        quantity: 2,
        prescriptionRequired: true,
        prescriptionFile: "bed_prescription.pdf",
        productImage: "https://res.cloudinary.com/dduiqwdtr/image/upload/v1722071148/61NYFV%2BrKRL.jpg",
        productDescription: "A high-quality hospital bed.",
      },
    ],
  },
];

export default function Prescription() {
  const [status, setStatus] = useState("pending");
  const [orderDetails, setOrderDetails] = useState(null);
  const [orders, setOrders] = useState(initialOrders);
  const [searchQuery, setSearchQuery] = useState("");
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [highlightedOrderId, setHighlightedOrderId] = useState(null);
  const [showRequestInfoModal, setShowRequestInfoModal] = useState(false);
  const [emailDetails, setEmailDetails] = useState({
    to: "",
    message: "",
    reason: "unable_to_read_order",
  });
  const [prescriptionFilter, setPrescriptionFilter] = useState("both");
  const [showOrderModal, setShowOrderModal] = useState(false);

  const handleStatusChange = (newStatus) => {
    setStatus(newStatus);
    setOrderDetails(null);
    setHighlightedOrderId(null);
  };


  const handleViewMore = (order) => {
    setOrderDetails(order);
    setHighlightedOrderId(order.id);
    setShowOrderModal(true);
  };

  const handleApproveCancel = (id, newStatus) => {
    const updatedOrders = orders.map((order) =>
      order.id === id ? { ...order, status: newStatus } : order
    );
    setOrders(updatedOrders);
    setOrderDetails(null);
    setShowApproveModal(false);
    setShowOrderModal(false);
  };

  const handleCancel = (order) => {
    setSelectedOrder(order);
    setEmailDetails({ to: order.email, message: "", reason: "unable_to_read_order" });
    setShowCancelModal(true);
    setShowOrderModal(false);
  };

  const handleSendEmail = () => {
    const updatedOrders = orders.map((order) =>
      order.id === selectedOrder.id
        ? {
          ...order,
          status: "cancelled",
          cancellationDetails: {
            reason: emailDetails.reason,
            message: emailDetails.message,
          },
        }
        : order
    );
    console.log("Email sent to:", emailDetails.to);
    console.log("Message:", emailDetails.message);

    setOrders(updatedOrders);
    setShowCancelModal(false);
    setOrderDetails(null);
    setShowRequestInfoModal(false);
  };

  const filteredOrders = orders.filter(
    (order) =>
      order.status === status &&
      (order.id.toString().includes(searchQuery) ||
        order.email.toLowerCase().includes(searchQuery.toLowerCase())) &&
      (prescriptionFilter === "both" ||
        (prescriptionFilter === "yes" && order.prescriptionReceived) ||
        (prescriptionFilter === "no" && !order.prescriptionReceived))
  );

  return (
    <div className="container p-4 bg-[#f4f6f8] h-full max-w-full">
      <h1 className="text-2xl font-bold mb-4 text-center">Prescription Approvals</h1>

      <div className="flex flex-col sm:flex-row justify-between mb-4 items-center">
        {/* Search Bar */}
        <div className="flex justify-center mb-4 sm:mb-0">
          <input
            type="text"
            className="border border-gray-300 rounded px-4 py-2 w-full sm:w-80"
            placeholder="Search by Order ID or Customer Email"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Prescription Filter Toggle */}
        <div className="flex space-x-4">
          <label>
            <input
              type="radio"
              name="prescriptionFilter"
              value="both"
              checked={prescriptionFilter === "both"}
              onChange={(e) => setPrescriptionFilter(e.target.value)}
            /> Both Prescriptions
          </label>
          <label>
            <input
              type="radio"
              name="prescriptionFilter"
              value="yes"
              checked={prescriptionFilter === "yes"}
              onChange={(e) => setPrescriptionFilter(e.target.value)}
            /> Prescription Received
          </label>
          <label>
            <input
              type="radio"
              name="prescriptionFilter"
              value="no"
              checked={prescriptionFilter === "no"}
              onChange={(e) => setPrescriptionFilter(e.target.value)}
            /> Prescription Pending
          </label>
        </div>


        {/* Status Filters */}
        <div className="flex justify-center space-x-2 sm:space-x-4">
          <button
            className={`px-4 py-2 ${status === "pending" ? "bg-pink-500 text-white" : "bg-gray-200"} rounded`}
            onClick={() => handleStatusChange("pending")}
          >
            Pending
          </button>
          <button
            className={`px-4 py-2 ${status === "approved" ? "bg-pink-500 text-white" : "bg-gray-200"} rounded`}
            onClick={() => handleStatusChange("approved")}
          >
            Approved
          </button>
          <button
            className={`px-4 py-2 ${status === "cancelled" ? "bg-pink-500 text-white" : "bg-gray-200"} rounded`}
            onClick={() => handleStatusChange("cancelled")}
          >
            Cancelled
          </button>
        </div>

      </div>

      {/* Orders Table */}
      <div className="overflow-x-auto max-h-72">
        <table className="min-w-full bg-white border border-gray-200 shadow-md rounded">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-2  text-center">Order ID</th>
              <th className="py-2  text-center">Customer Name</th>
              <th className="py-2  text-center">Customer Email</th>
              <th className="py-2  text-center">Phone Number</th>
              <th className="py-2  text-center">Order Date</th>
              <th className="py-2  text-center">Order Value</th>
              <th className="py-2  text-center">Prescription Status</th>
              <th className="py-2  text-center">Detail</th>
              {status === "pending" && <th className="py-2 px-4 text-left">Action</th>}
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order) => (
              <tr
                key={order.id}
                className={`border-b ${order.id === highlightedOrderId ? "bg-cyan-200/80" : ""}`}
              >
                <td className="py-2  text-center">{order.id}</td>
                <td className="py-2  text-center">{order.customerName}</td>
                <td className="py-2  text-center">{order.email}</td>
                <td className="py-2  text-center">{order.phoneNumber}</td>
                <td className="py-2  text-center">{order.date}</td>
                <td className="py-2  text-center">$ {order.price}/-</td>
                <td className="py-2  text-center">{order.prescriptionReceived ? "Recieved" : "Pending"}</td>
                <td className="py-2  text-center">
                  <button
                    className="bg-pink-500 text-white px-3 py-1 rounded"
                    onClick={() => handleViewMore(order)}
                  >
                    Review Order
                  </button>
                </td>
                {status === "pending" && (
                  <td className="py-2 px-4 flex space-x-2">
                    <button
                      className="bg-green-500 text-white px-3 py-1 rounded"
                      onClick={() => {
                        setSelectedOrder(order);
                        setShowApproveModal(true);
                        // handleApproveCancel(orderDetails ? orderDetails.id : selectedOrder.id, "approved");

                      }}
                    >
                      Approve
                    </button>
                    <button
                      className="bg-red-500 text-white px-3 py-1 rounded"
                      onClick={() => handleCancel(order)}
                    >
                      Cancel
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {showOrderModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded shadow-md w-full max-w-7xl">
            {/* Modal Header */}
            <h2 className="text-xl font-bold mb-2 border-b-2 border-gray-300">Order Details</h2>

            {orderDetails && (
              <>
                <div className="mb-4">
                  {/* Order Info */}
                  <div className="flex">
                    <div className="mr-8">
                      <p><strong>Order ID:</strong> {orderDetails.id}</p>
                      <p><strong>Customer Name:</strong> {orderDetails.customerName}</p>
                      <p><strong>Customer Email:</strong> {orderDetails.email}</p>
                      <p><strong>Phone Number:</strong> {orderDetails.phoneNumber}</p>
                      <p><strong>Order Date:</strong> {orderDetails.date}</p>
                    </div>

                    {/* Billing Address, Shipping Address, and Insurance Details */}
                    <div>
                      <p><strong>Billing Address:</strong> {orderDetails.billingAddress}</p>
                      <p><strong>Shipping Address:</strong> {orderDetails.shippingAddress}</p>
                      <p><strong>Insurance Received:</strong> {orderDetails.insuranceReceived ? "Yes" : "No"}</p>
                      {orderDetails.insuranceReceived && (
                        <p><strong>Insurance Company:</strong> {orderDetails.insuranceCompany}</p>
                      )}


                      {/* Insurance File if Available */}
                      {orderDetails.insuranceFile && (
                        <div>
                          <strong>Insurance File:</strong>{" "}
                          <button className="bg-pink-500 text-white px-3 py-1 rounded">
                            {orderDetails.insuranceFile}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Show Cancellation Details if Order is Cancelled */}
                  {orderDetails.status === "cancelled" && orderDetails.cancellationDetails && (
                    <div className="mt-4 bg-red-100 p-4 rounded">
                      <h3 className="text-lg font-bold text-red-600 mb-2">Cancellation Details</h3>
                      <p><strong>Reason:</strong> {orderDetails.cancellationDetails.reason}</p>
                      <p><strong>Message:</strong> {orderDetails.cancellationDetails.message}</p>
                    </div>
                  )}
                  {/* Show Request more information Details if Admin require more information about the User prescription
                  {orderDetails.status === "pending" && orderDetails.cancellationDetails && (
                    <div className="mt-4 bg-red-100 p-4 rounded">
                      <h3 className="text-lg font-bold text-red-600 mb-2">Cancellation Details</h3>
                      <p><strong>Reason:</strong> {orderDetails.cancellationDetails.reason}</p>
                      <p><strong>Message:</strong> {orderDetails.cancellationDetails.message}</p>
                    </div>
                  )} */}
                </div>

                {/* Product Details Section */}
                <div className="border-t-2 border-gray-300 mt-4">
                  <h3 className="text-lg font-bold mb-2">Product Details</h3>

                  {/* Scrollable Product Details Table */}
                  <div className="overflow-y-auto max-h-60">
                    <table className="min-w-full bg-white table-auto">
                      <thead>
                        <tr>
                          <th className="py-2 px-4 w-10">S.No</th>
                          <th className="py-2 px-4 w-20">Prod ID</th>
                          <th className="py-2 px-4 w-24">Prod Image</th>
                          <th className="py-2 px-4 w-32">Prod Name</th>
                          <th className="py-2 px-4 w-48">Prod Details</th>
                          <th className="py-2 px-4 w-12">Qty</th>
                          <th className="py-2 px-4 w-28">Item Value</th>
                          <th className="py-2 px-4 w-20">Prescription</th>
                          <th className="py-2 px-4 w-20">Download</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orderDetails.details.map((item, index) => (
                          <tr key={index} className="border-t">
                            <td className="py-2 px-4 text-center">{index + 1}</td>
                            <td className="py-2 px-4 text-center">{item.productId}</td>
                            <td className="py-2 px-4 text-center">
                              <img
                                src={`${item.productImage}`}
                                alt={item.productName}
                                className="h-12 w-12 object-cover"
                              />
                            </td>
                            <td className="py-2 px-4 text-center">{item.productName}</td>
                            <td className="py-2 px-4 text-center">
                              {item.productDescription ? item.productDescription : "N/A"}
                            </td>
                            <td className="py-2 px-4 text-center">X{item.quantity}</td>
                            <td className="py-2 px-4 text-center">$ {item.price}/-</td>
                            <td className="py-2 px-4 text-center">
                              {item.prescriptionRequired ? "Yes" : "No"}
                            </td>
                            <td className="py-2 px-4 text-center">
                              {item.prescriptionRequired && item.prescriptionFile ? (
                                <button className="bg-pink-500 text-white px-3 py-1 rounded">
                                  {item.prescriptionFile}
                                </button>
                              ) : (
                                "N/A"
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Footer Buttons */}
                <div className="mt-4 flex justify-between">
                  <button
                    className="bg-gray-500 text-white px-4 py-2 rounded"
                    onClick={() => setShowOrderModal(false)}
                  >
                    Close
                  </button>


                  {/* Conditionally render buttons only if order status is "pending" */}
                  {orderDetails.status === "pending" && (
                    <div className="flex space-x-4">
                      <button
                        className="bg-green-500 text-white px-4 py-2 rounded"
                        onClick={() => handleApproveCancel(orderDetails.id, "approved")}
                      >
                        Approve
                      </button>
                      <button
                        className="bg-yellow-500 text-white px-4 py-2 rounded"
                        onClick={() => setShowRequestInfoModal(true)} // Open the Request Info modal
                      >
                        Request More Info
                      </button>
                      <button
                        className="bg-red-500 text-white px-4 py-2 rounded"
                        onClick={() => handleCancel(orderDetails)}
                      >
                        Cancel Order
                      </button>
                    </div>
                  )}

                </div>
              </>
            )}
          </div>
        </div>
      )}


      {/* Approve Modal */}
      {showApproveModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Approve Order</h2>
            <p>Are you sure you want to approve this order?</p>
            <div className="flex justify-between mt-4">
              <button
                className="bg-gray-500 text-white px-4 py-2 rounded"
                onClick={() => setShowApproveModal(false)}
              >
                Cancel
              </button>
              <button
                className="bg-green-500 text-white px-4 py-2 rounded"
                onClick={() => handleApproveCancel(selectedOrder.id, "approved")}
              >
                Approve
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Cancel Order</h2>
            <label className="block mb-2">
              <span className="font-bold">To:</span>
              <input
                type="email"
                value={emailDetails.to}
                onChange={(e) =>
                  setEmailDetails((prev) => ({ ...prev, to: e.target.value }))
                }
                className="border border-gray-300 rounded w-full px-2 py-1"
              />
            </label>
            <label className="block mb-2">
              <span className="font-bold">Reason for Cancellation:</span>
              <select
                value={emailDetails.reason}
                onChange={(e) => setEmailDetails((prev) => ({ ...prev, reason: e.target.value }))}
                className="border border-gray-300 rounded w-full px-2 py-1"
              >
                <option value="unable_to_read_order">Unable to read order</option>
                <option value="prescription_not_received">Prescription not received</option>
                <option value="more_info_required">More information required</option>
              </select>
            </label>
            <label className="block mb-4">
              <span className="font-bold">Message:</span>
              <textarea
                value={emailDetails.message}
                onChange={(e) =>
                  setEmailDetails((prev) => ({ ...prev, message: e.target.value }))
                }
                className="border border-gray-300 rounded w-full px-2 py-1"
                rows="4"
              />
            </label>
            <div className="flex justify-between">
              <button
                className="bg-gray-500 text-white px-4 py-2 rounded"
                onClick={() => setShowCancelModal(false)}
              >
                Cancel
              </button>
              <button
                className="bg-pink-500 text-white px-4 py-2 rounded"
                onClick={handleSendEmail}
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}

      {showRequestInfoModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Request More Information</h2>
            <label className="block mb-2">
              <span className="font-bold">To:</span>
              <input
                type="email"
                value={orderDetails.email}
                readOnly
                className="border border-gray-300 rounded w-full px-2 py-1"
              />
            </label>
            <label className="block mb-4">
              <span className="font-bold">Message:</span>
              <textarea
                value={emailDetails.message}
                onChange={(e) => setEmailDetails((prev) => ({ ...prev, message: e.target.value }))}
                className="border border-gray-300 rounded w-full px-2 py-1"
                rows="4"
              />
            </label>
            <div className="flex justify-between">
              <button
                className="bg-gray-500 text-white px-4 py-2 rounded"
                onClick={() => setShowRequestInfoModal(false)}
              >
                Cancel
              </button>
              <button
                className="bg-yellow-500 text-white px-4 py-2 rounded"
                onClick={handleSendEmail}
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
