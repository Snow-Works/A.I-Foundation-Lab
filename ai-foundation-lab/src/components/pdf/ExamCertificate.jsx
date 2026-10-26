// src/components/pdf/ExamCertificate.jsx
import React from "react";
import "./pdf-styles.css";

const ExamCertificate = React.forwardRef(({ student, date }, ref) => {
  const fullName = [student.first_name, student.surname].filter(Boolean).join(" ") || student.email;

  return (
    <div ref={ref} className="pdf-page pdf-landscape pdf-certificate">
      <div className="pdf-border-inner">
        <h1 className="pdf-cert-title">CERTIFICATE OF SUCCESSFUL EXAMINATION</h1>
        <p className="pdf-cert-subtitle">This is to certify that</p>
        
        <h2 className="pdf-cert-name">{fullName}</h2>
        
        <p className="pdf-cert-text">
          has successfully completed the rigorous technical assessment and has demonstrated 
          exceptional proficiency in applying Artificial Intelligence and programming concepts 
          within their academic discipline.
        </p>

        <div className="pdf-cert-footer">
          <div className="pdf-signature-block">
            <span className="pdf-signature-script">Williams Adaji-Agbane</span>
            <span className="pdf-signature-line">Founder, AI Foundation Lab</span>
          </div>
          
          <div className="pdf-cert-seal">
            <div className="pdf-seal-inner">CERTIFIED</div>
          </div>

          <div className="pdf-signature-block">
            <span className="pdf-signature-script">{fullName}</span>
            <span className="pdf-signature-line">Student Signature</span>
          </div>
        </div>
        
        <p className="pdf-cert-date">Issued on {date}</p>
      </div>
    </div>
  );
});

export default ExamCertificate;