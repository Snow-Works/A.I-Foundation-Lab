// src/components/pdf/AdmissionLetter.jsx
import React from "react";
import LogoMark from "../ui/LogoMark.jsx";
import "./pdf-styles.css";

const AdmissionLetter = React.forwardRef(({ student, date }, ref) => {
  const fullName = [student.first_name, student.surname].filter(Boolean).join(" ") || student.email;

  return (
    <div ref={ref} className="pdf-page">
      {/* Watermark */}
      <div className="pdf-watermark">
        <LogoMark size={400} />
      </div>

      <div className="pdf-content">
        <header className="pdf-header">
          <div className="pdf-brand">AI Foundation Lab</div>
        </header>

        <div className="pdf-letter-body" style={{ flex: 1 }}>
          <p className="pdf-letter-date">{date}</p>
          
          <p>Dear <strong>{fullName}</strong>,</p>
          
          <h2 className="pdf-letter-title">Letter of Admission</h2>
          
          <p>
            On behalf of the entire team at the AI Foundation Lab, I am pleased to inform you 
            that you have been officially admitted into our guild. Your performance in the 
            recent technical assessment demonstrated the high level of rigor, problem-solving, 
            and coding proficiency we look for in our members.
          </p>
          
          <p>
            You have proven your ability to build and apply artificial intelligence concepts. 
            We are confident that you will make significant contributions to our community and 
            to your respective academic field.
          </p>

          <p>
            Welcome to the guild. We look forward to building the future with you.
          </p>

          <div className="pdf-letter-signature" style={{ marginTop: "80px" }}>
            <div className="pdf-signature-block" style={{ alignItems: "flex-start" }}>
              <span className="pdf-signature-script">Williams Adaji-Agbane</span>
              <div className="pdf-signature-line">Founder, AI Foundation Lab</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

export default AdmissionLetter;