import { expect } from 'vitest';

expect.extend({
  toBeResonant(received, threshold = 0.7) {
    const pass = received.coherence > threshold && received.dissonance < 1 - threshold;
    return {
      pass,
      message: () =>
        pass
          ? `Expected NOT to be resonant (coherence > ${threshold})`
          : `Expected resonance: got coherence=${received.coherence}, dissonance=${received.dissonance}`,
    };
  },
});
