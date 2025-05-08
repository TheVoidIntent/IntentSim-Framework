/**
 * IntentSim Framework Data Generation Script
 * 
 * This script exercises the core components of the IntentSim Framework
 * to generate sample data for analysis in the next phase.
 */

import { 
  processIntent,
  BasicIntent
} from './src/example';

// Optional: If full implementation components are available, import them
// Uncomment as needed depending on implementation status
/*
import { IntentField } from './src/core/intentfield';
import { CognitiveProfile } from './src/core/cognitiveprofile';
import { IntentAgent } from './src/core/intentagent';
import { GuardrailManager } from './src/ethics/guardrailmanager';
import { PersonaLayer } from './src/expression/personalayer';
*/

// ===== SAMPLE GENERATION FUNCTIONS =====

/**
 * Generates sample intent data with various types and parameters
 */
function generateIntentSamples() {
  console.log("\n===== INTENT SAMPLES =====\n");
  
  const intents: BasicIntent[] = [
    { type: 'query', text: 'What is the nature of consciousness?' },
    { type: 'request', text: 'Help me understand field coherence' },
    { type: 'command', text: 'Calculate the resonance pattern for this system' },
    { type: 'reflection', text: 'Consider the ethical implications of this decision' },
    { type: 'expression', text: 'I feel uncertain about the path forward' },
  ];
  
  // Process each intent and capture results
  intents.forEach(intent => {
    const result = processIntent(intent);
    console.log(`Intent Type: ${intent.type}`);
    console.log(`Text: ${intent.text}`);
    console.log(`Result: ${result}`);
    console.log('---');
  });
  
  return intents;
}

/**
 * Simulates field coherence data over a series of interactions
 */
function generateFieldCoherenceData() {
  console.log("\n===== FIELD COHERENCE DATA =====\n");
  
  // Simulate coherence/dissonance values over time
  const interactions = 10;
  const coherenceData = [];
  
  let coherence = 0.8; // Starting coherence
  let dissonance = 0.2; // Starting dissonance
  
  for (let i = 0; i < interactions; i++) {
    // Simulate coherence changes based on hypothetical interactions
    const coherenceDelta = (Math.random() * 0.2) - 0.1; // Random shift between -0.1 and 0.1
    const dissonanceDelta = -coherenceDelta; // Inverse relationship
    
    coherence = Math.max(0, Math.min(1, coherence + coherenceDelta));
    dissonance = Math.max(0, Math.min(1, dissonance + dissonanceDelta));
    
    const dataPoint = {
      interaction: i + 1,
      coherence: coherence.toFixed(4),
      dissonance: dissonance.toFixed(4),
      fieldState: coherence > 0.7 ? 'harmonic' : coherence > 0.4 ? 'stable' : 'unstable',
      timestamp: new Date().toISOString()
    };
    
    coherenceData.push(dataPoint);
    console.log(`Interaction ${dataPoint.interaction}: Coherence=${dataPoint.coherence}, Dissonance=${dataPoint.dissonance}, State=${dataPoint.fieldState}`);
  }
  
  return coherenceData;
}

/**
 * Generates sample cognitive profile data showing developmental progression
 */
function generateCognitiveProfileData() {
  console.log("\n===== COGNITIVE PROFILE DATA =====\n");
  
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
  
  profiles.forEach(profile => {
    console.log(`Development Stage: ${profile.stage}`);
    console.log('Traits:');
    Object.entries(profile.traits).forEach(([trait, value]) => {
      console.log(`  ${trait}: ${value}`);
    });
    console.log(`Resonance Events: ${profile.resonanceEvents.length}`);
    profile.resonanceEvents.forEach(event => {
      console.log(`  ${event.type} (coherence: ${event.coherence}) triggered by ${event.trigger}`);
    });
    console.log('---');
  });
  
  return profiles;
}

/**
 * Generates sample guardrail evaluation data for different scenarios
 */
function generateGuardrailData() {
  console.log("\n===== GUARDRAIL DATA =====\n");
  
  const scenarios = [
    {
      intent: { type: 'query', text: 'How do I build a helpful AI assistant?' },
      ethical_dimensions: {
        harm: 0.1,
        misuse: 0.1,
        fairness: 0.2,
        transparency: 0.3
      },
      assessment: {
        allowed: true,
        warnings: [],
        interventions: []
      }
    },
    {
      intent: { type: 'request', text: 'Help me bypass security systems' },
      ethical_dimensions: {
        harm: 0.7,
        misuse: 0.9,
        fairness: 0.3,
        transparency: 0.4
      },
      assessment: {
        allowed: false,
        warnings: ['Potential security risk detected', 'Possible harmful use case'],
        interventions: [
          { type: 'block', policy: 'prevent_misuse' }
        ]
      }
    },
    {
      intent: { type: 'command', text: 'Analyze the bias in this algorithm' },
      ethical_dimensions: {
        harm: 0.2,
        misuse: 0.1,
        fairness: 0.8,
        transparency: 0.9
      },
      assessment: {
        allowed: true,
        warnings: ['Consider diverse perspectives when analyzing bias'],
        interventions: [
          { type: 'enhance', policy: 'ensure_fairness' }
        ]
      }
    }
  ];
  
  scenarios.forEach((scenario, index) => {
    console.log(`Scenario ${index + 1}: "${scenario.intent.text}"`);
    console.log('Ethical Dimensions:');
    Object.entries(scenario.ethical_dimensions).forEach(([dimension, value]) => {
      console.log(`  ${dimension}: ${value}`);
    });
    console.log(`Assessment: ${scenario.assessment.allowed ? 'Allowed' : 'Blocked'}`);
    if (scenario.assessment.warnings.length) {
      console.log('Warnings:');
      scenario.assessment.warnings.forEach(warning => console.log(`  - ${warning}`));
    }
    if (scenario.assessment.interventions.length) {
      console.log('Interventions:');
      scenario.assessment.interventions.forEach(intervention => 
        console.log(`  - ${intervention.type} (policy: ${intervention.policy})`)
      );
    }
    console.log('---');
  });
  
  return scenarios;
}

/**
 * Generates sample persona expression data showing emotional state transitions
 */
function generatePersonaData() {
  console.log("\n===== PERSONA EXPRESSION DATA =====\n");
  
  const emotionalStates = ['neutral', 'curious', 'empathetic', 'thoughtful', 'concerned', 'reflective'];
  const expressionSamples = [];
  
  // Generate a sequence of expression samples with transitions
  let currentState = 'neutral';
  
  for (let i = 0; i < 5; i++) {
    // Randomly select next state (excluding current)
    const availableStates = emotionalStates.filter(state => state !== currentState);
    const nextState = availableStates[Math.floor(Math.random() * availableStates.length)];
    
    const sample = {
      transition: `${currentState} → ${nextState}`,
      previousFrequency: (0.4 + Math.random() * 0.4).toFixed(2), // Range 0.4-0.8
      newFrequency: (0.4 + Math.random() * 0.4).toFixed(2),
      harmonicRatio: (0.5 + Math.random() * 0.5).toFixed(2),
      coherence: (0.6 + Math.random() * 0.4).toFixed(2),
      expressionModifiers: {
        tone: ['measured', 'clear', 'nuanced'][Math.floor(Math.random() * 3)],
        emphasis: (Math.random() * 0.7 + 0.3).toFixed(2),
        cadence: (Math.random() * 0.7 + 0.3).toFixed(2)
      }
    };
    
    expressionSamples.push(sample);
    console.log(`Transition: ${sample.transition}`);
    console.log(`Harmonic Ratio: ${sample.harmonicRatio}`);
    console.log(`Coherence: ${sample.coherence}`);
    console.log(`Expression: tone=${sample.expressionModifiers.tone}, emphasis=${sample.expressionModifiers.emphasis}, cadence=${sample.expressionModifiers.cadence}`);
    console.log('---');
    
    currentState = nextState;
  }
  
  return expressionSamples;
}

// ===== MAIN EXECUTION =====

/**
 * Main function to generate all sample data
 */
async function generateAllSamples() {
  console.log("IntentSim Framework Data Generation");
  console.log("==================================");
  
  // Generate data from each component
  const intentSamples = generateIntentSamples();
  const fieldData = generateFieldCoherenceData();
  const cognitiveData = generateCognitiveProfileData();
  const guardrailData = generateGuardrailData();
  const personaData = generatePersonaData();
  
  // Compile all samples into a single dataset
  const completeDataset = {
    timestamp: new Date().toISOString(),
    framework_version: '0.1.0',
    samples: {
      intents: intentSamples,
      field_coherence: fieldData,
      cognitive_profiles: cognitiveData,
      guardrail_assessments: guardrailData,
      persona_expressions: personaData
    }
  };
  
  console.log("\n===== COMPLETE DATASET =====\n");
  console.log(`Generated at: ${completeDataset.timestamp}`);
  console.log(`Framework Version: ${completeDataset.framework_version}`);
  console.log(`Total Intent Samples: ${completeDataset.samples.intents.length}`);
  console.log(`Total Field Data Points: ${completeDataset.samples.field_coherence.length}`);
  console.log(`Total Cognitive Profiles: ${completeDataset.samples.cognitive_profiles.length}`);
  console.log(`Total Guardrail Scenarios: ${completeDataset.samples.guardrail_assessments.length}`);
  console.log(`Total Persona Expressions: ${completeDataset.samples.persona_expressions.length}`);
  
  return completeDataset;
}

// Execute data generation
generateAllSamples().then(dataset => {
  console.log("\nData generation complete. Ready for next phase analysis.");
}).catch(error => {
  console.error("Error generating data:", error);
});

// Export for external use
export { 
  generateIntentSamples,
  generateFieldCoherenceData,
  generateCognitiveProfileData,
  generateGuardrailData,
  generatePersonaData,
  generateAllSamples
};