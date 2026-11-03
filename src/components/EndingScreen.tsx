import React from 'react';
import { EndingType } from '../types/game';
import { soundEngine } from '../services/audio';
import { Award, RotateCcw, Home, Sparkles } from 'lucide-react';

interface EndingScreenProps {
  endingType: EndingType;
  diaryCount: number;
  onRestart: () => void;
  onMainMenu: () => void;
}

export const EndingScreen: React.FC<EndingScreenProps> = ({
  endingType,
  diaryCount,
  onRestart,
  onMainMenu
}) => {
  const isTruthEnding = endingType === 'TRUTH';

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col justify-between p-6 sm:p-10 select-none overflow-y-auto">
      {/* Background Cutscene Art */}
      <div className="absolute inset-0 z-0">
        <img
          src={
            isTruthEnding
              ? '/src/assets/images/hostel_archive_documents_1793675407254.jpg'
              : '/src/assets/images/hostel_ending_escape_1793675406304.jpg'
          }
          alt="Ending Cutscene"
          className="w-full h-full object-cover filter brightness-50 contrast-125"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/40 pointer-events-none" />
        <div className="absolute inset-0 crt-overlay opacity-75 pointer-events-none" />
      </div>

      {/* Header */}
      <div className="relative z-10 flex items-center justify-between">
        <div className="text-xs font-mono-tech tracking-widest text-amber-500 uppercase flex items-center gap-2">
          <Award className="w-4 h-4" />
          {isTruthEnding ? 'SECRET TRUE ENDING UNLOCKED' : 'SURVIVAL ENDING UNLOCKED'}
        </div>
        <div className="text-xs font-mono-tech text-slate-400">
          DIARY ARCHIVES RECOVERED: {diaryCount} / 5
        </div>
      </div>

      {/* Center Story Text */}
      <div className="relative z-10 max-w-2xl my-auto space-y-4 bg-black/60 backdrop-blur-md p-6 rounded-xl border border-slate-800">
        {isTruthEnding ? (
          <>
            <div className="inline-block px-3 py-1 bg-amber-950/80 border border-amber-600 rounded text-amber-300 font-mono-tech text-xs font-bold">
              ENDING 2: THE TRUTH
            </div>
            <h1 className="text-3xl sm:text-5xl font-cinzel font-black tracking-wider text-amber-100">
              REST IN PEACE, MAYA
            </h1>
            <p className="text-sm font-serif text-slate-200 leading-relaxed italic">
              With all five torn diary confessions and the state audit report held firmly in your hands, the five locks on the grand iron gates gave way.
            </p>
            <p className="text-sm font-serif text-slate-200 leading-relaxed italic">
              As the cold wind rushed in from the courtyard, the ghost of Maya Lin appeared one final time. Her spectral form no longer burned with crimson anger; a soft, peaceful luminescence bathed her face. She gave a faint nod of gratitude before dissolving into the dawn mist.
            </p>
            <p className="text-xs font-mono-tech text-emerald-400">
              The crimes of Warden Sterling will finally be brought before justice. St. Jude’s Hostel is haunted no more.
            </p>
          </>
        ) : (
          <>
            <div className="inline-block px-3 py-1 bg-red-950/80 border border-red-600 rounded text-red-300 font-mono-tech text-xs font-bold">
              ENDING 1: THE ESCAPE
            </div>
            <h1 className="text-3xl sm:text-5xl font-cinzel font-black tracking-wider text-slate-100">
              THE SHADOWS REMAIN
            </h1>
            <p className="text-sm font-serif text-slate-200 leading-relaxed italic">
              You turned the fifth and final master key. The heavy chains clattered to the damp ground, and you burst through the hostel gates into the freezing midnight air.
            </p>
            <p className="text-sm font-serif text-slate-200 leading-relaxed italic">
              You ran without looking back. You survived. Yet deep inside, you know you left the dark mystery unresolved. What was the spirit trying to show you? Why did she linger in that basement?
            </p>
            <p className="text-xs font-mono-tech text-amber-400">
              Hint: Explore every room and find all 5 Torn Diary Pages to uncover the hostel's secret truth.
            </p>
          </>
        )}
      </div>

      {/* Buttons */}
      <div className="relative z-10 flex flex-col sm:flex-row gap-4 justify-center">
        <button
          onClick={() => {
            soundEngine.playFootstep();
            onRestart();
          }}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-red-950 hover:bg-red-900 border border-red-600 text-red-100 font-cinzel font-bold text-xs rounded-lg transition-colors shadow-xl"
        >
          <RotateCcw className="w-4 h-4" /> PLAY AGAIN
        </button>
        <button
          onClick={() => {
            soundEngine.playFootstep();
            onMainMenu();
          }}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-cinzel font-bold text-xs rounded-lg transition-colors"
        >
          <Home className="w-4 h-4" /> MAIN MENU
        </button>
      </div>
    </div>
  );
};
