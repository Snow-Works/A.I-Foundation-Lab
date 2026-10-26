// src/lib/pdfGenerator.js
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

/**
 * Captures a DOM element and downloads it as a PDF.
 * @param {HTMLElement} element - The DOM node to capture.
 * @param {string} filename - The name of the downloaded file.
 * @param {string} orientation - "portrait" or "landscape".
 */
export async function downloadElementAsPDF(element, filename, orientation = "portrait") {
  if (!element) {
    console.error("Element not found for PDF generation.");
    return;
  }

  try {
    // Ensure fonts are fully loaded before capturing
    await document.fonts.ready;

    const canvas = await html2canvas(element, {
      scale: 2, // Higher scale for better print quality
      useCORS: true,
      backgroundColor: "#FFFFFF", // Force white background
    });

    const imgData = canvas.toDataURL("image/png");
    
    // A4 dimensions in mm
    const pdf = new jsPDF({
      orientation: orientation,
      unit: "mm",
      format: "a4",
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    // Calculate image dimensions to fit A4 while maintaining aspect ratio
    const imgWidth = canvas.width;
    const imgHeight = canvas.height;
    const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
    
    const width = imgWidth * ratio;
    const height = imgHeight * ratio;

    // Center the image on the page
    const x = (pdfWidth - width) / 2;
    const y = (pdfHeight - height) / 2;

    pdf.addImage(imgData, "PNG", x, y, width, height);
    pdf.save(filename);
  } catch (err) {
    console.error("[PDF Generator] Error:", err);
    alert("Failed to generate PDF. Please try again.");
  }
}