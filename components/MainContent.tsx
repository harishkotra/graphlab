import React, { useState, useEffect } from 'react';
import { getTopicExplanation } from '../services/geminiService';
import type { Topic } from '../types';
import { LoadingSpinner } from './icons/LoadingSpinner';
import { GraphAnimation } from './animations/GraphAnimation';
import { Feedback } from './Feedback';
import { animationMap } from '../lib/animations';
import type { AnimationData, ComparisonAnimationData, MSTComparisonData } from '../lib/animations/types';
import { CompareBfsDfs } from './animations/CompareBfsDfs';
import { CompareMST } from './animations/CompareMST';
import { HomePage } from './HomePage';
import { GraphIntro } from './GraphIntro';


interface MainContentProps {
  topic: Topic | null;
}

const customComponentMap: Record<string, React.FC> = {
  'Graph and its representations': GraphIntro,
};

const LineRenderer: React.FC<{text: string}> = ({text}) => {
    const parts = text.split(/(\*\*.*?\*\*)/g).filter(part => part);
    return (
        <>
            {parts.map((part, i) => {
                if (part.startsWith('**') && part.endsWith('**')) {
                    return <strong key={i}>{part.slice(2, -2)}</strong>;
                }
                return part;
            })}
        </>
    );
};


const ContentDisplay: React.FC<{ content: string }> = ({ content }) => {
    // Basic markdown-like rendering
    const lines = content.split('\n');
    return (
        <div className="prose prose-lg dark:prose-invert max-w-none text-gray-700 dark:text-gray-300">
            {lines.map((line, index) => {
                if (line.startsWith('## ')) {
                    return <h2 key={index} className="text-2xl font-bold mt-6 mb-3 text-gray-900 dark:text-white border-b pb-2 border-gray-300 dark:border-gray-600">{line.substring(3)}</h2>;
                }
                 if (line.startsWith('```')) {
                     // Simple code block detection, assumes single block for now
                    const codeBlockEnd = lines.slice(index + 1).findIndex(l => l.startsWith('```'));
                    const codeLines = lines.slice(index + 1, index + 1 + codeBlockEnd).join('\n');
                    // Skip rendering these lines in the main loop
                    if (index === lines.findIndex(l => l.startsWith('```'))) {
                       return <pre key={index} className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 my-4 overflow-x-auto"><code className="font-mono text-sm">{codeLines}</code></pre>;
                    }
                    return null;
                }
                 if(lines.findIndex(l => l.startsWith('```')) !== -1 && index > lines.findIndex(l => l.startsWith('```')) && index <= lines.findIndex(l => l.startsWith('```')) + lines.slice(lines.findIndex(l => l.startsWith('```')) + 1).findIndex(l => l.startsWith('```'))) {
                    return null;
                }

                if (line.trim() === '') {
                    return <br key={index} />;
                }
                return <p key={index} className="my-2 leading-relaxed"><LineRenderer text={line} /></p>;
            })}
        </div>
    );
};

export const MainContent: React.FC<MainContentProps> = ({ topic }) => {
  const [content, setContent] = useState<string>('');
  const [animationData, setAnimationData] = useState<AnimationData | ComparisonAnimationData | MSTComparisonData | null>(null);
  const [comparisonType, setComparisonType] = useState<'bfs-dfs' | 'mst' | null>(null);
  const [customComponent, setCustomComponent] = useState<React.FC | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!topic) {
      // Clear content when returning to home page
      setContent('');
      setAnimationData(null);
      setCustomComponent(null);
      return;
    }

    const fetchContent = async () => {
      setIsLoading(true);
      setError(null);
      setContent('');
      setAnimationData(null);
      setComparisonType(null);
      setCustomComponent(null);

      try {
        const CustomComponent = customComponentMap[topic.name];
        if (CustomComponent) {
          setCustomComponent(() => CustomComponent);
        } else if (topic.name in animationMap) {
            const animationModule = await animationMap[topic.name]();
            if(topic.name === 'Difference between BFS and DFS') {
                setAnimationData(animationModule.animationData);
                setComparisonType('bfs-dfs');
            } else if (topic.name === "Prim's vs Kruskal's algorithm for MST") {
                setAnimationData(animationModule.animationData);
                setComparisonType('mst');
            } else {
                 const startNode = animationModule.graphData.nodes[0]?.id || 'A';
                 const steps = animationModule.generateSteps(animationModule.graphData, startNode);
                 setAnimationData({
                    description: animationModule.description,
                    graphData: animationModule.graphData,
                    steps: steps,
                    dataStructureName: animationModule.dataStructureName,
                    nodeIndexMap: animationModule.nodeIndexMap,
                 });
            }
        } else {
          // Fallback to Gemini API for explanation
          const explanation = await getTopicExplanation(topic.name);
          setContent(explanation);
        }
      } catch (err) {
        setError('Failed to fetch content. Please try again later.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchContent();
  }, [topic]);

  if (!topic) {
    return <HomePage />;
  }

  const renderAnimation = () => {
    if (!animationData) return null;

    if (comparisonType === 'bfs-dfs') {
        return <CompareBfsDfs key={topic.name} data={animationData as ComparisonAnimationData} />;
    }
    if (comparisonType === 'mst') {
        return <CompareMST key={topic.name} data={animationData as MSTComparisonData} />;
    }
    return <GraphAnimation key={topic.name} {...(animationData as AnimationData)} />;
  };

  const CustomComponent = customComponent;

  return (
    <div className="bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-lg shadow-lg w-full h-full overflow-y-auto">
      <h1 className="text-3xl md:text-4xl font-extrabold mb-6 text-gray-900 dark:text-white">{topic.name}</h1>
      {isLoading && (
        <div className="flex items-center justify-center h-64">
          <LoadingSpinner />
          <p className="ml-4 text-lg text-gray-600 dark:text-gray-400">Loading content...</p>
        </div>
      )}
      {error && <div className="text-red-500 bg-red-100 dark:bg-red-900 dark:text-red-200 p-4 rounded-md">{error}</div>}
      
      {!isLoading && !error && (
        <>
          {customComponent ? <CustomComponent /> : animationData ? renderAnimation() : <ContentDisplay content={content} />}

          <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
            <Feedback topicName={topic.name} />
          </div>
        </>
      )}
    </div>
  );
};