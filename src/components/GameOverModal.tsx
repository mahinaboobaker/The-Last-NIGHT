import React from 'react';
import { soundEngine } from '../services/audio';
import { RotateCcw, Home, Skull } from 'lucide-react';

interface GameOverModalProps {
  onRestart: () => void;
  onMainMenu: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({ onRestart, onMainMenu }) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/95 flex flex-col items-center justify-center p-6 text-center select-none overflow-hidden">
      {/* Ghost Spectral jumpscare silhouette */}
      <div className="absolute inset-0 pointer-events-none opacity-30 flex items-center justify-center">
        <img
          src="/src/assets/images/hostel_ghost_spectral_1793675406566.jpg"
          alt="Ghost"
          className="w-full h-full object-cover filter contrast-200 grayscale"
          referrerPolicy="no-referrer"
        />
      </div>

      {/* Red pulse and scanline overlay */}
      <div className="absolute inset-0 bg-radial from-red-950/40 via-black/80 to-black pointer-events-none" />
      <div className="absolute inset-0 crt-overlay opacity-90 pointer-events-none" />

      <div className="relative z-10 max-w-md space-y-4">
        <div className="inline-flex p-3 bg-red-950/80 border border-red-700 rounded-full text-red-500 animate-bounce">
          <Skull className="w-8 h-8" />
        </div>

        <h1 className="text-4xl sm:text-5xl font-cinzel font-black tracking-widest text-red-600 drop-shadow-[0_0_20px_rgba(220,38,38,0.8)]">
          YOU DIED
        </h1>

        <p className="text-sm font-serif italic text-slate-300">
          The spectral chill pierced your chest. Your scream echoed through the desolate corridors, unanswered.
        </p>

        <div className="text-xs font-mono-tech text-red-400/80 bg-black/60 border border-red-900/60 p-2.5 rounded">
          ENDING 3: TRAPPED FOREVER · ANOTHER SOUL FOR THE HOSTEL
        </div>

        <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => {
              soundEngine.playFootstep();
              onRestart();
            }}
            className="flex items-center justify-center gap-2 px-5 py-3 bg-red-950 hover:bg-red-900 border border-red-600 text-red-100 font-cinzel font-bold text-xs rounded-lg transition-colors shadow-lg"
          >
            <RotateCcw className="w-4 h-4" /> RETRY CHECKPOINT
          </button>
          <button
            onClick={() => {
              soundEngine.playFootstep();
              onMainMenu();
            }}
            className="flex items-center justify-center gap-2 px-5 py-3 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 font-cinzel font-bold text-xs rounded-lg transition-colors"
          >
            <Home className="w-4 h-4" /> MAIN MENU
          </button>
        </div>
      </div>
    </div>
  );
};
