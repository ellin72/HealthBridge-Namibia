#!/usr/bin/env node
/**
 * Cross-platform wrapper for migration scripts
 * Detects OS and runs the appropriate script (PowerShell for Windows, Bash for Unix-like)
 */

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const isWindows = process.platform === 'win32';
const scriptDir = __dirname;

function runScript(scriptName, args = []) {
  let command;
  
  if (isWindows) {
    const psScript = path.join(scriptDir, `${scriptName}.ps1`);
    if (!fs.existsSync(psScript)) {
      console.error(`❌ Error: ${psScript} not found`);
      process.exit(1);
    }
    // For PowerShell, handle migration name parameter specially
    if (scriptName === 'migrate-dev-docker' && args.length > 0) {
      const migrationName = args[0];
      command = `powershell -ExecutionPolicy Bypass -File "${psScript}" -MigrationName "${migrationName}"`;
    } else {
      const argsStr = args.length > 0 ? ` ${args.map(a => `"${a}"`).join(' ')}` : '';
      command = `powershell -ExecutionPolicy Bypass -File "${psScript}"${argsStr}`;
    }
  } else {
    const shScript = path.join(scriptDir, `${scriptName}.sh`);
    if (!fs.existsSync(shScript)) {
      console.error(`❌ Error: ${shScript} not found`);
      process.exit(1);
    }
    // Make sure script is executable
    try {
      fs.chmodSync(shScript, '755');
    } catch (e) {
      // Ignore chmod errors on Windows
    }
    const argsStr = args.length > 0 ? ` ${args.join(' ')}` : '';
    command = `bash "${shScript}"${argsStr}`;
  }
  
  try {
    execSync(command, { stdio: 'inherit', cwd: scriptDir });
  } catch (error) {
    process.exit(error.status || 1);
  }
}

// Get script name and arguments from command line
const scriptName = process.argv[2];
const args = process.argv.slice(3);

if (!scriptName) {
  console.error('Usage: node run-migration-wrapper.js <script-name> [args...]');
  console.error('Example: node run-migration-wrapper.js run-migration-docker');
  process.exit(1);
}

runScript(scriptName, args);

