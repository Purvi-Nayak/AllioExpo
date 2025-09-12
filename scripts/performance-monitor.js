#!/usr/bin/env node

// Performance monitoring script for Expo projects
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('📊 Expo Performance Monitor\n');

// Check project size
function getProjectSize() {
  try {
    const nodeModulesSize = execSync('du -sh node_modules 2>/dev/null || echo "0B node_modules"', { encoding: 'utf8' });
    const projectSize = execSync('du -sh . --exclude=node_modules --exclude=android/build --exclude=.expo 2>/dev/null || echo "0B ."', { encoding: 'utf8' });
    
    console.log('📦 Project Size Analysis:');
    console.log(`   Total project: ${projectSize.trim()}`);
    console.log(`   node_modules: ${nodeModulesSize.trim()}`);
  } catch (error) {
    console.log('📦 Project Size: Unable to calculate');
  }
}

// Check for large files
function checkLargeFiles() {
  try {
    console.log('\n📁 Large Files (>1MB):');
    const largeFiles = execSync('find . -type f -size +1M -not -path "./node_modules/*" -not -path "./android/build/*" -not -path "./.expo/*" 2>/dev/null | head -10', { encoding: 'utf8' });
    
    if (largeFiles.trim()) {
      largeFiles.trim().split('\n').forEach(file => {
        try {
          const size = execSync(`du -h "${file}" | cut -f1`, { encoding: 'utf8' }).trim();
          console.log(`   ${size} - ${file}`);
        } catch (e) {
          console.log(`   ? - ${file}`);
        }
      });
    } else {
      console.log('   ✅ No large files found');
    }
  } catch (error) {
    console.log('   📁 Unable to scan for large files');
  }
}

// Check dependencies
function checkDependencies() {
  try {
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    const depCount = Object.keys(packageJson.dependencies || {}).length;
    const devDepCount = Object.keys(packageJson.devDependencies || {}).length;
    
    console.log('\n📚 Dependencies Analysis:');
    console.log(`   Production deps: ${depCount}`);
    console.log(`   Development deps: ${devDepCount}`);
    console.log(`   Total: ${depCount + devDepCount}`);
    
    if (depCount + devDepCount > 50) {
      console.log('   ⚠️  High dependency count may slow startup');
    } else {
      console.log('   ✅ Dependency count looks good');
    }
  } catch (error) {
    console.log('📚 Unable to analyze dependencies');
  }
}

// Performance recommendations
function showRecommendations() {

  
  // Check if Metro cache exists
  if (fs.existsSync('.metro-cache')) {
    console.log('   ⚠️  Metro cache found - run "npm run clean" to clear');
  }
  
  // Check if .expo cache exists
  if (fs.existsSync('.expo')) {
    console.log('   ⚠️  Expo cache found - will be cleared on next start');
  }
}

// Run all checks
console.log('Starting performance analysis...\n');
getProjectSize();
checkLargeFiles();
checkDependencies();
showRecommendations();

console.log('\n✅ Performance analysis complete!');
console.log('💡 Run "./scripts/optimize-performance.sh" to apply optimizations');
