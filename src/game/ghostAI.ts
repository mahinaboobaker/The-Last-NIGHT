import { GhostState, PlayerState, RoomId } from '../types/game';
import { ROOMS } from './mapData';

export class GhostController {
  private ghost: GhostState;
  private patrolWaypoints: Array<{ x: number; y: number; room: RoomId }> = [];
  private searchTimer: number = 0;
  private flickerTimer: number = 0;
  private jumpscareCooloff: number = 0;

  constructor() {
    this.ghost = {
      x: 300,
      y: 350,
      room: 'corridor_1f',
      targetX: 300,
      targetY: 350,
      active: true,
      isChasing: false,
      detectionDistance: 240,
      speed: 1.8,
      patrolTimer: 0,
      patrolIndex: 0,
      alpha: 0.85
    };

    this.initPatrolWaypoints();
  }

  private initPatrolWaypoints() {
    this.patrolWaypoints = [
      { room: 'corridor_1f', x: 200, y: 350 },
      { room: 'corridor_1f', x: 500, y: 350 },
      { room: 'corridor_1f', x: 800, y: 350 },
      { room: 'staircase', x: 400, y: 350 },
      { room: 'corridor_2f', x: 300, y: 300 },
      { room: 'corridor_2f', x: 700, y: 300 },
      { room: 'basement', x: 450, y: 350 },
      { room: 'kitchen', x: 450, y: 350 },
      { room: 'storage', x: 400, y: 350 },
    ];
  }

  public getGhost(): GhostState {
    return this.ghost;
  }

  public setGhost(ghost: Partial<GhostState>) {
    this.ghost = { ...this.ghost, ...ghost };
  }

  public reset(room: RoomId = 'corridor_1f') {
    this.ghost.room = room;
    this.ghost.x = 500;
    this.ghost.y = 350;
    this.ghost.isChasing = false;
    this.ghost.speed = 1.8;
  }

  public update(
    deltaTime: number,
    player: PlayerState,
    currentRoom: RoomId,
    chapter: number
  ): {
    proximity: number; // 0 to 1
    didCatchPlayer: boolean;
    flickerFlashlight: boolean;
    triggerJumpScare: boolean;
  } {
    let proximity = 0;
    let didCatchPlayer = false;
    let flickerFlashlight = false;
    let triggerJumpScare = false;

    // In Chapter 1, ghost lurks as a distant shadow
    if (chapter < 2) {
      this.ghost.active = false;
      return { proximity: 0, didCatchPlayer: false, flickerFlashlight: false, triggerJumpScare: false };
    }

    this.ghost.active = true;

    // Adjust ghost speed by chapter
    const baseSpeed = 1.5 + (chapter - 2) * 0.45;
    this.ghost.speed = this.ghost.isChasing ? baseSpeed * 1.55 : baseSpeed;

    // If ghost is in the same room as player
    if (this.ghost.room === currentRoom) {
      const dx = player.x - this.ghost.x;
      const dy = player.y - this.ghost.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      // Detection radius increases if player is not hiding and has flashlight on
      let detectionRange = 250;
      if (player.flashlightOn) {
        detectionRange = 460;
      }
      if (player.isMoving) {
        detectionRange += 60;
      }

      // If player is hiding inside a cupboard / locker
      if (player.isHiding) {
        if (this.ghost.isChasing) {
          // Ghost was chasing and player jumped into locker
          this.searchTimer += deltaTime;
          if (this.searchTimer > 3.0) {
            this.ghost.isChasing = false;
            this.searchTimer = 0;
            // Ghost drifts away
            this.pickNextPatrolWaypoint();
          }
        } else {
          this.ghost.isChasing = false;
        }
      } else {
        // Player is exposed
        if (distance < detectionRange) {
          this.ghost.isChasing = true;
          this.ghost.targetX = player.x;
          this.ghost.targetY = player.y;

          // Proximity intensity for heartbeat and red screen vignette
          proximity = Math.max(0, 1 - distance / 400);

          if (distance < 160) {
            flickerFlashlight = true;
          }

          if (distance < 100 && this.jumpscareCooloff <= 0) {
            triggerJumpScare = true;
            this.jumpscareCooloff = 10.0;
          }

          // Caught by ghost!
          if (distance < 36) {
            didCatchPlayer = true;
          }
        } else {
          // Lost player
          if (this.ghost.isChasing) {
            this.searchTimer += deltaTime;
            if (this.searchTimer > 4.5) {
              this.ghost.isChasing = false;
              this.searchTimer = 0;
              this.pickNextPatrolWaypoint();
            }
          }
        }
      }
    } else {
      // Different room - chance for ghost to wander or migrate towards player's corridor
      this.ghost.isChasing = false;
      this.ghost.patrolTimer += deltaTime;
      if (this.ghost.patrolTimer > 7.0) {
        this.ghost.patrolTimer = 0;
        // 35% chance to migrate to current room if not safe
        if (Math.random() < 0.4 && currentRoom !== 'reception' && currentRoom !== 'main_exit') {
          this.ghost.room = currentRoom;
          // Spawn near an edge
          const roomData = ROOMS[currentRoom];
          this.ghost.x = Math.random() > 0.5 ? 60 : roomData.width - 60;
          this.ghost.y = Math.random() > 0.5 ? 60 : roomData.height - 60;
        } else {
          this.pickNextPatrolWaypoint();
        }
      }
    }

    if (this.jumpscareCooloff > 0) {
      this.jumpscareCooloff -= deltaTime;
    }

    // Ghost movement towards target
    const moveDx = this.ghost.targetX - this.ghost.x;
    const moveDy = this.ghost.targetY - this.ghost.y;
    const moveDist = Math.sqrt(moveDx * moveDx + moveDy * moveDy);

    if (moveDist > 6) {
      const step = Math.min(moveDist, this.ghost.speed * 60 * deltaTime);
      this.ghost.x += (moveDx / moveDist) * step;
      this.ghost.y += (moveDy / moveDist) * step;
    } else if (!this.ghost.isChasing) {
      this.pickNextPatrolWaypoint();
    }

    // Keep ghost inside room bounds
    const curRoom = ROOMS[this.ghost.room];
    if (curRoom) {
      this.ghost.x = Math.max(40, Math.min(curRoom.width - 40, this.ghost.x));
      this.ghost.y = Math.max(40, Math.min(curRoom.height - 40, this.ghost.y));
    }

    return {
      proximity,
      didCatchPlayer,
      flickerFlashlight,
      triggerJumpScare
    };
  }

  private pickNextPatrolWaypoint() {
    this.ghost.patrolIndex = (this.ghost.patrolIndex + 1) % this.patrolWaypoints.length;
    const wp = this.patrolWaypoints[this.ghost.patrolIndex];
    if (Math.random() < 0.35) {
      this.ghost.room = wp.room;
    }
    this.ghost.targetX = wp.x + (Math.random() * 100 - 50);
    this.ghost.targetY = wp.y + (Math.random() * 100 - 50);
  }
}
