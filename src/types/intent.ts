/**
 * Intent representation
 */
export interface Intent {
  /**
   * Intent type
   */
  type: string;
  
  /**
   * Intent subtype (optional)
   */
  subtype?: string;
  
  /**
   * Intent text (optional)
   */
  text?: string;
  
  /**
   * Intent parameters (optional)
   */
  parameters?: Record<string, any>;
  
  /**
   * Intent metadata (optional)
   */
  metadata?: Record<string, any>;
}
