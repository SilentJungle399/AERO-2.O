"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { jwtDecode } from "jwt-decode"; // Added missing import
import upiqr from "upiqr"; // This is the correct import
import {
    FiArrowRight,
    FiStar,
    FiInfo,
    FiUser,
    FiMail,
    FiPhone,
    FiBook,
    FiCalendar,
    FiCopy,
} from "react-icons/fi";

export default function CreateRegistrationPage() {
    const { id } = useParams();
    const [errorMessage, setErrorMessage] = useState(null);
    const [stage, setStage] = useState(1);
    const [eventData, setEventData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [submitLoading, setSubmitLoading] = useState(false);
    const [registrationToken, setRegistrationToken] = useState("");
    const [copied, setCopied] = useState(false);
    const [paymentPreview, setPaymentPreview] = useState(null);
    const [qrGenerated, setQrGenerated] = useState(false);
    const [qrSvg, setQrSvg] = useState("");

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

    function isTokenExpired(token) {
        try {
            const decodedToken = jwtDecode(token);
            const currentTime = Math.floor(Date.now() / 1000);
            return parseInt(decodedToken.exp) < currentTime;
        } catch (error) {
            console.error('Invalid token', error);
            return true;
        }
    }

    function loginCheck() {
        const token = localStorage.getItem('token');
        if (!token) {
            alert('Please log in to Aeromodelling.');
            window.location.href = '/login';
            return false;
        }

        const isExpired = isTokenExpired(token);
        if (isExpired) {
            alert('Session Expired !!! Please log in Again...');
            window.location.href = '/login';
            return false;
        }

        return true;
    }

    useEffect(() => {
        const fetchEventData = async () => {
            if (!loginCheck()) return;

            setIsLoading(true);
            try {
                const baseUrl =
                    process.env.NODE_ENV === "production"
                        ? process.env.NEXT_PUBLIC_BACKEND_URL
                        : "http://localhost:5000";
                const response = await fetch(`${baseUrl}/api/users/event/${id}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch event data');
                }
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

    useEffect(() => {
        const generateQr = async () => {
            if (!eventData || !eventData.E_fee) return;

            try {
                const { qr } = await upiqr({
                    payeeVPA: "exmaple@ptsbi", // Replace with actual UPI ID
                    payeeName: "Aeromodeling Club NIT Kurukshetra",
                    amount: eventData.E_fee,
                    transactionNote: `Registration - ${eventData.E_name}`,
                });

                setQrSvg(qr); // Save base64 QR image
                setQrGenerated(true);
            } catch (error) {
                console.error("QR Generation Error:", error);
                setErrorMessage("Failed to generate payment QR. Please try again.");
            }
        };

        if (eventData) generateQr();
    }, [eventData]);



    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.payment_screenshot) {
            setErrorMessage("Please upload payment screenshot");
            return;
        }

        try {
            setSubmitLoading(true);
            const baseUrl =
                process.env.NODE_ENV === "production"
                    ? process.env.NEXT_PUBLIC_BACKEND_URL
                    : "http://localhost:5000";

            const formDataToSend = new FormData();
            // Map fields to backend expectations
            formDataToSend.append("team_name", formData.team_name);
            formDataToSend.append("g_leader_mobile", formData.g_leader_mobile);
            formDataToSend.append("g_leader_email", formData.g_leader_email);
            formDataToSend.append("g_leader_year", formData.g_leader_year);
            formDataToSend.append("payment_screenshot", formData.payment_screenshot);

            const userId = localStorage.getItem("_id");
            if (!userId) {
                throw new Error("User ID not found. Please login again.");
            }

            formDataToSend.append("Group_leader_id", userId);

            const response = await fetch(`${baseUrl}/api/users/createteam/${id}`, {
                method: "POST",
                body: formDataToSend,
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                setRegistrationToken(data.group.Group_token);
                setStage(3);
            } else {
                const data = await response.json();
                setErrorMessage(data.message || "Registration failed");
                setStage(2);
            }
        } catch (error) {
            console.error("Registration error:", error);
            setErrorMessage(error.message || "Registration failed. Please try again.");
            setStage(2);
        } finally {
            setSubmitLoading(false);
        }
    };

    const handleCopyToken = async () => {
        try {
            await navigator.clipboard.writeText(registrationToken);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (error) {
            console.error('Failed to copy token:', error);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-black text-white flex items-center justify-center">
                <div className="text-center">
                    <p>Loading event details...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-black text-white flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl text-red-500 mb-4">Error</h2>
                    <p>{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="mt-4 bg-indigo-600 text-white px-6 py-2 rounded-full hover:bg-indigo-500"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-20 bg-black text-white flex items-center justify-center p-4 relative overflow-hidden">
            <div className="absolute inset-0 overflow-hidden">
                <div className="stars"></div>
                <div className="twinkling"></div>
                <div className="clouds"></div>
            </div>

            <div className="w-full max-w-2xl relative z-10">
                <div className="bg-gray-900 bg-opacity-75 rounded-lg p-8 shadow-2xl backdrop-blur-sm">
                    {eventData && (
                        <div className="mb-6 text-center">
                            <h1 className="text-2xl font-bold text-indigo-400">{eventData.E_name}</h1>
                            <p className="text-gray-300">Registration Fee: ₹{eventData.E_fee}</p>
                        </div>
                    )}

                    {stage === 1 && (
                        <motion.form
                            onSubmit={handleSubmit}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="space-y-6"
                        >
                            <div className="space-y-4">
                                {/* Name Field */}
                                <div className="relative">
                                    <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="text"
                                        value={formData.team_name}
                                        onChange={(e) => setFormData({ ...formData, team_name: e.target.value })}
                                        className="w-full bg-transparent border-b-2 border-gray-600 focus:border-indigo-500 outline-none py-2 pl-10 text-white"
                                        placeholder="Name"
                                        required
                                    />
                                </div>

                                {/* Email Field */}
                                <div className="relative">
                                    <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="email"
                                        value={formData.g_leader_email}
                                        onChange={(e) => setFormData({ ...formData, g_leader_email: e.target.value })}
                                        className="w-full bg-transparent border-b-2 border-gray-600 focus:border-indigo-500 outline-none py-2 pl-10 text-white"
                                        placeholder="Email"
                                        required
                                    />
                                </div>

                                {/* Mobile Field */}
                                <div className="relative">
                                    <FiPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="tel"
                                        value={formData.g_leader_mobile}
                                        onChange={(e) => setFormData({ ...formData, g_leader_mobile: e.target.value })}
                                        className="w-full bg-transparent border-b-2 border-gray-600 focus:border-indigo-500 outline-none py-2 pl-10 text-white"
                                        placeholder="Mobile Number"
                                        required
                                    />
                                </div>

                                {/* Year Field */}
                                <div className="relative">
                                    <FiCalendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="text"
                                        value={formData.g_leader_year}
                                        onChange={(e) => setFormData({ ...formData, g_leader_year: e.target.value })}
                                        className="w-full bg-transparent border-b-2 border-gray-600 focus:border-indigo-500 outline-none py-2 pl-10 text-white"
                                        placeholder="Academic Year"
                                        required
                                    />
                                </div>

                                <div className="pt-6">
                                    {qrGenerated ? (
                                        <div className="mb-6 flex justify-center">
                                            <img src={qrSvg} alt="UPI Payment QR" className="w-40 h-40 border-2 border-gray-300 rounded-md" />
                                        </div>
                                    ) : (
                                        <div className="mb-6 flex justify-center">
                                            <p className="text-gray-400">Generating payment QR code...</p>
                                        </div>
                                    )}


                                    <label className="block text-gray-200 mb-4">
                                        Upload payment screenshot:
                                        <input
                                            type="file"
                                            onChange={(e) => {
                                                const file = e.target.files[0];
                                                if (file) {
                                                    setFormData({ ...formData, payment_screenshot: file });
                                                    const reader = new FileReader();
                                                    reader.onload = (e) => setPaymentPreview(e.target.result);
                                                    reader.readAsDataURL(file);
                                                }
                                            }}
                                            className="w-full mt-2 p-2 rounded bg-gray-800 text-gray-200"
                                            accept="image/*"
                                            required
                                        />
                                    </label>

                                    {paymentPreview && (
                                        <div className="mt-4 text-center">
                                            <p className="text-gray-400 mb-2">Preview:</p>
                                            <img
                                                src={paymentPreview}
                                                alt="Payment preview"
                                                className="w-32 h-32 object-contain mx-auto rounded border border-gray-600"
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-indigo-600 text-white font-semibold py-3 rounded-full hover:bg-indigo-500 transition-colors flex items-center justify-center gap-2"
                                disabled={!qrGenerated || submitLoading}
                            >
                                {submitLoading ? "Submitting..." : "Complete Registration"}
                                <FiArrowRight />
                            </button>
                        </motion.form>
                    )}

                    {stage === 2 && (
                        <div className="text-center space-y-6">
                            <h2 className="text-2xl text-red-500 mb-4">Registration Failed</h2>
                            <p className="text-gray-300">{errorMessage}</p>
                            <button
                                onClick={() => setStage(1)}
                                className="bg-indigo-600 text-white px-6 py-2 rounded-full hover:bg-indigo-500"
                            >
                                Try Again
                            </button>
                        </div>
                    )}

                    {stage === 3 && (
                        <div className="text-center space-y-6">
                            <h2 className="text-2xl text-indigo-400">Registration Successful!</h2>
                            <div className="flex items-center justify-center gap-4">
                                <code className="bg-indigo-900 p-3 rounded-lg">{registrationToken}</code>
                                <button
                                    onClick={handleCopyToken}
                                    className="p-2 hover:bg-gray-800 rounded-full"
                                >
                                    <FiCopy className="w-6 h-6" />
                                </button>
                            </div>
                            {copied && <p className="text-green-400 text-sm">Copied to clipboard!</p>}
                            <p className="text-gray-300">
                                Your registration details have been emailed to you.
                                Keep this token safe for future reference.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}