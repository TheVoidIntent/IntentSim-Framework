import { describe, it, expect } from 'vitest';
import { SecurityCore } from '../../src/security/securitycore';

describe('SecurityCore', () => {
  it('throws on invalid license key if in strict mode', () => {
    const security = new SecurityCore({
      licenseKey: 'VALID_KEY',
      enforcementLevel: 'strict'
    });

    expect(() => {
      security.validateEquationUsage('BAD_KEY');
    }).toThrowError(/Unauthorized use/);
  });

  it('passes with correct license key', () => {
    const security = new SecurityCore({ licenseKey: '1234' });
    expect(security.validateEquationUsage('1234')).toBe(true);
  });
});
