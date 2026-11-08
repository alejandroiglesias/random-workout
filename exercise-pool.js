/* Shared by the static app and Node's test runner. */
((root) => {
  const categoryOf = (exercise) => exercise.category || 'uncategorized';
  const categories = (exercises) => [...new Set(exercises.map(categoryOf))].sort();
  const filterExercises = (exercises, selected) => exercises.filter(e => selected.has(categoryOf(e)));
  const restoreSelection = (types, saved) => {
    if (!Array.isArray(saved) || !saved.every(type => typeof type === 'string')) return new Set(types);
    return new Set(types.filter(type => saved.includes(type)));
  };
  const api = { categories, filterExercises, restoreSelection };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.CastIronPool = api;
})(globalThis);
