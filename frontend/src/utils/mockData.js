// ─── Mock Data for BhalaiKos ───────────────────────────────────────────────

export const VEHICLE_TYPES = ["Bus", "Car", "Jeep", "Hiace", "Coaster", "Microbus", "Truck", "Van", "Motorcycle"];

export const PAYMENT_METHODS = ["eSewa", "Khalti", "Mobile Banking"];

// SuperAdmin mock data
export const mockTenants = [
  {
    id: 1,
    name: "Nawa Kantipur Insurance",
    slug: "nawakantipurinsurance",
    domain: "nawakantipurinsurance.bhalaikos.com",
    adminName: "Bikram Shrestha",
    adminEmail: "admin@nawakantipurinsurance.com",
    phone: "+977-9841234567",
    address: "Putalisadak, Kathmandu",
    status: "active",
    plan: "Business",
    staffCount: 8,
    vehicleCount: 347,
    totalRevenue: 2340000,
    monthlyRevenue: 185000,
    createdAt: "2024-01-15",
    logo: null,
  },
  {
    id: 2,
    name: "Himalayan Suraksha Sewa",
    slug: "himalayansuraksha",
    domain: "himalayansuraksha.bhalaikos.com",
    adminName: "Ramesh Thapa",
    adminEmail: "admin@himalayansuraksha.com",
    phone: "+977-9851234567",
    address: "New Road, Pokhara",
    status: "active",
    plan: "Starter",
    staffCount: 4,
    vehicleCount: 198,
    totalRevenue: 980000,
    monthlyRevenue: 89000,
    createdAt: "2024-02-20",
    logo: null,
  },
  {
    id: 3,
    name: "Bagmati Vehicle Hub",
    slug: "bagmatihub",
    domain: "bagmatihub.bhalaikos.com",
    adminName: "Sunita Gurung",
    adminEmail: "admin@bagmatihub.com",
    phone: "+977-9801234567",
    address: "Baneshwor, Kathmandu",
    status: "active",
    plan: "Business",
    staffCount: 6,
    vehicleCount: 412,
    totalRevenue: 3120000,
    monthlyRevenue: 234000,
    createdAt: "2024-03-10",
    logo: null,
  },
  {
    id: 4,
    name: "Lumbini Motors Insurance",
    slug: "lumbinimotors",
    domain: "lumbinimotors.bhalaikos.com",
    adminName: "Dipak Yadav",
    adminEmail: "admin@lumbinimotors.com",
    phone: "+977-9811234567",
    address: "Main Road, Butwal",
    status: "suspended",
    plan: "Starter",
    staffCount: 2,
    vehicleCount: 67,
    totalRevenue: 245000,
    monthlyRevenue: 0,
    createdAt: "2024-04-05",
    logo: null,
  },
  {
    id: 5,
    name: "Everest Fleet Management",
    slug: "everestfleet",
    domain: "everestfleet.bhalaikos.com",
    adminName: "Prakash Magar",
    adminEmail: "admin@everestfleet.com",
    phone: "+977-9861234567",
    address: "Lazimpat, Kathmandu",
    status: "active",
    plan: "Enterprise",
    staffCount: 15,
    vehicleCount: 892,
    totalRevenue: 7800000,
    monthlyRevenue: 520000,
    createdAt: "2023-11-01",
    logo: null,
  },
];

// Admin/Staff mock data for a company
export const mockStaff = [
  { id: 1, name: "Anita Maharjan", email: "anita@nawakantipurinsurance.com", role: "staff", status: "active", joinedAt: "2024-02-01", vehiclesManaged: 87, phone: "+977-9841111111" },
  { id: 2, name: "Suraj Bajracharya", email: "suraj@nawakantipurinsurance.com", role: "staff", status: "active", joinedAt: "2024-03-15", vehiclesManaged: 64, phone: "+977-9842222222" },
  { id: 3, name: "Puja Tamang", email: "puja@nawakantipurinsurance.com", role: "staff", status: "active", joinedAt: "2024-04-01", vehiclesManaged: 102, phone: "+977-9843333333" },
  { id: 4, name: "Krishna Shrestha", email: "krishna@nawakantipurinsurance.com", role: "staff", status: "inactive", joinedAt: "2024-01-20", vehiclesManaged: 43, phone: "+977-9844444444" },
  { id: 5, name: "Maya Lama", email: "maya@nawakantipurinsurance.com", role: "manager", status: "active", joinedAt: "2024-01-18", vehiclesManaged: 156, phone: "+977-9845555555" },
  { id: 6, name: "Rajan Rai", email: "rajan@nawakantipurinsurance.com", role: "staff", status: "active", joinedAt: "2024-05-10", vehiclesManaged: 29, phone: "+977-9846666666" },
  { id: 7, name: "Sita Karki", email: "sita@nawakantipurinsurance.com", role: "staff", status: "active", joinedAt: "2024-05-20", vehiclesManaged: 18, phone: "+977-9847777777" },
  { id: 8, name: "Bishal Adhikari", email: "bishal@nawakantipurinsurance.com", role: "staff", status: "active", joinedAt: "2024-06-01", vehiclesManaged: 0, phone: "+977-9848888888" },
];

export const mockRegistrations = [
  {
    id: "VH01-05-2026",
    owner: "Saroj Jamkatel",
    phone: "+977-9841234567",
    address: "Baneshwor, Kathmandu",
    totalAmount: 12000,
    paymentMethod: "eSewa",
    transactionId: "ESW20260503-78234",
    status: "active",
    date: "2026-05-03",
    processedBy: "Anita Maharjan",
    vehicles: [
      { id: 1, type: "Bus", number: "BA 2 KHA 1234", rate: 3500, startDate: "2026-05-03", endDate: "2026-06-03" },
      { id: 2, type: "Car", number: "BA 5 CHA 4321", rate: 1500, startDate: "2026-05-03", endDate: "2026-06-03" },
      { id: 3, type: "Jeep", number: "BA 3 JA 5678", rate: 1500, startDate: "2026-05-03", endDate: "2026-06-03" },
      { id: 4, type: "Hiace", number: "BA 7 NA 9012", rate: 2500, startDate: "2026-05-03", endDate: "2026-06-03" },
      { id: 5, type: "Coaster", number: "BA 1 PA 3456", rate: 3000, startDate: "2026-05-03", endDate: "2026-06-03" },
    ],
  },
  {
    id: "VH02-05-2026",
    owner: "Himalayan Travels Pvt. Ltd.",
    phone: "+977-9851234567",
    address: "New Road, Kathmandu",
    totalAmount: 15500,
    paymentMethod: "Khalti",
    transactionId: "KHL20260502-45678",
    status: "active",
    date: "2026-05-02",
    processedBy: "Suraj Bajracharya",
    vehicles: [
      { id: 1, type: "Bus", number: "BA 4 GA 7890", rate: 3500, startDate: "2026-05-02", endDate: "2026-06-02" },
      { id: 2, type: "Bus", number: "BA 8 DA 1234", rate: 3500, startDate: "2026-05-02", endDate: "2026-06-02" },
      { id: 3, type: "Coaster", number: "BA 2 BA 5678", rate: 3000, startDate: "2026-05-02", endDate: "2026-06-02" },
      { id: 4, type: "Hiace", number: "BA 6 MA 9012", rate: 2500, startDate: "2026-05-02", endDate: "2026-06-02" },
      { id: 5, type: "Microbus", number: "BA 9 TA 3456", rate: 3000, startDate: "2026-05-02", endDate: "2026-06-02" },
    ],
  },
  {
    id: "VH03-05-2026",
    owner: "Prabin Kumar Thapa",
    phone: "+977-9801234567",
    address: "Balaju, Kathmandu",
    totalAmount: 5000,
    paymentMethod: "Mobile Banking",
    transactionId: "MB20260501-12345",
    status: "pending",
    date: "2026-05-01",
    processedBy: "Puja Tamang",
    vehicles: [
      { id: 1, type: "Car", number: "BA 1 CHA 2345", rate: 1500, startDate: "2026-05-01", endDate: "2026-06-01" },
      { id: 2, type: "Motorcycle", number: "BA 5 KA 6789", rate: 500, startDate: "2026-05-01", endDate: "2026-06-01" },
      { id: 3, type: "Jeep", number: "BA 3 SA 0123", rate: 1500, startDate: "2026-05-01", endDate: "2026-06-01" },
      { id: 4, type: "Van", number: "BA 7 WA 4567", rate: 1500, startDate: "2026-05-01", endDate: "2026-06-01" },
    ],
  },
  {
    id: "VH01-04-2026",
    owner: "Bindabasini Transport",
    phone: "+977-9811234567",
    address: "Pokhara-9, Gandaki",
    totalAmount: 10500,
    paymentMethod: "eSewa",
    transactionId: "ESW20260430-67890",
    status: "expired",
    date: "2026-04-30",
    processedBy: "Maya Lama",
    vehicles: [
      { id: 1, type: "Bus", number: "GA 1 KA 1111", rate: 3500, startDate: "2026-04-30", endDate: "2026-05-30" },
      { id: 2, type: "Bus", number: "GA 2 KA 2222", rate: 3500, startDate: "2026-04-30", endDate: "2026-05-30" },
      { id: 3, type: "Truck", number: "GA 3 KA 3333", rate: 3500, startDate: "2026-04-30", endDate: "2026-05-30" },
    ],
  },
];

// Monthly revenue data for charts
export const monthlyRevenue = [
  { month: "Baisakh", revenue: 145000, registrations: 42 },
  { month: "Jestha", revenue: 162000, registrations: 48 },
  { month: "Ashadh", revenue: 138000, registrations: 39 },
  { month: "Shrawan", revenue: 175000, registrations: 54 },
  { month: "Bhadra", revenue: 190000, registrations: 61 },
  { month: "Ashwin", revenue: 168000, registrations: 52 },
  { month: "Kartik", revenue: 142000, registrations: 43 },
  { month: "Mangsir", revenue: 155000, registrations: 47 },
  { month: "Poush", revenue: 130000, registrations: 38 },
  { month: "Magh", revenue: 148000, registrations: 45 },
  { month: "Falgun", revenue: 172000, registrations: 53 },
  { month: "Chaitra", revenue: 185000, registrations: 58 },
];

export const paymentMethodData = [
  { name: "eSewa", value: 48, color: "#10B981" },
  { name: "Khalti", value: 33, color: "#8B5CF6" },
  { name: "Mobile Banking", value: 19, color: "#3B82F6" },
];

export const vehicleTypeData = [
  { type: "Bus", count: 89 },
  { type: "Car", count: 134 },
  { type: "Jeep", count: 67 },
  { type: "Hiace", count: 45 },
  { type: "Coaster", count: 38 },
  { type: "Motorcycle", count: 56 },
  { type: "Others", count: 23 },
];

// SuperAdmin stats
export const superAdminStats = {
  totalTenants: 5,
  activeTenants: 4,
  totalRevenue: 14485000,
  monthlyRevenue: 1028000,
  totalVehicles: 1916,
  totalStaff: 35,
  growth: 12.4,
};

// Admin stats (per company)
export const adminStats = {
  totalStaff: 8,
  activeStaff: 7,
  totalVehicles: 347,
  monthlyRevenue: 185000,
  totalRevenue: 2340000,
  activeRegistrations: 234,
  pendingPayments: 5,
  growth: 8.2,
};

// Staff dashboard stats
export const staffStats = {
  todayRegistrations: 4,
  todayRevenue: 23500,
  weekRegistrations: 18,
  weekRevenue: 89000,
  totalVehicles: 87,
  pendingRenewals: 3,
};

// Recent activity log
export const recentActivity = [
  { id: 1, type: "registration", message: "New registration VH01-05-2026 by Saroj Jamkatel", time: "2 min ago", icon: "plus" },
  { id: 2, type: "payment", message: "Payment received NPR 15,500 via Khalti", time: "15 min ago", icon: "check" },
  { id: 3, type: "staff", message: "New staff Bishal Adhikari added", time: "1 hr ago", icon: "user" },
  { id: 4, type: "renewal", message: "Registration VH03-05-2026 renewed for 1 year", time: "2 hr ago", icon: "check" },
  { id: 5, type: "tenant", message: "Tenant 'Lumbini Motors' suspended", time: "1 day ago", icon: "alert" },
];
