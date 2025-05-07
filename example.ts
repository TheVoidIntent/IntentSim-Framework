import { IntentAgent } from '../src';

/**
 * Basic example of using the IntentSim[on] Framework
 */
async function main() {
  console.log('🔮 IntentSim[on] Framework Basic Example');
  
  // Create a simple agent
  const agent = new IntentAgent({
    name: 'Harmony',
    archetype: 'assistant',
    enableHarmonicSelfTuning: true,
    personaParams: {
      characteristics: {
        warmth: 0.8,
        depth: 0.7,
        authenticity: 0.9,
        formality: 0.4
      }
    }
  });
  
  // Activate the agent
  agent.activate();
  console.log(`Agent ${agent.name} activated with archetype: ${agent.archetype}`);
  console.log(`Current state: coherence=${agent.state.coherence.toFixed(2)}, dissonance=${agent.state.dissonance.toFixed(2)}`);
  
  // Register event listeners
  agent.on('response', (data) => {
    console.log(`\nEvent: Response generated`);
    console.log(`Field state: coherence=${data.state.coherence.toFixed(2)}, dissonance=${data.state.dissonance.toFixed(2)}`);
    console.log(`Emotional state: ${data.state.emotionalState}`);
  });
  
  agent.on('resonance', (data) => {
    console.log(`\nEvent: Resonance detected (magnitude: ${data.magnitude.toFixed(2)})`);
  });
  
  agent.on('dissonance', (data) => {
    console.log(`\nEvent: Dissonance detected (magnitude: ${data.magnitude.toFixed(2)})`);
  });
  
  // Process inputs
  console.log('\n--- Processing Inputs ---');
  
  const inputs = [
    'Hello, can you help me understand the concept of coherence fields?',
    'That\'s fascinating! How does the resonance pattern affect agent development?',
    'Can you show me an example of harmonic self-tuning?'
  ];
  
  for (const input of inputs) {
    console.log(`\n> User: ${input}`);
    
    try {
      const response = await agent.process(input);
      console.log(`\n< ${agent.name} (${response.emotionalState}): ${response.text}`);
      
      if (response.symbolicShift?.length > 0) {
        console.log('\nSymbolic shifts:');
        response.symbolicShift.slice(0, 3).forEach((shift: any) => {
          console.log(`- ${shift.symbol}: ${shift.strength.toFixed(2)} (${shift.trend})`);
        });
      }
    } catch (error) {
      console.error(`Error processing input: ${error}`);
    }
  }
  
  // Check agent development
  const developmentResult = agent.cognitiveProfile.evaluateDevelopmentStage();
  console.log(`\nDevelopment stage: ${agent.cognitiveProfile.developmentStage}`);
  console.log(`Meta-cognitive capabilities:`);
  Object.entries(agent.cognitiveProfile.metaCognition).forEach(([capability, value]) => {
    console.log(`- ${capability}: ${(value as number).toFixed(2)}`);
  });
  
  // Get intent evolution prediction
  const evolutionPrediction = agent.predictIntentEvolution();
  console.log(`\nIntent evolution prediction (${evolutionPrediction.timeframe}):`);
  console.log(`- Current coherence: ${evolutionPrediction.currentState.coherence.toFixed(2)}`);
  console.log(`- Current dissonance: ${evolutionPrediction.currentState.dissonance.toFixed(2)}`);
  console.log(`- Confidence: ${evolutionPrediction.confidence.toFixed(2)}`);
}

// Run the example
main().catch(console.error);
