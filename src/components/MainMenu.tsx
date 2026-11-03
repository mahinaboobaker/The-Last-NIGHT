import React, { useState } from 'react';
import { soundEngine } from '../services/audio';
import { storageService } from '../services/storage';
import { Volume2, VolumeX, Play, RotateCcw, BookOpen, Settings, Award } from 'lucide-react';

interface MainMenuProps {
  onNewGame: () => void;
  onContinue: () => void;
  onHowToPlay: () => void;
  onSettings: () => void;
  onCredits: () => void;
}

export const MainMenu: React.FC<MainMenuProps> = ({
  onNewGame,
  onContinue,
  onHowToPlay,
  onSettings,
  onCredits
}) => {
  const hasSave = storageService.hasSave();
  const [isMuted, setIsMuted] = useState(false);

  const toggleSound = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    soundEngine.setVolumes(0.8, 0.6, 0.9, nextMuted);
    if (!nextMuted) {
      soundEngine.startAmbient();
    }
  };

  const handleStartAmbient = () => {
    soundEngine.startAmbient();
  };

  return (
    <div
      onClick={handleStartAmbient}
      className="relative w-screen h-screen overflow-hidden bg-black flex flex-col justify-between p-8 select-none"
    >
      {/* Background Cinematic Art with Fallback */}
      <div className="absolute inset-0 z-0">
        <img
          src="/src/assets/images/hostel_menu_backdrop_1793675404749.jpg"
          alt="Haunted Hostel Corridor"
          className="w-full h-full object-cover filter brightness-75 contrast-125 scale-105 animate-pulse"
          style={{ animationDuration: '6s' }}
          referrerPolicy="no-referrer"
        />
        {/* Dark Vignette Overlay */}
        <div className="absolute inset-0 bg-radial from-transparent via-black/60 to-black pointer-events-none" />
        {/* Fog & scanline overlay */}
        <div className="absolute inset-0 crt-overlay opacity-80" />
      </div>

      {/* Header Sound Toggle */}
      <div className="relative z-10 flex justify-between items-center">
        <div className="text-xs font-mono-tech tracking-widest text-red-500 uppercase flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-red-600 animate-ping" />
          MIDNIGHT AT ST. JUDE'S HOSTEL · 12:00 AM
        </div>
        <button
          onClick={toggleSound}
          className="flex items-center gap-2 px-3 py-1.5 bg-black/60 border border-slate-700/80 rounded-lg text-xs font-mono-tech text-slate-300 hover:text-white hover:border-slate-500 transition-colors"
        >
          {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
          {isMuted ? 'UNMUTE AUDIO' : 'AUDIO ACTIVE'}
        </button>
      </div>

      {/* Title & Tagline */}
      <div className="relative z-10 max-w-2xl my-auto">
        <div className="space-y-1">
          <div className="text-xs font-mono-tech tracking-widest text-slate-400 uppercase">
            AN INDIE SURVIVAL HORROR EXPERIENCE
          </div>
          <h1 className="text-4xl sm:text-6xl font-cinzel font-black tracking-wider text-slate-100 drop-shadow-[0_4px_16px_rgba(239,68,68,0.7)] animate-flicker">
            THE LAST NIGHT
          </h1>
          <h2 className="text-2xl sm:text-3xl font-cinzel font-bold text-red-600 tracking-widest drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]">
            HAUNTED HOSTEL
          </h2>
        </div>

        <p className="mt-4 text-sm text-slate-300 font-serif italic max-w-lg border-l-2 border-red-700 pl-4 py-1 bg-black/40">
          “One Hostel. Five Keys. Countless Secrets. One Way Out.”
        </p>

        {/* Menu Buttons */}
        <div className="mt-8 flex flex-col gap-3 max-w-xs">
          <button
            onClick={() => {
              soundEngine.playFootstep();
              onNewGame();
            }}
            className="group relative flex items-center justify-between px-5 py-3 bg-red-950/80 hover:bg-red-900 border border-red-700/80 rounded-lg text-slate-100 font-cinzel font-bold text-sm tracking-wider transition-all shadow-lg hover:shadow-red-950/50 hover:translate-x-1"
          >
            <span className="flex items-center gap-2">
              <Play className="w-4 h-4 text-red-400 fill-red-400" /> NEW GAME
            </span>
            <span className="text-xs font-mono-tech text-red-400 opacity-0 group-hover:opacity-100 transition-opacity">
              [START]
            </span>
          </button>

          {hasSave && (
            <button
              onClick={() => {
                soundEngine.playFootstep();
                onContinue();
              }}
              className="group relative flex items-center justify-between px-5 py-3 bg-slate-900/80 hover:bg-slate-800 border border-slate-700/80 rounded-lg text-slate-200 font-cinzel font-bold text-sm tracking-wider transition-all hover:translate-x-1"
            >
              <span className="flex items-center gap-2">
                <RotateCcw className="w-4 h-4 text-amber-400" /> CONTINUE
              </span>
              <span className="text-xs font-mono-tech text-amber-400 opacity-0 group-hover:opacity-100 transition-opacity">
                [RESUME]
              </span>
            </button>
          )}

          <button
            onClick={() => {
              soundEngine.playFootstep();
              onHowToPlay();
            }}
            className="group relative flex items-center justify-between px-5 py-2.5 bg-black/60 hover:bg-slate-900/80 border border-slate-800 rounded-lg text-slate-300 font-cinzel text-xs tracking-wider transition-all hover:translate-x-1"
          >
            <span className="flex items-center gap-2">
              <BookOpen className="w-3.5 h-3.5 text-slate-400" /> HOW TO PLAY
            </span>
          </button>

          <button
            onClick={() => {
              soundEngine.playFootstep();
              onSettings();
            }}
            className="group relative flex items-center justify-between px-5 py-2.5 bg-black/60 hover:bg-slate-900/80 border border-slate-800 rounded-lg text-slate-300 font-cinzel text-xs tracking-wider transition-all hover:translate-x-1"
          >
            <span className="flex items-center gap-2">
              <Settings className="w-3.5 h-3.5 text-slate-400" /> SETTINGS
            </span>
          </button>

          <button
            onClick={() => {
              soundEngine.playFootstep();
              onCredits();
            }}
            className="group relative flex items-center justify-between px-5 py-2.5 bg-black/60 hover:bg-slate-900/80 border border-slate-800 rounded-lg text-slate-300 font-cinzel text-xs tracking-wider transition-all hover:translate-x-1"
          >
            <span className="flex items-center gap-2">
              <Award className="w-3.5 h-3.5 text-slate-400" /> CREDITS & LORE
            </span>
          </button>
        </div>
      </div>

      {/* Footer Tagline & Warning */}
      <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center text-[11px] text-slate-500 font-mono-tech border-t border-slate-800/80 pt-3">
        <span>“Some secrets should never be unlocked.”</span>
        <span>Headphones strongly recommended for 3D positional horror audio.</span>
      </div>
    </div>
  );
};
