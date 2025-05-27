// components/UserCard.jsx
"use client";

export default function UserCard({ user, onAttendanceChange, isChecked }) {
  return (
    <div className="flex items-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
      <div className="flex-shrink-0 mr-4">
        {user.image ? (
          <img 
            src={user.image} 
            alt={`${user.firstName} ${user.secondName}`}
            className="h-12 w-12 rounded-full"
          />
        ) : (
          <div className="h-12 w-12 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
            <span className="text-gray-600 dark:text-gray-300">
              {user.firstName?.charAt(0)}{user.secondName?.charAt(0)}
            </span>
          </div>
        )}
      </div>
      
      <div className="flex-grow">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
          {user.firstName} {user.secondName}
        </h3>
        <p className="text-gray-500 dark:text-gray-400">
          {user.gender} • {user.department}
        </p>
      </div>
      
      <div className="flex-shrink-0 ml-4">
        <input
          type="checkbox"
          checked={isChecked}
          onChange={(e) => onAttendanceChange(user.id, e.target.checked)}
          className="h-5 w-5 rounded border-gray-300 text-green-600 focus:ring-green-500 dark:border-gray-600 dark:bg-gray-700"
        />
      </div>
    </div>
  );
}