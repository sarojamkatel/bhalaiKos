import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Layout
import AppLayout from "./components/layout/AppLayout";

// Auth
import LoginPage from "./pages/LoginPage";

// SuperAdmin
import SuperAdminDashboard from "./pages/superadmin/SuperAdminDashboard";
import TenantsPage from "./pages/superadmin/TenantsPage";

// Admin
import AdminDashboard from "./pages/admin/AdminDashboard";
import StaffPage from "./pages/admin/StaffPage";
import ReportsPage from "./pages/admin/ReportsPage";
import SettingsPage from "./pages/admin/SettingsPage";

// Staff
import StaffDashboard from "./pages/staff/StaffDashboard";
import NewRegistrationPage from "./pages/staff/NewRegistrationPage";
import VehiclesPage from "./pages/staff/VehiclesPage";
import PaymentPage from "./pages/staff/PaymentPage";
import ReceiptPage from "./pages/staff/ReceiptPage";

// Customer Portal
import CustomerLayout from "./pages/customer/CustomerLayout";
import CustomerHomePage from "./pages/customer/CustomerHomePage";
import CustomerAuthPage from "./pages/customer/CustomerAuthPage";
import CustomerDashboard from "./pages/customer/CustomerDashboard";
import CustomerRegisterPage from "./pages/customer/CustomerRegisterPage";
import CustomerReceiptsPage from "./pages/customer/CustomerReceiptsPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth */}
        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />

        {/* SuperAdmin */}
        <Route path="/superadmin" element={<AppLayout role="superadmin" />}>
          <Route index element={<SuperAdminDashboard />} />
          <Route path="tenants" element={<TenantsPage />} />
          <Route path="analytics" element={<ReportsPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>

        {/* Admin */}
        <Route path="/admin" element={<AppLayout role="admin" />}>
          <Route index element={<AdminDashboard />} />
          <Route path="staff" element={<StaffPage />} />
          <Route path="reports" element={<ReportsPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>

        {/* Staff */}
        <Route path="/staff" element={<AppLayout role="staff" />}>
          <Route index element={<StaffDashboard />} />
          <Route path="register" element={<NewRegistrationPage />} />
          <Route path="vehicles" element={<VehiclesPage />} />
          <Route path="payment" element={<PaymentPage />} />
          <Route path="receipt" element={<ReceiptPage />} />
        </Route>

        {/* Customer Portal (per-tenant) */}
        <Route path="/portal/:tenant" element={<CustomerLayout />}>
          <Route index element={<CustomerHomePage />} />
          <Route path="auth" element={<CustomerAuthPage />} />
          <Route path="dashboard" element={<CustomerDashboard />} />
          <Route path="register" element={<CustomerRegisterPage />} />
          <Route path="receipts" element={<CustomerReceiptsPage />} />
        </Route>

        {/* Legacy route compatibility */}
        <Route path="/newRegistration" element={<Navigate to="/staff/register" replace />} />
        <Route path="/vehicles" element={<Navigate to="/staff/vehicles" replace />} />
        <Route path="/superAdmin" element={<Navigate to="/superadmin" replace />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
