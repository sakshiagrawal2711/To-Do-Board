// src/components/SmartAssignButton.js
import React from 'react';

const SmartAssignButton = ({ onAssign }) => {
  return (
    <button
      onClick={onAssign}
      className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
    >
      Smart Assign
    </button>
  );
};

export default SmartAssignButton;
