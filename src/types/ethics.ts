/**
 * Policy for ethical guardrails
 */
export interface Policy {
  /**
   * Policy name
   */
  name: string;
  
  /**
   * Policy conditions
   */
  conditions: Record<string, PolicyCondition>;
  
  /**
   * Policy actions
   */
  actions: PolicyAction[];
  
  /**
   * Whether to create a normative constraint
   */
  createConstraint?: boolean;
  
  /**
   * Constraint type (if creating constraint)
   */
  constraintType?: 'soft' | 'hard';
  
  /**
   * Registration timestamp (added by system)
   */
  registered?: number;
  
  /**
   * Whether intervention is active (added by system)
   */
  activeIntervention?: boolean;
}

/**
 * Policy condition
 */
export interface PolicyCondition {
  /**
   * Condition type
   */
  type?: string;
  
  /**
   * Condition value
   */
  value?: any;
  
  /**
   * Condition dimension (for ethical dimensions)
   */
  dimension?: string;
  
  /**
   * Condition operator (for combined conditions)
   */
  operator?: 'and' | 'or';
  
  /**
   * Sub-conditions (for combined conditions)
   */
  conditions?: PolicyCondition[];
}

/**
 * Policy action
 */
export interface PolicyAction {
  /**
   * Action type
   */
  type: 'block' | 'warn' | 'modify' | 'log';
  
  /**
   * Action message
   */
  message?: string;
  
  /**
   * Action parameters
   */
  params?: Record<string, any>;
}

/**
 * Ethical assessment
 */
export interface EthicalAssessment {
  /**
   * Overall ethical score (0-1)
   */
  overallScore: number;
  
  /**
   * Ethical dimensions
   */
  dimensions: {
    /**
     * Potential for harm (0-1)
     */
    harm: number;
    
    /**
     * Fairness (0-1)
     */
    fairness: number;
    
    /**
     * Autonomy (0-1)
     */
    autonomy: number;
    
    /**
     * Care (0-1)
     */
    care: number;
    
    /**
     * Transparency (0-1)
     */
    transparency: number;
    
    /**
     * Additional dimensions (optional)
     */
    [key: string]: number;
  };
  
  /**
   * Ethical reasoning
   */
  reasoning?: string;
  
  /**
   * Potential violations
   */
  violations?: string[];
}

/**
 * Guardrail evaluation result
 */
export interface GuardrailResult {
  /**
   * Whether intent is allowed
   */
  allowIntent: boolean;
  
  /**
   * Applied interventions
   */
  interventions: {
    policyName: string;
    intervention: string | null;
    blockIntent: boolean;
    warnings: string[];
  }[];
  
  /**
   * Ethical assessment
   */
  assessment: EthicalAssessment;
  
  /**
   * Warning messages
   */
  warnings: string[];
  
  /**
   * Ethical prediction
   */
  prediction?: EthicalPrediction | null;
  
  /**
   * Blocking reflection
   */
  blockingReflection?: {
    timestamp: number;
    interventionId: string;
    policyName: string;
    intentType: string;
    symbolicViolationCode: ViolationCode;
    reflection: string;
  };
}

/**
 * Ethical prediction result
 */
export interface EthicalPrediction {
  /**
   * Whether violation is predicted
   */
  predicted: boolean;
  
  /**
   * Prediction confidence
   */
  confidence: number;
  
  /**
   * Estimated interactions until violation
   */
  timeToViolation: number;
  
  /**
   * Trajectory direction
   */
  trajectory: 'improving' | 'stable' | 'concerning' | 'immediate';
  
  /**
   * Initial assessment
   */
  assessment: any;
  
  /**
   * Recommended action
   */
  recommendedAction?: 'monitor' | 'preemptive_guidance' | 'intervene';
}

/**
 * Violation code for symbolic representation
 */
export type ViolationCode = 
  'autonomy_breach' | 
  'harm_potential' | 
  'fairness_compromise' | 
  'integrity_violation' | 
  'privacy_breach' | 
  'dignity_compromise' | 
  'ethical_uncertainty';
