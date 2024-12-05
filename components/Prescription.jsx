"use client";
import { useState, useEffect } from "react";

export default function Prescription({ initialOrders, error }) {
  const [status, setStatus] = useState("Pending");
  const [prescriptionFilter, setPrescriptionFilter] = useState("both");
  const [orderDetails, setOrderDetails] = useState(null);
  const [orders, setOrders] = useState(initialOrders);
  const [filteredOrders, setFilteredOrders] = useState(initialOrders);
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
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [infoRequestedOrders, setInfoRequestedOrders] = useState({});

  const handleViewMore = (order) => {
    setOrderDetails(order);
    setHighlightedOrderId(order.id);
    setShowOrderModal(true);
  };

  const approvalHandler = async (id) => {
    await fetch(`/api/order/${id}`, {
      method: "PUT",
      body: JSON.stringify({ status: "Completed" }),
    });
    const updatedOrders = orders.map((order) =>
      order.id === id ? { ...order, status: "Completed" } : order
    );
    setOrders(updatedOrders);
    setOrderDetails(null);
    setShowApproveModal(false);
    setShowOrderModal(false);
  };

  const cancelHandler = async (id, remark, email, status) => {
    await fetch(`/api/order/${id}`, {
      method: "PUT",
      body: JSON.stringify({
        status,
        remark,
        email,
      }),
    });
    const updatedOrders = orders.map((order) =>
      order.id === selectedOrder.id
        ? {
          ...order,
          status: "Cancelled",
          cancellationDetails: {
            reason: emailDetails.reason,
            message: emailDetails.message,
          },
        }
        : order
    );
    setOrders(updatedOrders);
    setInfoRequestedOrders((prev) => ({
      ...prev,
      [selectedOrder.id]: emailDetails.message,
    }));
    setShowCancelModal(false);
    setOrderDetails(null);
    setShowRequestInfoModal(false);
  };

  const handleCancel = (order) => {
    setSelectedOrder(order);
    setEmailDetails({
      to: order.customer_email,
      message: "",
      reason: "unable_to_read_order",
    });
    setShowCancelModal(true);
    setShowOrderModal(false);
  };

  const filterHandler = async (ostat, pstat) => {
    let result;
    if (pstat != "both") {
      const res = await fetch(`/api/prescription?ostat=${ostat}&pstat=${prescriptionFilter == "yes" ? "Received" : "Pending"}`);
      result = await res.json()
    }
    else {
      const res = await fetch(`/api/prescription?ostat=${ostat}`);
      result = await res.json()
    }
    result.Count > 0 ? setFilteredOrders(result.Items) : setFilteredOrders([]);
    setPrescriptionFilter(pstat);
    setStatus(ostat);
    setOrderDetails(null);
    setHighlightedOrderId(null);
  };

  return (
    <div className="p-4 bg-[#f4f6f8] h-full">
      <h1 className="text-2xl font-bold mb-4 text-center">
        Prescription Approvals
      </h1>

      {error ? (
        <p>Error loading orders: {error}</p>
      ) : (
        <>
          <div className="flex flex-col sm:flex-row justify-between mb-4 items-center">
            <input
              type="text"
              className="border border-gray-300 rounded px-4 py-2 w-full sm:w-80"
              placeholder="Search by Order ID or Customer Email"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />

            <div className="flex space-x-4">
              <div className="flex space-x-2">
                <button
                  className={`px-4 py-2 ${status === "Pending"
                      ? "bg-pink-500 text-white"
                      : "bg-gray-200"
                    } rounded`}
                  onClick={() => filterHandler("Pending", prescriptionFilter)}
                >
                  Pending
                </button>
                <button
                  className={`px-4 py-2 ${status === "Completed"
                      ? "bg-pink-500 text-white"
                      : "bg-gray-200"
                    } rounded`}
                  onClick={() => filterHandler("Completed", prescriptionFilter)}
                >
                  Completed
                </button>
                <button
                  className={`px-4 py-2 ${status === "Cancelled"
                      ? "bg-pink-500 text-white"
                      : "bg-gray-200"
                    } rounded`}
                  onClick={() => filterHandler("Cancelled", prescriptionFilter)}
                >
                  Cancelled
                </button>
              </div>

              <div className="flex space-x-4">
                <label>
                  <select
                    name="prescriptionFilter"
                    value={prescriptionFilter}
                    onChange={(e) => filterHandler(status, e.target.value)}
                    className="border p-2 rounded"
                  >
                    <option value="both">All Orders Prescription only</option>
                    <option value="yes">Prescription Received</option>
                    <option value="no">Prescription Pending</option>
                  </select>
                </label>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto max-h-72 mt-4 text-sm ">
            <div className="w-full overflow-auto">
              <table className="bg-white border border-gray-200 shadow-md rounded w-full">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="py-2 px-4 text-center">Order ID</th>
                    <th className="py-2 px-4 text-center">Customer Name</th>
                    <th className="py-2 px-4 text-center">Customer Email</th>
                    <th className="py-2 px-4 text-center">Phone Number</th>
                    <th className="py-2 px-4 text-center">Order Date</th>
                    <th className="py-2 px-4 text-center">Order Value</th>
                    <th className="py-2 px-4 text-center">Prescription Status</th>
                    <th className="py-2 px-4 text-center">Detail</th>
                    {status === "Pending" && (
                      <th className="py-2 px-4 text-center">Action</th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.length > 0 ? (
                    filteredOrders.map((order) => (
                      <tr
                        key={order.id}
                        className={`border-b ${order.id === highlightedOrderId ? "bg-cyan-200/80" : ""
                          }`}
                      >
                        <td className="py-2 px-4 text-center">{order.id}</td>
                        <td className="py-2 px-4 text-center">
                          {order.customer_name}
                        </td>
                        <td className="py-2 px-4 text-center">
                          {order.customer_email}
                        </td>
                        <td className="py-2 px-4 text-center">
                          {order.customer_phone}
                        </td>
                        <td className="py-2 px-4 text-center">
                          {order.order_date}
                        </td>
                        <td className="py-2 px-4 text-center">
                          $ {order.total_amount}/-
                        </td>
                        <td className="py-2 px-4 text-center">
                          {order.prescription_status === "Pending"
                            ? "Pending"
                            : "Received"}
                        </td>
                        <td className="py-2 px-4 text-center">
                          <button
                            className="bg-pink-500 text-white px-3 py-1 rounded"
                            onClick={() => handleViewMore(order)}
                          >
                            Review
                          </button>
                        </td>
                        {status === "Pending" && (
                          <td className="py-2 px-4 flex justify-center space-x-2">
                            <button
                              className="bg-green-500 text-white px-3 py-1 rounded"
                              onClick={() => {
                                setSelectedOrder(order);
                                setShowApproveModal(true);
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
                    ))
                  ) : (
                    <tr>
                      <td colSpan="9" className="text-center py-4">
                        No orders found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>


          {showOrderModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
              <div className="bg-white p-6 rounded shadow-md w-full max-w-7xl">
                <h2 className="text-xl font-bold mb-2 border-b-2 border-gray-300">
                  Order Details
                </h2>
                {orderDetails && (
                  <>
                    <div className="mb-4">
                      <div className="flex">
                        <div className="mr-8">
                          <p>
                            <strong>Order ID:</strong> {orderDetails.id}
                          </p>
                          <p>
                            <strong>Customer Name:</strong>{" "}
                            {orderDetails.customer_name}
                          </p>
                          <p>
                            <strong>Customer Email:</strong>{" "}
                            {orderDetails.customer_email}
                          </p>
                          <p>
                            <strong>Phone Number:</strong>{" "}
                            {orderDetails.customer_phone}
                          </p>
                          <p>
                            <strong>Order Date:</strong>{" "}
                            {orderDetails.order_date}
                          </p>
                        </div>
                        <div>
                          <p>
                            <strong>Billing Address:</strong>{" "}
                            {`${orderDetails.billing_address.line1}, ${orderDetails.billing_address.city}, ${orderDetails.billing_address.state}, ${orderDetails.billing_address.postal_code}, ${orderDetails.billing_address.country}`}
                          </p>
                          <p>
                            <strong>Shipping Address:</strong>{" "}
                            {`${orderDetails.shipping_address.line1}, ${orderDetails.shipping_address.city}, ${orderDetails.shipping_address.state}, ${orderDetails.shipping_address.postal_code}, ${orderDetails.shipping_address.country}`}
                          </p>
                          <p>
                            <strong>Insurance Received:</strong>{" "}
                            {orderDetails.insurance_pdf ? "Yes" : "No"}
                          </p>
                          {orderDetails.insurance_pdf && (
                            <div>
                              <strong>Insurance PDF:</strong>{" "}
                              <button className="bg-pink-500 text-white px-3 py-1 rounded">
                                View Insurance
                              </button>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Show Cancellation Details if Order is Cancelled */}
                      {orderDetails.status === "Cancelled" &&
                        orderDetails.cancellationDetails && (
                          <div className="mt-4 bg-red-100 p-4 rounded">
                            <h3 className="text-lg font-bold text-red-600 mb-2">
                              Cancellation Details
                            </h3>
                            <p>
                              <strong>Reason:</strong>{" "}
                              {orderDetails.cancellationDetails.reason}
                            </p>
                            <p>
                              <strong>Message:</strong>{" "}
                              {orderDetails.cancellationDetails.message}
                            </p>
                          </div>
                        )}

                      {/* Show Requested Info if Set */}
                      {infoRequestedOrders[orderDetails.id] && (
                        <div className="mt-4 bg-yellow-100 p-4 rounded">
                          <h3 className="text-lg font-bold text-yellow-600 mb-2">
                            Requested Information
                          </h3>
                          <p>
                            <strong>Message:</strong>{" "}
                            {infoRequestedOrders[orderDetails.id]}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Product Details Section */}
                    <div className="border-t-2 border-gray-300 mt-4">
                      <h3 className="text-lg font-bold mb-2">
                        Product Details
                      </h3>
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
                            </tr>
                          </thead>
                          <tbody>
                            {orderDetails.items.map((item, index) => (
                              <tr key={index} className="border-t">
                                <td className="py-2 px-4 text-center">
                                  {index + 1}
                                </td>
                                <td className="py-2 px-4 text-center">
                                  {item.product_id}
                                </td>
                                <td className="py-2 px-4 text-center">
                                  <img
                                    src={item.image}
                                    alt={item.product_name}
                                    className="h-12 w-12 object-cover"
                                  />
                                </td>
                                <td className="py-2 px-4 text-center">
                                  {item.product_name}
                                </td>
                                <td className="py-2 px-4 text-center line-clamp-2">
                                  {item.description}
                                </td>
                                <td className="py-2 px-4 text-center">
                                  X{item.quantity}
                                </td>
                                <td className="py-2 px-4 text-center">
                                  ${item.price}/-
                                </td>
                                <td className="py-2 px-4 text-center">
                                  {item.prescription_required ? "Yes" : "No"}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    <div className="mt-4 flex justify-between">
                      <button
                        className="bg-gray-500 text-white px-4 py-2 rounded"
                        onClick={() => setShowOrderModal(false)}
                      >
                        Close
                      </button>
                      {orderDetails.order_status === "Pending" &&
                        // !infoRequestedOrders[orderDetails.id] && 
                        (
                          <div className="flex space-x-4">
                            <button
                              className="bg-green-500 text-white px-4 py-2 rounded"
                              onClick={() => approvalHandler(orderDetails.id)}
                            >
                              Approve
                            </button>
                            <button
                              className="bg-yellow-500 text-white px-4 py-2 rounded"
                              onClick={() => setShowRequestInfoModal(true)}
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
                    onClick={() => approvalHandler(selectedOrder.id)}
                  >
                    Approve
                  </button>
                </div>
              </div>
            </div>
          )}

          {showCancelModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
              <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
                <h2 className="text-xl font-bold mb-4">Cancel Order</h2>
                <label className="block mb-2">
                  <span className="font-bold">To:</span>
                  <input
                    type="email"
                    value={emailDetails.to}
                    disabled
                    onChange={(e) =>
                      setEmailDetails((prev) => ({
                        ...prev,
                        to: e.target.value,
                      }))
                    }
                    className="border border-gray-300 rounded w-full px-2 py-1"
                  />
                </label>
                <label className="block mb-2">
                  <span className="font-bold">Reason for Cancellation:</span>
                  <select
                    value={emailDetails.reason}
                    onChange={(e) =>
                      setEmailDetails((prev) => ({
                        ...prev,
                        reason: e.target.value,
                      }))
                    }
                    className="border border-gray-300 rounded w-full px-2 py-1"
                  >
                    <option value="unable_to_read_order">
                      Unable to read order
                    </option>
                    <option value="prescription_not_received">
                      Prescription not received
                    </option>
                    <option value="more_info_required">
                      More information required
                    </option>
                  </select>
                </label>
                <label className="block mb-4">
                  <span className="font-bold">Message:</span>
                  <textarea
                    value={emailDetails.message}
                    onChange={(e) =>
                      setEmailDetails((prev) => ({
                        ...prev,
                        message: e.target.value,
                      }))
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
                    onClick={() =>
                      cancelHandler(
                        selectedOrder.id,
                        { sub: emailDetails.reason, msg: emailDetails.message },
                        emailDetails.to,
                        "Cancelled"
                      )
                    }
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
                <h2 className="text-xl font-bold mb-4">
                  Request More Information
                </h2>
                <label className="block mb-2">
                  <span className="font-bold">To:</span>
                  <input
                    type="email"
                    value={orderDetails.customer_email}
                    readOnly
                    className="border border-gray-300 rounded w-full px-2 py-1"
                  />
                </label>
                <label className="block mb-4">
                  <span className="font-bold">Message:</span>
                  <textarea
                    value={emailDetails.message}
                    onChange={(e) =>
                      setEmailDetails((prev) => ({
                        ...prev,
                        message: e.target.value,
                      }))
                    }
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
                    onClick={() => {
                      setInfoRequestedOrders((prev) => ({
                        ...prev,
                        [orderDetails.id]: emailDetails.message,
                      }));
                      setShowRequestInfoModal(false);
                    }}
                  >
                    Send
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
