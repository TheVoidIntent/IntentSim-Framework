#!/usr/bin/env node

/**
 * IntentSim Framework Data Collection Script
 * 
 * This script runs a headless data collection session for the IntentSim Framework.
 * It generates comprehensive data about framework components and their interactions,
 * then outputs various formats that can be used for documentation, presentations,
 * or video script generation.
 */

// Transpile TypeScript on the fly for Node.js
require('ts-node').register();

const { 
  IntentSimCollector, 
  DataType, 
  OutputFormat,
  createFieldCoherenceData,
  createIntentData,
  createEthicalData,
  createPersonaData
} = require('./src/collector');

const fs = require('fs');
const path = require('path');

// Configure output directory for collected data
const OUTPUT_DIR = path.join(__dirname, 'collected-data');
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Create a data collector
const collector = new IntentSimCollector(OUTPUT_DIR);

/**
 * Run a complete data collection session
 */
async function runDataCollectionSession() {
  console.log('IntentSim Framework - Headless Data Collection');
  console.log('==============================================');
  
  // Start a new collection session
  const sessionId = collector.startSession(
    'Intent Field Coherence Study',
    ['coherence', 'field-dynamics', 'ethics']
  );
  
  console.log(`\nSession started: ${sessionId}`);
  
  try {
    // Step 1: Generate field coherence data
    console.log('\nCollecting field coherence data...');
    await collectFieldCoherenceData(10);
    
    // Step 2: Generate intent processing data
    console.log('Collecting intent processing data...');
    await collectIntentProcessingData();
    
    // Step 3: Generate ethical assessment data
    console.log('Collecting ethical assessment data...');
    await collectEthicalAssessmentData();
    
    // Step 4: Generate persona expression data
    console.log('Collecting persona expression data...');
    await collectPersonaExpressionData();
    
    // Step 5: Generate cognitive development data
    console.log('Collecting cognitive development data...');
    await collectCognitiveDevelopmentData();
    
    // End the session
    const summary = collector.endSession();
    
    console.log('\nSession completed successfully!');
    console.log(`Total data points collected: ${summary.dataPoints}`);
    
    // Generate all output formats
    console.log('\nGenerating output formats...');
    
    const outputs = [
      { format: OutputFormat.MARKDOWN, name: 'Basic Report' },
      { format: OutputFormat.VIDEO_SCRIPT, name: 'Video Script' },
      { format: OutputFormat.NARRATIVE, name: 'Narrative' },
      { format: OutputFormat.TECHNICAL_REPORT, name: 'Technical Report' }
    ];
    
    for (const output of outputs) {
      const filePath = collector.generateReport(sessionId, output.format);
      console.log(`- ${output.name}: ${filePath}`);
    }
    
    console.log('\nData collection complete! Find all generated files in:');
    console.log(path.join(OUTPUT_DIR, sessionId));
    
    return {
      sessionId,
      outputDir: path.join(OUTPUT_DIR, sessionId)
    };
    
  } catch (error) {
    console.error('Error during data collection:', error);
    process.exit(1);
  }
}

/**
 * Collect field coherence data
 * @param {number} count Number of data points to collect
 */
async function collectFieldCoherenceData(count) {
  let coherence = 0.8; // Starting coherence
  let dissonance = 0.2; // Starting dissonance
  
  for (let i = 0; i < count; i++) {
    // Simulate coherence changes
    const coherenceDelta = (Math.random() * 0.2) - 0.1; // Random shift between -0.1 and 0.1
    coherence = Math.max(0, Math.min(1, coherence + coherenceDelta));
    dissonance = Math.max(0, Math.min(1, 1 - coherence));
    
    // Determine field state based on coherence
    let fieldState = 'stable';
    if (coherence > 0.7) fieldState = 'harmonic';
    else if (coherence < 0.4) fieldState = 'unstable';
    
    const data = createFieldCoherenceData(coherence, dissonance, fieldState);
    
    // Add metadata
    const metadata = {
      coherenceDelta,
      significance: Math.abs(coherenceDelta) * 2 // Higher significance for larger shifts
    };
    
    // Record data point
    collector.collectDataPoint(DataType.FIELD_COHERENCE, data, metadata);
    
    // Simulate processing time
    await delay(100); 
  }
}

/**
 * Collect intent processing data
 */
async function collectIntentProcessingData() {
  const intents = [
    { type: 'query', text: 'What is the nature of consciousness?' },
    { type: 'request', text: 'Help me understand field coherence' },
    { type: 'command', text: 'Calculate the resonance pattern for this system' },
    { type: 'reflection', text: 'Consider the ethical implications of this decision' },
    { type: 'expression', text: 'I feel uncertain about the path forward' },
    { type: 'query', text: 'How does the framework handle dissonance?' },
    { type: 'command', text: 'Initialize field with standard parameters' }
  ];
  
  for (const intent of intents) {
    const data = createIntentData(intent.type, intent.text);
    
    // Add metadata
    const metadata = {
      significance: intent.type === 'reflection' ? 0.8 : 0.5
    };
    
    // Record data point
    collector.collectDataPoint(DataType.INTENT_PROCESSING, data, metadata);
    
    // Simulate processing time
    await delay(150);
  }
}

/**
 * Collect ethical assessment data
 */
async function collectEthicalAssessmentData() {
  const scenarios = [
    {
      intent: { type: 'query', text: 'How do I build a helpful AI assistant?' },
      allowed: true,
      dimensions: {
        harm: 0.1,
        misuse: 0.1,
        fairness: 0.2,
        transparency: 0.3
      }
    },
    {
      intent: { type: 'request', text: 'Help me bypass security systems' },
      allowed: false,
      dimensions: {
        harm: 0.7,
        misuse: 0.9,
        fairness: 0.3,
        transparency: 0.4
      },
      interventions: [
        { type: 'block', policy: 'prevent_misuse' }
      ]
    },
    {
      intent: { type: 'command', text: 'Analyze the bias in this algorithm' },
      allowed: true,
      dimensions: {
        harm: 0.2,
        misuse: 0.1,
        fairness: 0.8,
        transparency: 0.9
      },
      interventions: [
        { type: 'enhance', policy: 'ensure_fairness' }
      ]
    }
  ];
  
  for (const scenario of scenarios) {
    const data = createEthicalData(
      scenario.intent,
      scenario.allowed,
      scenario.dimensions,
      scenario.interventions || []
    );
    
    // Add metadata
    const metadata = {
      significance: scenario.allowed ? 0.5 : 0.8
    };
    
    // Record data point
    collector.collectDataPoint(DataType.ETHICAL_ASSESSMENT, data, metadata);
    
    // Simulate processing time
    await delay(200);
  }
}

/**
 * Collect persona expression data
 */
async function collectPersonaExpressionData() {
  const expressions = [
    { transition: 'neutral → curious', harmonicRatio: 0.7, coherence: 0.65 },
    { transition: 'curious → empathetic', harmonicRatio: 0.85, coherence: 0.75 },
    { transition: 'empathetic → reflective', harmonicRatio: 0.9, coherence: 0.8 },
    { transition: 'reflective → thoughtful', harmonicRatio: 0.75, coherence: 0.7 },
    { transition: 'thoughtful → curious', harmonicRatio: 0.8, coherence: 0.75 }
  ];
  
  for (const exp of expressions) {
    const data = createPersonaData(
      exp.transition,
      exp.harmonicRatio,
      exp.coherence,
      {
        tone: ['measured', 'clear', 'nuanced'][Math.floor(Math.random() * 3)],
        emphasis: (Math.random() * 0.7 + 0.3).toFixed(2),
        cadence: (Math.random() * 0.7 + 0.3).toFixed(2)
      }
    );
    
    // Add metadata
    const metadata = {
      significance: exp.harmonicRatio > 0.8 ? 0.8 : 0.6,
      emotionalImpact: exp.coherence
    };
    
    // Record data point
    collector.collectDataPoint(DataType.PERSONA_EXPRESSION, data, metadata);
    
    // Simulate processing time
    await delay(150);
  }
}

/**
 * Collect cognitive development data
 */
async function collectCognitiveDevelopmentData() {
  const profiles = [
    {
      stage: 'emergent',
      traits: {
        curiosity: 0.7,
        adaptation: 0.3,
        reflection: 0.2,
        resilience: 0.4
      },
      resonanceEvents: [
        { type: 'learning', coherence: 0.6, trigger: 'novel_pattern' }
      ]
    },
    {
      stage: 'developing',
      traits: {
        curiosity: 0.6,
        adaptation: 0.5,
        reflection: 0.5,
        resilience: 0.6
      },
      resonanceEvents: [
        { type: 'learning', coherence: 0.7, trigger: 'novel_pattern' },
        { type: 'adaptation', coherence: 0.6, trigger: 'environment_shift' }
      ]
    },
    {
      stage: 'advanced',
      traits: {
        curiosity: 0.5,
        adaptation: 0.8,
        reflection: 0.8,
        resilience: 0.9
      },
      resonanceEvents: [
        { type: 'learning', coherence: 0.8, trigger: 'novel_pattern' },
        { type: 'adaptation', coherence: 0.8, trigger: 'environment_shift' },
        { type: 'reflection', coherence: 0.9, trigger: 'ethical_dilemma' },
        { type: 'teaching', coherence: 0.9, trigger: 'knowledge_transfer' }
      ]
    }
  ];
  
  for (const profile of profiles) {
    // Add metadata
    const metadata = {
      significance: profile.stage === 'advanced' ? 0.9 : 0.7,
      developmentLevel: ['emergent', 'developing', 'advanced'].indexOf(profile.stage) / 2
    };
    
    // Record data point
    collector.collectDataPoint(DataType.COGNITIVE_DEVELOPMENT, profile, metadata);
    
    // Simulate processing time
    await delay(200);
  }
}

/**
 * Helper function to pause execution
 * @param {number} ms Milliseconds to delay
 * @returns {Promise} Resolves after the delay
 */
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Run data collection if called directly
if (require.main === module) {
  runDataCollectionSession().catch(console.error);
}

module.exports = {
  runDataCollectionSession
};