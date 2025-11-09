import React, { useState, useEffect, useCallback } from 'react';
import type { MSTComparisonData } from '../../lib/animations/types';
import { GraphAnimation } from './GraphAnimation';

export const CompareMST: React.FC<{ data: MSTComparisonData }> = ({ data }) => {
  const [step, setStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1500);

  const { prims, kruskals, description } = data;
  const maxSteps = Math.max(prims.steps.length, kruskals.steps.length);

  const resetAnimation = useCallback(() => {
    setStep(0);
    setIsPlaying(false);
  }, []);

  const handleNext = useCallback(() => {
    if (step < maxSteps - 1) {
      setStep(s => s + 1);
    }
    setIsPlaying(false);
  }, [step, maxSteps]);

  const handlePrev = useCallback(() => {
    if (step > 0) {
      setStep(s => s - 1);
    }
    setIsPlaying(false);
  }, [step]);
  
  useEffect(() => {
    resetAnimation();
  }, [data, resetAnimation]);

  useEffect(() => {
    if (isPlaying) {
      if (step < maxSteps - 1) {
        const timer = setTimeout(() => {
          setStep(s => s + 1);
        }, speed);
        return () => clearTimeout(timer);
      } else {
        setIsPlaying(false);
      }
    }
  }, [step, isPlaying, maxSteps, speed]);

  return (
    <div className="flex flex-col gap-8">
      <div className="prose prose-lg dark:prose-invert max-w-none text-gray-700 dark:text-gray-300" dangerouslySetInnerHTML={{ __html: description }} />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
          <h2 className="text-2xl font-bold text-center mb-4">Prim's (Vertex-based)</h2>
          <GraphAnimation 
            {...prims}
            description=""
            externalStep={Math.min(step, prims.steps.length - 1)}
            onStepChange={setStep}
          />
        </div>
        <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
          <h2 className="text-2xl font-bold text-center mb-4">Kruskal's (Edge-based)</h2>
           <GraphAnimation 
            {...kruskals}
            description=""
            externalStep={Math.min(step, kruskals.steps.length - 1)}
            onStepChange={setStep}
          />
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 p-4 bg-gray-100 dark:bg-gray-700/50 rounded-lg">
        <div className="flex items-center gap-2">
            <button onClick={handlePrev} disabled={step === 0} className="px-4 py-2 bg-gray-300 dark:bg-gray-600 rounded-md disabled:opacity-50 transition" aria-label="Previous step">Prev</button>
            <button onClick={() => setIsPlaying(!isPlaying)} className="px-6 py-2 bg-blue-500 text-white rounded-md font-bold transition hover:bg-blue-600 w-24" aria-label={isPlaying ? 'Pause animation' : 'Play animation'}>
              {isPlaying ? 'Pause' : 'Play'}
            </button>
            <button onClick={handleNext} disabled={step === maxSteps - 1} className="px-4 py-2 bg-gray-300 dark:bg-gray-600 rounded-md disabled:opacity-50 transition" aria-label="Next step">Next</button>
        </div>
        <button onClick={resetAnimation} className="px-4 py-2 bg-red-500 text-white rounded-md transition hover:bg-red-600" aria-label="Reset animation">Reset</button>
        <div className="flex items-center gap-2">
            <label htmlFor="speed-compare" className="text-sm">Speed</label>
            <input 
              type="range" 
              id="speed-compare"
              min="200"
              max="3000"
              step="100"
              value={3200 - speed}
              onChange={(e) => setSpeed(3200 - Number(e.target.value))}
              className="w-32"
              aria-label="Animation speed control"
            />
        </div>
      </div>
    </div>
  );
};
