const fs = require('fs');
const path = require('path');

const walk = (dir, done) => {
  let results = [];
  fs.readdir(dir, (err, list) => {
    if (err) return done(err);
    let pending = list.length;
    if (!pending) return done(null, results);
    list.forEach((file) => {
      file = path.resolve(dir, file);
      fs.stat(file, (err, stat) => {
        if (stat && stat.isDirectory()) {
          if (file.includes('node_modules') || file.includes('.next') || file.includes('.git') || file.includes('out') || file.includes('.vercel')) {
            if (!--pending) done(null, results);
            return;
          }
          walk(file, (err, res) => {
            results = results.concat(res);
            if (!--pending) done(null, results);
          });
        } else {
          results.push(file);
          if (!--pending) done(null, results);
        }
      });
    });
  });
};

walk('./', (err, results) => {
  if (err) throw err;
  let count = 0;
  results.forEach((file) => {
    if (file.endsWith('.js') || file.endsWith('.ts') || file.endsWith('.tsx') || file.endsWith('.json') || file.endsWith('.md') || file.endsWith('.html') || file.endsWith('.css') || file.endsWith('.env')) {
      const content = fs.readFileSync(file, 'utf8');
      const newContent = content.replace(/AuraConvert/g, 'AuraConvert').replace(/auraconvert/g, 'auraconvert');
      if (content !== newContent) {
        fs.writeFileSync(file, newContent, 'utf8');
        count++;
        console.log("Updated", file);
      }
    }
  });
  console.log("Updated " + count + " files.");
});
