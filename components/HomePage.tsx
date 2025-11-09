import React from 'react';
import { GithubIcon } from './icons/GithubIcon';

export const HomePage: React.FC = () => (
  <div className="flex flex-col items-center justify-center h-full text-center p-4 -mt-8">
    <div className="max-w-3xl w-full">
      <h2 className="text-4xl font-extrabold text-gray-800 dark:text-white mb-4 tracking-tight">
        Welcome to GraphLab
      </h2>
      <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
        Your interactive journey into the fascinating world of graph algorithms.
      </p>

      <div className="space-y-10 text-left">
        <div className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">How to Learn</h3>
          <p className="text-gray-700 dark:text-gray-300">
            Use the sidebar on the left to navigate through a comprehensive list of graph theory topics. Each topic provides either a detailed, Gemini-powered explanation or a step-by-step interactive animation to help you visualize the algorithm in action.
          </p>
        </div>

        <div className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Interactive Animations</h3>
          <p className="text-gray-700 dark:text-gray-300">
            For many algorithms, you'll find a visualizer. Use the player controls to play, pause, step through the animation, and adjust the speed. Watch how data structures change and how the graph is traversed to gain a deep, intuitive understanding.
          </p>
        </div>

        <div className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Contribute & Report Issues</h3>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            This project is open source and we welcome contributions! Whether you want to add a new algorithm, fix a bug, or improve an explanation, your help is appreciated.
          </p>
          <a 
            href="https://github.com/harishkotra/graphlab" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
          >
            <GithubIcon className="h-5 w-5" />
            <span>Contribute on GitHub</span>
          </a>
        </div>
      </div>

       <p className="mt-12 text-gray-500 dark:text-gray-400">
        Ready to start? Select a topic from the sidebar!
      </p>
    </div>
  </div>
);