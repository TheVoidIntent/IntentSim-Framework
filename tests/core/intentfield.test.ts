import { describe, it, expect } from 'vitest';
import { IntentField } from '../../src/core/intentfield';

describe('IntentField', () => {
  it('initializes with symbolic signature tracking', () => {
    const field = new IntentField();
    expect(field.symbolicStateSignature).toBeInstanceOf(Map);
  });

  it('activates oscillatory buffer at high dissonance', () => {
    const field = new IntentField();
    const activated = field.activateOscillatoryBuffer(0.8);
    expect(activated).toBe(true);
    expect(field.oscillatoryBuffer.active).toBe(true);
  });

  it('generates valid field snapshot', () => {
    const field = new IntentField();
    const snapshot = field.fieldSnapshot();
    expect(snapshot).toHaveProperty('coherence');
    expect(snapshot).toHaveProperty('symbolicSignature');
  });
});
