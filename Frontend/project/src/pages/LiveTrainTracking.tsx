import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Train, ArrowLeft, Clock, MapPin, AlertCircle, Loader } from 'lucide-react';
import axios from 'axios';
import Navbar from '../components/Navbar';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

interface Station {
  si_no: number;
  station_code: string;
  station_name: string;
  distance_from_source: number;
  sta: string;
  std: string;
  eta: string;
  etd: string;
  halt: number;
  arrival_delay: number;
  platform_number: number;
  stoppage_number: number;
}

interface TrainStatus {
  train_number: string;
  train_name: string;
  source: string;
  destination: string;
  source_stn_name: string;
  dest_stn_name: string;
  current_station_code: string;
  current_station_name: string;
  status: string;
  platform_number: number;
  upcoming_stations: Station[];
  previous_stations: Station[];
}

interface ApiResponse {
  status: string;
  data: TrainStatus;
}

const LiveTrainStatus: React.FC = () => {
  const { trainNo } = useParams<{ trainNo: string }>();
  const navigate = useNavigate();
  const [trainStatus, setTrainStatus] = useState<TrainStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTrainStatus = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://fastapi-service/live-train-status/?train_no=${trainNo}&start_day=0`);
        if (response.data.status === "success") {
          // The API now returns data directly as a JSON object, no need to parse
          setTrainStatus(response.data.data);
          setError('');
        } else {
          setError('Failed to fetch train status. Please try again.');
        }
      } catch (err) {
        console.error('Error fetching train status:', err);
        setError('Failed to load train status. Please try again later.');
        
        // For demo purposes, set mock data if API fails
        if (trainNo === '57515') {
          const mockData: TrainStatus = {
            "train_number": "57515",
            "train_name": "DAUND - HAZUR SAHIB NANDED Passenger",
            "source": "DD",
            "destination": "NED",
            "source_stn_name": "DAUND JN",
            "dest_stn_name": "HUZUR SAHIB NANDED",
            "current_station_code": "DD",
            "current_station_name": "DAUND JN~",
            "status": "D",
            "platform_number": 2,
            "upcoming_stations": [
              {
                "si_no": 5,
                "station_code": "KSTH",
                "station_name": "KASHTI",
                "distance_from_source": 11,
                "sta": "13:13",
                "std": "13:15",
                "eta": "13:13",
                "etd": "13:15",
                "halt": 2,
                "arrival_delay": 0,
                "platform_number": 1,
                "stoppage_number": 2
              },
              {
                "si_no": 6,
                "station_code": "SGND",
                "station_name": "SHRIGONDA ROAD",
                "distance_from_source": 21,
                "sta": "13:28",
                "std": "13:30",
                "eta": "13:28",
                "etd": "13:30",
                "halt": 2,
                "arrival_delay": 0,
                "platform_number": 1,
                "stoppage_number": 3
              }
            ],
            "previous_stations": []
          };
          setTrainStatus(mockData);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchTrainStatus();
  }, [trainNo]);

  const handleBack = () => {
    navigate(-1); // Go back to previous page which should be trains list
  };

  // Format time to 12-hour format
  const formatTime = (time: string) => {
    if (!time) return 'TBD';
    
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    
    return `${hour12}:${minutes} ${ampm}`;
  };

  // Get delay status color
  const getDelayStatusColor = (delay: number) => {
    if (delay === 0) return 'text-green-600';
    if (delay <= 15) return 'text-yellow-600';
    return 'text-red-600';
  };

  // Format delay text
  const formatDelay = (delay: number) => {
    if (delay === 0) return 'On Time';
    return `Delayed by ${delay} min`;
  };

  // Calculate train's current position percentage
  const calculateProgress = () => {
    if (!trainStatus) return 0;
    
    // Filter out empty station entries
    const validStations = trainStatus.upcoming_stations.filter(
      station => station.station_code && station.station_name
    );
    
    if (validStations.length === 0) return 0;
    
    const totalDistance = validStations.length > 0 
      ? validStations[validStations.length - 1].distance_from_source 
      : 0;
    
    if (totalDistance === 0) return 0;
    
    // If train hasn't started or current station isn't known
    if (!trainStatus.current_station_code || !trainStatus.status) {
      return 0;
    }
    
    // If train has departed from source
    if (trainStatus.status === 'D' && trainStatus.current_station_code === trainStatus.source) {
      return 0;
    }
    
    // If train is at destination
    if (trainStatus.current_station_code === trainStatus.destination) {
      return 100;
    }
    
    // Find current station in upcoming stations
    const currentStationIndex = validStations.findIndex(
      station => station.station_code === trainStatus.current_station_code
    );
    
    if (currentStationIndex >= 0) {
      const currentStation = validStations[currentStationIndex];
      return (currentStation.distance_from_source / totalDistance) * 100;
    }
    
    return 0;
  };

  // Helper function to filter valid stations (with name and code)
  const getValidStations = (stations: Station[]) => {
    return stations.filter(station => station.station_code && station.station_name);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center mb-8">
          <button 
            onClick={handleBack}
            className="flex items-center text-primary hover:text-primary-dark transition-colors"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Trains
          </button>
        </div>

        {loading ? (
          <div className="bg-white rounded-xl shadow-lg p-10 flex justify-center items-center">
            <Loader className="h-8 w-8 text-primary animate-spin" />
            <span className="ml-2 text-gray-600">Loading train status...</span>
          </div>
        ) : error ? (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
              <AlertCircle className="h-5 w-5 inline mr-2" />
              <span className="inline">{error}</span>
            </div>
          </div>
        ) : trainStatus ? (
          <>
            {/* Train Info Header */}
            <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                <div>
                  <div className="flex items-center">
                    <Train className="h-6 w-6 text-primary mr-2" />
                    <h1 className="text-2xl font-bold text-gray-900">{trainStatus.train_name}</h1>
                  </div>
                  <div className="mt-1 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary/20 text-primary">
                    {trainStatus.train_number}
                  </div>
                  <p className="text-gray-600 mt-2">
                    {trainStatus.source_stn_name} ({trainStatus.source}) to {trainStatus.dest_stn_name} ({trainStatus.destination})
                  </p>
                </div>
              </div>
            </div>

            {/* Current Status */}
            <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Current Status</h2>
              {trainStatus.current_station_code && trainStatus.current_station_name ? (
                <div className="bg-primary-light rounded-lg p-4 border border-primary/10">
                  <div className="flex items-center">
                    <div className="bg-primary/10 p-3 rounded-full">
                      <MapPin className="h-6 w-6 text-primary" />
                    </div>
                    <div className="ml-4">
                      <p className="text-gray-600">Current Location</p>
                      <h3 className="text-lg font-semibold text-gray-800">
                        {trainStatus.current_station_name} ({trainStatus.current_station_code})
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        {trainStatus.status === 'A' ? 'Arrived at' : trainStatus.status === 'D' ? 'Departed from' : 'Expected at'} platform {trainStatus.platform_number || 'TBD'}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-100">
                  <div className="flex items-center">
                    <div className="bg-yellow-100 p-3 rounded-full">
                      <AlertCircle className="h-6 w-6 text-yellow-600" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-semibold text-gray-800">
                        Current location not available
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        Live status information will be available once the train journey begins.
                      </p>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Progress Bar */}
              <div className="mt-6">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>{trainStatus.source_stn_name} ({trainStatus.source})</span>
                  <span>{trainStatus.dest_stn_name} ({trainStatus.destination})</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full">
                  <div 
                    className="h-2 bg-primary rounded-full" 
                    style={{ width: `${calculateProgress()}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Upcoming Stations */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Upcoming Stations</h2>
              
              <div className="space-y-6">
                {getValidStations(trainStatus.upcoming_stations).map((station, index) => (
                  <div key={station.station_code} className="flex">
                    <div className="flex flex-col items-center mr-4">
                      <div className={`w-4 h-4 rounded-full ${index === 0 ? 'bg-primary' : 'bg-gray-300'} border-2 border-white`}></div>
                      {index < getValidStations(trainStatus.upcoming_stations).length - 1 && (
                        <div className="w-0.5 bg-gray-200 flex-grow my-1"></div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                        <div>
                          <h3 className="text-lg font-medium text-gray-900">{station.station_name}</h3>
                          <p className="text-sm text-gray-500">{station.station_code}</p>
                        </div>
                        <div className={`mt-2 sm:mt-0 ${getDelayStatusColor(station.arrival_delay)}`}>
                          {formatDelay(station.arrival_delay)}
                        </div>
                      </div>
                      
                      <div className="mt-2 grid grid-cols-1 sm:grid-cols-3 gap-2">
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 text-gray-400 mr-1" />
                          <span className="text-sm">Arr: {formatTime(station.sta)}</span>
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 text-gray-400 mr-1" />
                          <span className="text-sm">Dep: {formatTime(station.std)}</span>
                        </div>
                        <div className="flex items-center">
                          <span className="text-sm text-gray-500">Platform: {station.platform_number > 0 ? station.platform_number : 'TBD'}</span>
                        </div>
                      </div>
                      
                      <div className="mt-2 flex flex-wrap gap-2">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          {station.distance_from_source} km from source
                        </span>
                        {station.halt > 0 && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            Halt: {station.halt} min
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {getValidStations(trainStatus.upcoming_stations).length === 0 && (
                <div className="text-center py-6 bg-gray-50 rounded-lg">
                  <AlertCircle className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500">No upcoming stations information available.</p>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="text-center py-10">
              <AlertCircle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Train Information Not Available</h2>
              <p className="text-gray-600">We couldn't find information for train number {trainNo}.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LiveTrainStatus;