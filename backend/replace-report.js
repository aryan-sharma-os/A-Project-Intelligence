import fs from 'fs';

const path = '/Users/aryan/Desktop/A-Project/frontend/src/components/ReportDashboard.jsx';
let content = fs.readFileSync(path, 'utf8');

// Replace all instances of report. with data. EXCEPT the ones that refer to the store (e.g. const { report, partialReport })
content = content.replace(/report\./g, 'data.');
// Fix ActionToolbar report prop
content = content.replace(/ActionToolbar report=\{data\}/g, 'ActionToolbar report={data}');

// Let's add Animation wrappers around the main sections so they pop in
content = content.replace(
  /<div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl">([\s\S]*?)<TrendingUp/g,
  `{data.executive_summary && (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl">
$1<TrendingUp`
);
content = content.replace(
  /<\/h2>\n\s*<p className="text-zinc-300 leading-relaxed text-lg">\{data\.executive_summary\}<\/p>\n\s*<\/div>/g,
  `</h2>
            <p className="text-zinc-300 leading-relaxed text-lg">{data.executive_summary}</p>
          </motion.div>
          )}`
);

fs.writeFileSync(path, content);
console.log("Successfully replaced report. with data.");
