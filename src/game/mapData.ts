import { RoomData, RoomId, Item } from '../types/game';

export const ALL_ITEMS: Record<string, Item> = {
  key_reception: {
    id: 'key_reception',
    name: 'Reception Brass Key',
    category: 'KEY',
    description: 'An ornate brass key stamped with "REC-01". Found behind the front counter.',
    icon: '🗝️',
    loreText: 'Unlocks the heavy service door leading from the foyer deeper into the ground floor corridors.'
  },
  key_room101: {
    id: 'key_room101',
    name: 'Room 101 Ward Key',
    category: 'KEY',
    description: 'A heavy iron key extracted from the locked locker in Room 101.',
    icon: '🗝️',
    loreText: 'Engraved with "101 - KEEP SECURED". Used to unlock the maintenance doors and storage.'
  },
  key_kitchen: {
    id: 'key_kitchen',
    name: 'Kitchen Pantry Key',
    category: 'KEY',
    description: 'A grease-stained steel key retrieved from the breaker safe.',
    icon: '🗝️',
    loreText: 'Marked with "PANTRY & STAIRS". Grants access to the restricted upper staircase.'
  },
  key_basement: {
    id: 'key_basement',
    name: 'Sub-Basement Iron Key',
    category: 'KEY',
    description: 'A cold, pitted iron key recovered from the dark flooded basement.',
    icon: '🗝️',
    loreText: 'Smells of damp earth and rust. Bears the seal of the 1994 lockdown.'
  },
  key_master: {
    id: 'key_master',
    name: 'Warden’s Master Skeleton Key',
    category: 'KEY',
    description: 'A golden master key recovered from Warden Sterling’s hidden office safe.',
    icon: '🔑',
    loreText: 'The final key needed to release the 5-point deadbolt on the grand main entrance gate.'
  },
  battery_1: {
    id: 'battery_1',
    name: 'Heavy Duty D-Cell Battery',
    category: 'SUPPLY',
    description: 'Fresh industrial battery. Restores 45% flashlight charge.',
    icon: '🔋',
    usable: true
  },
  battery_2: {
    id: 'battery_2',
    name: 'Heavy Duty D-Cell Battery',
    category: 'SUPPLY',
    description: 'Fresh industrial battery. Restores 45% flashlight charge.',
    icon: '🔋',
    usable: true
  },
  battery_3: {
    id: 'battery_3',
    name: 'Heavy Duty D-Cell Battery',
    category: 'SUPPLY',
    description: 'Fresh industrial battery. Restores 45% flashlight charge.',
    icon: '🔋',
    usable: true
  },
  medkit_1: {
    id: 'medkit_1',
    name: 'First Aid Bandages & Antiseptic',
    category: 'SUPPLY',
    description: 'Restores 40 points of player health and calms the pulse.',
    icon: '🩹',
    usable: true
  },
  medkit_2: {
    id: 'medkit_2',
    name: 'Emergency Medical Kit',
    category: 'SUPPLY',
    description: 'Restores 50 points of player health.',
    icon: '🩹',
    usable: true
  },
  diary_1: {
    id: 'diary_1',
    name: 'Torn Diary Page 1 (October 4, 1994)',
    category: 'DIARY',
    description: 'Handwritten notes by student Maya Lin.',
    icon: '📜',
    loreText: '"The hostel warden has been withholding the scholarship grants. When I confronted Mr. Sterling, he threatened to revoke my admission. There are sounds from the sub-basement late at night."'
  },
  diary_2: {
    id: 'diary_2',
    name: 'Torn Diary Page 2 (October 18, 1994)',
    category: 'DIARY',
    description: 'Handwritten notes with ink smudges.',
    icon: '📜',
    loreText: '"Room 102 was ransacked today. My roommate said she heard the Warden whispering in the corridor. He said: \'The ledger numbers in the storage records will never see daylight.\'"'
  },
  diary_3: {
    id: 'diary_3',
    name: 'Torn Diary Page 3 (October 29, 1994)',
    category: 'DIARY',
    description: 'Crinkled paper found behind the kitchen stoves.',
    icon: '📜',
    loreText: '"They cut the main electrical breakers whenever they move boxes to the basement. The sequence on the breaker board is marked: Blue, Red, Green, Yellow, White. I must hide a duplicate key in the pantry."'
  },
  diary_4: {
    id: 'diary_4',
    name: 'Torn Diary Page 4 (November 2, 1994)',
    category: 'DIARY',
    description: 'Blood-spotted journal entry from the Warden\'s desk.',
    icon: '📜',
    loreText: '"He locked me inside the archive room beneath the stairs. The cold is unbearable. The clock at reception stopped right at 12:00. The code 1248 opens the locker where I hid the evidence."'
  },
  diary_5: {
    id: 'diary_5',
    name: 'Torn Diary Page 5 (The Final Truth)',
    category: 'DIARY',
    description: 'The final confession hidden in the basement altar.',
    icon: '📜',
    loreText: '"To whoever finds this: I didn\'t disappear willingly. Warden Sterling bricked up the basement vault to bury his theft. My spirit cannot leave this hostel until someone unlocks the gates with the truth exposed."'
  },
  doc_inspection: {
    id: 'doc_inspection',
    name: 'State Inspection Audit (1994)',
    category: 'DOCUMENT',
    description: 'Official university audit document with highlighted discrepancies.',
    icon: '📁',
    loreText: 'Audit File #394: Discrepancies noted in electrical safety. Secret room hidden behind the warden\'s bookshelf aligns with the symbols: SUN, OWLS, KEY.'
  }
};

export const ROOMS: Record<RoomId, RoomData> = {
  reception: {
    id: 'reception',
    name: 'Reception Area',
    width: 900,
    height: 700,
    walls: [
      { x: 0, y: 0, w: 900, h: 20 },
      { x: 0, y: 680, w: 900, h: 20 },
      { x: 0, y: 0, w: 20, h: 700 },
      { x: 880, y: 0, w: 20, h: 700 },
    ],
    furniture: [
      { x: 300, y: 150, w: 300, h: 70, color: '#332219', label: 'Front Desk', spriteType: 'desk' },
      { x: 120, y: 80, w: 60, h: 100, color: '#2a1a10', label: 'Old Grandfather Clock', spriteType: 'shelf' },
      { x: 700, y: 80, w: 90, h: 120, color: '#222831', label: 'Filing Cabinet', spriteType: 'shelf' },
      { x: 100, y: 450, w: 120, h: 70, color: '#1a1f2c', label: 'Torn Sofa', spriteType: 'bed' },
      { x: 680, y: 450, w: 120, h: 70, color: '#1a1f2c', label: 'Waiting Bench', spriteType: 'bed' },
      { x: 420, y: 350, w: 60, h: 60, color: '#4a1111', label: 'Old Dried Blood', spriteType: 'blood' },
    ],
    lights: [
      { x: 450, y: 150, radius: 180, color: 'rgba(255, 230, 160, 0.45)', flicker: true },
      { x: 150, y: 130, radius: 120, color: 'rgba(220, 180, 100, 0.25)' },
    ],
    objects: [
      {
        id: 'rec_clock',
        x: 120,
        y: 80,
        w: 60,
        h: 100,
        type: 'INSPECTABLE',
        name: 'Stopped Grandfather Clock',
        dialogue: [
          'The hands of the grandfather clock are frozen rigidly at 12:00:00.',
          'Scratched near the pendulum base is a handwritten number: "12...".'
        ]
      },
      {
        id: 'rec_desk_key',
        x: 440,
        y: 225,
        w: 50,
        h: 50,
        type: 'KEY',
        name: 'Reception Brass Key (Key 1)',
        itemId: 'key_reception',
        collected: false
      },
      {
        id: 'rec_battery',
        x: 710,
        y: 100,
        w: 40,
        h: 40,
        type: 'BATTERY',
        name: 'Flashlight Battery',
        itemId: 'battery_1',
        collected: false
      },
      {
        id: 'rec_diary1',
        x: 350,
        y: 160,
        w: 40,
        h: 40,
        type: 'DIARY',
        name: 'Maya’s Diary Page 1',
        itemId: 'diary_1',
        collected: false
      },
      {
        id: 'door_to_corridor1f',
        x: 410,
        y: 650,
        w: 80,
        h: 30,
        type: 'DOOR',
        name: 'Heavy Corridor Door',
        targetRoom: 'corridor_1f',
        targetX: 500,
        targetY: 80,
        requiredKeyId: 'key_reception',
        lockedMessage: 'Locked tightly! The lock requires the Reception Brass Key.',
        isUnlocked: false
      },
      {
        id: 'door_to_main_exit',
        x: 410,
        y: 20,
        w: 80,
        h: 30,
        type: 'DOOR',
        name: 'Main Entrance Foyer',
        targetRoom: 'main_exit',
        targetX: 450,
        targetY: 550,
        isUnlocked: true
      }
    ]
  },

  corridor_1f: {
    id: 'corridor_1f',
    name: 'Ground Floor Corridor',
    width: 1000,
    height: 750,
    walls: [
      { x: 0, y: 0, w: 1000, h: 20 },
      { x: 0, y: 730, w: 1000, h: 20 },
      { x: 0, y: 0, w: 20, h: 750 },
      { x: 980, y: 0, w: 20, h: 750 },
    ],
    furniture: [
      { x: 80, y: 300, w: 70, h: 140, color: '#1f2937', label: 'Tall Steel Cupboard', spriteType: 'cupboard' },
      { x: 850, y: 300, w: 70, h: 140, color: '#1f2937', label: 'Steel Cupboard', spriteType: 'cupboard' },
      { x: 400, y: 380, w: 180, h: 40, color: '#3d1616', label: 'Blood Trail', spriteType: 'blood' },
    ],
    lights: [
      { x: 250, y: 375, radius: 190, color: 'rgba(210, 230, 255, 0.3)', flicker: true },
      { x: 750, y: 375, radius: 190, color: 'rgba(210, 230, 255, 0.3)', flicker: true },
    ],
    objects: [
      {
        id: 'c1f_hiding_1',
        x: 80,
        y: 300,
        w: 70,
        h: 140,
        type: 'HIDING_SPOT',
        name: 'Tall Storage Cupboard'
      },
      {
        id: 'c1f_hiding_2',
        x: 850,
        y: 300,
        w: 70,
        h: 140,
        type: 'HIDING_SPOT',
        name: 'Locker Cupboard'
      },
      {
        id: 'door_c1f_to_reception',
        x: 460,
        y: 20,
        w: 80,
        h: 30,
        type: 'DOOR',
        name: 'Door to Reception',
        targetRoom: 'reception',
        targetX: 450,
        targetY: 600,
        isUnlocked: true
      },
      {
        id: 'door_c1f_to_r101',
        x: 150,
        y: 20,
        w: 70,
        h: 30,
        type: 'DOOR',
        name: 'Room 101 Door',
        targetRoom: 'room_101',
        targetX: 450,
        targetY: 580,
        isUnlocked: true
      },
      {
        id: 'door_c1f_to_r102',
        x: 780,
        y: 20,
        w: 70,
        h: 30,
        type: 'DOOR',
        name: 'Room 102 Door',
        targetRoom: 'room_102',
        targetX: 450,
        targetY: 580,
        isUnlocked: true
      },
      {
        id: 'door_c1f_to_kitchen',
        x: 150,
        y: 700,
        w: 70,
        h: 30,
        type: 'DOOR',
        name: 'Abandoned Kitchen Door',
        targetRoom: 'kitchen',
        targetX: 450,
        targetY: 80,
        isUnlocked: true
      },
      {
        id: 'door_c1f_to_storage',
        x: 460,
        y: 700,
        w: 80,
        h: 30,
        type: 'DOOR',
        name: 'Storage Room Door',
        targetRoom: 'storage',
        targetX: 450,
        targetY: 80,
        requiredKeyId: 'key_room101',
        lockedMessage: 'Locked! Requires Room 101 Ward Key.',
        isUnlocked: false
      },
      {
        id: 'door_c1f_to_staircase',
        x: 780,
        y: 700,
        w: 70,
        h: 30,
        type: 'DOOR',
        name: 'Staircase Access Door',
        targetRoom: 'staircase',
        targetX: 450,
        targetY: 80,
        requiredKeyId: 'key_kitchen',
        lockedMessage: 'Heavy iron padlock! Requires the Kitchen Pantry Key.',
        isUnlocked: false
      }
    ]
  },

  room_101: {
    id: 'room_101',
    name: 'Room 101',
    width: 800,
    height: 650,
    walls: [
      { x: 0, y: 0, w: 800, h: 20 },
      { x: 0, y: 630, w: 800, h: 20 },
      { x: 0, y: 0, w: 20, h: 650 },
      { x: 780, y: 0, w: 20, h: 650 },
    ],
    furniture: [
      { x: 80, y: 80, w: 160, h: 90, color: '#382218', label: 'Bunk Bed 1', spriteType: 'bunk' },
      { x: 80, y: 230, w: 160, h: 90, color: '#382218', label: 'Bunk Bed 2', spriteType: 'bunk' },
      { x: 550, y: 80, w: 160, h: 70, color: '#271911', label: 'Study Desk', spriteType: 'desk' },
      { x: 620, y: 220, w: 80, h: 120, color: '#1e293b', label: 'Locked Locker', spriteType: 'cupboard' },
    ],
    lights: [
      { x: 400, y: 200, radius: 160, color: 'rgba(255, 210, 180, 0.25)', flicker: true }
    ],
    objects: [
      {
        id: 'r101_locker_puzzle',
        x: 620,
        y: 220,
        w: 80,
        h: 120,
        type: 'PUZZLE',
        puzzleId: 'LOCKER_CODE',
        name: 'Electronic Safe Locker',
        dialogue: [
          'A digital keypad blinks: "ENTER 4-DIGIT CODE".',
          'Hint carved above: "When the hands met at the dark hour, 48 minutes lingered..."'
        ]
      },
      {
        id: 'r101_key2',
        x: 635,
        y: 240,
        w: 40,
        h: 40,
        type: 'KEY',
        name: 'Room 101 Ward Key (Key 2)',
        itemId: 'key_room101',
        collected: false
      },
      {
        id: 'r101_medkit',
        x: 580,
        y: 100,
        w: 40,
        h: 40,
        type: 'MEDKIT',
        name: 'First Aid Kit',
        itemId: 'medkit_1',
        collected: false
      },
      {
        id: 'door_r101_to_c1f',
        x: 410,
        y: 610,
        w: 80,
        h: 20,
        type: 'DOOR',
        name: 'Exit to Corridor',
        targetRoom: 'corridor_1f',
        targetX: 180,
        targetY: 80,
        isUnlocked: true
      }
    ]
  },

  room_102: {
    id: 'room_102',
    name: 'Room 102',
    width: 800,
    height: 650,
    walls: [
      { x: 0, y: 0, w: 800, h: 20 },
      { x: 0, y: 630, w: 800, h: 20 },
      { x: 0, y: 0, w: 20, h: 650 },
      { x: 780, y: 0, w: 20, h: 650 },
    ],
    furniture: [
      { x: 80, y: 90, w: 140, h: 80, color: '#311e13', label: 'Dusty Bed', spriteType: 'bed' },
      { x: 500, y: 80, w: 220, h: 80, color: '#271911', label: 'Photo Display Desk', spriteType: 'desk' },
      { x: 80, y: 350, w: 70, h: 140, color: '#1e293b', label: 'Cupboard (Hide)', spriteType: 'cupboard' },
    ],
    lights: [
      { x: 600, y: 150, radius: 150, color: 'rgba(230, 200, 160, 0.3)' }
    ],
    objects: [
      {
        id: 'r102_photo_puzzle',
        x: 500,
        y: 80,
        w: 220,
        h: 80,
        type: 'PUZZLE',
        puzzleId: 'PHOTO_ARRANGE',
        name: 'Archival Photo Board',
        dialogue: [
          'Four vintage photographs lie jumbled on the desk.',
          'They document the hostel’s tragic history. Arrange them chronologically to reveal the hidden compartment!'
        ]
      },
      {
        id: 'r102_diary2',
        x: 120,
        y: 110,
        w: 40,
        h: 40,
        type: 'DIARY',
        name: 'Maya’s Diary Page 2',
        itemId: 'diary_2',
        collected: false
      },
      {
        id: 'r102_battery',
        x: 680,
        y: 100,
        w: 40,
        h: 40,
        type: 'BATTERY',
        name: 'Flashlight Battery',
        itemId: 'battery_2',
        collected: false
      },
      {
        id: 'r102_hiding',
        x: 80,
        y: 350,
        w: 70,
        h: 140,
        type: 'HIDING_SPOT',
        name: 'Room 102 Cupboard'
      },
      {
        id: 'door_r102_to_c1f',
        x: 410,
        y: 610,
        w: 80,
        h: 20,
        type: 'DOOR',
        name: 'Exit to Corridor',
        targetRoom: 'corridor_1f',
        targetX: 810,
        targetY: 80,
        isUnlocked: true
      }
    ]
  },

  kitchen: {
    id: 'kitchen',
    name: 'Abandoned Kitchen',
    width: 900,
    height: 700,
    walls: [
      { x: 0, y: 0, w: 900, h: 20 },
      { x: 0, y: 680, w: 900, h: 20 },
      { x: 0, y: 0, w: 20, h: 700 },
      { x: 880, y: 0, w: 20, h: 700 },
    ],
    furniture: [
      { x: 80, y: 80, w: 280, h: 80, color: '#374151', label: 'Rusted Gas Stoves', spriteType: 'stove' },
      { x: 500, y: 80, w: 280, h: 70, color: '#27303f', label: 'Steel Prep Island', spriteType: 'desk' },
      { x: 80, y: 450, w: 100, h: 140, color: '#1f2937', label: 'Cold Pantry Freezer', spriteType: 'cupboard' },
      { x: 780, y: 280, w: 80, h: 120, color: '#4b5563', label: 'Circuit Breaker Box', spriteType: 'shelf' },
    ],
    lights: [
      { x: 820, y: 340, radius: 140, color: 'rgba(255, 100, 100, 0.35)', flicker: true },
      { x: 300, y: 350, radius: 180, color: 'rgba(180, 240, 200, 0.2)' }
    ],
    objects: [
      {
        id: 'kitchen_breaker_puzzle',
        x: 780,
        y: 280,
        w: 80,
        h: 120,
        type: 'PUZZLE',
        puzzleId: 'CIRCUIT_BREAKER',
        name: 'Main Electrical Breaker Board',
        dialogue: [
          'High voltage breaker levers spark ominously.',
          'Maya noted the wiring bypass sequence in her journal: Blue, Red, Green, Yellow, White.'
        ]
      },
      {
        id: 'kitchen_key3',
        x: 800,
        y: 380,
        w: 40,
        h: 40,
        type: 'KEY',
        name: 'Kitchen Pantry Key (Key 3)',
        itemId: 'key_kitchen',
        collected: false
      },
      {
        id: 'kitchen_diary3',
        x: 120,
        y: 100,
        w: 40,
        h: 40,
        type: 'DIARY',
        name: 'Maya’s Diary Page 3',
        itemId: 'diary_3',
        collected: false
      },
      {
        id: 'kitchen_hiding',
        x: 80,
        y: 450,
        w: 100,
        h: 140,
        type: 'HIDING_SPOT',
        name: 'Walk-in Cold Pantry'
      },
      {
        id: 'door_kitchen_to_c1f',
        x: 410,
        y: 20,
        w: 80,
        h: 20,
        type: 'DOOR',
        name: 'Exit to Corridor',
        targetRoom: 'corridor_1f',
        targetX: 180,
        targetY: 670,
        isUnlocked: true
      }
    ]
  },

  storage: {
    id: 'storage',
    name: 'Storage Room',
    width: 800,
    height: 650,
    walls: [
      { x: 0, y: 0, w: 800, h: 20 },
      { x: 0, y: 630, w: 800, h: 20 },
      { x: 0, y: 0, w: 20, h: 650 },
      { x: 780, y: 0, w: 20, h: 650 },
    ],
    furniture: [
      { x: 80, y: 80, w: 260, h: 70, color: '#33271d', label: 'Shelves of Dusty Records', spriteType: 'shelf' },
      { x: 450, y: 80, w: 220, h: 70, color: '#33271d', label: 'Wooden Crates', spriteType: 'shelf' },
      { x: 80, y: 380, w: 70, h: 140, color: '#1e293b', label: 'Janitor Locker', spriteType: 'cupboard' },
    ],
    lights: [
      { x: 400, y: 250, radius: 140, color: 'rgba(240, 240, 200, 0.25)', flicker: true }
    ],
    objects: [
      {
        id: 'storage_ledger_puzzle',
        x: 120,
        y: 90,
        w: 180,
        h: 60,
        type: 'PUZZLE',
        puzzleId: 'DOCUMENT_CIPHER',
        name: 'Audit File & Cipher Safe',
        dialogue: [
          'An old hostel audit ledger lies under a layer of grime.',
          'Shine your UV light to decode the encrypted figures and retrieve the confidential reports!'
        ]
      },
      {
        id: 'storage_doc',
        x: 180,
        y: 90,
        w: 40,
        h: 40,
        type: 'NOTE',
        name: 'State Inspection Audit',
        itemId: 'doc_inspection',
        collected: false
      },
      {
        id: 'storage_battery',
        x: 520,
        y: 100,
        w: 40,
        h: 40,
        type: 'BATTERY',
        name: 'Flashlight Battery',
        itemId: 'battery_3',
        collected: false
      },
      {
        id: 'storage_hiding',
        x: 80,
        y: 380,
        w: 70,
        h: 140,
        type: 'HIDING_SPOT',
        name: 'Janitor Locker'
      },
      {
        id: 'door_storage_to_c1f',
        x: 410,
        y: 20,
        w: 80,
        h: 20,
        type: 'DOOR',
        name: 'Exit to Corridor',
        targetRoom: 'corridor_1f',
        targetX: 500,
        targetY: 670,
        isUnlocked: true
      }
    ]
  },

  staircase: {
    id: 'staircase',
    name: 'Central Staircase',
    width: 800,
    height: 700,
    walls: [
      { x: 0, y: 0, w: 800, h: 20 },
      { x: 0, y: 680, w: 800, h: 20 },
      { x: 0, y: 0, w: 20, h: 700 },
      { x: 780, y: 0, w: 20, h: 700 },
    ],
    furniture: [
      { x: 280, y: 200, w: 240, h: 240, color: '#1e1b24', label: 'Grand Spiral Stairwell', spriteType: 'shelf' },
      { x: 80, y: 250, w: 80, h: 140, color: '#161922', label: 'Under-Stairs Alcove', spriteType: 'cupboard' }
    ],
    lights: [
      { x: 400, y: 320, radius: 180, color: 'rgba(160, 200, 240, 0.25)', flicker: true }
    ],
    objects: [
      {
        id: 'stair_hiding',
        x: 80,
        y: 250,
        w: 80,
        h: 140,
        type: 'HIDING_SPOT',
        name: 'Under-Stairs Alcove'
      },
      {
        id: 'door_stair_to_c1f',
        x: 410,
        y: 20,
        w: 80,
        h: 20,
        type: 'DOOR',
        name: 'Door to Ground Floor Corridor',
        targetRoom: 'corridor_1f',
        targetX: 810,
        targetY: 670,
        isUnlocked: true
      },
      {
        id: 'door_stair_to_c2f',
        x: 740,
        y: 320,
        w: 30,
        h: 80,
        type: 'DOOR',
        name: 'Stairs Up to 2nd Floor',
        targetRoom: 'corridor_2f',
        targetX: 80,
        targetY: 350,
        isUnlocked: true
      },
      {
        id: 'door_stair_to_basement',
        x: 410,
        y: 650,
        w: 80,
        h: 20,
        type: 'DOOR',
        name: 'Heavy Iron Door Down to Basement',
        targetRoom: 'basement',
        targetX: 450,
        targetY: 80,
        isUnlocked: true
      }
    ]
  },

  corridor_2f: {
    id: 'corridor_2f',
    name: 'Second Floor Corridor',
    width: 900,
    height: 650,
    walls: [
      { x: 0, y: 0, w: 900, h: 20 },
      { x: 0, y: 630, w: 900, h: 20 },
      { x: 0, y: 0, w: 20, h: 650 },
      { x: 880, y: 0, w: 20, h: 650 },
    ],
    furniture: [
      { x: 100, y: 80, w: 120, h: 20, color: '#38bdf8', label: 'Rain-streaked Window', spriteType: 'shelf' },
      { x: 400, y: 80, w: 120, h: 20, color: '#38bdf8', label: 'Broken Window Glass', spriteType: 'shelf' },
      { x: 700, y: 80, w: 120, h: 20, color: '#38bdf8', label: 'Barred Window', spriteType: 'shelf' },
      { x: 750, y: 350, w: 70, h: 140, color: '#1e293b', label: '2F Linen Cupboard', spriteType: 'cupboard' },
    ],
    lights: [
      { x: 250, y: 300, radius: 170, color: 'rgba(147, 197, 253, 0.25)', flicker: true },
      { x: 650, y: 300, radius: 170, color: 'rgba(147, 197, 253, 0.25)', flicker: true }
    ],
    objects: [
      {
        id: 'c2f_hiding',
        x: 750,
        y: 350,
        w: 70,
        h: 140,
        type: 'HIDING_SPOT',
        name: 'Linen Closet'
      },
      {
        id: 'c2f_medkit',
        x: 430,
        y: 110,
        w: 40,
        h: 40,
        type: 'MEDKIT',
        name: 'Emergency Medkit',
        itemId: 'medkit_2',
        collected: false
      },
      {
        id: 'door_c2f_to_stair',
        x: 30,
        y: 320,
        w: 20,
        h: 80,
        type: 'DOOR',
        name: 'Door to Staircase',
        targetRoom: 'staircase',
        targetX: 700,
        targetY: 350,
        isUnlocked: true
      },
      {
        id: 'door_c2f_to_warden',
        x: 840,
        y: 320,
        w: 20,
        h: 80,
        type: 'DOOR',
        name: 'Warden’s Office Suite',
        targetRoom: 'warden_office',
        targetX: 80,
        targetY: 350,
        isUnlocked: true
      }
    ]
  },

  warden_office: {
    id: 'warden_office',
    name: 'Warden’s Office',
    width: 900,
    height: 700,
    walls: [
      { x: 0, y: 0, w: 900, h: 20 },
      { x: 0, y: 680, w: 900, h: 20 },
      { x: 0, y: 0, w: 20, h: 700 },
      { x: 880, y: 0, w: 20, h: 700 },
    ],
    furniture: [
      { x: 350, y: 150, w: 260, h: 100, color: '#30180d', label: 'Warden Sterling’s Desk', spriteType: 'desk' },
      { x: 680, y: 80, w: 180, h: 70, color: '#251610', label: 'Antique Bookcase', spriteType: 'shelf' },
      { x: 80, y: 80, w: 100, h: 140, color: '#1a1f29', label: 'Reinforced Vault Safe', spriteType: 'cupboard' },
    ],
    lights: [
      { x: 480, y: 200, radius: 180, color: 'rgba(255, 210, 150, 0.35)', flicker: true },
      { x: 770, y: 120, radius: 130, color: 'rgba(220, 180, 100, 0.25)' }
    ],
    objects: [
      {
        id: 'warden_bookshelf_puzzle',
        x: 680,
        y: 80,
        w: 180,
        h: 70,
        type: 'PUZZLE',
        puzzleId: 'BOOKSHELF',
        name: 'Sterling’s Secret Mechanism Bookcase',
        dialogue: [
          'The gilded books can be rotated to trigger a mechanical lock.',
          'State Audit Document hint: "The order aligns with SUN, OWLS, and the KEY."'
        ]
      },
      {
        id: 'warden_key5',
        x: 100,
        y: 110,
        w: 50,
        h: 50,
        type: 'KEY',
        name: 'Warden’s Master Skeleton Key (Key 5)',
        itemId: 'key_master',
        collected: false
      },
      {
        id: 'warden_diary4',
        x: 420,
        y: 180,
        w: 40,
        h: 40,
        type: 'DIARY',
        name: 'Maya’s Diary Page 4',
        itemId: 'diary_4',
        collected: false
      },
      {
        id: 'door_warden_to_c2f',
        x: 30,
        y: 320,
        w: 20,
        h: 80,
        type: 'DOOR',
        name: 'Exit to Corridor 2F',
        targetRoom: 'corridor_2f',
        targetX: 800,
        targetY: 350,
        isUnlocked: true
      }
    ]
  },

  basement: {
    id: 'basement',
    name: 'Sub-Basement Vault',
    width: 900,
    height: 750,
    walls: [
      { x: 0, y: 0, w: 900, h: 20 },
      { x: 0, y: 730, w: 900, h: 20 },
      { x: 0, y: 0, w: 20, h: 750 },
      { x: 880, y: 0, w: 20, h: 750 },
    ],
    furniture: [
      { x: 80, y: 80, w: 720, h: 30, color: '#334155', label: 'Rusted Steam Pipes', spriteType: 'pipes' },
      { x: 350, y: 400, w: 200, h: 120, color: '#1e141a', label: 'Maya Lin Altar & Memorial', spriteType: 'desk' },
      { x: 80, y: 450, w: 100, h: 140, color: '#161922', label: 'Furnace Corner (Hide)', spriteType: 'cupboard' },
      { x: 300, y: 250, w: 300, h: 80, color: '#1c1917', label: 'Flooded Murky Water', spriteType: 'blood' },
    ],
    lights: [
      { x: 450, y: 450, radius: 190, color: 'rgba(239, 68, 68, 0.35)', flicker: true },
      { x: 150, y: 200, radius: 130, color: 'rgba(56, 189, 248, 0.2)' }
    ],
    objects: [
      {
        id: 'basement_key4',
        x: 430,
        y: 440,
        w: 50,
        h: 50,
        type: 'KEY',
        name: 'Sub-Basement Iron Key (Key 4)',
        itemId: 'key_basement',
        collected: false
      },
      {
        id: 'basement_diary5',
        x: 480,
        y: 440,
        w: 40,
        h: 40,
        type: 'DIARY',
        name: 'Maya’s Final Confession (Page 5)',
        itemId: 'diary_5',
        collected: false
      },
      {
        id: 'basement_hiding',
        x: 80,
        y: 450,
        w: 100,
        h: 140,
        type: 'HIDING_SPOT',
        name: 'Furnace Crawlspace'
      },
      {
        id: 'door_basement_to_stair',
        x: 410,
        y: 20,
        w: 80,
        h: 20,
        type: 'DOOR',
        name: 'Stairs Up to Staircase',
        targetRoom: 'staircase',
        targetX: 450,
        targetY: 600,
        isUnlocked: true
      }
    ]
  },

  main_exit: {
    id: 'main_exit',
    name: 'Grand Entrance & Gates',
    width: 900,
    height: 700,
    walls: [
      { x: 0, y: 0, w: 900, h: 20 },
      { x: 0, y: 680, w: 900, h: 20 },
      { x: 0, y: 0, w: 20, h: 700 },
      { x: 880, y: 0, w: 20, h: 700 },
    ],
    furniture: [
      { x: 300, y: 40, w: 300, h: 90, color: '#451a03', label: 'Grand Iron Padlocked Double Gates', spriteType: 'exit_gate' },
      { x: 100, y: 200, w: 80, h: 200, color: '#1f2937', label: 'Marble Pillars', spriteType: 'shelf' },
      { x: 720, y: 200, w: 80, h: 200, color: '#1f2937', label: 'Marble Pillars', spriteType: 'shelf' },
    ],
    lights: [
      { x: 450, y: 150, radius: 220, color: 'rgba(254, 240, 138, 0.35)', flicker: true },
      { x: 450, y: 450, radius: 180, color: 'rgba(216, 180, 254, 0.25)' }
    ],
    objects: [
      {
        id: 'exit_grand_door',
        x: 350,
        y: 50,
        w: 200,
        h: 80,
        type: 'DOOR',
        name: 'The 5-Key Grand Exit Gate',
        dialogue: [
          'The colossal iron doors are barred with 5 separate heavy padlock chains.',
          'Insert all 5 keys: Reception, Room 101, Kitchen, Basement, and Warden\'s Master Key!'
        ]
      },
      {
        id: 'door_exit_to_reception',
        x: 410,
        y: 650,
        w: 80,
        h: 20,
        type: 'DOOR',
        name: 'Back to Reception',
        targetRoom: 'reception',
        targetX: 450,
        targetY: 80,
        isUnlocked: true
      }
    ]
  }
};
