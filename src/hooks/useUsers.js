// "use client";
// import { useState, useEffect } from "react";
// import { db, storage } from "@/config/firebase";
// import { collection, getDocs, doc, updateDoc, setDoc } from "firebase/firestore";
// import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

// export function useUsers() {
//   const [users, setUsers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchUsers = async () => {
//       try {
//         const querySnapshot = await getDocs(collection(db, "users"));
//         const usersData = querySnapshot.docs.map(doc => ({
//           id: doc.id,
//           ...doc.data()
//         }));
//         setUsers(usersData);
//       } catch (err) {
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchUsers();
//   }, []);

//   const updateUser = async (userId, data) => {
//     try {
//       const userRef = doc(db, "users", userId);
//       await updateDoc(userRef, data);
//       // Removed the automatic state update here
//       return true; // Return success status
//     } catch (err) {
//       console.error("Error updating user:", err);
//       throw err;
//     }
//   };

//  const addUser = async (userData, imageFile) => {
//   try {
//     let imageUrl = "";
    
//     if (imageFile) {
//       // Create a reference with a more unique filename
//       const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}-${imageFile.name}`;
//       const storageRef = ref(storage, `user-images/${fileName}`);
      
//       // Add metadata if needed
//       const metadata = {
//         contentType: imageFile.type,
//       };
      
//       // Upload the file
//       await uploadBytes(storageRef, imageFile, metadata);
//       imageUrl = await getDownloadURL(storageRef);
//     }

//     const newUser = {
//       ...userData,
//       image: imageUrl || null,
//       history: {},
//       createdAt: new Date().toISOString()
//     };

//     const docRef = doc(collection(db, "users"));
//     await setDoc(docRef, newUser);
    
//     setUsers(prevUsers => [...prevUsers, { id: docRef.id, ...newUser }]);
//   } catch (err) {
//     console.error("Error adding user:", err);
//     throw new Error("Failed to upload image. Please try again.");
//   }
// };

//   return { users, loading, error, updateUser, addUser };
// }


"use client";
import { useState, useEffect } from "react";
import { db } from "@/config/firebase";
import { collection, getDocs, doc,updateDoc, setDoc } from "firebase/firestore";

export function useUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  const updateUser = async (userId, data) => {
    try {
      const userRef = doc(db, "users", userId);
      await updateDoc(userRef, data);
      return true;
    } catch (err) {
      console.error("Error updating user:", err);
      throw err;
    }
  };

  // Cloudinary upload function
  const uploadToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET);

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: 'POST',
          body: formData
        }
      );

      if (!response.ok) {
        throw new Error('Image upload failed');
      }

      const data = await response.json();
      return data.secure_url; // Return the image URL
    } catch (error) {
      console.error('Cloudinary upload error:', error);
      throw error;
    }

  };

  // Fetch users from Firestore
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "users"));
        const usersData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setUsers(usersData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Add new user with image
  const addUser = async (userData, imageFile) => {
    try {
      let imageUrl = "";
      
      if (imageFile) {
        imageUrl = await uploadToCloudinary(imageFile);
      }

      const newUser = {
        ...userData,
        image: imageUrl || null, // Store Cloudinary URL
        createdAt: new Date().toISOString()
      };

      const docRef = doc(collection(db, "users"));
      await setDoc(docRef, newUser);
      
      // Update local state
      setUsers(prevUsers => [...prevUsers, { id: docRef.id, ...newUser }]);
      
      return docRef.id; // Return the new user ID
    } catch (err) {
      console.error("Error adding user:", err);
      throw err;
    }
  };

  return { users, loading, error, addUser,updateUser };
}