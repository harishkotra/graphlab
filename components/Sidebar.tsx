
import React from 'react';
import type { Topic, TopicCategory } from '../types';
import { CloseIcon } from './icons/CloseIcon';

interface SidebarProps {
  topicsData: TopicCategory[];
  onTopicSelect: (topic: Topic) => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  selectedTopic: Topic | null;
}

export const Sidebar: React.FC<SidebarProps> = ({ topicsData, onTopicSelect, isOpen, setIsOpen, selectedTopic }) => {
  return (
    <>
      <div 
        className={`fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setIsOpen(false)}
      ></div>
      <aside
        className={`fixed top-0 left-0 h-full w-72 bg-white dark:bg-gray-800 shadow-lg z-30 transform transition-transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 md:w-80 md:flex-shrink-0`}
      >
        <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Graph Algorithms</h2>
          <button onClick={() => setIsOpen(false)} className="md:hidden text-gray-600 dark:text-gray-300">
            <CloseIcon />
          </button>
        </div>
        <nav className="overflow-y-auto h-[calc(100%-57px)] p-4">
          <ul>
            {topicsData.map((category) => (
              <li key={category.category} className="mb-4">
                <h3 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 px-2">
                  {category.category}
                </h3>
                <ul>
                  {category.topics.map((topic) => (
                    <li key={topic.name}>
                      <a
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          onTopicSelect(topic);
                        }}
                        className={`block px-2 py-2 rounded-md text-sm font-medium transition-colors duration-150 ${
                          selectedTopic?.name === topic.name
                            ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-white'
                            : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                        }`}
                      >
                        {topic.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
    </>
  );
};
