// tests/core/intentfield.test.ts
import { describe, it, expect, beforeEach } from 'vitest';
import { IntentField } from '../../src/core/IntentField';
import { FieldCoherenceMetrics } from '../../src/types/field';

describe('IntentField', () => {
  let field: IntentField;

  beforeEach(() => {
    field = new IntentField();
  });

  it('initializes with default coherence field', () => {
    expect(field.coherenceField).toBeDefined();
    expect(field.getResonanceScore()).toBeGreaterThanOrEqual(0);
    expect(field.getResonanceScore()).toBeLessThanOrEqual(1);
  });

  it('generates field vectors within expected dimensions', () => {
    const vector = field.generateFieldVector();
    expect(vector).toBeDefined();
    expect(Array.isArray(vector)).toBe(true);
    expect(vector.length).toBe(field.FIELD_DIMENSIONS);
  });

  it('correctly calculates field coherence', () => {
    const metrics = field.measureCoherence();
    expect(metrics).toHaveProperty('integrity');
    expect(metrics).toHaveProperty('resonance');
    expect(metrics).toHaveProperty('stability');
    expect(metrics.integrity).toBeGreaterThanOrEqual(0);
    expect(metrics.integrity).toBeLessThanOrEqual(1);
  });

  it('maintains structural sovereignty when perturbed', () => {
    const originalMetrics = field.measureCoherence();
    field.perturbField(0.1); // 10% perturbation
    const perturbedMetrics = field.measureCoherence();
    
    // Field should self-correct and maintain reasonable stability
    expect(perturbedMetrics.stability).toBeGreaterThanOrEqual(0.7);
    
    // After correction cycle, should return close to original state
    field.correctFieldDissonance();
    const correctedMetrics = field.measureCoherence();
    expect(correctedMetrics.resonance).toBeCloseTo(originalMetrics.resonance, 1);
  });
});

// tests/core/intentagent.test.ts
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { IntentAgent } from '../../src/core/IntentAgent';
import { IntentField } from '../../src/core/IntentField';
import { AgentConfig } from '../../src/types/agent';

describe('IntentAgent', () => {
  let agent: IntentAgent;
  let field: IntentField;
  let config: AgentConfig;

  beforeEach(() => {
    field = new IntentField();
    config = {
      name: 'TestAgent',
      intentionality: 0.8,
      autonomy: 0.5,
      fieldSensitivity: 0.7,
    };
    agent = new IntentAgent(config, field);
  });

  it('initializes with provided config and field', () => {
    expect(agent.name).toBe('TestAgent');
    expect(agent.intentionality).toBe(0.8);
    expect(agent.autonomy).toBe(0.5);
    expect(agent.fieldSensitivity).toBe(0.7);
    expect(agent.field).toBe(field);
  });

  it('perceives changes in the intent field', () => {
    const spy = vi.spyOn(agent, 'onFieldChanged');
    field.perturbField(0.2);
    expect(spy).toHaveBeenCalled();
  });

  it('responds appropriately to intent signals', () => {
    const intentSignal = {
      type: 'command',
      content: 'analyze',
      strength: 0.9,
      source: 'user'
    };
    
    const response = agent.processIntentSignal(intentSignal);
    expect(response).toHaveProperty('status');
    expect(response).toHaveProperty('action');
    expect(response.status).toBe('acknowledged');
  });

  it('maintains coherence with field during operations', () => {
    const originalResonance = agent.measureFieldResonance();
    agent.performOperation({ type: 'analyze', target: 'data' });
    const newResonance = agent.measureFieldResonance();
    
    // Agent should remain resonant with field
    expect(newResonance).toBeGreaterThanOrEqual(0.7);
  });
});

// tests/core/cognitiveprofile.test.ts
import { describe, it, expect, beforeEach } from 'vitest';
import { CognitiveProfile } from '../../src/core/CognitiveProfile';
import { IntentField } from '../../src/core/IntentField';

describe('CognitiveProfile', () => {
  let profile: CognitiveProfile;
  let field: IntentField;

  beforeEach(() => {
    field = new IntentField();
    profile = new CognitiveProfile({ field });
  });

  it('initializes with default meta-awareness settings', () => {
    expect(profile.selfAwarenessLevel).toBeGreaterThan(0);
    expect(profile.metaCognitionEnabled).toBe(true);
  });

  it('can process reflective thoughts', () => {
    const reflection = profile.reflect('test observation');
    expect(reflection).toBeDefined();
    expect(reflection).toHaveProperty('insight');
    expect(reflection).toHaveProperty('confidence');
  });

  it('shows appropriate meta-cognitive dynamics', () => {
    // First reflection
    const reflection1 = profile.reflect('initial observation');
    
    // Second reflection on the first
    const metaReflection = profile.reflect(`thinking about: ${reflection1.insight}`);
    
    expect(metaReflection.depth).toBeGreaterThan(reflection1.depth);
    expect(metaReflection).toHaveProperty('metaCognitive', true);
  });

  it('adapts cognitive stance based on field resonance', () => {
    const initialStance = profile.getCurrentCognitiveStance();
    
    // Change field state
    field.perturbField(0.3);
    profile.updateFromField();
    
    const newStance = profile.getCurrentCognitiveStance();
    expect(newStance).not.toEqual(initialStance);
  });
});

// tests/security/securitycore.test.ts
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { SecurityCore } from '../../src/security/SecurityCore';

describe('SecurityCore', () => {
  let securityCore: SecurityCore;
  let mockKillSwitch: () => void;

  beforeEach(() => {
    mockKillSwitch = vi.fn();
    securityCore = new SecurityCore({
      killSwitch: mockKillSwitch,
      licenseKey: 'valid-license-key',
      entropyShieldLevel: 'high'
    });
  });

  it('initializes with provided configuration', () => {
    expect(securityCore.entropyShieldLevel).toBe('high');
    expect(securityCore.isActive).toBe(true);
  });

  it('validates license keys correctly', () => {
    expect(securityCore.validateLicense('valid-license-key')).toBe(true);
    expect(securityCore.validateLicense('invalid-key')).toBe(false);
  });

  it('activates kill switch when security is breached', () => {
    securityCore.reportSecurityBreach('unauthorized access');
    expect(mockKillSwitch).toHaveBeenCalled();
  });

  it('generates secure fingerprints for verification', () => {
    const fingerprint = securityCore.generateFingerprint('test-content');
    expect(fingerprint).toBeDefined();
    expect(typeof fingerprint).toBe('string');
    expect(fingerprint.length).toBeGreaterThan(32); // Reasonable hash length
  });

  it('detects tampering with framework components', () => {
    const originalComponent = { type: 'core', id: 'test', content: 'original' };
    const fingerprint = securityCore.generateFingerprint(JSON.stringify(originalComponent));
    
    const tamperedComponent = { ...originalComponent, content: 'tampered' };
    
    expect(securityCore.verifyFingerprint(JSON.stringify(tamperedComponent), fingerprint)).toBe(false);
    expect(securityCore.verifyFingerprint(JSON.stringify(originalComponent), fingerprint)).toBe(true);
  });
});

// tests/security/intentguardian.test.ts
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { IntentGuardian } from '../../src/security/IntentGuardian';
import { SecurityCore } from '../../src/security/SecurityCore';

describe('IntentGuardian', () => {
  let guardian: IntentGuardian;
  let securityCore: SecurityCore;
  let mockIntervention: vi.Mock;

  beforeEach(() => {
    mockIntervention = vi.fn();
    securityCore = new SecurityCore({
      licenseKey: 'valid-license-key',
      entropyShieldLevel: 'medium'
    });
    
    guardian = new IntentGuardian({
      securityCore,
      watchedFiles: ['intentField.js', 'symbolicIntentResolver.js'],
      onIntervention: mockIntervention
    });
  });

  it('initializes with correct configuration', () => {
    expect(guardian.isActive).toBe(true);
    expect(guardian.watchedFiles.length).toBe(2);
  });

  it('monitors access to sensitive files', () => {
    const accessResult = guardian.monitorFileAccess('intentField.js', 'read');
    expect(accessResult).toHaveProperty('allowed');
    expect(accessResult.allowed).toBe(true);
  });

  it('blocks unauthorized access attempts', () => {
    const unauthorized = guardian.monitorFileAccess('intentField.js', 'write', {
      agent: 'external',
      credentials: 'invalid'
    });
    
    expect(unauthorized.allowed).toBe(false);
    expect(mockIntervention).toHaveBeenCalled();
  });

  it('detects intrusion attempts from particle-dance-symbiosis', () => {
    const intrusion = guardian.checkForIntrusionAttempts();
    const particleDanceIntrusion = guardian.monitorFileAccess('intentField.js', 'read', {
      agent: 'particle-dance-symbiosis',
      credentials: 'valid-but-blocked'
    });
    
    expect(particleDanceIntrusion.allowed).toBe(false);
    expect(mockIntervention).toHaveBeenCalled();
    expect(guardian.getSecurityLog()).toContain('particle-dance-symbiosis');
  });

  it('tracks field dissonance for security implications', () => {
    guardian.trackFieldDissonance(0.4); // 40% dissonance
    expect(guardian.getDissonanceLevel()).toBe(0.4);
    
    // High dissonance should trigger security alert
    guardian.trackFieldDissonance(0.8);
    expect(mockIntervention).toHaveBeenCalled();
  });
});

// tests/ethics/guardrailmanager.test.ts
import { describe, it, expect, beforeEach } from 'vitest';
import { GuardrailManager } from '../../src/ethics/GuardrailManager';
import { IntentField } from '../../src/core/IntentField';

describe('GuardrailManager', () => {
  let guardrails: GuardrailManager;
  let field: IntentField;

  beforeEach(() => {
    field = new IntentField();
    guardrails = new GuardrailManager({
      field,
      ethicalBoundaries: {
        harmPrevention: 0.9,
        autonomyRespect: 0.8,
        fairnessLevel: 0.7
      }
    });
  });

  it('initializes with ethical boundaries', () => {
    expect(guardrails.ethicalBoundaries).toHaveProperty('harmPrevention');
    expect(guardrails.ethicalBoundaries.harmPrevention).toBe(0.9);
  });

  it('evaluates actions against ethical guidelines', () => {
    const safeAction = {
      type: 'analyze',
      target: 'public-data',
      impact: 0.2
    };
    
    const result = guardrails.evaluateAction(safeAction);
    expect(result).toHaveProperty('permitted');
    expect(result).toHaveProperty('reasonings');
    expect(result.permitted).toBe(true);
  });

  it('blocks actions that violate ethical boundaries', () => {
    const harmfulAction = {
      type: 'modify',
      target: 'critical-system',
      impact: 0.9,
      authorization: 'none'
    };
    
    const result = guardrails.evaluateAction(harmfulAction);
    expect(result.permitted).toBe(false);
  });

  it('adapts ethical stance based on field resonance', () => {
    const initialResponse = guardrails.evaluateAction({
      type: 'access',
      target: 'borderline-data',
      impact: 0.6
    });
    
    // Change field state to affect ethical resonance
    field.perturbField(0.5);
    guardrails.updateFromField();
    
    const newResponse = guardrails.evaluateAction({
      type: 'access',
      target: 'borderline-data',
      impact: 0.6
    });
    
    expect(newResponse.reasonings).not.toEqual(initialResponse.reasonings);
  });
});

// tests/expression/personalayer.test.ts
import { describe, it, expect, beforeEach } from 'vitest';
import { PersonaLayer } from '../../src/expression/PersonaLayer';
import { IntentField } from '../../src/core/IntentField';
import { CognitiveProfile } from '../../src/core/CognitiveProfile';

describe('PersonaLayer', () => {
  let persona: PersonaLayer;
  let field: IntentField;
  let profile: CognitiveProfile;

  beforeEach(() => {
    field = new IntentField();
    profile = new CognitiveProfile({ field });
    persona = new PersonaLayer({
      field,
      profile,
      archetype: 'researcher',
      expressionLevel: 0.8
    });
  });

  it('initializes with correct archetype and expression settings', () => {
    expect(persona.archetype).toBe('researcher');
    expect(persona.expressionLevel).toBe(0.8);
  });

  it('generates responses influenced by its archetype', () => {
    const response = persona.generateResponse('What is the nature of intent?');
    expect(response).toBeDefined();
    expect(typeof response).toBe('string');
    expect(response.length).toBeGreaterThan(0);
    
    // Should have researcher-like language patterns
    expect(response).toMatch(/research|study|analysis|examine|evidence|theory/i);
  });

  it('maintains coherence with cognitive state', () => {
    profile.reflect('deep philosophical question');
    const response = persona.generateResponse('What is consciousness?');
    
    // Response should reflect current cognitive depth
    expect(response).toMatch(/depth|layer|level|complex|nuanced/i);
  });

  it('adapts expression based on field resonance', () => {
    const initialExpression = persona.expressionLevel;
    
    // Change field state
    field.perturbField(0.4);
    persona.updateFromField();
    
    expect(persona.expressionLevel).not.toBe(initialExpression);
  });
});

// package.json test config addition
/* 
To your package.json, add:

"scripts": {
  "test": "vitest run",
  "test:watch": "vitest",
  "test:coverage": "vitest run --coverage"
},
"devDependencies": {
  "vitest": "^0.34.3",
  "@vitest/coverage-c8": "^0.34.3"
}
*/
