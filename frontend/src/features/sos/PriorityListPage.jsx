import React, { useState, useEffect } from 'react';
import { ShieldAlert, MapPin, Clock, ArrowUp, Phone, User, Activity } from 'lucide-react';
import { toast } from 'react-hot-toast';

const PriorityListPage = () => {
  const [sosRequests, setSosRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSOSRequests = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/sos/list');
      if (response.ok) {
        const data = await response.json();
        setSosRequests(data);
      }
    } catch (err) {
      console.error("Failed to fetch SOS requests:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSOSRequests();
    const interval = setInterval(fetchSOSRequests, 10000); // Poll every 10s
    return () => clearInterval(interval);
  }, []);

  const getSeverityColor = (type) => {
    const colors = {
      'Medical': 'bg-red-100 text-red-700 border-red-200',
      'Fire': 'bg-orange-100 text-orange-700 border-orange-200',
      'Flood': 'bg-blue-100 text-blue-700 border-blue-200',
      'Trap': 'bg-purple-100 text-purple-700 border-purple-200',
      'Food/Water': 'bg-green-100 text-green-700 border-green-200',
      'General': 'bg-gray-100 text-gray-700 border-gray-200'
    };
    return colors[type] || colors['General'];
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <ShieldAlert className="h-7 w-7 text-red-600" />
            Priority Rescue Queue
          </h1>
          <p className="text-gray-500 mt-1">Live emergency requests prioritized by AI (Distance + Severity)</p>
        </div>
        
        <div className="flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-xl text-blue-700 border border-blue-100">
          <Activity className="h-4 w-4 animate-pulse" />
          <span className="text-sm font-bold">{sosRequests.length} Active Requests</span>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-dashed text-gray-400">
          <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-100 border-t-blue-600 mb-4" />
          <p className="font-medium">Connecting to Rescue Server...</p>
        </div>
      ) : sosRequests.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-gray-100">
          <div className="bg-gray-50 h-20 w-20 rounded-full flex items-center justify-center mx-auto mb-4">
            <ShieldAlert className="h-10 w-10 text-gray-300" />
          </div>
          <h3 className="text-lg font-bold text-gray-900">No active SOS calls</h3>
          <p className="text-gray-500">The system is clear. All quiet on the monitoring front.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {sosRequests.map((request, index) => (
            <div 
              key={request.id}
              className={`bg-white rounded-2xl shadow-sm border-l-8 transition-all hover:shadow-md ${
                index === 0 ? 'border-l-red-600 ring-2 ring-red-100' : 
                index === 1 ? 'border-l-orange-500' : 'border-l-gray-300'
              }`}
            >
              <div className="p-5 flex flex-col md:flex-row gap-6 items-start md:items-center">
                
                {/* Priority Rank */}
                <div className="flex-shrink-0 flex flex-col items-center justify-center w-12 h-12 rounded-xl bg-gray-50 border font-black text-lg">
                  <span className="text-xs font-bold text-gray-400 uppercase">#</span>
                  {index + 1}
                </div>

                {/* User Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-lg font-bold text-gray-900 truncate uppercase mt-[-1px]">{request.name}</h3>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-black border uppercase tracking-widest ${getSeverityColor(request.emergency_type)}`}>
                      {request.emergency_type}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <Phone className="h-3 w-3" /> {request.phone}
                    </span>
                    <span className="flex items-center gap-1 font-medium text-red-600">
                      <MapPin className="h-3 w-3" /> {request.distance} km from center
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" /> {request.timestamp}
                    </span>
                  </div>
                </div>

                {/* Action / Priority Score */}
                <div className="flex-shrink-0 flex items-center gap-6 w-full md:w-auto mt-4 md:mt-0 pt-4 md:pt-0 border-t md:border-t-0 md:border-l md:pl-6 border-gray-100">
                  <div className="text-center">
                    <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Priority Score</p>
                    <div className="flex items-center justify-center gap-1 text-2xl font-black text-gray-900">
                      {request.priority_score}
                      <ArrowUp className="h-4 w-4 text-green-500" />
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => toast.success(`Dispatching rescue to ${request.name}...`)}
                    className="flex-1 md:flex-none px-6 py-3 bg-gray-900 text-white rounded-xl font-bold hover:bg-black transition-all active:scale-95 shadow-sm"
                  >
                    DISPATCH
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PriorityListPage;
