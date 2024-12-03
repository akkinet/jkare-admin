import React from 'react';

const UserRoles = () => {
  return (
    <div className="font-sans text-gray-800 p-8 space-y-8">
      <h1 className="text-center text-4xl font-bold text-customBlue mb-8">
        User Roles and Access Levels
      </h1>

      <section className="bg-gray-50 shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Super Admin</h2>
        <ul className="list-disc pl-5 text-gray-700 leading-relaxed">
          <li><strong>Full Access:</strong> Complete access to all modules and features.</li>
          <li><strong>Role Overview:</strong> Manages the system at the highest level.</li>
          <li><strong>Accessible Modules:</strong> Dashboard, Customers, Prescriptions, Orders, Billing and Payments, Vendors, Products, User Management, Account Settings, and User Roles.</li>
          <li><strong>Capabilities:</strong> Create, edit, delete, and review data across all modules.</li>
          <li><strong>Responsibilities:</strong>
            <ul className="list-disc pl-5">
              <li>Oversee application operations.</li>
              <li>Ensure system compliance and smooth operation.</li>
              <li>Handle critical issues and enforce policies.</li>
              <li>Manage customer accounts, prescriptions, orders, and vendor relations.</li>
            </ul>
          </li>
          <li><strong>Decision-making:</strong> Authority to make high-level operational decisions.</li>
        </ul>
      </section>

      <section className="bg-gray-50 shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Analyst</h2>
        <ul className="list-disc pl-5 text-gray-700 leading-relaxed">
          <li><strong>Specialization:</strong> Focus on data review, analysis, and reporting.</li>
          <li><strong>Accessible Modules:</strong> Dashboard, Prescriptions, and Orders.</li>
          <li><strong>Capabilities:</strong>
            <ul className="list-disc pl-5">
              <li>Monitor KPIs and order trends.</li>
              <li>Analyze and interpret prescription and order data.</li>
              <li>Provide insights and recommendations to management.</li>
            </ul>
          </li>
          <li><strong>Restrictions:</strong> Limited to viewing and analyzing data; cannot modify information.</li>
          <li><strong>Role Importance:</strong>
            <ul className="list-disc pl-5">
              <li>Ensures data integrity.</li>
              <li>Bridges the gap between raw data and actionable business insights.</li>
              <li>Supports data-driven strategies.</li>
            </ul>
          </li>
        </ul>
      </section>

      <section className="bg-gray-50 shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Billing Specialist</h2>
        <ul className="list-disc pl-5 text-gray-700 leading-relaxed">
          <li><strong>Specialization:</strong> Manage financial transactions and customer billing activities.</li>
          <li><strong>Accessible Modules:</strong> Billing and Payments, Orders, and Customers.</li>
          <li><strong>Capabilities:</strong>
            <ul className="list-disc pl-5">
              <li>Generate invoices and process payments.</li>
              <li>Update payment statuses and manage customer accounts.</li>
              <li>Resolve billing disputes and ensure financial operations run smoothly.</li>
            </ul>
          </li>
          <li><strong>Restrictions:</strong> Limited access to financial and customer-related tasks; no access to other system areas.</li>
          <li><strong>Role Importance:</strong>
            <ul className="list-disc pl-5">
              <li>Maintains accurate billing records.</li>
              <li>Addresses payment discrepancies.</li>
              <li>Ensures a seamless financial experience for customers.</li>
            </ul>
          </li>
        </ul>
      </section>
    </div>
  );
};

export default UserRoles;
