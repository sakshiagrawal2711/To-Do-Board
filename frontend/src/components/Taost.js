// src/components/Toast.js
import React from "react";

const Toast = ({ message, type }) => {
  const bg = type === "error" ? "#f8d7da" : "#d1e7dd";
  const color = type === "error" ? "#842029" : "#0f5132";

  return (
    <div
      style={{
        padding: "10px 20px",
        background: bg,
        color: color,
        borderRadius: "8px",
        margin: "10px",
        textAlign: "center",
      }}
    >
      {message}
    </div>
  );
};

export default Toast;
