"use client";
import React, { useState } from 'react';
import upiqr from 'upiqr';

const Buy = () => {
    const [formData, setFormData] = useState({
        name: '',
        rollNumber: '',
        phone: '',
        email: '',
        items: {
            'T-Shirt': 0,
            'Badge': 0
        }
    });
    const [qrCode, setQrCode] = useState('');
    const [showForm, setShowForm] = useState(true);
    const [loading, setLoading] = useState(false);
    const [screenshot, setScreenshot] = useState(null);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const merchandisePrices = {
        'T-Shirt': 599,
        'Badge': 199
    };

    const generateQR = async (totalAmount) => {
        try {
            const { qr } = await upiqr({
                payeeVPA: 'techspardha@upi',
                payeeName: 'Techspardha 2025',
                amount: totalAmount,
                transactionNote: `Order: ${Object.entries(formData.items)
                    .filter(([_, qty]) => qty > 0)
                    .map(([item, qty]) => `${item}x${qty}`)
                    .join(', ')}`,
                currency: 'INR'
            }, {
                size: 300,
                color: {
                    dark: '#1E40AF',
                    light: '#111827'
                }
            });
            return qr;
        } catch (error) {
            console.error('QR Generation Error:', error);
            throw error;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const totalAmount = Object.entries(formData.items)
            .reduce((sum, [item, qty]) => sum + (merchandisePrices[item] * qty), 0);
        
        if (totalAmount === 0) {
            alert('Please select at least one item');
            return;
        }

        setLoading(true);
        try {
            const qr = await generateQR(totalAmount);
            setQrCode(qr);
            setShowForm(false);
        } catch (error) {
            alert('Failed to generate QR. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleQuantityChange = (item, delta) => {
        setFormData(prev => ({
            ...prev,
            items: {
                ...prev.items,
                [item]: Math.max(0, prev.items[item] + delta)
            }
        }));
    };

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (file && file.type.startsWith('image/')) {
            setScreenshot(file);
        }
    };

    const handlePaymentSubmit = () => {
        setIsSubmitted(true);
        setTimeout(() => setIsSubmitted(false), 5000);
    };

    const handleChange = (e) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const totalAmount = Object.entries(formData.items)
        .reduce((sum, [item, qty]) => sum + (merchandisePrices[item] * qty), 0);

    return (
        <div className="min-h-screen bg-gray-900 text-white pt-28 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto space-y-8">
                <h2 className="text-4xl font-bold text-center text-blue-400 mb-12">
                    Techspardha 2025 <span className='text-blue-700 font-extrabold'>Merchandise</span>
                </h2>

                {showForm ? (
                    <form onSubmit={handleSubmit} className="bg-gray-800 p-8 rounded-2xl shadow-xl space-y-6">
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-blue-200 mb-2">Full Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="John Doe"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-blue-200 mb-2">Roll Number</label>
                                    <input
                                        type="text"
                                        name="rollNumber"
                                        value={formData.rollNumber}
                                        onChange={handleChange}
                                        className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3"
                                        placeholder="XX-XXXX"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-blue-200 mb-2">Contact Number</label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3"
                                        placeholder="98XXXXXX90"
                                        pattern="[0-9]{10}"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-blue-200 mb-2">Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3"
                                        placeholder="john@college.edu"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-6">
                                <h3 className="text-lg font-bold text-blue-300">Select Items</h3>
                                {Object.entries(merchandisePrices).map(([item, price]) => (
                                    <div key={item} className="flex items-center justify-between bg-gray-700 p-4 rounded-lg hover:bg-gray-600 transition-colors">
                                        <div>
                                            <p className="font-medium">{item}</p>
                                            <p className="text-sm text-blue-300">₹{price.toLocaleString()}</p>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <button
                                                type="button"
                                                onClick={() => handleQuantityChange(item, -1)}
                                                className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                                                    formData.items[item] === 0 
                                                        ? 'bg-gray-600 cursor-not-allowed'
                                                        : 'bg-blue-600 hover:bg-blue-700'
                                                }`}
                                                disabled={formData.items[item] === 0}
                                            >
                                                <span className="text-white">-</span>
                                            </button>
                                            <span className="w-10 text-center font-medium">
                                                {formData.items[item]}
                                            </span>
                                            <button
                                                type="button"
                                                onClick={() => handleQuantityChange(item, 1)}
                                                className="w-8 h-8 rounded-full bg-blue-600 hover:bg-blue-700 flex items-center justify-center transition-colors"
                                            >
                                                <span className="text-white">+</span>
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="pt-4 border-t border-blue-600">
                                <div className="flex justify-between items-center">
                                    <span className="text-blue-300 font-medium">Total Amount:</span>
                                    <span className="text-xl font-bold text-blue-400">
                                        ₹{totalAmount.toLocaleString()}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading || totalAmount === 0}
                            className={`w-full py-4 text-lg font-bold rounded-lg transition-all ${
                                loading || totalAmount === 0 
                                    ? 'bg-gray-600 cursor-not-allowed' 
                                    : 'bg-blue-600 hover:bg-blue-700'
                            }`}
                        >
                            {loading ? 'Processing...' : 'Proceed to Payment'}
                        </button>
                    </form>
                ) : (
                    <div className="bg-gray-800 p-8 rounded-2xl shadow-xl space-y-8">
                        <div className="space-y-6">
                            <h3 className="text-2xl font-bold text-blue-400 border-b border-blue-600 pb-4">
                                Payment Receipt
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                <div className="space-y-2">
                                    <p><span className="text-blue-300">Name:</span> {formData.name}</p>
                                    <p><span className="text-blue-300">Roll No:</span> {formData.rollNumber}</p>
                                    <p><span className="text-blue-300">Contact:</span> {formData.phone}</p>
                                    <p><span className="text-blue-300">Email:</span> {formData.email}</p>
                                </div>

                                <div className="space-y-2">
                                    <h4 className="text-blue-300 font-medium mb-2">Items Purchased</h4>
                                    {Object.entries(formData.items)
                                        .filter(([_, qty]) => qty > 0)
                                        .map(([item, qty]) => (
                                            <div key={item} className="flex justify-between">
                                                <span>{item}</span>
                                                <span>
                                                    {qty} x ₹{merchandisePrices[item].toLocaleString()}
                                                </span>
                                            </div>
                                        ))}
                                    <div className="pt-2 border-t border-blue-600">
                                        <div className="flex justify-between font-bold">
                                            <span>Total:</span>
                                            <span>₹{totalAmount.toLocaleString()}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-6 border-t border-blue-600">
                                <div className="max-w-xs mx-auto bg-gray-900 p-4 rounded-xl">
                                    <img 
                                        src={qrCode} 
                                        alt="Payment QR Code" 
                                        className="w-full h-auto rounded-lg"
                                    />
                                </div>
                                <p className="text-center mt-4 text-blue-300 text-sm">
                                    Scan using any UPI app to complete payment
                                </p>
                            </div>

                            <div className="pt-6">
                                <label className="block text-sm font-medium text-blue-200 mb-4">
                                    Upload Payment Screenshot (PNG/JPG)
                                </label>
                                <div className="flex items-center justify-center w-full">
                                    <label className="flex flex-col items-center px-4 py-6 bg-gray-700 rounded-lg border-2 border-dashed border-blue-600 cursor-pointer hover:bg-gray-600 transition-colors">
                                        <svg 
                                            className="w-12 h-12 text-blue-400 mb-2" 
                                            fill="none" 
                                            stroke="currentColor" 
                                            viewBox="0 0 24 24"
                                        >
                                            <path 
                                                strokeLinecap="round" 
                                                strokeLinejoin="round" 
                                                strokeWidth={2} 
                                                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" 
                                            />
                                        </svg>
                                        <span className="text-sm text-blue-300">
                                            {screenshot ? screenshot.name : 'Click to upload screenshot'}
                                        </span>
                                        <input
                                            type="file"
                                            onChange={handleFileUpload}
                                            className="hidden"
                                            accept="image/png, image/jpeg"
                                        />
                                    </label>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end space-x-4">
                            <button
                                onClick={() => setShowForm(true)}
                                className="px-6 py-2 border border-blue-600 text-blue-400 rounded-lg hover:bg-blue-900 transition-colors"
                            >
                                Edit Details
                            </button>
                            <button
                                onClick={handlePaymentSubmit}
                                disabled={!screenshot || isSubmitted}
                                className={`px-6 py-2 rounded-lg ${
                                    isSubmitted 
                                        ? 'bg-green-600 cursor-not-allowed'
                                        : screenshot 
                                            ? 'bg-blue-600 hover:bg-blue-700'
                                            : 'bg-gray-600 cursor-not-allowed'
                                } transition-colors`}
                            >
                                {isSubmitted ? 'Payment Verified ✓' : 'Submit Payment'}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Buy;
