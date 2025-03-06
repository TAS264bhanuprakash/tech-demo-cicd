import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Train, ArrowLeft, Search, Loader } from 'lucide-react';
import axios from 'axios';
import Navbar from '../components/Navbar';
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

interface Station {
  name: string;
  code: string;
}

const StationList: React.FC = () => {
  const { city } = useParams<{ city: string }>();
  const navigate = useNavigate();
  const [stations, setStations] = useState<Station[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchStations = async () => {
      try {
        setLoading(true);
        // In a real app, you would use the actual API endpoint
        // Using a try-catch to handle potential network errors
        try {
          setLoading(true);
          const response = await axios.get(`http://fastapi-service/table/${city}`);
          console.log(response.data.data);
          console.log("Bhanu")
          setStations(response.data.data);
          setError('');
        } catch (apiError) {
          // Handle API error by using mock data
          console.error('API error:', apiError);
          throw new Error('API request failed');
        }
      } catch (err) {
        // Safe error logging without symbols or non-serializable data
        console.error('Error fetching stations:', err instanceof Error ? err.message : 'Unknown error');
        setError('Failed to load stations. Please try again later.');
        
        // For demo purposes, set mock data if API fails
        if (city === 'goa') {
          setStations([
            { name: "DHENGLI PP GOAN", code: "DGPP" },
            { name: "GOALDIH", code: "GADH" },
            { name: "GOALPARA TOWN", code: "GLPT" },
            { name: "GOHAD ROAD", code: "GOA" },
            { name: "MADGAON (GOA", code: "MAO" }
          ]);
        } else if (city === 'mumbai') {
          setStations([
            { name: "MUMBAI (WADI BANDAR", code: "WB" },
            { name: "MUMBAI BANDRA TERMINUS", code: "BDTS" },
            { name: "MUMBAI CARNAC BUNDAR", code: "CCB" },
            { name: "MUMBAI CENTRAL", code: "BCT" },
            { name: "MUMBAI CENTRAL", code: "MCC" },
            { name: "MUMBAI CENTRAL", code: "MMCT" },
            { name: "MUMBAI CHARNI ROAD", code: "CYR" },
            { name: "MUMBAI CHINCHPOKLI", code: "CHG" },
            { name: "MUMBAI CHURCH GATE", code: "CCG" },
            { name: "MUMBAI COTTON GREEN", code: "CTGN" },
            { name: "MUMBAI CSMT", code: "CSMT" },
            { name: "MUMBAI CST", code: "CSTM" },
            { name: "MUMBAI CURREY ROAD", code: "CRD" },
            { name: "MUMBAI DADAR CENTRAL", code: "DR" },
            { name: "MUMBAI DADAR WEST", code: "DDR" },
            { name: "MUMBAI DOCKYARD ROAD", code: "DKRD" },
            { name: "MUMBAI ELPHINSTONE ROAD", code: "EPR" },
            { name: "MUMBAI GOVANDI", code: "GV" },
            { name: "MUMBAI GRANT ROAD", code: "GTR" },
            { name: "MUMBAI KINGS CIRCLE", code: "KCE" },
            { name: "MUMBAI LOWER PAREL", code: "PL" },
            { name: "MUMBAI MAHALAKSHMI", code: "MX" },
            { name: "MUMBAI MAHIM JN", code: "MM" },
            { name: "MUMBAI MARINE LINES", code: "MEL" },
            { name: "MUMBAI MATUNGA", code: "MTN" },
            { name: "MUMBAI MATUNGA ROAD", code: "MRU" },
            { name: "MUMBAI PAREL", code: "PR" },
            { name: "MUMBAI RAVLI JN", code: "RVJ" },
            { name: "MUMBAI REAY ROAD", code: "RRD" },
            { name: "MUMBAI SANDHURST ROAD", code: "SNRD" },
            { name: "MUMBAI SEWRI", code: "SVE" },
            { name: "MUMBAI SION", code: "SIN" },
            { name: "MUMBAI VADALA ROAD", code: "VDLR" }
          ]);
        } else if (city === 'delhi') {
          setStations([
            { name: "ADARSH NAGAR DELHI", code: "ANDI" },
            { name: "DELHI AZADPUR", code: "DAZ" },
            { name: "DELHI CANTT", code: "DEC" },
            { name: "DELHI CANTT SIDING", code: "DEBS" },
            { name: "DELHI HAZRAT NIZAMUDDIN", code: "NZM" },
            { name: "DELHI KISHAN GANJ OUTER CABIN", code: "XX-DKZO" },
            { name: "DELHI KISHANGANJ", code: "DKZ" },
            { name: "DELHI MG", code: "DE" },
            { name: "DELHI SADAR BAZAR", code: "DSB" },
            { name: "DELHI SAFDARJUNG", code: "DSJ" },
            { name: "DELHI SARAI ROHILLA", code: "DEE" },
            { name: "DELHI SHAHADRA OUTER CABIN", code: "XX-DSAO" },
            { name: "DELHI SHAHDARA", code: "DSA" },
            { name: "DELHI SHAHDARA A PANEL", code: "DSAP" },
            { name: "DELHI SHAHDARA B PANEL", code: "DSBP" },
            { name: "DELHI SHAHDARA BLOCK CABIN", code: "DSBC" },
            { name: "NEW DELHI", code: "NDLS" },
            { name: "OLD DELHI", code: "DLI" }
          ]);
        } else if (city === 'bangalore') {
          setStations([
            { name: "ANEKAL ROAD", code: "AEK" },
            { name: "BAIYAPPANAHALLI YARD", code: "BYP1" },
            { name: "BAIYYAPPANAHALI WEST CABIN", code: "BYPW" },
            { name: "BAIYYAPPANAHALLI YARD CABIN", code: "BYPY" },
            { name: "BANASANKARAI HALT", code: "BNK" },
            { name: "BANGALBAREE", code: "BJY" },
            { name: "BANGALORE CANT (BENGALURU", code: "BNC" },
            { name: "BANGALORE EAST (BENGALURU", code: "BNCE" },
            { name: "BELANDUR ROAD", code: "BLRR" },
            { name: "BHANGALA", code: "BNGL" },
            { name: "BHANKALA HALT", code: "BNQL" },
            { name: "BONA KALU", code: "BKL" },
            { name: "DODAJALA LAKE", code: "DJL" },
            { name: "HOODI HALT", code: "HDIH" },
            { name: "INDIRA NAGAR", code: "INDR" },
            { name: "JNANA BHARTI HALT", code: "GNB" },
            { name: "JORE BUNGLOW", code: "JBY" },
            { name: "KRISHNADEVARAYA HALT", code: "KNDV" },
            { name: "KSR BENGALURU", code: "SBC" },
            { name: "VENKATAGIRI KOTE HALT", code: "VTE" },
            { name: "VENKATAGIRI KOTE HALT", code: "H" },
            { name: "VIMANA PURA", code: "VMN" },
            { name: "WHITE FIELD SATELLITE", code: "SGWF" },
            { name: "YELHANKA JN", code: "YNK" },
            { name: "YESVANTPUR JN (BENGALURU", code: "YPR" }
          ]);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchStations();
  }, [city]);

  const filteredStations = stations.filter(station => 
    station.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    station.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleBack = () => {
    navigate('/dashboard');
  };

  const handleStationClick = (stationCode: string) => {
    navigate(`/trains/${stationCode}`);
  };

  const getCityDisplayName = (cityName?: string) => {
    if (!cityName) return '';
    
    if (cityName.toLowerCase() === 'goa') {
      return 'GOA';
    }
    
    return cityName.charAt(0).toUpperCase() + cityName.slice(1);
  };

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
            Back to Dashboard
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
            <h1 className="text-2xl font-bold text-gray-900 flex items-center">
              <Train className="h-6 w-6 text-primary mr-2" />
              {getCityDisplayName(city)} Railway Stations
            </h1>
            <div className="relative w-full md:w-auto">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search stations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full md:w-auto pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <Loader className="h-8 w-8 text-primary animate-spin" />
              <span className="ml-2 text-gray-600">Loading stations...</span>
            </div>
          ) : error && stations.length === 0 ? (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
              <span className="block sm:inline">{error}</span>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredStations.map((station, index) => (
                  <div 
                    key={`${station.code}-${index}`}
                    onClick={() => handleStationClick(station.code)}
                    className="bg-primary-light border border-primary/10 rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer hover:bg-primary/5"
                  >
                    <div className="flex items-start">
                      <div className="bg-primary/10 p-3 rounded-full">
                        <Train className="h-6 w-6 text-primary" />
                      </div>
                      <div className="ml-4">
                        <h3 className="text-lg font-semibold text-gray-800">{station.name}</h3>
                        <div className="mt-1 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary/20 text-primary">
                          {station.code}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {filteredStations.length === 0 && (
                <div className="text-center py-10">
                  <p className="text-gray-500">No stations found matching your search.</p>
                </div>
              )}

              <div className="mt-6 text-right text-sm text-gray-500">
                Total stations: {stations.length}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default StationList;