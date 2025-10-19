// frontend/src/components/Staffs.jsx
import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { useNavigate } from "react-router-dom";
import { Plus, Mail, Phone, DollarSign, BarChart3 } from "lucide-react";
import axios from "axios";

export default function Staffs() {
  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(true);
  const nav = useNavigate();

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/staff");
        setStaffList(res.data.data || []);
      } catch (err) {
        console.error("Failed to fetch staff:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStaff();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <p className="text-gray-500 text-lg">Loading staff list...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Section */}
      <div className="flex-1 flex flex-col">
        <Header />

        <main className="p-6 flex-1">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Staff Members</h1>
            <button
              onClick={() => nav("/add-staff")}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
            >
              <Plus className="w-4 h-4" /> Add Staff
            </button>
          </div>

          {/* Staff Cards */}
          {staffList.length === 0 ? (
            <div className="text-center text-gray-500 mt-12">
              <p>No staff members found.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {staffList.map((staff) => (
                <div
                  key={staff.id}
                  className="bg-white shadow rounded-lg p-5 hover:shadow-md transition border border-gray-100"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h2 className="text-lg font-semibold text-gray-800">
                      {staff.name}
                    </h2>
                    <span className="text-sm bg-green-100 text-green-700 px-2 py-1 rounded">
                      Staff
                    </span>
                  </div>

                  <div className="text-sm text-gray-600 mb-3">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-gray-500" />
                      {staff.email}
                    </div>
                    {staff.phone && (
                      <div className="flex items-center gap-2 mt-1">
                        <Phone className="w-4 h-4 text-gray-500" />
                        {staff.phone}
                      </div>
                    )}
                  </div>

                  <div className="flex justify-between mt-4 text-sm text-gray-700">
                    <div className="flex items-center gap-2">
                      <BarChart3 className="w-4 h-4 text-blue-500" />
                      Sales:{" "}
                      <span className="font-semibold">{staff.totalSales}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-yellow-500" />
                      Earnings:{" "}
                      <span className="font-semibold">
                        ${staff.totalEarnings}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
