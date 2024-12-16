"use client";
import { useState, useEffect } from "react";

export default function Prescription({ initialOrders, error }) {
  const sortedOrders = [...initialOrders].sort(
    (a, b) => new Date(b.order_date) - new Date(a.order_date)
  );
  const [status, setStatus] = useState("Pending");
  const [prescriptionFilter, setPrescriptionFilter] = useState("both");
  const [orderDetails, setOrderDetails] = useState(null);
  const [orders, setOrders] = useState(sortedOrders);
  const [filteredOrders, setFilteredOrders] = useState(sortedOrders);
  const [searchQuery, setSearchQuery] = useState("");
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [highlightedOrderId, setHighlightedOrderId] = useState(null);
  const [showRequestInfoModal, setShowRequestInfoModal] = useState(false);
  const [showFileUploadModal, setShowFileUploadModal] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [sameFileForAll, setSameFileForAll] = useState(false);
  const [sameFile, setSameFile] = useState(null); // To store the file for all items


  const [emailDetails, setEmailDetails] = useState({
    to: "",
    message: "",
    reason: "unable_to_read_order",
  });
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [infoRequestedOrders, setInfoRequestedOrders] = useState({});
  const uploadPrescriptionForAll = async (orderId, file) => {
    const formData = new FormData();
    formData.append("prescription_file", file);

    // API call to upload file
    const response = await fetch(`/api/order/${orderId}/upload-prescription`, {
      method: "POST",
      body: formData,
    });

    if (response.ok) {
      const { fileUrl } = await response.json();

      // Update orders state with the new prescription file for all items
      const updatedOrders = orders.map((order) => {
        if (order.id === orderId) {
          const updatedItems = order.items.map((item) =>
            item.prescription_required
              ? { ...item, prescription_file: fileUrl }
              : item
          );
          return { ...order, items: updatedItems, prescription_status: "Received" };
        }
        return order;
      });

      setOrders(updatedOrders);
      setFilteredOrders(updatedOrders);
    } else {
      alert("Failed to upload prescription. Please try again.");
    }
  };



  const handleViewMore = (order) => {
    setOrderDetails(order);
    setHighlightedOrderId(order.id);
    setShowOrderModal(true);
  };
  console.log("Order Status:", orderDetails);
  console.log("Info Requested:", infoRequestedOrders);

  const approvalHandler = async (id) => {
    const selectedOrder = orders.find((order) => order.id === id);

    if (selectedOrder.prescription_status !== "Received") {
      alert("You cannot approve the order until the prescription is uploaded and status is changed to 'Received'.");
      return;
    }

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
    <div className="p-4 bg-[#f4f6f8] h-[89vh]">
      <h1 className="text-center text-4xl font-bold text-customBlue mb-6 ">
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

          <div className="overflow-x-auto  mt-4 text-sm ">
            <div className="w-full overflow-auto max-h-96">
              <table className="bg-white border border-gray-300 shadow-md w-full">
                <thead className="sticky top-0">
                  <tr className="bg-gray-200 ">
                    <th className="py-2 px-4 text-center border">Order ID</th>
                    {/* <th className="py-2 px-4 text-center">Customer Name</th> */}
                    <th className="py-2 px-4 text-center border">Customer Email</th>
                    <th className="py-2 px-4 text-center border">Phone Number</th>
                    <th className="py-2 px-4 text-center border">Order Date</th>
                    <th className="py-2 px-4 text-center border">Order Value</th>
                    <th className="py-2 px-4 text-center border">Prescription Status</th>
                    <th className="py-2 px-4 text-center border">Detail</th>
                    {status === "Pending" && (
                      <th className="py-2 px-4 text-center border ">Action</th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.length > 0 ? (
                    filteredOrders.map((order) => (
                      <tr
                        key={order.id}
                        className={`cursor-pointer border-b ${order.id === highlightedOrderId ? "bg-cyan-200/80" : ""
                          }`}
                      >
                        <td className="py-2 px-4 text-center border">{order.id}</td>
                        {/* <td className="py-2 px-4 text-center">
                          {order.customer_name}
                        </td> */}
                        <td className="py-2 px-4 text-left border">
                          {order.customer_email}
                        </td>
                        <td className="py-2 px-4 text-left border">
                          {order.customer_phone}
                        </td>
                        <td className="py-2 px-4 text-left border">
                          {order.order_date}
                        </td>
                        <td className="py-2 px-4 text-left border">
                          $ {order.total_amount}
                        </td>
                        <td className="py-2 px-4 text-center border">
                          {order.prescription_status === "Pending" ? (
                            <div className="relative">
                              <select
                                className="border rounded"
                                onChange={(e) => {
                                  if (e.target.value === "Received") {
                                    setSelectedOrder(order);
                                    setShowFileUploadModal(true);
                                  }
                                }}
                              >
                                <option value="Pending">Pending</option>
                                <option value="Received">Received</option>
                              </select>
                            </div>
                          ) : (
                            "Received"
                          )}
                        </td>


                        <td className="py-2 px-4 text-center border">
                          <button
                            className="bg-pink-500 text-white px-3 py-1 rounded"
                            onClick={() => handleViewMore(order)}
                          >
                            Review
                          </button>
                        </td>
                        {status === "Pending" && (
                          <td className="py-2 px-4 flex justify-around space-x-2">
                            <button
                              className={`px-4 py-2 rounded ${order.prescription_status === "Received" ? "bg-green-500 text-white" : "bg-gray-300 text-gray-500 cursor-not-allowed"
                                }`}
                              disabled={order.prescription_status !== "Received"}
                              onClick={() => {
                                if (order.prescription_status === "Received") {
                                  setSelectedOrder(order);
                                  setShowApproveModal(true);
                                }
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

          {showFileUploadModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
              <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
                <h2 className="text-xl font-bold mb-4">Upload Prescription</h2>

                <label className="block mb-4">
                  <span className="font-bold">Prescription File:</span>
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => setSameFile(e.target.files[0])}
                    className="border border-gray-300 rounded w-full px-2 py-1"
                  />
                </label>

                <label className="block mb-4">
                  <input
                    type="checkbox"
                    checked={sameFileForAll}
                    onChange={(e) => setSameFileForAll(e.target.checked)}
                    className="mr-2"
                  />
                  Use the same file for all prescription items
                </label>

                <div className="flex justify-between">
                  <button
                    className="bg-gray-500 text-white px-4 py-2 rounded"
                    onClick={() => setShowFileUploadModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                    onClick={async () => {
                      if (sameFile) {
                        await uploadPrescriptionForAll(selectedOrder.id, sameFile);
                        setShowFileUploadModal(false);
                      } else {
                        alert("Please select a file to upload.");
                      }
                    }}
                  >
                    Upload & Save
                  </button>
                </div>
              </div>
            </div>
          )}




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

                          {/* Insurance Section */}

                          <p>
                            <strong>Insurance Received:</strong>{" "}
                            {orderDetails.insurance_pdf ? orderDetails.insurance_company : "No"}
                          </p>
                          {orderDetails.insurance_pdf && (
                            <p className="mt-4">
                              <strong>Insurance File: </strong>
                              <a
                                href={orderDetails.insurance_pdf}
                                download
                                className="bg-customPink text-white px-4 py-2 rounded hover:bg-customBlue transition duration-200"
                              >
                                Download Insurance File
                              </a>
                            </p>
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
                      <div className="overflow-y-auto max-h-72">
                        <table className="min-w-full bg-white table-auto">
                          <thead className="sticky top-0 z-50">
                            <tr className="bg-gray-300">
                              <th className="py-2 px-4 w-10 border">S.No</th>
                              <th className="py-2 px-4 w-20 border">Prod ID</th>
                              <th className="py-2 px-4 w-24 border">Prod Image</th>
                              <th className="py-2 px-4 w-32 border">Prod Name</th>
                              <th className="py-2 px-4 w-48 border">Prod Details</th>
                              <th className="py-2 px-4 w-12 border">Qty</th>
                              <th className="py-2 px-4 w-28 border">Item Value</th>
                              <th className="py-2 px-4 w-20 border">Prescription</th>
                            </tr>
                          </thead>
                          <tbody>
                            {orderDetails.items.map((item, index) => (
                              <tr key={index} className="border-t">
                                <td className="py-1 px-4 text-center border border-gray-300">
                                  {index + 1}
                                </td>
                                <td className="py-1 px-4 text-center border border-gray-300">
                                  {item.product_id}
                                </td>
                                <td className="py-1 px-4 text-center border border-gray-300">
                                  <img
                                    src={item.image}
                                    alt={item.product_name}
                                    className="h-12 w-12 object-cover"
                                  />
                                </td>
                                <td className="py-1 px-4 text-center border border-gray-300">
                                  {item.product_name}
                                </td>
                                <td className="py-1 px-4 text-center border border-gray-300 group relative">
                                  {/* Truncated Text */}
                                  <span className="line-clamp-2">
                                    {item.description}
                                  </span>

                                  {/* Tooltip on Hover */}
                                  <div className="absolute left-3/4 transform top-0 mt-2 z-10 w-96 bg-gray-700 text-white text-sm font-medium px-4 py-2 rounded shadow-lg hidden group-hover:block">
                                    {item.description}
                                  </div>
                                </td>

                                <td className="py-1 px-4 text-center border border-gray-300">
                                  X{item.quantity}
                                </td>
                                <td className="py-1 px-4 text-center border border-gray-300">
                                  ${item.price}
                                </td>
                                <td className="px-4 py-1 border text-center">
                                  {item.prescription_required && item.prescription_file ? (
                                    <div className="flex flex-col items-center space-y-2">
                                      {/* Display a truncated file name */}
                                      <p className="text-gray-600 text-sm">
                                        {item.prescription_file.split('/').pop().slice(0, 12)}...
                                      </p>
                                      {/* Download Button */}
                                      <a
                                        href={item.prescription_file}
                                        download
                                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-200"
                                      >
                                        Download
                                      </a>
                                    </div>
                                  ) : (
                                    "Not Required"
                                  )}
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
                        (
                          <div className="flex space-x-4">
                            <button
                              className={`px-4 py-2 rounded ${orderDetails.prescription_status === "Received" ? "bg-green-500 text-white" : "bg-gray-300 text-gray-500 cursor-not-allowed"
                                }`}
                              disabled={orderDetails.prescription_status !== "Received"}
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
