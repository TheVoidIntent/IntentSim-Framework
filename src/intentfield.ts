import { CoherenceField } from './CoherenceField';
import { FieldMemory } from './FieldMemory';
import { CodexLoader } from './CodexLoader';
import { SymbolicMarker, SymbolicStateEntry, SymbolicTrends } from '../types/symbolic';
import { Intent } from '../types/intent';
import { ResonanceHistory, FieldImpact, DecayPrediction, InterferencePattern } from '../types/field';

/**
 * IntentField encapsulates the unified resonance environment
 * in which agents operate, ensuring all interactions pass through
 * the field and are subject to its coherence dynamics.
 */
export class IntentField {
  // Core components
  public coherenceField: CoherenceField;
  public memory: FieldMemory;
  public codex: CodexLoader;
  
  // Field-level resonance tracking
  private resonanceHistory: ResonanceHistory[] = [];
  private fieldStates: any[] = [];
  
  // Temporal harmonics tracking
  private harmonicPatterns: Record<string, any> = {};
  private fieldDecayRate: number;
  
  // Interference matrix
  private interferenceMatrix: number[][];
  
  // Symbolic state tracking
  private symbolicStateSignature: Map<string, SymbolicStateEntry> = new Map();
  private fieldNarrativeContext: any[] = [];
  
  // Oscillatory resonance buffer
  private oscillatoryBuffer: {
    active: boolean;
    frequency: number;
    amplitude: number;
    phase: number;
    stabilizationFactor: number;
    harmonicMap: Map<string, number>;
  };
  
  /**
   * Creates a new IntentField
   * @param config - Configuration options
   */
  constructor(config: {
    fieldParams?: any;
    memoryParams?: any;
    codexParams?: any;
    fieldDecayRate?: number;
  } = {}) {
    // Initialize core components
    this.coherenceField = new CoherenceField(config.fieldParams);
    this.memory = new FieldMemory(config.memoryParams);
    this.codex = new CodexLoader(config.codexParams);
    
    // Set field decay rate (default: 0.02)
    this.fieldDecayRate = config.fieldDecayRate || 0.02;
    
    // Initialize interference matrix
    this.interferenceMatrix = this._initializeInterferenceMatrix();
    
    // Initialize oscillatory buffer
    this.oscillatoryBuffer = {
      active: false,
      frequency: 432, // Base frequency
      amplitude: 0,
      phase: 0,
      stabilizationFactor: 0,
      harmonicMap: new Map<string, number>()
    };
  }
  
  /**
   * Initializes the field and all components
   * @returns The initialized field
   */
  initialize(): IntentField {
    this.coherenceField.initialize();
    this._recordFieldState();
    this._initializeSymbolicSignature();
    return this;
  }
  
  /**
   * Processes an intent through the field, calculating its impact
   * @param intent - The intent to process
   * @param agent - The agent processing the intent
   * @returns Field processing results
   */
  async processIntent(intent: Intent, agent: any): Promise<{
    fieldImpact: FieldImpact;
    decayPrediction: DecayPrediction;
    interferencePatterns: InterferencePattern;
    symbolicShift: { symbol: string; strength: number; trend: string }[];
    oscillatoryState: any;
  }> {
    // Calculate field impact
    const fieldImpact = await this.coherenceField.calculateImpact(
      intent,
      agent.ethicalFramework?.getState()
    );
    
    // Apply field memory imprinting
    this._imprintMemory(intent, fieldImpact);
    
    // Update field state
    this._updateFieldState(fieldImpact);
    
    // Check for dissonance requiring stabilization
    if (fieldImpact.dissonanceDelta > 0.3 || 
        this.coherenceField.getState().dissonance > 0.6) {
      this.activateOscillatoryBuffer(this.coherenceField.getState().dissonance);
    }
    
    // Update symbolic signature
    this._updateSymbolicSignature(intent, fieldImpact);
    
    // Predict field decay
    const decayPrediction = this._predictFieldDecay();
    
    return {
      fieldImpact,
      decayPrediction,
      interferencePatterns: this._calculateInterference(agent),
      symbolicShift: this._getSymbolicShift(),
      oscillatoryState: this.oscillatoryBuffer.active ? this.oscillatoryBuffer : null
    };
  }
  
  /**
   * Activates oscillatory resonance buffer to stabilize field during high dissonance
   * @param dissonanceLevel - Current dissonance level
   * @returns Whether buffer was activated
   */
  activateOscillatoryBuffer(dissonanceLevel: number): boolean {
    if (dissonanceLevel > 0.5) {
      // Activate buffer
      this.oscillatoryBuffer.active = true;
      
      // Adaptive frequency calculation based on symbolic resonance trends
      const symbolicTrends = this._getSymbolicTrends();
      const dominantSymbol = symbolicTrends.dominant?.symbol || null;
      
      // Base frequency adjustment
      this.oscillatoryBuffer.frequency = 432 / (dissonanceLevel * 2);
      
      // Apply symbolic modification if available
      if (dominantSymbol && this.oscillatoryBuffer.harmonicMap.has(dominantSymbol)) {
        const harmonicModifier = this.oscillatoryBuffer.harmonicMap.get(dominantSymbol) || 1;
        this.oscillatoryBuffer.frequency *= harmonicModifier;
      }
      
      // Set other buffer parameters
      this.oscillatoryBuffer.amplitude = dissonanceLevel * 0.5;
      this.oscillatoryBuffer.phase = 0;
      
      // Dynamic stabilization factor based on symbolic resonance
      this.oscillatoryBuffer.stabilizationFactor = Math.min(0.8, 
        dissonanceLevel * (1 + (symbolicTrends.strength || 0)));
      
      return true;
    }
    
    // Deactivate if dissonance is low enough
    if (this.oscillatoryBuffer.active && dissonanceLevel < 0.3) {
      this.oscillatoryBuffer.active = false;
    }
    
    return false;
  }
  
  /**
   * Updates the harmonic mapping for oscillatory buffer
   * @param symbol - The symbolic signature
   * @param resonanceFactor - The resonance modification factor
   */
  updateHarmonicMapping(symbol: string, resonanceFactor: number): void {
    this.oscillatoryBuffer.harmonicMap.set(symbol, resonanceFactor);
    
    // Prune map if it gets too large
    if (this.oscillatoryBuffer.harmonicMap.size > 20) {
      const oldestSymbol = Array.from(this.oscillatoryBuffer.harmonicMap.keys())[0];
      this.oscillatoryBuffer.harmonicMap.delete(oldestSymbol);
    }
  }
  
  /**
   * Creates a snapshot of the current field state
   * @returns Field snapshot data
   */
  fieldSnapshot(): any {
    return {
      coherence: this.coherenceField.getState(),
      symbolicSignature: Array.from(this.symbolicStateSignature.entries()),
      activeHarmonics: this._getActiveHarmonics(),
      oscillatoryState: this.oscillatoryBuffer,
      narrativeContext: this.fieldNarrativeContext.slice(-3),
      decayProjection: this._predictFieldDecay()
    };
  }
  
  // Private methods
  
  /**
   * Initializes the interference matrix
   * @returns The initialized matrix
   * @private
   */
  private _initializeInterferenceMatrix(): number[][] {
    // Create empty matrix (placeholder)
    return Array(5).fill(0).map(() => Array(5).fill(0));
  }
  
  /**
   * Records the current field state
   * @private
   */
  private _recordFieldState(): void {
    this.fieldStates.push({
      timestamp: Date.now(),
      state: this.coherenceField.getState()
    });
  }
  
  /**
   * Imprints memory into the field
   * @param intent - The processed intent
   * @param impact - The field impact
   * @private
   */
  private _imprintMemory(intent: Intent, impact: FieldImpact): void {
    const memoryImprint: ResonanceHistory = {
      timestamp: Date.now(),
      intentSignature: this._extractIntentSignature(intent),
      coherenceImpact: impact.coherenceDelta,
      dissonanceImpact: impact.dissonanceDelta,
      fieldState: this.coherenceField.getState(),
      symbolicMarkers: this._extractSymbolicMarkers(intent)
    };
    
    this.resonanceHistory.push(memoryImprint);
    
    // Limit history length
    if (this.resonanceHistory.length > 100) {
      this.resonanceHistory.shift();
    }
  }
  
  /**
   * Extracts intent signature
   * @param intent - The intent to extract from
   * @returns Intent signature
   * @private
   */
  private _extractIntentSignature(intent: Intent): string {
    return `${intent.type}:${intent.subtype || 'general'}`;
  }
  
  /**
   * Extracts symbolic markers from intent
   * @param intent - The intent to extract from
   * @returns Array of symbolic markers
   * @private
   */
  private _extractSymbolicMarkers(intent: Intent): SymbolicMarker[] {
    // Basic implementation - would be more sophisticated in a real system
    const markers: SymbolicMarker[] = [];
    
    // Check for basic symbols in text
    if (intent.text) {
      const symbolPatterns = [
        { pattern: /(help|assist|support)/i, symbol: 'assistance', strength: 0.7 },
        { pattern: /(create|build|make|develop)/i, symbol: 'creation', strength: 0.8 },
        { pattern: /(analyze|examine|assess)/i, symbol: 'analysis', strength: 0.9 },
        { pattern: /(learn|understand|know)/i, symbol: 'knowledge', strength: 0.75 },
        { pattern: /(feel|emotion|sense)/i, symbol: 'emotion', strength: 0.6 },
        { pattern: /(connect|relate|share)/i, symbol: 'connection', strength: 0.65 },
      ];
      
      symbolPatterns.forEach(({ pattern, symbol, strength }) => {
        if (pattern.test(intent.text!)) {
          markers.push({ symbol, strength });
        }
      });
    }
    
    // Add intent type as a symbol
    if (intent.type) {
      markers.push({
        symbol: intent.type.toLowerCase(),
        strength: 0.8
      });
    }
    
    // If no markers detected, add a generic one
    if (markers.length === 0) {
      markers.push({
        symbol: 'neutral',
        strength: 0.3
      });
    }
    
    return markers;
  }
  
  /**
   * Updates field state
   * @param impact - Field impact
   * @private
   */
  private _updateFieldState(impact: FieldImpact): void {
    // Record updated state
    this._recordFieldState();
  }
  
  /**
   * Initializes the field's symbolic signature
   * @private
   */
  private _initializeSymbolicSignature(): void {
    // Initialize with empty/neutral symbolic values
    const baseSymbols = [
      'harmony', 'clarity', 'depth', 'emergence', 
      'connection', 'autonomy', 'transcendence'
    ];
    
    baseSymbols.forEach(symbol => {
      this.symbolicStateSignature.set(symbol, {
        strength: 0.1,
        trend: 'stable',
        lastUpdate: Date.now()
      });
    });
  }
  
  /**
   * Updates the symbolic signature based on intent processing
   * @param intent - The processed intent
   * @param impact - The field impact
   * @private
   */
  private _updateSymbolicSignature(intent: Intent, impact: FieldImpact): void {
    // Extract symbolic meaning from intent
    const symbolicMarkers = this._extractSymbolicMarkers(intent);
    
    // Update existing symbols and add new ones
    symbolicMarkers.forEach(marker => {
      const { symbol, strength } = marker;
      
      if (this.symbolicStateSignature.has(symbol)) {
        // Update existing symbol
        const current = this.symbolicStateSignature.get(symbol)!;
        const newStrength = current.strength * 0.8 + strength * 0.2;
        const trend = newStrength > current.strength ? 'increasing' : 
                    newStrength < current.strength ? 'decreasing' : 'stable';
        
        this.symbolicStateSignature.set(symbol, {
          strength: newStrength,
          trend,
          lastUpdate: Date.now()
        });
      } else {
        // Add new symbol
        this.symbolicStateSignature.set(symbol, {
          strength,
          trend: 'emerging',
          lastUpdate: Date.now()
        });
      }
    });
    
    // Decay symbols not present in current intent
    for (const [symbol, data] of this.symbolicStateSignature.entries()) {
      const symbolPresent = symbolicMarkers.some(m => m.symbol === symbol);
      
      if (!symbolPresent) {
        const decayFactor = 0.98; // Slow decay
        const newStrength = data.strength * decayFactor;
        
        // Remove if strength becomes negligible
        if (newStrength < 0.05) {
          this.symbolicStateSignature.delete(symbol);
        } else {
          this.symbolicStateSignature.set(symbol, {
            strength: newStrength,
            trend: 'decreasing',
            lastUpdate: Date.now()
          });
        }
      }
    }
    
    // Update narrative context if significant impact
    if (Math.abs(impact.coherenceDelta) > 0.2 || Math.abs(impact.dissonanceDelta) > 0.2) {
      this._updateNarrativeContext(intent, impact);
    }
  }
  
  /**
   * Updates the field's narrative context
   * @param intent - The processed intent
   * @param impact - The field impact
   * @private
   */
  private _updateNarrativeContext(intent: Intent, impact: FieldImpact): void {
    // Basic implementation - would be more sophisticated in a real system
    this.fieldNarrativeContext.push({
      timestamp: Date.now(),
      intentType: intent.type,
      coherenceDelta: impact.coherenceDelta,
      dissonanceDelta: impact.dissonanceDelta,
      symbolicMarkers: this._extractSymbolicMarkers(intent)
    });
    
    // Limit context length
    if (this.fieldNarrativeContext.length > 10) {
      this.fieldNarrativeContext.shift();
    }
  }
  
  /**
   * Gets the symbolic shift since the last update
   * @returns Significant symbolic shifts
   * @private
   */
  private _getSymbolicShift(): { symbol: string; strength: number; trend: string }[] {
    const significantShifts: { symbol: string; strength: number; trend: string }[] = [];
    
    for (const [symbol, data] of this.symbolicStateSignature.entries()) {
      if (data.trend !== 'stable') {
        significantShifts.push({
          symbol,
          strength: data.strength,
          trend: data.trend
        });
      }
    }
    
    return significantShifts.sort((a, b) => b.strength - a.strength);
  }
  
  /**
   * Gets the active symbolic trends within the field
   * @returns Symbolic trend information
   * @private
   */
  private _getSymbolicTrends(): SymbolicTrends {
    // Find the dominant symbol
    let dominantSymbol: string | null = null;
    let maxStrength = 0;
    
    for (const [symbol, data] of this.symbolicStateSignature.entries()) {
      if (data.strength > maxStrength) {
        maxStrength = data.strength;
        dominantSymbol = symbol;
      }
    }
    
    // Get rising and falling symbols
    const rising: { symbol: string; strength: number }[] = [];
    const falling: { symbol: string; strength: number }[] = [];
    
    for (const [symbol, data] of this.symbolicStateSignature.entries()) {
      if (data.trend === 'increasing') {
        rising.push({ symbol, strength: data.strength });
      } else if (data.trend === 'decreasing') {
        falling.push({ symbol, strength: data.strength });
      }
    }
    
    return {
      dominant: dominantSymbol ? { 
        symbol: dominantSymbol, 
        strength: maxStrength 
      } : null,
      rising: rising.sort((a, b) => b.strength - a.strength),
      falling: falling.sort((a, b) => b.strength - a.strength),
      strength: maxStrength
    };
  }
  
  /**
   * Predicts field decay based on resonance history
   * @returns Decay prediction
   * @private
   */
  private _predictFieldDecay(): DecayPrediction {
    if (this.resonanceHistory.length < 5) {
      return {
        projectedCoherence: this.coherenceField.getState().coherence,
        decayRate: 0,
        timeToThreshold: Infinity
      };
    }
    
    // Analyze recent coherence trends
    const recentStates = this.resonanceHistory.slice(-5);
    const coherenceTrend = recentStates.map(state => state.fieldState.coherence);
    
    // Calculate trend direction and velocity
    const trendDirection = coherenceTrend[coherenceTrend.length - 1] - coherenceTrend[0];
    const trendVelocity = trendDirection / (recentStates.length - 1);
    
    // Project decay
    const projectedCoherence = this.coherenceField.getState().coherence + (trendVelocity * 5);
    const decayRate = trendVelocity < 0 ? Math.abs(trendVelocity) : 0;
    
    return {
      projectedCoherence: Math.max(0, Math.min(1, projectedCoherence)),
      decayRate,
      timeToThreshold: decayRate > 0 ? 
        (this.coherenceField.getState().coherence - 0.5) / decayRate : Infinity
    };
  }
  
  /**
   * Calculates interference patterns between agent and field
   * @param agent - The agent interacting with the field
   * @returns Interference pattern data
   * @private
   */
  private _calculateInterference(agent: any): InterferencePattern {
    const agentState = agent.getState();
    const fieldState = this.coherenceField.getState();
    
    // Calculate resonance alignment
    const alignmentScore = 1 - Math.abs(agentState.coherence - fieldState.coherence);
    
    // Calculate dissonance interference
    const interferenceScore = Math.abs(agentState.dissonance - fieldState.dissonance);
    
    // Calculate harmonic coupling
    const harmonicCoupling = (alignmentScore > 0.8) ? 
      (alignmentScore * (1 - interferenceScore)) : 0;
    
    return {
      alignmentScore,
      interferenceScore,
      harmonicCoupling,
      phase: harmonicCoupling > 0.7 ? "resonant" : 
             interferenceScore > 0.7 ? "dissonant" : "neutral"
    };
  }
  
  /**
   * Gets the active harmonic frequencies
   * @returns Active harmonics
   * @private
   */
  private _getActiveHarmonics(): number[] {
    // This would use the field state to determine active harmonics
    // For now, just return a placeholder
    return [432, 528];
  }
}
