import React, { useState, useEffect } from 'react';
import { X, Filter } from 'lucide-react';
import axios from 'axios';

const Dashboard = () => {
  const [users, setUsers] = useState([]);
  const [filterOpen, setFilterOpen] = useState(false);
  const [locations, setLocations] = useState({
    continents: [],
    countries: [],
    states: [],
    cities: []
  });
  const [filters, setFilters] = useState({
    continent: '',
    country: '',
    state: '',
    city: ''
  });
  const [loading, setLoading] = useState(false);

  const fetchUsers = async (params = {}) => {
    setLoading(true);
    const queryString = new URLSearchParams(params).toString();
    const response = await axios.get(`/users?${queryString}`);
    const data = await response.data;
    setUsers(data.users);
    setLoading(false);
  };

  const fetchLocations = async () => {
    const response = await axios.get('/users/locations');
    const data = await response.data;
    setLocations(data);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (filterOpen) {
      fetchLocations();
    }
  }, [filterOpen]);

  const handleFilterChange = (field, value) => {
    const newFilters = { ...filters, [field]: value };
    setFilters(newFilters);
    fetchUsers(newFilters);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <main className="flex-1 p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Users Dashboard</h1>
          <button
            onClick={() => setFilterOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Filter size={20} />
            Filter
          </button>
        </div>

        {loading ? (
          <p>Loading users...</p>
        ) : (
          <div className="bg-white rounded-lg shadow">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Continent</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Country</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">State</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">City</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {users.map(user => (
                    <tr key={user.id}>
                      <td className="px-6 py-4">{user.name}</td>
                      <td className="px-6 py-4">{user.continent}</td>
                      <td className="px-6 py-4">{user.country}</td>
                      <td className="px-6 py-4">{user.state}</td>
                      <td className="px-6 py-4">{user.city}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      <div className={`fixed inset-y-0 right-0 w-80 bg-white shadow-xl transform ${filterOpen ? 'translate-x-0' : 'translate-x-full'} transition-transform`}>
        <div className="h-full flex flex-col">
          <div className="px-4 py-6 border-b">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-medium">Filters</h2>
              <button onClick={() => setFilterOpen(false)} className="text-gray-500 hover:text-gray-700">
                <X size={20} />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {['continent', 'country', 'state', 'city'].map((locationType) => (
              <div key={locationType}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {locationType.charAt(0).toUpperCase() + locationType.slice(1)}
                </label>
                <select
                  value={filters[locationType]}
                  onChange={(e) => handleFilterChange(locationType, e.target.value)}
                  className="w-full border-gray-300 rounded-md shadow-sm"
                >
                  <option value="">All {locationType.charAt(0).toUpperCase() + locationType.slice(1).replace('y', 'ie') + 's'}</option>

                  {locations[locationType.replace('y', 'ie') + 's']?.map(item => (
                    <option key={item} value={item}>{item}</option>
                  ))}
                </select>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
