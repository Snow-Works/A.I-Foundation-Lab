// src/lib/pdfGenerator.js
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

/**
 * Captures a DOM element and downloads it as a single-page PDF.
 */
export async function downloadElementAsPDF(element, filename, orientation = "portrait") {
  if (!element) return;
  try {
    await document.fonts.ready;
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      backgroundColor: "#FFFFFF",
    });

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF({ orientation, unit: "mm", format: "a4" });
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    const ratio = Math.min(pdfWidth / canvas.width, pdfHeight / canvas.height);
    const width = canvas.width * ratio;
    const height = canvas.height * ratio;

    const x = (pdfWidth - width) / 2;
    const y = (pdfHeight - height) / 2;

    pdf.addImage(imgData, "PNG", x, y, width, height);
    pdf.save(filename);
  } catch (err) {
    console.error("[PDF Generator] Error:", err);
    alert("Failed to generate PDF. Please try again.");
  }
}

/**
 * Captures a DOM element and downloads it as a multi-page PDF.
 * Ideal for long lists (tables) that exceed one A4 page.
 */
export async function downloadListAsPDF(element, filename, orientation = "portrait") {
  if (!element) return;
  try {
    await document.fonts.ready;
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      backgroundColor: "#FFFFFF",
    });

    const imgData = canvas.toDataURL("image/jpeg", 0.95);
    const pdf = new jsPDF({ orientation, unit: "mm", format: "a4" });
    
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    // Calculate how tall the image will be on the PDF
    const imgWidth = pdfWidth;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = 0;

    // Add first page
    pdf.addImage(imgData, "JPEG", 0, position, imgWidth, imgHeight);
    heightLeft -= pdfHeight;

    // Add subsequent pages
    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, "JPEG", 0, position, imgWidth, imgHeight);
      heightLeft -= pdfHeight;
    }

    pdf.save(filename);
  } catch (err) {
    console.error("[PDF Generator] Error:", err);
    alert("Failed to generate PDF. Please try again.");
  }
}