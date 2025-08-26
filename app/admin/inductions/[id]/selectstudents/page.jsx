"use client";
import {useParams} from "next/navigation";
import {useEffect, useState} from "react";
import Loader from '@/components/Loader'

export default function AdminInductions() {
  const {id} = useParams();
  const [induction, setInduction] = useState(null);
  const [selectedParticipants, setSelectedParticipants] = useState([]);
  const [message, setMessage] = useState("");
  const [files, setFiles] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchInduction();
  }, []);

  const fetchInduction = async () => {
    try {
      const baseUrl = process.env.NODE_ENV === 'production'
        ? ""
        : 'http://localhost:5000';
      const response = await fetch(
        `${baseUrl}/api/users/getinductionforselectingstudent/${id}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch induction");
      }
      const data = await response.json();
      setInduction(data);
      setSelectedParticipants(data.I_selected_participants || []);
    } catch (error) {
      console.error("Error fetching induction:", error);
    }
  };

  const handleParticipantToggle = (participantId) => {
    setSelectedParticipants((prev) =>
      prev.includes(participantId)
        ? prev.filter((id) => id !== participantId)
        : [...prev, participantId]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const accessToken = document.cookie
        .split("; ")
        .find((row) => row.startsWith("token="))
        .split("=")[1];

      const formDataToSubmit = {
        selectedParticipants,
        message,
      };

      const formDataObject = new FormData();
      Object.keys(formDataToSubmit).forEach((key) => {
        if (key === "selectedParticipants") {
          formDataToSubmit.selectedParticipants.forEach((participant, index) => {
            formDataObject.append(`selectedParticipants[${index}]`, participant);
          });
        } else {
          formDataObject.append(key, formDataToSubmit[key]);
        }
      });

      Array.from(files).forEach((file) => {
        formDataObject.append("notification_file", file);
      });

      const response = await fetch(
        `http://localhost:5000/api/users/sendnotification/${id}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          body: formDataObject,
        }
      );

      if (!response.ok) throw new Error("Failed to submit form");

      alert("Notification sent successfully!");
      // window.location.href = "/";
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Failed to submit application. Please try again.");
    }
  };

  const openModal = (participant) => {
    setSelectedStudent(participant);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedStudent(null);
    setIsModalOpen(false);
  };

  if (!induction) {
    return <Loader/>
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Admin Control Page</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <h2 className="text-xl font-semibold mb-2">
            Induction: {induction.I_name}
          </h2>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">Participants</h2>
          <div className="space-y-2">
            {induction.Inducties_id.map((participant) => (
              <div
                key={participant._id}
                className="flex items-center justify-between text-gray-800 bg-white p-3 rounded-lg shadow"
              >
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedParticipants.includes(participant._id)}
                    onChange={() => handleParticipantToggle(participant._id)}
                    className="mr-2"
                  />
                  <span className="font-medium">{participant.name}</span>
                  <span className="ml-2">{participant.email}</span>
                </label>
                <button
                  onClick={() => openModal(participant)}
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded text-sm transition duration-300"
                >
                  View Details
                </button>
              </div>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="mt-6">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Notification message"
              className="w-full p-2 text-gray-700 border rounded mb-2"
              rows="4"
            />
            <input
              type="file"
              name="notification_file"
              onChange={(e) => setFiles(Array.from(e.target.files))}
              multiple
              className="mb-2"
            />
            <button
              type="submit"
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition duration-300"
            >
              Send Notification and Update
            </button>
          </form>
        </div>
      </div>

      {isModalOpen && selectedStudent && (
        <div
          className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full"
          id="my-modal"
        >
          <div
            className="relative text-black top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-2/3 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-2xl font-semibold text-center mb-4">
                {selectedStudent.name}&apos;s Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <p>
                    <strong>Email:</strong> {selectedStudent.email}
                  </p>
                  <p>
                    <strong>Roll No:</strong> {selectedStudent.roll_no || "N/A"}
                  </p>
                  <p>
                    <strong>Branch:</strong> {selectedStudent.branch || "N/A"}
                  </p>
                </div>
                <div>
                  <p>
                    <strong>Phone:</strong>{" "}
                    {selectedStudent.phone_number || "N/A"}
                  </p>
                  <p>
                    <strong>Year:</strong> {selectedStudent.year || "N/A"}
                  </p>
                  <p>
                    <strong>Team Preference:</strong>{" "}
                    {selectedStudent.team_preference || "N/A"}
                  </p>
                </div>
              </div>
              <h4 className="font-bold text-xl mb-3">Form Responses:</h4>
              <div className="space-y-4">
                {selectedStudent.answers.map((answer, index) => (
                  <div
                    key={index}
                    className="bg-gray-100 text-black p-3 rounded"
                  >
                    <p className="font-semibold">{answer.question}</p>
                    <p className="mt-1">{answer.answer}</p>
                  </div>
                ))}
              </div>
              <div className="space-y-4">
                {selectedStudent.uploaded_files.map((file, index) => {
                  if (file.file_type.includes("image")) {
                    return (
                      <img
                        key={index}
                        src={file.url}
                        alt={`Uploaded image ${index}`}
                        className="w-full h-auto rounded"
                      />
                    );
                  }
                  if (file.file_type.includes("pdf")) {
                    return (
                      <div key={index} className="border rounded">
                        <iframe
                          src={file.url}
                          title={`Uploaded PDF ${index}`}
                          className="w-full h-96"
                          frameBorder="0"
                        ></iframe>
                      </div>
                    );
                  }
                  if (file.file_type.includes("video")) {
                    return (
                      <video
                        key={index}
                        src={file.url}
                        controls
                        className="w-full h-auto rounded"
                      >
                        Your browser does not support the video tag.
                      </video>
                    );
                  }
                })}
              </div>

              <div className="mt-6">
                <button
                  className="w-full px-4 py-2 bg-blue-500 text-white text-base font-medium rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300 transition duration-300"
                  onClick={closeModal}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
