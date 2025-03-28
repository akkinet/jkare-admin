"use client";
import { useState } from "react";

export default function Prescription({ initialOrders, error }) {
  // Sort orders from newest to oldest by date
  const sortedOrders = [...initialOrders].sort(
    (a, b) => new Date(b.order_date) - new Date(a.order_date)
  );
  // Basic state
  const [status, setStatus] = useState("Pending");
  const [prescriptionFilter, setPrescriptionFilter] = useState("both");
  const [orderDetails, setOrderDetails] = useState(null);
  const [orders, setOrders] = useState(sortedOrders);
  const [filteredOrders, setFilteredOrders] = useState(sortedOrders);
  const [searchQuery, setSearchQuery] = useState("");
  // Modals
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRequestInfoModal, setShowRequestInfoModal] = useState(false);
  const [showFileUploadModal, setShowFileUploadModal] = useState(false);
  const [showOrderModal, setShowOrderModal] = useState(false);
  // Selected items / files
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [uploadedFile, setUploadedFile] = useState(null);
  // Email details object
  const [emailDetails, setEmailDetails] = useState({
    to: "",
    subject: "Request more info",
    message: "",
    reason: "unable_to_read_order",
  });
  // Keep track of which order row is highlighted for "Review"
  const [highlightedOrderId, setHighlightedOrderId] = useState(null);
  // Keep track of any requested info messages you’ve already sent
  const [infoRequestedOrders, setInfoRequestedOrders] = useState({});
  // track sending status for the “Request More Info” email
  const [infoRequestSendStatus, setInfoRequestSendStatus] = useState("idle");
  // NEW: Store the mail preview HTML
  const [previewHtml, setPreviewHtml] = useState("");
  // -----------------------------------------------
  // Helper: Generated the email HTML body
  // -----------------------------------------------
  function generateMailHtml(order, user) {
    // Build table rows
    const tableRows = order.items
      .map((item) => {
        const subtotal = (item.price * item.quantity).toFixed(2);
        return `
          <tr>
            <td style="border: 1px solid #ccc; padding: 8px;">${item.product_name}</td>
            <td style="border: 1px solid #ccc; padding: 8px;">
              <img 
                src="${item.image}" 
                alt="${item.product_name}" 
                style="height: 50px; width: auto;" 
              />
            </td>
            <td style="border: 1px solid #ccc; padding: 8px; text-align:center;">
              ${item.quantity}
            </td>
            <td style="border: 1px solid #ccc; padding: 8px;">$${item.price}</td>
            <td style="border: 1px solid #ccc; padding: 8px;">$${subtotal}</td>
          </tr>
        `;
      })
      .join("");

    // Build a table + total
    const productsTable = `
      <table style="border-collapse: collapse; width: 100%; margin-top: 10px;">
        <thead>
          <tr style="background-color: #f2f2f2;">
            <th style="border: 1px solid #ccc; padding: 8px;">Product</th>
            <th style="border: 1px solid #ccc; padding: 8px;">Image</th>
            <th style="border: 1px solid #ccc; padding: 8px;">Quantity</th>
            <th style="border: 1px solid #ccc; padding: 8px;">Unit Price</th>
            <th style="border: 1px solid #ccc; padding: 8px;">Subtotal</th>
          </tr>
        </thead>
        <tbody>
          ${tableRows}
        </tbody>
      </table>

      <p style="margin-top: 10px;">
        <strong>Order Value:</strong> $${order.total_amount}
      </p>
    `;

    // Return the final HTML
    return `
      <div style="font-family: Arial, sans-serif; font-size: 14px; color: #333;">
        <p>Dear ${order.customer_name},</p>
        
        <p>
          We received your order on <strong>${order.order_date}</strong> 
          with the following details:
        </p>

        <p>
          <strong>Order ID:</strong> ${order._id}<br />
          <strong>Email:</strong> ${order.customer_email}
        </p>

        <p><strong>Products in Your Order:</strong></p>
        ${productsTable}

        <p>${user.message}</p>

        <p>
          Please provide the requested information or details in your reply 
          to help us proceed with your order.
        </p>

        <p>
          Thank you,<br /><br />
          <strong>TEAM - JKARE</strong><br />
          4101 SW 73rd Ave Suite C, Miami, FL 33155, USA
        </p>
      </div>
    `;
  }

  // -----------------------------------------------
  // Upload prescription for all items that need it
  // -----------------------------------------------
  const uploadPrescriptionForAll = async (orderId, file) => {
    const formData = new FormData();
    formData.append("file", file);
    try {
      const response = await fetch(`http://localhost:3000/api/prescription/${orderId}`, {
        method: "PUT",
        body: formData,
      });
      if (response.ok) {
        const { fileUrl } = await response.json();
        // Update the orders state with the new prescription file
        const updatedOrders = orders.map((order) => {
          if (order._id === orderId) {
            const updatedItems = order.items.map((item) =>
              item.prescription_required && !item.prescription_file
                ? { ...item, prescription_file: fileUrl }
                : item
            );
            return { ...order, items: updatedItems, prescription_status: "Received" };
          }
          return order;
        });

        setOrders(updatedOrders);
        setFilteredOrders(updatedOrders);
        alert("Prescription uploaded and updated for all applicable items.");
      } else {
        alert("Failed to upload prescription. Please try again.");
      }
    } catch (error) {
      console.error("Error uploading prescription:", error);
      alert("An error occurred while uploading the prescription.");
    }
  };

  // -----------------------------------------------
  // Handle the "Review" button to view more details
  // -----------------------------------------------
  const handleViewMore = (order) => {
    setOrderDetails(order);
    setHighlightedOrderId(order._id);
    setShowOrderModal(true);
  };

  // -----------------------------------------------
  // Approve order (only if prescription is received)
  // -----------------------------------------------
  const approvalHandler = async (id) => {
    const selectedOrder = orders.find((order) => order._id === id);
    if (selectedOrder.prescription_status !== "Received") {
      alert("You cannot approve until the prescription is uploaded (status 'Received').");
      return;
    }
    await fetch(`/api/order/${id}`, {
      method: "PUT",
      body: JSON.stringify({ status: "Completed" }),
    });

    const updatedOrders = orders.map((order) =>
      order._id === id ? { ...order, status: "Completed" } : order
    );
    setOrders(updatedOrders);
    setOrderDetails(null);
    setShowApproveModal(false);
    setShowOrderModal(false);
  };

  // -----------------------------------------------
  // Cancel order and store the reason message
  // -----------------------------------------------
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
      order._id === selectedOrder._id
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
      [selectedOrder._id]: emailDetails.message,
    }));

    setShowCancelModal(false);
    setOrderDetails(null);
    setShowRequestInfoModal(false);
  };

  // -----------------------------------------------
  // "Cancel" button from table row
  // -----------------------------------------------
  const handleCancel = (order) => {
    setSelectedOrder(order);
    setEmailDetails({
      to: order.customer_email,
      subject: "Order Cancellation",
      message: "",
      reason: "unable_to_read_order",
    });
    setShowCancelModal(true);
    setShowOrderModal(false);
  };

  // -----------------------------------------------
  // Filter the orders by status and prescription
  // -----------------------------------------------
  const filterHandler = async (ostat, pstat) => {
    let result;

    if (pstat !== "both") {
      const res = await fetch(
        `/api/prescription?ostat=${ostat}&pstat=${
          prescriptionFilter === "yes" ? "Received" : "Pending"
        }`
      );
      result = await res.json();
    } else {
      const res = await fetch(`/api/prescription?ostat=${ostat}`);
      result = await res.json();
    }

    setFilteredOrders(result);
    setPrescriptionFilter(pstat);
    setStatus(ostat);
    setOrderDetails(null);
    setHighlightedOrderId(null);
  };

  // -----------------------------------------------
  // Preview & Send the "Request More Info" email
  // -----------------------------------------------
  const handlePreview = () => {
    if (!orderDetails) return;
    const preview = generateMailHtml(orderDetails, emailDetails);
    setPreviewHtml(preview);
  };

  const reqInfoHandler = async (order, user) => {
    try {
      setInfoRequestSendStatus("sending");
      // Generate final HTML
      const htmlBody = generateMailHtml(order, user);
      // Send via your email API
      const response = await fetch(
        "https://mazr0geob3.execute-api.ap-south-1.amazonaws.com/v1/send-email",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            to: order.customer_email,
            subject: user.subject || "Request More Info",
            mailBody: htmlBody,
          }),
        }
      );
      if (!response.ok) {
        console.warn("Email API returned a non-OK status:", response.status);
      }
      setInfoRequestSendStatus("sent");
      // Store user’s typed message if needed
      setInfoRequestedOrders((prev) => ({
        ...prev,
        [order._id]: user.message,
      }));
    } catch (err) {
      setInfoRequestSendStatus("sent"); 
    }
  };

  return (
    <div className="p-4 bg-[#f4f6f8] h-[89vh]">
      <h1 className="text-center text-4xl font-bold text-customBlue mb-6">
        Prescription Approvals
      </h1>

      {error ? (
        <p>Error loading orders: {error}</p>
      ) : (
        <>
          {/* Top controls: search + status filter + prescription filter */}
          <div className="flex flex-col sm:flex-row justify-between mb-4 items-center">
            <input
              type="text"
              className="border border-gray-300 rounded px-4 py-2 w-full sm:w-80"
              placeholder="Search by Order ID or Customer Email"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <div className="flex space-x-4 mt-4 sm:mt-0">
              {/* Order status buttons */}
              <div className="flex space-x-2">
                <button
                  className={`px-4 py-2 ${
                    status === "Pending" ? "bg-pink-500 text-white" : "bg-gray-200"
                  } rounded`}
                  onClick={() => filterHandler("Pending", prescriptionFilter)}
                >
                  Pending
                </button>
                <button
                  className={`px-4 py-2 ${
                    status === "Completed" ? "bg-pink-500 text-white" : "bg-gray-200"
                  } rounded`}
                  onClick={() => filterHandler("Completed", prescriptionFilter)}
                >
                  Completed
                </button>
                <button
                  className={`px-4 py-2 ${
                    status === "Cancelled" ? "bg-pink-500 text-white" : "bg-gray-200"
                  } rounded`}
                  onClick={() => filterHandler("Cancelled", prescriptionFilter)}
                >
                  Cancelled
                </button>
              </div>

              {/* Prescription filter dropdown */}
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

          {/* Table of orders */}
          <div className="overflow-x-auto mt-4 text-sm">
            <div className="w-full overflow-auto max-h-96">
              <table className="bg-white border border-gray-300 shadow-md w-full">
                <thead className="sticky top-0">
                  <tr className="bg-gray-200">
                    <th className="py-2 px-4 text-center border">Order ID</th>
                    <th className="py-2 px-4 text-center border">Customer Email</th>
                    <th className="py-2 px-4 text-center border">Phone Number</th>
                    <th className="py-2 px-4 text-center border">Order Date</th>
                    <th className="py-2 px-4 text-center border">Order Value</th>
                    <th className="py-2 px-4 text-center border">
                      Prescription Status
                    </th>
                    <th className="py-2 px-4 text-center border">Detail</th>
                    {status === "Pending" && (
                      <th className="py-2 px-4 text-center border">Action</th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.length > 0 ? (
                    filteredOrders
                      // Optionally filter by search text:
                      .filter(
                        (order) =>
                          order._id.includes(searchQuery) ||
                          order.customer_email.includes(searchQuery)
                      )
                      .map((order) => (
                        <tr
                          key={order._id}
                          className={`cursor-pointer border-b ${
                            order._id === highlightedOrderId ? "bg-cyan-200/80" : ""
                          }`}
                        >
                          <td className="py-2 px-4 text-center border">{order._id}</td>
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
                                className={`px-4 py-2 rounded ${
                                  order.prescription_status === "Received"
                                    ? "bg-green-500 text-white"
                                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
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

          {/* Modal: Upload Prescription */}
          {showFileUploadModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
              <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
                <h2 className="text-xl font-bold mb-4">Upload Prescription</h2>
                <label className="block mb-4">
                  <span className="font-bold">Prescription File:</span>
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => setUploadedFile(e.target.files[0])}
                    className="border border-gray-300 rounded w-full px-2 py-1"
                  />
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
                      if (uploadedFile) {
                        await uploadPrescriptionForAll(selectedOrder._id, uploadedFile);
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

          {/* Modal: Detailed Order View */}
          {showOrderModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
              <div className="bg-white p-6 rounded shadow-md w-[90%] lg:max-w-7xl">
                <h2 className="text-xl font-bold mb-2 border-b-2 border-gray-300">
                  Order Details
                </h2>
                {orderDetails && (
                  <>
                    <div className="mb-4">
                      <div className="flex flex-col lg:flex-row">
                        <div className="mr-8 mb-4">
                          <p>
                            <strong>Order ID:</strong> {orderDetails._id}
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
                            <strong>Order Date:</strong> {orderDetails.order_date}
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
                            {orderDetails.insurance_pdf
                              ? orderDetails.insurance_company
                              : "No"}
                          </p>
                          {orderDetails.insurance_pdf && (
                            <p className="mt-4">
                              <strong>Insurance File: </strong>
                              <a
                                href={orderDetails.insurance_pdf}
                                download
                                className="bg-customPink text-white px-4 py-2 rounded hover:bg-customBlue transition duration-200"
                              >
                                View File
                              </a>
                            </p>
                          )}
                        </div>
                      </div>

                      {/* If order is cancelled, show cancellation details */}
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

                      {/* Show any "request info" messages for this order */}
                      {infoRequestedOrders[orderDetails._id] && (
                        <div className="mt-4 bg-yellow-100 p-4 rounded">
                          <h3 className="text-lg font-bold text-yellow-600 mb-2">
                            Requested Information
                          </h3>
                          <p>
                            <strong>Message:</strong>{" "}
                            {infoRequestedOrders[orderDetails._id]}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Product details table */}
                    <div className="border-t-2 border-gray-300 mt-4">
                      <h3 className="text-lg font-bold mb-2">Product Details</h3>
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
                              <tr key={index} className="border-t text-sm">
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
                                  <span className="line-clamp-2">
                                    {item.description}
                                  </span>
                                  <div className="absolute left-3/4 transform top-0 mt-2 z-10 w-96 bg-gray-700 text-white text-sm font-medium px-4 py-2 rounded shadow-lg hidden group-hover:block">
                                    {item.description}
                                  </div>
                                </td>
                                <td className="py-1 px-4 text-center border border-gray-300">
                                  X {item.quantity}
                                </td>
                                <td className="py-1 px-4 text-center border border-gray-300">
                                  ${item.price}
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
                    </div>

                    {/* Bottom buttons */}
                    <div className="mt-4 flex justify-between">
                      <button
                        className="bg-gray-500 text-white px-4 py-2 rounded"
                        onClick={() => setShowOrderModal(false)}
                      >
                        Close
                      </button>

                      {/* If order status is pending, show Approve / Req Info / Cancel */}
                      {orderDetails.order_status === "Pending" && (
                        <div className="flex space-x-4">
                          <button
                            className={`px-4 py-2 rounded ${
                              orderDetails.prescription_status === "Received"
                                ? "bg-green-500 text-white"
                                : "bg-gray-300 text-gray-500 cursor-not-allowed"
                            }`}
                            disabled={orderDetails.prescription_status !== "Received"}
                            onClick={() => approvalHandler(orderDetails._id)}
                          >
                            Approve
                          </button>

                          <button
                            className="bg-yellow-500 text-white px-4 py-2 rounded"
                            onClick={() => {
                              // Populate "to" before showing the modal
                              setEmailDetails((prev) => ({
                                ...prev,
                                to: orderDetails.customer_email,
                                subject:
                                  "Please attach the prescription file of the product",
                                message: "",
                              }));
                              setPreviewHtml(""); // Clear any old preview
                              setShowRequestInfoModal(true);
                            }}
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

          {/* Modal: Approve Order Confirmation */}
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
                    onClick={() => approvalHandler(selectedOrder._id)}
                  >
                    Approve
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Modal: Cancel Order */}
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
                    <option value="unable_to_read_order">Unable to read order</option>
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
                        selectedOrder._id,
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

          {/* Modal: Request More Information */}
          {showRequestInfoModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
              <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
                <h2 className="text-xl font-bold mb-4">Request More Information</h2>

                {/* "To" field */}
                <label className="block mb-2">
                  <span className="font-bold">To:</span>
                  <input
                    type="email"
                    value={emailDetails.to || ""}
                    readOnly
                    className="border border-gray-300 rounded w-full px-2 py-1"
                  />
                </label>

                {/* Subject dropdown */}
                <label className="block mb-2">
                  <span className="font-bold">Subject:</span>
                  <select
                    value={emailDetails.subject}
                    onChange={(e) =>
                      setEmailDetails((prev) => ({
                        ...prev,
                        subject: e.target.value,
                      }))
                    }
                    className="border border-gray-300 rounded w-full px-2 py-1"
                  >
                    <option value="Please attach the prescription file of the product">
                      Please attach the prescription file of the product
                    </option>
                    <option value="Prescription file is not clear">
                      Prescription file is not clear
                    </option>
                    <option value="The prescription contains inappropriate content">
                      The prescription contains inappropriate content
                    </option>
                    <option value="Can't get full details of prescription">
                      Can't get full details of prescription
                    </option>
                  </select>
                </label>

                {/* Message textarea */}
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

                {/* PREVIEW (new) + SEND buttons */}
                <div className="flex flex-col space-y-2 sm:flex-row sm:space-x-4 sm:space-y-0 justify-end">
                  {/* Preview Button */}
                  <button
                    type="button"
                    onClick={handlePreview}
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                  >
                    Preview
                  </button>

                  {/* Send Button */}
                  <button
                    className="bg-yellow-500 text-white px-4 py-2 rounded flex items-center justify-center"
                    onClick={() => reqInfoHandler(orderDetails, emailDetails)}
                    disabled={
                      infoRequestSendStatus === "sending" ||
                      infoRequestSendStatus === "sent"
                    }
                  >
                    {infoRequestSendStatus === "idle" && "Send"}
                    {infoRequestSendStatus === "sending" && (
                      <>
                        <svg
                          className="animate-spin mr-2 h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8v8H4z"
                          ></path>
                        </svg>
                        Sending...
                      </>
                    )}
                    {infoRequestSendStatus === "sent" && (
                      <>
                        <svg
                          className="mr-2 h-5 w-5 text-white"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                        Message Sent
                      </>
                    )}
                  </button>

                  {/* Cancel Button */}
                  <button
                    className="bg-gray-500 text-white px-4 py-2 rounded"
                    onClick={() => {
                      setInfoRequestSendStatus("idle");
                      setShowRequestInfoModal(false);
                      setPreviewHtml("");
                    }}
                  >
                    Close
                  </button>
                </div>

                {/* If there's a preview, show it below */}
                {previewHtml && (
                  <div className="mt-4 p-2 border rounded bg-gray-50 max-h-[300px] overflow-auto">
                    <h3 className="font-bold mb-2 text-gray-700">Mail Preview</h3>
                    <div
                      dangerouslySetInnerHTML={{ __html: previewHtml }}
                      className="bg-white p-2 rounded"
                    />
                  </div>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
