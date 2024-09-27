"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  FiArrowLeft,
  FiArrowRight,
  FiStar,
  FiInfo,
  FiUser,
  FiMail,
  FiPhone,
  FiBook,
  FiCalendar,
  FiHash,
  FiMap,
  FiCopy,

} from "react-icons/fi";
import { FaPlane } from "react-icons/fa";

export default function CreateTeamPage() {
  const { id } = useParams();
  const [errorMessage, setErrorMessage] = useState(null);
  const [stage, setStage] = useState(1);
  const [eventData, setEventData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitLoading,setSubmitLoading]=useState(false)
  const [formData, setFormData] = useState({
    team_name: "",
    address: "",
    g_leader_name: "",
    g_leader_mobile: "",
    g_leader_branch: "",
    g_leader_email: "",
    g_leader_year: "",
    g_leader_roll_no: "",
    g_leader_gender: "M",
    g_leader_college_name: "Nit Kurukshetra",
    is_external_participation: false,
    payment_screenshot: null,
  });
  const [groupToken, setGroupToken] = useState("");
  const [isAgreed, setIsAgreed] = useState(false);
  const [copied, setCopied] = useState(false);
  const [paymentPreview, setPaymentPreview] = useState(null);

  

  const copyToClipboard = (token) => {
    navigator.clipboard.writeText(token);
    setCopied(true);
    setTimeout(() => setCopied(false), 60*60*1000);
  };

  useEffect(() => {
    const fetchEventData = async () => {
      setIsLoading(true);
      try {
        const baseUrl =
          process.env.NODE_ENV === "production"
            ? process.env.NEXT_PUBLIC_BACKEND_URL
            : "http://localhost:5000";
        const response = await fetch(`${baseUrl}/api/users/event/${id}`);
        const data = await response.json();
        setEventData(data.event);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchEventData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === "file") {
      setFormData((prevData) => ({
        ...prevData,
        [name]: files[0],
      }));
      handlePreviewFileInputChange(e);
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  const handlePreviewFileInputChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPaymentPreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {

    e.preventDefault();
    try {
      setSubmitLoading(true);
      const baseUrl =
        process.env.NODE_ENV === "production"
          ? process.env.NEXT_PUBLIC_BACKEND_URL
          : "http://localhost:5000";
      
      const formDataToSend = new FormData();
      Object.keys(formData).forEach(key => {
        formDataToSend.append(key, formData[key]);
      });
      formDataToSend.append("Group_leader_id", localStorage.getItem("_id"));

      const response = await fetch(`${baseUrl}/api/users/createteam/${id}`, {
        method: "POST",
        body: formDataToSend,
      });
      if (response.ok) {
        const data = await response.json();
        console.log(data);
        setGroupToken(data.group.Group_token);
        setSubmitLoading(false)
        setStage(6);
      } else {
        const data = await response.json();
        setErrorMessage(data.message || "Failed to create team");
        setStage(5);
      }
    } catch (error) {
      console.error("Error creating team:", error);
    }
  };

  const renderInput = ({ name, icon }) => (
    <div key={name} className="relative mb-6">
      <div className="absolute left-0 top-1/2 -translate-y-1/2 text-gray-400">
        {icon}
      </div>
      <input
        type="text"
        name={name}
        value={formData[name]}
        onChange={handleChange}
        className="w-full bg-transparent border-b-2 border-gray-600 focus:border-indigo-500 outline-none py-2 pl-8 text-white transition-colors"
        placeholder={name
          .split("_")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ")}
        required
      />
    </div>
  );

  const renderStage = () => {
    switch (stage) {
      case 1:
        if (isLoading) return <div>Loading event details...</div>;
        if (error) return <div>Error: {error}</div>;
        if (!eventData) return <div>No event data available</div>;
        return (
          <motion.div
            className="space-y-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-4xl font-bold text-indigo-400 leading-tight">
              {eventData.E_name}
            </h2>
            <p className="text-gray-300 text-lg leading-relaxed">
              {eventData.E_description}
            </p>
            <div className="space-y-4">
              <h3 className="text-2xl font-semibold text-indigo-300 flex items-center">
                <FiInfo className="mr-2" /> Event Details
              </h3>
              <p className="flex items-center">
                <FiCalendar className="mr-2" /> Date: {eventData.E_date}
              </p>
              <p className="flex items-center">
                <FiMap className="mr-2" /> Location: {eventData.E_location}
              </p>
              <p className="flex items-center">
                <FiUser className="mr-2" /> Max Team Size: {eventData.E_team_size}
              </p>
            </div>
            <div className="space-y-4">
              <h3 className="text-2xl font-semibold text-indigo-300 flex items-center">
                <FiBook className="mr-2" /> Guidelines <strong className="text-sm ml-4 text-red-500">***Read carefully before registering</strong>
              </h3>
              <ul className="list-none pl-5 space-y-2">
                {eventData.E_guidelines.map((guideline, index) => (
                  <li key={index} className="flex items-start">
                    <FiStar className="mr-2 mt-1 flex-shrink-0 text-yellow-400" />
                    <span>{guideline}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="agree"
                checked={isAgreed}
                onChange={(e) => setIsAgreed(e.target.checked)}
                className="form-checkbox h-5 w-5 text-indigo-600"
              />
              <label htmlFor="agree" className="text-sm">
               I Agree that have read all guidlines carefully and am completely aware of all rules and guidlines of workshop.
              </label>
            </div>
            <button
              onClick={() => (isAgreed ? setStage(2) : null)}
              className={`${
                isAgreed ? "bg-indigo-400" : "bg-indigo-200"
              } text-white font-semibold py-3 px-6 rounded-full ${
                isAgreed ? "" : "cursor-not-allowed"
              } ${
                isAgreed
                  ? "hover:bg-indigo-500 transition-colors"
                  : "bg-indigo-200"
              } flex items-center space-x-2 text-lg`}
            >
              <span>Next</span>
              <FiArrowRight />
            </button>
          </motion.div>
        );

      case 2:
      case 3:
      case 4:
        const fields =
          stage === 2
            ? [
                { name: "team_name", icon: <FiStar /> },
                { name: "g_leader_email", icon: <FiMail /> },
                { name: "g_leader_mobile", icon: <FiPhone /> },
              ]
            : stage === 3
            ? [
                { name: "g_leader_name", icon: <FiUser /> },
              ]
            : [
                { name: "g_leader_branch", icon: <FiBook /> },
                { name: "g_leader_roll_no", icon: <FiHash /> },
                { name: "g_leader_year", icon: <FiCalendar /> },
              ];

        return (
          <motion.form
            className="space-y-8"
            onSubmit={(e) => {
              e.preventDefault();
              if (stage === 4) {
                handleSubmit(e);
              } else {
                setStage(stage + 1);
              }
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-bold text-indigo-400 mb-6 leading-tight">
              {stage === 2
                ? "Team Information"
                : stage === 3
                ? "Leader Details"
                : "College Information"}
            </h2>
            {fields.map(renderInput)}
            {stage === 3 && (
              <div className="flex flex-col space-y-2 mt-4">
                <select
                  name="g_leader_gender"
                  value={formData.g_leader_gender}
                  onChange={handleChange}
                  className="form-select h-8 w-full text-gray-600 bg-gray-400 border-gray-800 rounded-sm"
                  required
                >
                  <option value="" disabled>
                    Select Gender
                  </option>
                  <option value="M">Male</option>
                  <option value="F">Female</option>
                </select>
              </div>
            )}
            {stage === 4 && (
              <div className="space-y-6">
                <div className="text-center">
                  <h3 className="text-xl font-semibold text-indigo-300 mb-4">Payment QR Code</h3>
                  <div className="bg-white p-4 inline-block rounded-lg">
                    <img src="/payment_qr.jpg" className="w-40 h-44" alt="not found"/>
                  </div>
                  <p className="mt-2 text-sm text-gray-400">Scan to make payment</p>
                </div>
                <div className="w-full space-y-4">
                  <label className="block text-gray-200 mb-2">
                    Upload screenshot of payment:
                  </label>
                  <input
                    type="file"
                    name="payment_screenshot"
                    onChange={handleChange}
                    className="w-full p-3 rounded bg-gray-800 text-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    accept="image/*"
                    required
                  />
                  {paymentPreview && (
                    <div className="mt-4">
                      <h3 className="text-lg font-semibold text-gray-200 mb-2">Payment Screenshot Preview:</h3>
                      <img src={paymentPreview} alt="Payment Screenshot" className="w-36 h-36 h-auto rounded-lg border border-gray-600" />
                    </div>
                  )}
                </div>
              </div>
            )}
            <div className="flex justify-between">
              <button
                type="button"
                onClick={() => setStage(stage - 1)}
                className="bg-gray-700 text-white font-semibold py-3 px-6 rounded-full hover:bg-gray-600 transition-colors flex items-center space-x-2 text-lg"
              >
                <FiArrowLeft />
                <span>Back</span>
              </button>
              {submitLoading ? (
  <button
    type="button"
    className="bg-indigo-600 text-white font-semibold py-3 px-6 rounded-full flex items-center space-x-2 text-lg"
    disabled
  >
    <span>Submitting your form...</span>
  </button>
) : (
  <button
    type={stage === 4 ? "submit" : "button"}
    onClick={() => stage < 4 && setStage(stage + 1)}
    className="bg-indigo-600 text-white font-semibold py-3 px-6 rounded-full hover:bg-indigo-500 transition-colors flex items-center space-x-2 text-lg"
  >
    <span>{stage === 4 ? "Submit" : "Next"}</span>
    <FiArrowRight />
  </button>
)}

            </div>
          </motion.form>
        );

      case 5:
        return (
          <motion.div>
            {errorMessage && (
              <div className="text-red-500 text-sm">{errorMessage}</div>
            )}
          </motion.div>
        );

      case 6:
        return (
          <div className="text-center space-y-8">
            <h2 className="text-4xl font-bold text-indigo-400 mb-6 leading-tight">
              Team Created Successfully!
            </h2>
            <p className="text-2xl">Your Group Token:</p>
            <div className="relative inline-flex items-center justify-center">
              <div className="text-3xl font-mono bg-indigo-900 p-6 rounded-lg tracking-wider">
                {groupToken}
              </div>
              <button
                onClick={() => copyToClipboard(groupToken)}
                className="ml-4 bg-gray-800 text-white p-2 rounded-full hover:bg-gray-700 transition-colors"
              >
                <FiCopy className="w-6 h-6" />
              </button>
            </div>
            {copied && <p className="text-green-500 text-sm">Token copied to clipboard!</p>}
            <p className="text-gray-300 text-lg">
              Keep this token safe. We've also sent it to your email along with more details. Please check your email for future reference
              
              </p>

           
            <button
              onClick={() => setStage(6)}
              className="w-full bg-green-600 text-white font-semibold py-3 px-6 rounded-full hover:bg-green-500 transition-colors flex items-center justify-center space-x-2 text-lg"
            >
               <p className="text-gray-300 text-lg">
              Make sure to join this whatsapp group for staying connected and further details. <br /> <a href="https://chat.whatsapp.com/DeF1JHnE4dkFWEgPeWkZWJ" className="text-blue-800 font-mono font-bold mr-5" >**Join whatsapp group**</a>
            </p>
              
            </button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="stars"></div>
        <div className="twinkling"></div>
        <div className="clouds"></div>
      </div>
      <div className="w-full max-w-7xl relative z-10">
        <div className="text-center mb-12 mt-20">
          <FaPlane className="text-6xl text-blue-500 mx-auto mb-4" />
          <h1 className="text-4xl monoton md:text-6xl text-white mb-2">
            Aeromodeling&nbsp;&nbsp; Club
          </h1>
          <h3 className="text-xl monoton md:text-4xl text-gray-300">
            Event &nbsp;&nbsp; Sessions
          </h3>
          <h2 className="text-2xl monoton md:text-3xl text-blue-400 mb-8">
            NIT&nbsp;&nbsp; Kurukshetra
          </h2>
        </div>
        <div className="bg-gray-900 bg-opacity-0 rounded-lg p-8 shadow-2xl backdrop-blur-sm">
          <div className="w-full bg-gray-400 rounded-full h-2 mb-8">
            <div
              className="bg-indigo-600 h-2 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${(stage / 5) * 100}%` }}
            ></div>
          </div>
          {renderStage()}
        </div>
      </div>
    </div>
  );
}