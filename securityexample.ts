import { IntentGuardian } from '../src/agents/IntentGuardian';

/**
 * Security implementation example for IntentSim[on] Framework
 */
async function main() {
  console.log('🔐 IntentSim[on] Framework Security Example');
  
  // Create an IntentGuardian with license verification
  const guardian = new IntentGuardian({
    name: 'SimLock Alpha',
    security: {
      agentId: 'IntentSim[on]-001',
      licenseKey: process.env.INTENT_LICENSE_KEY || 'DEMO-LICENSE-KEY',
      enforcementLevel: 'strict'
    },
    watchlist: [
      'intentField.js', 
      'symbolicIntentResolver.js', 
      'CognitiveProfile.js',
      'GuardrailManager.js'
    ]
  });
  
  // Activate the guardian
  guardian.activate();
  console.log(`Guardian ${guardian.name} activated with security monitoring`);
  
  // Get monitoring status
  const status = guardian.getMonitoringStatus();
  console.log(`Monitoring status: ${status.active ? 'ACTIVE' : 'INACTIVE'}`);
  console.log(`Watching ${status.watchlistFiles.length} files:`);
  status.watchlistFiles.forEach(file => console.log(`- ${file}`));
  
  // Simulate valid access
  console.log('\n--- Simulating Valid Access ---');
  const validResult = guardian.monitor({
    file: 'symbolicIntentResolver.js',
    origin: 'localhost:3000',
    containsEquation: true,
    licenseKey: process.env.INTENT_LICENSE_KEY || 'DEMO-LICENSE-KEY'
  });
  
  console.log(`Access allowed: ${validResult.allowed}`);
  console.log(`Message: ${validResult.message}`);
  
  // Simulate invalid access
  console.log('\n--- Simulating Invalid Access ---');
  try {
    const invalidResult = guardian.monitor({
      file: 'intentField.js',
      origin: 'external-site.com',
      containsEquation: true,
      licenseKey: 'INVALID-KEY'
    });
    
    console.log(`Access allowed: ${invalidResult.allowed}`);
    console.log(`Message: ${invalidResult.message}`);
  } catch (error) {
    console.error(`Security exception: ${error.message}`);
  }
  
  // Check field dissonance
  console.log('\n--- Checking Field Dissonance ---');
  const dissonanceCheck = guardian.checkFieldDissonance();
  console.log(`Current dissonance level: ${dissonanceCheck.currentDissonance.toFixed(2)}`);
  console.log(`Security implications: ${dissonanceCheck.securityImplications ? 'YES' : 'NO'}`);
  
  if (dissonanceCheck.recommendedAction) {
    console.log(`Recommended action: ${dissonanceCheck.recommendedAction}`);
  }
  
  // If dissonance is high, demonstrate scrubbing
  if (dissonanceCheck.currentDissonance > 0.7) {
    console.log('\n--- Initiating Dissonance Scrubbing ---');
    const scrubbingResult = guardian.scrubFieldDissonance(dissonanceCheck.currentDissonance);
    console.log(`Scrubbing initiated: ${scrubbingResult.initiated}`);
    console.log(`Dissonance reduction: ${scrubbingResult.dissonanceReduction.toFixed(2)}`);
    console.log(`Result: ${scrubbingResult.message}`);
  }
  
  // Get final status
  const finalStatus = guardian.getMonitoringStatus();
  console.log('\n--- Final Monitoring Status ---');
  console.log(`Total events monitored: ${finalStatus.eventsMonitored}`);
  
  if (finalStatus.lastEvent) {
    console.log(`Last event: ${new Date(finalStatus.lastEvent.timestamp).toISOString()}`);
    console.log(`File: ${finalStatus.lastEvent.file}`);
    console.log(`Outcome: ${finalStatus.lastEvent.outcome}`);
  }
  
  console.log('\nSecurity integration complete.');
}

// Run the example
main().catch(console.error);
