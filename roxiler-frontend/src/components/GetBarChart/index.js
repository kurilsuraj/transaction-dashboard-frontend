import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend} from 'recharts';
import './index.css'

const GetBarChart = ({ data , month}) => {
  const [priceLabelsAndCounts, setPriceLabelsAndCounts] = useState([]);

  useEffect(() => {
    const priceRanges = [
      [0, 100],
      [101, 200],
      [201, 300],
      [301, 400],
      [401, 500],
      [501, 600],
      [601, 700],
      [701, 800],
      [801, 900],
      [901, "901 Above"],
    ];
  
    const countItems = () => {
      const counts = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
      for (const item of data) {
        const price = item.price;
        for (let i = 0; i < priceRanges.length; i++) {
          const [lower, upper] = priceRanges[i];
          if (lower === 901 && price >= lower) {
            counts[i] += 1;
            break;
          }
          else if (lower <= price && price < upper) {
            counts[i] += 1;
            break;
          }
        }
      }
      return counts;
    };
  
    const combinedData = priceRanges.map(([lower, upper], index) => ({
      labelName: lower === 901 ? `901 Above` : `${lower}-${upper}`, 
      priceCounts: countItems()[index],
    }));
  
    setPriceLabelsAndCounts(combinedData);
  }, [data]);

 

  return (
    <div className="chart-container">
      <h1 className='heading'>Bar Charts Stats - {month}</h1>
      <BarChart width={900} height={300} data={priceLabelsAndCounts} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <XAxis dataKey="labelName" tick={{ stroke: 'gray' }}> 
        </XAxis>
        <YAxis tick={{ stroke: 'gray' }} />
        <Tooltip />
        <Legend />
        <Bar name="Price Range" dataKey="priceCounts" fill="blue" />
      </BarChart>
    </div>
  );
};

export default GetBarChart;
