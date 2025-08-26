"use client";

import React, {useEffect, useState} from "react";
import Message from "@/components/Message";
import {useParams} from "next/navigation";
import {FaArrowLeft, FaArrowRight, FaBrain, FaCogs, FaPlane, FaRocket,} from "react-icons/fa";

const InductionForm = () => {
  const params = useParams();
  const id = params.id;

  const [submiting, setSubmiting] = useState(false);

  const [_1stPass, _set1stPass] = useState(true);
  const [_2ndPass, _set2ndPass] = useState(true);
  const [_3rdPass, _set3rdPass] = useState(true);

  const [Error, setError] = useState(false);
  const [Sucess, setSucess] = useState(false);

  const [files, setFiles] = useState([]);

  const [formData, setFormData] = useState({
    uid: "",
    name: "",
    email: "",
    rollNumber: "",
    branch: "",
    year: "",
    phoneNumber: "",
    answers: [],
    queries: "",
    team_preference: "",
    hobbies: "",
    skills: "",
    experience: "",
    expectations: "",
  });
  const [induction, setInduction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentStage, setCurrentStage] = useState(0);
  const [previews, setPreviews] = useState([]);

  useEffect(() => {
    const storedId = localStorage.getItem("_id");
    setFormData((prev) => ({...prev, uid: storedId}));
    if (id) {
      fetchInductionDetails();
    }
  }, [id]);

  const fetchInductionDetails = async () => {
    try {
      const baseUrl =
        process.env.NODE_ENV === "production"
          ? ""
          : "http://localhost:5000";
      const response = await fetch(`${baseUrl}/api/users/getinduction/${id}`);
      if (!response.ok) throw new Error("Failed to fetch induction details");
      const data = await response.json();
      setInduction(data);
      setFormData((prev) => ({
        ...prev,
        answers: data.questions.map((q) => ({
          question: q.question,
          answer: "",
        })),
      }));
      setLoading(false);
    } catch (error) {
      console.error("Error fetching induction details:", error);
      setLoading(false);
    }
  };

  const handleInputChange = (e, index) => {
    const {name, value, files} = e.target;
    if (name === "answer") {
      const newAnswers = [...formData.answers];
      newAnswers[index] = {...newAnswers[index], answer: value};
      setFormData((prev) => ({...prev, answers: newAnswers}));
    } else if (name === "ppt") {
      handlePreviewFileInputChange(e);
      setFiles(files);
    } else {
      setFormData((prev) => ({...prev, [name]: value}));
    }
  };

  const handlePreviewFileInputChange = (event) => {
    const files = Array.from(event.target.files);
    const newPreviews = [];

    files.forEach((file) => {
      const reader = new FileReader();

      reader.onload = (e) => {
        if (file.type.startsWith('image/')) {
          newPreviews.push({type: 'image', src: e.target.result});
        } else if (file.type === 'application/pdf') {
          newPreviews.push({type: 'pdf', name: file.name});
        } else if (file.type.startsWith('video/')) {
          newPreviews.push({type: 'video', src: URL.createObjectURL(file)});
        }

        if (newPreviews.length === files.length) {
          setPreviews(newPreviews);
        }
      };

      if (file.type.startsWith('image/') || file.type === 'application/pdf') {
        reader.readAsDataURL(file);
      } else if (file.type.startsWith('video/')) {
        reader.readAsArrayBuffer(file);
      }
    });
  };

  const [message, setMessage] = useState("");
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      currentStage == 2 &&
      !formData.queries &&
      !formData.team_preference &&
      !formData.hobbies &&
      !formData.skills &&
      !formData.experience &&
      !formData.expectations
    ) {
      _set3rdPass(false);
      return;
    } else _set3rdPass(true);
    setSubmiting(true);
    try {
      const accessToken = document.cookie
        .split("; ")
        .find((row) => row.startsWith("token="))
        .split("=")[1];

      const formDataToSubmit = {...formData, In_id: id};
      const formDataObject = new FormData();
      Object.keys(formDataToSubmit).forEach((key) => {
        if (key === "answers") {
          formDataToSubmit.answers.forEach((answer, index) => {
            formDataObject.append(
              `answers[${index}][question]`,
              answer.question
            );
            formDataObject.append(`answers[${index}][answer]`, answer.answer);
          });
        } else {
          formDataObject.append(key, formDataToSubmit[key]);
        }
      });
      Array.from(files).forEach((file) => {
        formDataObject.append("ppt", file);
      });
      const baseUrl =
        process.env.NODE_ENV === "production"
          ? ""
          : "http://localhost:5000";
      const response = await fetch(`${baseUrl}/api/users/register/${id}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: formDataObject,
      });
      const message = await response.text();
      setMessage(message);
      if (!response.ok) throw new Error("Failed to submit form");
      setSucess(true);
      alert("Application submitted successfully!");
      window.location.href = "/";
    } catch (error) {
      setError(true);
    } finally {
      setSubmiting(false);
    }
  };

  const nextStage = () => {
    if (
      currentStage === 0 &&
      (!formData.name || formData.name.trim() === '') ||
      (!formData.email || formData.email.trim() === '') ||
      (!formData.rollNumber || formData.rollNumber.trim() === '') ||
      (!formData.branch || formData.branch.trim() === '') ||
      (!formData.year || formData.year.trim() === '') ||
      (!formData.phoneNumber || formData.phoneNumber.trim() === '')
    ) {
      _set1stPass(false);
      return;
    } else _set1stPass(true);
    if (
      currentStage == 1 &&
      formData.answers.some((item) => item.answer === "")
    ) {
      _set2ndPass(true); //should be false but here to check for 2Pass input
      return;
    } else _set2ndPass(true);
    setCurrentStage((prev) => Math.min(prev + 1, 2));
  };

  const prevStage = () => {
    setCurrentStage((prev) => Math.max(prev - 1, 0));
  };

  const handleNext = (e) => {
    e.preventDefault();
    nextStage();
  };

  const handlePrevious = (e) => {
    e.preventDefault();
    prevStage();
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  if (!induction)
    return (
      <div className="text-center text-2xl mt-28 text-gray-200">
        Induction not found
      </div>
    );

  const renderStage = () => {
    switch (currentStage) {
      case 0:
        return (
          <div className="bg-gray-900 p-6 rounded-lg">
            {!_1stPass && (
              <p className="text-sm text-red-500">
                **Please fill all fields...
              </p>
            )}
            <h2 className="text-2xl font-semibold text-blue-400 mb-4 flex items-center">
              <FaRocket className="mr-2 text-yellow-500"/>
              Personal Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full p-3 rounded bg-gray-800 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full p-3 rounded bg-gray-800 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <input
                type="text"
                name="rollNumber"
                placeholder="Roll Number"
                value={formData.rollNumber}
                onChange={handleInputChange}
                className="w-full p-3 rounded bg-gray-800 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <input
                type="text"
                name="branch"
                placeholder="Branch"
                value={formData.branch}
                onChange={handleInputChange}
                className="w-full p-3 rounded bg-gray-800 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <select
                name="year"
                value={formData.year}
                onChange={handleInputChange}
                className="w-full p-3 rounded bg-gray-800 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="" disabled>
                  Year of Study
                </option>
                <option value="1st">1st Year</option>
                <option value="2nd">2nd Year</option>
                <option value="3rd">3rd Year</option>
                <option value="4th">4th Year</option>
              </select>

              <input
                type="tel"
                name="phoneNumber"
                placeholder="Phone Number"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                className="w-full p-3 rounded bg-gray-800 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>
        );
      case 1:
        return (
          <div className="bg-gray-900 p-6 rounded-lg">
            {!_2ndPass && (
              <p className="text-sm text-red-500">
                **Please fill all fields...
              </p>
            )}
            <h2 className="text-2xl font-semibold text-green-400 mb-4 flex items-center">
              <FaBrain className="mr-2 "/>
              Aeromodelling Questionnaire
            </h2>
            {formData.answers.map((answer, index) => (
              <div key={index} className="space-y-2 mb-6">
                <label className="block text-gray-300 font-semibold">
                  {answer.question}
                </label>
                <textarea
                  className="w-full p-3 rounded bg-gray-800 text-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500"
                  rows="3"
                  name="answer"
                  value={answer.answer}
                  onChange={(e) => handleInputChange(e, index)}
                  required
                ></textarea>
              </div>
            ))}
          </div>
        );
      case 2:
        return (
          <div className="bg-gray-900 p-6 rounded-lg">
            {!_3rdPass && (
              <p className="text-sm text-red-500">
                **Please fill all fields...
              </p>
            )}
            <h2 className="text-2xl font-semibold text-purple-400 mb-4 flex items-center">
              <FaCogs className="mr-2 text-purple-500"/>
              Additional Information
            </h2>
            <div className="w-full space-y-4">
              <label className="block text-gray-200 mb-2">
                Please upload any image, PDF, or video showcasing your skill: (optional)
              </label>
              <input
                type="file"
                name="ppt"
                onChange={handleInputChange}
                className="w-full p-3 rounded bg-gray-800 text-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                multiple
                accept="image/*,application/pdf,video/*"
              />
              {previews.length > 0 && (
                <div className="mt-4 space-y-2">
                  <h3 className="text-lg font-semibold text-gray-200">File Previews:</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {previews.map((preview, index) => (
                      <div key={index} className="border border-gray-600 rounded p-2">
                        {preview.type === 'image' && (
                          <img src={preview.src} alt="Preview" className="w-full h-40 object-cover"/>
                        )}
                        {preview.type === 'pdf' && (
                          <div className="flex items-center justify-center h-40 bg-gray-700">
                            <p className="text-gray-200">{preview.name}</p>
                          </div>
                        )}
                        {preview.type === 'video' && (
                          <video src={preview.src} controls className="w-full h-40 object-cover"/>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <select
                name="team_preference"
                value={formData.team_preference}
                onChange={handleInputChange}
                className="w-full p-3 rounded bg-gray-800 text-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="" disabled>
                  Select Team Preference
                </option>
                <option value="Drones">Drones</option>
                <option value="Rc Planes">RC Planes</option>
              </select>

            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-200 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="stars"></div>
        <div className="twinkling"></div>
        <div className="clouds"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16 relative z-10">
        <div className="text-center mb-12">
          <FaPlane className="text-6xl text-blue-500 mx-auto mb-4"/>
          <h1 className="text-4xl monoton md:text-6xl  text-white mb-2">
            Aeromodeling&nbsp;&nbsp; Club
          </h1>
          <h3 className="text-xl monoton md:text-4xl text-gray-300">
            Induction &nbsp;&nbsp; Sessions
          </h3>
          <h2 className="text-2xl monoton md:text-3xl  text-blue-400 mb-8">
            NIT&nbsp;&nbsp; Kurukshetra
          </h2>
        </div>

        <div className="bg-gray-900 rounded-lg shadow-2xl overflow-hidden border border-blue-500">
          <div className="p-8">
            <h1 className="text-4xl  monoton text-blue-400 mb-2 flex items-center">
              {induction.I_name}
            </h1>
            <p className="text-orange-600 text-l mb-8">
              Soar to New Heights with NIT Kurukshetra!
            </p>

            <form onSubmit={handleSubmit} className="space-y-8">
              {renderStage()}
              {(Error || Sucess) && (
                <Message error={Error} success={Sucess} message={message}/>
              )}
              <div className="flex justify-between">
                {currentStage > 0 && (
                  <button
                    type="button"
                    onClick={handlePrevious}
                    className="bg-gray-700 m-2 text-gray-200 py-2 px-4 rounded-lg hover:bg-gray-600 transition duration-300 flex items-center"
                  >
                    <FaArrowLeft className="mr-2"/>
                    Previous
                  </button>
                )}
                {currentStage < 2 ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300 flex items-center ml-auto"
                  >
                    Next
                    <FaArrowRight className="ml-2"/>
                  </button>
                ) : (
                  <button
                    type="submit"
                    className={`bg-green-600 m-2 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition duration-300 flex items-center ml-auto ${!induction.I_active_status ? "cursor-not-allowed opacity-50" : ""
                    }`}
                    disabled={submiting || !induction.I_active_status}
                  >
                    {submiting ? (
                      <div
                        className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-e-transparent align-[-0.125em] text-surface motion-reduce:animate-[spin_1.5s_linear_infinite] dark:text-white"
                        role="status"
                      >
                        <span
                          className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
                          Loading...
                        </span>
                      </div>
                    ) : (
                      <FaPlane className="m-2"/>
                    )}
                    &nbsp;Submit Application
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
        {/* Progress Indicator */}
        <div className="mt-8 flex justify-center">
          {[0, 1, 2].map((stage) => (
            <div
              key={stage}
              className={`w-4 h-4 rounded-full mx-2 ${currentStage >= stage ? "bg-blue-500" : "bg-gray-600"
              }`}
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default InductionForm;