import React from 'react';
import { X, Key, CheckCircle, HelpCircle, MapPin } from 'lucide-react';

interface KeyGuideModalProps {
  collectedKeys: string[];
  onClose: () => void;
}

export const KeyGuideModal: React.FC<KeyGuideModalProps> = ({ collectedKeys, onClose }) => {
  const keysInfo = [
    {
      id: 'key_reception',
      num: 1,
      name: 'Reception Brass Key',
      room: 'Reception Area',
      location: 'Resting on the front wooden counter desk',
      instructions: 'Walk up to the glowing brass key on the counter and press [E] (or tap/click directly on the key) to pick it up.',
      purpose: 'Unlocks the heavy service door leading from Reception into the Ground Floor Corridor.'
    },
    {
      id: 'key_room101',
      num: 2,
      name: 'Room 101 Ward Key',
      room: 'Room 101 (Off Ground Floor Corridor)',
      location: 'Locked inside the electronic student locker',
      instructions: 'Examine the locker keypad and enter the 4-digit combination: 1 2 4 8 (hinted by the 12:00 stopped clock and Maya’s note).',
      purpose: 'Unlocks the Storage Room and maintenance cabinets.'
    },
    {
      id: 'key_kitchen',
      num: 3,
      name: 'Kitchen Pantry Key',
      room: 'Abandoned Kitchen (South of Corridor)',
      location: 'Locked in the high-voltage breaker safe',
      instructions: 'Inspect the Circuit Breaker Board and flip the 5 levers in Maya’s journal bypass order: Blue → Red → Green → Yellow → White.',
      purpose: 'Disengages the heavy iron padlock barring the Central Staircase.'
    },
    {
      id: 'key_basement',
      num: 4,
      name: 'Sub-Basement Iron Key',
      room: 'Sub-Basement Vault (Down the stairs)',
      location: 'Resting upon Maya Lin’s memorial altar',
      instructions: 'Navigate down the spiral stairs past the flooded water pipes to the memorial altar and pick up the key.',
      purpose: 'Fourth key required for the Grand Exit Double Gates.'
    },
    {
      id: 'key_master',
      num: 5,
      name: 'Warden’s Master Skeleton Key',
      room: 'Warden’s Office Suite (Second Floor)',
      location: 'Hidden inside Sterling’s concealed wall vault',
      instructions: 'Inspect the antique bookcase and cycle the 3 heraldic cylinder emblems to match: SUN → OWLS → KEY.',
      purpose: 'The final master key required to open the Grand Exit and escape the hostel!'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 select-none">
      <div className="relative w-full max-w-2xl bg-slate-950 border border-slate-800 rounded-xl p-6 shadow-2xl text-slate-200 max-h-[88vh] overflow-y-auto space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-950/80 border border-amber-600/80 rounded-lg text-amber-400">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-cinzel font-bold text-slate-100">FIVE KEYS EXPEDITION GUIDE</h2>
              <p className="text-xs text-amber-400 font-mono-tech">
                Keys Acquired: {collectedKeys.length} / 5
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tip box */}
        <div className="bg-amber-950/30 border border-amber-700/50 p-3 rounded-lg text-xs text-amber-200/90 leading-relaxed font-sans">
          <strong>How to Collect:</strong> Move with <strong>WASD / Arrow Keys</strong> or <strong>click/tap the floor</strong>. When near any key, press <strong>[E]</strong>, click the <strong>on-screen button</strong>, or <strong>click directly on the key</strong> to pick it up!
        </div>

        {/* Key Cards */}
        <div className="space-y-3">
          {keysInfo.map(k => {
            const isCollected = collectedKeys.includes(k.id);
            return (
              <div
                key={k.id}
                className={`p-3.5 rounded-lg border transition-all ${
                  isCollected
                    ? 'bg-emerald-950/20 border-emerald-700/60 text-slate-300'
                    : 'bg-slate-900/40 border-slate-800 text-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono-tech font-bold text-amber-400">
                      KEY {k.num}:
                    </span>
                    <span className="text-xs font-bold text-slate-100">{k.name}</span>
                  </div>
                  {isCollected ? (
                    <span className="flex items-center gap-1 text-[11px] font-mono-tech text-emerald-400 font-bold bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800">
                      <CheckCircle className="w-3 h-3" /> COLLECTED
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-[11px] font-mono-tech text-slate-400 bg-black/60 px-2 py-0.5 rounded border border-slate-800">
                      <HelpCircle className="w-3 h-3 text-amber-500" /> NOT FOUND
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1 text-[11px] text-amber-500 font-mono-tech mb-2">
                  <MapPin className="w-3 h-3" />
                  <span>{k.room} · {k.location}</span>
                </div>

                <div className="text-xs text-slate-300 bg-black/40 p-2.5 rounded border border-slate-800/80 space-y-1">
                  <div><strong>Action:</strong> {k.instructions}</div>
                  <div className="text-slate-400 text-[11px]"><strong>Unlocks:</strong> {k.purpose}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
