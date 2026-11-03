import React, { useState } from 'react';
import { soundEngine } from '../services/audio';
import { ChevronRight, X } from 'lucide-react';

interface DialogueModalProps {
  title: string;
  lines: string[];
  onClose: () => void;
}

export const DialogueModal: React.FC<DialogueModalProps> = ({ title, lines, onClose }) => {
  const [currentLineIdx, setCurrentLineIdx] = useState(0);

  const handleNext = () => {
    soundEngine.playFootstep();
    if (currentLineIdx < lines.length - 1) {
      setCurrentLineIdx(currentLineIdx + 1);
    } else {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-end justify-center p-4 sm:p-8 select-none">
      <div className="w-full max-w-2xl bg-slate-950/95 border border-slate-800 rounded-xl p-5 shadow-2xl relative text-slate-200">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800 mb-3">
          <div className="text-xs font-mono-tech text-amber-500 font-bold uppercase tracking-wider">
            {title}
          </div>
          <button
            onClick={() => {
              soundEngine.playFootstep();
              onClose();
            }}
            className="text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-sm font-serif italic leading-relaxed text-slate-100 min-h-[4rem]">
          {lines[currentLineIdx]}
        </p>

        <div className="flex justify-between items-center pt-3 border-t border-slate-900 mt-3 text-xs text-slate-500 font-mono-tech">
          <span>{currentLineIdx + 1} / {lines.length}</span>
          <button
            onClick={handleNext}
            className="flex items-center gap-1.5 px-4 py-1.5 bg-red-950 hover:bg-red-900 border border-red-700 rounded text-red-200 font-bold text-xs transition-colors"
          >
            {currentLineIdx < lines.length - 1 ? 'NEXT' : 'CLOSE'}
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
