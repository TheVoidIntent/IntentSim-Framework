/**
 * Persona characteristics that define expression style
 */
export interface PersonaCharacteristics {
  /**
   * Warmth level (0-1)
   */
  warmth: number;
  
  /**
   * Depth level (0-1)
   */
  depth: number;
  
  /**
   * Authenticity level (0-1)
   */
  authenticity: number;
  
  /**
   * Formality level (0-1)
   */
  formality: number;
  
  /**
   * Additional characteristics (optional)
   */
  [key: string]: number;
}

/**
 * Expression style preferences
 */
export interface ExpressionStyle {
  /**
   * Metaphor usage level (0-1)
   */
  metaphorUsage: number;
  
  /**
   * Detail level (0-1)
   */
  detailLevel: number;
  
  /**
   * Technicality level (0-1)
   */
  technicalityLevel: number;
  
  /**
   * Expressiveness level (0-1)
   */
  expressiveness: number;
  
  /**
   * Additional style preferences (optional)
   */
  [key: string]: number;
}

/**
 * Emotional states
 */
export type EmotionalState = 
  'resonant' | 
  'harmonious' | 
  'balanced' | 
  'neutral' | 
  'reflective' | 
  'dissonant' | 
  'chaotic';

/**
 * Harmonic system
 */
export interface HarmonicSystem {
  /**
   * Primary frequency
   */
  primaryFrequency: number;
  
  /**
   * Secondary frequencies
   */
  secondaries: number[];
  
  /**
   * Resonant nodes
   */
  resonantNodes: Record<string, {
    /**
     * Node frequency
     */
    frequency: number;
    
    /**
     * Node amplitude
     */
    amplitude: number;
  }>;
}

/**
 * Tone mapping
 */
export interface ToneMapping {
  /**
   * Tone name
   */
  tone: string;
  
  /**
   * Tone intensity (0-1)
   */
  intensity: number;
  
  /**
   * Tone modifiers
   */
  modifiers: string[];
}

/**
 * Expressed response
 */
export interface ExpressedResponse {
  /**
   * Response text
   */
  text: string;
  
  /**
   * Emotional state
   */
  emotionalState: EmotionalState;
  
  /**
   * Tone
   */
  tone: string;
  
  /**
   * Active harmonic frequencies
   */
  harmonics: number[];
  
  /**
   * Response metadata
   */
  metadata: {
    /**
     * Persona metadata
     */
    persona: {
      /**
       * Expression style
       */
      expressionStyle: ExpressionStyle;
      
      /**
       * Characteristics
       */
      characteristics: PersonaCharacteristics;
      
      /**
       * Harmonic tuning (if active)
       */
      harmonicTuning: {
        /**
         * Current frequency
         */
        currentFrequency: number;
        
        /**
         * Tuning shift
         */
        tuningShift: number;
        
        /**
         * Field integration factor
         */
        fieldIntegration: number;
      } | null;
    };
    
    /**
     * Additional metadata (optional)
     */
    [key: string]: any;
  };
}

/**
 * Emotional exposure tracking result
 */
export interface EmotionalExposureResult {
  /**
   * Emotion name
   */
  emotion: string;
  
  /**
   * Emotion intensity
   */
  intensity: number;
  
  /**
   * Total exposure to this emotion
   */
  totalExposure: number;
  
  /**
   * Average intensity
   */
  avgIntensity: number;
  
  /**
   * Evolution direction
   */
  evolvingToward: {
    /**
     * Direction name
     */
    direction: string;
    
    /**
     * Direction strength
     */
    strength: number;
  };
}

/**
 * Harmonic tuning result
 */
export interface HarmonicTuningResult {
  /**
   * Success status
   */
  success: boolean;
  
  /**
   * Failure reason (if unsuccessful)
   */
  reason?: string;
  
  /**
   * Agent ID (if successful)
   */
  agentId?: string;
  
  /**
   * Shared frequencies (if successful)
   */
  sharedFrequencies?: {
    selfFreq: number;
    otherFreq: number;
    difference: number;
    relativeDifference: number;
  }[];
  
  /**
   * Potential resonance score (if successful)
   */
  potentialResonance?: number;
}

/**
 * Self-tuning configuration
 */
export interface SelfTuningConfiguration {
  /**
   * Base frequency
   */
  baseFrequency: number;
  
  /**
   * Adaptation rate
   */
  adaptationRate: number;
  
  /**
   * Field integration factor
   */
  fieldIntegrationFactor: number;
}
