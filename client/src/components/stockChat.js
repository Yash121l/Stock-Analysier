// // import React, { useEffect, useState } from 'react';
// import { Line } from 'react-chartjs-2';
// import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
// import stockData from './data.json'

// // Register necessary components
// ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

// const StockChart = () => {

//     if (stockData.length === 0) {
//         return <div>Loading...</div>;
//     }

//     // Prepare chart data
//     const labels = stockData.map(data => new Date(data.date).toLocaleDateString());
//     const closePrices = stockData.map(data => data.close);

//     const chartData = {
//         labels: labels,
//         datasets: [
//             {
//                 label: 'Closing Price',
//                 data: closePrices,
//                 fill: false,
//                 borderColor: 'rgba(75, 192, 192, 1)',
//                 backgroundColor: 'rgba(75, 192, 192, 0.2)',
//                 tension: 0.1,
//             },
//         ],
//     };

//     const options = {
//         responsive: true,
//         plugins: {
//             legend: {
//                 position: 'top',
//             },
//             title: {
//                 display: true,
//                 text: 'Stock Closing Prices Over Time',
//             },
//         },
//     };

//     return (
//         <div>
//             <h2>Stock Chart</h2>
//             <Line data={chartData} options={options} />
//         </div>
//     );
// };

// export default StockChart;


import React from 'react';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import stockData from './data.json'; // Import stock data from a JSON file

// Register necessary components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend);

const StockChart = () => {
    if (stockData.length === 0) {
        return <div>Loading...</div>;
    }

    // Prepare chart data
    const labels = stockData.map(data => new Date(data.date).toLocaleDateString());
    const closePrices = stockData.map(data => data.close);
    const volumes = stockData.map(data => data.volume);

    const chartData = {
        labels: labels,
        datasets: [
            {
                label: 'Price',
                type: 'line',
                data: closePrices,
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                tension: 0.1,
                yAxisID: 'y',
            },
            {
                label: 'Volume',
                type: 'bar',
                data: volumes,
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
                borderColor: 'rgba(255, 99, 132, 1)',
                yAxisID: 'y1',
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
                labels: {
                    color: 'rgba(255, 255, 255, 0.9)', // White legend text for dark mode
                },
            },
            title: {
                display: true,
                text: 'Stock Closing Prices and Volume Over Time',
                color: 'rgba(255, 255, 255, 0.9)', // White title text for dark mode
            },
        },
        scales: {
            x: {
                grid: {
                    color: 'rgba(255, 255, 255, 0.1)', // Light grid lines for x-axis
                },
                ticks: {
                    color: 'rgba(255, 255, 255, 0.9)', // White ticks for x-axis
                },
            },
            y: {
                type: 'linear',
                position: 'left',
                grid: {
                    color: 'rgba(255, 255, 255, 0.1)', // Light grid lines for y-axis (Closing Price)
                },
                ticks: {
                    color: 'rgba(255, 255, 255, 0.9)', // White ticks for y-axis (Closing Price)
                },
            },
            y1: {
                type: 'linear',
                position: 'right',
                grid: {
                    drawOnChartArea: false, // Avoid grid overlap with y-axis (Closing Price)
                },
                ticks: {
                    color: 'rgba(255, 255, 255, 0.9)', // White ticks for y1-axis (Volume)
                },
            },
        },
    };

    const containerStyles = {
        backgroundColor: '#1e1e1e', // Dark background for the chart container
        padding: '20px',
        borderRadius: '8px',
        color: '#fff', // White text
    };

    return (
        <div style={containerStyles}>
            <h2>Stock Chart</h2>
            <Line data={chartData} options={options} />
        </div>
    );
};

export default StockChart;
