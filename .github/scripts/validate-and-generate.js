const fs = require('fs');
const path = require('path');

const APPS_DIR = 'apks';
const OUTPUT_FILE = 'app.list.json';

function validateAppFolder(folderPath) {
  const files = fs.readdirSync(folderPath);
  const apk = files.find(f => f.endsWith('.apk'));
  const manifest = files.find(f => f === 'manifest.json');

  if (!apk || !manifest) {
    throw new Error(`Folder ${folderPath} is missing required files.`);
  }

  const manifestData = JSON.parse(fs.readFileSync(path.join(folderPath, manifest), 'utf-8'));

  return {
    ...manifestData,
    apk: path.join(folderPath, apk),
  };
}

function main() {
  const apps = [];

  fs.readdirSync(APPS_DIR).forEach(folder => {
    const folderPath = path.join(APPS_DIR, folder);
    if (fs.statSync(folderPath).isDirectory()) {
      try {
        const appData = validateAppFolder(folderPath);
        apps.push(appData);
      } catch (err) {
        console.error(err.message);
      }
    }
  });

  const result = {
    name: "update-post-repo",
    description: "A repo to post updates to the app list",
    version: "1.0",
    author: "Maxime Le Besnerais",
    apps,
    "release-date": new Date().toISOString().split('T')[0]
  };

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(result, null, 2));
  console.log(`Wrote ${OUTPUT_FILE}`);
}

main();
