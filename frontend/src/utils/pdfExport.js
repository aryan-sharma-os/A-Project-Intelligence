export const exportToPDF = async (elementId, filename = 'report.pdf') => {
  // We use native window.print() because it handles complex SVG charts (Recharts) 
  // flawlessly without freezing the browser, unlike html2canvas.
  
  // 1. Add a specific class to the body so our CSS knows we are printing the full report
  document.body.classList.add('exporting-full-report');

  // 2. Allow React to finish rendering the offscreen container and CSS to apply
  await new Promise(r => setTimeout(r, 300));

  try {
    // 3. Trigger the native print dialog (user can choose "Save to PDF")
    window.print();
  } catch (error) {
    console.error("PDF Export failed", error);
  } finally {
    // 4. Cleanup
    document.body.classList.remove('exporting-full-report');
  }
};
