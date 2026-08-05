import React, { useState, useRef } from 'react';
import { Music, Volume2, Play, Pause } from 'lucide-react';

interface SoundItem {
  id: string;
  name: string;
  icon: string;
  url: string;
}

const SOUNDS: SoundItem[] = [
  { id: 'rain', name: '🌧️ Yağmur Sesi', icon: '🌧️', url: 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8c8a73467.mp3?filename=rain-and-thunder-16705.mp3' },
  { id: 'cafe', name: '☕ Kafe Ambiyansı', icon: '☕', url: 'https://cdn.pixabay.com/download/audio/2022/10/25/audio_946dd0b113.mp3?filename=coffee-shop-ambience-123406.mp3' },
  { id: 'forest', name: '🌲 Orman & Kuşlar', icon: '🌲', url: 'https://cdn.pixabay.com/download/audio/2021/08/09/audio_88447e769f.mp3?filename=forest-with-small-river-birds-and-nature-field-recording-6735.mp3' },
  { id: 'white', name: '⚪ Beyaz Gürültü', icon: '⚪', url: 'https://cdn.pixabay.com/download/audio/2022/03/10/audio_270f49b973.mp3?filename=white-noise-8117.mp3' },
  { id: 'lofi', name: '🎧 Lo-Fi Müzik', icon: '🎧', url: 'https://cdn.pixabay.com/download/audio/2023/10/24/audio_8056a54248.mp3?filename=lofi-study-159229.mp3' },
  { id: 'library', name: '📚 Kütüphane', icon: '📚', url: 'https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0fd342ad2.mp3?filename=ambience-library-6433.mp3' }
];

export const MusicView: React.FC = () => {
  const [playingState, setPlayingState] = useState<Record<string, boolean>>({});
  const [volumeState, setVolumeState] = useState<Record<string, number>>({});
  const audioRefs = useRef<Record<string, HTMLAudioElement>>({});

  const toggleSound = (sound: SoundItem) => {
    let audio = audioRefs.current[sound.id];
    if (!audio) {
      audio = new Audio(sound.url);
      audio.loop = true;
      audio.volume = volumeState[sound.id] ?? 0.5;
      audioRefs.current[sound.id] = audio;
    }

    if (playingState[sound.id]) {
      audio.pause();
      setPlayingState((prev) => ({ ...prev, [sound.id]: false }));
    } else {
      audio.play().catch((err) => console.log('Audio playback error', err));
      setPlayingState((prev) => ({ ...prev, [sound.id]: true }));
    }
  };

  const handleVolumeChange = (id: string, vol: number) => {
    setVolumeState((prev) => ({ ...prev, [id]: vol }));
    if (audioRefs.current[id]) {
      audioRefs.current[id].volume = vol;
    }
  };

  return (
    <div className="space-y-6">
      <div className="p-6 rounded-2xl bg-slate-800/80 dark:bg-slate-900/80 border border-slate-700/80 shadow-md space-y-2">
        <div className="flex items-center gap-2 font-bold text-lg text-slate-100">
          <Music className="w-5 h-5 text-indigo-400" />
          <h3>Çalışma Müzikleri & Ortam Sesleri</h3>
        </div>
        <p className="text-xs text-slate-400">
          Ders çalışırken odaklanmanı artıracak ortam seslerini seç, aynı anda birden fazla sesi karıştırarak dinle.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {SOUNDS.map((sound) => {
          const isPlaying = !!playingState[sound.id];
          const volume = volumeState[sound.id] ?? 0.5;

          return (
            <div
              key={sound.id}
              className={`p-5 rounded-2xl border transition-all space-y-4 ${
                isPlaying
                  ? 'bg-slate-800 border-indigo-500 shadow-lg shadow-indigo-500/10'
                  : 'bg-slate-800/60 dark:bg-slate-900/60 border-slate-700/80'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="text-2xl">{sound.icon}</div>
                  <div className="font-bold text-sm text-slate-100">{sound.name}</div>
                </div>

                <button
                  onClick={() => toggleSound(sound)}
                  className={`p-2.5 rounded-xl font-bold transition-all ${
                    isPlaying
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                      : 'bg-slate-700 text-slate-200 hover:bg-slate-600'
                  }`}
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </button>
              </div>

              {/* Volume Slider */}
              <div className="space-y-1">
                <div className="flex justify-between items-center text-xs font-semibold text-slate-400">
                  <span className="flex items-center gap-1">
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>Ses</span>
                  </span>
                  <span>{Math.round(volume * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={volume}
                  onChange={(e) => handleVolumeChange(sound.id, Number(e.target.value))}
                  className="w-full accent-indigo-500 cursor-pointer"
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
