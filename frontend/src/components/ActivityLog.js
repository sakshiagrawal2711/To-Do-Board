// src/components/ActivityLog.js
import { useEffect, useState } from "react";
import API from "../api/axios";
import socket from "../utils/socket"; // shared socket.io client instance

export default function ActivityLog() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    // 1. Initial fetch
    const fetchLogs = async () => {
      try {
        const res = await API.get("/logs");
        setLogs(res.data);
      } catch (err) {
        console.error("Failed to fetch logs", err);
      }
    };

    fetchLogs();

    // 2. Listen to real-time logs
    socket.on("action-log", (log) => {
      setLogs((prevLogs) => [log, ...prevLogs.slice(0, 19)]);
    });

    return () => socket.off("action-log");
  }, []);

  return (
    <div className="log-panel">
      <h3>📜 Activity Log</h3>
      <ul>
        {logs.map((log, idx) => (
          <li key={idx}>
            <strong>{log.user}</strong> {log.action} <em>{log.task}</em> <br />
            <small>{new Date(log.timestamp).toLocaleString()}</small>
          </li>
        ))}
      </ul>
    </div>
  );
}

