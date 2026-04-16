import React, { useState } from 'react';
import { X, AlertTriangle, Send, MapPin, User, Phone } from 'lucide-react';
import { toast } from 'react-hot-toast';

export const SOSModal = ({ isOpen, onClose, currentCity }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    emergency_type: 'Medical',
    lat: '',
    lon: ''
  });
  const [loading, setLoading] = useState(false);
  const [locating, setLocating] = useState(false);

  if (!isOpen) return null;

  const handleLocate = () => {
    setLocating(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData({
            ...formData,
            lat: position.coords.latitude.toFixed(6),
            lon: position.coords.longitude.toFixed(6)
          });
          setLocating(false);
          toast.success("Location identified!");
        },
        (error) => {
          console.error("Error getting location:", error);
          toast.error("Could not get automatic location. Please enter coordinates manually.");
          setLocating(false);
        }
      );
    } else {
      toast.error("Geolocation not supported by this browser.");
      setLocating(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.lat || !formData.lon || !formData.name || !formData.phone) {
      toast.error("Please fill all details and provide location");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('http://localhost:5001/api/sos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          city: currentCity || 'Mumbai'
        }),
      });

      if (response.ok) {
        toast.success("SOS transmitted! Rescuers prioritized based on your location/severity.", {
          duration: 6000,
          icon: '🚨'
        });
        onClose();
      } else {
        throw new Error("Failed to send SOS");
      }
    } catch (err) {
      toast.error("Failed to connect to rescue server. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="bg-red-600 p-4 text-white flex justify-between items-center">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-6 w-6 animate-pulse" />
            <h2 className="font-bold text-xl tracking-tight">EMERGENCY SOS</h2>
          </div>
          <button onClick={onClose} className="hover:bg-red-700 p-1 rounded-full transition-colors">
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 block">Your Identity</label>
            <div className="space-y-3">
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <input
                  required
                  type="text"
                  placeholder="Full Name"
                  className="w-full pl-10 pr-4 py-2 border rounded-xl focus:ring-2 focus:ring-red-500 outline-none transition-all"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div className="relative">
                <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <input
                  required
                  type="tel"
                  placeholder="Phone Number"
                  className="w-full pl-10 pr-4 py-2 border rounded-xl focus:ring-2 focus:ring-red-500 outline-none transition-all"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                />
              </div>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 block">Emergency Type</label>
            <select
              className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-red-500 outline-none appearance-none bg-gray-50"
              value={formData.emergency_type}
              onChange={(e) => setFormData({...formData, emergency_type: e.target.value})}
            >
              <option>Medical</option>
              <option>Flood</option>
              <option>Fire</option>
              <option>Trap</option>
              <option>Food/Water</option>
              <option>General</option>
            </select>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block">Precise Location</label>
              <button
                type="button"
                onClick={handleLocate}
                disabled={locating}
                className="text-xs font-bold text-red-600 hover:text-red-700 flex items-center gap-1 disabled:opacity-50"
              >
                <MapPin className={`h-3 w-3 ${locating ? 'animate-bounce' : ''}`} />
                {locating ? 'LOCATING...' : 'GET AUTOMATIC LOCATION'}
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <input
                required
                type="text"
                placeholder="Lat (e.g. 19.076)"
                className="w-full px-4 py-2 border rounded-xl text-sm"
                value={formData.lat}
                onChange={(e) => setFormData({...formData, lat: e.target.value})}
              />
              <input
                required
                type="text"
                placeholder="Lon (e.g. 72.877)"
                className="w-full px-4 py-2 border rounded-xl text-sm"
                value={formData.lon}
                onChange={(e) => setFormData({...formData, lon: e.target.value})}
              />
            </div>
            <p className="text-[10px] text-gray-400 mt-2 italic">
              * Priority is calculated based on distance from city center and gravity of situation.
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-red-600 hover:bg-red-700 text-white rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg active:scale-95 disabled:opacity-50"
          >
            {loading ? 'TRANSMITTING...' : (
              <>
                <Send className="h-5 w-5" />
                TRANSMIT RESCUE REQUEST
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
