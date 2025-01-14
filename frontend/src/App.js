import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import "./App.css";
import Navbar from "./components/Navbar";
import Homepage from "./pages/homepage/Homepage";
import Login from "./pages/login/Login";
import Register from "./pages/register/Register";

// Toast Config
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import FooterB from "./components/Footer";
import AdminDashboard from "./pages/admin/admin_dashboard/AdminDashboard";
import UpdateMovie from "./pages/admin/update_movie/UpdateMovie";
import AdminRoutes from "./protected_routes/AdminRoutes";
import UserRoutes from "./protected_routes/UserRoutes";
import Profile from "./pages/profile/Profile";
import BuyTickets from "./pages/movie/buy_movie_tickets/BuyTickets";
import AboutUs from "./pages/about_us/AboutUs";
import MovieManagement from "./pages/admin/movie_managment/MovieManagement";
import ShowManagement from "./pages/admin/shows/ShowManagement";
import BarChart from "./components/Barchart";
import ComingSoon from "./pages/coming_soon/ComingSoon";
import CustomerManagement from "./pages/admin/customer_management/CustomerManagament";
import BookingManagement from "./pages/admin/booking_management/BookingManagement";
import Tickets from "./pages/tickets/Tickets";
import PaymentSuccess from "./pages/payment_success/PaymentSuccess";
import ContactUs from "./pages/contact_us/ContactUs";
import UserFeedbacks from "./pages/admin/users_feedbacks/UserFeedbacks";

function App() {
  return (
    <Router>
      <Navbar />
      <ToastContainer />
      <Routes>
        <Route path="/homepage" element={<Homepage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />

        <Route path="/movie/buyTickets/:id" element={<BuyTickets />} />
        <Route path="/aboutUs" element={<AboutUs />} />
        <Route path="/contactUs" element={<ContactUs />} />
        
        <Route path="/coming-soon" element={<ComingSoon />} />
        <Route path="/tickets" element={<Tickets />} />
        <Route path="/payment/success" element={<PaymentSuccess />} />

        {/* admin routes
        <Route path="/admin/dashboard" element={<AdminDashboard/>}/>
        <Route path="/admin/update/:id" element={<UpdateMovie/>}/> */}
        {/* admin routes */}
        <Route element={<AdminRoutes />}>
          <Route path="admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/update/:id" element={<UpdateMovie />} />
          <Route path="/admin/movieManagement" element={<MovieManagement />} />
          <Route path="/admin/showManagement" element={<ShowManagement />} />
          <Route path="/admin/userFeedbacks" element={<UserFeedbacks />} />
          <Route
            path="/admin/customerManagement"
            element={<CustomerManagement />}
          />
          <Route
            path="/admin/bookingsManagement"
            element={<BookingManagement />}
          />


          <Route path="/admin/barChart" element={<BarChart />} />
        </Route>

        {/* User ROutes */}
        <Route element={UserRoutes}>
          <Route path="/homepage" element={<Homepage />} />
          {/* <Route path="/buyTickets" element={<BuyTickets />} /> */}
        </Route>
      </Routes>
      <FooterB />
    </Router>
  );
}

export default App;
