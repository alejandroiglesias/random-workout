const { test } = require('node:test');
const assert = require('node:assert/strict');
const { categories, filterExercises, restoreSelection } = require('./exercise-pool.js');

const exercises = [
  { id: 'squat', category: 'strength' },
  { id: 'stretch', category: 'stretching' },
  { id: 'run', category: 'cardio' },
  { id: 'press', category: 'strength' },
];

test('discovers distinct types from the catalogue, including future types', () => {
  assert.deepEqual(categories([...exercises, { category: 'new type' }]),
    ['cardio', 'new type', 'strength', 'stretching']);
});

test('all checked includes every exercise; excluding stretching removes only stretches', () => {
  assert.deepEqual(filterExercises(exercises, new Set(categories(exercises))), exercises);
  assert.deepEqual(filterExercises(exercises, new Set(['strength', 'cardio'])).map(e => e.id),
    ['squat', 'run', 'press']);
});

test('supports a single type and an empty selection without changing the catalogue', () => {
  assert.deepEqual(filterExercises(exercises, new Set(['stretching'])), [exercises[1]]);
  assert.deepEqual(filterExercises(exercises, new Set()), []);
  assert.equal(exercises.length, 4);
});

test('restores stored selections, including none, and defaults to all for invalid storage', () => {
  const types = categories(exercises);
  assert.deepEqual([...restoreSelection(types, null)], types);
  assert.deepEqual([...restoreSelection(types, {})], types);
  assert.deepEqual([...restoreSelection(types, [42])], types);
  assert.deepEqual([...restoreSelection(types, [])], []);
  assert.deepEqual([...restoreSelection(types, ['strength', 'removed type'])], ['strength']);
});
