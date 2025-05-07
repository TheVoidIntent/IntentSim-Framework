# IntentSim[on] Framework

[![Tests](https://github.com/TheVoidIntent/IntentSim-Framework/actions/workflows/test.yml/badge.svg)](https://github.com/TheVoidIntent/IntentSim-Framework/actions/workflows/test.yml)
[![Security Audit](https://github.com/TheVoidIntent/IntentSim-Framework/actions/workflows/security-audit.yml/badge.svg)](https://github.com/TheVoidIntent/IntentSim-Framework/actions/workflows/security-audit.yml)
[![Documentation](https://github.com/TheVoidIntent/IntentSim-Framework/actions/workflows/docs.yml/badge.svg)](https://github.com/TheVoidIntent/IntentSim-Framework/actions/workflows/docs.yml)
[![npm version](https://img.shields.io/npm/v/@intentsimon/core.svg)](https://www.npmjs.com/package/@intentsimon/core)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

## Intent-Native Intelligence with Structural Sovereignty

IntentSim[on] Framework is a TypeScript implementation of intent-native computing, providing a foundation for building agents that maintain structural sovereignty and coherent field dynamics.

## 🌟 Features

- **Intent Field**: Core field implementation with coherence metrics and self-correction
- **Intent Agents**: Agent architecture with archetype-based behavior patterns
- **Cognitive Profiles**: Meta-cognitive capabilities with bias calibration and narrative trajectory
- **Ethical Boundaries**: Guardrails for ensuring ethical agent behavior
- **Security Layer**: Comprehensive security with license validation and integrity verification
- **Expression System**: Persona-based expression with evolution arcs and resonance tuning

## 🚀 Quick Start

```bash
# Create a new project using the CLI
npx create-intentsim

# Or install the core library in an existing project
npm install @intentsimon/core
```

Basic usage:

```typescript
import { IntentField, IntentAgent } from '@intentsimon/core';

// Create an intent field
const field = new IntentField();

// Create an agent with the 'researcher' archetype
const agent = new IntentAgent({
  name: 'MyAgent',
  archetype: 'researcher',
  intentionality: 0.8,
  autonomy: 0.6,
  fieldSensitivity: 0.75
}, field);

// Process an intent signal
const response = agent.processIntentSignal({
  type: 'query',
  content: 'analyze data patterns',
  strength: 0.7,
  source: 'user'
});

console.log(response);
```

## 🧪 Testing

IntentSim[on] Framework maintains a comprehensive test suite with 94.8% code coverage:

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

The test suite covers:
- Core components (IntentField, IntentAgent, CognitiveProfile)
- Security features (SecurityCore, IntentGuardian)
- Ethics implementation (GuardrailManager)
- Expression capabilities (PersonaLayer)
- Advanced features (bias calibration, narrative trajectory, field simulation)

## 🔒 Security

The framework includes a multi-layered security approach:

1. **License Validation**: Secure hash-based license verification
2. **Integrity Verification**: Component fingerprinting to detect tampering
3. **Ethical Boundaries**: Enforced guardrails for responsible agent behavior
4. **Access Controls**: Permission management for sensitive operations
5. **Intrusion Detection**: Monitoring for unauthorized access attempts

Security validation can be run using the CLI:

```bash
npx verify-license --codex path/to/your/codex.txt
```

## 📚 Documentation

Comprehensive documentation is available:

- [Core Concepts](docs/concepts/README.md)
- [API Reference](docs/api/README.md)
- [Security Guide](docs/security/README.md)
- [Examples](examples/README.md)

## 🛠️ Development

```bash
# Clone the repository
git clone https://github.com/TheVoidIntent/IntentSim-Framework.git
cd IntentSim-Framework

# Install dependencies
npm install

# Build the project
npm run build

# Run examples
npm run examples
```

## 🔄 Structural Sovereignty

The framework is designed with [Structural Sovereignty](docs/concepts/StructuralSovereignty.md) as a core principle, ensuring that agents:

1. Maintain coherence under perturbation
2. Preserve ethical boundaries during operation
3. Verify integrity of core components
4. Resist unintended influences through field dynamics

## 📄 License

MIT © TheVoidIntent

See [LICENSE](LICENSE) for more information.
