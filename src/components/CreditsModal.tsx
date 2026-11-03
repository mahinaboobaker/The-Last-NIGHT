import React from 'react';
import { X, Heart, Shield, Award } from 'lucide-react';

interface CreditsModalProps {
  onClose: () => void;
}

export const CreditsModal: React.FC<CreditsModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 select-none">
      <div className="relative w-full max-w-lg bg-slate-950 border border-slate-800 rounded-xl p-6 shadow-2xl text-slate-200 space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <h2 className="text-base font-cinzel font-bold text-slate-100">CREDITS & HOSTEL LORE</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-3 text-xs leading-relaxed text-slate-300">
          <p className="font-serif italic text-amber-200/90 bg-amber-950/20 p-3 rounded border border-amber-900/40">
            “St. Jude’s College Hostel was constructed in 1892. Following the unexplained disappearance of honors scholarship student Maya Lin in November 1994, the eastern dormitory wing was permanently decommissioned.”
          </p>

          <div className="grid grid-cols-2 gap-3 pt-2 font-mono-tech">
            <div className="p-3 bg-black/40 border border-slate-800 rounded">
              <div className="text-[10px] text-slate-500 uppercase">GAME CREATION</div>
              <div className="text-slate-200 font-bold mt-0.5">Indie Horror Studios</div>
              <div className="text-[11px] text-red-400">Game Jam 2026 Edition</div>
            </div>
            <div className="p-3 bg-black/40 border border-slate-800 rounded">
              <div className="text-[10px] text-slate-500 uppercase">AUDIO SYNTHESIS</div>
              <div className="text-slate-200 font-bold mt-0.5">Web Audio Synthesizer</div>
              <div className="text-[11px] text-emerald-400">Pure Procedural SFX</div>
            </div>
          </div>

          <div className="pt-2 text-center text-slate-500 text-[11px] font-mono-tech">
            Dedicated to fans of classic survival horror: Silent Hill, Clock Tower, Corpse Party & Ib.
          </div>
        </div>
      </div>
    </div>
  );
};
