import React from 'react';

const ProfileForm = () => {
  return (
    <div className="max-w-2xl mx-auto p-8 bg-white shadow-lg rounded-lg">
      <form className="grid grid-cols-1 gap-y-6">
        <div>
          <label htmlFor="firstName" className="block text-sm font-semibold text-gray-800">First Name</label>
          <input type="text" name="firstName" id="firstName" className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" placeholder="Peter"/>
        </div>
        <div>
          <label htmlFor="lastName" className="block text-sm font-semibold text-gray-800">Last Name</label>
          <input type="text" name="lastName" id="lastName" className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" placeholder="Bairwa"/>
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-semibold text-gray-800">Email</label>
          <input type="email" name="email" id="email" className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" placeholder="bradley.ortiz@gmail.com"/>
        </div>
        <div>
          <label htmlFor="phone" className="block text-sm font-semibold text-gray-800">Phone</label>
          <input type="tel" name="phone" id="phone" className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" placeholder="477-046-1827"/>
        </div>
        <div>
          <label htmlFor="address" className="block text-sm font-semibold text-gray-800">Address</label>
          <input type="text" name="address" id="address" className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" placeholder="116 Jaskolski Stravenue Suite 863"/>
        </div>
        <div>
          <label htmlFor="nation" className="block text-sm font-semibold text-gray-800">Nation</label>
          <input type="text" name="nation" id="nation" className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" placeholder="Colombia"/>
        </div>
        <div>
          <label htmlFor="role" className="block text-sm font-semibold text-gray-800">Role</label>
          <input type="text" name="role" id="role" className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" placeholder="Your role here"/>
        </div>
        <div>
          <button type="submit" className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">Submit</button>
        </div>
      </form>
    </div>
  );
};

export default ProfileForm;
