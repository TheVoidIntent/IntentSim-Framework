// src/cli/verify-license.ts
#!/usr/bin/env node

import * as crypto from 'crypto';
import * as fs from 'fs';
import * as path from 'path';
import * as readline from 'readline';
import * as dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

/**
 * IntentSim[on] Framework License Verification Tool
 * 
 * This CLI tool verifies license keys for the IntentSim[on] Framework
 * using secure hashing algorithms and entropy-based verification.
 * 
 * Usage:
 *   npx verify-license
 *   npx verify-license --key YOUR_LICENSE_KEY
 *   npx verify-license --hash YOUR_LICENSE_HASH
 */

// Configurable settings
const HASH_ALGORITHM = 'sha256';
const ENTROPY_SALT = 'intentSim-sovereignty-salt-8a72b';

interface VerificationOptions {
  key?: string;
  hash?: string;
  silent?: boolean;
  killOnFailure?: boolean;
}

/**
 * Generates a secure hash of a license key with additional entropy
 */
function generateSecureHash(licenseKey: string): string {
  // Add entropy via a combination of techniques
  const entropyKey = `${ENTROPY_SALT}-${licenseKey}-${ENTROPY_SALT.split('').reverse().join('')}`;
  
  // Create hash using configured algorithm
  const hash = crypto.createHash(HASH_ALGORITHM);
  hash.update(entropyKey);
  return hash.digest('hex');
}

/**
 * Verifies a license key against a provided hash or stored hash
 */
async function verifyLicense(options: VerificationOptions = {}): Promise<boolean> {
  let licenseKey = options.key;
  let providedHash = options.hash;
  
  // If no license key provided, check environment variable
  if (!licenseKey) {
    licenseKey = process.env.INTENT_LICENSE_KEY;
  }
  
  // If still no license key, prompt user (unless silent mode)
  if (!licenseKey && !options.silent) {
    licenseKey = await promptForLicenseKey();
  }
  
  if (!licenseKey) {
    if (!options.silent) {
      console.error('❌ No license key provided.');
    }
    if (options.killOnFailure) {
      process.exit(1);
    }
    return false;
  }
  
  // Get the hash to verify against
  if (!providedHash) {
    providedHash = process.env.INTENT_LICENSE_HASH;
  }
  
  // If no hash available, show the hash for the key
  if (!providedHash) {
    const generatedHash = generateSecureHash(licenseKey);
    if (!options.silent) {
      console.log(`Generated hash for license key: ${generatedHash}`);
      console.log('Add this to your .env file as INTENT_LICENSE_HASH=YOUR_HASH');
    }
    return true; // Return true but without verification
  }
  
  // Verify the license
  const generatedHash = generateSecureHash(licenseKey);
  const isValid = compareHashes(generatedHash, providedHash);
  
  if (!options.silent) {
    if (isValid) {
      console.log('✅ License verified successfully.');
    } else {
      console.error('❌ License verification failed.');
    }
  }
  
  if (!isValid && options.killOnFailure) {
    process.exit(1);
  }
  
  return isValid;
}

/**
 * Securely compares two hashes in a timing-attack resistant manner
 */
function compareHashes(hash1: string, hash2: string): boolean {
  // Prevent timing attacks by using constant-time comparison
  if (hash1.length !== hash2.length) {
    return false;
  }
  
  return crypto.timingSafeEqual(
    Buffer.from(hash1, 'hex'),
    Buffer.from(hash2, 'hex')
  );
}

/**
 * Prompts the user to enter a license key
 */
async function promptForLicenseKey(): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  
  return new Promise((resolve) => {
    rl.question('Enter your IntentSim[on] license key: ', (answer) => {
      rl.close();
      resolve(answer.trim());
    });
  });
}

/**
 * Main CLI function
 */
async function main() {
  const args = process.argv.slice(2);
  const options: VerificationOptions = {};
  
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--key' && i + 1 < args.length) {
      options.key = args[i + 1];
      i++;
    } else if (args[i] === '--hash' && i + 1 < args.length) {
      options.hash = args[i + 1];
      i++;
    } else if (args[i] === '--silent') {
      options.silent = true;
    } else if (args[i] === '--kill-on-failure') {
      options.killOnFailure = true;
    } else if (args[i] === '--help') {
      console.log(`
IntentSim[on] License Verification Tool

Options:
  --key VALUE         Specify license key directly
  --hash VALUE        Specify license hash to verify against
  --silent            Suppress all output
  --kill-on-failure   Exit with error code 1 if verification fails
  --help              Show this help message

Environment variables:
  INTENT_LICENSE_KEY  License key (alternative to --key)
  INTENT_LICENSE_HASH Hash to verify against (alternative to --hash)
      `);
      process.exit(0);
    }
  }
  
  await verifyLicense(options);
}

// Run main function if called directly
if (require.main === module) {
  main().catch(err => {
    console.error('Error:', err);
    process.exit(1);
  });
}

// Export functions for programmatic use
export { verifyLicense, generateSecureHash };

// src/security/LicenseManager.ts
import * as fs from 'fs';
import * as path from 'path';
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
 * 
 * @class
 * @category Security
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
    
    return crypto.timingSafeEqual(
      Buffer.from(hash1, 'hex'),
      Buffer.from(hash2, 'hex')
    );
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
   * Parse properties from a license key (if encoded)
   */
  public getLicenseProperties(): Record<string, any> {
    return this.licenseProperties;
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

// src/security/IntegrityVerifier.ts
import * as crypto from 'crypto';
import * as fs from 'fs';
import * as path from 'path';

/**
 * IntegrityVerifier - Validates the integrity of framework components
 * 
 * This component provides functionality to verify that core framework
 * files have not been tampered with, by comparing cryptographic 
 * fingerprints of the files.
 * 
 * @class
 * @category Security
 */
export class IntegrityVerifier {
  private readonly hashAlgorithm: string = 'sha256';
  private readonly fingerprintMap: Map<string, string> = new Map();
  private readonly criticalComponents: string[] = [
    'src/core/IntentField.ts',
    'src/core/CognitiveProfile.ts',
    'src/security/SecurityCore.ts',
    'src/security/IntentGuardian.ts'
  ];
  
  constructor(options: {
    customComponents?: string[];
    onIntegrityFailure?: (component: string) => void;
  } = {}) {
    if (options.customComponents) {
      this.criticalComponents.push(...options.customComponents);
    }
  }
  
  /**
   * Generate fingerprints for all critical components
   */
  public generateFingerprints(baseDir: string = process.cwd()): Map<string, string> {
    for (const component of this.criticalComponents) {
      try {
        const fullPath = path.join(baseDir, component);
        if (fs.existsSync(fullPath)) {
          const content = fs.readFileSync(fullPath, 'utf8');
          const fingerprint = this.generateFingerprint(content);
          this.fingerprintMap.set(component, fingerprint);
        }
      } catch (error) {
        console.error(`Failed to generate fingerprint for ${component}:`, error);
      }
    }
    
    return this.fingerprintMap;
  }
  
  /**
   * Generate a fingerprint for a single string or content
   */
  public generateFingerprint(content: string): string {
    const hash = crypto.createHash(this.hashAlgorithm);
    hash.update(content);
    return hash.digest('hex');
  }
  
  /**
   * Verify the integrity of a specific component against its fingerprint
   */
  public verifyComponent(component: string, fingerprint?: string, baseDir: string = process.cwd()): boolean {
    try {
      const fullPath = path.join(baseDir, component);
      if (!fs.existsSync(fullPath)) {
        return false;
      }
      
      const content = fs.readFileSync(fullPath, 'utf8');
      const currentFingerprint = this.generateFingerprint(content);
      
      // If no fingerprint provided, use stored one
      const expectedFingerprint = fingerprint || this.fingerprintMap.get(component);
      
      if (!expectedFingerprint) {
        return false;
      }
      
      return currentFingerprint === expectedFingerprint;
    } catch (error) {
      console.error(`Failed to verify component ${component}:`, error);
      return false;
    }
  }
  
  /**
   * Verify all critical components at once
   */
  public verifyAllComponents(baseDir: string = process.cwd()): {
    valid: boolean;
    results: Record<string, boolean>;
  } {
    const results: Record<string, boolean> = {};
    let allValid = true;
    
    // Make sure we have fingerprints
    if (this.fingerprintMap.size === 0) {
      this.generateFingerprints(baseDir);
    }
    
    for (const [component, fingerprint] of this.fingerprintMap.entries()) {
      const isValid = this.verifyComponent(component, fingerprint, baseDir);
      results[component] = isValid;
      
      if (!isValid) {
        allValid = false;
      }
    }
    
    return {
      valid: allValid,
      results
    };
  }
  
  /**
   * Save fingerprints to a verification file
   */
  public saveFingerprints(outputPath: string = 'integrity.json'): void {
    const data = Object.fromEntries(this.fingerprintMap.entries());
    fs.writeFileSync(outputPath, JSON.stringify(data, null, 2), 'utf8');
  }
  
  /**
   * Load fingerprints from a verification file
   */
  public loadFingerprints(inputPath: string = 'integrity.json'): boolean {
    try {
      if (!fs.existsSync(inputPath)) {
        return false;
      }
      
      const content = fs.readFileSync(inputPath, 'utf8');
      const data = JSON.parse(content);
      
      this.fingerprintMap.clear();
      for (const [component, fingerprint] of Object.entries(data)) {
        this.fingerprintMap.set(component, fingerprint as string);
      }
      
      return true;
    } catch (error) {
      console.error('Failed to load fingerprints:', error);
      return false;
    }
  }
}

// package.json additions for license CLI
/*
"bin": {
  "verify-license": "./dist/cli/verify-license.js"
},
"dependencies": {
  "dotenv": "^16.3.1"
}
*/

// .env.example
/*
# IntentSim[on] Framework License
INTENT_LICENSE_KEY=your-license-key-here
INTENT_LICENSE_HASH=generated-hash-for-verification

# Security Settings
INTENT_SECURITY_LEVEL=high
*/
