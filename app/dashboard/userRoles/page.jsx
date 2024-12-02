import React from 'react';

const UserRoles = () => {
  return (
    <div className="font-sans text-gray-800 p-8 space-y-8">
      <h1 className="text-center text-4xl font-bold text-customBlue mb-8">
        User Roles and Access Levels
      </h1>

      <section className="bg-gray-50 shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Super Admin</h2>
        <p className="text-gray-700 leading-relaxed">
          The Super Admin role is the most powerful in the application, granting complete access to all modules
          and features. This role is designed for individuals responsible for managing the system at the highest
          level. Super Admins can navigate and manipulate data in modules such as Dashboard, Customers, 
          Prescriptions, Orders, Billing and Payments, Vendors, Products, User Management, Account Settings, 
          and User Roles. With these permissions, Super Admins can create, edit, delete, and review data across 
          the application, ensuring the system operates smoothly and all processes are streamlined. This role 
          is essential for overseeing the entirety of the application’s operations, ensuring compliance, and 
          addressing any critical issues that arise. Whether managing customer accounts, analyzing prescriptions, 
          or monitoring orders, Super Admins have the authority to make high-level decisions and enforce 
          policies effectively.
        </p>
      </section>

      <section className="bg-gray-50 shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Analyst</h2>
        <p className="text-gray-700 leading-relaxed">
          The Analyst role is specialized for users who focus on data review, analysis, and reporting. Analysts 
          have access to modules such as Dashboard, Prescriptions, and Orders. This role allows them to monitor 
          key performance indicators (KPIs), assess order trends, and analyze prescription details. Analysts can 
          view and interpret the data, providing insights and actionable recommendations to the management team. 
          However, their permissions are limited to viewing and analyzing data, ensuring they cannot modify 
          critical information. This structure ensures data integrity while enabling Analysts to focus on their 
          primary task of leveraging data for decision-making. The role is crucial for businesses that rely on 
          data-driven strategies, as Analysts bridge the gap between raw data and actionable insights.
        </p>
      </section>

      <section className="bg-gray-50 shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Billing Specialist</h2>
        <p className="text-gray-700 leading-relaxed">
          The Billing Specialist role is tailored for users responsible for managing financial transactions and 
          customer billing activities. This role includes access to modules such as Billing and Payments, Orders, 
          and Customers. Billing Specialists ensure that all billing-related tasks, such as generating invoices, 
          processing payments, and managing customer accounts, are handled efficiently. Their access allows them 
          to update payment statuses, resolve billing disputes, and collaborate with other teams to ensure smooth 
          financial operations. Unlike the Super Admin, Billing Specialists do not have access to other system 
          areas, ensuring their focus remains on financial and customer-related tasks. This role is vital for 
          maintaining accurate billing records, addressing payment discrepancies, and ensuring customers have a 
          seamless financial experience within the application.
        </p>
      </section>
    </div>
  );
};

export default UserRoles;
