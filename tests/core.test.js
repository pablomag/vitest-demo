import { beforeEach, describe, expect, it } from 'vitest';
import {
  canDrive,
  fetchData,
  getCoupons,
  isPriceInRange,
  isValidUsername,
  validateUserInput,
  Stack
} from '../src/core';

describe('getCoupons', () => {
  const coupons = getCoupons();

  it('should return an array of coupons', () => {
    expect(coupons.length).toBeGreaterThan(0);
    expect(Array.isArray(coupons)).toBe(true);

    coupons.forEach((coupon) => {
      expect(coupon).toHaveProperty('code');
      expect(coupon).toHaveProperty('discount');
    });
  });
  it('should return an array of coupons with valid codes', () => {
    coupons.forEach((coupon) => {
      expect(coupon).toHaveProperty('code');
      expect(typeof coupon.code).toBe('string');
      expect(typeof coupon.code).toBeTruthy();
    });
  });
  it('should return an array of coupons with valid discounts', () => {
    coupons.forEach((coupon) => {
      expect(coupon).toHaveProperty('discount');
      expect(typeof coupon.discount).toBe('number');
      expect(coupon.discount).toBeGreaterThan(0).toBeLessThan(1);
    });
  });
});

describe('validationUserInput', () => {
  it('should return validation successful when valid data is passed', () => {
    expect(validateUserInput('user', 20)).toMatch(/success/i);
  });
  it('should return invalid username when username is not a string', () => {
    expect(validateUserInput(25, 25)).toMatch(/invalid\susername/i);
  });
  it('should return invalid username when username is too long or too short', () => {
    expect(validateUserInput('ai', 25)).toMatch(/invalid\susername/i);
    expect(validateUserInput('a'.repeat(256), 25)).toMatch(
      /invalid\susername/i
    );
  });
  it('should return invalid age when age is not a number', () => {
    expect(validateUserInput('user', '15')).toMatch(/invalid\sage/i);
  });
  it('should return invalid age when age is less than 18', () => {
    expect(validateUserInput('user', 15)).toMatch(/invalid\sage/i);
  });
  it('should return invalid age when age is greater than 100', () => {
    expect(validateUserInput('user', 101)).toMatch(/invalid\sage/i);
  });
  it('should return an error if both the username and age are invalid', () => {
    expect(validateUserInput('ai', 15)).toMatch(
      /invalid\susername,\sinvalid\sage/i
    );
  });
});

describe('isValidUsername', () => {
  const validLength = {
    min: 5,
    max: 15
  };

  it('should return false is the username is falsy or a numeric value', () => {
    expect(isValidUsername()).toBe(false);
    expect(isValidUsername(null)).toBe(false);
    expect(isValidUsername(undefined)).toBe(false);
    expect(isValidUsername(1)).toBe(false);
  });
  it('should return false is username is too short', () => {
    expect(isValidUsername('u'.repeat(validLength.min - 1))).toBe(false);
  });
  it('should return false is username is too long', () => {
    expect(isValidUsername('u'.repeat(validLength.max + 1))).toBe(false);
  });
  it('should return true is username length is valid', () => {
    expect(isValidUsername('u'.repeat(validLength.min))).toBe(true);
    expect(isValidUsername('u'.repeat(validLength.max))).toBe(true);
    expect(
      isValidUsername(
        'u'.repeat(
          Math.random() * (validLength.max - validLength.min) + validLength.min
        )
      )
    ).toBe(true);
  });
});

describe('isPriceInRange', () => {
  const validRange = {
    min: 0,
    max: 100
  };
  it.each([
    {
      price: -10,
      result: false
    },
    {
      price: 200,
      result: false
    },
    {
      price: 0,
      result: true
    },
    {
      price: 100,
      result: true
    },
    {
      price: 50,
      result: true
    }
  ])(
    `should return $result if price $price is in range: ${validRange.min}-${validRange.max}`,
    ({ price, result }) => {
      expect(isPriceInRange(price, validRange.min, validRange.max)).toBe(
        result
      );
    }
  );
});

describe('canDrive', () => {
  const legalDrivingAge = {
    US: 16,
    UK: 17
  };

  it('should return false is the age or country code are falsy/invalid', () => {
    expect(canDrive()).toBe(false);
    expect(canDrive(null, 'US')).toBe(false);
    expect(canDrive(undefined, 'US')).toBe(false);
    expect(canDrive(18, null)).toBe(false);
    expect(canDrive(18, undefined)).toBe(false);
    expect(canDrive(101, legalDrivingAge.US)).toBe(false);
    expect(canDrive(101, legalDrivingAge.UK)).toBe(false);
  });

  it("should return false is the age is below the country's legal driving age", () => {
    expect(canDrive(legalDrivingAge.US - 1, 'US')).toBe(false);
    expect(canDrive(legalDrivingAge.UK - 1, 'UK')).toBe(false);
  });

  it('should return false is the country code is invalid', () => {
    expect(canDrive(1, 'AR')).toMatch(/invalid\scountry\scode/i);
  });

  it("should return true is the age is above or equal the country's legal driving age", () => {
    expect(canDrive(legalDrivingAge.US, 'US')).toBe(true);
    expect(canDrive(legalDrivingAge.US + 1, 'US')).toBe(true);
    expect(canDrive(legalDrivingAge.UK, 'UK')).toBe(true);
    expect(canDrive(legalDrivingAge.UK + 1, 'UK')).toBe(true);
  });
});

describe('fetchData', () => {
  it('should return an array of data', async () => {
    try {
      const data = await fetchData();
      expect(data).toBe([1, 2, 3]);
    } catch (error) {
      expect(error).toBeDefined();
    }
  });
});

describe('testStack', () => {
  let stack;

  beforeEach(() => {
    stack = new Stack();
  });

  it('should return true when the stack is empty', () => {
    expect(stack.isEmpty()).toBe(true);
  });
  it('should add an item to the stack and return it', () => {
    expect(stack.push('item')).toBe('item');
  });
  it('should return false when the stack is not empty', () => {
    stack.push('item');

    expect(stack.isEmpty()).toBe(false);
  });
  it('should return the correct stack size', () => {
    stack.push('item');

    expect(stack.size()).toBe(1);
  });
  it('should return the top item of the stack without removing it', () => {
    stack.push('item 1');
    stack.push('item 2');

    expect(stack.peek()).toBe('item 2');
    expect(stack.size()).toBe(2);
  });
  it('should return the top item of the stack and remove it', () => {
    stack.push('item 1');
    stack.push('item 2');

    expect(stack.pop()).toBe('item 2');
    expect(stack.size()).toBe(1);
  });
  it('should clear the stack', () => {
    stack.push('item 1');
    stack.push('item 2');

    expect(stack.size()).toBe(2);
    expect(stack.clear()).toEqual([]);
    expect(stack.size()).toBe(0);
  });
  it('should throw an error is the stack is empty when calling pop', () => {
    expect(() => stack.pop()).toThrow(/empty/i);
  });
  it('should throw an error is the stack is empty when calling peek', () => {
    expect(() => stack.peek()).toThrow(/empty/i);
  });
});
