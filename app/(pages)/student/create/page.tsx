"use client";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";

function page() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    department: "",
    fee: "",
  
  });

  const [image, setImage] = useState<File | null>(null);
  const [video, setVideo] = useState<File | null>(null);


  

  const searchParams = useSearchParams();
  const id = searchParams.get('id');

  const fetchStudentData = async () => {
    try {
      const response = await fetch(`/api/student?id=${id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch student data");
      }
      const data = await response.json();
      console.log(data)
      const student = data.find((item: { id: { toString: () => string | null; }; }) => item.id.toString() === id);
      if (student) {
        setFormData({
          name: student.name || "",
          email: student.email || "",
          department: student.department || "",
          fee: student.fee ? student.fee.toString() : "",
          
        });
      } else {
        console.error("Student not found");
      }
    } catch (error) {
      console.error("Error fetching student data:", error);
    }
  };

  useEffect(() => {
    if (id) {
      fetchStudentData();
    }
  }, [id]);
console.log(id)
  const handleInputChange = (e: { target: { name: any; value: any } }) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setVideo(e.target.files[0]);
    }
  };


  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    try {
       const formDataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        formDataToSend.append(key, value);
      });
      if (image) formDataToSend.append('image', image);
      if (video) formDataToSend.append('video', video);

      const url = id ? `/api/student?id=${id}` : "/api/student";
      const method = id ? "PUT" : "POST";

      const response = await fetch(url, {
        method: method,
      body: formDataToSend,
        
      });

      if (!response.ok) {
        throw new Error("Failed to submit the form");
      }

      const result = await response.json();
      console.log(id ? "Student updated successfully:" : "Form submitted successfully:", result);

      router.push("/student");
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };
  return (
    <div className="w-screen py-20 flex justify-center items-center">
      <div className="flex flex-col justify-between items-center gap-1 mb-4">
        <div className="text-2xl font-semibold mb-5">
          {id ? "Edit Student" : "Add new Student"}
          {/* Add new student */}
        </div>
        <form className="w-96" onSubmit={handleSubmit}>
          <div className="mb-5">
            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
              required
            />
          </div>

          <div className="mb-5">
            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Email
            </label>
            <input
              type="text"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
              required
            />
          </div>

          <div className="mb-5">
            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Fee
            </label>
            <input
              type="number"
              name="fee"
              value={formData.fee}
              onChange={handleInputChange}
              className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
              required
            />
          </div>

          <div className="mb-5">
            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Department
            </label>
            <input
              type="text"
              name="department"
              value={formData.department}
              onChange={handleInputChange}
              className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
              required
            />
          </div>
          <div className="mb-5">
            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
            />
          </div>

          <div className="mb-5">
            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Video
            </label>
            <input
              type="file"
              accept="video/*"
              onChange={handleVideoChange}
              className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
            />
          </div>

          <button
            type="submit"
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            {id ? 'update':'add'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default page;
