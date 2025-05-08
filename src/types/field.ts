import { SymbolicMarker } from './symbolic';

/**
 * Field impact from processing an intent
 */
export interface FieldImpact {
  /**
   * Change in field coherence
   */
  coherenceDelta: number;
  
  /**
   * Change in field dissonance
   */
  dissonanceDelta: number;
  
  /**
   * Resulting intent state
   */
  intentState?: string;
}

/**
 * Field decay prediction
 */
export interface DecayPrediction {
  /**
   * Projected coherence level
   */
  projectedCoherence: number;
  
  /**
   * Rate of decay
   */
  decayRate: number;
  
  /**
   * Estimated time until threshold
   */
  timeToThreshold: number;
}

/**
 * Interference pattern between agent and field
 */
export interface InterferencePattern {
  /**
   * Alignment score between agent and field
   */
  alignmentScore: number;
  
  /**
   * Interference score representing dissonance
   */
  interferenceScore: number;
  
  /**
   * Harmonic coupling strength
   */
  harmonicCoupling: number;
  
  /**
   * Overall phase relationship
   */
  phase: 'resonant' | 'dissonant' | 'neutral';
}

/**
 * Field state
 */
export interface FieldState {
  /**
   * Field coherence level (0-1)
   */
  coherence: number;
  
  /**
   * Field dissonance level (0-1)
   */
  dissonance: number;
}

/**
 * Resonance history entry
 */
export interface ResonanceHistory {
  /**
   * Timestamp of entry
   */
  timestamp: number;
  
  /**
   * Intent signature
   */
  intentSignature: string;
  
  /**
   * Coherence impact
   */
  coherenceImpact: number;
  
  /**
   * Dissonance impact
   */
  dissonanceImpact: number;
  
  /**
   * Field state
   */
  fieldState: FieldState;
  
  /**
   * Symbolic markers
   */
  symbolicMarkers: SymbolicMarker[];
}
