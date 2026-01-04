import React, { useEffect, useState, useRef } from "react";
import "./Admin.css";

export const Admin = () => {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const hasFetched = useRef(false);

  const fetchIssues = async () => {
    try {
      const res = await fetch(
        "http://localhost/CivicLens/backend/get_all_issues.php"
      );
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
      await fetch(
        "http://localhost/CivicLens/backend/update_issue_status.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            issue_id: issueId,
            status: newStatus,
          }),
        }
      );

      fetchIssues();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return <p className="admin-loading">Loading all issues...</p>;
  }

  return (
    <div className="admin-container">
      <h1 className="admin-title">Admin Dashboard</h1>

      <div className="admin-grid">
        {issues.map((issue) => (
          <div key={issue.id} className="admin-card">
            <img
              src={`http://localhost/CivicLens/backend/uploads/${issue.image_file}`}
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
                <span className="status-text">
                  {issue.status || "OPEN"}
                </span>
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
                value={issue.status || "OPEN"}
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
