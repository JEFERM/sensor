'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

interface SensorData {
  id: number;
  distance: number;
  timestamp: string;
}

export default function Home() {
  const [sensorData, setSensorData] = useState<SensorData[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase
        .from('sensor_data')
        .select('*')
        .order('timestamp', { ascending: false });

      if (error) {
        console.error('Error fetching sensor data:', error);
      } else {
        setSensorData(data || []);
      }
    };

    // Fetch initial data
    fetchData();

    // Set up subscription for real-time updates
    const subscription = supabase
      .channel('sensor_data')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'sensor_data' }, payload => {
        setSensorData(prevData => [payload.new as SensorData, ...prevData]);
      })
      .subscribe();

    // Clean up the subscription
    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-4xl p-4">
        <h1 className="text-3xl font-bold mb-4 text-center">DATOS DEL SENSOR</h1>
        <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead className="bg-blue-500 text-white">
            <tr>
              <th className="w-1/3 py-2">ID</th>
              <th className="w-1/3 py-2">Distancia (cm)</th>
              <th className="w-1/3 py-2">Fecha</th>
            </tr>
          </thead>
          <tbody>
            {sensorData.map((data) => (
              <tr key={data.id} className="border-b border-gray-200 hover:bg-gray-100">
                <td className="py-2 px-4 text-center">{data.id}</td>
                <td className="py-2 px-4 text-center">{data.distance}</td>
                <td className="py-2 px-4 text-center">{new Date(data.timestamp).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
