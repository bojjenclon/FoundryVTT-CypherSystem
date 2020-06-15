export const CSR = {};

CSR.itemTypes = [
  'skills',
  'abilities',
  'cyphers',
  'artifacts',
  'oddities',
  'weapons',
  'armor',
  'gear'
];

CSR.inventoryTypes = [
  'weapon',
  'armor',
  'gear',

  'cypher',
  'artifact',
  'oddity'
];

CSR.weightClasses = [
  'light',
  'medium',
  'heavy'
];

CSR.weaponTypes = [
  'bashing',
  'bladed',
  'ranged',
]

CSR.stats = [
  'might',
  'speed',
  'intellect',
];

CSR.trainingLevels = [
  'inability',
  'untrained',
  'trained',
  'specialized'
];

CSR.damageTrack = [
  'hale',
  'impaired',
  'debilitated',
  'dead'
];

// CSR.recoveries = {
//   'action': '1 Action',
//   'tenMins': '10 mins',
//   'oneHour': '1 hour',
//   'tenHours': '10 hours'
// };
CSR.recoveries = [
  'action',
  'tenMins',
  'oneHour',
  'tenHours'
];

CSR.advances = [
  'stats',
  'edge',
  'effort',
  'skills',
  'other'
];

CSR.ranges = [
  'immediate',
  'short',
  'long',
  'veryLong'
];

CSR.optionalRanges = ["na"].concat(CSR.ranges);

CSR.abilityTypes = [
  'Action',
  'Enabler',
];

CSR.supportsMacros = [
  'skill',
  'ability'
];

CSR.hasLevelDie = [
  'cypher',
  'artifact'
];
