import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  GameScreen, 
  ChapterId, 
  RoomId, 
  PlayerState, 
  Item, 
  EndingType, 
  InteractiveObject 
} from './types/game';
import { ROOMS, ALL_ITEMS } from './game/mapData';
import { GhostController } from './game/ghostAI';
import { GameRenderer } from './game/renderer';
import { soundEngine } from './services/audio';
import { storageService } from './services/storage';

import { MainMenu } from './components/MainMenu';
import { GameHUD } from './components/GameHUD';
import { InventoryModal } from './components/InventoryModal';
import { PuzzleModal } from './components/PuzzleModal';
import { DialogueModal } from './components/DialogueModal';
import { GameOverModal } from './components/GameOverModal';
import { EndingScreen } from './components/EndingScreen';
import { SettingsModal } from './components/SettingsModal';
import { HowToPlayModal } from './components/HowToPlayModal';
import { CreditsModal } from './components/CreditsModal';
import { PauseModal } from './components/PauseModal';
import { KeyGuideModal } from './components/KeyGuideModal';

export default function App() {
  // Screen state
  const [screen, setScreen] = useState<GameScreen>('MAIN_MENU');
  const [endingType, setEndingType] = useState<EndingType>('ESCAPE');

  // Game Progress State
  const [chapter, setChapter] = useState<ChapterId>(1);
  const [currentRoomId, setCurrentRoomId] = useState<RoomId>('reception');
  const [inventory, setInventory] = useState<Item[]>([]);
  const [collectedKeys, setCollectedKeys] = useState<string[]>([]);
  const [collectedDiaries, setCollectedDiaries] = useState<number[]>([]);
  const [unlockedDoors, setUnlockedDoors] = useState<string[]>([]);
  const [solvedPuzzles, setSolvedPuzzles] = useState<string[]>([]);

  // Modals & UI States
  const [showInventory, setShowInventory] = useState(false);
  const [showKeyGuide, setShowKeyGuide] = useState(false);
  const [activePuzzle, setActivePuzzle] = useState<'LOCKER_CODE' | 'PHOTO_ARRANGE' | 'DOCUMENT_CIPHER' | 'CIRCUIT_BREAKER' | 'BOOKSHELF' | null>(null);
  const [dialogueData, setDialogueData] = useState<{ title: string; lines: string[] } | null>(null);
  const [interactionPrompt, setInteractionPrompt] = useState<string | null>(null);
  const [nearbyObject, setNearbyObject] = useState<InteractiveObject | null>(null);
  const [proximityIntensity, setProximityIntensity] = useState(0);

  // Canvas & Game Loop
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rendererRef = useRef<GameRenderer>(new GameRenderer());
  const ghostCtrlRef = useRef<GhostController>(new GhostController());
  const targetMovePos = useRef<{ x: number; y: number } | null>(null);

  // Player physics state
  const playerRef = useRef<PlayerState>({
    x: 450,
    y: 440,
    direction: 'DOWN',
    angle: Math.PI / 2,
    isMoving: false,
    health: 100,
    maxHealth: 100,
    flashlightOn: true,
    battery: 100,
    isHiding: false,
    currentHidingSpotId: null,
    speed: 3.4
  });

  // Re-render HUD trigger state
  const [playerHud, setPlayerHud] = useState({
    health: 100,
    battery: 100,
    flashlightOn: true,
    isHiding: false
  });

  // Keyboard keys pressed tracker
  const keysPressed = useRef<Record<string, boolean>>({});
  const mobileDirection = useRef<'UP' | 'DOWN' | 'LEFT' | 'RIGHT' | null>(null);

  // Initialize or start new game
  const startNewGame = useCallback(() => {
    storageService.clearSave();
    setChapter(1);
    setCurrentRoomId('reception');
    setInventory([]);
    setCollectedKeys([]);
    setCollectedDiaries([]);
    setUnlockedDoors([]);
    setSolvedPuzzles([]);
    targetMovePos.current = null;

    playerRef.current = {
      x: 450,
      y: 440,
      direction: 'DOWN',
      angle: Math.PI / 2,
      isMoving: false,
      health: 100,
      maxHealth: 100,
      flashlightOn: true,
      battery: 100,
      isHiding: false,
      currentHidingSpotId: null,
      speed: 3.4
    };

    setPlayerHud({
      health: 100,
      battery: 100,
      flashlightOn: true,
      isHiding: false
    });

    ghostCtrlRef.current.reset('corridor_1f');
    setScreen('PLAYING');
    soundEngine.startAmbient();

    // Opening story dialogue
    setTimeout(() => {
      setDialogueData({
        title: 'ST. JUDE’S HOSTEL · 12:00 AM',
        lines: [
          'The front entrance slammed shut behind me with a sickening thud. The iron lock engaged on its own.',
          'The old grandfather clock in reception chimed twelve times, and then stopped dead.',
          'I came back only to retrieve my forgotten thesis notebook... but something sinister has awakened.',
          'I need to search the reception desk and find the key to get out of here.'
        ]
      });
    }, 400);
  }, []);

  // Continue saved game
  const continueGame = useCallback(() => {
    const save = storageService.loadGame();
    if (!save) {
      startNewGame();
      return;
    }

    setChapter(save.chapter);
    setCurrentRoomId(save.currentRoom);
    setInventory(save.inventory);
    setCollectedKeys(save.collectedKeys);
    setCollectedDiaries(save.collectedDiaries);
    setUnlockedDoors(save.unlockedDoors);
    setSolvedPuzzles(save.solvedPuzzles);

    playerRef.current = {
      ...playerRef.current,
      x: save.player.x,
      y: save.player.y,
      health: save.player.health,
      battery: save.player.battery,
      flashlightOn: save.player.flashlightOn,
      isHiding: false,
      currentHidingSpotId: null
    };

    setPlayerHud({
      health: save.player.health,
      battery: save.player.battery,
      flashlightOn: save.player.flashlightOn,
      isHiding: false
    });

    ghostCtrlRef.current.reset('corridor_1f');
    setScreen('PLAYING');
    soundEngine.startAmbient();
  }, [startNewGame]);

  // Save current game state
  const saveCurrentGame = useCallback(() => {
    storageService.saveGame({
      chapter,
      currentRoom: currentRoomId,
      player: {
        x: playerRef.current.x,
        y: playerRef.current.y,
        health: playerRef.current.health,
        battery: playerRef.current.battery,
        flashlightOn: playerRef.current.flashlightOn
      },
      inventory,
      collectedKeys,
      collectedDiaries,
      unlockedDoors,
      solvedPuzzles,
      visitedRooms: [currentRoomId],
      ghostActive: ghostCtrlRef.current.getGhost().active,
      timestamp: Date.now()
    });
  }, [chapter, currentRoomId, inventory, collectedKeys, collectedDiaries, unlockedDoors, solvedPuzzles]);

  // Flashlight toggle
  const toggleFlashlight = useCallback(() => {
    soundEngine.playFlashlightClick();
    if (playerRef.current.battery <= 0) {
      return;
    }
    const nextState = !playerRef.current.flashlightOn;
    playerRef.current.flashlightOn = nextState;
    setPlayerHud(prev => ({ ...prev, flashlightOn: nextState }));
  }, []);

  // Use supply item
  const handleUseItem = useCallback((item: Item) => {
    if (item.category !== 'SUPPLY') return;

    if (item.id.includes('battery')) {
      soundEngine.playItemPickup();
      playerRef.current.battery = Math.min(100, playerRef.current.battery + 45);
      setPlayerHud(prev => ({ ...prev, battery: playerRef.current.battery }));
      setInventory(prev => prev.filter(i => i.id !== item.id));
    } else if (item.id.includes('medkit')) {
      soundEngine.playItemPickup();
      playerRef.current.health = Math.min(100, playerRef.current.health + 45);
      setPlayerHud(prev => ({ ...prev, health: playerRef.current.health }));
      setInventory(prev => prev.filter(i => i.id !== item.id));
    }
  }, []);

  // Solve a puzzle handler
  const handlePuzzleSolved = useCallback((puzzleId: string) => {
    setActivePuzzle(null);
    if (!solvedPuzzles.includes(puzzleId)) {
      setSolvedPuzzles(prev => [...prev, puzzleId]);
    }

    if (puzzleId === 'LOCKER_CODE') {
      // Pick up Key 2 & Diary 1 if not collected
      if (!collectedKeys.includes('key_room101')) {
        setCollectedKeys(prev => [...prev, 'key_room101']);
        setInventory(prev => [...prev, ALL_ITEMS.key_room101]);
        soundEngine.playItemPickup();
        setDialogueData({
          title: 'LOCKER UNLOCKED',
          lines: [
            'Click! The metal locker door swung open.',
            'Inside was the Room 101 Ward Key (Key 2)!',
            'You also found Maya Lin’s first diary page.'
          ]
        });
      }
    } else if (puzzleId === 'PHOTO_ARRANGE') {
      // Unlocks secret compartment in Room 102
      soundEngine.playItemPickup();
      setDialogueData({
        title: 'ARCHIVE SOLVED',
        lines: [
          'A hidden latch under the desk sprung open!',
          'You found Maya’s Diary Page 2 and a fresh industrial battery.'
        ]
      });
    } else if (puzzleId === 'DOCUMENT_CIPHER') {
      // Unlocks Storage safe
      soundEngine.playItemPickup();
      setDialogueData({
        title: 'STATE AUDIT REPORT REVEALED',
        lines: [
          'The numbers 3-9-4 opened the metal filing safe.',
          'The document reveals: Warden Sterling embezzled the students\' scholarship trust funds in 1994!',
          'A note indicates the bookshelf in the Warden’s office hides a secret chamber.'
        ]
      });
    } else if (puzzleId === 'CIRCUIT_BREAKER') {
      // Gives Kitchen Key 3
      if (!collectedKeys.includes('key_kitchen')) {
        setCollectedKeys(prev => [...prev, 'key_kitchen']);
        setInventory(prev => [...prev, ALL_ITEMS.key_kitchen]);
        soundEngine.playItemPickup();
        setDialogueData({
          title: 'POWER RESTORED',
          lines: [
            'BZZZZT! The breaker panel hummed to life, unlocking the kitchen pantry safe.',
            'Retrieved the Kitchen Pantry Key (Key 3)!',
            'This key unlocks the heavy padlock leading to the staircase.'
          ]
        });
      }
    } else if (puzzleId === 'BOOKSHELF') {
      // Gives Master Key 5 & safe reveal
      if (!collectedKeys.includes('key_master')) {
        setCollectedKeys(prev => [...prev, 'key_master']);
        setInventory(prev => [...prev, ALL_ITEMS.key_master]);
        soundEngine.playItemPickup();
        setDialogueData({
          title: 'SECRET VAULT OPENED',
          lines: [
            'The heavy oak bookcase slid aside with a grinding groan, exposing the Warden’s concealed wall vault.',
            'Inside rests the Warden’s Master Skeleton Key (Key 5)!',
            'This is the final key required for the grand hostel exit gates!'
          ]
        });
      }
    }

    saveCurrentGame();
  }, [collectedKeys, solvedPuzzles, saveCurrentGame]);

  // Collect Key Helper
  const handleCollectKey = useCallback((keyObj: InteractiveObject) => {
    if (!keyObj.itemId || keyObj.collected) return;
    const item = ALL_ITEMS[keyObj.itemId];
    if (item && !collectedKeys.includes(item.id)) {
      soundEngine.playItemPickup();
      keyObj.collected = true;
      setCollectedKeys(prev => [...prev, item.id]);
      setInventory(prev => [...prev, item]);

      if (item.id === 'key_reception' && chapter < 2) {
        setChapter(2);
      } else if (item.id === 'key_kitchen' && chapter < 4) {
        setChapter(4);
      } else if (item.id === 'key_master' && chapter < 5) {
        setChapter(5);
      }

      setDialogueData({
        title: `KEY ACQUIRED: ${item.name}`,
        lines: [
          item.description,
          item.loreText || 'Stored in your backpack. Check the Keys Guide for unlocking requirements.'
        ]
      });

      saveCurrentGame();
    }
  }, [collectedKeys, chapter, saveCurrentGame]);

  // Primary Interaction Handler [E]
  const handleInteract = useCallback(() => {
    // If player is hiding inside a cupboard
    if (playerRef.current.isHiding) {
      soundEngine.playCupboardHide(false);
      playerRef.current.isHiding = false;
      playerRef.current.currentHidingSpotId = null;
      setPlayerHud(prev => ({ ...prev, isHiding: false }));
      return;
    }

    if (!nearbyObject) return;

    if (nearbyObject.type === 'HIDING_SPOT') {
      soundEngine.playCupboardHide(true);
      playerRef.current.isHiding = true;
      playerRef.current.currentHidingSpotId = nearbyObject.id;
      setPlayerHud(prev => ({ ...prev, isHiding: true }));
      return;
    }

    if (nearbyObject.type === 'KEY') {
      handleCollectKey(nearbyObject);
      return;
    }

    if (nearbyObject.type === 'BATTERY' && nearbyObject.itemId) {
      const item = ALL_ITEMS[nearbyObject.itemId];
      if (item) {
        soundEngine.playItemPickup();
        nearbyObject.collected = true;
        playerRef.current.battery = Math.min(100, playerRef.current.battery + 45);
        setPlayerHud(prev => ({ ...prev, battery: playerRef.current.battery }));
        setInventory(prev => [...prev, item]);
        setDialogueData({
          title: 'COLLECTED: INDUSTRIAL BATTERY',
          lines: ['Restored +45% flashlight charge. Stored extra in backpack.']
        });
      }
      return;
    }

    if (nearbyObject.type === 'MEDKIT' && nearbyObject.itemId) {
      const item = ALL_ITEMS[nearbyObject.itemId];
      if (item) {
        soundEngine.playItemPickup();
        nearbyObject.collected = true;
        playerRef.current.health = Math.min(100, playerRef.current.health + 40);
        setPlayerHud(prev => ({ ...prev, health: playerRef.current.health }));
        setInventory(prev => [...prev, item]);
        setDialogueData({
          title: 'COLLECTED: FIRST AID KIT',
          lines: ['Applied antiseptic bandages. Health restored by +40.']
        });
      }
      return;
    }

    if (nearbyObject.type === 'DIARY' && nearbyObject.itemId) {
      const item = ALL_ITEMS[nearbyObject.itemId];
      if (item) {
        soundEngine.playItemPickup();
        nearbyObject.collected = true;
        const diaryIndex = parseInt(item.id.replace('diary_', ''), 10) || 1;
        if (!collectedDiaries.includes(diaryIndex)) {
          setCollectedDiaries(prev => [...prev, diaryIndex]);
        }
        setInventory(prev => (prev.some(i => i.id === item.id) ? prev : [...prev, item]));
        setDialogueData({
          title: item.name,
          lines: [
            item.loreText || 'An old torn piece of paper written in trembling ink.'
          ]
        });
      }
      return;
    }

    if (nearbyObject.type === 'PUZZLE' && nearbyObject.puzzleId) {
      soundEngine.playFootstep();
      setActivePuzzle(nearbyObject.puzzleId);
      return;
    }

    if (nearbyObject.type === 'DOOR') {
      // Check Grand Exit Door
      if (nearbyObject.id === 'exit_grand_door') {
        const requiredKeys = ['key_reception', 'key_room101', 'key_kitchen', 'key_basement', 'key_master'];
        const hasAllKeys = requiredKeys.every(k => collectedKeys.includes(k));

        if (hasAllKeys) {
          // Unlocks Grand Exit!
          soundEngine.playVictoryTheme();
          if (collectedDiaries.length >= 5) {
            setEndingType('TRUTH');
          } else {
            setEndingType('ESCAPE');
          }
          setScreen('ENDING');
        } else {
          soundEngine.playDoor(false);
          const missingCount = 5 - collectedKeys.length;
          setDialogueData({
            title: 'THE 5-KEY GRAND EXIT GATE',
            lines: [
              `The colossal gates require 5 special keys to release the heavy padlocks.`,
              `You currently possess ${collectedKeys.length} of 5 keys. ${missingCount} keys remain hidden across the hostel!`,
              `Search Reception, Room 101, Kitchen, Basement, and the Warden’s Office.`
            ]
          });
        }
        return;
      }

      // Standard Room Door
      if (nearbyObject.requiredKeyId && !unlockedDoors.includes(nearbyObject.id)) {
        if (collectedKeys.includes(nearbyObject.requiredKeyId)) {
          soundEngine.playDoor(true);
          setUnlockedDoors(prev => [...prev, nearbyObject.id]);
          nearbyObject.isUnlocked = true;
          setDialogueData({
            title: 'DOOR UNLOCKED',
            lines: ['The key turned smoothly in the old lock. Access granted!']
          });
        } else {
          soundEngine.playDoor(false);
          setDialogueData({
            title: 'DOOR LOCKED',
            lines: [nearbyObject.lockedMessage || 'Locked. You need a specific key to open this door.']
          });
          return;
        }
      }

      // Enter door
      if (nearbyObject.targetRoom) {
        soundEngine.playDoor(true);
        setCurrentRoomId(nearbyObject.targetRoom);
        if (nearbyObject.targetX !== undefined && nearbyObject.targetY !== undefined) {
          playerRef.current.x = nearbyObject.targetX;
          playerRef.current.y = nearbyObject.targetY;
        }

        // Advance to Chapter 3 when player reaches Kitchen or Staircase
        if ((nearbyObject.targetRoom === 'kitchen' || nearbyObject.targetRoom === 'staircase') && chapter < 3) {
          setChapter(3);
          rendererRef.current.triggerScreenShake(0.6);
          soundEngine.playJumpScare();
        }

        saveCurrentGame();
      }
      return;
    }

    if (nearbyObject.dialogue) {
      soundEngine.playFootstep();
      setDialogueData({
        title: nearbyObject.name,
        lines: nearbyObject.dialogue
      });
    }
  }, [nearbyObject, collectedKeys, collectedDiaries, unlockedDoors, chapter, saveCurrentGame]);

  // Setup Global Keyboard Listeners
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keysPressed.current[e.key.toLowerCase()] = true;

      if (e.key === 'Escape') {
        if (showInventory) setShowInventory(false);
        else if (activePuzzle) setActivePuzzle(null);
        else if (dialogueData) setDialogueData(null);
        else if (screen === 'PLAYING') setScreen('PAUSED');
        else if (screen === 'PAUSED') setScreen('PLAYING');
      }

      if (screen === 'PLAYING' && !showInventory && !activePuzzle && !dialogueData) {
        if (e.key.toLowerCase() === 'e') {
          handleInteract();
        }
        if (e.key.toLowerCase() === 'f') {
          toggleFlashlight();
        }
        if (e.key.toLowerCase() === 'i') {
          setShowInventory(prev => !prev);
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keysPressed.current[e.key.toLowerCase()] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [screen, showInventory, activePuzzle, dialogueData, showKeyGuide, handleInteract, toggleFlashlight]);

  // Canvas Mouse Move & Aim Handler
  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const clientX = e.clientX - rect.left;
    const clientY = e.clientY - rect.top;
    const camX = canvas.width / 2 - playerRef.current.x;
    const camY = canvas.height / 2 - playerRef.current.y;
    const worldX = clientX - camX;
    const worldY = clientY - camY;

    playerRef.current.angle = Math.atan2(worldY - playerRef.current.y, worldX - playerRef.current.x);
    keysPressed.current['mouseaim'] = true;
  };

  // Canvas Click to Move / Collect Handler
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (showInventory || activePuzzle || dialogueData || showKeyGuide) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const clientX = e.clientX - rect.left;
    const clientY = e.clientY - rect.top;
    const camX = canvas.width / 2 - playerRef.current.x;
    const camY = canvas.height / 2 - playerRef.current.y;
    const worldX = clientX - camX;
    const worldY = clientY - camY;

    // Check if clicked near an interactive object
    const room = ROOMS[currentRoomId];
    for (const obj of room.objects) {
      if (obj.collected) continue;
      const cx = obj.x + obj.w / 2;
      const cy = obj.y + obj.h / 2;
      const dist = Math.sqrt((worldX - cx) ** 2 + (worldY - cy) ** 2);
      if (dist < 50 || (worldX >= obj.x && worldX <= obj.x + obj.w && worldY >= obj.y && worldY <= obj.y + obj.h)) {
        // Player clicked directly on this object
        const distToPlayer = Math.sqrt((playerRef.current.x - cx) ** 2 + (playerRef.current.y - cy) ** 2);
        if (distToPlayer < 95) {
          setNearbyObject(obj);
          if (obj.type === 'KEY') {
            handleCollectKey(obj);
          } else {
            handleInteract();
          }
          return;
        } else {
          // Walk to this object
          targetMovePos.current = { x: cx, y: cy + 30 };
          return;
        }
      }
    }

    // Otherwise walk to clicked floor position
    targetMovePos.current = { x: worldX, y: worldY };
  };

  // Core Game Loop
  useEffect(() => {
    if (screen !== 'PLAYING') return;

    let animId: number;
    let lastTime = performance.now();
    let footstepCounter = 0;
    let batteryDrainTimer = 0;

    const gameLoop = (currentTime: number) => {
      const dt = Math.min(0.1, (currentTime - lastTime) / 1000);
      lastTime = currentTime;

      const room = ROOMS[currentRoomId];
      const player = playerRef.current;
      const ghost = ghostCtrlRef.current.getGhost();

      // Only move if not in modal and not hiding
      const modalOpen = Boolean(showInventory || activePuzzle || dialogueData);

      if (!modalOpen && !player.isHiding) {
        let moveX = 0;
        let moveY = 0;

        // Keyboard controls
        if (keysPressed.current['w'] || keysPressed.current['arrowup']) moveY -= 1;
        if (keysPressed.current['s'] || keysPressed.current['arrowdown']) moveY += 1;
        if (keysPressed.current['a'] || keysPressed.current['arrowleft']) moveX -= 1;
        if (keysPressed.current['d'] || keysPressed.current['arrowright']) moveX += 1;

        // Mobile touch controls
        if (mobileDirection.current === 'UP') moveY -= 1;
        if (mobileDirection.current === 'DOWN') moveY += 1;
        if (mobileDirection.current === 'LEFT') moveX -= 1;
        if (mobileDirection.current === 'RIGHT') moveX += 1;

        // Target move (click on floor / object)
        if (moveX !== 0 || moveY !== 0) {
          targetMovePos.current = null; // Keyboard takes over
        } else if (targetMovePos.current) {
          const tdx = targetMovePos.current.x - player.x;
          const tdy = targetMovePos.current.y - player.y;
          const tdist = Math.sqrt(tdx * tdx + tdy * tdy);
          if (tdist > 8) {
            moveX = tdx / tdist;
            moveY = tdy / tdist;
          } else {
            targetMovePos.current = null;
          }
        }

        if (moveX !== 0 || moveY !== 0) {
          const mag = Math.sqrt(moveX * moveX + moveY * moveY);
          const nx = (moveX / mag) * player.speed;
          const ny = (moveY / mag) * player.speed;

          // If no mouse aiming, angle follows movement direction
          if (!keysPressed.current['mouseaim']) {
            player.angle = Math.atan2(moveY, moveX);
          }

          // Solid obstacles ONLY - Never collide with blood stains or floor pipes!
          const solidObstacles = [
            ...room.walls,
            ...room.furniture.filter(f => f.spriteType !== 'blood' && f.spriteType !== 'pipes' && f.spriteType !== 'exit_gate')
          ];

          const playerRad = 11;
          const isBlocked = (px: number, py: number) => {
            if (px - playerRad < 22 || px + playerRad > room.width - 22) return true;
            if (py - playerRad < 22 || py + playerRad > room.height - 22) return true;
            for (const obs of solidObstacles) {
              if (
                px + playerRad > obs.x &&
                px - playerRad < obs.x + obs.w &&
                py + playerRad > obs.y &&
                py - playerRad < obs.y + obs.h
              ) {
                return true;
              }
            }
            return false;
          };

          let didMove = false;
          // Wall-slide along X
          if (!isBlocked(player.x + nx, player.y)) {
            player.x += nx;
            didMove = true;
          }
          // Wall-slide along Y
          if (!isBlocked(player.x, player.y + ny)) {
            player.y += ny;
            didMove = true;
          }

          player.isMoving = didMove;
          if (!didMove && targetMovePos.current) {
            targetMovePos.current = null; // Clear click target if obstructed
          }

          // Footstep audio
          if (didMove) {
            footstepCounter += dt;
            if (footstepCounter > 0.36) {
              footstepCounter = 0;
              soundEngine.playFootstep();
            }
          }
        } else {
          player.isMoving = false;
        }

        // Battery drain
        if (player.flashlightOn && player.battery > 0) {
          batteryDrainTimer += dt;
          if (batteryDrainTimer > 3.0) {
            batteryDrainTimer = 0;
            player.battery = Math.max(0, player.battery - 1);
            setPlayerHud(prev => ({ ...prev, battery: player.battery }));
            if (player.battery === 0) {
              player.flashlightOn = false;
              setPlayerHud(prev => ({ ...prev, flashlightOn: false }));
              soundEngine.playFlashlightClick();
            }
          }
        }

        // Check for nearby interactive objects & auto-collect
        let closestObj: InteractiveObject | null = null;
        let minDist = 95;

        room.objects.forEach(obj => {
          if (obj.collected) return;
          const cx = obj.x + obj.w / 2;
          const cy = obj.y + obj.h / 2;
          const dist = Math.sqrt((player.x - cx) ** 2 + (player.y - cy) ** 2);

          // AUTO-COLLECT KEY when walking over / close to it (< 44px)
          if (obj.type === 'KEY' && dist < 44) {
            handleCollectKey(obj);
            return;
          }

          if (dist < minDist) {
            minDist = dist;
            closestObj = obj;
          }
        });

        setNearbyObject(closestObj);

        if (closestObj) {
          const o = closestObj as InteractiveObject;
          if (o.type === 'HIDING_SPOT') setInteractionPrompt(`[E] Enter ${o.name} to Hide`);
          else if (o.type === 'KEY') setInteractionPrompt(`[E] Pick up ${o.name}`);
          else if (o.type === 'BATTERY') setInteractionPrompt(`[E] Take Flashlight Battery`);
          else if (o.type === 'MEDKIT') setInteractionPrompt(`[E] Take Medical Supplies`);
          else if (o.type === 'DIARY') setInteractionPrompt(`[E] Read Torn Diary Note`);
          else if (o.type === 'PUZZLE') setInteractionPrompt(`[E] Inspect ${o.name}`);
          else if (o.type === 'DOOR') setInteractionPrompt(`[E] Enter ${o.name}`);
          else setInteractionPrompt(`[E] Inspect ${o.name}`);
        } else {
          setInteractionPrompt(null);
        }
      }

      // Update Ghost AI
      const ghostResult = ghostCtrlRef.current.update(dt, player, currentRoomId, chapter);
      setProximityIntensity(ghostResult.proximity);
      soundEngine.updateHeartbeat(ghostResult.proximity);

      if (ghostResult.triggerJumpScare) {
        soundEngine.playJumpScare();
        rendererRef.current.triggerScreenShake(0.5);
      }

      if (ghostResult.didCatchPlayer && !player.isHiding) {
        // Player caught by ghost!
        player.health = 0;
        setPlayerHud(prev => ({ ...prev, health: 0 }));
        soundEngine.stopHeartbeat();
        soundEngine.playGameOverSound();
        setScreen('GAME_OVER');
        return;
      }

      // Render to Canvas
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          // Fit canvas resolution to window
          if (canvas.width !== window.innerWidth || canvas.height !== window.innerHeight) {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
          }

          // Camera follows player smoothly
          const camX = canvas.width / 2 - player.x;
          const camY = canvas.height / 2 - player.y;

          rendererRef.current.render(
            ctx,
            canvas.width,
            canvas.height,
            room,
            player,
            ghost,
            collectedKeys,
            ghostResult.flickerFlashlight,
            { x: camX, y: camY }
          );
        }
      }

      animId = requestAnimationFrame(gameLoop);
    };

    animId = requestAnimationFrame(gameLoop);

    return () => {
      cancelAnimationFrame(animId);
      soundEngine.stopHeartbeat();
    };
  }, [screen, currentRoomId, chapter, collectedKeys, showInventory, activePuzzle, dialogueData]);

  return (
    <div className="relative w-screen h-screen bg-black overflow-hidden font-sans select-none">
      {/* Main Menu Screen */}
      {screen === 'MAIN_MENU' && (
        <MainMenu
          onNewGame={startNewGame}
          onContinue={continueGame}
          onHowToPlay={() => setScreen('HOW_TO_PLAY')}
          onSettings={() => setScreen('SETTINGS')}
          onCredits={() => setScreen('CREDITS')}
        />
      )}

      {/* Active Game Canvas Viewport */}
      {screen === 'PLAYING' && (
        <>
          <canvas
            ref={canvasRef}
            onMouseMove={handleCanvasMouseMove}
            onClick={handleCanvasClick}
            className="absolute inset-0 block w-full h-full cursor-crosshair"
          />

          {/* HUD Overlay */}
          <GameHUD
            health={playerHud.health}
            maxHealth={100}
            battery={playerHud.battery}
            flashlightOn={playerHud.flashlightOn}
            chapter={chapter}
            keysCount={collectedKeys.length}
            currentRoomName={ROOMS[currentRoomId]?.name || 'Abandoned Wing'}
            isHiding={playerHud.isHiding}
            interactionPrompt={interactionPrompt}
            proximityIntensity={proximityIntensity}
            onToggleFlashlight={toggleFlashlight}
            onOpenInventory={() => setShowInventory(true)}
            onOpenKeyGuide={() => setShowKeyGuide(true)}
            onPause={() => setScreen('PAUSED')}
            onInteract={handleInteract}
            onMoveDirection={dir => {
              mobileDirection.current = dir;
            }}
          />

          {/* Five Keys Guide Modal */}
          {showKeyGuide && (
            <KeyGuideModal
              collectedKeys={collectedKeys}
              onClose={() => setShowKeyGuide(false)}
            />
          )}

          {/* Inventory Modal */}
          {showInventory && (
            <InventoryModal
              items={inventory}
              collectedKeys={collectedKeys}
              battery={playerHud.battery}
              health={playerHud.health}
              onUseItem={handleUseItem}
              onClose={() => setShowInventory(false)}
            />
          )}

          {/* Interactive Puzzle Modal */}
          {activePuzzle && (
            <PuzzleModal
              puzzleId={activePuzzle}
              onSolved={handlePuzzleSolved}
              onClose={() => setActivePuzzle(null)}
            />
          )}

          {/* Dialogue / Note Viewer Modal */}
          {dialogueData && (
            <DialogueModal
              title={dialogueData.title}
              lines={dialogueData.lines}
              onClose={() => setDialogueData(null)}
            />
          )}
        </>
      )}

      {/* Pause Screen Modal */}
      {screen === 'PAUSED' && (
        <PauseModal
          onResume={() => setScreen('PLAYING')}
          onRestart={() => {
            continueGame();
          }}
          onSettings={() => setScreen('SETTINGS')}
          onHowToPlay={() => setScreen('HOW_TO_PLAY')}
          onMainMenu={() => {
            soundEngine.stopAmbient();
            setScreen('MAIN_MENU');
          }}
        />
      )}

      {/* Game Over Screen */}
      {screen === 'GAME_OVER' && (
        <GameOverModal
          onRestart={() => {
            continueGame();
          }}
          onMainMenu={() => {
            soundEngine.stopAmbient();
            setScreen('MAIN_MENU');
          }}
        />
      )}

      {/* Ending Screen */}
      {screen === 'ENDING' && (
        <EndingScreen
          endingType={endingType}
          diaryCount={collectedDiaries.length}
          onRestart={startNewGame}
          onMainMenu={() => {
            soundEngine.stopAmbient();
            setScreen('MAIN_MENU');
          }}
        />
      )}

      {/* How To Play Modal */}
      {screen === 'HOW_TO_PLAY' && (
        <HowToPlayModal onClose={() => setScreen(storageService.hasSave() ? 'PLAYING' : 'MAIN_MENU')} />
      )}

      {/* Settings Modal */}
      {screen === 'SETTINGS' && (
        <SettingsModal onClose={() => setScreen(storageService.hasSave() ? 'PLAYING' : 'MAIN_MENU')} />
      )}

      {/* Credits Modal */}
      {screen === 'CREDITS' && (
        <CreditsModal onClose={() => setScreen('MAIN_MENU')} />
      )}
    </div>
  );
}
