import React from 'react';
import PropTypes from 'prop-types';
import { Newspaper, ExternalLink } from 'lucide-react';

const NewsSection = ({ news }) => {
    const getSentimentColor = (sentiment) => {
        switch (sentiment) {
            case 'positive':
                return 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200';
            case 'negative':
                return 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200';
            default:
                return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200';
        }
    };

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg">
            <div className="flex items-center gap-2 mb-6">
                <Newspaper className="h-5 w-5 text-blue-500" />
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Latest News
                </h2>
            </div>

            <div className="space-y-6">
                {news.map((item, index) => (
                    <div
                        key={index}
                        className="border-b dark:border-gray-700 last:border-0 pb-6 last:pb-0"
                    >
                        <div className="flex justify-between items-start mb-2">
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                                {item.title}
                            </h3>
                            <a
                                href={item.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-500 hover:text-blue-600 dark:hover:text-blue-400"
                            >
                                <ExternalLink className="h-5 w-5" />
                            </a>
                        </div>
                        <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
                            {item.summary}
                        </p>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <span className="text-sm text-gray-500 dark:text-gray-400">
                                    {item.source}
                                </span>
                                <span className="text-sm text-gray-500 dark:text-gray-400">
                                    {item.date}
                                </span>
                            </div>
                            <span
                                className={`px-2 py-1 rounded-full text-xs font-medium ${getSentimentColor(
                                    item.sentiment
                                )}`}
                            >
                                {item.sentiment.charAt(0).toUpperCase() + item.sentiment.slice(1)}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

NewsSection.propTypes = {
    news: PropTypes.arrayOf(
        PropTypes.shape({
            title: PropTypes.string.isRequired,
            source: PropTypes.string.isRequired,
            date: PropTypes.string.isRequired,
            url: PropTypes.string.isRequired,
            sentiment: PropTypes.oneOf(['positive', 'negative', 'neutral']).isRequired,
            summary: PropTypes.string.isRequired,
        })
    ).isRequired,
};

export default NewsSection;
