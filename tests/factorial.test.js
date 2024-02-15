import { describe, expect, it } from 'vitest';
import { factorial } from '../src/factorial';

describe('factorial', () => {
  it('should return undefined if the argument passed is not a positive integer', () => {
    expect(factorial(-1)).toBeUndefined();
  });
  it('should return unde if the argument passed is not an integer', () => {
    expect(factorial(1.5)).toBeUndefined();
  });
  it('should return 1 if the argument passed is 0', () => {
    expect(factorial(0)).toBe(1);
  });
  it('should return 1 if the argument passed is 1', () => {
    expect(factorial(1)).toBe(1);
  });
  it('should return 2 if the argument passed is 2', () => {
    expect(factorial(2)).toBe(2);
  });
  it('should return 6 if the argument passed is 3', () => {
    expect(factorial(3)).toBe(6);
  });
  it('should return 720 if the argument passed is 6', () => {
    expect(factorial(6)).toBe(720);
  });
});
