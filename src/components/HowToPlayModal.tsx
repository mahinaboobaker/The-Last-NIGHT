import React from 'react';
import { X, Shield, Eye, Key, Battery, Heart } from 'lucide-react';

interface HowToPlayModalProps {
  onClose: () => void;
}

export const HowToPlayModal: React.FC<HowToPlayModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="relative w-full max-w-xl bg-slate-950 border border-slate-800 rounded-xl p-6 shadow-2xl text-slate-200 space-y-5 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <h2 className="text-base font-cinzel font-bold text-slate-100">SURVIVAL GUIDE & CONTROLS</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Controls Grid */}
        <div className="space-y-3">
          <h3 className="text-xs font-mono-tech uppercase text-amber-500 tracking-wider">Key Controls</h3>
          <div className="grid grid-cols-2 gap-2 text-xs font-mono-tech">
            <div className="p-2.5 bg-black/50 border border-slate-800 rounded flex justify-between">
              <span className="text-slate-400">MOVE:</span>
              <span className="text-slate-100 font-bold">W, A, S, D / ARROWS</span>
            </div>
            <div className="p-2.5 bg-black/50 border border-slate-800 rounded flex justify-between">
              <span className="text-slate-400">INTERACT / HIDE:</span>
              <span className="text-slate-100 font-bold">[ E ]</span>
            </div>
            <div className="p-2.5 bg-black/50 border border-slate-800 rounded flex justify-between">
              <span className="text-slate-400">FLASHLIGHT:</span>
              <span className="text-slate-100 font-bold">[ F ]</span>
            </div>
            <div className="p-2.5 bg-black/50 border border-slate-800 rounded flex justify-between">
              <span className="text-slate-400">BACKPACK:</span>
              <span className="text-slate-100 font-bold">[ I ]</span>
            </div>
            <div className="p-2.5 bg-black/50 border border-slate-800 rounded flex justify-between">
              <span className="text-slate-400">PAUSE:</span>
              <span className="text-slate-100 font-bold">[ ESC ]</span>
            </div>
            <div className="p-2.5 bg-black/50 border border-slate-800 rounded flex justify-between">
              <span className="text-slate-400">MOBILE:</span>
              <span className="text-slate-100 font-bold">TOUCH D-PAD & BUTTONS</span>
            </div>
          </div>
        </div>

        {/* Survival Tips */}
        <div className="space-y-3 pt-2 border-t border-slate-800">
          <h3 className="text-xs font-mono-tech uppercase text-red-500 tracking-wider">Hostel Survival Directives</h3>
          <ul className="space-y-2 text-xs text-slate-300 leading-relaxed">
            <li className="flex items-start gap-2.5">
              <Eye className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span>
                <strong>Flashlight Awareness:</strong> The ghost senses your light from across long corridors. Switch off your flashlight [F] to avoid detection when entering dangerous hallways.
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <Shield className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
              <span>
                <strong>Hide in Cupboards:</strong> Tall storage lockers and alcoves allow you to press [E] to conceal yourself. The ghost will lose your trail if you hide before it reaches you.
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <Battery className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>
                <strong>Conserve Battery:</strong> Batteries deplete steadily. Look inside desks, shelves, and storage boxes for fresh D-cell batteries.
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <Key className="w-4 h-4 text-yellow-400 shrink-0 mt-0.5" />
              <span>
                <strong>Five Keys to Escape:</strong> The main double gates require 5 specific keys located in Reception, Room 101, Kitchen, Basement, and Warden’s Office.
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
