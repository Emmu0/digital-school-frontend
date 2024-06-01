import React from 'react'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';

const PieChart = () => {
    ChartJS.register(ArcElement, Tooltip, Legend);
    const options = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top',
        },
        title: {
          display: false,
          text: 'Properties sales monthly',
        },
      },
    };
const data = {
  labels: ['Red', 'Blue', 'Yellow', 'Green'],
  datasets: [
    {
      label: '# of Votes',
      data: [12, 19, 3, 5],
      backgroundColor: [
        '#6096B4',
        '#93BFCF',
        '#BDCDD6',
        '#EEE9DA',
      ],
      borderColor: [
        '#6096B4',
        '#93BFCF',
        '#BDCDD6',
        '#EEE9DA',
      ],
      borderWidth: 1,
    },
  ],
};
  return (
    <Pie data={data} options={options}/>
  )
}

export default PieChart