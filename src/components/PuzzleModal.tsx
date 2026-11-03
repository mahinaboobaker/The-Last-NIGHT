import React, { useState } from 'react';
import { soundEngine } from '../services/audio';
import { X, CheckCircle, RotateCcw, Zap, Key, Image, Lock, FileText, BookOpen } from 'lucide-react';

interface PuzzleModalProps {
  puzzleId: 'LOCKER_CODE' | 'PHOTO_ARRANGE' | 'DOCUMENT_CIPHER' | 'CIRCUIT_BREAKER' | 'BOOKSHELF';
  onSolved: (puzzleId: string) => void;
  onClose: () => void;
}

export const PuzzleModal: React.FC<PuzzleModalProps> = ({ puzzleId, onSolved, onClose }) => {
  // Puzzle 1: 4-digit code (1-2-4-8)
  const [digits, setDigits] = useState<string[]>(['0', '0', '0', '0']);
  const [codeFeedback, setCodeFeedback] = useState<string | null>(null);

  // Puzzle 2: Photo arrangement (Indices 0, 1, 2, 3)
  const initialPhotos = [
    { id: 2, title: 'The Protest (Oct 1994)', desc: 'Students gather outside Warden Sterling’s office over missing grant funds.' },
    { id: 0, title: 'Freshman Admission (Aug 1994)', desc: 'Maya Lin smiles receiving her honors enrollment badge.' },
    { id: 3, title: 'The Padlocked Gates (Nov 1994)', desc: 'Hostel sealed shut by university authorities at midnight.' },
    { id: 1, title: 'Basement Excavation (Sep 1994)', desc: 'Unregistered construction work beneath the east wing.' },
  ];
  const [photoOrder, setPhotoOrder] = useState<number[]>([2, 0, 3, 1]);
  const [selectedPhotoIdx, setSelectedPhotoIdx] = useState<number | null>(null);

  // Puzzle 3: Document Cipher (Audit safe 3-digit code: 3-9-4)
  const [uvActive, setUvActive] = useState(false);
  const [cipherInput, setCipherInput] = useState('');
  const [cipherError, setCipherError] = useState(false);

  // Puzzle 4: Circuit breaker switches
  // Target sequence: Blue, Red, Green, Yellow, White (IDs: 0, 1, 2, 3, 4)
  const switchLabels = [
    { id: 0, label: 'SUB-A (Blue)', color: 'border-blue-500 text-blue-400 bg-blue-950/40' },
    { id: 1, label: 'MAIN-B (Red)', color: 'border-red-500 text-red-400 bg-red-950/40' },
    { id: 2, label: 'VENT-C (Green)', color: 'border-emerald-500 text-emerald-400 bg-emerald-950/40' },
    { id: 3, label: 'LIGHT-D (Yellow)', color: 'border-amber-500 text-amber-400 bg-amber-950/40' },
    { id: 4, label: 'RELAY-E (White)', color: 'border-slate-300 text-slate-200 bg-slate-800/40' },
  ];
  const [activeSwitches, setActiveSwitches] = useState<number[]>([]);
  const [breakerError, setBreakerError] = useState(false);

  // Puzzle 5: Bookshelf symbols (SUN, OWLS, KEY)
  const availableEmblems = ['MOON', 'SUN', 'SERPENT', 'OWLS', 'SKULL', 'KEY'];
  const [bookshelfSlots, setBookshelfSlots] = useState<string[]>(['MOON', 'SERPENT', 'SKULL']);

  // Handle Puzzle 1 Submit
  const handleDigitChange = (index: number, delta: number) => {
    soundEngine.playFootstep();
    setDigits(prev => {
      const next = [...prev];
      const val = (parseInt(next[index], 10) + delta + 10) % 10;
      next[index] = val.toString();
      return next;
    });
  };

  const verifyLockerCode = () => {
    const code = digits.join('');
    if (code === '1248') {
      soundEngine.playPuzzleSolve();
      setCodeFeedback('ACCESS GRANTED · LOCK COMPARTMENT OPENED');
      setTimeout(() => {
        onSolved('LOCKER_CODE');
      }, 1400);
    } else {
      soundEngine.playDoor(false);
      setCodeFeedback('ACCESS DENIED · INCORRECT COMBINATION');
    }
  };

  // Handle Puzzle 2 Photo Swap
  const handlePhotoClick = (index: number) => {
    soundEngine.playFootstep();
    if (selectedPhotoIdx === null) {
      setSelectedPhotoIdx(index);
    } else {
      // Swap items
      const nextOrder = [...photoOrder];
      const temp = nextOrder[selectedPhotoIdx];
      nextOrder[selectedPhotoIdx] = nextOrder[index];
      nextOrder[index] = temp;
      setPhotoOrder(nextOrder);
      setSelectedPhotoIdx(null);

      // Check if correctly arranged 0, 1, 2, 3
      if (nextOrder[0] === 0 && nextOrder[1] === 1 && nextOrder[2] === 2 && nextOrder[3] === 3) {
        soundEngine.playPuzzleSolve();
        setTimeout(() => {
          onSolved('PHOTO_ARRANGE');
        }, 1200);
      }
    }
  };

  // Handle Puzzle 3 Submit
  const handleCipherSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (cipherInput.trim() === '394') {
      soundEngine.playPuzzleSolve();
      setTimeout(() => {
        onSolved('DOCUMENT_CIPHER');
      }, 1200);
    } else {
      soundEngine.playDoor(false);
      setCipherError(true);
      setTimeout(() => setCipherError(false), 1500);
    }
  };

  // Handle Puzzle 4 Switch Click
  const handleSwitchFlip = (switchId: number) => {
    soundEngine.playFlashlightClick();
    if (activeSwitches.includes(switchId)) return;

    const next = [...activeSwitches, switchId];
    setActiveSwitches(next);

    const expectedOrder = [0, 1, 2, 3, 4];
    const currentIndex = next.length - 1;

    if (next[currentIndex] !== expectedOrder[currentIndex]) {
      // Wrong sequence!
      soundEngine.playDoor(false);
      setBreakerError(true);
      setTimeout(() => {
        setActiveSwitches([]);
        setBreakerError(false);
      }, 1000);
    } else if (next.length === 5) {
      // Success!
      soundEngine.playPuzzleSolve();
      setTimeout(() => {
        onSolved('CIRCUIT_BREAKER');
      }, 1200);
    }
  };

  // Handle Puzzle 5 Bookshelf Rotation
  const cycleBookshelfSlot = (slotIdx: number) => {
    soundEngine.playFootstep();
    setBookshelfSlots(prev => {
      const next = [...prev];
      const cur = next[slotIdx];
      const curIdx = availableEmblems.indexOf(cur);
      const nextIdx = (curIdx + 1) % availableEmblems.length;
      next[slotIdx] = availableEmblems[nextIdx];

      // Check solution: SUN, OWLS, KEY
      if (next[0] === 'SUN' && next[1] === 'OWLS' && next[2] === 'KEY') {
        soundEngine.playPuzzleSolve();
        setTimeout(() => {
          onSolved('BOOKSHELF');
        }, 1400);
      }

      return next;
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="relative w-full max-w-xl bg-slate-950 border border-slate-800 rounded-xl shadow-2xl overflow-hidden p-6 text-slate-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-950/60 border border-red-800/60 rounded text-red-400">
              {puzzleId === 'LOCKER_CODE' && <Lock className="w-5 h-5" />}
              {puzzleId === 'PHOTO_ARRANGE' && <Image className="w-5 h-5" />}
              {puzzleId === 'DOCUMENT_CIPHER' && <FileText className="w-5 h-5" />}
              {puzzleId === 'CIRCUIT_BREAKER' && <Zap className="w-5 h-5" />}
              {puzzleId === 'BOOKSHELF' && <BookOpen className="w-5 h-5" />}
            </div>
            <div>
              <h2 className="text-lg font-cinzel font-bold text-slate-100">
                {puzzleId === 'LOCKER_CODE' && 'PUZZLE 1: LOCKER COMBINATION'}
                {puzzleId === 'PHOTO_ARRANGE' && 'PUZZLE 2: CHRONOLOGICAL ARCHIVE'}
                {puzzleId === 'DOCUMENT_CIPHER' && 'PUZZLE 3: AUDIT CIPHER'}
                {puzzleId === 'CIRCUIT_BREAKER' && 'PUZZLE 4: ELECTRICAL SEQUENCE'}
                {puzzleId === 'BOOKSHELF' && 'PUZZLE 5: WARDEN’S EMBLEM CIPHER'}
              </h2>
              <p className="text-xs text-slate-400">Examine the clues found in the hostel</p>
            </div>
          </div>
          <button
            onClick={() => {
              soundEngine.playFootstep();
              onClose();
            }}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-900 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Puzzle Content */}
        <div className="py-6">
          {/* PUZZLE 1: 4-digit code */}
          {puzzleId === 'LOCKER_CODE' && (
            <div className="space-y-6 text-center">
              <p className="text-sm text-slate-300">
                Enter the 4-digit numeric code to unlock the student locker compartment.
              </p>

              <div className="flex justify-center gap-3">
                {digits.map((digit, i) => (
                  <div key={i} className="flex flex-col items-center gap-2">
                    <button
                      onClick={() => handleDigitChange(i, 1)}
                      className="w-12 h-9 bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded text-slate-200 font-bold"
                    >
                      ▲
                    </button>
                    <div className="w-14 h-16 bg-black border-2 border-slate-600 rounded flex items-center justify-center text-3xl font-mono-tech text-amber-400 shadow-inner">
                      {digit}
                    </div>
                    <button
                      onClick={() => handleDigitChange(i, -1)}
                      className="w-12 h-9 bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded text-slate-200 font-bold"
                    >
                      ▼
                    </button>
                  </div>
                ))}
              </div>

              {codeFeedback && (
                <div
                  className={`text-xs font-mono-tech py-2 px-3 rounded ${
                    codeFeedback.includes('GRANTED')
                      ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800'
                      : 'bg-red-950/60 text-red-400 border border-red-800'
                  }`}
                >
                  {codeFeedback}
                </div>
              )}

              <div className="text-xs text-slate-500 italic">
                Clue: The grandfather clock stopped at 12:00. Maya's note mentioned the minute marker 48.
              </div>

              <button
                onClick={verifyLockerCode}
                className="w-full py-2.5 bg-red-950 hover:bg-red-900 border border-red-700 text-red-200 font-medium rounded-lg transition-colors"
              >
                DISENGAGE LOCK
              </button>
            </div>
          )}

          {/* PUZZLE 2: Photo arrangement */}
          {puzzleId === 'PHOTO_ARRANGE' && (
            <div className="space-y-4">
              <p className="text-sm text-slate-300">
                Click any two photographs to swap their chronological positions. Order them from earliest event (Aug 1994) to final lockdown (Nov 1994).
              </p>

              <div className="grid grid-cols-2 gap-3">
                {photoOrder.map((photoId, idx) => {
                  const photo = initialPhotos.find(p => p.id === photoId)!;
                  const isSelected = selectedPhotoIdx === idx;
                  const isCorrect = photoId === idx;

                  return (
                    <button
                      key={idx}
                      onClick={() => handlePhotoClick(idx)}
                      className={`text-left p-3 rounded-lg border transition-all ${
                        isSelected
                          ? 'border-amber-400 bg-amber-950/30 ring-2 ring-amber-400/50'
                          : isCorrect
                          ? 'border-emerald-600/60 bg-emerald-950/20'
                          : 'border-slate-800 bg-slate-900/60 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-mono-tech text-amber-500">Timeline Slot #{idx + 1}</span>
                        {isCorrect && <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />}
                      </div>
                      <div className="text-xs font-bold text-slate-200">{photo.title}</div>
                      <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">{photo.desc}</p>
                    </button>
                  );
                })}
              </div>

              <div className="text-center text-xs text-slate-500">
                {photoOrder.every((p, idx) => p === idx) ? (
                  <span className="text-emerald-400 font-medium">Timeline verified! Secret compartment unlocked.</span>
                ) : (
                  'Swap cards until the tragedy is chronicled in order.'
                )}
              </div>
            </div>
          )}

          {/* PUZZLE 3: Document Cipher */}
          {puzzleId === 'DOCUMENT_CIPHER' && (
            <div className="space-y-4">
              <p className="text-sm text-slate-300">
                Audit documents contain hidden UV fluorescent ink notations. Use your blacklight filter to uncover the access code.
              </p>

              <div
                className={`relative p-5 rounded-lg border transition-all ${
                  uvActive
                    ? 'bg-purple-950/40 border-purple-600 text-purple-200 shadow-inner'
                    : 'bg-amber-950/20 border-amber-900/40 text-amber-200/70'
                }`}
              >
                <div className="text-xs font-mono-tech space-y-1">
                  <p>STATE EDUCATION DEPARTMENT // AUDIT FILE RECORD # 1994</p>
                  <p>HOSTEL RESIDENCE WING - AUDITOR GENERAL REPORT</p>
                  <div className="border-t border-current/20 my-2 pt-2">
                    <p>Routine inspection logged on November 1st.</p>
                    {uvActive ? (
                      <p className="text-purple-300 font-bold tracking-widest text-base py-1">
                        CONFIDENTIAL VAULT NUMBER: [ 3 9 4 ]
                      </p>
                    ) : (
                      <p className="text-slate-500 italic">
                        [Text obscured by heavy grease and coffee stain. Need UV light to expose invisible chemical dye.]
                      </p>
                    )}
                    <p>Warden Sterling was not present during evening roll call.</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    soundEngine.playFlashlightClick();
                    setUvActive(!uvActive);
                  }}
                  className={`flex-1 py-2 px-3 text-xs font-semibold rounded border transition-colors ${
                    uvActive
                      ? 'bg-purple-900 text-purple-100 border-purple-500'
                      : 'bg-slate-900 text-slate-300 border-slate-700 hover:bg-slate-800'
                  }`}
                >
                  {uvActive ? 'TOGGLE UV BLACKLIGHT: ON' : 'TOGGLE UV BLACKLIGHT: OFF'}
                </button>
              </div>

              <form onSubmit={handleCipherSubmit} className="flex gap-2 pt-2">
                <input
                  type="text"
                  maxLength={3}
                  value={cipherInput}
                  onChange={e => setCipherInput(e.target.value.replace(/\D/g, ''))}
                  placeholder="Enter 3-digit code"
                  className="flex-1 bg-black border border-slate-700 rounded px-3 py-2 text-center font-mono-tech text-amber-400 placeholder-slate-600 focus:outline-none focus:border-amber-500"
                />
                <button
                  type="submit"
                  className="px-5 py-2 bg-red-950 hover:bg-red-900 border border-red-700 text-red-200 text-xs font-bold rounded transition-colors"
                >
                  UNLOCK
                </button>
              </form>

              {cipherError && (
                <p className="text-xs text-red-400 text-center font-mono-tech">
                  CODE INCORRECT · AUDIT CIPHER REJECTED
                </p>
              )}
            </div>
          )}

          {/* PUZZLE 4: Circuit Breaker Sequence */}
          {puzzleId === 'CIRCUIT_BREAKER' && (
            <div className="space-y-4">
              <p className="text-sm text-slate-300">
                Flip the circuit levers in Maya Lin’s journal bypass order:
                <strong className="text-amber-400 ml-1">Blue → Red → Green → Yellow → White</strong>.
              </p>

              <div className="grid grid-cols-5 gap-2">
                {switchLabels.map(sw => {
                  const isFlipped = activeSwitches.includes(sw.id);
                  return (
                    <button
                      key={sw.id}
                      onClick={() => handleSwitchFlip(sw.id)}
                      disabled={isFlipped}
                      className={`h-24 rounded border flex flex-col items-center justify-between p-2 transition-all ${sw.color} ${
                        isFlipped ? 'opacity-40 translate-y-1' : 'hover:brightness-125'
                      }`}
                    >
                      <span className="text-[10px] font-mono-tech font-bold">{sw.label}</span>
                      <div
                        className={`w-4 h-10 rounded-sm border ${
                          isFlipped ? 'bg-emerald-500 border-emerald-300' : 'bg-slate-700 border-slate-500'
                        }`}
                      />
                      <span className="text-[9px] font-mono-tech">{isFlipped ? 'ON' : 'OFF'}</span>
                    </button>
                  );
                })}
              </div>

              {breakerError && (
                <div className="p-2 rounded bg-red-950/80 border border-red-800 text-xs text-red-400 text-center font-mono-tech">
                  SHORT CIRCUIT! SEQUENCE FAILED · RESETTING BREAKERS...
                </div>
              )}

              <div className="flex justify-between items-center text-xs text-slate-400 pt-2">
                <span>Levers Flipped: {activeSwitches.length} / 5</span>
                <button
                  onClick={() => {
                    soundEngine.playFlashlightClick();
                    setActiveSwitches([]);
                  }}
                  className="flex items-center gap-1 hover:text-white"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Reset
                </button>
              </div>
            </div>
          )}

          {/* PUZZLE 5: Bookshelf mechanism */}
          {puzzleId === 'BOOKSHELF' && (
            <div className="space-y-5">
              <p className="text-sm text-slate-300">
                Warden Sterling hidden shelf mechanism. Click each emblem book cylinder to cycle through heraldic symbols until the lock mechanism disengages.
              </p>

              <div className="flex justify-center gap-6 py-2">
                {bookshelfSlots.map((emblem, slotIdx) => (
                  <div key={slotIdx} className="flex flex-col items-center gap-2">
                    <span className="text-xs text-slate-400 font-mono-tech">Cylinder {slotIdx + 1}</span>
                    <button
                      onClick={() => cycleBookshelfSlot(slotIdx)}
                      className="w-24 h-24 bg-gradient-to-b from-slate-900 to-black border-2 border-amber-700/60 hover:border-amber-500 rounded-lg flex flex-col items-center justify-center p-2 text-amber-300 font-cinzel font-bold text-sm shadow-lg transition-colors"
                    >
                      <span className="text-2xl mb-1">
                        {emblem === 'SUN' && '☀️'}
                        {emblem === 'OWLS' && '🦉'}
                        {emblem === 'KEY' && '🗝️'}
                        {emblem === 'MOON' && '🌙'}
                        {emblem === 'SERPENT' && '🐍'}
                        {emblem === 'SKULL' && '💀'}
                      </span>
                      {emblem}
                    </button>
                    <span className="text-[10px] text-slate-500">Click to rotate</span>
                  </div>
                ))}
              </div>

              <div className="text-center text-xs text-slate-400 italic">
                Clue from State Audit Document: "The order aligns with SUN, OWLS, and the KEY."
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
