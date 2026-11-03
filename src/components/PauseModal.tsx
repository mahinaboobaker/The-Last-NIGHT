import React from 'react';
import { soundEngine } from '../services/audio';
import { Play, RotateCcw, Home, Settings, BookOpen } from 'lucide-react';

interface PauseModalProps {
  onResume: () => void;
  onRestart: () => void;
  onSettings: () => void;
  onHowToPlay: () => void;
  onMainMenu: () => void;
}

export const PauseModal: React.FC<PauseModalProps> = ({
  onResume,
  onRestart,
  onSettings,
  onHowToPlay,
  onMainMenu
}) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 select-none">
      <div className="relative w-full max-w-sm bg-slate-950 border border-slate-800 rounded-xl p-6 shadow-2xl text-slate-200 text-center space-y-5">
        <h2 className="text-xl font-cinzel font-bold text-slate-100 tracking-wider">GAME PAUSED</h2>

        <div className="flex flex-col gap-2.5">
          <button
            onClick={() => {
              soundEngine.playFootstep();
              onResume();
            }}
            className="flex items-center justify-center gap-2 py-3 bg-red-950 hover:bg-red-900 border border-red-700 text-red-100 rounded-lg font-cinzel font-bold text-xs transition-colors shadow-lg"
          >
            <Play className="w-4 h-4 fill-current" /> RESUME GAME
          </button>

          <button
            onClick={() => {
              soundEngine.playFootstep();
              onRestart();
            }}
            className="flex items-center justify-center gap-2 py-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 rounded-lg text-xs font-mono-tech transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" /> RESTART ROOM / CHECKPOINT
          </button>

          <button
            onClick={() => {
              soundEngine.playFootstep();
              onHowToPlay();
            }}
            className="flex items-center justify-center gap-2 py-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 rounded-lg text-xs font-mono-tech transition-colors"
          >
            <BookOpen className="w-3.5 h-3.5" /> CONTROLS & OBJECTIVES
          </button>

          <button
            onClick={() => {
              soundEngine.playFootstep();
              onSettings();
            }}
            className="flex items-center justify-center gap-2 py-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 rounded-lg text-xs font-mono-tech transition-colors"
          >
            <Settings className="w-3.5 h-3.5" /> AUDIO SETTINGS
          </button>

          <button
            onClick={() => {
              soundEngine.playFootstep();
              onMainMenu();
            }}
            className="flex items-center justify-center gap-2 py-2.5 bg-black/60 hover:bg-slate-900 border border-slate-800 text-slate-400 hover:text-white rounded-lg text-xs font-mono-tech transition-colors"
          >
            <Home className="w-3.5 h-3.5" /> QUIT TO MAIN MENU
          </button>
        </div>
      </div>
    </div>
  );
};
