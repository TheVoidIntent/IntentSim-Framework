/**
 * Symbolic marker representing meaning
 */
export interface SymbolicMarker {
  /**
   * Symbol identifier
   */
  symbol: string;
  
  /**
   * Symbol strength (0-1)
   */
  strength: number;
}

/**
 * Entry in symbolic state signature
 */
export interface SymbolicStateEntry {
  /**
   * Symbol strength (0-1)
   */
  strength: number;
  
  /**
   * Current trend (increasing, decreasing, stable, emerging)
   */
  trend: 'increasing' | 'decreasing' | 'stable' | 'emerging';
  
  /**
   * Last update timestamp
   */
  lastUpdate: number;
}

/**
 * Symbolic trends analysis
 */
export interface SymbolicTrends {
  /**
   * Dominant symbol
   */
  dominant: { symbol: string; strength: number } | null;
  
  /**
   * Rising symbols
   */
  rising: { symbol: string; strength: number }[];
  
  /**
   * Falling symbols
   */
  falling: { symbol: string; strength: number }[];
  
  /**
   * Overall strength
   */
  strength: number;
}
