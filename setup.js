#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const isWindows = process.platform === 'win32';
const serverDir = path.join(__dirname, 'hrp-server');
const venvDir = path.join(serverDir, 'venv');
const envFile = path.join(serverDir, '.env');
const envExampleFile = path.join(serverDir, '.env.example');

function log(message) {
  console.log(`\n📦 ${message}`);
}

function logSuccess(message) {
  console.log(`✅ ${message}`);
}

function logError(message) {
  console.error(`❌ ${message}`);
  process.exit(1);
}

async function main() {
  log('Setting up HRP Monorepo...');

  try {
    // Step 1: Install root dependencies
    log('Installing root dependencies...');
    execSync('npm install', { stdio: 'inherit' });
    logSuccess('Root dependencies installed');

    // Step 2: Install React dependencies
    log('Installing React dependencies...');
    execSync('npm --prefix hrp-react install', { stdio: 'inherit' });
    logSuccess('React dependencies installed');

    // Step 3: Setup Python venv
    log('Creating Python virtual environment...');
    const venvCommand = isWindows
      ? `python -m venv venv`
      : `python3 -m venv venv`;

    try {
      execSync(venvCommand, {
        cwd: serverDir,
        stdio: 'inherit'
      });
      logSuccess('Virtual environment created');
    } catch (err) {
      logError(`Failed to create virtual environment: ${err.message}`);
    }

    // Step 4: Install Python dependencies
    log('Installing Python dependencies...');
    const pipCommand = isWindows
      ? `venv\\Scripts\\pip install -r requirements.txt`
      : `venv/bin/pip install -r requirements.txt`;

    try {
      execSync(pipCommand, {
        cwd: serverDir,
        stdio: 'inherit'
      });
      logSuccess('Python dependencies installed');
    } catch (err) {
      logError(`Failed to install Python dependencies: ${err.message}`);
    }

    // Step 5: Create .env file if it doesn't exist
    if (!fs.existsSync(envFile)) {
      log('Creating .env file from .env.example...');
      if (fs.existsSync(envExampleFile)) {
        fs.copyFileSync(envExampleFile, envFile);
        logSuccess('.env file created');
      } else {
        logError('.env.example not found');
      }
    } else {
      logSuccess('.env file already exists');
    }

    // Summary
    console.log('\n' + '='.repeat(50));
    console.log('✅ Setup Complete!');
    console.log('='.repeat(50));
    console.log('\n🚀 To start development, run:');
    console.log('   npm run dev');
    console.log('\n📂 Project Structure:');
    console.log('   • React:  http://localhost:5173');
    console.log('   • Flask:  http://localhost:5000');
    console.log('   • API:    http://localhost:5000/api');
    console.log('\n' + '='.repeat(50) + '\n');

  } catch (error) {
    logError(`Setup failed: ${error.message}`);
  }
}

main();
