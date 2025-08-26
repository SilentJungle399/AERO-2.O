"use client";

import {useEffect, useState} from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import Loader from "../../../components/Loader";

interface Order {
  _id: string;
  full_name: string;
  customName?: string;
  email: string;
  phone: string;
  items: {
    T_Shirt?: { quantity: number; size: string };
    Badge?: { quantity: number };
  };
  total_price: number;
  payment_screenshot?: string;
  createdAt: string;
}

export default function MerchPage() {
  const [merchData, setMerchData] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log("Fetching merchandise orders...");

    const fetchData = async () => {
      const baseUrl =
        process.env.NODE_ENV === "production"
          ? ""
          : "http://localhost:5000";

      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("User not authenticated");

        const response = await fetch(`${baseUrl}/api/users/order/getorders`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch orders");
        }

        const data: Order[] = await response.json();
        console.log("Fetched data:", data);

        setMerchData(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching merchandise data:", error);
        setError(error instanceof Error ? error.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.text("Merchandise Orders", 14, 10);

    const tableColumn = [
      "User",
      "Custom Name",
      "Contact",
      "Items",
      "Total Price",
      "Order Date",
    ];
    const tableRows: string[][] = [];

    merchData.forEach((order) => {
      const orderData = [
        order.full_name,
        order.customName || "-",
        `${order.email}, ${order.phone}`,
        `T-Shirt: ${order.items.T_Shirt?.quantity ?? 0} (${order.items.T_Shirt?.size ?? "-"}) | Badge: ${order.items.Badge?.quantity ?? 0}`,
        `₹${order.total_price}`,
        new Date(order.createdAt).toLocaleDateString("en-IN", {
          year: "numeric",
          month: "short",
          day: "numeric",
        }),
      ];
      tableRows.push(orderData);
    });

    autoTable(doc, {head: [tableColumn], body: tableRows});
    doc.save("Merchandise_Orders.pdf");
  };

  if (loading) {
    return <Loader/>;
  }

  if (error) {
    return (
      <div className="min-h-screen pt-28 bg-slate-900 p-8 flex justify-center items-center">
        <p className="text-red-500 text-lg font-semibold">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-28 bg-slate-900 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-blue-400 mb-8 font-mono tracking-tight">
          Merchandise Orders
        </h1>

        <button
          onClick={generatePDF}
          className="mb-4 px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-500 transition"
        >
          Download PDF
        </button>

        <div className="bg-slate-800 rounded-lg shadow-2xl overflow-hidden border border-slate-700">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-700">
              <thead className="bg-blue-950">
              <tr>
                {["User", "Custom Name", "Contact", "Items", "Total Price", "Payment Proof", "Order Date"].map((header) => (
                  <th
                    key={header}
                    className="px-6 py-4 text-left text-xs font-semibold text-blue-300 uppercase tracking-wider"
                  >
                    {header}
                  </th>
                ))}
              </tr>
              </thead>
              <tbody className="bg-slate-800 divide-y divide-slate-700">
              {merchData.length > 0 ? (
                merchData.map((order) => (
                  <tr key={order._id} className="hover:bg-slate-700 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-100">
                      {order.full_name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-200">
                      {order.customName || "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {order.email}
                      <br/>
                      <span className="text-blue-200">{order.phone}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {order.items.T_Shirt?.quantity && order.items.T_Shirt.quantity > 0 && `T-Shirt: ${order.items.T_Shirt.quantity} (${order.items.T_Shirt.size ?? "-"})`}
                      <br/>
                      {order.items.Badge?.quantity && order.items.Badge.quantity > 0 && `Badge: ${order.items.Badge.quantity}`}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-400">
                      ₹{order.total_price}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {order.payment_screenshot ? (
                        <a
                          href={order.payment_screenshot}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:text-blue-300 underline transition-colors"
                        >
                          View Screenshot
                        </a>
                      ) : (
                        <span className="text-slate-400">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-200">
                      {new Date(order.createdAt).toLocaleDateString("en-IN", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-slate-400 italic">
                    No merchandise orders found
                  </td>
                </tr>
              )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
