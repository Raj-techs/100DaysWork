"use client";
import { useState, useEffect } from "react";
import { useUsers } from "@/hooks/useUsers";
import UserCard from "@/components/UserCard";

export default function HomePage() {
  const { users, loading, updateUser } = useUsers();
  const [leftFilter, setLeftFilter] = useState("");
  const [rightFilter, setRightFilter] = useState("");
  const [genderFilter, setGenderFilter] = useState("All");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [today, setToday] = useState("");
  const [counts, setCounts] = useState({
    present: 0,
    absent: 0,
    male: 0,
    female: 0,
    all: 0
  });
  const [pendingUpdates, setPendingUpdates] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);

  // Initialize client-side only values
  useEffect(() => {
    setHasMounted(true);
    setToday(new Date().toISOString().split("T")[0]);
  }, []);

  useEffect(() => {
    if (!hasMounted) return;

    let result = [...users];
    
    if (genderFilter !== "All") {
      result = result.filter(user => user.gender === genderFilter);
    }
    
    if (leftFilter) {
      result = result.filter(user => 
        user.firstName?.toUpperCase().startsWith(leftFilter.toUpperCase())
      );
    }
    
    if (rightFilter) {
      result = result.filter(user => 
        user.secondName?.toUpperCase().startsWith(rightFilter.toUpperCase())
      );
    }
    
    setFilteredUsers(result);
    
    const present = users.reduce((count, user) => {
      if (!today) return 0;
      const isPresent = pendingUpdates[user.id] !== undefined 
        ? pendingUpdates[user.id]
        : user.history?.[today];
      return count + (isPresent ? 1 : 0);
    }, 0);
    
    const absent = users.length - present;
    const male = users.filter(u => u.gender === "Male").length;
    const female = users.filter(u => u.gender === "Female").length;
    
    setCounts({
      present,
      absent,
      male,
      female,
      all: users.length
    });
  }, [users, leftFilter, rightFilter, genderFilter, today, pendingUpdates, hasMounted]);

  const handleCheckboxChange = (userId, isPresent) => {
    setPendingUpdates(prev => ({
      ...prev,
      [userId]: isPresent
    }));
  };

  
  const saveToFirebase = async () => {
    if (Object.keys(pendingUpdates).length === 0 || !today) return;
    
    setIsSaving(true);
    try {
      // Create an array of update promises
      const updatePromises = Object.entries(pendingUpdates).map(
        async ([userId, isPresent]) => {
          try {
            await updateUser(userId, { 
              [`history.${today}`]: isPresent 
            });
          } catch (error) {
            console.error(`Failed to update user ${userId}:`, error);
            throw error; // Re-throw to stop further execution
          }
        }
      );
      
      // Wait for all updates to complete
      await Promise.all(updatePromises);
      
      // Clear pending updates after successful save
      setPendingUpdates({});
    } catch (error) {
      console.error("Failed to save attendance:", error);
      setError("Failed to save attendance. Please try again.");
    } finally {
      setIsSaving(false);
    }
  }

  if (loading) return <div className="text-center py-8">Loading users...</div>;

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="mb-6 bg-green-600 p-4 rounded-lg text-white">
        <div className="flex flex-wrap justify-between items-center gap-4">
          <div className="flex flex-wrap gap-2">
            <button 
              onClick={() => setGenderFilter("All")} 
              className={`px-4 py-2 rounded ${genderFilter === "All" ? "bg-gray-700" : "bg-gray-600"}`}
            >
              All: {counts.all}
            </button>
            <button 
              onClick={() => setGenderFilter("Male")} 
              className={`px-4 py-2 rounded ${genderFilter === "Male" ? "bg-gray-700" : "bg-gray-600"}`}
            >
              Male: {counts.male}
            </button>
            <button 
              onClick={() => setGenderFilter("Female")} 
              className={`px-4 py-2 rounded ${genderFilter === "Female" ? "bg-gray-700" : "bg-gray-600"}`}
            >
              Female: {counts.female}
            </button>
            <button 
              onClick={saveToFirebase}
              disabled={isSaving || Object.keys(pendingUpdates).length === 0}
              className={`px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 ${
                isSaving || Object.keys(pendingUpdates).length === 0 ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {isSaving ? "Saving..." : "Save"}
            </button>
          </div>
          
          <div className="flex gap-4">
            <span>Present: {counts.present}</span>
            <span>Absent: {counts.absent}</span>
          </div>
        </div>
      </div>

      {hasMounted && (
        <div className="h-[calc(100vh-180px)] flex overflow-hidden">
          {/* Left Filter */}
          <div className="w-8 overflow-y-auto p-1 flex flex-col gap-2 scrollbar-hide">
            <button 
              onClick={() => setLeftFilter("")} 
              className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded text-xs"
            >
              All
            </button>
            {[...Array(26)].map((_, i) => {
              const letter = String.fromCharCode(65 + i);
              return (
                <button
                  key={letter}
                  onClick={() => setLeftFilter(letter)}
                  className={`px-2 py-1 rounded text-xs ${
                    leftFilter === letter 
                      ? "bg-green-600 text-white" 
                      : "bg-gray-200 dark:bg-gray-700"
                  }`}
                >
                  {letter}
                </button>
              );
            })}
          </div>

          {/* Users List */}
          <div className="flex-1 overflow-y-auto scrollbar-hide px-4 py-2">
            <div className="grid grid-cols-1 gap-4">
              {filteredUsers.map((user) => {
                const isChecked = pendingUpdates[user.id] !== undefined
                  ? pendingUpdates[user.id]
                  : !!user.history?.[today];
                
                return (
                  <UserCard 
                    key={user.id}
                    user={user}
                    onAttendanceChange={handleCheckboxChange}
                    isChecked={isChecked}
                    today={today}
                  />
                );
              })}
            </div>
          </div>

          {/* Right Filter */}
          <div className="w-8 overflow-y-auto p-1 flex flex-col gap-2 scrollbar-hide bg-gray-200 dark:bg-gray-700">
            <button 
              onClick={() => setRightFilter("")} 
              className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded text-xs"
            >
              All
            </button>
            {[...Array(26)].map((_, i) => {
              const letter = String.fromCharCode(65 + i);
              return (
                <button
                  key={letter}
                  onClick={() => setRightFilter(letter)}
                  className={`px-2 py-1 rounded text-xs ${
                    rightFilter === letter 
                      ? "bg-green-600 text-white" 
                      : "bg-gray-200 dark:bg-gray-700"
                  }`}
                >
                  {letter}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
} 