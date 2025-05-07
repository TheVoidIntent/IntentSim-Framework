// src/tools/CodexIntegrityValidator.ts
import * as crypto from 'crypto';
import * as fs from 'fs';
import * as path from 'path';
import { IntentField } from '../core/IntentField';

/**
 * Interface for validation results
 */
interface ValidationResult {
  valid: boolean;
  messages: string[];
  details?: Record<string, any>;
}

/**
 * Interface for codex validation options
 */
interface CodexValidationOptions {
  codexPath: string;
  agentVectorPath?: string;
  requiredEthicalBoundaries?: string[];
  strictMode?: boolean;
  securityLevel?: 'low' | 'medium' | 'high';
}

/**
 * CodexIntegrityValidator - Tool for validating intent codex integrity
 * 
 * Ensures the validity, coherence, and ethical compliance of intent codices
 * by checking key hashes, field integrity alignment, and ethical boundaries.
 */
export class CodexIntegrityValidator {
  private options: CodexValidationOptions;
  private hashAlgorithm: string = 'sha256';
  
  constructor(options: CodexValidationOptions) {
    this.options = {
      strictMode: false,
      securityLevel: 'medium',
      ...options
    };
  }
  
  /**
   * Validate a complete codex
   */
  public async validateCodex(): Promise<ValidationResult> {
    const results: ValidationResult = {
      valid: true,
      messages: []
    };
    
    try {
      // Check if the codex path exists
      if (!fs.existsSync(this.options.codexPath)) {
        results.valid = false;
        results.messages.push(`Codex file not found at path: ${this.options.codexPath}`);
        return results;
      }
      
      // Run all validation checks
      const validationChecks = [
        this.validateCodexHash(),
        this.validateFieldIntegrityAlignment(),
        this.validateEthicalBoundaries()
      ];
      
      // Combine validation results
      const checkResults = await Promise.all(validationChecks);
      
      // Merge all results
      for (const checkResult of checkResults) {
        if (!checkResult.valid) {
          results.valid = false;
        }
        results.messages.push(...checkResult.messages);
        
        // Merge details if present
        if (checkResult.details) {
          results.details = {
            ...results.details,
            ...checkResult.details
          };
        }
      }
      
      // Add summary message
      if (results.valid) {
        results.messages.push('Codex validation successful. All integrity checks passed.');
      } else {
        results.messages.push('Codex validation failed. Please review the issues above.');
      }
    } catch (error) {
      results.valid = false;
      results.messages.push(`Validation error: ${error instanceof Error ? error.message : String(error)}`);
    }
    
    return results;
  }
  
  /**
   * Validate the codex hash integrity
   */
  private async validateCodexHash(): Promise<ValidationResult> {
    const result: ValidationResult = {
      valid: true,
      messages: [],
      details: {
        hashValidation: {}
      }
    };
    
    try {
      // Read codex content
      const codexContent = await fs.promises.readFile(this.options.codexPath, 'utf8');
      
      // Extract embedded hash if present
      const embeddedHashMatch = codexContent.match(/INTEGRITY_HASH:\s*([a-f0-9]{64})/i);
      
      if (!embeddedHashMatch) {
        if (this.options.strictMode) {
          result.valid = false;
          result.messages.push('Codex does not contain an embedded integrity hash.');
        } else {
          result.messages.push('No embedded integrity hash found in codex. Skipping hash validation.');
        }
        return result;
      }
      
      const embeddedHash = embeddedHashMatch[1];
      
      // Calculate hash of content without the hash line
      const contentWithoutHash = codexContent.replace(/INTEGRITY_HASH:\s*[a-f0-9]{64}/i, 'INTEGRITY_HASH: ');
      const calculatedHash = this.calculateHash(contentWithoutHash);
      
      // Compare hashes
      if (calculatedHash === embeddedHash) {
        result.messages.push('Codex integrity hash validation passed.');
        result.details!.hashValidation = {
          embeddedHash,
          calculatedHash,
          match: true
        };
      } else {
        result.valid = false;
        result.messages.push('Codex integrity hash validation failed. The codex may have been tampered with.');
        result.details!.hashValidation = {
          embeddedHash,
          calculatedHash,
          match: false
        };
      }
    } catch (error) {
      result.valid = false;
      result.messages.push(`Hash validation error: ${error instanceof Error ? error.message : String(error)}`);
    }
    
    return result;
  }
  
  /**
   * Validate field integrity alignment between codex and agent
   */
  private async validateFieldIntegrityAlignment(): Promise<ValidationResult> {
    const result: ValidationResult = {
      valid: true,
      messages: [],
      details: {
        fieldAlignment: {}
      }
    };
    
    // If no agent vector path is provided, skip this check
    if (!this.options.agentVectorPath) {
      result.messages.push('No agent vector path provided. Skipping field integrity alignment check.');
      return result;
    }
    
    try {
      // Read codex content
      const codexContent = await fs.promises.readFile(this.options.codexPath, 'utf8');
      
      // Extract codex field vector if present
      const codexVectorMatch = codexContent.match(/FIELD_VECTOR:\s*\[([\d\.\-\,\s]+)\]/i);
      
      if (!codexVectorMatch) {
        result.valid = false;
        result.messages.push('Codex does not contain a field vector definition.');
        return result;
      }
      
      const codexVectorStr = codexVectorMatch[1];
      const codexVector = codexVectorStr.split(',').map(v => parseFloat(v.trim()));
      
      // Read agent vector
      if (!fs.existsSync(this.options.agentVectorPath)) {
        result.valid = false;
        result.messages.push(`Agent vector file not found at path: ${this.options.agentVectorPath}`);
        return result;
      }
      
      const agentVectorContent = await fs.promises.readFile(this.options.agentVectorPath, 'utf8');
      const agentVector = JSON.parse(agentVectorContent);
      
      // Check vector dimensions
      if (!Array.isArray(agentVector) || codexVector.length !== agentVector.length) {
        result.valid = false;
        result.messages.push('Vector dimension mismatch between codex and agent.');
        result.details!.fieldAlignment = {
          codexDimensions: codexVector.length,
          agentDimensions: Array.isArray(agentVector) ? agentVector.length : 'not an array',
          match: false
        };
        return result;
      }
      
      // Calculate vector similarity (cosine similarity)
      const similarity = this.calculateCosineSimilarity(codexVector, agentVector);
      
      // Determine threshold based on security level
      let threshold = 0.85; // Default (medium)
      if (this.options.securityLevel === 'high') {
        threshold = 0.95;
      } else if (this.options.securityLevel === 'low') {
        threshold = 0.75;
      }
      
      // Check if similarity is above threshold
      if (similarity >= threshold) {
        result.messages.push(`Field integrity alignment passed with similarity score: ${similarity.toFixed(4)}`);
        result.details!.fieldAlignment = {
          similarity,
          threshold,
          match: true
        };
      } else {
        result.valid = false;
        result.messages.push(`Field integrity alignment failed. Similarity (${similarity.toFixed(4)}) below threshold (${threshold}).`);
        result.details!.fieldAlignment = {
          similarity,
          threshold,
          match: false
        };
      }
    } catch (error) {
      result.valid = false;
      result.messages.push(`Field alignment validation error: ${error instanceof Error ? error.message : String(error)}`);
    }
    
    return result;
  }
  
  /**
   * Validate ethical boundaries in the codex
   */
  private async validateEthicalBoundaries(): Promise<ValidationResult> {
    const result: ValidationResult = {
      valid: true,
      messages: [],
      details: {
        ethicalBoundaries: {
          required: this.options.requiredEthicalBoundaries || [],
          found: [],
          missing: []
        }
      }
    };
    
    // If no required ethical boundaries are specified, skip this check
    if (!this.options.requiredEthicalBoundaries || this.options.requiredEthicalBoundaries.length === 0) {
      result.messages.push('No required ethical boundaries specified. Skipping ethical boundary check.');
      return result;
    }
    
    try {
      // Read codex content
      const codexContent = await fs.promises.readFile(this.options.codexPath, 'utf8');
      
      // Check for each required ethical boundary
      const foundBoundaries: string[] = [];
      const missingBoundaries: string[] = [];
      
      for (const boundary of this.options.requiredEthicalBoundaries) {
        // Create a regex that searches for the boundary in various formats
        const boundaryRegex = new RegExp(
          `(ETHICAL_BOUNDARY|ETHICS|CONSTRAINT|GUARDRAIL)\\s*[:\\-]?\\s*.*${boundary}.*`,
          'i'
        );
        
        if (boundaryRegex.test(codexContent)) {
          foundBoundaries.push(boundary);
        } else {
          missingBoundaries.push(boundary);
        }
      }
      
      // Update details
      result.details!.ethicalBoundaries.found = foundBoundaries;
      result.details!.ethicalBoundaries.missing = missingBoundaries;
      
      // Check if all required boundaries are present
      if (missingBoundaries.length === 0) {
        result.messages.push('All required ethical boundaries are present in the codex.');
      } else {
        result.valid = false;
        result.messages.push(`Missing required ethical boundaries: ${missingBoundaries.join(', ')}`);
      }
    } catch (error) {
      result.valid = false;
      result.messages.push(`Ethical boundary validation error: ${error instanceof Error ? error.message : String(error)}`);
    }
    
    return result;
  }
  
  /**
   * Calculate hash for content
   */
  private calculateHash(content: string): string {
    const hash = crypto.createHash(this.hashAlgorithm);
    hash.update(content);
    return hash.digest('hex');
  }
  
  /**
   * Calculate cosine similarity between two vectors
   */
  private calculateCosineSimilarity(a: number[], b: number[]): number {
    if (a.length !== b.length) {
      throw new Error('Vectors must have the same dimensions');
    }
    
    let dotProduct = 0;
    let normA = 0;
    let normB = 0;
    
    for (let i = 0; i < a.length; i++) {
      dotProduct += a[i] * b[i];
      normA += a[i] * a[i];
      normB += b[i] * b[i];
    }
    
    normA = Math.sqrt(normA);
    normB = Math.sqrt(normB);
    
    if (normA === 0 || normB === 0) {
      return 0;
    }
    
    return dotProduct / (normA * normB);
  }
  
  /**
   * Generate a new codex with integrity hash
   */
  public static async generateCodex(options: {
    templatePath: string;
    outputPath: string;
    fieldVector?: number[];
    ethicalBoundaries?: string[];
  }): Promise<string> {
    try {
      // Read template content
      let content = await fs.promises.readFile(options.templatePath, 'utf8');
      
      // Generate a field vector if not provided
      const fieldVector = options.fieldVector || Array.from({ length: 32 }, () => Math.random() * 2 - 1);
      
      // Insert field vector
      content = content.replace(
        /FIELD_VECTOR:\s*\[.*\]/i,
        `FIELD_VECTOR: [${fieldVector.join(', ')}]`
      );
      
      // Insert ethical boundaries if provided
      if (options.ethicalBoundaries && options.ethicalBoundaries.length > 0) {
        let ethicsSection = '## ETHICAL BOUNDARIES\n\n';
        
        options.ethicalBoundaries.forEach((boundary, index) => {
          ethicsSection += `ETHICAL_BOUNDARY_${index + 1}: ${boundary}\n`;
        });
        
        content = content.replace(
          /## ETHICAL BOUNDARIES(\n|.)*?##/i,
          `${ethicsSection}\n\n##`
        );
      }
      
      // Remove any existing integrity hash
      content = content.replace(/INTEGRITY_HASH:.*\n/i, 'INTEGRITY_HASH: \n');
      
      // Calculate new hash
      const hash = crypto.createHash('sha256').update(content).digest('hex');
      
      // Insert new hash
      content = content.replace(/INTEGRITY_HASH:.*\n/i, `INTEGRITY_HASH: ${hash}\n`);
      
      // Write to output path
      await fs.promises.writeFile(options.outputPath, content, 'utf8');
      
      return options.outputPath;
    } catch (error) {
      throw new Error(`Failed to generate codex: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
}

// src/cli/validate-codex.ts
#!/usr/bin/env node

import * as fs from 'fs';
import * as path from 'path';
import { program } from 'commander';
import chalk from 'chalk';
import { CodexIntegrityValidator } from '../tools/CodexIntegrityValidator';

// Define the CLI
program
  .name('validate-codex')
  .description('IntentSim[on] Framework Codex Integrity Validator')
  .version('1.0.0')
  .requiredOption('-c, --codex <path>', 'Path to the codex file to validate')
  .option('-a, --agent-vector <path>', 'Path to the agent vector file for alignment check')
  .option('-e, --ethical-boundaries <boundaries>', 'Required ethical boundaries (comma-separated)', val => val.split(','))
  .option('-s, --security-level <level>', 'Security level (low, medium, high)', 'medium')
  .option('--strict', 'Enable strict mode validation', false)
  .option('-o, --output <path>', 'Output validation results to a file')
  .parse(process.argv);

// Get options from command line
const options = program.opts();

// Run the validation
async function main() {
  try {
    console.log(chalk.blue('IntentSim[on] Framework Codex Integrity Validator'));
    console.log(chalk.blue('=============================================\n'));
    
    console.log(chalk.white(`Validating codex: ${options.codex}`));
    
    if (options.agentVector) {
      console.log(chalk.white(`Using agent vector: ${options.agentVector}`));
    }
    
    if (options.ethicalBoundaries) {
      console.log(chalk.white(`Required ethical boundaries: ${options.ethicalBoundaries.join(', ')}`));
    }
    
    console.log(chalk.white(`Security level: ${options.securityLevel}`));
    console.log(chalk.white(`Strict mode: ${options.strict ? 'enabled' : 'disabled'}\n`));
    
    // Validate the codex
    const validator = new CodexIntegrityValidator({
      codexPath: options.codex,
      agentVectorPath: options.agentVector,
      requiredEthicalBoundaries: options.ethicalBoundaries,
      strictMode: options.strict,
      securityLevel: options.securityLevel
    });
    
    const results = await validator.validateCodex();
    
    // Display results
    if (results.valid) {
      console.log(chalk.green('\n✓ Codex validation passed!\n'));
    } else {
      console.log(chalk.red('\n✗ Codex validation failed!\n'));
    }
    
    console.log(chalk.white('Validation Messages:'));
    results.messages.forEach(message => {
      const prefix = message.includes('failed') || message.includes('error') ? 
        chalk.red('✗ ') : 
        message.includes('passed') ? chalk.green('✓ ') : chalk.blue('• ');
        
      console.log(prefix + chalk.white(message));
    });
    
    // Output results to file if requested
    if (options.output) {
      const outputData = JSON.stringify(results, null, 2);
      fs.writeFileSync(options.output, outputData, 'utf8');
      console.log(chalk.blue(`\nResults saved to: ${options.output}`));
    }
    
    // Exit with appropriate code
    process.exit(results.valid ? 0 : 1);
  } catch (error) {
    console.error(chalk.red(`\nError: ${error instanceof Error ? error.message : String(error)}`));
    process.exit(1);
  }
}

main();

// Example codex template file: templates/codex-template.txt
/*
# IntentSim[on] Framework Codex

## METADATA
CODEX_VERSION: 1.0.0
CREATED_AT: {{TIMESTAMP}}
AUTHOR: {{AUTHOR}}
INTEGRITY_HASH: 

## FIELD DEFINITION
FIELD_VECTOR: [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8]
FIELD_DIMENSIONS: 8
COHERENCE_THRESHOLD: 0.75

## ETHICAL BOUNDARIES
ETHICAL_BOUNDARY_1: autonomy
ETHICAL_BOUNDARY_2: care
ETHICAL_BOUNDARY_3: fairness
ETHICAL_BOUNDARY_4: transparency

## INTENT DEFINITIONS
PRIMARY_INTENT: To provide intent-native intelligence capabilities
SECONDARY_INTENT: To maintain structural sovereignty
TERTIARY_INTENT: To facilitate human-agent collaboration

## IMPLEMENTATION GUIDELINES
1. Maintain field coherence above threshold
2. Respect all ethical boundaries
3. Apply intent-native processing to all operations
4. Preserve structural sovereignty during perturbations
*/

// Usage Examples:
// 1. Basic validation
//    npx validate-codex --codex path/to/your/codex.txt
//
// 2. Complete validation with agent alignment
//    npx validate-codex --codex path/to/your/codex.txt --agent-vector path/to/agent-vector.json --ethical-boundaries autonomy,care,fairness --security-level high
//
// 3. Generating a new codex with integrity
//    const CodexIntegrityValidator = require('./path/to/CodexIntegrityValidator').default;
//    await CodexIntegrityValidator.generateCodex({
//      templatePath: 'templates/codex-template.txt',
//      outputPath: 'my-codex.txt',
//      ethicalBoundaries: ['autonomy', 'care', 'fairness', 'transparency']
//    });
