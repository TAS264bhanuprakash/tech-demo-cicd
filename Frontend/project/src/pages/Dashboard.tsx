import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Train } from 'lucide-react';
import Navbar from '../components/Navbar';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  const cities = [
    { id: 'goa', name: 'GOA', image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80' },
    { id: 'mumbai', name: 'Mumbai', image: 'https://images.unsplash.com/photo-1529253355930-ddbe423a2ac7?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80' },
    { id: 'delhi', name: 'Delhi', image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80' },
    { id: 'bangalore', name: 'Bangalore', image: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80' },
  ];

  const handleCitySelect = (cityId: string) => {
    navigate(`/stations/${cityId}`);
  };

  return (
    <div className="min-h-screen bg-primary-light">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome to SigTrack</h1>
          <p className="text-lg text-gray-600">Select a city to view railway stations</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {cities.map((city) => (
            <div
              key={city.id}
              onClick={() => handleCitySelect(city.id)}
              className="bg-white rounded-xl shadow-md overflow-hidden cursor-pointer transform transition-transform hover:scale-105"
            >
              <div className="h-48 w-full overflow-hidden">
                <img
                  src={city.image}
                  alt={city.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <div className="flex items-center">
                  <MapPin className="h-5 w-5 text-primary" />
                  <h3 className="ml-2 text-xl font-semibold text-gray-800">{city.name}</h3>
                </div>
                <div className="mt-4 flex items-center text-primary">
                  <Train className="h-4 w-4" />
                  <span className="ml-2 text-sm">View Stations</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;