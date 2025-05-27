// import React from 'react';

// import { Link } from 'react-router-dom';

// const Header = ({ darkMode, presentCount, absentCount, onFilterChange }) => {
//   return (
//     <header className={`sticky top-0 z-10 ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-md`}>
//       <div className="container mx-auto px-4">
//         {/* App Name and Status Summary */}
//         <div className="flex flex-col md:flex-row md:items-center md:justify-between py-4">
//           <Link to="/" className="flex items-center mb-4 md:mb-0">
//             <h1 className="text-2xl font-bold text-green-600">100 Days Work</h1>
//           </Link>
          
//           <div className="flex items-center gap-6">
//             <div className="text-center">
//               <p className="text-sm text-gray-600 dark:text-gray-300">Present</p>
//               <p className="text-xl font-bold text-green-600">{presentCount}</p>
//             </div>
//             <div className="text-center">
//               <p className="text-sm text-gray-600 dark:text-gray-300">Absent</p>
//               <p className="text-xl font-bold text-red-600">{absentCount}</p>
//             </div>
//           </div>
//         </div>

//         {/* Category Buttons */}
//         <div className="flex flex-wrap gap-2 pb-4">
//           <button 
//             onClick={() => onFilterChange('all')}
//             className={`px-4 py-2 rounded-full ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'} transition`}
//           >
//             All
//           </button>
//           <button 
//             onClick={() => onFilterChange('groups')}
//             className={`px-4 py-2 rounded-full ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'} transition`}
//           >
//             Groups
//           </button>
//           <button 
//             onClick={() => onFilterChange('male')}
//             className={`px-4 py-2 rounded-full ${darkMode ? 'bg-blue-900 hover:bg-blue-800' : 'bg-blue-100 hover:bg-blue-200'} transition`}
//           >
//             Male
//           </button>
//           <button 
//             onClick={() => onFilterChange('female')}
//             className={`px-4 py-2 rounded-full ${darkMode ? 'bg-pink-900 hover:bg-pink-800' : 'bg-pink-100 hover:bg-pink-200'} transition`}
//           >
//             Female
//           </button>
//           <Link 
//             to="/reports"
//             className={`px-4 py-2 rounded-full ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'} transition`}
//           >
//             Reports
//           </Link>
//         </div>
//       </div>
//     </header>
//   );
// };

// export default Header;

"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import ThemeToggle from "./ThemeToggle";

export default function Header() {
  const pathname = usePathname();
  const routes = [
    { name: "Home", path: "/home" },
    { name: "Groups", path: "/groups" },
    { name: "Add User", path: "/add-user" },
    { name: "Reports", path: "/reports" },
  ];

  return (
    <div className="bg-green-600 p-4 rounded-lg mb-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">100 Days Work</h1>
        <ThemeToggle />
      </div>
      
      <nav className="flex justify-around">
        {routes.map((route) => (
          <Link
            key={route.path}
            href={route.path}
            className={`px-4 py-2 rounded ${
              pathname === route.path ? "bg-green-700" : "hover:bg-green-700"
            }`}
          >
            {route.name}
          </Link>
        ))}
      </nav>
    </div>
  );
}