"use client";
import React, { useState, useEffect } from "react";

const Orders = ({ initialOrders }) => {
  const sortedOrders = [...initialOrders].sort(
    (a, b) => new Date(b.order_date) - new Date(a.order_date)
  );

  const [orders] = useState(sortedOrders);
  const [filteredOrders, setFilteredOrders] = useState(sortedOrders);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // State for storing label creation response
  const [labelInfo, setLabelInfo] = useState(null);
  // Track whether label has been created
  const [isLabelCreated, setIsLabelCreated] = useState(false);
  // Track whether we are currently creating the label
  const [isCreatingLabel, setIsCreatingLabel] = useState(false);

  // State for tracking info
  const [trackingInfo, setTrackingInfo] = useState(null);
  const [isFetchingTracking, setIsFetchingTracking] = useState(false);

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (query === "") {
      setFilteredOrders(orders);
    } else {
      const filtered = orders.filter(
        (order) =>
          order._id.toLowerCase().includes(query.toLowerCase()) ||
          order.customer_email.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredOrders(filtered);
    }
  };

  const openModal = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);

    // Reset all label/tracking states
    setLabelInfo(null);
    setIsLabelCreated(false);
    setIsCreatingLabel(false);
    setTrackingInfo(null);
    setIsFetchingTracking(false);
  };

  const closeModal = () => {
    setSelectedOrder(null);
    setIsModalOpen(false);
  };

  // Function to fetch tracking data after label creation
  const fetchTrackingData = async (data) => {
    console.log("trackingnumber and carrier" , data.tracking_number  , data.tracking_status);
    // if (!data?.tracking_number || !data?.tracking_status) return;

    // If tracking_status is "UNKNOWN", use "shippo" as carrier
    const carrier =
      data.tracking_status.trim() !== "" && data.tracking_status !== "UNKNOWN"
        ? data.tracking_status
        : "shippo";
    const trackingNumber = data.tracking_number;
   

    try {
      setIsFetchingTracking(true);
      const response = await fetch(
        // `/api/track?carrier=${carrier}&tracking=${trackingNumber}`,
        `/api/track?carrier=${"shippo"}&tracking=${"SHIPPO_TRANSIT"}`,
        {
          method: "GET",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch tracking data");
      }

      const result = await response.json();
      setTrackingInfo(result);
    } catch (error) {
      console.error("Error fetching tracking data:", error.message);
    } finally {
      setIsFetchingTracking(false);
    }
  };

  // This function will be triggered when the "Create Label" button is clicked
  const handleCreateLabel = async () => {
    if (!selectedOrder?.shipping_rate) return;

    try {
      setIsCreatingLabel(true);
      const response = await fetch("/api/transaction", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          // The backend expects the shipping rate ID:
          rate: selectedOrder.shipping_rate,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create label");
      }

      const data = await response.json();
      // Store the returned data in state
      setLabelInfo(data);
      // Mark that the label has been created
      setIsLabelCreated(true);

      // Immediately fetch tracking info if we have a tracking number + status
      await fetchTrackingData(data);
    } catch (error) {
      console.error("Error creating label:", error.message);
    } finally {
      setIsCreatingLabel(false);
    }
  };

  // Conditionally determine what the create-label button should display
  const getCreateLabelButtonContent = () => {
    if (isLabelCreated) {
      return <>Label Created ✅</>;
    }
    if (isCreatingLabel) {
      return (
        <>
          Creating Label...
          {/* Simple spinner */}
          <svg
            className="w-4 h-4 ml-2 text-white animate-spin inline-block"
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
        </>
      );
    }
    return "Create Label";
  };

  // Conditionally determine the create-label button styles
  const getCreateLabelButtonClass = () => {
    if (isLabelCreated) {
      // light green background
      return "bg-green-200 text-green-800 px-4 py-2 rounded cursor-default";
    }
    if (isCreatingLabel) {
      // gray out while creating
      return "bg-gray-400 text-white px-4 py-2 rounded cursor-wait";
    }
    // default create label color
    return "bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700";
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-center text-4xl font-bold text-customBlue mb-4">
        All Orders
      </h1>

      <div className="mb-4 flex justify-between items-center">
        <input
          type="text"
          placeholder="Search by Order ID"
          value={searchQuery}
          onChange={handleSearch}
          className="border rounded px-4 py-2 w-1/2"
        />
        <span className="text-gray-700 font-medium mr-10">
          Total Orders: {filteredOrders.length}
        </span>
      </div>

      <div className="overflow-x-auto overflow-y-auto max-h-[56vh]">
        <table className="min-w-full bg-white shadow-md rounded-lg">
          <thead className="bg-gray-200 text-gray-700 sticky top-0 z-10">
            <tr>
              <th className="px-6 py-3 text-center text-sm font-medium">S.No</th>
              <th className="px-6 py-3 text-center text-sm font-medium">
                Order ID
              </th>
              <th className="px-6 py-3 text-center text-sm font-medium">
                Customer Email
              </th>
              <th className="px-6 py-3 text-center text-sm font-medium">
                Order Date
              </th>
              <th className="px-6 py-3 text-center text-sm font-medium">
                Order Status
              </th>
              <th className="px-6 py-3 text-center text-sm font-medium">
                Prescription Status
              </th>
              <th className="px-6 py-3 text-center text-sm font-medium">
                Order Details
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order, index) => (
              <tr key={order._id} className="border-b last:border-none">
                <td className="px-6 py-2 text-sm text-center">{index + 1}</td>
                <td className="px-6 py-2 text-sm text-center">{order._id}</td>
                <td className="px-6 py-2 text-sm text-center">
                  {order.customer_email}
                </td>
                <td className="px-6 py-2 text-sm text-center">
                  {order.order_date}
                </td>
                <td className="px-6 py-2 text-sm text-center">
                  <span
                    className={`inline-block px-4 py-2 text-center rounded text-white font-semibold ${
                      order.order_status === "Completed"
                        ? "bg-green-500"
                        : order.order_status === "Pending"
                        ? "bg-yellow-500"
                        : order.order_status === "Cancelled"
                        ? "bg-red-500"
                        : "bg-gray-500"
                    }`}
                  >
                    {order.order_status === "Completed"
                      ? "Ready to Ship"
                      : order.order_status}
                  </span>
                </td>
                <td className="px-6 py-2 text-sm text-center">
                  {order.prescription_status === ""
                    ? "Not Required"
                    : order.prescription_status}
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 ">
          <div className="bg-white rounded-lg shadow-lg max-w-5xl w-full  md:max-h-[95vh] p-6 overflow-y-auto">
            <h3 className="text-xl font-bold mb-2 text-left border-b-2 border-customBlue pb-2">
              Order Details
            </h3>

            {/* Two-Column Layout for Order Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-b-2 border-customBlue pb-2">
              <div>
                <p>
                  <strong>Order ID:</strong> {selectedOrder._id}
                </p>
                <p>
                  <strong>Customer Name:</strong>{" "}
                  {selectedOrder.customer_name}
                </p>
                <p>
                  <strong>Customer Email:</strong>{" "}
                  {selectedOrder.customer_email}
                </p>
                <p>
                  <strong>Customer Phone:</strong>{" "}
                  {selectedOrder.customer_phone}
                </p>
                <p>
                  <strong>Order Date:</strong> {selectedOrder.order_date}
                </p>
                <p>
                  <strong>Order Status:</strong>{" "}
                  {selectedOrder.order_status === "Completed"
                    ? "Ready to Ship ✅"
                    : selectedOrder.order_status}
                </p>
                <p>
                  <strong>Prescription Status:</strong>{" "}
                  {selectedOrder.prescription_status
                    ? selectedOrder.prescription_status
                    : "Not Required"}
                </p>
              </div>
              <div>
                <p>
                  <strong>Shipping Address:</strong>{" "}
                  {selectedOrder.shipping_address.line1},{" "
                  }
                  {selectedOrder.shipping_address.city},{" "}
                  {selectedOrder.shipping_address.state},{" "}
                  {selectedOrder.shipping_address.postal_code},{" "}
                  {selectedOrder.shipping_address.country}
                </p>
                <p>
                  <strong>Billing Address:</strong>{" "}
                  {selectedOrder.billing_address.line1},{" "}
                  {selectedOrder.billing_address.city},{" "}
                  {selectedOrder.billing_address.state},{" "}
                  {selectedOrder.billing_address.postal_code},{" "}
                  {selectedOrder.billing_address.country}
                </p>
                <p>
                  <strong>Total Amount:</strong> ${selectedOrder.total_amount}
                </p>

                {/* Insurance Section */}
                <div className="flex justify-between items-center">
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
                    <th className="px-4 py-2 text-left border">
                      Product Name
                    </th>
                    <th className="px-4 py-2 text-left border">Quantity</th>
                    <th className="px-4 py-2 text-left border">Price</th>
                    <th className="px-4 py-2 text-left border">Total</th>
                    <th className="px-4 py-2 text-left border">
                      Prescription
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {selectedOrder.items.map((item, index) => (
                    <tr key={index} className="border-t">
                      <td className="px-4 py-2 border text-center">
                        {index + 1}
                      </td>
                      <td className="px-4 py-2 border">
                        <img
                          src={item.image}
                          alt={item.product_name}
                          className="w-16 h-16 object-cover rounded-md"
                        />
                      </td>
                      <td className="px-4 py-2 border">{item.product_name}</td>
                      <td className="px-4 py-2 border text-center">
                        {item.quantity}
                      </td>
                      <td className="px-4 py-2 border text-left">
                        ${item.price}
                      </td>
                      <td className="px-4 py-2 border text-left">
                        ${(item.price * item.quantity).toFixed(2)}
                      </td>
                      <td className="px-4 py-1 border text-center">
                        {item.prescription_required ? (
                          item.prescription_file ? (
                            <div className="flex flex-col items-center space-y-2">
                              <p className="text-gray-600 text-sm">
                                {item.prescription_file.split("/").pop()}
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
                            <span className="text-red-500">Required</span>
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

            {/* Label + Tracking Info */}
            <div className="flex flex-col md:flex-row mt-6 gap-6">
              {/* Label Information (left side) */}
              {labelInfo && (
                <div className="bg-gray-100 p-4 rounded-md md:w-1/2">
                  <h4 className="text-lg font-bold mb-2">Label Information</h4>
                  <p>
                    <strong>Tracking Number:</strong>{" "}
                    {(labelInfo.tracking_number &&
                      labelInfo.tracking_number.trim()) ||
                      "SHIPPO_TRANSIT"}
                  </p>
                  <p>
                    <strong>Tracking Status:</strong>{" "}
                    {(labelInfo.tracking_status &&
                      labelInfo.tracking_status.trim()) ||
                      "shippo"}
                  </p>
                  <p>
                    <strong>Tracking URL Provider:</strong>{" "}
                    {labelInfo.tracking_url_provider || "N/A"}
                  </p>
                  <p>
                    <strong>Rate ID:</strong> {labelInfo.rate}
                  </p>
                  <p>
                    <strong>Parcel ID:</strong> {labelInfo.parcel}
                  </p>
                  <p>
                    <strong>Label URL:</strong>{" "}
                    {labelInfo.label_url ? (
                      <a
                        href={labelInfo.label_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline text-blue-600"
                      >
                        View Label
                      </a>
                    ) : (
                      "N/A"
                    )}
                  </p>
                </div>
              )}

              {/* Tracking Information (right side) */}
              {labelInfo && (
                <div className="bg-gray-100 p-4 rounded-md md:w-1/2">
                  <h4 className="text-lg font-bold mb-2">Tracking History</h4>
                  {isFetchingTracking ? (
                    <div className="flex items-center space-x-2">
                      <svg
                        className="w-5 h-5 text-gray-500 animate-spin"
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
                      <span>Fetching tracking info...</span>
                    </div>
                  ) : trackingInfo ? (
                    <div>
                      <p>
                        <strong>Carrier:</strong> {trackingInfo.carrier}
                      </p>
                      <p>
                        <strong>ETA:</strong> {trackingInfo.eta || "N/A"}
                      </p>
                      <h5 className="font-semibold mt-4 mb-2">
                        Tracking Events:
                      </h5>
                      <ul className="relative border-l border-gray-300 pl-4">
                        {trackingInfo.tracking_history?.map(
                          (historyItem, idx) => (
                            <li key={historyItem.object_id} className="mb-4">
                              {/* Vertical line and bullet */}
                              <div className="absolute -left-2 top-1.5 h-3 w-3 rounded-full bg-blue-500"></div>

                              <p className="text-sm text-gray-800 font-medium">
                                {historyItem.status_date}
                              </p>
                              <p className="text-sm text-gray-600">
                                Status: {historyItem.status}
                              </p>
                              {historyItem.location && (
                                <p className="text-sm text-gray-600">
                                  Location: {historyItem.location.city},{" "}
                                  {historyItem.location.state},{" "}
                                  {historyItem.location.country}
                                </p>
                              )}
                              <p className="text-sm text-gray-600">
                                Details: {historyItem.status_details}
                              </p>
                            </li>
                          )
                        )}
                      </ul>
                    </div>
                  ) : (
                    <p className="text-gray-500">
                      No tracking information available yet.
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Buttons at bottom of modal */}
            <div className="text-right mt-6 flex justify-end space-x-4">
              {selectedOrder.order_status === "Completed" && (
                <button
                  className={getCreateLabelButtonClass()}
                  onClick={handleCreateLabel}
                  disabled={isCreatingLabel || isLabelCreated}
                >
                  {getCreateLabelButtonContent()}
                </button>
              )}
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
