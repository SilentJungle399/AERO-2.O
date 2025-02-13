"use client";
import React, { useState, useEffect } from 'react';
import upiqr from 'upiqr';
import { jwtDecode } from "jwt-decode";

function isTokenExpired(token) {
    try {
        const decodedToken = jwtDecode(token);
        return decodedToken.exp < Math.floor(Date.now()/1000);
    } catch (error) {
        console.error('Invalid token', error);
        return true;
    }
}

function LoginCheck() {
    const token = localStorage.getItem('token');
    if (!token || isTokenExpired(token)) {
        alert('Please log in to access merchandise purchase');
        window.location.href = '/login';
    }
}

const Buy = () => {
    const [formData, setFormData] = useState({
        customize: false,
        customName: '',
        phone: '',
        email: '',
        items: {
            'T-Shirt': { quantity: 0, size: 'M' },
            'Badge': { quantity: 0 }
        }
    });
    const [userName, setUserName] = useState('');
    const [email, setEmail] = useState('');
    const [qrCode, setQrCode] = useState('');
    const [showForm, setShowForm] = useState(true);
    const [loading, setLoading] = useState(false);
    const [screenshot, setScreenshot] = useState(null);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [viewingImage, setViewingImage] = useState(null);
    const [costFactor, setCostFactor] = useState(7); // ₹7 per character for customization
    const merchandiseData = {
        'T-Shirt': {
            price: 599,
            sizes: ['S', 'M', 'L', 'XL', 'XXL'],
            images: {
                main: '/T-shirt.png',
                back: '/T-shirt.png',
                sizeChart: '/T-shirt.png'
            }
        },
        'Badge': {
            price: 199,
            images: {
                main: '/approved1.png',
                back: '/approved1.png'
            }
        }
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            const decoded = jwtDecode(token);
            setUserName(decoded.name || '');
            setEmail(decoded.email || '');
        }
        LoginCheck();
    }, []);

    const calculateTotal = () => {
        const itemTotal = Object.entries(formData.items)
            .reduce((sum, [item, data]) => sum + (merchandiseData[item].price * data.quantity), 0);
        const customizationCost = formData.customize ? 
            (formData.customName.length * costFactor) : 0;
        return itemTotal + customizationCost;
    };

    const generateQR = async () => {
        try {
            const totalAmount = calculateTotal();
            const { qr } = await upiqr({
                payeeVPA: 'jaystrp2022@ybl',
                payeeName: 'Techspardha 2025',
                amount: totalAmount,
                transactionNote: `Order: ${Object.entries(formData.items)
                    .filter(([_, data]) => data.quantity > 0)
                    .map(([item, data]) => 
                        `${item}${item === 'T-Shirt' && formData.customize ? 
                            ` (${data.size}, Custom: ${formData.customName})` : ''}x${data.quantity}`
                    ).join(', ')}`,
                currency: 'INR'
            }, {
                size: 300,
                color: { dark: '#1E40AF', light: '#ffffff' }
            });
            return qr;
        } catch (error) {
            console.error('QR Generation Error:', error);
            throw error;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const totalAmount = calculateTotal();

        if (totalAmount === 0) {
            alert('Please select at least one item');
            return;
        }

        setLoading(true);
        try {
            const qr = await generateQR();
            setQrCode(qr);
            setShowForm(false);
        } catch (error) {
            alert('Payment initialization failed');
        } finally {
            setLoading(false);
        }
    };

    const handleQuantityChange = (item, delta) => {
        setFormData(prev => ({
            ...prev,
            items: {
                ...prev.items,
                [item]: {
                    ...prev.items[item],
                    quantity: Math.max(0, prev.items[item].quantity + delta)
                }
            }
        }));
    };

    const handleSizeChange = (item, size) => {
        setFormData(prev => ({
            ...prev,
            items: {
                ...prev.items,
                [item]: {
                    ...prev.items[item],
                    size: size
                }
            }
        }));
    };

    const ImageModal = () => (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
            <div className="relative max-w-2xl w-full">
                <button 
                    onClick={() => setViewingImage(null)}
                    className="absolute -top-8 right-0 text-white text-2xl hover:text-blue-400"
                >
                    ×
                </button>
                <img 
                    src={viewingImage} 
                    alt="Full view" 
                    className="max-h-[90vh] w-full object-contain rounded-lg"
                />
            </div>
        </div>
    );

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (file && file.type.startsWith('image/')) {
            setScreenshot(file);
        }
    };

    const totalAmount = calculateTotal();
    return (
        <div className="min-h-screen bg-gray-900 text-white pt-28 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto space-y-8">
                <h2 className="text-4xl font-bold text-center text-blue-400 mb-12">
                    Techspardha 2025 Merchandise
                </h2>

                {showForm ? (
                    <form onSubmit={handleSubmit} className="bg-gray-800 p-8 rounded-2xl shadow-xl space-y-6">
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-blue-200 mb-2">
                                        Your Name
                                    </label>
                                    <input
                                        type="text"
                                        value={userName}
                                        className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 cursor-not-allowed"
                                        readOnly
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-blue-200 mb-2">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={email}
                                        onChange={handleChange}
                                        className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 cursor-not-allowed"
                                        readOnly
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                
                                <div>
                                    <label className="block text-sm font-medium text-blue-200 mb-2">
                                        Contact Number
                                    </label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3"
                                        pattern="[0-9]{10}"
                                        required
                                    />
                                </div>

                                <div className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        name="customize"
                                        checked={formData.customize}
                                        onChange={handleChange}
                                        className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                                    />
                                    <label className="text-sm text-blue-200">
                                        Add name to T-shirt back
                                    </label>
                                </div>
                            </div>

                            {formData.customize && (
                                <div>
                                    <input
                                        type="text"
                                        name="customName"
                                        value={formData.customName}
                                        onChange={handleChange}
                                        maxLength={15}
                                        placeholder='Name to print (max 15 letters)'
                                        className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3"
                                    />
                                    <p className="text-sm text-blue-300 mt-1">
                                        {formData.customName.length}/15 characters • 
                                        Cost: ₹{formData.customName.length * costFactor}
                                    </p>
                                </div>
                            )}

                            <div className="space-y-6">
                                <h3 className="text-lg font-bold text-blue-300">Select Items</h3>
                                {Object.entries(merchandiseData).map(([item, data]) => (
                                    <div key={item} className="bg-gray-700 p-4 rounded-lg hover:bg-gray-600 transition-colors">
                                        <div className="flex flex-col md:flex-row items-center gap-6">
                                            <div className="flex gap-4">
                                                <img 
                                                    src={data.images.main} 
                                                    alt={item} 
                                                    className="w-32 h-32 object-contain cursor-zoom-in border border-blue-600 rounded-lg"
                                                    onClick={() => setViewingImage(data.images.main)}
                                                />
                                                <img 
                                                    src={data.images.back} 
                                                    alt={`${item} back`}
                                                    className="w-32 h-32 object-contain cursor-zoom-in border border-blue-600 rounded-lg"
                                                    onClick={() => setViewingImage(data.images.back)}
                                                />
                                            </div>
                                            <div className="flex-1 w-full">
                                                <div className="flex justify-between items-start mb-4">
                                                    <div>
                                                        <p className="font-medium text-lg">{item}</p>
                                                        <p className="text-sm text-blue-300">₹{data.price.toLocaleString()}</p>
                                                        {item === 'T-Shirt' && (
                                                            <button
                                                                type="button"
                                                                onClick={() => setViewingImage(data.images.sizeChart)}
                                                                className="text-blue-400 text-sm hover:underline mt-2"
                                                            >
                                                                View Size Chart
                                                            </button>
                                                        )}
                                                    </div>
                                                    <div className="flex items-center gap-3">
                                                        <button
                                                            type="button"
                                                            onClick={() => handleQuantityChange(item, -1)}
                                                            className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                                                                formData.items[item].quantity === 0 
                                                                    ? 'bg-gray-600 cursor-not-allowed'
                                                                    : 'bg-blue-600 hover:bg-blue-700'
                                                            }`}
                                                            disabled={formData.items[item].quantity === 0}
                                                        >
                                                            <span className="text-white">-</span>
                                                        </button>
                                                        <span className="w-10 text-center font-medium">
                                                            {formData.items[item].quantity}
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
                                                {item === 'T-Shirt' && formData.items[item].quantity > 0 && (
                                                    <div className="mt-4">
                                                        <label className="block text-sm font-medium text-blue-200 mb-2">
                                                            Select Size
                                                        </label>
                                                        <div className="flex gap-2 flex-wrap">
                                                            {data.sizes.map(size => (
                                                                <button
                                                                    key={size}
                                                                    type="button"
                                                                    onClick={() => handleSizeChange(item, size)}
                                                                    className={`px-4 py-2 rounded-lg ${
                                                                        formData.items[item].size === size 
                                                                            ? 'bg-blue-600 text-white'
                                                                            : 'bg-gray-600 hover:bg-gray-500'
                                                                    }`}
                                                                >
                                                                    {size}
                                                                </button>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
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
                                    <p><span className="text-blue-300">Name:</span> {userName}</p>
                                    {formData.customize && (
                                        <p><span className="text-blue-300">Custom Name:</span> {formData.customName}</p>
                                    )}
                                    <p><span className="text-blue-300">Contact:</span> {formData.phone}</p>
                                    <p><span className="text-blue-300">Email:</span> {formData.email}</p>
                                </div>

                                <div className="space-y-2">
                                    <h4 className="text-blue-300 font-medium mb-2">Items Purchased</h4>
                                    {Object.entries(formData.items)
                                        .filter(([_, data]) => data.quantity > 0)
                                        .map(([item, data]) => (
                                            <div key={item} className="flex justify-between">
                                                <span>
                                                    {item}
                                                    {item === 'T-Shirt' && ` (${data.size})`}
                                                </span>
                                                <span>
                                                    {data.quantity} x ₹{merchandiseData[item].price.toLocaleString()}
                                                </span>
                                            </div>
                                        ))}
                                    {formData.customize && (
                                        <div className="flex justify-between">
                                            <span>Customization Cost</span>
                                            <span>₹{formData.customName.length * costFactor}</span>
                                        </div>
                                    )}
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
                                onClick={() => setIsSubmitted(true)}
                                disabled={!screenshot || isSubmitted}
                                className={`px-6 py-2 rounded-lg ${
                                    isSubmitted 
                                        ? 'bg-green-600 cursor-not-allowed'
                                        : screenshot 
                                            ? 'bg-blue-600 hover:bg-blue-700'
                                            : 'bg-gray-600 cursor-not-allowed'
                                } transition-colors`}
                            >
                                {isSubmitted ? 'Payment Verified ✓' : 'Confirm Payment'}
                            </button>
                        </div>
                    </div>
                )}
                {viewingImage && <ImageModal />}
            </div>
        </div>
    );
};

export default Buy;
