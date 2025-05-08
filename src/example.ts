/**
 * Example file demonstrating basic usage of IntentSim
 */

import * as types from './types/intent';

// Basic interface for an intent
export interface BasicIntent {
  type: string;
  text: string;
}

// Simple function to demonstrate the framework is building
export function processIntent(intent: BasicIntent): string {
  return `Processed intent of type: ${intent.type} with text: ${intent.text}`;
}

// Example usage
export function runExample(): void {
  const intent: BasicIntent = {
    type: 'example',
    text: 'This is a test intent'
  };
  
  const result = processIntent(intent);
  console.log(result);
}