// src/components/pdf/ResultListPDF.jsx
import React from "react";
import LogoMark from "../ui/LogoMark.jsx";
import "./pdf-styles.css";

const ResultListPDF = React.forwardRef(({ students, title }, ref) => {
  const date = new Date().toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div ref={ref} className="pdf-result-list">
      {/* Watermark */}
      <div className="pdf-watermark">
        <LogoMark size={400} />
      </div>

      <div className="pdf-content" style={{ display: "flex", flexDirection: "column" }}>
        {/* Header */}
        <header className="pdf-header" style={{ borderBottom: "2px solid #0A0630", marginBottom: "30px" }}>
          <div className="pdf-brand" style={{ color: "#0A0630" }}>AI Foundation Lab</div>
          <div style={{ textAlign: "right" }}>
            <div className="pdf-doc-title" style={{ color: "#555" }}>{title}</div>
            <div style={{ fontSize: "12px", color: "#777" }}>Generated: {date}</div>
          </div>
        </header>

        {/* Summary */}
        <div style={{ marginBottom: "30px" }}>
          <p style={{ fontSize: "16px", color: "#333" }}>
            <strong>Total Students:</strong> {students.length}
          </p>
        </div>

        {/* Table */}
        <table className="pdf-table">
          <thead>
            <tr>
              <th style={{ width: "5%" }}>#</th>
              <th style={{ width: "35%" }}>Student Name</th>
              <th style={{ width: "35%" }}>Email Address</th>
              <th style={{ width: "15%" }}>Date Marked</th>
              <th style={{ width: "10%", textAlign: "right" }}>Score</th>
            </tr>
          </thead>
          <tbody>
            {students.map((s, idx) => {
              const student = s.expand?.student || {};
              const fullName = [student.first_name, student.surname].filter(Boolean).join(" ") || student.email;
              const dateMarked = new Date(s.updated).toLocaleDateString();

              return (
                <tr key={s.id}>
                  <td>{idx + 1}</td>
                  <td>{fullName}</td>
                  <td>{student.email}</td>
                  <td>{dateMarked}</td>
                  <td style={{ textAlign: "right" }}>{s.totalScore}</td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* Footer Signature */}
        <div style={{ marginTop: "auto", paddingTop: "60px", display: "flex", justifyContent: "flex-end" }}>
          <div className="pdf-signature-block">
            <span className="pdf-signature-script">Williams Adaji-Agbane</span>
            <div className="pdf-signature-line">Founder, AI Foundation Lab</div>
          </div>
        </div>
      </div>
    </div>
  );
});

export default ResultListPDF;