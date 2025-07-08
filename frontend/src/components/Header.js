// src/components/Header.js
import React from 'react';
import { useAuth } from '../context/AuthContext';

const Header = () => {
  const { user, logout } = useAuth();

  return (
    <header className="p-4 bg-blue-600 text-white flex justify-between items-center">
      <h1 className="text-2xl font-bold">Real-Time To-Do Board</h1>
      <div className="flex gap-4 items-center">
        <span className="font-semibold">{user?.username}</span>
        <button
          onClick={logout}
          className="bg-white text-blue-600 px-3 py-1 rounded hover:bg-gray-200"
        >
          Logout
        </button>
      </div>
    </header>
  );
};

export default Header;
