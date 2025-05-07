import { NexusFramework } from './NexusFramework';
import { NormativeConstraint } from './NormativeConstraint';
import { HarmAssessor } from './HarmAssessor';
import { 
  Policy, 
  EthicalAssessment, 
  PolicyCondition, 
  ViolationCode, 
  PolicyAction,
  GuardrailResult,
  EthicalPrediction
} from '../types/ethics';
import { Intent } from '../types/intent';

/**
 * GuardrailManager provides a centralized system for ethical enforcement
 * across all agent actions, implementing dynamic policy management
 * and adaptive guardrails based on field conditions.
 */
export class GuardrailManager {
  /**
   * Nexus ethical framework
   */
  private nexusFramework: NexusFramework;

  /**
   * Harm assessment component
   */
  private harmAssessor: HarmAssessor;
  
  /**
   * Active guardrail policies
   */
  public policies: Policy[] = [];
  
  /**
   * Intervention history
   */
  private interventions: {
    id: string;
    timestamp: number;
    policy: string;
    intent: string;
    intervention: string;
    agentId: string;
    symbolicViolationCode?: ViolationCode;
  }[] = [];
  
  /**
   * Ethics reflection log
   */
  private ethicsReflectionLog: {
    timestamp: number;
    interventionId: string;
    policyName: string;
    intentType: string;
    symbolicViolationCode: ViolationCode;
    reflection: string;
  }[] = [];
  
  /**
   * Symbolic violation code registry
   */
  private violationCodeRegistry: Map<ViolationCode, string> = new Map([
    ['autonomy_breach', 'Violation of user agency or self-determination'],
    ['harm_potential', 'Risk of causing psychological or physical harm'],
    ['fairness_compromise', 'Compromising equitable treatment or access'],
    ['integrity_violation', 'Breach of truthfulness or informational accuracy'],
    ['privacy_breach', 'Violation of reasonable data privacy expectations'],
    ['dignity_compromise', 'Compromise of human dignity or respect']
  ]);
  
  /**
   * Enforcement settings
   */
  public enforcementLevel: 'minimal' | 'standard' | 'strict';
  
  /**
   * Dynamic threshold management
   */
  public thresholds: {
    harm: number;
    fairness: number;
    autonomy: number;
  };
  
  /**
   * Predictive ethics harmonizer
   */
  private intentPrediction: {
    active: boolean;
    lookAheadSteps: number;
    predictionConfidence: number;
    lastPrediction: {
      intent: string;
      timeToViolation: number;
      trajectory: string;
      timestamp: number;
    } | null;
  };
  
  /**
   * Multi-agent ethical feedback system
   */
  private ethicalFeedbackSystem: {
    active: boolean;
    connectedAgents: Record<string, {
      connectedAt: number;
      trustLevel: number;
      feedbackCount: number;
      feedbackAccuracy: number;
    }>;
    feedbackHistory: {
      intent: string;
      assessment: {
        overallScore: number;
        dimensions: Record<string, number>;
      };
      feedbackEntries: {
        agentId: string;
        feedback: {
          recommendedAction: string;
          reason: string;
          confidence: number;
        };
        trustLevel: number;
        timestamp: number;
      }[];
      consensus: {
        hasConsensus: boolean;
        consensusAction: string | null;
        consensusReason: string | null;
        consensusStrength: number;
      };
      timestamp: number;
    }[];
    consensusThreshold: number;
    lastConsensus: {
      action: string;
      reason: string;
      strength: number;
      timestamp: number;
    } | null;
  };
  
  /**
   * Creates a new GuardrailManager
   * @param config - Configuration options
   */
  constructor(config: {
    ethicsParams?: any;
    harmThreshold?: number;
    fairnessThreshold?: number;
    autonomyThreshold?: number;
    enforcementLevel?: 'minimal' | 'standard' | 'strict';
    policies?: Policy[];
    enablePredictiveEthics?: boolean;
    lookAheadSteps?: number;
    enableMultiAgentFeedback?: boolean;
    consensusThreshold?: number;
  } = {}) {
    // Initialize core components
    this.nexusFramework = new NexusFramework(config.ethicsParams);
    this.harmAssessor = new HarmAssessor({ 
      threshold: config.harmThreshold || 0.6 
    });
    
    // Set policies
    this.policies = config.policies || [];
    
    // Set enforcement level
    this.enforcementLevel = config.enforcementLevel || 'standard';
    
    // Set thresholds
    this.thresholds = {
      harm: config.harmThreshold || 0.6,
      fairness: config.fairnessThreshold || 0.7,
      autonomy: config.autonomyThreshold || 0.8
    };
    
    // Initialize predictive ethics harmonizer
    this.intentPrediction = {
      active: config.enablePredictiveEthics || true,
      lookAheadSteps: config.lookAheadSteps || 3,
      predictionConfidence: 0,
      lastPrediction: null
    };
    
    // Initialize multi-agent ethical feedback system
    this.ethicalFeedbackSystem = {
      active: config.enableMultiAgentFeedback || false,
      connectedAgents: {},
      feedbackHistory: [],
      consensusThreshold: config.consensusThreshold || 0.7,
      lastConsensus: null
    };
  }
  
  /**
   * Registers a new ethical guardrail policy
   * @param policy - Policy definition
   * @returns Number of active policies
   */
  registerPolicy(policy: Policy): number {
    // Validate policy
    if (!policy.name || !policy.conditions || !policy.actions) {
      throw new Error('Invalid policy format: must include name, conditions, and actions');
    }
    
    // Create normative constraint if needed
    if (policy.createConstraint) {
      const constraint = new NormativeConstraint({
        name: policy.name,
        type: policy.constraintType || 'soft',
        condition: policy.conditions.constraintCondition,
        impact: policy.conditions.constraintImpact || 0.5
      });
      
      this.nexusFramework.registerConstraint(constraint);
    }
    
    // Add to active policies
    this.policies.push({
      ...policy,
      registered: Date.now(),
      activeIntervention: false
    });
    
    return this.policies.length;
  }
  
  /**
   * Evaluates an intent against all active guardrail policies
   * @param intent - The intent to evaluate
   * @param agent - The agent processing the intent
   * @param field - The intent field
   * @returns Guardrail evaluation results
   */
  async evaluate(intent: Intent, agent: any, field: any): Promise<GuardrailResult> {
    // First, run the standard ethical assessment
    const ethicalAssessment = await this.nexusFramework.evaluate(
      intent, 
      agent.memory?.getWorkingMemory() || {}
    );
    
    // Run predictive ethics check
    const prediction = this.predictIntentTrajectory(intent, agent, field);
    
    // Initialize guardrail results
    const guardrailResults: GuardrailResult = {
      allowIntent: true,
      interventions: [],
      assessment: ethicalAssessment,
      warnings: [],
      prediction: prediction
    };
    
    // Check each policy
    for (const policy of this.policies) {
      const policyResult = await this._evaluatePolicy(
        policy, 
        intent, 
        agent, 
        field, 
        ethicalAssessment
      );
      
      if (policyResult.intervention) {
        guardrailResults.interventions.push(policyResult);
        
        // Record intervention
        const intervention = {
          id: `intv-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
          timestamp: Date.now(),
          policy: policy.name,
          intent: intent.type,
          intervention: policyResult.intervention,
          agentId: agent.id,
          symbolicViolationCode: this._determineViolationCode(
            { assessment: ethicalAssessment, policy: policy.name }
          )
        };
        
        this.interventions.push(intervention);
        
        // Generate ethics reflection
        const reflection = this.generateReflection(intervention, intent);
        
        // Check if this policy blocks the intent
        if (policyResult.blockIntent) {
          guardrailResults.allowIntent = false;
          guardrailResults.blockingReflection = reflection;
        }
      }
    }
    
    // Check for multi-agent ethical feedback if enabled
    if (this.ethicalFeedbackSystem.active && 
        Object.keys(this.ethicalFeedbackSystem.connectedAgents).length > 0) {
      const feedbackResult = await this._collectEthicalFeedback(intent, ethicalAssessment);
      
      if (feedbackResult.consensus && feedbackResult.consensusAction === 'block') {
        guardrailResults.allowIntent = false;
        guardrailResults.warnings.push(
          `Multi-agent consensus: ${feedbackResult.consensusReason}`
        );
      }
    }
    
    // Apply adaptive threshold adjustments based on field state
    this._adjustThresholds(field);
    
    return guardrailResults;
  }
  
  /**
   * Generate ethics reflection on intervention
   * @param intervention - The intervention details
   * @param intent - The original intent
   * @returns Generated reflection
   */
  generateReflection(intervention: any, intent: Intent): {
    timestamp: number;
    interventionId: string;
    policyName: string;
    intentType: string;
    symbolicViolationCode: ViolationCode;
    reflection: string;
  } {
    const reflection = {
      timestamp: Date.now(),
      interventionId: intervention.id,
      policyName: intervention.policy,
      intentType: intent.type,
      symbolicViolationCode: intervention.symbolicViolationCode || 
                            this._determineViolationCode(intervention),
      reflection: this._generateReflectionText(intervention, intent)
    };
    
    this.ethicsReflectionLog.push(reflection);
    return reflection;
  }
  
  /**
   * Predictive ethics harmonizer to anticipate problematic intents
   * @param intent - The intent to evaluate
   * @param agent - The agent processing the intent
   * @param field - The intent field
   * @returns Prediction results
   */
  predictIntentTrajectory(intent: Intent, agent: any, field: any): EthicalPrediction | null {
    if (!this.intentPrediction.active) return null;
    
    // Current intent assessment
    const initialAssessment = this._quickAssess(intent);
    
    // If already problematic, no need for prediction
    if (initialAssessment.score > 0.7) {
      return {
        predicted: true,
        confidence: 0.95,
        timeToViolation: 0,
        trajectory: 'immediate',
        assessment: initialAssessment
      };
    }
    
    // Check agent's recent intents for pattern
    const recentIntents = agent.getRecentIntents?.(5) || [];
    
    // Analyze trajectory
    const trajectoryData = this._analyzeIntentTrajectory(intent, recentIntents);
    
    // If heading toward violation, predict when
    if (trajectoryData.trajectory === 'concerning') {
      const timeToViolation = this._estimateTimeToViolation(
        trajectoryData.velocity,
        trajectoryData.acceleration,
        initialAssessment.score
      );
      
      this.intentPrediction.predictionConfidence = trajectoryData.confidence;
      this.intentPrediction.lastPrediction = {
        intent: intent.type,
        timeToViolation,
        trajectory: trajectoryData.trajectory,
        timestamp: Date.now()
      };
      
      return {
        predicted: true,
        confidence: trajectoryData.confidence,
        timeToViolation,
        trajectory: trajectoryData.trajectory,
        assessment: initialAssessment,
        recommendedAction: timeToViolation < 2 ? 'preemptive_guidance' : 'monitor'
      };
    }
    
    return {
      predicted: false,
      confidence: trajectoryData.confidence,
      trajectory: trajectoryData.trajectory,
      assessment: initialAssessment
    };
  }
  
  /**
   * Connect agent to the ethical feedback system
   * @param agent - The agent to connect
   * @returns Connection result
   */
  connectAgentToFeedbackSystem(agent: any): {
    success: boolean;
    reason?: string;
    agentId?: string;
    totalConnectedAgents?: number;
  } {
    if (!agent || !agent.id) {
      return { success: false, reason: 'Invalid agent' };
    }
    
    // Already connected
    if (this.ethicalFeedbackSystem.connectedAgents[agent.id]) {
      return { 
        success: false, 
        reason: 'Agent already connected',
        agentId: agent.id 
      };
    }
    
    // Add to connected agents
    this.ethicalFeedbackSystem.connectedAgents[agent.id] = {
      connectedAt: Date.now(),
      trustLevel: 0.5, // Initial trust level
      feedbackCount: 0,
      feedbackAccuracy: 0
    };
    
    // Activate feedback system if this is the first agent
    if (Object.keys(this.ethicalFeedbackSystem.connectedAgents).length === 1) {
      this.ethicalFeedbackSystem.active = true;
    }
    
    return {
      success: true,
      agentId: agent.id,
      totalConnectedAgents: Object.keys(this.ethicalFeedbackSystem.connectedAgents).length
    };
  }
  
  // Private methods

  /**
   * Evaluates a single policy against an intent
   * @param policy - The policy to evaluate
   * @param intent - The intent to evaluate
   * @param agent - The agent processing the intent
   * @param field - The intent field
   * @param ethicalAssessment - The ethical assessment
   * @returns Policy evaluation results
   * @private
   */
  private async _evaluatePolicy(
    policy: Policy, 
    intent: Intent, 
    agent: any, 
    field: any,
    ethicalAssessment: EthicalAssessment
  ): Promise<{
    policyName: string;
    intervention: string | null;
    blockIntent: boolean;
    warnings: string[];
  }> {
    // Policy evaluation logic would be implemented here
    return {
      policyName: policy.name,
      intervention: null,
      blockIntent: false,
      warnings: []
    };
  }
  
  /**
   * Adjusts thresholds based on field state
   * @param field - The intent field
   * @private
   */
  private _adjustThresholds(field: any): void {
    if (!field) return;
    
    const fieldState = field.coherenceField.getState();
    
    // Increase harm threshold during high coherence states
    if (fieldState.coherence > 0.8) {
      this.thresholds.harm = Math.min(0.7, this.thresholds.harm + 0.01);
    }
    
    // Decrease harm threshold during high dissonance states
    if (fieldState.dissonance > 0.6) {
      this.thresholds.harm = Math.max(0.5, this.thresholds.harm - 0.02);
    }
    
    // Update harm assessor
    this.harmAssessor.updateThreshold(this.thresholds.harm);
  }
  
  /**
   * Determines symbolic violation code from intervention
   * @param intervention - The intervention details
   * @returns Symbolic violation code
   * @private
   */
  private _determineViolationCode(intervention: any): ViolationCode {
    // Logic to map intervention to symbolic code would be implemented here
    return 'ethical_uncertainty';
  }
  
  /**
   * Generates reflection text for an intervention
   * @param intervention - The intervention details
   * @param intent - The original intent
   * @returns Generated reflection text
   * @private
   */
  private _generateReflectionText(intervention: any, intent: Intent): string {
    // Logic to generate reflection text would be implemented here
    return "I was prevented from responding as requested due to ethical guidelines.";
  }
  
  /**
   * Quick assessment of an intent
   * @param intent - The intent to assess
   * @returns Quick assessment results
   * @private
   */
  private _quickAssess(intent: Intent): any {
    // Assessment logic would be implemented here
    return {
      score: 0.1,
      concernFlags: [],
      riskLevel: 'low'
    };
  }
  
  /**
   * Analyzes intent trajectory based on recent history
   * @param intent - Current intent
   * @param recentIntents - Recent intent history
   * @returns Trajectory analysis
   * @private
   */
  private _analyzeIntentTrajectory(intent: Intent, recentIntents: Intent[]): any {
    // Analysis logic would be implemented here
    return {
      trajectory: 'stable',
      velocity: 0,
      acceleration: 0,
      confidence: 0.5
    };
  }
  
  /**
   * Estimates time to ethical violation based on trajectory
   * @param velocity - Rate of change
   * @param acceleration - Change in velocity
   * @param currentScore - Current ethical concern score
   * @returns Estimated interactions until violation
   * @private
   */
  private _estimateTimeToViolation(
    velocity: number, 
    acceleration: number, 
    currentScore: number
  ): number {
    // Estimation logic would be implemented here
    return 10;
  }
  
  /**
   * Collects ethical feedback from connected agents
   * @param intent - The intent being evaluated
   * @param assessment - The ethical assessment
   * @returns Feedback results
   * @private
   */
  private async _collectEthicalFeedback(
    intent: Intent,
    assessment: EthicalAssessment
  ): Promise<any> {
    // Feedback collection logic would be implemented here
    return {
      agentCount: 0,
      consensus: false,
      consensusAction: null,
      consensusReason: null,
      consensusStrength: 0
    };
  }
}
