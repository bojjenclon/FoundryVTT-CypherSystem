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

CSR.weightClasses = [
  'Light',
  'Medium',
  'Heavy'
];

CSR.weaponTypes = [
  'Bashing',
  'Bladed',
  'Ranged',
]

CSR.stats = [
  'Might',
  'Speed',
  'Intellect',
];

CSR.skillLevels = {
  'i': 'Inability',
  'u': 'Untrained',
  't': 'Trained',
  's': 'Specialized'
};

CSR.types = [
  {
    abbrev: 'a',
    name: 'Arkus',
  },
  {
    abbrev: 'd',
    name: 'Delve',
  },
  {
    abbrev: 'g',
    name: 'Glaive',
  },
  {
    abbrev: 'j',
    name: 'Jack',
  },
  {
    abbrev: 'n',
    name: 'Nano',
  },
  {
    abbrev: 'w',
    name: 'Wright',
  },
];

CSR.typePowers = {
  'g': 'Combat Maneuvers',
  'j': 'Tricks of the Trade',
  'n': 'Esoteries',
  'a': 'Precepts',
  'd': 'Delve Lores',
  'w': 'Inspired Techniques',
};

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
  'tenMin': '10 min',
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
  'Immediate',
  'Short',
  'Long',
  'Very Long'
];

CSR.optionalRanges = ["N/A"].concat(CSR.ranges);

CSR.abilityTypes = [
  'Action',
  'Enabler',
];

CSR.supportsMacros = [
  'skill',
  'ability'
];
