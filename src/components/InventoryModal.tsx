import React, { useState } from 'react';
import { Item } from '../types/game';
import { soundEngine } from '../services/audio';
import { X, Key, FileText, Battery, PlusCircle, Image, Sparkles } from 'lucide-react';

interface InventoryModalProps {
  items: Item[];
  collectedKeys: string[];
  battery: number;
  health: number;
  onUseItem: (item: Item) => void;
  onClose: () => void;
}

export const InventoryModal: React.FC<InventoryModalProps> = ({
  items,
  collectedKeys,
  battery,
  health,
  onUseItem,
  onClose
}) => {
  const [selectedItem, setSelectedItem] = useState<Item | null>(items[0] || null);

  const getCategoryIcon = (category: Item['category']) => {
    switch (category) {
      case 'KEY': return <Key className="w-4 h-4 text-amber-400" />;
      case 'DIARY': return <FileText className="w-4 h-4 text-yellow-200" />;
      case 'DOCUMENT': return <FileText className="w-4 h-4 text-blue-300" />;
      case 'SUPPLY': return <Battery className="w-4 h-4 text-emerald-400" />;
      case 'PHOTO': return <Image className="w-4 h-4 text-purple-300" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="relative w-full max-w-2xl bg-slate-950 border border-slate-800 rounded-xl shadow-2xl overflow-hidden flex flex-col text-slate-200 max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-900/40">
          <div className="flex items-center gap-3">
            <span className="text-xl">🎒</span>
            <div>
              <h2 className="text-base font-cinzel font-bold text-slate-100">STUDENT BACKPACK INVENTORY</h2>
              <p className="text-xs text-slate-400">Keys Collected: {collectedKeys.length}/5 · Health: {health}% · Battery: {Math.round(battery)}%</p>
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

        {/* Body Split */}
        <div className="flex-1 overflow-hidden grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-800">
          {/* Item Grid */}
          <div className="p-4 overflow-y-auto space-y-2 max-h-96">
            <div className="text-xs font-mono-tech text-slate-400 uppercase tracking-wider mb-2">
              Collected Belongings ({items.length})
            </div>

            {items.length === 0 ? (
              <div className="text-xs text-slate-500 italic p-6 text-center">
                Your backpack is empty. Search desks, lockers, and shelves throughout the hostel.
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-2">
                {items.map(item => {
                  const isSelected = selectedItem?.id === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        soundEngine.playFootstep();
                        setSelectedItem(item);
                      }}
                      className={`flex items-center gap-3 p-2.5 rounded-lg border text-left transition-all ${
                        isSelected
                          ? 'bg-amber-950/30 border-amber-500/70 text-amber-200'
                          : 'bg-slate-900/50 border-slate-800 hover:border-slate-700 text-slate-300'
                      }`}
                    >
                      <div className="w-9 h-9 rounded bg-black/60 border border-slate-800 flex items-center justify-center text-lg shrink-0">
                        {item.icon}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-semibold truncate flex items-center gap-1.5">
                          {item.name}
                        </div>
                        <div className="text-[11px] text-slate-400 truncate flex items-center gap-1">
                          {getCategoryIcon(item.category)}
                          <span>{item.category}</span>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Item Details View */}
          <div className="p-5 flex flex-col justify-between overflow-y-auto bg-slate-900/20 max-h-96">
            {selectedItem ? (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-black border border-slate-700 flex items-center justify-center text-2xl shadow-inner">
                    {selectedItem.icon}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-100">{selectedItem.name}</h3>
                    <div className="text-xs text-amber-500 font-mono-tech">
                      CATEGORY: {selectedItem.category}
                    </div>
                  </div>
                </div>

                <div className="text-xs text-slate-300 leading-relaxed bg-black/40 p-3 rounded border border-slate-800">
                  {selectedItem.description}
                </div>

                {selectedItem.loreText && (
                  <div className="bg-amber-950/20 border border-amber-900/40 p-3 rounded text-xs text-amber-200/90 font-serif italic space-y-1">
                    <div className="text-[10px] font-mono-tech font-bold uppercase text-amber-400 tracking-wider">
                      Document Transcript:
                    </div>
                    <div>{selectedItem.loreText}</div>
                  </div>
                )}
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-slate-500 italic">
                Select an item to inspect details.
              </div>
            )}

            {selectedItem?.usable && (
              <div className="pt-4 border-t border-slate-800 mt-4">
                <button
                  onClick={() => {
                    if (selectedItem) {
                      onUseItem(selectedItem);
                    }
                  }}
                  className="w-full py-2 bg-emerald-900 hover:bg-emerald-800 border border-emerald-600 text-emerald-100 font-bold text-xs rounded transition-colors"
                >
                  USE ITEM
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
