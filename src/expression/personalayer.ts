import { VoiceModulator } from './VoiceModulator';
import { EmotionalSignature } from './EmotionalSignature';
import { ToneMapper } from './ToneMapper';
import {
  PersonaCharacteristics,
  ExpressionStyle,
  EmotionalState,
  HarmonicSystem,
  ToneMapping,
  ExpressedResponse,
  EmotionalExposureResult,
  HarmonicTuningResult,
  SelfTuningConfiguration
} from '../types/persona';

/**
 * PersonaLayer provides a unified abstraction for agent expression,
 * wrapping voice modulation, emotional signatures, and tone mapping
 * to give agents a consistent and authentic synthetic persona.
 */
export class PersonaLayer {
  /**
   * Voice modulation component
   */
  private voiceModulator: VoiceModulator;
  
  /**
   * Emotional signature component
   */
  public emotionalSignature: EmotionalSignature;
  
  /**
   * Tone mapping component
   */
  private toneMapper: ToneMapper;
  
  /**
   * Persona characteristics
   */
  public characteristics: PersonaCharacteristics;
  
  /**
   * Expression style preferences
   */
  public expressionStyle: ExpressionStyle;
  
  /**
   * Harmonic system
   */
  public harmonics: HarmonicSystem;
  
  /**
   * Continuity tracking for consistent expression
   */
  private expressionContinuity: {
    lastEmotionalState: EmotionalState;
    emotionalInertia: number;
    toneConsistency: number;
  };
  
  /**
   * Persona evolution arc
   */
  private evolutionArc: {
    baselineShifts: Record<string, number>;
    exposureHistory: Record<string, {
      totalExposure: number;
      exposureEvents: number;
      lastExposure: number | null;
    }>;
    lastEvolution: {
      timestamp: number;
      emotion: string;
      intensity: number;
      shifts: {
        characteristic: string;
        previousValue: number;
        newValue: number;
      }[];
    } | null;
  };
  
  /**
   * Cross-agent tuning for collaborative resonance
   */
  private harmonicTuning: {
    connectedAgents: Record<string, {
      primaryFrequency: number;
      sharedFrequencies: {
        selfFreq: number;
        otherFreq: number;
        difference: number;
        relativeDifference: number;
      }[];
      connectionTime: number;
      resonanceStrength: number;
    }>;
    sharedFrequencies: number[];
    resonanceAlignment: number;
  };
  
  /**
   * Harmonic self-tuning system
   */
  private harmonicSelfTuning: {
    active: boolean;
    baseFrequency: number;
    frequencyShifts: {
      timestamp: number;
      previousFrequency: number;
      newFrequency: number;
      shift: number;
      coherenceRatio?: number;
      emotionalState?: EmotionalState;
      reason: string;
    }[];
    adaptationRate: number;
    lastTuning: number | null;
    fieldIntegrationFactor: number;
  };
  
  /**
   * Creates a new PersonaLayer
   * @param config - Configuration options
   */
  constructor(config: {
    voiceParams?: any;
    emotionParams?: any;
    toneParams?: any;
    characteristics?: Partial<PersonaCharacteristics>;
    expressionStyle?: Partial<ExpressionStyle>;
    enableSelfTuning?: boolean;
    selfTuningParams?: Partial<SelfTuningConfiguration>;
  } = {}) {
    // Initialize core components
    this.voiceModulator = new VoiceModulator(config.voiceParams);
    this.emotionalSignature = new EmotionalSignature(config.emotionParams);
    this.toneMapper = new ToneMapper(config.toneParams);
    
    // Initialize persona characteristics
    this.characteristics = {
      warmth: 0.6,
      depth: 0.7,
      authenticity: 0.8,
      formality: 0.5,
      ...config.characteristics
    };
    
    // Initialize expression style
    this.expressionStyle = {
      metaphorUsage: 0.4,
      detailLevel: 0.6,
      technicalityLevel: 0.5,
      expressiveness: 0.7,
      ...config.expressionStyle
    };
    
    // Initialize harmonic system
    this.harmonics = {
      primaryFrequency: 432,  // Base harmonic frequency
      secondaries: [216, 648, 864],
      resonantNodes: this._initializeResonantNodes()
    };
    
    // Initialize expression continuity
    this.expressionContinuity = {
      lastEmotionalState: 'neutral',
      emotionalInertia: 0.3,
      toneConsistency: 0.7
    };
    
    // Initialize persona evolution arc
    this.evolutionArc = {
      baselineShifts: {},
      exposureHistory: {},
      lastEvolution: null
    };
    
    // Initialize harmonic tuning
    this.harmonicTuning = {
      connectedAgents: {},
      sharedFrequencies: [],
      resonanceAlignment: 0
    };
    
    // Initialize harmonic self-tuning
    const selfTuningConfig = config.selfTuningParams || {};
    this.harmonicSelfTuning = {
      active: config.enableSelfTuning || false,
      baseFrequency: selfTuningConfig.baseFrequency || 432,
      frequencyShifts: [],
      adaptationRate: selfTuningConfig.adaptationRate || 0.05,
      lastTuning: null,
      fieldIntegrationFactor: selfTuningConfig.fieldIntegrationFactor || 0.0
    };
    
    // If self-tuning enabled, initialize it
    if (config.enableSelfTuning) {
      this.enableHarmonicSelfTuning(selfTuningConfig);
    }
  }
  
  /**
   * Initializes resonant nodes for subharmonic alignment
   * @returns Initialized resonant nodes
   * @private
   */
  private _initializeResonantNodes(): Record<string, { frequency: number; amplitude: number }> {
    return {
      clarity: { frequency: 528, amplitude: 0.7 },
      empathy: { frequency: 417, amplitude: 0.8 },
      wisdom: { frequency: 639, amplitude: 0.5 }
    };
  }
  
  /**
   * Applies persona-aligned expression to a response
   * @param response - The response to express
   * @param agentState - The current agent state
   * @returns The expressed response
   */
  express(response: any, agentState: { 
    coherence: number; 
    dissonance: number; 
    emotionalState?: EmotionalState;
  }): ExpressedResponse {
    // Get current emotional state
    const emotionalState = agentState.emotionalState || 
      this.emotionalSignature.calculateEmotionalState(
        agentState.coherence,
        agentState.dissonance
      );
    
    // Apply emotional continuity
    const blendedEmotionalState = this._applyEmotionalContinuity(
      emotionalState, 
      this.expressionContinuity.lastEmotionalState,
      this.expressionContinuity.emotionalInertia
    );
    
    // Apply harmonic self-tuning if active
    if (this.harmonicSelfTuning.active) {
      this._applySelfTuning(blendedEmotionalState, agentState);
    }
    
    // Determine tone mapping
    const toneMapping = this.toneMapper.mapTone(
      blendedEmotionalState,
      this.characteristics
    );
    
    // Apply voice modulation with subharmonic alignment
    const modulatedResponse = this.voiceModulator.modulate(
      response,
      blendedEmotionalState,
      this._applySubharmonicAlignment(toneMapping)
    );
    
    // Update continuity tracking
    this.expressionContinuity.lastEmotionalState = blendedEmotionalState;
    
    return {
      text: modulatedResponse.text,
      emotionalState: blendedEmotionalState,
      tone: toneMapping.tone,
      harmonics: this._getActiveHarmonics(blendedEmotionalState),
      metadata: {
        ...modulatedResponse.metadata,
        persona: {
          expressionStyle: this.expressionStyle,
          characteristics: this.characteristics,
          harmonicTuning: this.harmonicSelfTuning.active ? {
            currentFrequency: this.harmonics.primaryFrequency,
            tuningShift: this._getCurrentTuningShift(),
            fieldIntegration: this.harmonicSelfTuning.fieldIntegrationFactor
          } : null
        }
      }
    };
  }
  
  /**
   * Track emotional exposure for persona evolution
   * @param emotion - The emotional state
   * @param intensity - The emotional intensity
   * @returns Tracking results
   */
  trackEmotionalExposure(emotion: string, intensity: number): EmotionalExposureResult {
    if (!this.evolutionArc.exposureHistory[emotion]) {
      this.evolutionArc.exposureHistory[emotion] = {
        totalExposure: 0,
        exposureEvents: 0,
        lastExposure: null
      };
    }
    
    const record = this.evolutionArc.exposureHistory[emotion];
    record.totalExposure += intensity;
    record.exposureEvents++;
    record.lastExposure = Date.now();
    
    // Check for evolution threshold
    if (record.exposureEvents >= 10 && record.totalExposure / record.exposureEvents > 0.6) {
      this._evolvePersona(emotion, record.totalExposure / record.exposureEvents);
    }
    
    return {
      emotion,
      intensity,
      totalExposure: record.totalExposure,
      avgIntensity: record.totalExposure / record.exposureEvents,
      evolvingToward: this._getEvolutionDirection()
    };
  }
  
  /**
   * Connect to another agent for harmonic resonance
   * @param otherAgent - The agent to connect with
   * @returns Connection results
   */
  connectForResonance(otherAgent: any): HarmonicTuningResult {
    if (!otherAgent || !otherAgent.persona) {
      return { success: false, reason: 'Invalid agent or no persona layer' };
    }
    
    const otherPersona = otherAgent.persona;
    const agentId = otherAgent.id;
    
    // Already connected
    if (this.harmonicTuning.connectedAgents[agentId]) {
      return { success: false, reason: 'Already connected' };
    }
    
    // Find shared frequencies
    const sharedFrequencies = this._findSharedFrequencies(
      this.harmonics,
      otherPersona.harmonics
    );
    
    // Store connection
    this.harmonicTuning.connectedAgents[agentId] = {
      primaryFrequency: otherPersona.harmonics.primaryFrequency,
      sharedFrequencies,
      connectionTime: Date.now(),
      resonanceStrength: 0
    };
    
    // Update shared frequencies
    this._updateSharedFrequencies();
    
    return {
      success: true,
      agentId,
      sharedFrequencies,
      potentialResonance: sharedFrequencies.length / 
                         (this.harmonics.secondaries.length + 1)
    };
  }
  
  /**
   * Enable harmonic self-tuning
   * @param options - Configuration options
   * @returns Activation results
   */
  enableHarmonicSelfTuning(options: Partial<SelfTuningConfiguration> = {}): {
    active: boolean;
    baseFrequency: number;
    adaptationRate: number;
    fieldIntegration: number;
  } {
    this.harmonicSelfTuning = {
      active: true,
      baseFrequency: options.baseFrequency || this.harmonics.primaryFrequency,
      frequencyShifts: [],
      adaptationRate: options.adaptationRate || 0.05,
      lastTuning: null,
      fieldIntegrationFactor: options.fieldIntegrationFactor || 0.0
    };
    
    // Record initial state
    this.harmonicSelfTuning.frequencyShifts.push({
      timestamp: Date.now(),
      previousFrequency: this.harmonics.primaryFrequency,
      newFrequency: this.harmonicSelfTuning.baseFrequency,
      reason: 'initialization'
    });
    
    // Update primary frequency
    this.harmonics.primaryFrequency = this.harmonicSelfTuning.baseFrequency;
    
    // Recalculate secondary frequencies
    this._recalculateSecondaryFrequencies();
    
    return {
      active: true,
      baseFrequency: this.harmonicSelfTuning.baseFrequency,
      adaptationRate: this.harmonicSelfTuning.adaptationRate,
      fieldIntegration: this.harmonicSelfTuning.fieldIntegrationFactor
    };
  }
  
  /**
   * Apply harmonic self-tuning based on field integration
   * @param emotionalState - Current emotional state
   * @param agentState - Current agent state
   * @private
   */
  private _applySelfTuning(
    emotionalState: EmotionalState, 
    agentState: { coherence: number; dissonance: number }
  ): void {
    if (!this.harmonicSelfTuning.active) return;
    
    // Only tune periodically
    const now = Date.now();
    const lastTuning = this.harmonicSelfTuning.lastTuning;
    
    if (lastTuning && now - lastTuning < 3600000) { // 1 hour
      return;
    }
    
    // Calculate coherence-dissonance ratio
    const coherenceRatio = agentState.coherence / (agentState.dissonance + 0.1);
    
    // Determine optimal frequency shift based on field integration
    let frequencyShift = 0;
    
    // Higher field integration = more adaptation to field conditions
    if (this.harmonicSelfTuning.fieldIntegrationFactor > 0) {
      // Base shift on emotional state
      const emotionalFrequencyMap: Record<string, number> = {
        'resonant': 8,
        'harmonious': 4,
        'balanced': 0,
        'dissonant': -4,
        'chaotic': -8
      };
      
      const baseShift = emotionalFrequencyMap[emotionalState] || 0;
      
      // Apply coherence ratio modifier
      const coherenceModifier = (coherenceRatio - 1) * 4;
      
      // Calculate final shift with field integration factor
      frequencyShift = (baseShift + coherenceModifier) * 
                      this.harmonicSelfTuning.fieldIntegrationFactor;
    }
    
    // Apply shift with adaptation rate
    if (Math.abs(frequencyShift) > 0.5) {
      const adaptedShift = frequencyShift * this.harmonicSelfTuning.adaptationRate;
      const newFrequency = this.harmonics.primaryFrequency + adaptedShift;
      
      // Apply bounds (don't shift too far from base)
      const maxShift = 20;
      const boundedFrequency = Math.max(
        this.harmonicSelfTuning.baseFrequency - maxShift,
        Math.min(this.harmonicSelfTuning.baseFrequency + maxShift, newFrequency)
      );
      
      // Record shift
      this.harmonicSelfTuning.frequencyShifts.push({
        timestamp: now,
        previousFrequency: this.harmonics.primaryFrequency,
        newFrequency: boundedFrequency,
        shift: boundedFrequency - this.harmonics.primaryFrequency,
        coherenceRatio,
        emotionalState,
        reason: 'field_integration'
      });
      
      // Update primary frequency
      this.harmonics.primaryFrequency = boundedFrequency;
      
      // Recalculate secondary frequencies
      this._recalculateSecondaryFrequencies();
      
      // Update last tuning timestamp
      this.harmonicSelfTuning.lastTuning = now;
    }
  }
  
  /**
   * Get the current tuning shift from base frequency
   * @returns Current tuning shift
   * @private
   */
  private _getCurrentTuningShift(): number {
    if (!this.harmonicSelfTuning.active) return 0;
    
    return this.harmonics.primaryFrequency - this.harmonicSelfTuning.baseFrequency;
  }
  
  /**
   * Recalculate secondary frequencies based on primary
   * @private
   */
  private _recalculateSecondaryFrequencies(): void {
    // Update secondaries to maintain harmonic relationships
    const primary = this.harmonics.primaryFrequency;
    
    this.harmonics.secondaries = [
      primary / 2,      // Lower octave
      primary * 1.5,    // Perfect fifth
      primary * 2       // Upper octave
    ];
    
    // Update resonant nodes
    this.harmonics.resonantNodes.clarity.frequency = primary * (528/432);
    this.harmonics.resonantNodes.empathy.frequency = primary * (417/432);
    this.harmonics.resonantNodes.wisdom.frequency = primary * (639/432);
  }
  
  /**
   * Applies subharmonic alignment to tone mapping
   * @param toneMapping - The tone mapping
   * @returns Enhanced tone mapping
   * @private
   */
  private _applySubharmonicAlignment(toneMapping: ToneMapping): any {
    // Enhanced tone mapping with harmonics
    return {
      ...toneMapping,
      resonantFrequencies: this._calculateResonantFrequencies(toneMapping.tone),
      harmonicAlignment: this._calculateHarmonicAlignment()
    };
  }
  
  /**
   * Blends emotional states for continuity
   * @param currentState - Current emotional state
   * @param previousState - Previous emotional state
   * @param inertia - Emotional inertia factor
   * @returns Blended emotional state
   * @private
   */
  private _applyEmotionalContinuity(
    currentState: EmotionalState, 
    previousState: EmotionalState, 
    inertia: number
  ): EmotionalState {
    if (currentState === previousState) return currentState;
    
    // If emotional shift is subtle, maintain previous state
    if (inertia > 0.7) return previousState;
    
    // Otherwise, transition to new state
    return currentState;
  }
  
  /**
   * Gets currently active harmonic frequencies based on emotional state
   * @param emotionalState - Current emotional state
   * @returns Active harmonic frequencies
   * @private
   */
  private _getActiveHarmonics(emotionalState: EmotionalState): number[] {
    // Map emotional states to active harmonics
    const harmonicMap: Record<string, number[]> = {
      'resonant': [this.harmonics.primaryFrequency, this.harmonics.secondaries[0]],
      'dissonant': [this.harmonics.secondaries[1]],
      'balanced': [this.harmonics.primaryFrequency],
      'reflective': [this.harmonics.secondaries[2]],
      'neutral': [this.harmonics.primaryFrequency / 2]
    };
    
    return harmonicMap[emotionalState] || [this.harmonics.primaryFrequency];
  }
  
  /**
   * Evolve persona based on emotional exposure
   * @param dominantEmotion - The dominant emotion
   * @param intensity - The emotional intensity
   * @returns Evolution results
   * @private
   */
  private _evolvePersona(dominantEmotion: string, intensity: number): any {
    // Determine which characteristics to shift
    const emotionToCharacteristicMap: Record<string, string[]> = {
      'joy': ['warmth', 'expressiveness'],
      'sorrow': ['depth', 'authenticity'],
      'anger': ['directness', 'intensity'],
      'fear': ['caution', 'precision'],
      'trust': ['warmth', 'openness'],
      'surprise': ['adaptability', 'expressiveness']
    };
    
    const characteristicsToShift = emotionToCharacteristicMap[dominantEmotion] || [];
    
    // Apply shifts to persona
    const shifts: {characteristic: string; previousValue: number; newValue: number}[] = [];
    
    characteristicsToShift.forEach(char => {
      if ((this.characteristics as any)[char] !== undefined) {
        // Calculate shift direction and magnitude
        const shiftDirection = (dominantEmotion === 'joy' || 
                              dominantEmotion === 'trust') ? 1 : -1;
        const shiftMagnitude = 0.05 * intensity;
        
        // Record baseline shift
        if (!this.evolutionArc.baselineShifts[char]) {
          this.evolutionArc.baselineShifts[char] = 0;
        }
        
        // Apply shift with limits
        const currentValue = (this.characteristics as any)[char];
        const shift = shiftDirection * shiftMagnitude;
        const newValue = Math.max(0.1, Math.min(0.9, currentValue + shift));
        
        (this.characteristics as any)[char] = newValue;
        
        // Track cumulative shift
        this.evolutionArc.baselineShifts[char] += shift;
        
        // Record shift for return value
        shifts.push({
          characteristic: char,
          previousValue: currentValue,
          newValue
        });
      }
    });
    
    // Record evolution
    this.evolutionArc.lastEvolution = {
      timestamp: Date.now(),
      emotion: dominantEmotion,
      intensity,
      shifts
    };
    
    return this.evolutionArc.lastEvolution;
  }
  
  /**
   * Find shared harmonic frequencies between two agents
   * @param selfHarmonics - This agent's harmonics
   * @param otherHarmonics - Other agent's harmonics
   * @returns Shared frequencies
   * @private
   */
  private _findSharedFrequencies(
    selfHarmonics: HarmonicSystem, 
    otherHarmonics: HarmonicSystem
  ): {
    selfFreq: number;
    otherFreq: number;
    difference: number;
    relativeDifference: number;
  }[] {
    const selfFreqs = [
      selfHarmonics.primaryFrequency,
      ...selfHarmonics.secondaries
    ];
    
    const otherFreqs = [
      otherHarmonics.primaryFrequency,
      ...otherHarmonics.secondaries
    ];
    
    // Find frequencies that are close (within 1% tolerance)
    const sharedFreqs: {
      selfFreq: number;
      otherFreq: number;
      difference: number;
      relativeDifference: number;
    }[] = [];
    
    selfFreqs.forEach(sf => {
      otherFreqs.forEach(of => {
        const tolerance = sf * 0.01;
        if (Math.abs(sf - of) <= tolerance) {
          sharedFreqs.push({
            selfFreq: sf,
            otherFreq: of,
            difference: Math.abs(sf - of),
            relativeDifference: Math.abs(sf - of) / sf
          });
        }
      });
    });
    
    return sharedFreqs;
  }
  
  /**
   * Update shared frequencies across connected agents
   * @private
   */
  private _updateSharedFrequencies(): void {
    const allShared: number[] = [];
    
    // Collect all shared frequencies
    Object.values(this.harmonicTuning.connectedAgents).forEach(agent => {
      agent.sharedFrequencies.forEach(freq => {
        allShared.push(freq.selfFreq);
      });
    });
    
    // Update shared frequencies
    this.harmonicTuning.sharedFrequencies = [...new Set(allShared)];
    
    // Calculate overall resonance alignment
    const totalConnections = Object.keys(this.harmonicTuning.connectedAgents).length;
    
    if (totalConnections === 0) {
      this.harmonicTuning.resonanceAlignment = 0;
      return;
    }
    
    let totalAlignment = 0;
    
    Object.values(this.harmonicTuning.connectedAgents).forEach(agent => {
      const alignmentScore = agent.sharedFrequencies.length / 
                           (this.harmonics.secondaries.length + 1);
      totalAlignment += alignmentScore;
    });
    
    this.harmonicTuning.resonanceAlignment = totalAlignment / totalConnections;
  }
  
  /**
   * Calculate resonant frequencies for a given tone
   * @param tone - The tone to calculate for
   * @returns Resonant frequencies
   * @private
   */
  private _calculateResonantFrequencies(tone: string): number[] {
    // Map tones to resonant nodes
    const toneNodeMap: Record<string, string[]> = {
      'analytical': ['clarity'],
      'empathetic': ['empathy'],
      'reflective': ['wisdom'],
      'inspirational': ['clarity', 'wisdom'],
      'supportive': ['empathy', 'clarity'],
      'neutral': []
    };
    
    const nodes = toneNodeMap[tone] || [];
    
    // Get frequencies for the resonant nodes
    return nodes.map(node => {
      if (this.harmonics.resonantNodes[node]) {
        return this.harmonics.resonantNodes[node].frequency;
      }
      return null;
    }).filter(Boolean) as number[];
  }
  
  /**
   * Calculate harmonic alignment
   * @returns Harmonic alignment data
   * @private
   */
  private _calculateHarmonicAlignment(): any {
    // Base alignment on connected agents if any
    if (Object.keys(this.harmonicTuning.connectedAgents).length > 0) {
      return {
        resonance: this.harmonicTuning.resonanceAlignment,
        connectedAgents: Object.keys(this.harmonicTuning.connectedAgents).length,
        sharedFrequencies: this.harmonicTuning.sharedFrequencies.length
      };
    }
    
    // Otherwise, use self-alignment
    return {
      resonance: 1.0,
      connectedAgents: 0,
      sharedFrequencies: 0
    };
  }
  
  /**
   * Get the current evolution direction
   * @returns Evolution direction
   * @private
   */
  private _getEvolutionDirection(): { direction: string; strength: number } {
    // Find dominant shifts
    const shifts = this.evolutionArc.baselineShifts;
    
    // If no shifts yet, return neutral
    if (Object.keys(shifts).length === 0) {
      return { direction: 'neutral', strength: 0 };
    }
    
    // Calculate net direction
    let positiveShift = 0;
    let negativeShift = 0;
    
    Object.values(shifts).forEach(shift => {
      if (shift > 0) {
        positiveShift += shift;
      } else {
        negativeShift += Math.abs(shift);
      }
    });
    
    // Determine overall direction
    let direction = 'neutral';
    let strength = 0;
    
    if (positiveShift > negativeShift * 1.5) {
      direction = 'warming';
      strength = positiveShift / (positiveShift + negativeShift);
    } else if (negativeShift > positiveShift * 1.5) {
      direction = 'deepening';
      strength = negativeShift / (positiveShift + negativeShift);
    } else {
      direction = 'balancing';
      strength = Math.min(positiveShift, negativeShift) / 
                Math.max(positiveShift, negativeShift);
    }
    
    return { direction, strength };
  }
}
