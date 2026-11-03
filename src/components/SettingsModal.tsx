import React, { useState } from 'react';
import { soundEngine } from '../services/audio';
import { storageService, GameSettings } from '../services/storage';
import { X, Volume2, VolumeX, RotateCcw } from 'lucide-react';

interface SettingsModalProps {
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ onClose }) => {
  const [settings, setSettings] = useState<GameSettings>(storageService.loadSettings());
  const [resetSaved, setResetSaved] = useState(false);

  const handleVolumeChange = (type: 'master' | 'music' | 'sfx', val: number) => {
    const updated = {
      ...settings,
      [`${type}Volume`]: val
    };
    setSettings(updated);
    storageService.saveSettings(updated);
    soundEngine.setVolumes(updated.masterVolume, updated.musicVolume, updated.sfxVolume, updated.isMuted);
  };

  const handleToggleMute = () => {
    const nextMuted = !settings.isMuted;
    const updated = { ...settings, isMuted: nextMuted };
    setSettings(updated);
    storageService.saveSettings(updated);
    soundEngine.setVolumes(updated.masterVolume, updated.musicVolume, updated.sfxVolume, nextMuted);
  };

  const handleClearSave = () => {
    storageService.clearSave();
    setResetSaved(true);
    setTimeout(() => setResetSaved(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="relative w-full max-w-md bg-slate-950 border border-slate-800 rounded-xl p-6 shadow-2xl text-slate-200 space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <h2 className="text-base font-cinzel font-bold text-slate-100">AUDIO & GAME SETTINGS</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Master Mute */}
        <div className="flex items-center justify-between">
          <span className="text-sm">Audio Sound Effects</span>
          <button
            onClick={handleToggleMute}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-mono-tech ${
              settings.isMuted
                ? 'bg-red-950/60 border-red-700 text-red-400'
                : 'bg-emerald-950/60 border-emerald-700 text-emerald-400'
            }`}
          >
            {settings.isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            {settings.isMuted ? 'MUTED' : 'ENABLED'}
          </button>
        </div>

        {/* Sliders */}
        <div className="space-y-4 text-xs font-mono-tech">
          <div>
            <div className="flex justify-between mb-1">
              <span>Master Volume</span>
              <span>{Math.round(settings.masterVolume * 100)}%</span>
            </div>
            <input
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={settings.masterVolume}
              onChange={e => handleVolumeChange('master', parseFloat(e.target.value))}
              className="w-full accent-red-600 cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between mb-1">
              <span>Ambient Drone / Music</span>
              <span>{Math.round(settings.musicVolume * 100)}%</span>
            </div>
            <input
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={settings.musicVolume}
              onChange={e => handleVolumeChange('music', parseFloat(e.target.value))}
              className="w-full accent-red-600 cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between mb-1">
              <span>SFX & Footsteps</span>
              <span>{Math.round(settings.sfxVolume * 100)}%</span>
            </div>
            <input
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={settings.sfxVolume}
              onChange={e => handleVolumeChange('sfx', parseFloat(e.target.value))}
              className="w-full accent-red-600 cursor-pointer"
            />
          </div>
        </div>

        {/* Danger zone: reset save data */}
        <div className="pt-3 border-t border-slate-800">
          <button
            onClick={handleClearSave}
            className="w-full py-2 bg-slate-900 hover:bg-red-950 border border-slate-700 hover:border-red-700 rounded text-xs text-slate-300 hover:text-red-300 transition-colors flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            {resetSaved ? 'SAVE DATA CLEARED' : 'RESET SAVED GAME PROGRESS'}
          </button>
        </div>
      </div>
    </div>
  );
};
