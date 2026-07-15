const fs = require('fs');
const glob = require('glob'); // Not available by default, use standard readdir

const path = require('path');
function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(function(file) {
        file = dir + '/' + file;
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) { 
            results = results.concat(walk(file));
        } else if (file.endsWith('.js') || file.endsWith('.jsx')) {
            results.push(file);
        }
    });
    return results;
}

const files = walk('./src');
files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let original = content;
    
    // Replace hardcoded localhost strings
    content = content.replace(/'http:\/\/localhost:8000\/api\/v1/g, "(import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1') + '");
    
    // Replace hardcoded localhost inside template literals
    content = content.replace(/http:\/\/localhost:8000\/api\/v1/g, "${import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1'}");
    
    // AgentTrace has a typo '/api/research'
    content = content.replace(/'http:\/\/localhost:8000\/api\/research'/g, "(import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1') + '/research'");
    
    if (original !== content) {
        fs.writeFileSync(file, content);
        console.log(`Updated ${file}`);
    }
});
