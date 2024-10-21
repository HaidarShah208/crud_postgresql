'use client'
import Link from 'next/link';
import React, { useEffect, useState } from 'react'

interface Student {
  id: number;
  name: string;
  email: string;
  department: string;
  fee: number;
  image_url: string;
  video_url: string;
}

function page() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await fetch('/api/student', {
          method: 'GET',
        });
        const data = await response.json();
        console.log("Fetched data:", data);
        
        if (Array.isArray(data)) {
          setStudents(data);
        } else if (data && typeof data === 'object') {
          setStudents(data.students || []);
        } else {
          throw new Error('Unexpected data format');
        }
        
        setLoading(false);
      } catch (error) {
        console.error("Error fetching students:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }
console.log(students)
  const handleDelete = async (id: any) => {
    try {
      const response = await fetch(`/api/student?id=${id}`, {
        method: 'DELETE',
      });
      const data = await response.json();
      
      if (response.ok) {
        console.log("Student deleted:", data.deletedStudent);
        setStudents(students.filter(student => student.id !== id));
      } else {
        console.error("Failed to delete student:", data.error);
      }
    } catch (error) {
      console.error("Error deleting student:", error);
    }
  }
  
    return (
        <div className="w-screen py-20 flex flex-col justify-center items-center">
            <div className="text-2xl font-semibold text-center">CRUD With Postgresql</div>
          <div className="flex flex-col justify-center items-end gap-1 mb-4">
            <div className="bg-blue-500 my-10 text-right hover:bg-blue-700 text-white font-bold py-2 px-4  rounded-full">
              <Link href={"/student/create"}>Add More</Link>
            </div>
      
            <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
              <table className="w-full text-sm border border-s text-left rtl:text-right text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                  <tr>
                    <th scope="col" className="px-6 py-3">
                      id
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Name
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Email
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Department
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Fee
                    </th>
                    <th scope="col" className="px-6 py-3">Image</th>
                <th scope="col" className="px-6 py-3">Video</th>
                <th scope="col" className="px-6 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student) => (
                    <tr
                      key={student.id}
                      className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                    >
                      <th
                        scope="row"
                        className="px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                      >
                        {student.id}
                      </th>
                      <td className="px-6">{student.name}</td>
                      <td className="px-6">{student.email}</td>
                      <td className="px-6">{student.department}</td>
                      <td className="px-6">${student.fee}</td>
                      <td className="px-6">
                    {student.image_url && (
                      <img src={student.image_url} alt={`${student.name}'s image`} className="w-20 object-cover" />
                    )}
                  </td>
                  <td className="px-6">
                    {student.video_url && (
                      <video width="70" height="70" controls>
                        <source src={student.video_url} type="video/mp4" />
                        Your browser does not support the video tag.
                      </video>
                    )}
                  </td>
                      <div className="flex flex-row">

                        <div className="bg-blue-500 my-10 cursor-pointer text-right hover:bg-blue-700 text-white font-bold py-2 px-4  rounded-full">
                        <Link href={`/student/create?id=${student.id}`} >
    
                          Edit
                          </Link>
                        </div>
                        <div
                          onClick={() => handleDelete(student.id)}
                          className="bg-red-500 cursor-pointer my-10 mx-2 text-right hover:bg-red-700 text-white font-bold py-2 px-4  rounded-full"
                        >
                          Delete
                        </div>
                      </div>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      );
}

export default page
