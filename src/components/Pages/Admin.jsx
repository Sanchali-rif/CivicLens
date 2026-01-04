import React, { useEffect, useState, useRef } from "react";
import "./Admin.css";


const BACKEND_URL = "https://civiclens-backend-exjz.onrender.com";

export const Admin = () => {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("ALL");
  const [priorityFilter, setPriorityFilter] = useState("ALL");

  const hasFetched = useRef(false);

  const fetchIssues = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/get_all_issues.php`);
      const data = await res.json();

      if (data.success) {
        setIssues(data.issues);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;
    fetchIssues();
  }, []);

  const updateStatus = async (issueId, newStatus) => {
    try {
      await fetch(`${BACKEND_URL}/update_issue_status.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          issue_id: issueId,
          status: newStatus,
        }),
      });

      fetchIssues();
    } catch (err) {
      console.error(err);
    }
  };

  
  const total = issues.length;
  const open = issues.filter((i) => i.status === "OPEN").length;
  const inProgress = issues.filter(
    (i) => i.status === "IN_PROGRESS"
  ).length;
  const resolved = issues.filter((i) => i.status === "RESOLVED").length;

  const highRisk = issues.filter((i) => i.priority === "HIGH").length;
  const mediumRisk = issues.filter((i) => i.priority === "MEDIUM").length;
  const lowRisk = issues.filter((i) => i.priority === "LOW").length;

  
  const priorityOrder = {
    HIGH: 3,
    MEDIUM: 2,
    LOW: 1,
  };

  const sortedIssues = [...issues].sort((a, b) => {
    const priorityDiff =
      priorityOrder[b.priority] - priorityOrder[a.priority];
    if (priorityDiff !== 0) return priorityDiff;
    return b.confidence - a.confidence;
  });

  
  const filteredIssues = sortedIssues.filter((issue) => {
    const statusMatch =
      activeFilter === "ALL" || issue.status === activeFilter;

    const priorityMatch =
      priorityFilter === "ALL" || issue.priority === priorityFilter;

    return statusMatch && priorityMatch;
  });

  if (loading) {
    return <p className="admin-loading">Loading all issues...</p>;
  }

  return (
    <div className="admin-container">
      <h1 className="admin-title">Admin Dashboard</h1>

     
      <div className="admin-stats">
        <div
          className={`stat-card total ${
            activeFilter === "ALL" && priorityFilter === "ALL"
              ? "active"
              : ""
          }`}
          onClick={() => {
            setActiveFilter("ALL");
            setPriorityFilter("ALL");
          }}
        >
          <h3>Total Issues</h3>
          <p>{total}</p>
        </div>

        <div
          className={`stat-card open ${
            activeFilter === "OPEN" ? "active" : ""
          }`}
          onClick={() => {
            setActiveFilter("OPEN");
            setPriorityFilter("ALL");
          }}
        >
          <h3>Open</h3>
          <p>{open}</p>
        </div>

        <div
          className={`stat-card progress ${
            activeFilter === "IN_PROGRESS" ? "active" : ""
          }`}
          onClick={() => {
            setActiveFilter("IN_PROGRESS");
            setPriorityFilter("ALL");
          }}
        >
          <h3>In Progress</h3>
          <p>{inProgress}</p>
        </div>

        <div
          className={`stat-card resolved ${
            activeFilter === "RESOLVED" ? "active" : ""
          }`}
          onClick={() => {
            setActiveFilter("RESOLVED");
            setPriorityFilter("ALL");
          }}
        >
          <h3>Resolved</h3>
          <p>{resolved}</p>
        </div>
      </div>

      
      <div className="admin-stats">
        <div
          className={`stat-card high ${
            priorityFilter === "HIGH" ? "active" : ""
          }`}
          onClick={() => {
            setPriorityFilter("HIGH");
            setActiveFilter("ALL");
          }}
        >
          <h3>High Risk</h3>
          <p>{highRisk}</p>
        </div>

        <div
          className={`stat-card medium ${
            priorityFilter === "MEDIUM" ? "active" : ""
          }`}
          onClick={() => {
            setPriorityFilter("MEDIUM");
            setActiveFilter("ALL");
          }}
        >
          <h3>Medium Risk</h3>
          <p>{mediumRisk}</p>
        </div>

        <div
          className={`stat-card low ${
            priorityFilter === "LOW" ? "active" : ""
          }`}
          onClick={() => {
            setPriorityFilter("LOW");
            setActiveFilter("ALL");
          }}
        >
          <h3>Low Risk</h3>
          <p>{lowRisk}</p>
        </div>
      </div>

      
      <div className="admin-grid">
        {filteredIssues.map((issue) => (
          <div key={issue.id} className="admin-card">
            <img
              src={`${BACKEND_URL}/uploads/${issue.image_file}`}
              alt="issue"
              className="admin-image"
            />

            <div className="admin-content">
              <h3>{issue.issue_type}</h3>

              <p className={`priority ${issue.priority.toLowerCase()}`}>
                Priority: {issue.priority}
              </p>

              <p>
                <strong>Status:</strong>{" "}
                <span className="status-text">{issue.status}</span>
              </p>

              <p>
                <strong>Confidence:</strong> {issue.confidence}
              </p>

              <p className="admin-reason">
                <strong>AI Reason:</strong> {issue.reason}
              </p>

              <p className="admin-address">
                📍 {issue.address || "Location not provided"}
              </p>

              <p className="admin-date">
                {new Date(issue.created_at).toLocaleString()}
              </p>

              <select
                className="status-select"
                value={issue.status}
                onChange={(e) =>
                  updateStatus(issue.id, e.target.value)
                }
              >
                <option value="OPEN">OPEN</option>
                <option value="IN_PROGRESS">IN_PROGRESS</option>
                <option value="RESOLVED">RESOLVED</option>
              </select>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
