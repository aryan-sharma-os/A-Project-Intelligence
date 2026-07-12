import React from 'react';
import { Download, Share2 } from 'lucide-react';

const ActionToolbar = ({ report }) => {
  const handleDownload = () => {
    const json = JSON.stringify(report, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const filename = (report.ticker || 'research') + '_report.json';
    a.setAttribute('download', filename);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleShare = () => {
    const text = `AI Investment Report: ${report.ticker} — ${report.recommendation} (Confidence: ${report.confidence_level})`;
    if (navigator.share) {
      navigator.share({ title: text, url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={handleDownload}
        title="Download JSON"
        className="p-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white transition-colors"
      >
        <Download className="w-4 h-4" />
      </button>
      <button
        onClick={handleShare}
        title="Share Report"
        className="p-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white transition-colors"
      >
        <Share2 className="w-4 h-4" />
      </button>
    </div>
  );
};

export default ActionToolbar;
