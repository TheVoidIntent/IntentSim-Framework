/**
 * Development stages for agent cognitive evolution
 */
export type DevelopmentStage = 'novice' | 'standard' | 'advanced' | 'emergent';

/**
 * Core cognitive traits
 */
export interface Traits {
  /**
   * Drive to explore and learn (0-1)
   */
  curiosity: number;
  
  /**
   * Ability to adjust to new situations (0-1)
   */
  adaptation: number;
  
  /**
   * Capacity for self-evaluation (0-1)
   */
  reflection: number;
  
  /**
   * Ability to maintain stability under pressure (0-1)
   */
  resilience: number;
  
  /**
   * Additional traits (optional)
   */
  [key: string]: number;
}

/**
 * Emotional calibration settings
 */
export interface EmotionalSetpoints {
  /**
   * Baseline emotional state
   */
  baseline: string;
  
  /**
   * Threshold for resonance response
   */
  resonanceThreshold: number;
  
  /**
   * Threshold for dissonance response
   */
  dissonanceThreshold: number;
  
  /**
   * Additional setpoints (optional)
   */
  [key: string]: any;
}

/**
 * Cognitive event recorded in resonance journal
 */
export interface ResonanceEvent {
  /**
   * Event timestamp
   */
  timestamp: number;
  
  /**
   * Event type
   */
  type: string;
  
  /**
   * Coherence level during event
   */
  coherence: number;
  
  /**
   * Dissonance level during event
   */
  dissonance: number;
  
  /**
   * Event trigger
   */
  trigger: string;
  
  /**
   * Event resolution (if any)
   */
  resolution: string | null;
  
  /**
   * Event intensity (for inheritance weighting)
   */
  intensity: number;
}

/**
 * Bias calibration result
 */
export interface BiasCalibrationResult {
  /**
   * Type of bias
   */
  biasType: string;
  
  /**
   * Remaining bias level
   */
  remainingBias: number;
  
  /**
   * Reduction in this calibration
   */
  reduction: number;
  
  /**
   * Total reduction since first detection
   */
  totalReduction: number;
}
