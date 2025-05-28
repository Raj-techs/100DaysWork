"use client";
import { useState, useEffect, useRef } from "react";
import { useUsers } from "@/hooks/useUsers";
import { collection, addDoc } from "firebase/firestore";
import { db } from "@/config/firebase";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

export default function ReportsPage() {
  const { users } = useUsers();
  const [filter, setFilter] = useState("today");
  const [customDate, setCustomDate] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [reportName, setReportName] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const tableRef = useRef(null);

  useEffect(() => {
    updateFilteredUsers();
  }, [users, filter, customDate]);

  const updateFilteredUsers = () => {
    let date;
    const today = new Date().toISOString().split("T")[0];
    const yesterday = new Date(new Date().setDate(new Date().getDate() - 1)).toISOString().split("T")[0];

    if (filter === "today") date = today;
    else if (filter === "yesterday") date = yesterday;
    else date = customDate;

    const result = users.filter(user => user.history?.[date]);
    setFilteredUsers(result);
  };

  const handleSaveReport = async () => {
    if (!reportName.trim()) {
      alert("Please enter a report name");
      return;
    }

    setIsSaving(true);
    try {
      const today = new Date().toISOString().split("T")[0];
      const reportData = {
        name: reportName,
        date: today,
        filterDate: filter === "custom" ? customDate : filter,
        totalPresent: filteredUsers.length,
        totalAbsent: users.length - filteredUsers.length,
        males: filteredUsers.filter(u => u.gender === "Male").length,
        females: filteredUsers.filter(u => u.gender === "Female").length,
        users: filteredUsers.map(u => ({
          id: u.id,
          name: `${u.firstName} ${u.secondName}`,
          workNumber: u.workNumber,
          gender: u.gender
        })),
        createdAt: new Date().toISOString()
      };

      await addDoc(collection(db, "reports"), reportData);
      alert("Report saved successfully!");
      setReportName("");
    } catch (error) {
      console.error("Error saving report:", error);
      alert("Failed to save report");
    } finally {
      setIsSaving(false);
    }
  };

  const downloadReport = async (format) => {
    if (!tableRef.current) return;

    try {
      if (format === "pdf") {
        const doc = new jsPDF();
        
        // Add title
        doc.setFontSize(18);
        doc.text("100 Days Work - Attendance Report", 14, 15);
        
        // Add date information
        doc.setFontSize(12);
        const dateText = filter === "today" 
          ? "Today's Report" 
          : filter === "yesterday" 
            ? "Yesterday's Report" 
            : `Custom Date: ${customDate}`;
        doc.text(dateText, 14, 25);
        
        // Add summary
        doc.text(`Total Present: ${filteredUsers.length}`, 14, 35);
        doc.text(`Total Absent: ${users.length - filteredUsers.length}`, 14, 45);
        doc.text(`Males Present: ${filteredUsers.filter(u => u.gender === "Male").length}`, 14, 55);
        doc.text(`Females Present: ${filteredUsers.filter(u => u.gender === "Female").length}`, 14, 65);
        
        // Add table
        await doc.autoTable({
          html: tableRef.current,
          startY: 75,
          styles: { fontSize: 8 },
          headStyles: { fillColor: [34, 197, 94] } // Green-600
        });
        
        doc.save(`report_${new Date().toISOString().split("T")[0]}.pdf`);
      } 
      else if (format === "img") {
        const canvas = await html2canvas(tableRef.current);
        const imgData = canvas.toDataURL("image/png");
        
        const link = document.createElement("a");
        link.download = `report_${new Date().toISOString().split("T")[0]}.png`;
        link.href = imgData;
        link.click();
      }
    } catch (error) {
      console.error("Error generating report:", error);
      alert("Failed to generate report");
    }
  };

  const getDisplayDate = () => {
    if (filter === "today") return "Today";
    if (filter === "yesterday") return "Yesterday";
    if (filter === "custom") return customDate;
    return "";
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg mb-6">
        <h2 className="text-2xl font-bold mb-6">Attendance Reports</h2>
        
        {/* Filters Section */}
        <div className="flex flex-wrap gap-4 mb-6 items-center">
          <div className="flex flex-wrap gap-2">
            <button 
              onClick={() => setFilter("today")} 
              className={`px-4 py-2 rounded ${
                filter === "today" 
                  ? "bg-green-600 text-white" 
                  : "bg-gray-200 dark:bg-gray-700"
              }`}
            >
              Today
            </button>
            <button 
              onClick={() => setFilter("yesterday")} 
              className={`px-4 py-2 rounded ${
                filter === "yesterday" 
                  ? "bg-green-600 text-white" 
                  : "bg-gray-200 dark:bg-gray-700"
              }`}
            >
              Yesterday
            </button>
          </div>
          
          <div className="flex items-center gap-2">
            <input
              type="date"
              value={customDate}
              onChange={(e) => {
                setCustomDate(e.target.value);
                setFilter("custom");
              }}
              className="p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
            />
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {getDisplayDate()}
            </span>
          </div>
        </div>

        {/* Report Saving Section */}
        <div className="mb-6 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
          <h3 className="text-lg font-bold mb-2">Save This Report</h3>
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <input
              type="text"
              placeholder="Enter report name"
              value={reportName}
              onChange={(e) => setReportName(e.target.value)}
              className="flex-1 p-2 border rounded dark:bg-gray-600 dark:border-gray-500 w-full"
            />
            <button
              onClick={handleSaveReport}
              disabled={isSaving}
              className={`px-4 py-2 rounded w-full md:w-auto ${
                isSaving 
                  ? "bg-gray-400" 
                  : "bg-blue-600 hover:bg-blue-700 text-white"
              }`}
            >
              {isSaving ? "Saving..." : "Save to Database"}
            </button>
          </div>
        </div>

        {/* Report Summary */}
       <div className="flex flex-wrap gap-4 mb-6">
  <div className="flex-1 min-w-[150px] bg-green-100 dark:bg-green-900 p-4 rounded-lg">
    <h4 className="font-bold">Total Present</h4>
    <p className="text-2xl">{filteredUsers.length}</p>
  </div>
  <div className="flex-1 min-w-[150px] bg-red-100 dark:bg-red-900 p-4 rounded-lg">
    <h4 className="font-bold">Total Absent</h4>
    <p className="text-2xl">{users.length - filteredUsers.length}</p>
  </div>
  <div className="flex-1 min-w-[150px] bg-blue-100 dark:bg-blue-900 p-4 rounded-lg">
    <h4 className="font-bold">Males Present</h4>
    <p className="text-2xl">{filteredUsers.filter(u => u.gender === "Male").length}</p>
  </div>
  <div className="flex-1 min-w-[150px] bg-purple-100 dark:bg-purple-900 p-4 rounded-lg">
    <h4 className="font-bold">Females Present</h4>
    <p className="text-2xl">{filteredUsers.filter(u => u.gender === "Female").length}</p>
  </div>
</div>

        {/* Report Table */}
        <div className="overflow-x-auto mb-6">
          <table 
            ref={tableRef}
            className="w-full border-collapse"
          >
            <thead>
              <tr className="bg-green-600 text-white">
                <th className="p-3 border text-left">Worker's Name</th>
                <th className="p-3 border text-left">Work Number</th>
                <th className="p-3 border text-left">Gender</th>
                <th className="p-3 border text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map(user => (
                <tr key={user.id} className="border-b dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700">
                  <td className="p-3 border">{user.firstName} {user.secondName}</td>
                  <td className="p-3 border">{user.workNumber}</td>
                  <td className="p-3 border">{user.gender}</td>
                  <td className="p-3 border text-green-600 dark:text-green-400">Present</td>
                </tr>
              ))}
              {users.length - filteredUsers.length > 0 && (
                <tr className="bg-gray-100 dark:bg-gray-700 font-bold">
                  <td colSpan="3" className="p-3 border">Total Absent</td>
                  <td className="p-3 border text-red-600 dark:text-red-400">
                    {users.length - filteredUsers.length}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Download Options */}
        <div className="flex flex-wrap justify-center gap-4">
          <button 
            onClick={() => downloadReport("pdf")} 
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
            Download as PDF
          </button>
          <button 
            onClick={() => downloadReport("img")} 
            className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
            </svg>
            Download as Image
          </button>
        </div>
      </div>
    </div>
  );
}