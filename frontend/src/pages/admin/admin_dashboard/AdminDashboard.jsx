import React, { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { toast } from "react-toastify";
import { getAllMoviesApi, getAllProfileApi, getDashboardStats } from "../../../apis/Api";
import { BounceLoader } from "react-spinners";
import "react-toastify/dist/ReactToastify.css";
import 'bootstrap/dist/css/bootstrap.min.css';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUserLogins: 0,
    totalMoviesAdded: 0,
    totalBookings: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDashboardStats()
      .then((res) => {
        if (res.status === 200) {
          setStats(res.data);
          setLoading(false);
        } else {
          toast.error("Failed to fetch dashboard statistics");
          setLoading(false);
        }
      })
      .catch((error) => {
        console.error("Error fetching dashboard statistics:", error);
        toast.error("Failed to fetch dashboard statistics");
        setLoading(false);
      });
  }, []);

  const chartData = [
    { name: 'User Logins', value: stats.totalUserLogins },
    { name: 'Movies Added', value: stats.totalMoviesAdded },
    { name: 'Total Bookings', value: stats.totalBookings },
  ];

  if (loading) {
    return (
      <div className="d-flex align-items-center justify-content-center min-vh-100 bg-dark text-white">
        <div className="text-center">
          <BounceLoader color={"#0d6efd"} loading={loading} size={60} />
          <div className="mt-3 fs-4">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-light min-vh-100">
      <div className="container py-5">
        <header className="mb-5">
          <h1 className="display-4 text-center mb-4">Admin Dashboard</h1>
          <div className="alert alert-primary" role="alert">
            <h4 className="alert-heading">Welcome back!</h4>
            <p className="mb-0">Here's an overview of your latest statistics.</p>
          </div>
        </header>

        <div className="row g-4 mb-5">
          <StatCard title="Total Users" value={stats.totalUserLogins} icon="bi-people" color="primary" />
          <StatCard title="Total Movies" value={stats.totalMoviesAdded} icon="bi-film" color="success" />
          <StatCard title="Total Bookings" value={stats.totalBookings} icon="bi-calendar-event" color="info" />
        </div>

        <div className="card shadow-sm">
          <div className="card-header bg-white">
            <h5 className="card-title mb-0">Statistics Overview</h5>
          </div>
          <div className="card-body">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#0d6efd" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon, color }) => (
  <div className="col-md-4">
    <div className={`card border-${color} shadow-sm h-100`}>
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <h6 className="card-subtitle mb-2 text-muted">{title}</h6>
            <h2 className="card-title mb-0">{value}</h2>
          </div>
          <i className={`bi ${icon} fs-1 text-${color}`}></i>
        </div>
      </div>
    </div>
  </div>
);

export default AdminDashboard;