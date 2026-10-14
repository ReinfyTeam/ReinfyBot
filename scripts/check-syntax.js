const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");

const roots = ["index.js", "commands", "events", "scripts"];
const files = [];

function collect(value) {
  const absolute = path.resolve(value);
  if (fs.statSync(absolute).isFile()) {
    files.push(absolute);
    return;
  }

  for (const entry of fs.readdirSync(absolute, { withFileTypes: true })) {
    const child = path.join(absolute, entry.name);
    if (entry.isDirectory()) {
      collect(child);
    } else if (entry.isFile() && child.endsWith(".js")) {
      files.push(child);
    }
  }
}

for (const root of roots) {
  collect(root);
}

let failed = false;
for (const file of files.sort()) {
  const result = spawnSync(process.execPath, ["--check", file], { stdio: "inherit" });
  if (result.status !== 0) {
    failed = true;
  }
}

process.exitCode = failed ? 1 : 0;
