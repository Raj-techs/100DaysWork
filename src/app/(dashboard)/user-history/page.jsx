"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/config/firebase";

export default function UserHistoryPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const userId = searchParams.get("id");
  const [user, setUser] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [daysPresent, setDaysPresent] = useState(0);

  useEffect(() => {
    const fetchUser = async () => {
      if (!userId) return;
      
      const docRef = doc(db, "users", userId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        setUser({ id: docSnap.id, ...docSnap.data() });
      } else {
        router.push("/dashboard/home");
      }
    };

    fetchUser();
  }, [userId, router]);

  useEffect(() => {
    if (!user) return;

    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    let presentCount = 0;
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
      if (user.history?.[dateStr]) presentCount++;
    }
    setDaysPresent(presentCount);
  }, [user, currentMonth]);

  const changeMonth = (delta) => {
    setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() + delta)));
  };

  if (!user) return <div className="text-center py-8">Loading user data...</div>;

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const monthName = currentMonth.toLocaleString("default", { month: "long", year: "numeric" });

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6">{user.firstName} {user.secondName}</h2>
      
      <div className="flex flex-col md:flex-row gap-6">
        <div className="md:w-1/2">
          <div className="flex justify-between items-center mb-4">
            <button 
              onClick={() => changeMonth(-1)}
              className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded"
            >
              Previous
            </button>
            <span className="font-bold">{monthName}</span>
            <button 
              onClick={() => changeMonth(1)}
              className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded"
            >
              Next
            </button>
          </div>
          
          <div className="grid grid-cols-7 gap-1">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div key={day} className="text-center font-bold p-1">
                {day}
              </div>
            ))}
            
            {Array(firstDay).fill(null).map((_, i) => (
              <div key={`empty-${i}`} className="p-2"></div>
            ))}
            
            {Array(daysInMonth).fill(null).map((_, i) => {
              const day = i + 1;
              const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
              const isPresent = user.history?.[dateStr];
              
              return (
                <div 
                  key={day}
                  className={`p-2 text-center rounded ${
                    isPresent 
                      ? "bg-green-500 text-white" 
                      : "bg-gray-200 dark:bg-gray-700"
                  }`}
                >
                  {day}
                </div>
              );
            })}
          </div>
        </div>
        
        <div className="md:w-1/2 p-4">
          <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
            <h3 className="text-lg font-bold mb-2">Attendance Summary</h3>
            <p>Days Present: <span className="font-bold">{daysPresent}</span></p>
            <p>Attendance Rate: <span className="font-bold">
              {Math.round((daysPresent / daysInMonth) * 100)}%
            </span></p>
          </div>
        </div>
      </div>
      
      <button 
        onClick={() => router.push("/dashboard/home")}
        className="mt-6 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
      >
        Back to Home
      </button>
    </div>
  );
}