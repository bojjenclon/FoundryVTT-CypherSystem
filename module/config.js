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
  {
    label: 'Hale',
    description: 'Normal state for a character.'
  },
  {
    label: 'Impaired',
    description: 'In a wounded or injured state. Applying Effort costs 1 extra point per effort level applied.'
  },
  {
    label: 'Debilitated',
    description: 'In a critically injured state. The character can do no other action than to crawl an immediate distance; if their Speed pool is 0, they cannot move at all.'
  },
  {
    label: 'Dead',
    description: 'The character is dead.'
  }
];

CSR.recoveries = {
  'action': '1 Action',
  'tenMins': '10 mins',
  'oneHour': '1 hour',
  'tenHours': '10 hours'
};

CSR.advances = {
  'stats': '+4 to stat pools',
  'edge': '+1 to Edge',
  'effort': '+1 to Effort',
  'skills': 'Train/specialize skill',
  'other': 'Other',
};

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
