import React from 'react';
import PropTypes from 'prop-types';

const AnalystRatings = ({ ratings, averagePrice, highPrice, lowPrice }) => {
    const getRatingColor = (rating) => {
        switch (rating) {
            case 'Buy':
                return 'bg-green-500';
            case 'Hold':
                return 'bg-yellow-500';
            case 'Sell':
                return 'bg-red-500';
            default:
                return 'bg-gray-500';
        }
    };

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                Analyst Ratings
            </h2>

            <div className="space-y-4">
                {ratings.map((rating) => (
                    <div key={rating.rating} className="space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-600 dark:text-gray-400">{rating.rating}</span>
                            <span className="text-gray-900 dark:text-white">{rating.count} analysts</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                            <div
                                className={`h-2.5 rounded-full ${getRatingColor(rating.rating)}`}
                                style={{ width: `${rating.percentage}%` }}
                            ></div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-8 grid grid-cols-3 gap-4">
                <div className="text-center">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Average Target</p>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">
                        ${averagePrice}
                    </p>
                </div>
                <div className="text-center">
                    <p className="text-sm text-gray-600 dark:text-gray-400">High Target</p>
                    <p className="text-lg font-semibold text-green-500">
                        ${highPrice}
                    </p>
                </div>
                <div className="text-center">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Low Target</p>
                    <p className="text-lg font-semibold text-red-500">
                        ${lowPrice}
                    </p>
                </div>
            </div>
        </div>
    );
};

AnalystRatings.propTypes = {
    ratings: PropTypes.arrayOf(
        PropTypes.shape({
            rating: PropTypes.oneOf(['Buy', 'Hold', 'Sell']).isRequired,
            count: PropTypes.number.isRequired,
            percentage: PropTypes.number.isRequired,
        })
    ).isRequired,
    averagePrice: PropTypes.number.isRequired,
    highPrice: PropTypes.number.isRequired,
    lowPrice: PropTypes.number.isRequired,
};

export default AnalystRatings;
