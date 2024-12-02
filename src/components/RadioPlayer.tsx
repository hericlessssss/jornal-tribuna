import React, { useState } from 'react';
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';
import { Radio, X } from 'lucide-react';

const RadioPlayer: React.FC = () => {
  const [isMinimized, setIsMinimized] = useState(true);
  const radioUrl = 'https://8903.brasilstream.com.br/stream';

  return (
    <div
      className={`fixed bottom-4 right-4 z-40 bg-white rounded-lg shadow-lg transition-all duration-300 ${
        isMinimized ? 'w-12 h-12' : 'w-80'
      }`}
    >
      {isMinimized ? (
        <button
          onClick={() => setIsMinimized(false)}
          className="w-full h-full flex items-center justify-center bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          title="Abrir Rádio"
        >
          <Radio className="w-6 h-6" />
        </button>
      ) : (
        <div className="p-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-semibold text-gray-900">Rádio Tribuna</h3>
            <button
              onClick={() => setIsMinimized(true)}
              className="text-gray-500 hover:text-gray-700"
              title="Minimizar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <AudioPlayer
            src={radioUrl}
            autoPlay={true}
            showJumpControls={false}
            layout="stacked"
            customProgressBarSection={[]}
            customControlsSection={['MAIN_CONTROLS', 'VOLUME_CONTROLS']}
            autoPlayAfterSrcChange={false}
            style={{
              background: 'white',
              boxShadow: 'none',
            }}
            className="radio-player"
          />
        </div>
      )}
    </div>
  );
};

export default RadioPlayer;