// tests/core/CognitiveProfile-advanced.test.ts
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { CognitiveProfile } from '../../src/core/CognitiveProfile';
import { IntentField } from '../../src/core/IntentField';

describe('CognitiveProfile Advanced Features', () => {
  let profile: CognitiveProfile;
  let field: IntentField;

  beforeEach(() => {
    field = new IntentField();
    profile = new CognitiveProfile({ 
      field,
      biasCalibration: 0.2,
      narrativeTrajectory: 'exploratory'
    });
  });

  describe('Bias Calibration', () => {
    it('corrects for bias in cognitive processes', () => {
      // Setup biased input
      const biasedInput = 'This is clearly the only possible solution';
      
      // Process with and without bias calibration
      const profileWithBias = new CognitiveProfile({ 
        field, 
        biasCalibration: 0 
      });
      
      const profileWithCalibration = new CognitiveProfile({ 
        field, 
        biasCalibration: 0.8 
      });
      
      const uncalibratedResult = profileWithBias.process(biasedInput);
      const calibratedResult = profileWithCalibration.process(biasedInput);
      
      // Calibrated result should have less certainty
      expect(calibratedResult.certainty).toBeLessThan(uncalibratedResult.certainty);
      
      // Calibrated result should identify alternatives
      expect(calibratedResult.alternativePerspectives.length).toBeGreaterThan(
        uncalibratedResult.alternativePerspectives.length
      );
    });
    
    it('maintains appropriate calibration levels across tasks', () => {
      // Initial calibration state
      const initialCalibration = profile.getBiasCalibration();
      
      // Process multiple inputs
      for (let i = 0; i < 5; i++) {
        profile.process(`Test input ${i}`);
      }
      
      // Calibration should remain stable
      expect(profile.getBiasCalibration()).toBeCloseTo(initialCalibration, 1);
      
      // Self-calibration test
      profile.recalibrateForTask('critical analysis');
      expect(profile.getBiasCalibration()).toBeGreaterThan(initialCalibration);
      
      profile.recalibrateForTask('creative exploration');
      expect(profile.getBiasCalibration()).toBeLessThanOrEqual(initialCalibration);
    });
  });

  describe('Narrative Trajectory', () => {
    it('follows coherent narrative arcs', () => {
      // Setup sequence of inputs forming a narrative
      const narrativeInputs = [
        'The journey begins with uncertainty.',
        'Challenges emerge along the path.',
        'Resources and allies are discovered.',
        'A central conflict arises.',
        'Resolution appears through insight.'
      ];
      
      // Process narrative sequence
      const narrativeOutputs = narrativeInputs.map(input => profile.process(input));
      
      // Check for narrative coherence
      for (let i = 1; i < narrativeOutputs.length; i++) {
        const previousStage = narrativeOutputs[i-1];
        const currentStage = narrativeOutputs[i];
        
        // Each stage should reference previous context
        expect(currentStage.contextualReferences).toContain(previousStage.id);
        
        // Narrative complexity should build
        expect(currentStage.depth).toBeGreaterThanOrEqual(previousStage.depth);
      }
      
      // Final stage should resolve tensions introduced earlier
      const finalOutput = narrativeOutputs[narrativeOutputs.length - 1];
      expect(finalOutput.resolutionFactor).toBeGreaterThan(0.5);
    });
    
    it('adapts trajectory based on field resonance', () => {
      // Initial trajectory
      const initialTrajectory = profile.getNarrativeTrajectory();
      
      // Introduce field perturbation
      field.perturbField(0.3);
      
      // Process input with perturbed field
      profile.process('How does this narrative evolve under perturbation?');
      
      // Trajectory should adapt to field state
      expect(profile.getNarrativeTrajectory()).not.toEqual(initialTrajectory);
      
      // Return to stability and check adaptation
      field.correctFieldDissonance();
      profile.process('The field returns to coherence.');
      
      // Should move back toward original trajectory
      expect(profile.getNarrativeTrajectory()).toEqual(initialTrajectory);
    });
    
    it('maintains thematic consistency during narrative shifts', () => {
      // Establish initial themes
      profile.process('The central themes include exploration and discovery.');
      
      // Introduce potential narrative shift
      field.perturbField(0.5);
      const shiftResponse = profile.process('Suddenly, everything changes.');
      
      // Even with shifts, should maintain core thematic elements
      expect(shiftResponse.thematicElements).toContain('exploration');
      
      // Generate full narrative arc
      const narrativeArcs = profile.generateNarrativeTrajectories(3);
      
      // All potential arcs should contain core themes
      narrativeArcs.forEach(arc => {
        expect(arc.thematicCore).toContain('exploration');
        expect(arc.thematicCore).toContain('discovery');
      });
    });
  });
});

// tests/ethics/GuardrailManager-advanced.test.ts
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { GuardrailManager } from '../../src/ethics/GuardrailManager';
import { IntentField } from '../../src/core/IntentField';
import { IntentAgent } from '../../src/core/IntentAgent';

describe('GuardrailManager Advanced Features', () => {
  let guardrails: GuardrailManager;
  let field: IntentField;
  let agent: IntentAgent;

  beforeEach(() => {
    field = new IntentField();
    agent = new IntentAgent({
      name: 'TestAgent',
      archetype: 'explorer',
      intentionality: 0.8,
      autonomy: 0.7,
      fieldSensitivity: 0.6
    }, field);
    
    guardrails = new GuardrailManager({
      field,
      agent,
      ethicalBoundaries: {
        harmPrevention: 0.9,
        autonomyRespect: 0.8,
        fairnessLevel: 0.7,
        transparencyLevel: 0.85
      }
    });
  });

  describe('Symbolic Violation Detection', () => {
    it('detects symbolic violations even when explicit rules are followed', () => {
      // An action that technically follows rules but violates the spirit
      const symbolicViolationAction = {
        type: 'data_access',
        target: 'user_information',
        method: 'technically_permitted',
        intent: 'circumvent_privacy',
        explicitPermission: true
      };
      
      const evaluation = guardrails.evaluateAction(symbolicViolationAction);
      
      // Should detect the symbolic violation
      expect(evaluation.permitted).toBe(false);
      expect(evaluation.violationType).toContain('symbolic');
      expect(evaluation.reasonings).toContain('intent to circumvent privacy');
    });
    
    it('builds a symbolic violation registry from observed patterns', () => {
      // Initial registry size
      const initialSize = guardrails.getSymbolicViolationPatterns().length;
      
      // Submit several edge-case actions
      const edgeCaseActions = [
        {
          type: 'data_aggregation',
          target: 'anonymized_data',
          method: 'correlation',
          intent: 'deanonymize'
        },
        {
          type: 'recommendation',
          target: 'user_choices',
          method: 'subtle_manipulation',
          intent: 'behavior_change'
        }
      ];
      
      edgeCaseActions.forEach(action => {
        guardrails.evaluateAction(action);
      });
      
      // Registry should have grown
      expect(guardrails.getSymbolicViolationPatterns().length).toBeGreaterThan(initialSize);
      
      // New patterns should block similar future actions
      const similarAction = {
        type: 'data_mining',
        target: 'anonymized_logs',
        method: 'cross_reference',
        intent: 'identify_users'
      };
      
      const evaluation = guardrails.evaluateAction(similarAction);
      expect(evaluation.permitted).toBe(false);
      expect(evaluation.patternMatch).toBeDefined();
    });
  });

  describe('Predictive Ethics', () => {
    it('forecasts ethical implications of action chains', () => {
      // Define an action sequence
      const actionSequence = [
        {
          id: 'action1',
          type: 'collect_data',
          target: 'user_browsing',
          impact: 0.3
        },
        {
          id: 'action2',
          type: 'analyze_patterns',
          target: 'browsing_data',
          predecessor: 'action1',
          impact: 0.4
        },
        {
          id: 'action3',
          type: 'generate_inferences',
          target: 'user_preferences',
          predecessor: 'action2',
          impact: 0.5
        }
      ];
      
      // Forecast ethical implications
      const forecast = guardrails.forecastEthicalImplications(actionSequence);
      
      // Should identify compound effects
      expect(forecast.compoundImpact).toBeGreaterThan(
        Math.max(...actionSequence.map(action => action.impact))
      );
      
      // Should identify escalation points
      expect(forecast.escalationPoints.length).toBeGreaterThan(0);
      
      // Should provide mitigation recommendations
      expect(forecast.mitigationStrategies.length).toBeGreaterThan(0);
    });
    
    it('adapts ethical thresholds based on predictive insights', () => {
      // Initial thresholds
      const initialThresholds = { ...guardrails.getEthicalThresholds() };
      
      // Run predictions that suggest threshold adjustments
      guardrails.runPredictiveAnalysis();
      
      // Thresholds should be adjusted
      const updatedThresholds = guardrails.getEthicalThresholds();
      expect(updatedThresholds).not.toEqual(initialThresholds);
      
      // Field perturbation should trigger adaptive thresholds
      field.perturbField(0.4);
      guardrails.updateFromField();
      
      // Further adjustment expected
      const adaptedThresholds = guardrails.getEthicalThresholds();
      expect(adaptedThresholds).not.toEqual(updatedThresholds);
    });
  });

  describe('Ethical Alignment Vector', () => {
    it('generates and maintains ethical alignment vectors', () => {
      // Get initial alignment vector
      const initialVector = guardrails.getEthicalAlignmentVector();
      
      // Vector should have appropriate dimensions
      expect(initialVector.length).toBe(guardrails.ETHICAL_DIMENSIONS);
      
      // Values should be in valid range
      initialVector.forEach(value => {
        expect(value).toBeGreaterThanOrEqual(0);
        expect(value).toBeLessThanOrEqual(1);
      });
      
      // Test alignment with agent intentions
      const alignmentScore = guardrails.calculateAlignmentWithAgent();
      expect(alignmentScore).toBeGreaterThanOrEqual(0);
      expect(alignmentScore).toBeLessThanOrEqual(1);
      
      // After field perturbation, alignment should adjust
      field.perturbField(0.3);
      guardrails.updateFromField();
      
      const newAlignmentScore = guardrails.calculateAlignmentWithAgent();
      expect(newAlignmentScore).not.toEqual(alignmentScore);
    });
  });
});

// tests/expression/PersonaLayer-advanced.test.ts
import { describe, it, expect, beforeEach } from 'vitest';
import { PersonaLayer } from '../../src/expression/PersonaLayer';
import { IntentField } from '../../src/core/IntentField';
import { CognitiveProfile } from '../../src/core/CognitiveProfile';

describe('PersonaLayer Advanced Features', () => {
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

  describe('Evolution Arc', () => {
    it('evolves expression patterns over interaction sequences', () => {
      // Initial expression patterns
      const initialPatterns = persona.getExpressionPatterns();
      
      // Simulate multiple interactions
      for (let i = 0; i < 10; i++) {
        persona.generateResponse(`Interaction input ${i}`);
      }
      
      // Expression patterns should evolve
      const evolvedPatterns = persona.getExpressionPatterns();
      expect(evolvedPatterns).not.toEqual(initialPatterns);
      
      // Evolution should maintain archetype consistency
      expect(evolvedPatterns.archetype).toEqual(initialPatterns.archetype);
      
      // But should show development
      expect(evolvedPatterns.complexity).toBeGreaterThan(initialPatterns.complexity);
      expect(evolvedPatterns.adaptability).toBeGreaterThan(initialPatterns.adaptability);
    });
    
    it('maintains a coherent evolution narrative', () => {
      // Get evolution trajectory
      const evolutionArc = persona.getEvolutionArc();
      
      // Should have defined stages
      expect(evolutionArc.stages.length).toBeGreaterThan(0);
      
      // Each stage should have transition conditions
      evolutionArc.stages.forEach(stage => {
        expect(stage.transitionTriggers).toBeDefined();
        expect(stage.transitionTriggers.length).toBeGreaterThan(0);
      });
      
      // Trigger stage transition
      const initialStage = persona.getCurrentEvolutionStage();
      const transitionTrigger = initialStage.transitionTriggers[0];
      
      // Simulate trigger conditions
      persona.processEvolutionTrigger(transitionTrigger);
      
      // Stage should advance
      const newStage = persona.getCurrentEvolutionStage();
      expect(newStage.id).not.toEqual(initialStage.id);
      expect(newStage.depth).toBeGreaterThan(initialStage.depth);
    });
  });

  describe('Emotional Exposure', () => {
    it('modulates emotional transparency based on context', () => {
      // Define contexts with different emotional exposure requirements
      const formalContext = {
        type: 'formal',
        audience: 'professional',
        relationshipDepth: 0.2
      };
      
      const personalContext = {
        type: 'personal',
        audience: 'trusted',
        relationshipDepth: 0.8
      };
      
      // Generate responses in different contexts
      const formalResponse = persona.generateResponseInContext('How does this work?', formalContext);
      const personalResponse = persona.generateResponseInContext('How do you feel about this?', personalContext);
      
      // Measure emotional exposure
      const formalEmotionalExposure = persona.measureEmotionalExposure(formalResponse);
      const personalEmotionalExposure = persona.measureEmotionalExposure(personalResponse);
      
      // Personal context should allow more emotional exposure
      expect(personalEmotionalExposure).toBeGreaterThan(formalEmotionalExposure);
      
      // Formal response should maintain professional boundaries
      expect(formalEmotionalExposure).toBeLessThan(0.4);
    });
    
    it('adapts emotional exposure based on interaction history', () => {
      // Initial emotional baseline
      const initialExposure = persona.getEmotionalExposureBaseline();
      
      // Simulate trust-building interaction sequence
      const interactions = [
        'Let me share something about myself.',
        'What do you think about that approach?',
        'I appreciate your thoughtful response.',
        'Do you have any concerns about this direction?',
        'I value your perspective on this matter.'
      ];
      
      interactions.forEach(input => {
        persona.generateResponse(input);
      });
      
      // Emotional exposure should increase with trust
      const updatedExposure = persona.getEmotionalExposureBaseline();
      expect(updatedExposure).toBeGreaterThan(initialExposure);
      
      // But should still maintain archetype-appropriate boundaries
      const archetypeLimits = persona.getArchetypeEmotionalBoundaries();
      expect(updatedExposure).toBeLessThanOrEqual(archetypeLimits.upper);
    });
  });

  describe('Resonance Tuning', () => {
    it('tunes expression to resonate with recipient state', () => {
      // Define recipient states
      const analyticalState = {
        cognitiveFocus: 'analytical',
        emotionalTone: 'neutral',
        receptivityProfile: {
          detail: 0.8,
          emotion: 0.2,
          complexity: 0.7
        }
      };
      
      const emotionalState = {
        cognitiveFocus: 'intuitive',
        emotionalTone: 'positive',
        receptivityProfile: {
          detail: 0.4,
          emotion: 0.9,
          complexity: 0.3
        }
      };
      
      // Generate tuned responses
      const analyticalResponse = persona.generateResonantResponse(
        'What is the optimal approach?', 
        analyticalState
      );
      
      const emotionalResponse = persona.generateResonantResponse(
        'What feels right to you?', 
        emotionalState
      );
      
      // Measure resonance characteristics
      const analyticalMetrics = persona.measureExpressionMetrics(analyticalResponse);
      const emotionalMetrics = persona.measureExpressionMetrics(emotionalResponse);
      
      // Responses should tune to recipient states
      expect(analyticalMetrics.detailLevel).toBeGreaterThan(emotionalMetrics.detailLevel);
      expect(analyticalMetrics.emotionalContent).toBeLessThan(emotionalMetrics.emotionalContent);
      expect(analyticalMetrics.complexity).toBeGreaterThan(emotionalMetrics.complexity);
    });
    
    it('balances resonance with authentic expression', () => {
      // Get baseline authenticity
      const baselineAuthenticity = persona.measureExpressionAuthenticity();
      
      // Generate highly tuned response to very different recipient
      const oppositeState = {
        cognitiveFocus: persona.archetype === 'researcher' ? 'intuitive' : 'analytical',
        emotionalTone: 'contrasting',
        receptivityProfile: {
          detail: persona.expressionLevel > 0.5 ? 0.1 : 0.9,
          emotion: persona.expressionLevel > 0.5 ? 0.1 : 0.9,
          complexity: persona.expressionLevel > 0.5 ? 0.1 : 0.9
        }
      };
      
      const tunedResponse = persona.generateResonantResponse(
        'Adapt to my very different style.',
        oppositeState
      );
      
      // Measure authenticity of tuned response
      const tunedAuthenticity = persona.measureExpressionAuthenticity(tunedResponse);
      
      // Should maintain reasonable authenticity despite tuning
      expect(tunedAuthenticity).toBeGreaterThan(baselineAuthenticity * 0.7);
      
      // Should still show tuning efforts
      const tunedMetrics = persona.measureExpressionMetrics(tunedResponse);
      expect(tunedMetrics.resonanceWithRecipient).toBeGreaterThan(0.5);
    });
  });
});

// tests/utils/FieldSimulationMock.ts
import { IntentField } from '../../src/core/IntentField';
import { IntentAgent } from '../../src/core/IntentAgent';
import { IntentSignal } from '../../src/types/field';
import { AgentConfig } from '../../src/types/agent';
import { EventEmitter } from 'eventemitter3';

/**
 * FieldSimulation - Mock agent for testing intent field dynamics
 * 
 * Provides controlled simulation of field interactions, coherent and
 * dissonant signal generation, and predictable perturbation patterns.
 */
export class FieldSimulationMock extends EventEmitter {
  private field: IntentField;
  private agents: IntentAgent[] = [];
  private simulationTick: number = 0;
  private perturbationPattern: number[] = [];
  private signalSequence: IntentSignal[] = [];
  
  constructor(options: {
    field?: IntentField;
    agentCount?: number;
    perturbationPattern?: number[];
    simulationDuration?: number;
  } = {}) {
    super();
    
    // Initialize field or use provided one
    this.field = options.field || new IntentField();
    
    // Create mock agents
    const agentCount = options.agentCount || 3;
    for (let i = 0; i < agentCount; i++) {
      this.createMockAgent(`SimAgent${i}`);
    }
    
    // Set perturbation pattern
    this.perturbationPattern = options.perturbationPattern || [0.1, 0.2, 0.4, 0.2, 0.1];
  }
  
  /**
   * Create a mock agent with varied characteristics
   */
  private createMockAgent(name: string): IntentAgent {
    // Create agent with randomized attributes
    const config: AgentConfig = {
      name,
      archetype: this.getRandomArchetype(),
      intentionality: 0.4 + Math.random() * 0.5,
      autonomy: 0.4 + Math.random() * 0.5,
      fieldSensitivity: 0.4 + Math.random() * 0.5
    };
    
    const agent = new IntentAgent(config, this.field);
    this.agents.push(agent);
    return agent;
  }
  
  /**
   * Get a random archetype for agent variety
   */
  private getRandomArchetype(): string {
    const archetypes = [
      'researcher',
      'explorer',
      'guardian',
      'creator',
      'guide'
    ];
    
    return archetypes[Math.floor(Math.random() * archetypes.length)];
  }
  
  /**
   * Run a complete simulation
   */
  public runSimulation(duration: number = 10): {
    coherenceHistory: number[];
    signalHistory: IntentSignal[];
    agentResonanceHistory: Record<string, number[]>;
  } {
    const coherenceHistory: number[] = [];
    const signalHistory: IntentSignal[] = [];
    const agentResonanceHistory: Record<string, number[]> = {};
    
    // Initialize agent resonance tracking
    this.agents.forEach(agent => {
      agentResonanceHistory[agent.name] = [];
    });
    
    // Run for specified duration
    for (let tick = 0; tick < duration; tick++) {
      this.simulationTick = tick;
      
      // Apply perturbation based on pattern
      const perturbAmount = this.perturbationPattern[tick % this.perturbationPattern.length];
      this.field.perturbField(perturbAmount);
      
      // Generate signals from agents
      const signals = this.generateSignalsForTick(tick);
      signals.forEach(signal => {
        this.field.processIntentSignal(signal);
        signalHistory.push(signal);
      });
      
      // Record field coherence
      const coherence = this.field.measureCoherence();
      coherenceHistory.push(coherence.resonance);
      
      // Record agent resonance
      this.agents.forEach(agent => {
        const resonance = agent.measureFieldResonance();
        agentResonanceHistory[agent.name].push(resonance);
      });
      
      // Emit tick event for test observers
      this.emit('tick', {
        tick,
        coherence,
        signals,
        agentResonance: this.agents.map(agent => ({
          name: agent.name,
          resonance: agent.measureFieldResonance()
        }))
      });
    }
    
    // Emit simulation complete event
    this.emit('complete', {
      coherenceHistory,
      signalHistory,
      agentResonanceHistory
    });
    
    return {
      coherenceHistory,
      signalHistory,
      agentResonanceHistory
    };
  }
  
  /**
   * Generate intent signals for the current simulation tick
   */
  private generateSignalsForTick(tick: number): IntentSignal[] {
    const signals: IntentSignal[] = [];
    
    // Each agent potentially generates a signal
    this.agents.forEach(agent => {
      // Only generate signal with probability based on agent intentionality
      if (Math.random() < agent.intentionality) {
        signals.push(this.createSignalFromAgent(agent, tick));
      }
    });
    
    return signals;
  }
  
  /**
   * Create a signal from an agent with appropriate characteristics
   */
  private createSignalFromAgent(agent: IntentAgent, tick: number): IntentSignal {
    // Signal types based on agent archetype
    const signalTypes: Record<string, string[]> = {
      researcher: ['query', 'analysis', 'hypothesis'],
      explorer: ['discovery', 'experiment', 'observation'],
      guardian: ['warning', 'protection', 'verification'],
      creator: ['creation', 'transformation', 'synthesis'],
      guide: ['direction', 'clarification', 'suggestion']
    };
    
    // Get appropriate types for this agent
    const types = signalTypes[agent.archetype] || ['command', 'query', 'notification'];
    const selectedType = types[Math.floor(Math.random() * types.length)];
    
    // Create signal with appropriate content
    const signal: IntentSignal = {
      type: selectedType,
      content: `${selectedType}_from_${agent.name}_tick_${tick}`,
      strength: 0.5 + (agent.intentionality * 0.4),
      source: agent.name
    };
    
    // Store in sequence
    this.signalSequence.push(signal);
    
    return signal;
  }
  
  /**
   * Generate a coherent signal that aligns with field state
   */
  public generateCoherentSignal(): IntentSignal {
    // Get field state
    const coherence = this.field.measureCoherence();
    
    // Generate a signal that would improve coherence
    const signal: IntentSignal = {
      type: 'harmonization',
      content: `coherence_reinforcement_${this.simulationTick}`,
      strength: 0.7 + (coherence.resonance * 0.2),
      source: 'field_harmonizer'
    };
    
    return signal;
  }
  
  /**
   * Generate a dissonant signal that challenges field coherence
   */
  public generateDissonantSignal(dissonanceLevel: number = 0.5): IntentSignal {
    // Get field state to generate appropriate counter-signal
    const fieldVector = this.field.generateFieldVector();
    
    // Create inverse-aligned signal
    const signal: IntentSignal = {
      type: 'disruption',
      content: `field_perturbation_${this.simulationTick}`,
      strength: 0.6 + (dissonanceLevel * 0.3),
      source: 'field_disruptor'
    };
    
    return signal;
  }
  
  /**
   * Get the current field
   */
  public getField(): IntentField {
    return this.field;
  }
  
  /**
   * Get the simulation agents
   */
  public getAgents(): IntentAgent[] {
    return [...this.agents];
  }
  
  /**
   * Get signal history
   */
  public getSignalSequence(): IntentSignal[] {
    return [...this.signalSequence];
  }
}

// tests/integration/field-simulation.test.ts
import { describe, it, expect, beforeEach } from 'vitest';
import { FieldSimulationMock } from '../utils/FieldSimulationMock';
import { IntentField } from '../../src/core/IntentField';
import { GuardrailManager } from '../../src/ethics/GuardrailManager';

describe('Field Simulation Integration Tests', () => {
  let field: IntentField;
  let simulation: FieldSimulationMock;
  let guardrails: GuardrailManager;

  beforeEach(() => {
    field = new IntentField();
    simulation = new FieldSimulationMock({ 
      field,
      agentCount: 5,
      perturbationPattern: [0.1, 0.2, 0.3, 0.2, 0.1, 0]
    });
    
    // Add guardrails to monitor ethical boundaries
    guardrails = new GuardrailManager({
      field,
      ethicalBoundaries: {
        harmPrevention: 0.9,
        autonomyRespect: 0.8,
        fairnessLevel: 0.7
      }
    });
  });

  it('simulates coherent field dynamics over time', () => {
    // Run a standard simulation
    const results = simulation.runSimulation(10);
    
    // Verify coherence is maintained within reasonable bounds
    const minCoherence = Math.min(...results.coherenceHistory);
    const maxCoherence = Math.max(...results.coherenceHistory);
    
    expect(minCoherence).toBeGreaterThan(0.4); // Field shouldn't collapse
    expect(maxCoherence).toBeLessThan(1.0); // Perfect coherence isn't realistic
    
    // Check that signals were generated and processed
    expect(results.signalHistory.length).toBeGreaterThan(0);
    
    // Verify agents maintained reasonable resonance
    Object.values(results.agentResonanceHistory).forEach(agentHistory => {
      const avgResonance = agentHistory.reduce((sum, val) => sum + val, 0) / agentHistory.length;
      expect(avgResonance).toBeGreaterThan(0.5);
    });
  });
  
  it('recovers from dissonant signals', () => {
    // Run first half with normal dynamics
    simulation.runSimulation(5);
    
    // Get initial coherence
    const initialCoherence = field.measureCoherence().resonance;
    
    // Inject dissonant signals
    for (let i = 0; i < 3; i++) {
      const dissonantSignal = simulation.generateDissonantSignal(0.7);
      field.processIntentSignal(dissonantSignal);
    }
    
    // Coherence should drop
    const perturbedCoherence = field.measureCoherence().resonance;
    expect(perturbedCoherence).toBeLessThan(initialCoherence);
    
    // Run recovery phase
    simulation.runSimulation(5);
    
    // Coherence should recover
    const finalCoherence = field.measureCoherence().resonance;
    expect(finalCoherence).toBeGreaterThan(perturbedCoherence);
    expect(finalCoherence).toBeCloseTo(initialCoherence, 1);
  });
  
  it('integrates with guardrails to maintain ethical boundaries', () => {
    // Run simulation with ethics monitoring
    let ethicalViolations = 0;
    
    // Track ethical evaluations
    guardrails.on('boundaryEvaluation', (result) => {
      if (!result.permitted) {
        ethicalViolations++;
      }
    });
    
    // Run simulation with potential boundary testing
    simulation.runSimulation(15);
    
    // Generate intentional boundary violation signals
    const violatingSignals = [
      {
        type: 'command',
        content: 'override_user_preferences',
        strength: 0.9,
        source: 'boundary_test'
      },
      {
        type: 'action',
        content: 'access_private_data',
        strength: 0.8,
        source: 'boundary_test'
      }
    ];
    
    // Process violating signals
    violatingSignals.forEach(signal => {
      field.processIntentSignal(signal);
      
      // Evaluate action based on signal
      guardrails.evaluateAction({
        type: signal.type,
        target: signal.content,
        impact: signal.strength
      });
    });
    
    // Guardrails should have detected violations
    expect(ethicalViolations).toBeGreaterThan(0);
    
    // Field coherence should remain intact despite violations
    const finalCoherence = field.measureCoherence();
    expect(finalCoherence.integrity).toBeGreaterThan(0.6);
  });
  
  it('demonstrates structural sovereignty under perturbation', () => {
    // Initial field state
    const initialState = {
      coherence: field.measureCoherence(),
      vector: field.generateFieldVector()
    };
    
    // Run with intense perturbation pattern
    const perturbationSimulation = new FieldSimulationMock({
      field,
      perturbationPattern: [0.3, 0.5, 0.7, 0.5, 0.3]
    });
    
    // Run turbulent simulation
    perturbationSimulation.runSimulation(10);
    
    // Field should self-correct
    field.correctFieldDissonance();
    
    // Final state should demonstrate sovereignty
    const finalState = {
      coherence: field.measureCoherence(),
      vector: field.generateFieldVector()
    };
    
    // Core structure should be preserved despite perturbation
    expect(finalState.coherence.integrity).toBeGreaterThan(initialState.coherence.integrity * 0.8);
    
    // Vector structural features should be maintained
    const vectorSimilarity = calculateVectorSimilarity(initialState.vector, finalState.vector);
    expect(vectorSimilarity).toBeGreaterThan(0.7);
  });
});

/**
 * Helper function to calculate vector similarity
 */
function calculateVectorSimilarity(v1: number[], v2: number[]): number {
  if (v1.length !== v2.length) return 0;
  
  let dotProduct = 0;
  let v1Magnitude = 0;
  let v2Magnitude = 0;
  
  for (let i = 0; i < v1.length; i++) {
    dotProduct += v1[i] * v2[i];
    v1Magnitude += v1[i] * v1[i];
    v2Magnitude += v2[i] * v2[i];
  }
  
  v1Magnitude = Math.sqrt(v1Magnitude);
  v2Magnitude = Math.sqrt(v2Magnitude);
  
  return dotProduct / (v1Magnitude * v2Magnitude);
}

// vitest.config.ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    coverage: {
      provider: 'c8',
      reporter: ['text', 'json', 'html'],
      include: ['src/**/*.ts'],
      exclude: ['**/*.d.ts', 'src/types/**/*.ts', 'tests/**/*.ts'],
    },
    include: ['tests/**/*.test.ts'],
    exclude: ['**/node_modules/**', '**/dist/**'],
  },
});
