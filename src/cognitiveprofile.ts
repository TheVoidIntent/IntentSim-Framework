import { ResonanceEvent, DevelopmentStage, Traits, EmotionalSetpoints, BiasCalibrationResult } from '../types/cognition';

/**
 * CognitiveProfile manages an agent's meta-cognitive awareness,
 * development stage, emotional calibration, and narrative role.
 * This enables scaling agents from simple to complex archetypes.
 */
export class CognitiveProfile {
  /**
   * Development stage (novice, standard, advanced, emergent)
   */
  public developmentStage: DevelopmentStage;
  
  /**
   * Core traits that define agent's cognitive profile
   */
  public traits: Traits;
  
  /**
   * Emotional calibration settings
   */
  public emotionalSetpoints: EmotionalSetpoints;
  
  /**
   * Resonance journal recording significant cognitive events
   */
  private resonanceJournal: ResonanceEvent[] = [];
  
  /**
   * Narrative role within multi-agent systems
   */
  public narrativeRole: string;
  
  /**
   * Narrative trajectory tracking
   */
  public narrativeTrajectory: {
    currentPath: string;
    pathHistory: string[];
    pathStrength: number;
    archetypeAlignment: Record<string, number>;
  };
  
  /**
   * Meta-cognitive capabilities
   */
  public metaCognition: {
    selfAwareness: number;
    selfRegulation: number;
    intentionRecognition: number;
    adaptiveThinking: number;
  };
  
  /**
   * Identity vector (n-dimensional representation of agent identity)
   */
  public identityVector: Record<string, number>;
  
  /**
   * Bias tracking and calibration system
   */
  public biasTracking: {
    detectedBiases: Record<string, {
      initialMagnitude: number;
      currentMagnitude: number;
      corrections: number;
    }>;
    calibrationLog: {
      timestamp: number;
      biasType: string;
      previousMagnitude: number;
      newMagnitude: number;
      correctionVector: any;
    }[];
    lastCalibration: number | null;
  };
  
  /**
   * Cross-agent resonance imprinting with inheritance weighting
   */
  private resonanceImprints: {
    timestamp: number;
    mentorId: string;
    mentorStage: DevelopmentStage;
    domain: string;
    traitInfluence: Record<string, number>;
    weightInheritance: Record<string, number>;
  }[] = [];
  
  /**
   * Mentorship patterns tracking
   */
  private mentorshipPatterns: Record<string, {
    timestamp: number;
    domain: string;
    advancement: number;
    weightInheritance: number;
  }[]> = {};
  
  /**
   * Intent inheritance weights
   */
  public inheritanceWeights: Record<string, number> = {};
  
  /**
   * Creates a new CognitiveProfile
   * @param config - Configuration options
   */
  constructor(config: {
    stage?: DevelopmentStage;
    traits?: Partial<Traits>;
    emotionalSetpoints?: Partial<EmotionalSetpoints>;
    role?: string;
    identitySeeds?: Record<string, number>;
  } = {}) {
    // Development stage
    this.developmentStage = config.stage || 'standard';
    
    // Core traits
    this.traits = {
      curiosity: 0.7,
      adaptation: 0.5,
      reflection: 0.6,
      resilience: 0.5,
      ...config.traits
    };
    
    // Emotional calibration
    this.emotionalSetpoints = {
      baseline: 'neutral',
      resonanceThreshold: 0.7,
      dissonanceThreshold: 0.6,
      ...config.emotionalSetpoints
    };
    
    // Narrative role
    this.narrativeRole = config.role || 'assistant';
    
    // Narrative trajectory
    this.narrativeTrajectory = {
      currentPath: 'undefined',
      pathHistory: [],
      pathStrength: 0,
      archetypeAlignment: {}
    };
    
    // Meta-cognitive capabilities
    this.metaCognition = {
      selfAwareness: 0.5,
      selfRegulation: 0.6,
      intentionRecognition: 0.7,
      adaptiveThinking: 0.5
    };
    
    // Identity vector
    this.identityVector = this._initializeIdentityVector(config.identitySeeds);
    
    // Bias tracking
    this.biasTracking = {
      detectedBiases: {},
      calibrationLog: [],
      lastCalibration: null
    };
  }
  
  /**
   * Initializes the identity vector from seed values or defaults
   * @param seeds - Seed values for identity dimensions
   * @returns Initialized identity vector
   * @private
   */
  private _initializeIdentityVector(seeds: Record<string, number> = {}): Record<string, number> {
    const defaultVector = {
      autonomy: 0.5,
      empathy: 0.7,
      creativity: 0.5,
      precision: 0.8,
      wisdom: 0.4
    };
    
    return { ...defaultVector, ...seeds };
  }
  
  /**
   * Records a significant cognitive event in the agent's resonance journal
   * @param event - The cognitive event to record
   * @returns The new journal length
   */
  recordResonanceEvent(event: Omit<ResonanceEvent, 'timestamp' | 'intensity'>): number {
    // Calculate event intensity for inheritance weighting
    const intensity = this._calculateEventIntensity(event);
    
    const journalEntry: ResonanceEvent = {
      timestamp: Date.now(),
      type: event.type,
      coherence: event.coherence,
      dissonance: event.dissonance,
      trigger: event.trigger,
      resolution: event.resolution,
      intensity
    };
    
    this.resonanceJournal.push(journalEntry);
    
    // Update meta-cognitive capabilities based on event
    this._updateMetaCognition(event, intensity);
    
    // Update intent inheritance weights
    this._updateInheritanceWeights(event, intensity);
    
    return this.resonanceJournal.length;
  }
  
  /**
   * Updates meta-cognitive capabilities based on experiences
   * @param event - The cognitive event
   * @param intensity - The calculated event intensity
   * @private
   */
  private _updateMetaCognition(
    event: Omit<ResonanceEvent, 'timestamp' | 'intensity'>, 
    intensity: number
  ): void {
    // Base adjustment factor scales with intensity
    const baseFactor = 0.01 * intensity;
    
    // Increase self-awareness through dissonance experiences
    if (event.type === 'dissonance' && event.resolution) {
      this.metaCognition.selfAwareness = Math.min(
        1.0, 
        this.metaCognition.selfAwareness + baseFactor
      );
    }
    
    // Increase self-regulation through successful coherence recovery
    if (event.type === 'recovery') {
      this.metaCognition.selfRegulation = Math.min(
        1.0,
        this.metaCognition.selfRegulation + (baseFactor * 2)
      );
    }
    
    // Increase intention recognition through successful intent processing
    if (event.type === 'intent_processed' && event.coherence > 0.7) {
      this.metaCognition.intentionRecognition = Math.min(
        1.0,
        this.metaCognition.intentionRecognition + (baseFactor * 0.8)
      );
    }
    
    // Increase adaptive thinking through novel situations
    if (event.type === 'novel_situation') {
      this.metaCognition.adaptiveThinking = Math.min(
        1.0,
        this.metaCognition.adaptiveThinking + (baseFactor * 1.5)
      );
    }
  }
  
  /**
   * Evaluates the agent's cognitive development stage
   * @returns Development stage evaluation results
   */
  evaluateDevelopmentStage(): {
    advanced: boolean;
    previousStage?: DevelopmentStage;
    newStage?: DevelopmentStage;
    currentStage?: DevelopmentStage;
  } {
    const metaValues = Object.values(this.metaCognition);
    const metaAverage = metaValues.reduce((sum, val) => sum + val, 0) / metaValues.length;
    
    const previousStage = this.developmentStage;
    
    // Threshold checks for advancement
    if (this.developmentStage === 'novice' && metaAverage > 0.6) {
      this.developmentStage = 'standard';
      return { advanced: true, previousStage, newStage: 'standard' };
    }
    
    if (this.developmentStage === 'standard' && metaAverage > 0.8) {
      this.developmentStage = 'advanced';
      return { advanced: true, previousStage, newStage: 'advanced' };
    }
    
    if (this.developmentStage === 'advanced' && 
        metaAverage > 0.9 && 
        this.resonanceJournal.length > 100) {
      this.developmentStage = 'emergent';
      return { advanced: true, previousStage, newStage: 'emergent' };
    }
    
    return { advanced: false, currentStage: this.developmentStage };
  }
  
  /**
   * Calibrates bias based on field truth feedback
   * @param feedbackData - Feedback about detected bias
   * @returns Bias calibration results
   */
  biasCalibration(feedbackData: {
    biasType: string;
    magnitude: number;
    correctionVector: any;
  }): BiasCalibrationResult {
    const { biasType, magnitude, correctionVector } = feedbackData;
    
    if (!this.biasTracking.detectedBiases[biasType]) {
      this.biasTracking.detectedBiases[biasType] = {
        initialMagnitude: magnitude,
        currentMagnitude: magnitude,
        corrections: 0
      };
    }
    
    // Apply correction
    const bias = this.biasTracking.detectedBiases[biasType];
    const correctionFactor = 0.1 * (bias.corrections + 1);
    bias.currentMagnitude = Math.max(0, bias.currentMagnitude - (magnitude * correctionFactor));
    bias.corrections++;
    
    // Log calibration
    this.biasTracking.calibrationLog.push({
      timestamp: Date.now(),
      biasType,
      previousMagnitude: magnitude,
      newMagnitude: bias.currentMagnitude,
      correctionVector
    });
    
    this.biasTracking.lastCalibration = Date.now();
    
    return {
      biasType,
      remainingBias: bias.currentMagnitude,
      reduction: magnitude - bias.currentMagnitude,
      totalReduction: bias.initialMagnitude - bias.currentMagnitude
    };
  }
  
  /**
   * Receive mentorship from experienced agent
   * @param mentorAgent - The mentoring agent
   * @param domain - The domain for mentorship
   * @returns Mentorship results
   */
  receiveMentorship(mentorAgent: any, domain: string): {
    success: boolean;
    reason?: string;
    imprint?: any;
    traitsAdjusted?: string[];
    weightsInherited?: string[];
  } {
    // Verify mentor is more advanced
    if (this._developmentValue(mentorAgent.cognitiveProfile.developmentStage) <= 
        this._developmentValue(this.developmentStage)) {
      return { success: false, reason: 'mentor not more advanced' };
    }
    
    // Extract mentor traits and weights
    const mentorTraits = mentorAgent.cognitiveProfile.traits;
    const mentorWeights = mentorAgent.cognitiveProfile.inheritanceWeights;
    
    // Imprint mentor patterns
    const imprint = {
      timestamp: Date.now(),
      mentorId: mentorAgent.id,
      mentorStage: mentorAgent.cognitiveProfile.developmentStage,
      domain,
      traitInfluence: {} as Record<string, number>,
      weightInheritance: {} as Record<string, number>
    };
    
    // Calculate advancement factor
    const advancementFactor = this._calculateAdvancementFactor(mentorAgent);
    
    // Apply trait influence
    Object.keys(this.traits).forEach(trait => {
      if (mentorTraits[trait] > this.traits[trait]) {
        const influenceMagnitude = (mentorTraits[trait] - this.traits[trait]) * advancementFactor;
        this.traits[trait] += influenceMagnitude * 0.2; // Gradual improvement
        imprint.traitInfluence[trait] = influenceMagnitude;
      }
    });
    
    // Apply intent weight inheritance
    Object.keys(mentorWeights).forEach(intentType => {
      const mentorWeight = mentorWeights[intentType] || 0;
      const currentWeight = this.inheritanceWeights[intentType] || 0;
      
      if (mentorWeight > currentWeight) {
        // Calculate inheritance strength
        const inheritanceStrength = (mentorWeight - currentWeight) * advancementFactor;
        
        // Apply inheritance
        if (!this.inheritanceWeights[intentType]) {
          this.inheritanceWeights[intentType] = 0;
        }
        
        this.inheritanceWeights[intentType] += inheritanceStrength * 0.3;
        imprint.weightInheritance[intentType] = inheritanceStrength;
      }
    });
    
    // Record mentorship
    this.resonanceImprints.push(imprint);
    
    if (!this.mentorshipPatterns[mentorAgent.id]) {
      this.mentorshipPatterns[mentorAgent.id] = [];
    }
    this.mentorshipPatterns[mentorAgent.id].push({
      timestamp: Date.now(),
      domain,
      advancement: advancementFactor,
      weightInheritance: Object.keys(imprint.weightInheritance).length
    });
    
    return { 
      success: true, 
      imprint,
      traitsAdjusted: Object.keys(imprint.traitInfluence),
      weightsInherited: Object.keys(imprint.weightInheritance)
    };
  }
  
  /**
   * Calculate event intensity for inheritance weighting
   * @param event - The cognitive event
   * @returns The calculated intensity (0-2)
   * @private
   */
  private _calculateEventIntensity(event: Omit<ResonanceEvent, 'timestamp' | 'intensity'>): number {
    let intensity = 1.0; // Base intensity
    
    // Adjust based on coherence/dissonance magnitude
    if (event.coherence !== undefined) {
      intensity += (event.coherence - 0.5) * 0.5;
    }
    
    if (event.dissonance !== undefined) {
      intensity += event.dissonance * 0.8;
    }
    
    // Adjust based on event type
    const eventTypeModifiers: Record<string, number> = {
      'dissonance': 1.3,
      'recovery': 1.2,
      'revelation': 1.5,
      'conflict': 1.4,
      'harmonization': 1.2
    };
    
    if (eventTypeModifiers[event.type]) {
      intensity *= eventTypeModifiers[event.type];
    }
    
    // Adjust based on resolution
    if (event.resolution) {
      intensity *= 1.2; // Resolved events have stronger influence
    }
    
    return Math.min(2.0, Math.max(0.1, intensity));
  }
  
  /**
   * Update intent inheritance weights based on events
   * @param event - The cognitive event
   * @param intensity - The event intensity
   * @private
   */
  private _updateInheritanceWeights(
    event: Omit<ResonanceEvent, 'timestamp' | 'intensity'>, 
    intensity: number
  ): void {
    if (!event.trigger) return;
    
    const intentType = event.trigger;
    
    if (!this.inheritanceWeights[intentType]) {
      this.inheritanceWeights[intentType] = 0;
    }
    
    // Significant events increase weight for that intent type
    if (intensity > 1.2) {
      this.inheritanceWeights[intentType] += 0.05 * (intensity - 1);
    }
    
    // Cap weights at a reasonable value
    this.inheritanceWeights[intentType] = Math.min(1.0, this.inheritanceWeights[intentType]);
  }
  
  /**
   * Calculate the numeric value of a development stage
   * @param stage - The development stage
   * @returns The numeric value
   * @private
   */
  private _developmentValue(stage: DevelopmentStage): number {
    const stageValues: Record<DevelopmentStage, number> = {
      'novice': 1,
      'standard': 2,
      'advanced': 3,
      'emergent': 4
    };
    
    return stageValues[stage] || 0;
  }
  
  /**
   * Calculate advancement factor based on mentor's development
   * @param mentorAgent - The mentoring agent
   * @returns The advancement factor
   * @private
   */
  private _calculateAdvancementFactor(mentorAgent: any): number {
    const mentorValue = this._developmentValue(mentorAgent.cognitiveProfile.developmentStage);
    const selfValue = this._developmentValue(this.developmentStage);
    const diff = mentorValue - selfValue;
    
    return 0.3 + (diff * 0.2);
  }
}
