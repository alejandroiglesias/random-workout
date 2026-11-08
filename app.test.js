const { test } = require('node:test');
const assert = require('node:assert/strict');
const vm = require('node:vm');
const fs = require('node:fs');

async function boot(saved, blockedStorage = false) {
  const nodes = new Map();
  function element() {
    return {
      children: [], dataset: {}, style: {}, hidden: true, textContent: '',
      classList: { add() {}, remove() {}, toggle() {} },
      listeners: {}, addEventListener(name, fn) { this.listeners[name] = fn; },
      append(...children) { this.children.push(...children); },
      replaceChildren() { this.children = []; }, querySelectorAll() { return []; },
    };
  }
  const document = {
    getElementById(id) { if (!nodes.has(id)) nodes.set(id, element()); return nodes.get(id); },
    createElement: element, querySelectorAll() { return []; }, addEventListener() {},
  };
  let stored = saved;
  const context = vm.createContext({
    document, Set, console,
    localStorage: {
      getItem() { if (blockedStorage) throw Error('blocked'); return stored; },
      setItem(key, value) { if (blockedStorage) throw Error('blocked'); stored = value; },
    },
    window: {
      matchMedia: () => ({ matches: false }),
      CastIronI18n: {
        t: (key, vars) => key + JSON.stringify(vars || {}), getLang: () => 'en',
        getLex: () => null, trValue: value => value,
        applyStatic() {}, updateLangButtons() {},
      },
    },
    fetch: async () => ({ ok: true, json: async () => [
      { id: 'squat', name: 'Squat', category: 'strength', images: ['squat.jpg'] },
      { id: 'stretch', name: 'Stretch', category: 'stretching', images: ['stretch.jpg'] },
    ] }),
  });
  vm.runInContext(fs.readFileSync('exercise-pool.js', 'utf8'), context);
  context.window.CastIronPool = context.CastIronPool;
  vm.runInContext(fs.readFileSync('app.js', 'utf8'), context);
  await new Promise(resolve => setImmediate(resolve));
  return { nodes, stored: () => stored };
}

test('UI starts with all types checked, saves changes and restores them on reload', async () => {
  const app = await boot(null);
  const filters = app.nodes.get('exercise-types');
  assert.equal(filters.children.length, 2);
  assert.ok(filters.children.every(label => label.children[0].checked));
  const stretch = filters.children[1].children[0];
  stretch.checked = false;
  filters.listeners.change({ target: stretch });
  assert.deepEqual(JSON.parse(app.stored()), ['strength']);
  assert.match(app.nodes.get('filter-status').textContent, /"count":1/);
  const reloaded = await boot(app.stored());
  assert.equal(reloaded.nodes.get('exercise-types').children[1].children[0].checked, false);
});

test('empty persisted selection blocks both roll buttons and click handler', async () => {
  const app = await boot('[]');
  for (const id of ['caster', 'rollbar-btn']) {
    assert.equal(app.nodes.get(id).disabled, true);
    assert.doesNotThrow(() => app.nodes.get(id).listeners.click());
  }
  assert.match(app.nodes.get('filter-status').textContent, /filterEmpty/);
});

test('malformed and unavailable storage do not prevent catalogue and filters loading', async () => {
  for (const app of [await boot('{'), await boot(null, true)]) {
    assert.equal(app.nodes.get('caster').disabled, false);
    const filters = app.nodes.get('exercise-types');
    const input = filters.children[0].children[0];
    input.checked = false;
    assert.doesNotThrow(() => filters.listeners.change({ target: input }));
  }
});
