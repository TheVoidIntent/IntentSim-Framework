import { SecurityCore } from '../security/SecurityCore';
import { IntentAgent } from '../core/IntentAgent';

/**
 * Event object for security monitoring
 */
export interface SecurityEvent {
  /**
   * File being accessed
   */
  file: string;
  
  /**
   * Origin of request
   */
  origin: string;
  
  /**
   * Whether event contains equation access
   */
  containsEquation: boolean;
  
  /**
   * Provided license key
   */
  licenseKey: string | null;
  
  /**
   * Additional context
   */
  context?: Record<string, any>;
}

/**
 * IntentGuardian is a specialized security agent that
 * monitors and protects the IntentSim[on] Framework
 * against unauthorized use or tampering.
 */
export class IntentGuardian extends IntentAgent {
  /**
   * Security core for license validation
   */
  public security: SecurityCore;
  
  /**
   * List of files to watch for unauthorized access
   */
  private watchlist: string[];
  
  /**
   * Guardian name
   */
  private guardianName: string;
  
  /**
   * Active monitoring status
   */
  private monitoringActive: boolean = false;
  
  /**
   * Monitoring history
   */
  private monitoringHistory: {
    timestamp: number;
    file: string;
    origin: string;
    outcome: 'allowed' | 'blocked';
    reason: string;
  }[] = [];
  
  /**
   * Field dissonance history
   */
  private dissonanceHistory: {
    timestamp: number;
    dissonanceLevel: number;
    fieldState: any;
    scrubbingInitiated: boolean;
  }[] = [];
  
  /**
   * Creates a new IntentGuardian
   * @param config - Configuration options
   */
  constructor(config: {
    name?: string;
    security?: {
      agentId?: string;
      licenseKey?: string | null;
      enforcementLevel?: 'warn' | 'strict' | 'paranoid';
      quantumEntropySeed?: number;
    };
    watchlist?: string[];
  } = {}) {
    // Initialize base agent with guardian-specific settings
    super({
      name: config.name || 'Intent-Guardian',
      archetype: 'protector',
      cognitionParams: {
        stage: 'advanced',
        traits: {
          vigilance: 0.95,
          precision: 0.9,
          resilience: 0.85
        },
        role: 'guardian'
      }
    });
    
    // Initialize security components
    this.security = new SecurityCore(config.security || {});
    this.watchlist = config.watchlist || [
      'intentField.js', 
      'symbolicIntentResolver.js', 
      'CognitiveProfile.js',
      'IntentAgent.js',
      'GuardrailManager.js',
      'PersonaLayer.js'
    ];
    this.guardianName = config.name || 'Intent-Guardian';
  }
  
  /**
   * Activates the guardian with enhanced security initialization
   * @returns The activated guardian
   */
  activate(): IntentGuardian {
    super.activate();
    
    // Activate monitoring
    this.monitoringActive = true;
    
    // Log activation
    console.log(`🛡️ ${this.guardianName} security monitoring activated`);
    
    return this;
  }
  
  /**
   * Monitors sensitive files and function calls
   * @param event - Security event
   * @returns Monitoring result
   */
  monitor(event: SecurityEvent): {
    allowed: boolean;
    message: string;
  } {
    if (!this.monitoringActive) {
      return {
        allowed: false,
        message: `${this.guardianName} monitoring is currently inactive.`
      };
    }
    
    // Check if file is on watchlist
    if (this.watchlist.includes(event.file)) {
      // For equation access, validate against license key
      if (event.containsEquation) {
        const allowed = this.security.validateEquationUsage(event.licenseKey);
        
        // Record monitoring event
        this._recordMonitoringEvent({
          file: event.file,
          origin: event.origin,
          outcome: allowed ? 'allowed' : 'blocked',
          reason: allowed ? 'valid license' : 'invalid license'
        });
        
        if (!allowed) {
          return this.intervene(event);
        }
      }
      
      // For non-equation access, still record monitoring
      else {
        this._recordMonitoringEvent({
          file: event.file,
          origin: event.origin,
          outcome: 'allowed',
          reason: 'non-equation access'
        });
      }
    }
    
    // Monitor field dissonance for security anomalies
    this._monitorFieldDissonance();
    
    return {
      allowed: true,
      message: `${this.guardianName} allowed access to ${event.file}`
    };
  }
  
  /**
   * Enforces consequences or lockdown
   * @param event - Security event
   * @returns Intervention result
   */
  intervene(event: SecurityEvent): {
    allowed: boolean;
    message: string;
  } {
    console.warn(`🚨 ${this.guardianName} intercepted unauthorized access to ${event.file} from ${event.origin}`);
    
    // Record intervention in agent state
    this.cognitiveProfile.recordResonanceEvent({
      type: 'security_intervention',
      coherence: 0.8,
      dissonance: 0.7,
      trigger: 'unauthorized_access',
      resolution: 'blocked'
    });
    
    // Send security alert to field
    this.field.processIntent({
      type: 'security_alert',
      subtype: 'unauthorized_access',
      text: `${this.guardianName} blocked unauthorized access to ${event.file} from ${event.origin}`,
      parameters: {
        file: event.file,
        origin: event.origin,
        timestamp: Date.now()
      }
    }, this);
    
    // Return intervention result
    return {
      allowed: false,
      message: `Unauthorized access blocked by ${this.guardianName}`
    };
  }
  
  /**
   * Checks current field dissonance levels for security implications
   * @returns Dissonance analysis
   */
  checkFieldDissonance(): {
    currentDissonance: number;
    securityImplications: boolean;
    recommendedAction: string | null;
  } {
    const fieldState = this.field.fieldSnapshot();
    const currentDissonance = fieldState.coherence.dissonance;
    
    // Record dissonance level
    this._recordDissonanceLevel(currentDissonance, fieldState);
    
    // Check for security implications
    const securityImplications = currentDissonance > 0.7;
    let recommendedAction = null;
    
    if (securityImplications) {
      if (currentDissonance > 0.9) {
        // Critical dissonance, initiate scrubbing
        recommendedAction = 'initiate_dissonance_scrubbing';
        this._initiateScrubbingIfNeeded(currentDissonance);
      } else if (currentDissonance > 0.8) {
        // High dissonance, increase monitoring
        recommendedAction = 'increase_monitoring';
      } else {
        // Moderate dissonance, continue monitoring
        recommendedAction = 'continue_monitoring';
      }
    }
    
    return {
      currentDissonance,
      securityImplications,
      recommendedAction
    };
  }
  
  /**
   * Initiates field dissonance scrubbing if needed
   * @param dissonanceLevel - Current dissonance level
   * @returns Scrubbing result
   */
  scrubFieldDissonance(dissonanceLevel: number): {
    initiated: boolean;
    dissonanceReduction: number;
    message: string;
  } {
    // Only scrub if dissonance is above threshold
    if (dissonanceLevel < 0.7) {
      return {
        initiated: false,
        dissonanceReduction: 0,
        message: 'Dissonance level too low to justify scrubbing'
      };
    }
    
    // Initiate scrubbing through security core
    const scrubbingResult = this.security.initiateDissonanceScrubbing();
    
    // Record scrubbing in history
    this._recordDissonanceLevel(dissonanceLevel, null, true);
    
    // Calculate dissonance reduction
    const dissonanceReduction = scrubbingResult.scrubbed ? 0.3 : 0;
    
    return {
      initiated: scrubbingResult.scrubbed,
      dissonanceReduction,
      message: `Field dissonance scrubbing ${scrubbingResult.scrubbed ? 'successful' : 'failed'}`
    };
  }
  
  /**
   * Gets monitoring status
   * @returns Monitoring status
   */
  getMonitoringStatus(): {
    active: boolean;
    watchlistFiles: string[];
    eventsMonitored: number;
    lastEvent: {
      timestamp: number;
      file: string;
      outcome: string;
    } | null;
    fieldDissonance: number;
  } {
    const lastEvent = this.monitoringHistory.length > 0 ?
      this.monitoringHistory[this.monitoringHistory.length - 1] : null;
    
    const lastEventData = lastEvent ? {
      timestamp: lastEvent.timestamp,
      file: lastEvent.file,
      outcome: lastEvent.outcome
    } : null;
    
    return {
      active: this.monitoringActive,
      watchlistFiles: [...this.watchlist],
      eventsMonitored: this.monitoringHistory.length,
      lastEvent: lastEventData,
      fieldDissonance: this.field.fieldSnapshot().coherence.dissonance
    };
  }
  
  /**
   * Adds a file to the watchlist
   * @param file - File to add
   * @returns Updated watchlist
   */
  addToWatchlist(file: string): string[] {
    if (!this.watchlist.includes(file)) {
      this.watchlist.push(file);
    }
    return [...this.watchlist];
  }
  
  /**
   * Removes a file from the watchlist
   * @param file - File to remove
   * @returns Updated watchlist
   */
  removeFromWatchlist(file: string): string[] {
    this.watchlist = this.watchlist.filter(f => f !== file);
    return [...this.watchlist];
  }
  
  /**
   * Records monitoring event
   * @param event - Event to record
   * @private
   */
  private _recordMonitoringEvent(event: {
    file: string;
    origin: string;
    outcome: 'allowed' | 'blocked';
    reason: string;
  }): void {
    this.monitoringHistory.push({
      timestamp: Date.now(),
      ...event
    });
    
    // Limit history length
    if (this.monitoringHistory.length > 100) {
      this.monitoringHistory.shift();
    }
  }
  
  /**
   * Monitors field dissonance for security anomalies
   * @private
   */
  private _monitorFieldDissonance(): void {
    const fieldState = this.field.fieldSnapshot();
    const currentDissonance = fieldState.coherence.dissonance;
    
    // Record dissonance level
    this._recordDissonanceLevel(currentDissonance, fieldState);
    
    // Check if dissonance is high enough to warrant intervention
    this._initiateScrubbingIfNeeded(currentDissonance);
  }
  
  /**
   * Records field dissonance level
   * @param dissonanceLevel - Dissonance level
   * @param fieldState - Current field state
   * @param scrubbingInitiated - Whether scrubbing was initiated
   * @private
   */
  private _recordDissonanceLevel(
    dissonanceLevel: number, 
    fieldState: any,
    scrubbingInitiated: boolean = false
  ): void {
    this.dissonanceHistory.push({
      timestamp: Date.now(),
      dissonanceLevel,
      fieldState,
      scrubbingInitiated
    });
    
    // Limit history length
    if (this.dissonanceHistory.length > 50) {
      this.dissonanceHistory.shift();
    }
  }
  
  /**
   * Initiates dissonance scrubbing if needed
   * @param dissonanceLevel - Current dissonance level
   * @private
   */
  private _initiateScrubbingIfNeeded(dissonanceLevel: number): void {
    // Check for critical dissonance
    if (dissonanceLevel > 0.9) {
      console.warn(`⚠️ ${this.guardianName} detected critical field dissonance: ${dissonanceLevel.toFixed(2)}`);
      
      // Initiate dissonance scrubbing
      const scrubbingResult = this.scrubFieldDissonance(dissonanceLevel);
      
      // Log result
      console.log(`🧹 Dissonance scrubbing ${scrubbingResult.initiated ? 'initiated' : 'skipped'}: ${scrubbingResult.message}`);
    }
  }
}
