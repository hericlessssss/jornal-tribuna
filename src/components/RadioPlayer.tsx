import React, { useState, useRef, useEffect } from 'react';
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';
import { Radio, X } from 'lucide-react';

const RadioPlayer: React.FC = () => {
  const [isMinimized, setIsMinimized] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const playerRef = useRef<any>(null);
  const radioUrl = 'https://8903.brasilstream.com.br/stream';

  useEffect(() => {
    // Try to autoplay when component mounts
    const attemptAutoplay = async () => {
      try {
        if (playerRef.current?.audio?.current) {
          const playPromise = playerRef.current.audio.current.play();
          
          if (playPromise !== undefined) {
            await playPromise;
            setIsPlaying(true);
            setIsMinimized(false); // Show player when successfully autoplaying
          }
        }
      } catch (error) {
        console.log('Autoplay prevented by browser. User interaction required.');
        setIsPlaying(false);
      }
    };

    attemptAutoplay();
  }, []);

  const handlePlay = () => {
    if (!isPlaying) {
      playerRef.current?.audio?.current?.play();
      setIsPlaying(true);
    }
    setIsMinimized(false);
  };

  const handlePause = () => {
    if (isPlaying) {
      playerRef.current?.audio?.current?.pause();
      setIsPlaying(false);
    }
  };

  const handleMinimize = () => {
    setIsMinimized(true);
  };

  return (
    <div className="flex items-center">
      {isMinimized ? (
        <button
          onClick={handlePlay}
          className={`flex items-center gap-2 px-3 py-1 transition-colors ${
            isPlaying 
              ? 'text-red-600 hover:text-red-700' 
              : 'text-gray-700 hover:text-red-600'
          }`}
          title="Ouvir Rádio Tribuna"
        >
          <Radio className="w-5 h-5" />
          <span className="text-sm font-medium">
            {isPlaying ? 'Rádio ao vivo' : 'Ouvir rádio'}
          </span>
        </button>
      ) : (
        <div className="relative">
          <div className="absolute right-0 top-12 w-80 bg-white rounded-lg shadow-xl z-50">
            <div className="p-4">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold text-gray-900">Rádio Tribuna</h3>
                <button
                  onClick={handleMinimize}
                  className="text-gray-500 hover:text-gray-700"
                  title="Minimizar"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <AudioPlayer
                ref={playerRef}
                src={radioUrl}
                autoPlay={true}
                showJumpControls={false}
                layout="stacked"
                customProgressBarSection={[]}
                customControlsSection={['MAIN_CONTROLS', 'VOLUME_CONTROLS']}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                style={{
                  background: 'white',
                  boxShadow: 'none',
                }}
                className="radio-player"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RadioPlayer;