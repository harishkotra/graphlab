import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { MainContent } from './components/MainContent';
import { MenuIcon } from './components/icons/MenuIcon';
import { graphTopics } from './constants';
import type { Topic } from './types';
import { GithubIcon } from './components/icons/GithubIcon';

const App: React.FC = () => {
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) {
        setSidebarOpen(true);
      } else {
        setSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Initial check

    // Handle initial topic from URL hash
    const handleHashChange = () => {
      const hash = decodeURIComponent(window.location.hash.substring(1));
      if (hash) {
        const allTopics = graphTopics.flatMap(category => category.topics);
        const topicFromHash = allTopics.find(t => t.name === hash);
        if (topicFromHash) {
          setSelectedTopic(topicFromHash);
        }
      } else {
        setSelectedTopic(null); // Go home if hash is empty
      }
    };
    
    window.addEventListener('hashchange', handleHashChange, false);
    handleHashChange(); // Check on initial load

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  const handleTopicSelect = (topic: Topic) => {
    setSelectedTopic(topic);
    window.location.hash = encodeURIComponent(topic.name);
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  const handleGoHome = () => {
    setSelectedTopic(null);
    // Clear the hash from the URL without reloading the page
    window.history.pushState("", document.title, window.location.pathname + window.location.search);
  };

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 font-sans">
      <Sidebar 
        topicsData={graphTopics} 
        onTopicSelect={handleTopicSelect} 
        isOpen={isSidebarOpen}
        setIsOpen={setSidebarOpen}
        selectedTopic={selectedTopic}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white dark:bg-gray-800 shadow-md p-4 flex items-center z-10">
          <button 
            onClick={() => setSidebarOpen(!isSidebarOpen)} 
            className="md:hidden text-gray-600 dark:text-gray-300 focus:outline-none"
            aria-label="Toggle sidebar"
          >
            <MenuIcon />
          </button>
          <button onClick={handleGoHome} className="text-xl font-bold ml-4 text-gray-900 dark:text-white text-left hover:opacity-80 transition-opacity focus:outline-none">
            GraphLab
          </button>
        </header>
        
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <MainContent topic={selectedTopic} />
        </main>
        
        <footer className="p-3 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 text-center text-sm text-gray-600 dark:text-gray-400">
          <a href="https://github.com/google-gemini/generative-ai-samples/tree/main/graph-theory-visualizer" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
            <GithubIcon />
            <span>Contribute on GitHub</span>
          </a>
        </footer>
      </div>
    </div>
  );
};

export default App;