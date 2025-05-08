#!/usr/bin/env node

/**
 * Sample Data Generation Script for IntentSim Framework
 * 
 * Compiles and runs the data generation typescript file,
 * then saves the results to a JSON file for further analysis.
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Output directory for samples
const OUTPUT_DIR = path.join(__dirname, 'samples');

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Create timestamped filename
const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
const outputFile = path.join(OUTPUT_DIR, `intentsim-samples-${timestamp}.json`);

try {
  // Step 1: Compile the TypeScript file
  console.log('Compiling data generation script...');
  execSync('npx tsc data-generation.ts --esModuleInterop true', { stdio: 'inherit' });
  
  // Step 2: Run the compiled JavaScript
  console.log('Running data generation...');
  
  // Capture the output in a variable
  const dataOutput = execSync('node data-generation.js', { encoding: 'utf8' });
  
  // Step 3: Extract the dataset from the console output
  // This is a simple approach - in a real implementation, you'd modify 
  // the TS file to write JSON directly
  console.log('Processing generated data...');
  
  // Create a structured dataset based on the console output
  const lines = dataOutput.split('\n');
  
  // Extract data for each section
  const extractSection = (startMarker, endMarker = '=====') => {
    const startIdx = lines.findIndex(line => line.includes(startMarker));
    if (startIdx === -1) return [];
    
    let endIdx = lines.findIndex((line, idx) => idx > startIdx && line.includes(endMarker));
    if (endIdx === -1) endIdx = lines.length;
    
    return lines.slice(startIdx, endIdx).join('\n');
  };
  
  const intentData = extractSection('INTENT SAMPLES');
  const fieldData = extractSection('FIELD COHERENCE DATA');
  const cognitiveData = extractSection('COGNITIVE PROFILE DATA');
  const guardrailData = extractSection('GUARDRAIL DATA');
  const personaData = extractSection('PERSONA EXPRESSION DATA');
  
  // Create dataset JSON
  const dataset = {
    metadata: {
      framework: 'IntentSim',
      version: '0.1.0',
      generated: new Date().toISOString(),
      description: 'Sample data generated from IntentSim Framework components'
    },
    samples: {
      intent: intentData,
      field: fieldData,
      cognitive: cognitiveData,
      guardrail: guardrailData,
      persona: personaData
    },
    raw_output: dataOutput
  };
  
  // Step 4: Save the dataset to a JSON file
  fs.writeFileSync(outputFile, JSON.stringify(dataset, null, 2));
  
  console.log(`\nData generation complete!`);
  console.log(`\nSample data saved to: ${outputFile}`);
  console.log(`\nTotal sections captured:`);
  console.log(`- Intent data: ${intentData.length > 0 ? '✓' : '×'}`);
  console.log(`- Field coherence data: ${fieldData.length > 0 ? '✓' : '×'}`);
  console.log(`- Cognitive profile data: ${cognitiveData.length > 0 ? '✓' : '×'}`);
  console.log(`- Guardrail data: ${guardrailData.length > 0 ? '✓' : '×'}`);
  console.log(`- Persona expression data: ${personaData.length > 0 ? '✓' : '×'}`);
  
  // Clean up
  try {
    fs.unlinkSync('data-generation.js');
  } catch (e) {
    // Ignore cleanup errors
  }
  
} catch (error) {
  console.error('Error generating samples:', error.message);
  process.exit(1);
}