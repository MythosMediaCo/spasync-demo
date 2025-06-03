// src/components/AuthTabs.js
import React, { useState } from 'react';
import Login from './Login';
import Register from './Register';

const AuthTabs = () => {
  const [activeTab, setActiveTab] = useState('login');

  return (
    <div className="w-full max-w-md p-6 bg-white rounded-xl shadow-md">
      <div className="flex justify-center mb-6 space-x-6 border-b pb-2">
        <button
          onClick={() => setActiveTab('login')}
          className={`text-lg font-semibold ${
            activeTab === 'login' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'
          }`}
        >
          Login
        </button>
        <button
          onClick={() => setActiveTab('register')}
          className={`text-lg font-semibold ${
            activeTab === 'register' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'
          }`}
        >
          Register
        </button>
      </div>

      {activeTab === 'login' ? <Login /> : <Register />}
    </div>
  );
};

export default AuthTabs;
