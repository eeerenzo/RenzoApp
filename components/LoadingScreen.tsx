import React from 'react';
import { AppState } from '../types';

interface LoadingScreenProps {
  state: AppState;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ state }) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-amber-100 z-50">
      <div className="relative w-32 h-32 mb-8">
        <div className="absolute inset-0 rounded-full border-t-2 border-amber-500 animate-spin"></div>
        <div className="absolute inset-2 rounded-full border-r-2 border-amber-700 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '2s' }}></div>
        <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-4xl font-serif animate-pulse opacity-50">ॐ</span>
        </div>
      </div>
      
      <h2 className="text-2xl font-serif mb-2 tracking-widest">Constructing Sanctuary</h2>
      <p className="text-gray-500 font-mono text-sm animate-pulse">
        {state.loadingStep}
      </p>
    </div>
  );
};

export default LoadingScreen;