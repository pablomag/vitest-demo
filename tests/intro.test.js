import { describe, expect, it } from 'vitest';
import { calculateAverage, fizzBuzz, max } from '../src/intro';

describe('max', () => {
  it('should return the first argument if it is greater', () => {
    expect(max(2, 1)).toBe(2);
  });
  it('should return the second argument if it is greater', () => {
    expect(max(1, 2)).toBe(2);
  });
  it('should return the first argument if arguments are equal', () => {
    expect(max(1, 1)).toBe(1);
  });
});

describe('fizzBuzz', () => {
  it('should return FizzBuzz if the argument passed is divisible by both 3 and 5', () => {
    expect(fizzBuzz(15)).toBe('FizzBuzz');
  });
  it('should return Fizz if the argument passed is only divisible by 3', () => {
    expect(fizzBuzz(9)).toBe('Fizz');
  });
  it('should return Buzz if the argument passed is only divisible by 5', () => {
    expect(fizzBuzz(20)).toBe('Buzz');
  });
  it('should return the argument passed if it is not divisible by neither 3 or 5', () => {
    expect(fizzBuzz(17)).toBe('17');
  });

  describe('calculateAverage', () => {
    it('should return NaN if given an empty array', () => {
      expect(calculateAverage([])).toBe(NaN);
    });
    it('should return the only number passed in a single element array', () => {
      expect(calculateAverage([1])).toBe(1);
    });
    it('should return the average value in a multi element array', () => {
      expect(calculateAverage([5, 3])).toBe(4);
    });
  });
});
