"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUsers } from "@/hooks/useUsers";
import Image from 'next/image';

export default function AddUserPage() {
  const { addUser } = useUsers();
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: "",
    secondName: "",
    workNumber: "",
    gender: "Male",
    age: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [previewImage, setPreviewImage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Validate image
      if (!file.type.startsWith('image/')) {
        setError('Please select an image file (JPEG, PNG)');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size must be less than 5MB');
        return;
      }
      
      setImageFile(file);
      setError('');
      
      // Create preview
      const reader = new FileReader();
      reader.onload = () => setPreviewImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");
    
    try {
      await addUser(formData, imageFile);
      router.push("/home");
    } catch (err) {
      setError(err.message || "Failed to add user");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-center">Add User</h2>
      
      {error && (
        <div className="mb-4 p-2 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 rounded">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        {/* Existing form fields remain the same */}
        <div className="mb-4">
          <label className="block mb-2">First Name</label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
            required
          />
        </div>
        
        <div className="mb-4">
          <label className="block mb-2">Second Name</label>
          <input
            type="text"
            name="secondName"
            value={formData.secondName}
            onChange={handleChange}
            className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
            required
          />
        </div>
        
        <div className="mb-4">
          <label className="block mb-2">Work Number</label>
          <input
            type="text"
            name="workNumber"
            value={formData.workNumber}
            onChange={handleChange}
            className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
            required
          />
        </div>
        
        <div className="mb-4">
          <label className="block mb-2">Gender</label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
          >
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </div>
        
        <div className="mb-4">
          <label className="block mb-2">Age</label>
          <input
            type="number"
            name="age"
            value={formData.age}
            onChange={handleChange}
            className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
            required
          />
        </div>
        
        <div className="mb-6">
          <label className="block mb-2">User Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
          />
        </div>
        
        <div className="mb-6">
          <label className="block mb-2">User Image</label>
          
          {/* Image preview */}
          {previewImage && (
            <div className="mb-4">
              <Image 
                src={previewImage} 
                alt="Preview" 
                width={128}
                height={128}
                className="w-32 h-32 object-cover rounded-full mx-auto"
              />
            </div>
          )}
          
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
          />
        </div>
        
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded disabled:opacity-50"
        >
          {isSubmitting ? "Adding..." : "Add User"}
        </button>
      </form>
    </div>
  );
}