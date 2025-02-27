const fs = require("fs");
const path = require("path");

const publicDir = path.join(__dirname, "../public/md");
const outputFile = path.join(__dirname, "../public/file-list.json");

function getFiles(dir, baseDir = dir) {
  return fs.readdirSync(dir).flatMap(file => {
    const fullPath = path.join(dir, file);
    const relativePath = "/md/" + path.relative(baseDir, fullPath);
    return fs.statSync(fullPath).isDirectory()
      ? getFiles(fullPath, baseDir)
      : relativePath;
  });
}

const files = getFiles(publicDir);
fs.writeFileSync(outputFile, JSON.stringify(files, null, 2));

console.log("File list generated:", outputFile);
