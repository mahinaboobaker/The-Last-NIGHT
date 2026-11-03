export type GameScreen = 
  | 'MAIN_MENU'
  | 'PLAYING'
  | 'PAUSED'
  | 'HOW_TO_PLAY'
  | 'SETTINGS'
  | 'CREDITS'
  | 'GAME_OVER'
  | 'ENDING';

export type ChapterId = 1 | 2 | 3 | 4 | 5;

export interface Item {
  id: string;
  name: string;
  category: 'KEY' | 'DOCUMENT' | 'DIARY' | 'SUPPLY' | 'PHOTO';
  description: string;
  icon: string;
  loreText?: string;
  usable?: boolean;
}

export type RoomId = 
  | 'reception'
  | 'corridor_1f'
  | 'room_101'
  | 'room_102'
  | 'kitchen'
  | 'storage'
  | 'staircase'
  | 'corridor_2f'
  | 'warden_office'
  | 'basement'
  | 'main_exit';

export interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface InteractiveObject {
  id: string;
  x: number;
  y: number;
  w: number;
  h: number;
  type: 
    | 'DOOR' 
    | 'KEY' 
    | 'NOTE' 
    | 'DIARY' 
    | 'BATTERY' 
    | 'MEDKIT' 
    | 'HIDING_SPOT' 
    | 'PUZZLE' 
    | 'INSPECTABLE';
  name: string;
  targetRoom?: RoomId;
  targetX?: number;
  targetY?: number;
  requiredKeyId?: string;
  lockedMessage?: string;
  isUnlocked?: boolean;
  collected?: boolean;
  puzzleId?: 'LOCKER_CODE' | 'PHOTO_ARRANGE' | 'DOCUMENT_CIPHER' | 'CIRCUIT_BREAKER' | 'BOOKSHELF';
  dialogue?: string[];
  itemId?: string;
}

export interface RoomData {
  id: RoomId;
  name: string;
  width: number;
  height: number;
  walls: Rect[];
  furniture: Array<{
    x: number;
    y: number;
    w: number;
    h: number;
    color: string;
    label?: string;
    spriteType?: 'desk' | 'bed' | 'bunk' | 'cupboard' | 'shelf' | 'stove' | 'blood' | 'pipes' | 'exit_gate';
  }>;
  lights: Array<{
    x: number;
    y: number;
    radius: number;
    color: string;
    flicker?: boolean;
  }>;
  objects: InteractiveObject[];
}

export interface PlayerState {
  x: number;
  y: number;
  direction: 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';
  angle: number; // in radians
  isMoving: boolean;
  health: number; // 0 to 100
  maxHealth: number;
  flashlightOn: boolean;
  battery: number; // 0 to 100
  isHiding: boolean;
  currentHidingSpotId: string | null;
  speed: number;
}

export interface GhostState {
  x: number;
  y: number;
  room: RoomId;
  targetX: number;
  targetY: number;
  active: boolean;
  isChasing: boolean;
  detectionDistance: number;
  speed: number;
  patrolTimer: number;
  patrolIndex: number;
  alpha: number;
}

export type EndingType = 'ESCAPE' | 'TRUTH' | 'TRAPPED';

export interface GameSaveData {
  chapter: ChapterId;
  currentRoom: RoomId;
  player: {
    x: number;
    y: number;
    health: number;
    battery: number;
    flashlightOn: boolean;
  };
  inventory: Item[];
  collectedKeys: string[];
  collectedDiaries: number[];
  unlockedDoors: string[];
  solvedPuzzles: string[];
  visitedRooms: string[];
  ghostActive: boolean;
  timestamp: number;
}
