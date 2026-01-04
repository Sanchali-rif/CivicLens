import React, { useEffect, useState } from "react";
import "./DashBoard.css";

export const DashBoard = () => {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost/CivicLens/backend/get_user_issues.php?user_id=1")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setIssues(data.issues);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <p className="dashboard-loading">Loading your issues...</p>;
  }

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">My Reported Issues</h1>

      {issues.length === 0 ? (
        <p className="no-issues">You haven’t reported any issues yet.</p>
      ) : (
        <div className="issues-grid">
          {issues.map((issue) => {
            const priorityClass = `badge priority-${issue.priority.toLowerCase()}`;
            const statusClass = `badge status-${issue.status
              .toLowerCase()
              .replace(" ", "-")}`;

            return (
              <div key={issue.id} className="issue-card">
                <img
                  src={`http://localhost/CivicLens/backend/uploads/${issue.image_file}`}
                  alt="Reported issue"
                  className="issue-image"
                />

                <div className="issue-content">
                  <h3 className="issue-title">{issue.issue_type}</h3>

                  <div className="issue-badges">
                    <span className={priorityClass}>
                      {issue.priority}
                    </span>
                    <span className={statusClass}>
                      {issue.status}
                    </span>
                  </div>

                  <div className="issue-meta">
                    <span>📍 {issue.address || "Location not provided"}</span>
                    <span>
                      🕒 {new Date(issue.created_at).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

