import jsPDF from 'jspdf';
import { GeneratedProtocol, Recommendation } from '@/lib/consultation/types';

const COLORS = {
  accent: [107, 142, 127] as [number, number, number], // sage green
  text: [30, 30, 30] as [number, number, number],
  muted: [100, 100, 100] as [number, number, number],
  light: [240, 240, 240] as [number, number, number],
};

const MARGINS = {
  left: 20,
  right: 20,
  top: 20,
  bottom: 20,
};

/**
 * Generate a PDF from a protocol
 */
export async function generateProtocolPdf(
  protocol: GeneratedProtocol,
  userName?: string
): Promise<Blob> {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const contentWidth = pageWidth - MARGINS.left - MARGINS.right;
  let y = MARGINS.top;

  // Helper to add new page if needed
  const checkPageBreak = (neededHeight: number) => {
    if (y + neededHeight > pageHeight - MARGINS.bottom) {
      doc.addPage();
      y = MARGINS.top;
      return true;
    }
    return false;
  };

  // Helper to wrap text
  const addWrappedText = (text: string, x: number, maxWidth: number, lineHeight: number = 6) => {
    const lines = doc.splitTextToSize(text, maxWidth);
    lines.forEach((line: string) => {
      checkPageBreak(lineHeight);
      doc.text(line, x, y);
      y += lineHeight;
    });
  };

  // === HEADER ===
  doc.setFillColor(...COLORS.accent);
  doc.rect(0, 0, pageWidth, 35, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text('NatureScripts', MARGINS.left, 18);

  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text('Your Personalized Wellness Protocol', MARGINS.left, 28);

  y = 50;

  // === USER & DATE ===
  doc.setTextColor(...COLORS.muted);
  doc.setFontSize(10);
  const dateStr = new Date(protocol.created_at || Date.now()).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  if (userName) {
    doc.text(`Prepared for: ${userName}`, MARGINS.left, y);
    y += 5;
  }
  doc.text(`Date: ${dateStr}`, MARGINS.left, y);
  y += 15;

  // === SUMMARY ===
  doc.setTextColor(...COLORS.text);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Summary', MARGINS.left, y);
  y += 8;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  addWrappedText(protocol.summary, MARGINS.left, contentWidth);
  y += 10;

  // === RECOMMENDATIONS ===
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');

  if (!protocol.recommendations || protocol.recommendations.length === 0) {
    doc.text('Recommendations', MARGINS.left, y);
    y += 10;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('No recommendations available.', MARGINS.left, y);
    y += 10;
  } else {
    doc.text(`Recommendations (${protocol.recommendations.length})`, MARGINS.left, y);
    y += 10;

    protocol.recommendations.forEach((rec: Recommendation, index: number) => {
      checkPageBreak(40);

      // Recommendation box
      doc.setFillColor(...COLORS.light);
      doc.roundedRect(MARGINS.left, y - 4, contentWidth, 35, 3, 3, 'F');

      // Number badge
      doc.setFillColor(...COLORS.accent);
      doc.circle(MARGINS.left + 8, y + 4, 6, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.text(String(index + 1), MARGINS.left + 8, y + 6, { align: 'center' });

      // Name
      doc.setTextColor(...COLORS.text);
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text(rec.name, MARGINS.left + 18, y + 5);

      // Type
      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(...COLORS.muted);
      doc.text(rec.type.replace('_', ' ').toUpperCase(), MARGINS.left + 18, y + 11);

      // Dosage
      doc.setFontSize(10);
      doc.setTextColor(...COLORS.text);
      doc.setFont('helvetica', 'normal');
      doc.text(`Dosage: ${rec.dosage}`, MARGINS.left + 18, y + 18);

      // Timing
      doc.text(`Timing: ${rec.timing}`, MARGINS.left + 18, y + 24);

      y += 38;

      // Rationale (if space)
      if (rec.rationale) {
        checkPageBreak(15);
        doc.setFontSize(9);
        doc.setTextColor(...COLORS.muted);
        addWrappedText(`Why: ${rec.rationale}`, MARGINS.left + 4, contentWidth - 8, 5);
        y += 5;
      }
    });
  }

  // === DIETARY SHIFTS ===
  if (protocol.dietary_shifts && protocol.dietary_shifts.length > 0) {
    checkPageBreak(30);
    y += 5;
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...COLORS.text);
    doc.text('Dietary Shifts', MARGINS.left, y);
    y += 8;

    protocol.dietary_shifts.forEach((shift) => {
      checkPageBreak(15);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.text(`${shift.action.toUpperCase()}: ${shift.item}`, MARGINS.left, y);
      y += 5;
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(...COLORS.muted);
      addWrappedText(shift.rationale, MARGINS.left + 4, contentWidth - 4, 5);
      doc.setTextColor(...COLORS.text);
      y += 3;
    });
  }

  // === LIFESTYLE PRACTICES ===
  if (protocol.lifestyle_practices && protocol.lifestyle_practices.length > 0) {
    checkPageBreak(30);
    y += 5;
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...COLORS.text);
    doc.text('Lifestyle Practices', MARGINS.left, y);
    y += 8;

    protocol.lifestyle_practices.forEach((practice) => {
      checkPageBreak(15);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.text(practice.practice, MARGINS.left, y);
      if (practice.timing) {
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(...COLORS.muted);
        doc.text(` (${practice.timing})`, MARGINS.left + doc.getTextWidth(practice.practice) + 2, y);
      }
      y += 5;
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(...COLORS.muted);
      addWrappedText(practice.rationale, MARGINS.left + 4, contentWidth - 4, 5);
      doc.setTextColor(...COLORS.text);
      y += 3;
    });
  }

  // === DISCLAIMER ===
  checkPageBreak(30);
  y += 10;
  doc.setFillColor(255, 250, 240);
  doc.roundedRect(MARGINS.left, y - 4, contentWidth, 25, 3, 3, 'F');
  doc.setDrawColor(255, 200, 100);
  doc.roundedRect(MARGINS.left, y - 4, contentWidth, 25, 3, 3, 'S');

  doc.setFontSize(8);
  doc.setTextColor(150, 100, 50);
  doc.setFont('helvetica', 'bold');
  doc.text('Disclaimer', MARGINS.left + 4, y + 2);
  doc.setFont('helvetica', 'normal');
  const disclaimerLines = doc.splitTextToSize(protocol.disclaimer, contentWidth - 8);
  doc.text(disclaimerLines, MARGINS.left + 4, y + 8);

  // === FOOTER ===
  const footerY = pageHeight - 10;
  doc.setFontSize(8);
  doc.setTextColor(...COLORS.muted);
  doc.text('Generated by NatureScripts • naturescripts.com', pageWidth / 2, footerY, { align: 'center' });

  return doc.output('blob');
}
