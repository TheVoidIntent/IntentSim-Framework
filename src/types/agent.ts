import { EmotionalState } from './persona';
import { DevelopmentStage } from './cognition';

/**
 * Agent archetypes
 */
export type AgentArchetype = 
  'assistant' | 
  'counselor' | 
  'educator' | 
  'creator' | 
  'protector' | 
  'analyst' | 
  'mentor' | 
  'explorer' | 
  'connector' | 
  'unspecified';

/**
 * Agent configuration
 */
export interface AgentConfig {
  /**
   * Agent ID
   */
  id?: string;
  
  /**
   * Agent name
   */
  name?: string;
  
  /**
   * Agent archetype
   */
  archetype?: AgentArchetype;
  
  /**
   * Field parameters
   */
  fieldParams?: any;
  
  /**
   * Memory parameters
   */
  memoryParams?: any;
  
  /**
   * Codex parameters
   */
  codexParams?: any;
  
  /**
   * Cognition parameters
   */
  cognitionParams?: {
    /**
     * Development stage
     */
    stage?: DevelopmentStage;
    
    /**
     * Core traits
     */
    traits?: Record<string, number>;
    
    /**
     * Narrative role
     */
    role?: string;
  };
  
  /**
   * Ethics parameters
   */
  ethicsParams?: any;
  
  /**
   * Ethical policies
   */
  policies?: any[];
  
  /**
   * Voice parameters
   */
  voiceParams?: any;
  
  /**
   * Emotion parameters
   */
  emotionParams?: any;
  
  /**
   * Tone parameters
   */
  toneParams?: any;
  
  /**
   * Persona parameters
   */
  personaParams?: {
    /**
     * Persona characteristics
     */
    characteristics?: Record<string, number>;
  };
  
  /**
   * Engine parameters
   */
  engineParams?: any;
  
  /**
   * Vector space parameters
   */
  vectorSpaceParams?: any;
  
  /**
   * Enable predictive ethics
   */
  enablePredictiveEthics?: boolean;
  
  /**
   * Enable multi-agent ethical feedback
   */
  enableMultiAgentFeedback?: boolean;
  
  /**
   * Enable harmonic self-tuning
   */
  enableHarmonicSelfTuning?: boolean;
}

/**
 * Agent state
 */
export interface AgentState {
  /**
   * Whether agent is active
   */
  active: boolean;
  
  /**
   * Coherence level (0-1)
   */
  coherence: number;
  
  /**
   * Dissonance level (0-1)
   */
  dissonance: number;
  
  /**
   * Intent state
   */
  intentState: string;
  
  /**
   * Emotional state
   */
  emotionalState: EmotionalState;
  
  /**
   * Resonance history
   */
  resonanceHistory: ResonanceEvent[];
  
  /**
   * Last dissonance event
   */
  lastDissonanceEvent: {
    timestamp: number;
    magnitude: number;
    intentState: string;
  } | null;
  
  /**
   * Last interaction timestamp
   */
  lastInteraction: string | null;
  
  /**
   * Creation timestamp
   */
  createdAt: string;
}

/**
 * Resonance event
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
   * Coherence level
   */
  coherence: number;
  
  /**
   * Dissonance level
   */
  dissonance: number;
  
  /**
   * Event trigger
   */
  trigger: string;
  
  /**
   * Event resolution
   */
  resolution: string | null;
  
  /**
   * Emotional state (optional)
   */
  emotionalState?: EmotionalState;
  
  /**
   * Intent state (optional)
   */
  intentState?: string;
  
  /**
   * Event intensity (optional)
   */
  intensity?: number;
}
