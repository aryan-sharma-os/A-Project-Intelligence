import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const FinancialCharts = ({ highlights }) => {
  // Convert highlights into chart data if applicable
  // Assuming highlight structure: { metric_name: "Revenue", value: "100M" }
  // In a real app, you'd want numerical data, but we'll adapt for visualization
  
  const data = highlights?.slice(0, 4).map(h => {
    // Attempt to extract numbers from strings like "15%" or "$2.5B"
    const num = parseFloat(h.value.replace(/[^0-9.-]+/g, ""));
    return {
      name: h.metric_name.substring(0, 15),
      value: isNaN(num) ? 0 : num,
      original: h.value
    };
  }) || [];

  return (
    <div className="h-[250px] w-full mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
          <XAxis dataKey="name" stroke="#a1a1aa" fontSize={12} tickLine={false} axisLine={false} />
          <YAxis stroke="#a1a1aa" fontSize={12} tickLine={false} axisLine={false} width={40} />
          <Tooltip 
            cursor={{ fill: '#27272a' }}
            contentStyle={{ backgroundColor: '#09090b', borderColor: '#27272a', borderRadius: '8px' }}
            formatter={(val, name, props) => [props.payload.original, "Value"]}
          />
          <Bar dataKey="value" fill="#10b981" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default FinancialCharts;
