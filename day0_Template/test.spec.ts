import { describe, it, expect } from '@jest/globals';
import { countInList, part1 } from './main';

describe('Day 1', () => {
  describe('Part 1', () => {
    describe('errors', () => {
      it('wrong number arrays', () => {
        expect(() => part1([[], [1], []])).toThrow();
      });
      it('wrong length', () => {
        expect(() => part1([[], [1]])).toThrow();
      });
    });
  });

  describe('Part2', () => {
    it('countInList', () => {
      expect(countInList(1, [])).toEqual(0);
      expect(countInList(1, [2])).toEqual(0);
      expect(countInList(1, [2, 1])).toEqual(1);
      expect(countInList(1, [2, 1, 1, 1])).toEqual(3);
    });
  });
});
