import React, { useEffect, useState } from "react";
import { getAllProfileApi, deleteProfileApi } from "../../../apis/Api";
import { toast } from "react-toastify";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

const CustomerManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = () => {
    setLoading(true);
    getAllProfileApi()
      .then((res) => {
        setUsers(res.data.users || []);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        toast.error("Failed to fetch users. Please try again later.");
        setLoading(false);
      });
  };

  const handleDelete = (id) => {
    const confirmDialog = window.confirm(
      "Are you sure you want to delete this user?"
    );
    if (confirmDialog) {
      deleteProfileApi(id)
        .then((res) => {
          if (res.status === 201) {
            toast.success(res.data.message);
            setUsers(users.filter((user) => user._id !== id));
          }
        })
        .catch((error) => {
          if (error.response && error.response.status === 500) {
            toast.error(error.response.data.message);
          } else {
            toast.error("Something went wrong. Please try again.");
          }
        });
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phoneNumber.includes(searchTerm)
  );

  return (
    <div className="container-fluid bg-light min-vh-100 py-5">
      <div className="container">
        <h1 className="text-center mb-4">Customer Management</h1>
        <div className="card shadow-sm">
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <input
                type="text"
                className="form-control w-50"
                placeholder="Search by username, email, or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            {loading ? (
              <div className="text-center">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="alert alert-info">No Users Available</div>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead className="table-light">
                    <tr>
                      <th>Username</th>
                      <th>Email</th>
                      <th>Phone Number</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((user) => (
                      <tr key={user._id}>
                        <td>{user.username}</td>
                        <td>{user.email}</td>
                        <td>{user.phoneNumber}</td>
                        <td>
                          <button className="btn btn-outline-primary btn-sm me-2">
                            <i className="bi bi-pencil me-1"></i>Edit
                          </button>
                          <button
                            onClick={() => handleDelete(user._id)}
                            className="btn btn-outline-danger btn-sm"
                          >
                            <i className="bi bi-trash me-1"></i>Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerManagement;
