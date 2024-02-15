import { describe, expect, it } from 'vitest';
import { isProperBinaryTree } from '../src/treeNode';

describe('isProperBinaryTree', () => {
  it.each([
    {
      pairs: [
        [1, 2],
        [2, 4],
        [5, 7],
        [7, 2],
        [9, 5]
      ],
      result: true
    },
    {
      pairs: [
        [1, 2],
        [3, 2],
        [2, 12],
        [5, 2]
      ],
      result: false
    }
  ])('should return $result for the pairs: $pairs', ({ pairs, result }) => {
    expect(isProperBinaryTree(pairs)).toBe(result);
  });
});
