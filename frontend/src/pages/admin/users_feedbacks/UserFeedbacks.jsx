import React, { useEffect, useState } from "react";
import { getContactUs } from "../../../apis/Api";
import { toast } from "react-toastify";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./UserFeedbacks.css";

const UserFeedbacks = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const response = await getContactUs();
      setMessages(response.data.contacts || []);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching messages:", error);
      toast.error("Failed to load messages. Please try again later.");
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid bg-light min-vh-100 py-5">
      <div className="container">
        <h1 className="text-center mb-4">User Feedbacks</h1>
        <div className="card shadow-sm">
          <div className="card-body">
            {loading ? (
              <div className="text-center">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : messages.length === 0 ? (
              <div className="alert alert-info">
                No Feedback Messages Available
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead className="table-light">
                    <tr>
                      <th>Name</th>

                      <th>Subject</th>
                      <th>Message</th>
                      
                    </tr>
                  </thead>
                  <tbody>
                    {messages.map((message) => (
                      <tr key={message._id}>
                        <td>{message.name}</td>

                        <td>{message.subject}</td>
                        <td>{message.message.substring(0, 50)}...</td>
                        
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

export default UserFeedbacks;
