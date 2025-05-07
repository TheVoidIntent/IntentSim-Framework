/**
 * Security policy for the SecurityGuardian agent
 */
export interface SecurityPolicy {
  /**
   * Policy name
   */
  name: string;
  
  /**
   * Policy description
   */
  description?: string;
  
  /**
   * Conditions that trigger this policy
   */
  conditions: Record<string, any>;
  
  /**
   * Actions to take when policy is triggered
   */
  actions: {
    /**
     * Action type
     */
    type: 'scan' | 'alert' | 'block' | 'mitigate' | 'log';
    
    /**
     * Action severity
     */
    severity?: 'critical' | 'high' | 'medium' | 'low';
    
    /**
     * Action parameters
     */
    params?: Record<string, any>;
    
    /**
     * Action message
     */
    message?: string;
  }[];
  
  /**
   * Whether policy is currently active
   */
  active?: boolean;
  
  /**
   * Policy metadata
   */
  metadata?: {
    /**
     * Creation timestamp
     */
    created: number;
    
    /**
     * Last updated timestamp
     */
    updated: number;
    
    /**
     * Creator identifier
     */
    creator: string;
    
    /**
     * Target areas
     */
    targetAreas: string[];
  };
}

/**
 * Security scan result
 */
export interface SecurityScanResult {
  /**
   * Scan timestamp
   */
  timestamp: number;
  
  /**
   * Scan status
   */
  status: 'completed' | 'failed' | 'partial';
  
  /**
   * Issues found during scan
   */
  issues: {
    /**
     * Issue ID
     */
    id: string;
    
    /**
     * Issue type
     */
    type: 'intrusion' | 'copyright' | 'dependency' | 'permission' | 'other';
    
    /**
     * Issue severity
     */
    severity: 'critical' | 'high' | 'medium' | 'low';
    
    /**
     * Issue description
     */
    description: string;
    
    /**
     * Issue location
     */
    location: string;
    
    /**
     * Issue recommendation
     */
    recommendation: string;
    
    /**
     * Mitigation status
     */
    mitigated: boolean;
  }[];
  
  /**
   * Overall security score (0-1)
   */
  securityScore: number;
  
  /**
   * Recommendations
   */
  recommendations: string[];
}

/**
 * Intrusion detection result
 */
export interface IntrusionDetectionResult {
  /**
   * Detection timestamp
   */
  timestamp: number;
  
  /**
   * Detected intrusions
   */
  intrusions: {
    /**
     * Pattern matched
     */
    pattern: string;
    
    /**
     * Pattern name
     */
    name: string;
    
    /**
     * Intrusion location
     */
    location: string;
    
    /**
     * Intrusion severity
     */
    severity: 'critical' | 'high' | 'medium' | 'low';
    
    /**
     * Intrusion details
     */
    details: string;
    
    /**
     * Recommended action
     */
    recommendedAction: string;
  }[];
  
  /**
   * Current threat level (0-1)
   */
  threatLevel: number;
}

/**
 * Copyright verification result
 */
export interface CopyrightVerificationResult {
  /**
   * Verification timestamp
   */
  timestamp: number;
  
  /**
   * Overall status
   */
  status: 'clean' | 'issues_found';
  
  /**
   * Violations found
   */
  violations: {
    /**
     * File path
     */
    file: string;
    
    /**
     * Violation description
     */
    violation: string;
    
    /**
     * Violation severity
     */
    severity: 'critical' | 'high' | 'medium' | 'low';
    
    /**
     * Recommended action
     */
    recommendation: string;
  }[];
  
  /**
   * Recommendations
   */
  recommendations: string[];
}

/**
 * Repository intrusion cleanup result
 */
export interface IntrusionCleanupResult {
  /**
   * Cleanup timestamp
   */
  timestamp: number;
  
  /**
   * Overall success status
   */
  success: boolean;
  
  /**
   * Items successfully cleaned
   */
  cleanedItems: string[];
  
  /**
   * Items that failed cleaning
   */
  failedItems: string[];
  
  /**
   * Cleanup recommendations
   */
  recommendations: string[];
}
