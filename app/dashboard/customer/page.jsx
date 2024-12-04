// ServerSideCustomers.js
import React from "react";
import Customers from "../../../components/Customers"

const ServerCustomers = async () => {
  let customers = [];

  try {
    const response = await fetch("http://localhost:3000/api/customers", {
      cache: "no-store", // Prevent caching if the data changes frequently
    });
    customers = await response.json();
  } catch (error) {
    console.error("Error fetching customers:", error);
  }

  return <Customers customers={customers} />;
};

export default ServerCustomers;
