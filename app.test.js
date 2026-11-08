const { test } = require('node:test');
const assert = require('node:assert/strict');
const vm = require('node:vm');
const fs = require('node:fs');

async function boot(saved, blockedStorage = false) {
  const nodes = new Map();
  function element() {
    return {
      children: [], dataset: {}, style: { setProperty() {}, removeProperty() {} }, hidden: true, textContent: '',
      classList: { add() {}, remove() {}, toggle() {} },
      listeners: {}, addEventListener(name, fn) { this.listeners[name] = fn; },
      append(...children) { this.children.push(...children); },
      setAttribute() {}, focus() {}, querySelector() { return null; },
      replaceChildren() { this.children = []; }, querySelectorAll() { return []; },
    };
  }
  const document = {
    getElementById(id) { if (!nodes.has(id)) nodes.set(id, element()); return nodes.get(id); },
    createElement: element, querySelectorAll() { return []; }, addEventListener() {},
  };
  let stored = saved;
  const context = vm.createContext({
    document, Set, console, Image: class {},
    setTimeout: fn => { fn(); return 1; }, setInterval: () => 1, clearInterval() {},
    localStorage: {
      getItem() { if (blockedStorage) throw Error('blocked'); return stored; },
      setItem(key, value) { if (blockedStorage) throw Error('blocked'); stored = value; },
    },
    window: {
      AudioContext: class {},
      matchMedia: () => ({ matches: false }),
      CastIronI18n: {
        t: (key, vars) => key + JSON.stringify(vars || {}), getLang: () => 'en',
        getLex: () => null, trMuscle: value => value, trValue: value => value,
        applyStatic() {}, updateLangButtons() {},
      },
    },
    fetch: async () => ({ ok: true, json: async () => [
      { id: 'squat', name: 'Squat', category: 'strength', primaryMuscles: ['quadriceps'], images: ['squat.jpg'] },
      { id: 'stretch', name: 'Stretch', category: 'stretching', primaryMuscles: ['shoulders'], images: ['stretch.jpg'] },
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


test('only exercises with recorded sets appear in the log and session summary', async () => {
  const { nodes } = await boot('["strength"]');
  const click = id => nodes.get(id).listeners.click();
  click('caster');
  assert.equal(nodes.get('log').innerHTML, '');
  assert.equal(nodes.get('card-empty').hidden, false);
  click('caster');
  click('log-set-btn');
  assert.match(nodes.get('log').innerHTML, /data-n="2"/);
  assert.doesNotMatch(nodes.get('log').innerHTML, /data-n="1"/);
  assert.match(nodes.get('card-count').textContent, /cardCountOne/);
  click('log-set-btn');
  assert.match(nodes.get('log').innerHTML, /"n":2/);
  const strength = nodes.get('exercise-types').children[0].children[0];
  strength.checked = false;
  nodes.get('exercise-types').listeners.change({ target: strength });
  click('caster');
  assert.doesNotMatch(nodes.get('log').innerHTML, /data-n="3"/);
  click('finish-btn');
  assert.equal(nodes.get('tally-count').textContent, 1);
  assert.equal(nodes.get('tally-sets').textContent, 2);
  assert.equal(nodes.get('tally-muscles').textContent, 1);
  assert.doesNotMatch(nodes.get('tally-chips').innerHTML, /shoulders/);
});

test('finishing after only skipped exercises reports no completed exercises', async () => {
  const { nodes } = await boot(null);
  nodes.get('caster').listeners.click();
  nodes.get('finish-btn').listeners.click();
  assert.equal(nodes.get('tally-count').textContent, 0);
  assert.equal(nodes.get('tally-muscles').textContent, 0);
  assert.match(nodes.get('receipt-verdict').textContent, /verdictZero/);
});
