const fs = require('fs');
const path = require('path');

const walkSync = function(dir, filelist) {
  let files = fs.readdirSync(dir);
  filelist = filelist || [];
  files.forEach(function(file) {
    if (fs.statSync(path.join(dir, file)).isDirectory()) {
      if (!['node_modules', '.next', '.git'].includes(file)) {
        filelist = walkSync(path.join(dir, file), filelist);
      }
    } else {
      if (['.ts', '.tsx', '.js', '.jsx', '.css'].includes(path.extname(file))) {
        filelist.push(path.join(dir, file));
      }
    }
  });
  return filelist;
};

const allFiles = walkSync('.');
let changedFiles = 0;

allFiles.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let newContent = content.replace(/blue/g, 'blue').replace(/indigo/g, 'indigo').replace(/Blue/g, 'Blue').replace(/Indigo/g, 'Indigo');
  if (content !== newContent) {
    fs.writeFileSync(file, newContent, 'utf8');
    changedFiles++;
    console.log('Updated: ' + file);
  }
});

console.log('Total files changed: ' + changedFiles);
