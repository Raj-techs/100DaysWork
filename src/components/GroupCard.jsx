"use client";
import Image from "next/image";
import Link from "next/link";

export default function GroupCard({ group, onPairClick = null }) {
  return (
    <div className={`p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-600 ${
      onPairClick ? "cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700" : ""
    }`}
    onClick={() => onPairClick && onPairClick(group[0].id)}
    >
      <div className="flex justify-between">
        {group.map((user) => (
          <div key={user.id} className="flex items-center w-1/2 p-2">
            <Image 
              src={user.image || "/images/default-user.png"} 
              alt={user.firstName}
              className="w-10 h-10 rounded-full mr-2"
              width={40}
            />
            <Link href={`/dashboard/user-history?id=${user.id}`}>
              <span className="hover:underline">
                {user.firstName} {user.secondName}
              </span>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}