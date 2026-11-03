import { GhostState, PlayerState, RoomData } from '../types/game';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  alpha: number;
  size: number;
}

export class GameRenderer {
  private particles: Particle[] = [];
  private time: number = 0;
  private shakeOffset: { x: number; y: number } = { x: 0, y: 0 };
  private shakeDuration: number = 0;

  constructor() {
    // Generate atmospheric dust particles
    for (let i = 0; i < 60; i++) {
      this.particles.push({
        x: Math.random() * 1200,
        y: Math.random() * 900,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3 - 0.1,
        alpha: Math.random() * 0.4 + 0.1,
        size: Math.random() * 2 + 1
      });
    }
  }

  public triggerScreenShake(duration: number = 0.4) {
    this.shakeDuration = duration;
  }

  public render(
    ctx: CanvasRenderingContext2D,
    canvasWidth: number,
    canvasHeight: number,
    room: RoomData,
    player: PlayerState,
    ghost: GhostState,
    keysCollected: string[],
    flashlightFlicker: boolean,
    cameraOffset: { x: number; y: number }
  ) {
    this.time += 0.016;

    // Screen shake update
    if (this.shakeDuration > 0) {
      this.shakeDuration -= 0.016;
      this.shakeOffset.x = (Math.random() - 0.5) * 10;
      this.shakeOffset.y = (Math.random() - 0.5) * 10;
    } else {
      this.shakeOffset.x = 0;
      this.shakeOffset.y = 0;
    }

    ctx.save();
    ctx.translate(cameraOffset.x + this.shakeOffset.x, cameraOffset.y + this.shakeOffset.y);

    // 1. Render Floor
    this.drawFloor(ctx, room);

    // 2. Render Wall Boundaries
    this.drawWalls(ctx, room);

    // 3. Render Furniture & Environment Details
    this.drawFurniture(ctx, room);

    // 4. Render Interactive Objects & Pickups
    this.drawInteractiveObjects(ctx, room, keysCollected);

    // 5. Render Player (if not hiding in cupboard)
    if (!player.isHiding) {
      this.drawPlayer(ctx, player);
    }

    // 6. Render Ghost (if in current room)
    if (ghost.active && ghost.room === room.id) {
      this.drawGhost(ctx, ghost);
    }

    // 7. Render Floating Dust/Fog Particles
    this.drawParticles(ctx, room);

    // 8. Dynamic Lighting & Shadows
    this.drawLighting(ctx, room, player, ghost, flashlightFlicker);

    ctx.restore();
  }

  private drawFloor(ctx: CanvasRenderingContext2D, room: RoomData) {
    const tileSize = 48;
    for (let x = 0; x < room.width; x += tileSize) {
      for (let y = 0; y < room.height; y += tileSize) {
        const isAlternate = ((x / tileSize) + (y / tileSize)) % 2 === 0;

        if (room.id === 'basement') {
          // Damp cracked stone
          ctx.fillStyle = isAlternate ? '#0d1117' : '#080c10';
        } else if (room.id === 'kitchen') {
          // Chequered greasy tiles
          ctx.fillStyle = isAlternate ? '#1e2430' : '#141720';
        } else if (room.id.includes('corridor')) {
          // Old wooden hall boards
          ctx.fillStyle = isAlternate ? '#18141f' : '#120f18';
        } else {
          // Grimy hostel room floor
          ctx.fillStyle = isAlternate ? '#1a1820' : '#131119';
        }

        ctx.fillRect(x, y, tileSize, tileSize);

        // Subtle tile seam
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.4)';
        ctx.lineWidth = 1;
        ctx.strokeRect(x, y, tileSize, tileSize);
      }
    }

    // Blood stains or scratch marks
    if (room.id === 'corridor_1f' || room.id === 'reception' || room.id === 'basement') {
      ctx.save();
      ctx.fillStyle = 'rgba(120, 15, 15, 0.45)';
      ctx.beginPath();
      ctx.arc(380, 420, 24, 0, Math.PI * 2);
      ctx.arc(410, 435, 18, 0, Math.PI * 2);
      ctx.fill();

      // Drag smear
      ctx.fillRect(380, 410, 80, 14);
      ctx.restore();
    }
  }

  private drawWalls(ctx: CanvasRenderingContext2D, room: RoomData) {
    ctx.save();
    room.walls.forEach(wall => {
      // Wall base
      ctx.fillStyle = '#1c1b24';
      ctx.fillRect(wall.x, wall.y, wall.w, wall.h);

      // Wall wood / brick trim
      ctx.fillStyle = '#110f17';
      ctx.fillRect(wall.x + 2, wall.y + 2, wall.w - 4, wall.h - 4);

      ctx.strokeStyle = '#2d2b38';
      ctx.lineWidth = 2;
      ctx.strokeRect(wall.x, wall.y, wall.w, wall.h);
    });
    ctx.restore();
  }

  private drawFurniture(ctx: CanvasRenderingContext2D, room: RoomData) {
    room.furniture.forEach(f => {
      ctx.save();

      if (f.spriteType === 'bed' || f.spriteType === 'bunk') {
        // Wooden bed frame
        ctx.fillStyle = '#261911';
        ctx.fillRect(f.x, f.y, f.w, f.h);
        // Mattresses
        ctx.fillStyle = '#3f3844';
        ctx.fillRect(f.x + 6, f.y + 6, f.w - 12, f.h - 12);
        // Torn blanket
        ctx.fillStyle = '#4c1d24';
        ctx.fillRect(f.x + 12, f.y + f.h * 0.35, f.w - 24, f.h * 0.6);
        // Pillows
        ctx.fillStyle = '#827889';
        ctx.fillRect(f.x + 14, f.y + 10, f.w - 28, 18);
      } else if (f.spriteType === 'cupboard') {
        // Locker / cupboard you can hide in
        ctx.fillStyle = '#1f2937';
        ctx.fillRect(f.x, f.y, f.w, f.h);

        ctx.strokeStyle = '#374151';
        ctx.lineWidth = 2;
        ctx.strokeRect(f.x, f.y, f.w, f.h);

        // Vent slits & door line
        ctx.fillStyle = '#111827';
        ctx.fillRect(f.x + f.w / 2 - 1, f.y, 2, f.h);
        for (let i = 0; i < 4; i++) {
          ctx.fillRect(f.x + 12, f.y + 16 + i * 8, f.w - 24, 3);
        }
      } else if (f.spriteType === 'exit_gate') {
        // Grand 5-key iron exit gates
        ctx.fillStyle = '#1e1b24';
        ctx.fillRect(f.x, f.y, f.w, f.h);

        // Heavy iron bars
        ctx.fillStyle = '#374151';
        for (let i = 0; i < f.w; i += 18) {
          ctx.fillRect(f.x + i, f.y, 6, f.h);
        }

        // Heavy padlock chain across the middle
        ctx.fillStyle = '#d97706';
        ctx.fillRect(f.x + 20, f.y + f.h / 2 - 8, f.w - 40, 16);
      } else if (f.spriteType === 'blood') {
        ctx.fillStyle = '#4a0e17';
        ctx.beginPath();
        ctx.ellipse(f.x + f.w / 2, f.y + f.h / 2, f.w / 2, f.h / 2, 0, 0, Math.PI * 2);
        ctx.fill();
      } else {
        // Desks, shelves, counters
        ctx.fillStyle = f.color;
        ctx.fillRect(f.x, f.y, f.w, f.h);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.lineWidth = 1;
        ctx.strokeRect(f.x, f.y, f.w, f.h);
      }

      ctx.restore();
    });
  }

  private drawInteractiveObjects(ctx: CanvasRenderingContext2D, room: RoomData, keysCollected: string[]) {
    room.objects.forEach(obj => {
      if (obj.collected) return;

      ctx.save();
      const pulse = Math.sin(this.time * 4) * 0.15 + 0.85;
      const cx = obj.x + obj.w / 2;
      const cy = obj.y + obj.h / 2;

      if (obj.type === 'KEY') {
        // Glowing animated pulse ring
        ctx.strokeStyle = `rgba(245, 158, 11, ${0.6 * pulse})`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(cx, cy, 22 * pulse, 0, Math.PI * 2);
        ctx.stroke();

        // Glowing key sprite
        ctx.fillStyle = '#fbbf24';
        ctx.shadowColor = '#f59e0b';
        ctx.shadowBlur = 16 * pulse;
        ctx.beginPath();
        ctx.arc(cx, cy - 6, 7, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillRect(cx - 2.5, cy - 6, 5, 18);
        ctx.fillRect(cx, cy + 3, 7, 3);
        ctx.fillRect(cx, cy + 9, 7, 3);

        // Floating label
        ctx.shadowBlur = 0;
        ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        ctx.fillRect(cx - 38, cy - 34, 76, 16);
        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 1;
        ctx.strokeRect(cx - 38, cy - 34, 76, 16);
        ctx.fillStyle = '#fef08a';
        ctx.font = 'bold 9px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('[E] PICK UP', cx, cy - 22);
      } else if (obj.type === 'BATTERY') {
        // Battery pickup
        ctx.fillStyle = '#10b981';
        ctx.shadowColor = '#10b981';
        ctx.shadowBlur = 10 * pulse;
        ctx.fillRect(obj.x + 8, obj.y + 6, obj.w - 16, obj.h - 12);
        ctx.fillStyle = '#34d399';
        ctx.fillRect(obj.x + obj.w / 2 - 3, obj.y + 2, 6, 4);

        ctx.shadowBlur = 0;
        ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        ctx.fillRect(cx - 36, cy - 30, 72, 14);
        ctx.fillStyle = '#6ee7b7';
        ctx.font = 'bold 9px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('[E] BATTERY', cx, cy - 20);
      } else if (obj.type === 'MEDKIT') {
        // Medkit pickup
        ctx.fillStyle = '#ef4444';
        ctx.shadowColor = '#ef4444';
        ctx.shadowBlur = 10 * pulse;
        ctx.fillRect(obj.x + 4, obj.y + 4, obj.w - 8, obj.h - 8);
        ctx.fillStyle = '#ffffff';
        // Cross
        ctx.fillRect(obj.x + obj.w / 2 - 3, obj.y + 8, 6, obj.h - 16);
        ctx.fillRect(obj.x + 8, obj.y + obj.h / 2 - 3, obj.w - 16, 6);

        ctx.shadowBlur = 0;
        ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        ctx.fillRect(cx - 34, cy - 30, 68, 14);
        ctx.fillStyle = '#fca5a5';
        ctx.font = 'bold 9px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('[E] MEDKIT', cx, cy - 20);
      } else if (obj.type === 'DIARY' || obj.type === 'NOTE') {
        // Glowing yellowed paper
        ctx.fillStyle = '#fef08a';
        ctx.shadowColor = '#fef08a';
        ctx.shadowBlur = 8 * pulse;
        ctx.fillRect(obj.x + 4, obj.y + 4, obj.w - 8, obj.h - 8);

        ctx.shadowBlur = 0;
        ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        ctx.fillRect(cx - 32, cy - 28, 64, 14);
        ctx.fillStyle = '#fef08a';
        ctx.font = 'bold 9px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('[E] NOTE', cx, cy - 18);
      } else if (obj.type === 'PUZZLE') {
        ctx.fillStyle = 'rgba(217, 119, 6, 0.3)';
        ctx.fillRect(obj.x, obj.y, obj.w, obj.h);
        ctx.strokeStyle = '#d97706';
        ctx.lineWidth = 2;
        ctx.strokeRect(obj.x, obj.y, obj.w, obj.h);

        ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        ctx.fillRect(cx - 36, cy - 26, 72, 14);
        ctx.fillStyle = '#fcd34d';
        ctx.font = 'bold 9px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('[E] PUZZLE', cx, cy - 16);
      } else if (obj.type === 'HIDING_SPOT') {
        // Subtle blue indicator on cupboard
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.5)';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(obj.x, obj.y, obj.w, obj.h);

        ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        ctx.fillRect(cx - 30, cy - 24, 60, 14);
        ctx.fillStyle = '#7dd3fc';
        ctx.font = 'bold 9px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('[E] HIDE', cx, cy - 14);
      } else if (obj.type === 'DOOR') {
        // Doorway glow or threshold
        ctx.fillStyle = obj.isUnlocked ? 'rgba(52, 211, 153, 0.25)' : 'rgba(239, 68, 68, 0.25)';
        ctx.fillRect(obj.x, obj.y, obj.w, obj.h);

        ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
        ctx.fillRect(cx - 32, cy - 18, 64, 13);
        ctx.fillStyle = obj.isUnlocked ? '#6ee7b7' : '#fca5a5';
        ctx.font = 'bold 8px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(obj.isUnlocked ? 'DOOR [OPEN]' : 'DOOR [LOCKED]', cx, cy - 8);
      }

      ctx.restore();
    });
  }

  private drawPlayer(ctx: CanvasRenderingContext2D, player: PlayerState) {
    ctx.save();
    ctx.translate(player.x, player.y);

    // Drop shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.55)';
    ctx.beginPath();
    ctx.ellipse(0, 16, 14, 7, 0, 0, Math.PI * 2);
    ctx.fill();

    // Rotate player to match direction
    ctx.rotate(player.angle);

    // Walk bobbing
    const bob = player.isMoving ? Math.sin(this.time * 14) * 2 : 0;

    // Student character body (green hoodie jacket)
    ctx.fillStyle = '#15803d'; // Green hoodie
    ctx.fillRect(-11, -12 + bob, 22, 24);

    // Backpack
    ctx.fillStyle = '#78350f'; // Leather backpack
    ctx.fillRect(-12, -6 + bob, 6, 12);

    // Head
    ctx.fillStyle = '#fbcfe8'; // Skin
    ctx.beginPath();
    ctx.arc(4, 0 + bob, 8, 0, Math.PI * 2);
    ctx.fill();

    // Dark hair
    ctx.fillStyle = '#1f2937';
    ctx.beginPath();
    ctx.arc(2, 0 + bob, 9, Math.PI * 0.6, Math.PI * 1.4);
    ctx.fill();

    // Flashlight in hand
    if (player.flashlightOn) {
      ctx.fillStyle = '#9ca3af';
      ctx.fillRect(10, 5 + bob, 8, 5);
      ctx.fillStyle = '#fef08a';
      ctx.fillRect(16, 4 + bob, 3, 7);
    }

    ctx.restore();
  }

  private drawGhost(ctx: CanvasRenderingContext2D, ghost: GhostState) {
    ctx.save();
    ctx.translate(ghost.x, ghost.y);

    const floatOffset = Math.sin(this.time * 3) * 6;
    const ghostPulse = Math.sin(this.time * 5) * 0.15 + 0.85;

    // Spectral aura
    const auraGradient = ctx.createRadialGradient(0, floatOffset, 10, 0, floatOffset, 65);
    auraGradient.addColorStop(0, ghost.isChasing ? 'rgba(239, 68, 68, 0.5)' : 'rgba(56, 189, 248, 0.35)');
    auraGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

    ctx.fillStyle = auraGradient;
    ctx.beginPath();
    ctx.arc(0, floatOffset, 65, 0, Math.PI * 2);
    ctx.fill();

    // Ghost body (translucent floating student spirit)
    ctx.globalAlpha = ghost.alpha * ghostPulse;
    ctx.fillStyle = ghost.isChasing ? '#fca5a5' : '#e0f2fe';

    // Dress / floating wisps
    ctx.beginPath();
    ctx.moveTo(-16, -18 + floatOffset);
    ctx.bezierCurveTo(-22, 10 + floatOffset, -28, 30 + floatOffset, -14, 40 + floatOffset);
    ctx.bezierCurveTo(-4, 30 + floatOffset, 0, 42 + floatOffset, 8, 38 + floatOffset);
    ctx.bezierCurveTo(24, 32 + floatOffset, 20, 10 + floatOffset, 16, -18 + floatOffset);
    ctx.closePath();
    ctx.fill();

    // Pale head
    ctx.fillStyle = '#f1f5f9';
    ctx.beginPath();
    ctx.arc(0, -26 + floatOffset, 12, 0, Math.PI * 2);
    ctx.fill();

    // Long dark ghostly hair
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.arc(0, -28 + floatOffset, 14, 0, Math.PI * 2);
    ctx.fill();

    // Glowing eyes
    ctx.fillStyle = ghost.isChasing ? '#ef4444' : '#38bdf8';
    ctx.shadowColor = ghost.isChasing ? '#ef4444' : '#38bdf8';
    ctx.shadowBlur = 12;
    ctx.beginPath();
    ctx.arc(-4, -26 + floatOffset, 2.5, 0, Math.PI * 2);
    ctx.arc(4, -26 + floatOffset, 2.5, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  private drawParticles(ctx: CanvasRenderingContext2D, room: RoomData) {
    ctx.save();
    this.particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0) p.x = room.width;
      if (p.x > room.width) p.x = 0;
      if (p.y < 0) p.y = room.height;
      if (p.y > room.height) p.y = 0;

      ctx.fillStyle = `rgba(220, 220, 255, ${p.alpha * 0.4})`;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.restore();
  }

  private drawLighting(
    ctx: CanvasRenderingContext2D,
    room: RoomData,
    player: PlayerState,
    ghost: GhostState,
    flicker: boolean
  ) {
    // We create a dark mask over the whole room, then "cut out" lights
    ctx.save();

    // Create offscreen-like effect directly using destination-out or composite operation
    // Ambient darkness: pitch black if hiding or deeper in basement
    const darknessAlpha = player.isHiding ? 0.96 : (room.id === 'basement' ? 0.94 : 0.88);

    // Canvas composite trick: Draw dark overlay on top, cut out flashlight cone and room bulbs
    // Create darkness canvas layer
    const darknessCanvas = document.createElement('canvas');
    darknessCanvas.width = room.width;
    darknessCanvas.height = room.height;
    const darkCtx = darknessCanvas.getContext('2d');

    if (darkCtx) {
      // 1. Fill base darkness
      darkCtx.fillStyle = `rgba(5, 5, 8, ${darknessAlpha})`;
      darkCtx.fillRect(0, 0, room.width, room.height);

      darkCtx.globalCompositeOperation = 'destination-out';

      // 2. Room ambient lights (flickering fluorescent bulbs)
      room.lights.forEach(light => {
        let radius = light.radius;
        if (light.flicker) {
          const fl = Math.sin(this.time * 12 + light.x) * 0.2 + 0.8;
          radius *= fl;
        }

        const grad = darkCtx.createRadialGradient(light.x, light.y, 10, light.x, light.y, radius);
        grad.addColorStop(0, 'rgba(0, 0, 0, 0.9)');
        grad.addColorStop(0.6, 'rgba(0, 0, 0, 0.4)');
        grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

        darkCtx.fillStyle = grad;
        darkCtx.beginPath();
        darkCtx.arc(light.x, light.y, radius, 0, Math.PI * 2);
        darkCtx.fill();
      });

      // 3. Player's Flashlight beam (if turned on, has battery, and not hiding)
      if (player.flashlightOn && player.battery > 0 && !player.isHiding) {
        let beamLength = 340;
        let beamAngleWidth = Math.PI * 0.32;

        if (flicker || (player.battery < 20 && Math.sin(this.time * 20) > 0.3)) {
          beamLength *= (Math.random() * 0.4 + 0.6);
        }

        darkCtx.save();
        darkCtx.translate(player.x, player.y);
        darkCtx.rotate(player.angle);

        // Flashlight beam cone
        const coneGrad = darkCtx.createRadialGradient(0, 0, 15, 0, 0, beamLength);
        coneGrad.addColorStop(0, 'rgba(0, 0, 0, 1.0)');
        coneGrad.addColorStop(0.7, 'rgba(0, 0, 0, 0.8)');
        coneGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');

        darkCtx.fillStyle = coneGrad;
        darkCtx.beginPath();
        darkCtx.moveTo(0, 0);
        darkCtx.arc(0, 0, beamLength, -beamAngleWidth / 2, beamAngleWidth / 2);
        darkCtx.closePath();
        darkCtx.fill();

        // Small circle around player for personal feet visibility
        const feetGrad = darkCtx.createRadialGradient(0, 0, 5, 0, 0, 55);
        feetGrad.addColorStop(0, 'rgba(0, 0, 0, 0.8)');
        feetGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        darkCtx.fillStyle = feetGrad;
        darkCtx.beginPath();
        darkCtx.arc(0, 0, 55, 0, Math.PI * 2);
        darkCtx.fill();

        darkCtx.restore();
      } else if (!player.isHiding) {
        // Minimal night adaptation glow around player
        const faintGrad = darkCtx.createRadialGradient(player.x, player.y, 4, player.x, player.y, 40);
        faintGrad.addColorStop(0, 'rgba(0, 0, 0, 0.35)');
        faintGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        darkCtx.fillStyle = faintGrad;
        darkCtx.beginPath();
        darkCtx.arc(player.x, player.y, 40, 0, Math.PI * 2);
        darkCtx.fill();
      }

      // Draw compiled darkness mask over main canvas
      ctx.drawImage(darknessCanvas, 0, 0);
    }

    ctx.restore();
  }
}
