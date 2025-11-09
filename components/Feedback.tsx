import React, { useState, useEffect } from 'react';
import { ThumbUpIcon } from './icons/ThumbUpIcon';
import { ThumbDownIcon } from './icons/ThumbDownIcon';
import { ShareIcon } from './icons/ShareIcon';

const FEEDBACK_STORAGE_KEY = 'graphTheoryFeedback';

type FeedbackStatus = 'like' | 'dislike';
type FeedbackData = Record<string, FeedbackStatus>;

interface FeedbackProps {
  topicName: string;
}

export const Feedback: React.FC<FeedbackProps> = ({ topicName }) => {
    const [feedback, setFeedback] = useState<FeedbackStatus | null>(null);
    const [submitted, setSubmitted] = useState(false);
    const [copyStatus, setCopyStatus] = useState('Share');

    useEffect(() => {
        // Reset state when topic changes
        setFeedback(null);
        setSubmitted(false);

        // Load feedback from localStorage for the current topic
        try {
            const storedData = localStorage.getItem(FEEDBACK_STORAGE_KEY);
            if (storedData) {
                const feedbackData: FeedbackData = JSON.parse(storedData);
                const currentTopicFeedback = feedbackData[topicName];
                if (currentTopicFeedback) {
                    setFeedback(currentTopicFeedback);
                    setSubmitted(true);
                }
            }
        } catch (error) {
            console.error("Failed to read feedback from localStorage", error);
        }
    }, [topicName]);


    const handleFeedback = (type: FeedbackStatus) => {
        setFeedback(type);
        setSubmitted(true);
        // Save feedback to localStorage
        try {
            const storedData = localStorage.getItem(FEEDBACK_STORAGE_KEY);
            const feedbackData: FeedbackData = storedData ? JSON.parse(storedData) : {};
            feedbackData[topicName] = type;
            localStorage.setItem(FEEDBACK_STORAGE_KEY, JSON.stringify(feedbackData));
        } catch (error) {
            console.error("Failed to save feedback to localStorage", error);
        }
    };

    const handleShare = () => {
        navigator.clipboard.writeText(window.location.href).then(() => {
            setCopyStatus('Copied!');
            setTimeout(() => setCopyStatus('Share'), 2000);
        }, () => {
            setCopyStatus('Failed!');
            setTimeout(() => setCopyStatus('Share'), 2000);
        });
    };

    if (submitted) {
        return (
            <div className="text-center p-4 bg-green-50 dark:bg-green-900/50 border border-green-200 dark:border-green-800 rounded-lg">
                <p className="font-medium text-green-800 dark:text-green-200">Thank you for your feedback!</p>
            </div>
        );
    }

    return (
        <div className="text-center">
            <h4 className="text-md font-semibold text-gray-700 dark:text-gray-300 mb-3">Was this explanation helpful?</h4>
            <div className="flex justify-center items-center gap-4">
                <button 
                    onClick={() => handleFeedback('like')}
                    className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    aria-label="Helpful"
                >
                    <ThumbUpIcon className="h-5 w-5" />
                    <span>Like</span>
                </button>
                <button 
                    onClick={() => handleFeedback('dislike')}
                    className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    aria-label="Not helpful"
                >
                    <ThumbDownIcon className="h-5 w-5" />
                    <span>Dislike</span>
                </button>
                <button 
                    onClick={handleShare}
                    className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    aria-label="Share this page"
                >
                    <ShareIcon className="h-5 w-5" />
                    <span>{copyStatus}</span>
                </button>
            </div>
        </div>
    );
};