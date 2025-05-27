"use client";
import { useState, useEffect } from "react";
import { useUsers } from "@/hooks/useUsers";
import GroupCard from "@/components/GroupCard";
import { useRouter } from "next/navigation";

export default function GroupsPage() {
  const { users, loading } = useUsers();
  const router = useRouter();
  const [groups, setGroups] = useState([]);
  const [groupSize, setGroupSize] = useState(2);
  const [shuffled, setShuffled] = useState(false);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (users.length > 0) {
      createGroups();
    }
  }, [users, groupSize, shuffled, filter]);

  const createGroups = () => {
    let filteredUsers = [...users];
    
    // Apply gender filter
    if (filter !== "all") {
      filteredUsers = filteredUsers.filter(user => user.gender === filter);
    }
    
    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filteredUsers = filteredUsers.filter(user => 
        user.firstName.toLowerCase().includes(term) || 
        user.secondName.toLowerCase().includes(term) ||
        user.workNumber.toLowerCase().includes(term)
      );
    }
    
    // Shuffle if needed
    const usersToGroup = shuffled 
      ? [...filteredUsers].sort(() => Math.random() - 0.5) 
      : filteredUsers;

    // Create groups
    const newGroups = [];
    for (let i = 0; i < usersToGroup.length; i += groupSize) {
      const group = usersToGroup.slice(i, i + groupSize);
      newGroups.push(group);
    }
    
    setGroups(newGroups);
  };

  const handleGroupClick = (userId) => {
    router.push(`/dashboard/user-history?id=${userId}`);
  };

  const handleShuffle = () => {
    setShuffled(!shuffled);
  };

  const handleGroupSizeChange = (size) => {
    setGroupSize(size);
  };

  if (loading) return <div className="text-center py-8">Loading users...</div>;

  return (
    <div className="container mx-auto p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
        <h1 className="text-2xl font-bold mb-6">Group Management</h1>
        
        {/* Controls Section */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <label className="block mb-2">Search Users</label>
            <input
              type="text"
              placeholder="Search by name or work number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
            />
          </div>
          
          <div>
            <label className="block mb-2">Filter by Gender</label>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
            >
              <option value="all">All</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="flex items-center gap-2">
            <span>Group Size:</span>
            {[2, 3, 4, 5].map((size) => (
              <button
                key={size}
                onClick={() => handleGroupSizeChange(size)}
                className={`px-3 py-1 rounded ${
                  groupSize === size 
                    ? "bg-green-600 text-white" 
                    : "bg-gray-200 dark:bg-gray-700"
                }`}
              >
                {size}
              </button>
            ))}
          </div>
          
          <button
            onClick={handleShuffle}
            className={`px-4 py-2 rounded ${
              shuffled 
                ? "bg-blue-600 text-white" 
                : "bg-gray-200 dark:bg-gray-700"
            }`}
          >
            {shuffled ? "Shuffled" : "Shuffle"}
          </button>
        </div>
        
        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-green-100 dark:bg-green-900 p-3 rounded-lg">
            <h3 className="font-bold">Total Users</h3>
            <p className="text-xl">{users.length}</p>
          </div>
          <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-lg">
            <h3 className="font-bold">Total Groups</h3>
            <p className="text-xl">{groups.length}</p>
          </div>
          <div className="bg-purple-100 dark:bg-purple-900 p-3 rounded-lg">
            <h3 className="font-bold">Group Size</h3>
            <p className="text-xl">{groupSize}</p>
          </div>
        </div>
      </div>
      
      {/* Groups Display */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {groups.map((group, index) => (
          <GroupCard 
            key={index}
            group={group}
            onPairClick={handleGroupClick}
          />
        ))}
      </div>
      
      {groups.length === 0 && (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          No groups found with current filters
        </div>
      )}
    </div>
  );
}