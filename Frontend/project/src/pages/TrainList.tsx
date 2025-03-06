import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Train, ArrowLeft, Clock, Calendar, Search, Loader, AlertCircle, MapPin } from 'lucide-react';
import axios from 'axios';
import Navbar from '../components/Navbar';
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

interface TrainDetails {
  train_no: string;
  train_name: string;
  arrival_time: string;
  departure_time: string;
  classes: string;
}

const TrainList: React.FC = () => {
  const { stationCode } = useParams<{ stationCode: string }>();
  const navigate = useNavigate();
  const [trains, setTrains] = useState<TrainDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [stationName, setStationName] = useState('');

  useEffect(() => {
    const fetchTrains = async () => {
      try {
        setLoading(true);
        // In a real app, you would use the actual API endpoint
        try {
          const response = await axios.get(`http://fastapi-service/get_trains/${stationCode}`);
          setTrains(response.data.data);
          setError('');
        } catch (apiError) {
          console.error('API error:', apiError instanceof Error ? apiError.message : 'Unknown error');
          throw new Error('API request failed');
        }
      } catch (err) {
        console.error('Error fetching trains:', err instanceof Error ? err.message : 'Unknown error');
        setError('Failed to load train information. Please try again later.');
        
        // For demo purposes, set mock data if API fails
        if (stationCode) {
          setTrains([
            {
              "train_no": "59823",
              "train_name": "GWALIOR - BHIND Passenger",
              "arrival_time": "07:36",
              "departure_time": "07:37",
              "classes": "SL,1A,EC,EA,2A,3A,3E,CC,FC,2S"
            },
            {
              "train_no": "59824",
              "train_name": "BHIND - GWALIOR Passenger",
              "arrival_time": "10:48",
              "departure_time": "10:50",
              "classes": "SL,1A,EC,EA,2A,3A,3E,CC,FC,2S"
            },
            {
              "train_no": "59825",
              "train_name": "GWALIOR - BHIND Passenger",
              "arrival_time": "15:36",
              "departure_time": "15:38",
              "classes": "SL,1A,EC,EA,2A,3A,3E,CC,FC,2S"
            },
            {
              "train_no": "59826",
              "train_name": "BHIND - GWALIOR Passenger",
              "arrival_time": "19:43",
              "departure_time": "19:45",
              "classes": "SL,1A,EC,EA,2A,3A,3E,CC,FC,2S"
            },
            {
              "train_no": "51889",
              "train_name": "GWALIOR - BHIND Passenger",
              "arrival_time": "15:36",
              "departure_time": "15:38",
              "classes": "SL,1A,EC,EA,2A,3A,3E,CC,FC,2S"
            },
            {
              "train_no": "51890",
              "train_name": "BHIND - GWALIOR Passenger",
              "arrival_time": "19:43",
              "departure_time": "19:45",
              "classes": "SL,1A,EC,EA,2A,3A,3E,CC,FC,2S"
            },
            {
              "train_no": "51888",
              "train_name": "ETAWAH - GWALIOR Passenger",
              "arrival_time": "11:48",
              "departure_time": "11:50",
              "classes": "SL,1A,EC,EA,2A,3A,3E,CC,FC,2S"
            },
            {
              "train_no": "51887",
              "train_name": "GWALIOR - ETAWAH Passenger",
              "arrival_time": "07:07",
              "departure_time": "07:09",
              "classes": "SL,1A,EC,EA,2A,3A,3E,CC,FC,2S"
            },
            {
              "train_no": "11904",
              "train_name": "Intercity Express",
              "arrival_time": "06:12",
              "departure_time": "06:12",
              "classes": "SL"
            },
            {
              "train_no": "01892",
              "train_name": "ETAWAH - GWALIOR MEMU Special",
              "arrival_time": "09:05",
              "departure_time": "09:07",
              "classes": "SL,1A,EC,EA,2A,3A,3E,CC,FC,2S"
            }
          ]);
        }
      } finally {
        setLoading(false);
      }
    };

    // Fetch station name from localStorage or use code as fallback
    const storedStations = localStorage.getItem('stations');
    if (storedStations) {
      try {
        const stations = JSON.parse(storedStations);
        const station = stations.find((s: any) => s.code === stationCode);
        if (station) {
          setStationName(station.name);
        } else {
          setStationName(stationCode || '');
        }
      } catch (e) {
        setStationName(stationCode || '');
      }
    } else {
      setStationName(stationCode || '');
    }

    fetchTrains();
  }, [stationCode]);

  const filteredTrains = trains.filter(train => 
    train.train_name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    train.train_no.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleBack = () => {
    navigate(-1);
  };

  const handleTrackTrain = (trainNo: string) => {
    navigate(`/live-tracking/${trainNo}`);
  };

  // Function to format class codes into readable format
  const formatClasses = (classes: string) => {
    const classMap: Record<string, string> = {
      'SL': 'Sleeper',
      '1A': '1st AC',
      '2A': '2nd AC',
      '3A': '3rd AC',
      'CC': 'Chair Car',
      'EC': 'Exec. Chair Car',
      'FC': 'First Class',
      '2S': 'Second Sitting',
      '3E': '3rd AC Economy',
      'EA': 'Executive Anubhuti'
    };

    return classes.split(',').map(cls => classMap[cls] || cls);
  };

  // Function to get time period (morning, afternoon, evening, night)
  const getTimePeriod = (time: string) => {
    const hour = parseInt(time.split(':')[0], 10);
    
    if (hour >= 5 && hour < 12) return 'Morning';
    if (hour >= 12 && hour < 17) return 'Afternoon';
    if (hour >= 17 && hour < 21) return 'Evening';
    return 'Night';
  };

  // Group trains by time period
  const groupedTrains = filteredTrains.reduce((acc: Record<string, TrainDetails[]>, train) => {
    const period = getTimePeriod(train.arrival_time);
    if (!acc[period]) {
      acc[period] = [];
    }
    acc[period].push(train);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-primary-light">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center mb-8">
          <button 
            onClick={handleBack}
            className="flex items-center text-primary hover:text-primary-dark transition-colors"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Stations
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                <Train className="h-6 w-6 text-primary mr-2" />
                Trains at {stationName}
              </h1>
              <p className="text-gray-600 mt-1">Station Code: {stationCode}</p>
            </div>
            <div className="relative w-full md:w-auto">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search trains..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full md:w-auto pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <Loader className="h-8 w-8 text-primary animate-spin" />
              <span className="ml-2 text-gray-600">Loading train information...</span>
            </div>
          ) : error && trains.length === 0 ? (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
              <AlertCircle className="h-5 w-5 inline mr-2" />
              <span className="inline">{error}</span>
            </div>
          ) : (
            <>
              {Object.keys(groupedTrains).length === 0 ? (
                <div className="text-center py-10">
                  <p className="text-gray-500">No trains found matching your search.</p>
                </div>
              ) : (
                Object.entries(groupedTrains).map(([period, periodTrains]) => (
                  <div key={period} className="mb-8">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                      <Calendar className="h-5 w-5 mr-2 text-primary" />
                      {period} Trains
                    </h2>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      {periodTrains.map((train, index) => (
                        <div 
                          key={`${train.train_no}-${index}`}
                          className="bg-primary-light border border-primary/10 rounded-lg p-5 hover:shadow-md transition-shadow"
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="text-lg font-semibold text-gray-800">{train.train_name}</h3>
                              <div className="mt-1 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary/20 text-primary">
                                {train.train_no}
                              </div>
                            </div>
                            <button
                              onClick={() => handleTrackTrain(train.train_no)}
                              className="flex items-center px-3 py-2 bg-secondary text-white rounded-md hover:bg-secondary-dark transition-colors text-sm"
                            >
                              <MapPin className="h-4 w-4 mr-1" />
                              Live Track
                            </button>
                          </div>
                          
                          <div className="mt-4 grid grid-cols-2 gap-4">
                            <div className="flex items-center">
                              <Clock className="h-5 w-5 text-green-600 mr-2" />
                              <div>
                                <p className="text-sm text-gray-500">Arrival</p>
                                <p className="font-medium">{train.arrival_time}</p>
                              </div>
                            </div>
                            <div className="flex items-center">
                              <Clock className="h-5 w-5 text-red-600 mr-2" />
                              <div>
                                <p className="text-sm text-gray-500">Departure</p>
                                <p className="font-medium">{train.departure_time}</p>
                              </div>
                            </div>
                          </div>
                          
                          <div className="mt-4">
                            <p className="text-sm text-gray-500 mb-1">Available Classes</p>
                            <div className="flex flex-wrap gap-2">
                              {formatClasses(train.classes).map((cls, i) => (
                                <span 
                                  key={i} 
                                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary-light text-secondary-dark"
                                >
                                  {cls}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              )}

              <div className="mt-6 text-right text-sm text-gray-500">
                Total trains: {trains.length}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default TrainList;