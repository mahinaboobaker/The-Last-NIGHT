import React from 'react';
import { ChapterId } from '../types/game';
import { Battery, Heart, Pause, Backpack, Lightbulb, Key, ShieldAlert } from 'lucide-react';

interface GameHUDProps {
  health: number;
  maxHealth: number;
  battery: number;
  flashlightOn: boolean;
  chapter: ChapterId;
  keysCount: number;
  currentRoomName: string;
  isHiding: boolean;
  interactionPrompt: string | null;
  proximityIntensity: number; // 0 to 1
  onToggleFlashlight: () => void;
  onOpenInventory: () => void;
  onOpenKeyGuide?: () => void;
  onPause: () => void;
  onInteract: () => void;
  onMoveDirection?: (dir: 'UP' | 'DOWN' | 'LEFT' | 'RIGHT' | null) => void;
}

export const GameHUD: React.FC<GameHUDProps> = ({
  health,
  maxHealth,
  battery,
  flashlightOn,
  chapter,
  keysCount,
  currentRoomName,
  isHiding,
  interactionPrompt,
  proximityIntensity,
  onToggleFlashlight,
  onOpenInventory,
  onOpenKeyGuide,
  onPause,
  onInteract,
  onMoveDirection
}) => {
  const chapterTitles: Record<ChapterId, string> = {
    1: 'CHAPTER 1: THE ARRIVAL',
    2: 'CHAPTER 2: THE FIRST ROOM',
    3: 'CHAPTER 3: SOMETHING IS FOLLOWING YOU',
    4: 'CHAPTER 4: THE WARDEN’S SECRET',
    5: 'CHAPTER 5: THE FINAL ESCAPE'
  };

  return (
    <div className="absolute inset-0 pointer-events-none z-30 select-none flex flex-col justify-between p-4 sm:p-6">
      {/* Ghost Proximity Red Vignette Alert */}
      {proximityIntensity > 0.1 && (
        <div
          className="absolute inset-0 pointer-events-none transition-opacity duration-300"
          style={{
            background: `radial-gradient(circle at center, transparent 35%, rgba(185, 28, 28, ${proximityIntensity * 0.75}) 100%)`,
            opacity: Math.min(1, proximityIntensity * 1.2)
          }}
        />
      )}

      {/* Top Header HUD Bar */}
      <div className="flex items-start justify-between gap-4 pointer-events-auto">
        {/* Left: Status Meters (Health & Flashlight) */}
        <div className="flex flex-col gap-2 bg-black/75 backdrop-blur-md border border-slate-800 rounded-xl p-3 shadow-xl">
          {/* Health Bar */}
          <div className="flex items-center gap-2">
            <Heart className={`w-4 h-4 ${health < 35 ? 'text-red-500 animate-pulse' : 'text-rose-400'}`} />
            <div className="w-28 sm:w-36 h-3 bg-slate-900 rounded-full overflow-hidden border border-slate-700/80 p-0.5">
              <div
                className={`h-full rounded-full transition-all duration-300 ${
                  health > 50 ? 'bg-emerald-500' : health > 25 ? 'bg-amber-500' : 'bg-red-600'
                }`}
                style={{ width: `${Math.max(0, Math.min(100, (health / maxHealth) * 100))}%` }}
              />
            </div>
            <span className="text-[11px] font-mono-tech text-slate-300 tabular-nums">
              {Math.round(health)} HP
            </span>
          </div>

          {/* Flashlight Battery */}
          <div className="flex items-center gap-2">
            <Battery className={`w-4 h-4 ${battery < 20 ? 'text-amber-500 animate-bounce' : 'text-emerald-400'}`} />
            <div className="w-28 sm:w-36 h-3 bg-slate-900 rounded-full overflow-hidden border border-slate-700/80 p-0.5">
              <div
                className={`h-full rounded-full transition-all duration-200 ${
                  battery > 40 ? 'bg-cyan-500' : battery > 15 ? 'bg-amber-400' : 'bg-red-500'
                }`}
                style={{ width: `${Math.max(0, Math.min(100, battery))}%` }}
              />
            </div>
            <span className="text-[11px] font-mono-tech text-slate-300 tabular-nums">
              {Math.round(battery)}%
            </span>
          </div>
        </div>

        {/* Center: Chapter and Room Name */}
        <div className="text-center bg-black/75 backdrop-blur-md border border-slate-800 rounded-xl px-4 py-2 shadow-xl hidden sm:block">
          <div className="text-[11px] font-mono-tech tracking-wider text-red-500 font-bold">
            {chapterTitles[chapter]}
          </div>
          <div className="text-sm font-cinzel font-bold text-slate-200">
            {currentRoomName}
          </div>
        </div>

        {/* Right: Keys & Controls */}
        <div className="flex items-center gap-3">
          {/* Key Counter / Clues Button */}
          <button
            onClick={onOpenKeyGuide}
            className="flex items-center gap-2 bg-black/75 hover:bg-slate-900 active:bg-amber-950/40 backdrop-blur-md border border-slate-800 hover:border-amber-600/70 rounded-xl px-3 py-2 shadow-xl transition-all group"
            title="View 5 Keys Guide & Locations"
          >
            <Key className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
            <div className="flex gap-1">
              {[0, 1, 2, 3, 4].map(idx => (
                <div
                  key={idx}
                  className={`w-3 h-4 rounded-sm border transition-all ${
                    idx < keysCount
                      ? 'bg-amber-400 border-amber-300 shadow-[0_0_8px_rgba(245,158,11,0.6)]'
                      : 'bg-slate-900 border-slate-700'
                  }`}
                />
              ))}
            </div>
            <span className="text-xs font-mono-tech text-amber-400 font-bold ml-1">
              {keysCount}/5
            </span>
            <span className="hidden sm:inline text-[10px] font-mono-tech text-slate-400 border-l border-slate-700 pl-1.5 ml-1">
              CLUES
            </span>
          </button>

          {/* Flashlight Button */}
          <button
            onClick={onToggleFlashlight}
            className={`p-2.5 rounded-xl border transition-all ${
              flashlightOn
                ? 'bg-amber-950/80 border-amber-500 text-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.4)]'
                : 'bg-black/75 border-slate-800 text-slate-400 hover:text-white'
            }`}
            title="Toggle Flashlight [F]"
          >
            <Lightbulb className="w-4 h-4" />
          </button>

          {/* Inventory Button */}
          <button
            onClick={onOpenInventory}
            className="p-2.5 bg-black/75 hover:bg-slate-900 border border-slate-800 rounded-xl text-slate-300 hover:text-white shadow-xl transition-colors"
            title="Open Backpack [I]"
          >
            <Backpack className="w-4 h-4" />
          </button>

          {/* Pause Button */}
          <button
            onClick={onPause}
            className="p-2.5 bg-black/75 hover:bg-slate-900 border border-slate-800 rounded-xl text-slate-300 hover:text-white shadow-xl transition-colors"
            title="Pause [ESC]"
          >
            <Pause className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Warning Alert if Hiding */}
      {isHiding && (
        <div className="self-center bg-black/90 border border-sky-600 rounded-xl px-5 py-3 shadow-2xl animate-pulse text-center">
          <div className="flex items-center gap-2 text-sky-400 text-xs font-mono-tech uppercase font-bold justify-center">
            <ShieldAlert className="w-4 h-4" />
            HIDING INSIDE CUPBOARD
          </div>
          <p className="text-[11px] text-slate-300 mt-1">
            Stay quiet. The ghost cannot see you here unless it inspects closely.
          </p>
          <button
            onClick={onInteract}
            className="pointer-events-auto mt-2 px-4 py-1 bg-sky-950 hover:bg-sky-900 border border-sky-500 rounded text-xs text-sky-200 font-bold"
          >
            [E] LEAVE CUPBOARD
          </button>
        </div>
      )}

      {/* Center Interaction Prompt */}
      {interactionPrompt && !isHiding && (
        <div className="self-center bg-black/85 backdrop-blur-md border border-amber-600/80 rounded-xl px-6 py-2.5 shadow-2xl text-center pointer-events-auto animate-bounce">
          <div className="text-xs font-mono-tech text-amber-300 font-bold tracking-wide">
            {interactionPrompt}
          </div>
          <button
            onClick={onInteract}
            className="mt-1 px-4 py-0.5 bg-amber-950/70 border border-amber-600 text-[10px] font-bold text-amber-200 rounded"
          >
            PRESS [E] OR TAP HERE
          </button>
        </div>
      )}

      {/* Bottom Footer Controls & Mobile D-Pad */}
      <div className="flex items-end justify-between pointer-events-auto">
        {/* Desktop Keyboard Hints */}
        <div className="hidden md:flex items-center gap-4 text-[11px] font-mono-tech text-slate-400 bg-black/70 backdrop-blur border border-slate-800/80 rounded-lg px-3 py-1.5">
          <span>WASD / ARROWS: Move</span>
          <span>·</span>
          <span>E: Interact / Hide</span>
          <span>·</span>
          <span>F: Flashlight</span>
          <span>·</span>
          <span>I: Inventory</span>
        </div>

        {/* Mobile Touch Virtual D-Pad (only visible on small touch screens) */}
        <div className="flex md:hidden gap-1 bg-black/60 backdrop-blur p-2 rounded-xl border border-slate-800">
          <div className="grid grid-cols-3 gap-1 w-28 h-28">
            <div />
            <button
              onPointerDown={() => onMoveDirection?.('UP')}
              onPointerUp={() => onMoveDirection?.(null)}
              className="bg-slate-800/80 active:bg-red-800 text-white rounded flex items-center justify-center font-bold"
            >
              ▲
            </button>
            <div />
            <button
              onPointerDown={() => onMoveDirection?.('LEFT')}
              onPointerUp={() => onMoveDirection?.(null)}
              className="bg-slate-800/80 active:bg-red-800 text-white rounded flex items-center justify-center font-bold"
            >
              ◀
            </button>
            <div className="bg-slate-900 rounded" />
            <button
              onPointerDown={() => onMoveDirection?.('RIGHT')}
              onPointerUp={() => onMoveDirection?.(null)}
              className="bg-slate-800/80 active:bg-red-800 text-white rounded flex items-center justify-center font-bold"
            >
              ▶
            </button>
            <div />
            <button
              onPointerDown={() => onMoveDirection?.('DOWN')}
              onPointerUp={() => onMoveDirection?.(null)}
              className="bg-slate-800/80 active:bg-red-800 text-white rounded flex items-center justify-center font-bold"
            >
              ▼
            </button>
            <div />
          </div>
        </div>

        {/* Mobile Action Buttons (Right) */}
        <div className="flex md:hidden flex-col gap-2">
          <button
            onClick={onInteract}
            className="w-14 h-14 bg-red-950/90 active:bg-red-800 border-2 border-red-600 rounded-full flex flex-col items-center justify-center text-red-100 font-bold text-xs shadow-lg"
          >
            <span>[E]</span>
            <span className="text-[9px]">ACT</span>
          </button>
          <button
            onClick={onToggleFlashlight}
            className="w-12 h-12 bg-slate-900/90 active:bg-amber-900 border border-slate-700 rounded-full flex flex-col items-center justify-center text-amber-200 text-xs shadow"
          >
            <span>[F]</span>
            <span className="text-[8px]">LIGHT</span>
          </button>
        </div>
      </div>
    </div>
  );
};
