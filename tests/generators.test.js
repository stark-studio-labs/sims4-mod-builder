'use strict';

const {
  tuningId,
  instanceHash,
  generateTraitXML,
  generateCareerXML,
  generateInteractionXML,
  parseOutcomeAmount,
  parseNeedType,
} = require('../js/generators');

// ── tuningId ──────────────────────────────────────────────────────────────

describe('tuningId', () => {
  test('replaces spaces with underscores', () => {
    expect(tuningId('My Trait')).toBe('My_Trait');
  });

  test('strips leading and trailing underscores', () => {
    expect(tuningId('__name__')).toBe('name');
  });

  test('collapses multiple underscores', () => {
    expect(tuningId('foo  bar')).toBe('foo_bar');
  });

  test('removes non-alphanumeric characters', () => {
    expect(tuningId('trait-name!')).toBe('trait_name');
  });

  test('preserves alphanumeric characters', () => {
    expect(tuningId('CookingSkill1')).toBe('CookingSkill1');
  });

  test('empty string returns empty string', () => {
    expect(tuningId('')).toBe('');
  });

  test('only special chars returns empty string', () => {
    expect(tuningId('---')).toBe('');
  });
});

// ── instanceHash ──────────────────────────────────────────────────────────

describe('instanceHash', () => {
  test('returns a string starting with 0x', () => {
    expect(instanceHash('TraitName')).toMatch(/^0x/);
  });

  test('result is 18 characters long (0x + 16 hex digits)', () => {
    expect(instanceHash('TraitName')).toHaveLength(18);
  });

  test('same name always produces same hash', () => {
    expect(instanceHash('StableHash')).toBe(instanceHash('StableHash'));
  });

  test('different names produce different hashes', () => {
    expect(instanceHash('TraitA')).not.toBe(instanceHash('TraitB'));
  });

  test('empty string returns a valid hash', () => {
    const h = instanceHash('');
    expect(h).toMatch(/^0x[0-9A-F]+$/);
  });

  test('only contains uppercase hex digits after 0x', () => {
    const h = instanceHash('SomeName');
    expect(h.slice(2)).toMatch(/^[0-9A-F]+$/);
  });
});

// ── parseOutcomeAmount ────────────────────────────────────────────────────

describe('parseOutcomeAmount', () => {
  test('extracts positive integer', () => {
    expect(parseOutcomeAmount('+10 friendship', 5)).toBe(10);
  });

  test('extracts negative integer', () => {
    expect(parseOutcomeAmount('-5 points', 5)).toBe(-5);
  });

  test('extracts bare integer', () => {
    expect(parseOutcomeAmount('gain 20 skill points', 0)).toBe(20);
  });

  test('returns fallback when no number found', () => {
    expect(parseOutcomeAmount('no numbers here', 99)).toBe(99);
  });

  test('empty string returns fallback', () => {
    expect(parseOutcomeAmount('', 7)).toBe(7);
  });
});

// ── parseNeedType ─────────────────────────────────────────────────────────

describe('parseNeedType', () => {
  test('fun keyword returns FUN', () => {
    expect(parseNeedType('gain fun')).toBe('FUN');
  });

  test('social keyword returns SOCIAL', () => {
    expect(parseNeedType('improve social')).toBe('SOCIAL');
  });

  test('hunger keyword returns HUNGER', () => {
    expect(parseNeedType('reduce hunger')).toBe('HUNGER');
  });

  test('food keyword returns HUNGER', () => {
    expect(parseNeedType('eat food')).toBe('HUNGER');
  });

  test('hygiene keyword returns HYGIENE', () => {
    expect(parseNeedType('improve hygiene')).toBe('HYGIENE');
  });

  test('clean keyword returns HYGIENE', () => {
    expect(parseNeedType('get clean')).toBe('HYGIENE');
  });

  test('energy keyword returns ENERGY', () => {
    expect(parseNeedType('restore energy')).toBe('ENERGY');
  });

  test('sleep keyword returns ENERGY', () => {
    expect(parseNeedType('sleep more')).toBe('ENERGY');
  });

  test('bladder keyword returns BLADDER', () => {
    expect(parseNeedType('bladder relief')).toBe('BLADDER');
  });

  test('unknown defaults to FUN', () => {
    expect(parseNeedType('something else')).toBe('FUN');
  });

  test('null/undefined defaults to FUN', () => {
    expect(parseNeedType(null)).toBe('FUN');
    expect(parseNeedType(undefined)).toBe('FUN');
    expect(parseNeedType('')).toBe('FUN');
  });
});

// ── generateTraitXML ──────────────────────────────────────────────────────

describe('generateTraitXML', () => {
  const minimalData = {
    name: 'Bookworm',
    desc: 'Loves reading books.',
    category: 'lifestyle',
    ages: 'Teen, Young Adult, Adult, Elder',
    icon: 'img:///S4_2F7D0004_00000000_test_icon',
    conflicts: [],
    buffs: [],
  };

  test('output contains the trait name', () => {
    const xml = generateTraitXML(minimalData);
    expect(xml).toContain('Bookworm');
  });

  test('output contains the description', () => {
    const xml = generateTraitXML(minimalData);
    expect(xml).toContain('Loves reading books.');
  });

  test('output starts with XML declaration', () => {
    const xml = generateTraitXML(minimalData);
    expect(xml.trimStart()).toMatch(/^<\?xml version="1\.0"/);
  });

  test('category is uppercased in output', () => {
    const xml = generateTraitXML(minimalData);
    expect(xml).toContain('LIFESTYLE');
  });

  test('each age appears uppercased', () => {
    const xml = generateTraitXML(minimalData);
    expect(xml).toContain('TEEN');
    expect(xml).toContain('YOUNG_ADULT');
  });

  test('buff sections included when buffs provided', () => {
    const data = {
      ...minimalData,
      buffs: [{ emotion: 'Happy', reason: 'Feeling bookish', weight: 1 }],
    };
    const xml = generateTraitXML(data);
    expect(xml).toContain('buffs');
    expect(xml).toContain('Happy');
  });

  test('conflict section included when conflicts provided', () => {
    const data = { ...minimalData, conflicts: ['Evil', 'Mean'] };
    const xml = generateTraitXML(data);
    expect(xml).toContain('conflicting_traits');
    expect(xml).toContain('trait_Evil');
    expect(xml).toContain('trait_Mean');
  });

  test('no buff section when buffs array is empty', () => {
    const xml = generateTraitXML(minimalData);
    expect(xml).not.toContain('<L n="buffs">');
  });

  test('instance hash is present in root element', () => {
    const xml = generateTraitXML(minimalData);
    expect(xml).toMatch(/s="0x[0-9A-F]+"/);
  });

  test('returns a non-empty string', () => {
    expect(generateTraitXML(minimalData).length).toBeGreaterThan(50);
  });
});

// ── generateCareerXML ─────────────────────────────────────────────────────

describe('generateCareerXML', () => {
  const minimalCareer = {
    name: 'Astronaut',
    desc: 'Reach for the stars.',
    track: 'Standard',
    schedule: 'Mon–Fri 9AM–5PM',
    levels: [
      { number: 1, title: 'Intern', salary: 20, skill: 'Rocket Science', skillReq: 2 },
      { number: 2, title: 'Engineer', salary: 40, skill: 'Rocket Science', skillReq: 5 },
    ],
  };

  test('contains career name', () => {
    expect(generateCareerXML(minimalCareer)).toContain('Astronaut');
  });

  test('contains all level titles', () => {
    const xml = generateCareerXML(minimalCareer);
    expect(xml).toContain('Intern');
    expect(xml).toContain('Engineer');
  });

  test('contains salary values', () => {
    const xml = generateCareerXML(minimalCareer);
    expect(xml).toContain('20');
    expect(xml).toContain('40');
  });

  test('branching track uses BRANCHING in XML', () => {
    const data = { ...minimalCareer, track: 'Branching' };
    expect(generateCareerXML(data)).toContain('BRANCHING');
  });

  test('standard track uses STANDARD in XML', () => {
    expect(generateCareerXML(minimalCareer)).toContain('STANDARD');
  });

  test('skill requirement is included', () => {
    const xml = generateCareerXML(minimalCareer);
    expect(xml).toContain('skill_Rocket_Science');
  });

  test('returns a non-empty string', () => {
    expect(generateCareerXML(minimalCareer).length).toBeGreaterThan(50);
  });
});

// ── generateInteractionXML ────────────────────────────────────────────────

describe('generateInteractionXML', () => {
  const simInteraction = {
    name: 'Ask About Day',
    desc: 'Ask a Sim how their day went.',
    target: 'Sim',
    category: 'friendly',
    ages: 'Teen, Young Adult, Adult',
    autonomy: 'true',
    outcomes: [],
  };

  test('contains interaction name', () => {
    expect(generateInteractionXML(simInteraction)).toContain('Ask About Day');
  });

  test('sim target uses SocialSuperInteraction base class', () => {
    expect(generateInteractionXML(simInteraction)).toContain('SocialSuperInteraction');
  });

  test('object target uses SuperInteraction base class', () => {
    const data = { ...simInteraction, target: 'Object' };
    expect(generateInteractionXML(data)).toContain('SuperInteraction');
  });

  test('category is uppercased', () => {
    expect(generateInteractionXML(simInteraction)).toContain('FRIENDLY');
  });

  test('autonomous true renders True', () => {
    expect(generateInteractionXML(simInteraction)).toContain('True');
  });

  test('autonomous false renders False', () => {
    const data = { ...simInteraction, autonomy: 'false' };
    expect(generateInteractionXML(data)).toContain('False');
  });

  test('XML Injector snippet is always included', () => {
    expect(generateInteractionXML(simInteraction)).toContain('XmlInjector');
  });

  test('relationship outcome produces relationship_change block', () => {
    const data = {
      ...simInteraction,
      outcomes: [{ type: 'relationship', detail: '+10 friendship' }],
    };
    expect(generateInteractionXML(data)).toContain('relationship_change');
  });

  test('skill outcome produces skill_gain block', () => {
    const data = {
      ...simInteraction,
      outcomes: [{ type: 'skill', detail: 'Charisma +5' }],
    };
    expect(generateInteractionXML(data)).toContain('skill_gain');
  });

  test('buff outcome produces buff_apply block', () => {
    const data = {
      ...simInteraction,
      outcomes: [{ type: 'buff', detail: 'Confident' }],
    };
    expect(generateInteractionXML(data)).toContain('buff_apply');
  });

  test('need outcome produces need_change block', () => {
    const data = {
      ...simInteraction,
      outcomes: [{ type: 'need', detail: 'gain fun +20' }],
    };
    expect(generateInteractionXML(data)).toContain('need_change');
  });

  test('object target injects to objects list', () => {
    const data = { ...simInteraction, target: 'Object' };
    expect(generateInteractionXML(data)).toContain('add_interactions_to_objects');
  });

  test('sim target injects to sims list', () => {
    expect(generateInteractionXML(simInteraction)).toContain('add_interactions_to_sims');
  });
});
