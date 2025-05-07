// create-intentsim/templates/basic/package.json (continued)
{
  "name": "{{projectName}}",
  "version": "0.1.0",
  "description": "An IntentSim[on] Framework project",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "scripts": {
    "build": "tsc",
    "dev": "ts-node src/index.ts",
    "start": "node dist/index.js",
    "test": "vitest run",
    "test:watch": "vitest",
    "docs": "typedoc",
    "lint": "eslint src --ext .ts"
  },
  "keywords": [
    "intent",
    "framework",
    "intentsimon",
    "agent"
  ],
  "author": "{{author}}",
  "license": "MIT",
  "dependencies": {
    "@intentsimon/core": "^1.0.0",
    "eventemitter3": "^5.0.1"
  },
  "devDependencies": {
    "@types/node": "^18.15.11",
    "eslint": "^8.38.0",
    "ts-node": "^10.9.1",
    "typedoc": "^0.24.4",
    "typedoc-plugin-markdown": "^3.15.3",
    "typescript": "^5.0.4",
    "vitest": "^0.30.1"
  }
}

// create-intentsim/templates/basic/tsconfig.json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "declaration": true,
    "outDir": "./dist",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "tests"]
}

// create-intentsim/templates/basic/README.md
# {{projectName}}

An intent-native project built with the IntentSim[on] Framework.

## Overview

This project uses the IntentSim[on] Framework to create an intent-driven agent with:

- Intent field coherence
- Cognitive awareness
- {{archetype}} archetype characteristics

## Getting Started

```bash
# Install dependencies
npm install

# Run development mode
npm run dev

# Build for production
npm run build

# Run tests
npm run test
```

## Project Structure

```
src/
├── core/          # Core components
├── types/         # TypeScript type definitions
└── utils/         # Utility functions

tests/             # Test files
examples/          # Example implementations
docs/              # Documentation
```

## License

MIT © {{author}}

// create-intentsim/templates/basic/src/index.ts
import { IntentField, IntentAgent } from '@intentsimon/core';
import { AgentConfig } from './types/agent';

/**
 * Main entry point for the IntentSim[on] Framework project
 */
console.log('Initializing IntentSim[on] Framework project...');

// Create an intent field
const field = new IntentField();
console.log('Intent field created with coherence:', field.measureCoherence());

// Create an agent with the {{archetype}} archetype
const agentConfig: AgentConfig = {
  name: '{{projectName}}-agent',
  archetype: '{{archetype}}',
  intentionality: 0.8,
  autonomy: 0.6,
  fieldSensitivity: 0.75
};

const agent = new IntentAgent(agentConfig, field);
console.log(`Agent "${agent.name}" created with ${agent.archetype} archetype`);

// Basic field interaction example
field.perturbField(0.2);
console.log('Field perturbed, new coherence:', field.measureCoherence());
console.log('Agent field resonance:', agent.measureFieldResonance());

console.log('\nIntentSim[on] Framework project initialized successfully!');

// create-intentsim/templates/basic/src/types/agent.ts
/**
 * Configuration options for intent agents
 */
export interface AgentConfig {
  /**
   * The name of the agent
   */
  name: string;
  
  /**
   * The archetype that defines the agent's behavior patterns
   */
  archetype: string;
  
  /**
   * The degree to which the agent acts with clear intention (0-1)
   */
  intentionality: number;
  
  /**
   * The degree of autonomous action available to the agent (0-1)
   */
  autonomy: number;
  
  /**
   * The agent's sensitivity to changes in the intent field (0-1)
   */
  fieldSensitivity: number;
}

/**
 * Response from an agent processing an intent signal
 */
export interface AgentResponse {
  /**
   * Status of the response (e.g., acknowledged, completed, rejected)
   */
  status: string;
  
  /**
   * The action taken by the agent
   */
  action: string;
  
  /**
   * Additional data returned by the agent
   */
  data?: any;
}

// create-intentsim/templates/basic/src/types/field.ts
/**
 * Metrics describing the coherence of an intent field
 */
export interface FieldCoherenceMetrics {
  /**
   * The overall integrity of the field structure (0-1)
   */
  integrity: number;
  
  /**
   * The resonance between field components (0-1)
   */
  resonance: number;
  
  /**
   * The stability of the field over time (0-1)
   */
  stability: number;
}

/**
 * An intent signal that can be processed by agents
 */
export interface IntentSignal {
  /**
   * The type of signal (e.g., command, query, notification)
   */
  type: string;
  
  /**
   * The content of the signal
   */
  content: string;
  
  /**
   * The strength of the signal (0-1)
   */
  strength: number;
  
  /**
   * The source of the signal
   */
  source: string;
}

// create-intentsim/templates/secure/src/security/LicenseManager.ts
import * as crypto from 'crypto';
import * as dotenv from 'dotenv';

// Ensure environment variables are loaded
dotenv.config();

/**
 * LicenseManager - Advanced license validation for IntentSim[on] Framework
 * 
 * Provides robust, tamper-resistant license verification for both
 * runtime and development environments. Includes entropy-based
 * key obfuscation and secure hashing.
 */
export class LicenseManager {
  private readonly hashAlgorithm: string = 'sha256';
  private readonly entropySalt: string = 'intentSim-sovereignty-salt-8a72b';
  private valid: boolean = false;
  private initialized: boolean = false;
  
  // License state parameters
  private licenseKey?: string;
  private licenseHash?: string;
  private licenseProperties: Record<string, any> = {};
  
  // Security callbacks
  private onLicenseFailure?: () => void;
  
  constructor(options: {
    killSwitch?: () => void;
    autoVerify?: boolean;
  } = {}) {
    if (options.killSwitch) {
      this.onLicenseFailure = options.killSwitch;
    }
    
    if (options.autoVerify !== false) {
      this.initializeLicense();
    }
  }
  
  /**
   * Initialize license validation from environment or embedded value
   */
  public initializeLicense(): boolean {
    if (this.initialized) return this.valid;
    
    // Get license key from environment
    this.licenseKey = process.env.INTENT_LICENSE_KEY;
    this.licenseHash = process.env.INTENT_LICENSE_HASH;
    
    // If we have both key and hash, verify the license
    if (this.licenseKey && this.licenseHash) {
      this.valid = this.verifyLicense(this.licenseKey, this.licenseHash);
    } else {
      this.valid = false;
    }
    
    this.initialized = true;
    
    // If invalid and we have a failure callback, trigger it
    if (!this.valid && this.onLicenseFailure) {
      this.onLicenseFailure();
    }
    
    return this.valid;
  }
  
  /**
   * Verify a license key against a provided hash
   */
  public verifyLicense(licenseKey: string, expectedHash: string): boolean {
    const generatedHash = this.generateLicenseHash(licenseKey);
    return this.compareHashes(generatedHash, expectedHash);
  }
  
  /**
   * Generate a secure hash for a license key
   */
  public generateLicenseHash(licenseKey: string): string {
    // Add entropy via a combination of techniques
    const entropyKey = `${this.entropySalt}-${licenseKey}-${this.entropySalt.split('').reverse().join('')}`;
    
    // Create hash using configured algorithm
    const hash = crypto.createHash(this.hashAlgorithm);
    hash.update(entropyKey);
    return hash.digest('hex');
  }
  
  /**
   * Compare hashes in a timing-attack resistant manner
   */
  private compareHashes(hash1: string, hash2: string): boolean {
    if (hash1.length !== hash2.length) {
      return false;
    }
    
    try {
      return crypto.timingSafeEqual(
        Buffer.from(hash1, 'hex'),
        Buffer.from(hash2, 'hex')
      );
    } catch (error) {
      return false;
    }
  }
  
  /**
   * Check if the license is valid
   */
  public isLicenseValid(): boolean {
    if (!this.initialized) {
      this.initializeLicense();
    }
    return this.valid;
  }
  
  /**
   * Generate a new license key for development
   */
  public static generateDevelopmentLicense(): { key: string, hash: string } {
    const licenseKey = `dev-${Date.now()}-${crypto.randomBytes(8).toString('hex')}`;
    const manager = new LicenseManager({ autoVerify: false });
    const licenseHash = manager.generateLicenseHash(licenseKey);
    
    return { key: licenseKey, hash: licenseHash };
  }
}

// create-intentsim/templates/secure/.env.example
# IntentSim[on] Framework License
INTENT_LICENSE_KEY=your-license-key-here
INTENT_LICENSE_HASH=generated-hash-for-verification

# Security Settings
INTENT_SECURITY_LEVEL=high

// create-intentsim/templates/advanced/src/expression/PersonaLayer.ts
import { IntentField } from '@intentsimon/core';
import { PersonaConfig } from '../types/persona';

/**
 * PersonaLayer - Expression layer for intent agents
 * 
 * Manages the external expression characteristics of an agent,
 * allowing for consistent personality traits and communication style.
 */
export class PersonaLayer {
  private field: IntentField;
  private config: PersonaConfig;
  
  // Persona characteristics
  public readonly archetype: string;
  public expressionLevel: number;
  
  constructor(config: PersonaConfig) {
    this.field = config.field;
    this.config = config;
    this.archetype = config.archetype || 'neutral';
    this.expressionLevel = config.expressionLevel || 0.5;
    
    // Listen for field changes
    this.field.on('fieldChanged', () => this.updateFromField());
  }
  
  /**
   * Generate a response based on the current persona state
   */
  public generateResponse(input: string): string {
    // Persona-specific response generation logic would go here
    // This is just a simple example
    const archetypePatterns = this.getArchetypePatterns();
    
    let response = `I processed your input: "${input}"`;
    
    // Add archetype-specific language pattern
    if (archetypePatterns.length > 0) {
      const randomPattern = archetypePatterns[Math.floor(Math.random() * archetypePatterns.length)];
      response += `\n\n${randomPattern}`;
    }
    
    return response;
  }
  
  /**
   * Update persona state based on field changes
   */
  public updateFromField(): void {
    const coherence = this.field.measureCoherence();
    
    // Adjust expression level based on field resonance
    this.expressionLevel = Math.min(1, Math.max(0, 
      this.expressionLevel * 0.8 + coherence.resonance * 0.2
    ));
  }
  
  /**
   * Get language patterns based on the archetype
   */
  private getArchetypePatterns(): string[] {
    switch (this.archetype.toLowerCase()) {
      case 'researcher':
        return [
          'Based on my analysis, I can conclude that...',
          'The evidence suggests that...',
          'I've examined this question from multiple perspectives...'
        ];
      case 'guardian':
        return [
          'I've ensured that all security protocols are in place.',
          'Let me verify that before proceeding.',
          'I'm monitoring for any potential issues.'
        ];
      case 'explorer':
        return [
          'Let's discover something new here!',
          'I'm excited to venture into this territory with you.',
          'This opens up interesting possibilities to explore.'
        ];
      case 'creator':
        return [
          'I've crafted a unique approach for this.',
          'This allows us to build something truly innovative.',
          'Let me design a creative solution for that.'
        ];
      case 'guide':
        return [
          'I'll help you navigate through this process.',
          'Let me show you the most effective path forward.',
          'I'm here to assist you every step of the way.'
        ];
      default:
        return [];
    }
  }
}

// create-intentsim/templates/research/src/analytics/FieldAnalyzer.ts
import { IntentField } from '@intentsimon/core';
import { FieldCoherenceMetrics } from '../types/field';

/**
 * FieldAnalyzer - Research tool for analyzing intent fields
 * 
 * Provides advanced analytical capabilities for studying intent field
 * dynamics, coherence patterns, and agent interactions.
 */
export class FieldAnalyzer {
  private field: IntentField;
  private historyLength: number;
  private coherenceHistory: FieldCoherenceMetrics[] = [];
  
  constructor(field: IntentField, options: { historyLength?: number } = {}) {
    this.field = field;
    this.historyLength = options.historyLength || 100;
    
    // Start tracking field coherence
    this.trackFieldCoherence();
  }
  
  /**
   * Begin tracking field coherence over time
   */
  private trackFieldCoherence(): void {
    // Initial measurement
    this.recordCoherenceSnapshot();
    
    // Subscribe to field changes
    this.field.on('fieldChanged', () => this.recordCoherenceSnapshot());
  }
  
  /**
   * Record the current coherence state of the field
   */
  private recordCoherenceSnapshot(): void {
    const metrics = this.field.measureCoherence();
    
    // Add to history
    this.coherenceHistory.push(metrics);
    
    // Limit history length
    if (this.coherenceHistory.length > this.historyLength) {
      this.coherenceHistory.shift();
    }
  }
  
  /**
   * Get the complete coherence history
   */
  public getCoherenceHistory(): FieldCoherenceMetrics[] {
    return [...this.coherenceHistory];
  }
  
  /**
   * Calculate average coherence metrics over a time period
   */
  public getAverageCoherence(lastN?: number): FieldCoherenceMetrics {
    const samples = lastN ? 
      this.coherenceHistory.slice(-Math.min(lastN, this.coherenceHistory.length)) : 
      this.coherenceHistory;
    
    if (samples.length === 0) {
      return { integrity: 0, resonance: 0, stability: 0 };
    }
    
    const totals = samples.reduce((acc, metrics) => ({
      integrity: acc.integrity + metrics.integrity,
      resonance: acc.resonance + metrics.resonance,
      stability: acc.stability + metrics.stability
    }), { integrity: 0, resonance: 0, stability: 0 });
    
    return {
      integrity: totals.integrity / samples.length,
      resonance: totals.resonance / samples.length,
      stability: totals.stability / samples.length
    };
  }
  
  /**
   * Get coherence variation (standard deviation)
   */
  public getCoherenceVariation(): FieldCoherenceMetrics {
    const avg = this.getAverageCoherence();
    
    if (this.coherenceHistory.length <= 1) {
      return { integrity: 0, resonance: 0, stability: 0 };
    }
    
    const squaredDiffs = this.coherenceHistory.reduce((acc, metrics) => ({
      integrity: acc.integrity + Math.pow(metrics.integrity - avg.integrity, 2),
      resonance: acc.resonance + Math.pow(metrics.resonance - avg.resonance, 2),
      stability: acc.stability + Math.pow(metrics.stability - avg.stability, 2)
    }), { integrity: 0, resonance: 0, stability: 0 });
    
    return {
      integrity: Math.sqrt(squaredDiffs.integrity / this.coherenceHistory.length),
      resonance: Math.sqrt(squaredDiffs.resonance / this.coherenceHistory.length),
      stability: Math.sqrt(squaredDiffs.stability / this.coherenceHistory.length)
    };
  }
  
  /**
   * Generate a research report with key findings
   */
  public generateReport(): string {
    const avg = this.getAverageCoherence();
    const variation = this.getCoherenceVariation();
    const current = this.coherenceHistory[this.coherenceHistory.length - 1] || { 
      integrity: 0, resonance: 0, stability: 0 
    };
    
    return `
# Intent Field Analysis Report

## Coherence Metrics

| Metric    | Current | Average | Variation |
|-----------|---------|---------|-----------|
| Integrity | ${current.integrity.toFixed(3)} | ${avg.integrity.toFixed(3)} | ${variation.integrity.toFixed(3)} |
| Resonance | ${current.resonance.toFixed(3)} | ${avg.resonance.toFixed(3)} | ${variation.resonance.toFixed(3)} |
| Stability | ${current.stability.toFixed(3)} | ${avg.stability.toFixed(3)} | ${variation.stability.toFixed(3)} |

## Observations

${this.generateObservations()}

## Research Implications

The field shows ${avg.stability > 0.7 ? 'strong' : 'moderate'} structural sovereignty characteristics.
${variation.resonance > 0.2 ? 'Significant resonance fluctuations indicate dynamic field behavior.' : 'Stable resonance patterns suggest consistent field coherence.'}
`.trim();
  }
  
  /**
   * Generate observations based on field analysis
   */
  private generateObservations(): string {
    const observations = [];
    const avg = this.getAverageCoherence();
    const recent = this.getAverageCoherence(5);
    
    // Check for trends
    if (recent.integrity > avg.integrity * 1.1) {
      observations.push('- Field integrity is strengthening in recent measurements.');
    } else if (recent.integrity < avg.integrity * 0.9) {
      observations.push('- Field integrity is declining in recent measurements.');
    }
    
    if (recent.resonance > avg.resonance * 1.1) {
      observations.push('- Resonance is increasing, suggesting improved field coherence.');
    } else if (recent.resonance < avg.resonance * 0.9) {
      observations.push('- Resonance is decreasing, suggesting potential field dissonance.');
    }
    
    // Add more observations based on stability
    if (recent.stability < 0.5) {
      observations.push('- Low stability detected. Field may require stabilization measures.');
    } else if (recent.stability > 0.8) {
      observations.push('- High stability maintained. Field demonstrates strong structural integrity.');
    }
    
    return observations.join('\n');
  }
}

// create-intentsim/README.md
# create-intentsim

A CLI tool for creating new IntentSim[on] Framework projects.

## Usage

```bash
npx create-intentsim
```

This will guide you through creating a new IntentSim[on] Framework project with interactive prompts.

## Features

- Multiple project templates (basic, advanced, research, secure)
- Customizable agent archetypes
- Automated project setup with best practices
- Built-in security features
- TypeScript configuration

## Templates

- **Basic**: Minimal setup with core components
- **Advanced**: Full featured with all modules
- **Research**: Focus on field research capabilities
- **Secure**: Enhanced security and licensing

## License

MIT © TheVoidIntent
