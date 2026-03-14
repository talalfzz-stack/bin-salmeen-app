import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { addActivityLog, ActivityTypes } from "./utils/activityLog";
import { hasPermission, PERMISSIONS } from "./constants/permissions";
import "./styles/App.css";

// ✅ استيراد LanguageProvider و useLanguage
import { LanguageProvider, useLanguage } from "./context/LanguageContext";

// المكونات العامة
import Sidebar from "./components/layout/Sidebar";
import Header from "./components/layout/Header";
import BottomNav from "./components/layout/BottomNav";

// ==================== الصفحات الأساسية ====================
import Dashboard from "./features/dashboard/components/Dashboard";
import Invoices from "./components/invoices/Invoices";
import Products from "./features/products/components/Products";
import AddProduct from "./features/products/components/AddProduct";
import Customers from "./features/customers/components/Customers";
import Employees from "./features/employees/components/Employees";
import Users from "./features/users/components/Users";
import Inventory from "./features/inventory/components/Inventory";
import Login from "./features/auth/components/Login";
import Register from "./features/auth/components/Register";
import Settings from "./features/settings/components/Settings";

// ==================== صفحات الفواتير ====================
import InvoiceHistory from "./features/invoices/components/InvoiceHistory";

// ==================== صفحات المبيعات ====================
import SalesReturn from "./features/sales/components/SalesReturn";
import SalesCancel from "./features/sales/components/SalesCancel";
import Quotation from "./features/sales/components/Quotation";
import SalesHistory from "./features/sales/components/SalesHistory";

// ==================== صفحات المشتريات ====================
import Purchases from "./features/purchases/components/Purchases";
import PurchaseReturn from "./features/purchases/components/PurchaseReturn";
import Suppliers from "./features/purchases/components/Suppliers";

// ==================== صفحات المخزون المتقدمة ====================
import Warehouses from "./features/inventory/components/Warehouses";
import InventoryCategories from "./features/inventory/components/InventoryCategories";
import CurrentStock from "./features/inventory/components/CurrentStock";
import InventoryMovements from "./features/inventory/components/InventoryMovements";
import InventoryTransfers from "./features/inventory/components/InventoryTransfers";
import InventoryAdjustments from "./features/inventory/components/InventoryAdjustments";
import UnitsManager from "./features/inventory/components/UnitsManager";
// ✅ تم حذف InventoryReports من هنا لأنه مستورد في قسم التقارير

// ==================== صفحات المالية ====================
import Finance from "./features/finance/components/Finance";
import FinanceDashboard from "./features/finance/components/FinanceDashboard";
import FinanceIndicators from "./features/finance/components/FinanceIndicators";
import FinanceHealth from "./features/finance/components/FinanceHealth";
import Banks from "./features/finance/components/Banks";
import CashFlow from "./features/finance/components/CashFlow";
import CustomerBalances from "./features/finance/components/CustomerBalances";
import Expenses from "./features/finance/components/Expenses";
import ExpenseCategories from "./features/finance/components/ExpenseCategories";
import ExpenseReports from "./features/finance/components/ExpenseReports";
import ExpenseFilter from "./features/finance/components/ExpenseFilter";
import PaymentVoucher from "./features/finance/components/PaymentVoucher";
import ReceiptVoucher from "./features/finance/components/ReceiptVoucher";
import SupplierBalances from "./features/finance/components/SupplierBalances";
import Treasury from "./features/finance/components/Treasury";
import ProfitLoss from "./features/finance/components/ProfitLoss";
import BalanceSheet from "./features/finance/components/BalanceSheet";
import CashFlowStatement from "./features/finance/components/CashFlowStatement";
import TreasuryMovement from "./features/finance/components/TreasuryMovement";
import ZakatCalculator from "./features/finance/components/ZakatCalculator";
import FinancialTransactions from "./features/finance/components/FinancialTransactions";
import FinancialReports from "./features/finance/components/FinancialReports";

// ==================== صفحات الإنتاج ====================
import ProductionOrders from "./features/production/components/ProductionOrders";
import CompletedProduction from "./features/production/components/CompletedProduction";
import ProductionBOM from "./features/production/components/ProductionBOM";
import IntegratedProduction from "./features/production/components/IntegratedProduction";

// ==================== صفحات المخزون الإنتاجي ====================
import InventoryProduction from "./features/inventory-production/components/InventoryProduction";

// ==================== صفحات الصيانة ====================
import Maintenance from "./features/maintenance/components/Maintenance";
import MaintenanceReports from "./features/maintenance/components/MaintenanceReports";

// ==================== صفحات الوثائق ====================
import DocumentsPage from "./features/documents/components/DocumentsPage";

// ==================== صفحات النسخ الاحتياطي ====================
import BackupManager from "./features/backup/components/BackupManager";
import RestoreBackup from "./features/backup/components/RestoreBackup";

// ==================== صفحات التقارير ====================
import Reports from "./features/reports/components/Reports";
import SalesReports from "./features/sales/components/SalesReports";
import PurchaseReports from "./features/purchases/components/PurchaseReports";
import InventoryReports from "./features/inventory/components/InventoryReports";  // ✅ مرة واحدة فقط هنا
import EmployeeReports from "./features/employees/components/EmployeeReports";
import ProfitReports from "./features/reports/components/ProfitReports";

// ==================== صفحات سجل النشاطات ====================
import ActivityLog from "./pages/ActivityLog";
import AdminActivityLog from "./pages/admin/ActivityLog";

// ==================== حماية الصفحات ====================
const ProtectedRoute = ({ user, permission, children }) => {
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  if (permission && !hasPermission(user.role, permission)) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return children;
};

// ==================== محتوى التطبيق ====================
function AppContent() {
  const { language } = useLanguage();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false); // ✅ حالة القائمة في الجوال
  const [darkMode, setDarkMode] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    let currentUserData = null;
    const savedUser = localStorage.getItem("currentUser");
    const savedProfile = localStorage.getItem("user_profile");

    if (savedProfile) {
      currentUserData = JSON.parse(savedProfile);
    } else if (savedUser) {
      currentUserData = JSON.parse(savedUser);
    }

    if (currentUserData) {
      setUser(currentUserData);
    }

    // تطبيق اللون الرئيسي من الإعدادات
    const applyPrimaryColor = () => {
      const savedAppearance = localStorage.getItem('app_appearance');
      if (savedAppearance) {
        const { primaryColor } = JSON.parse(savedAppearance);
        if (primaryColor) {
          document.documentElement.style.setProperty('--primary-color', primaryColor);
          // تحديث ألوان فرعية إذا لزم الأمر
          document.documentElement.style.setProperty('--primary-color-light', `${primaryColor}1a`);
        }
      }
    };

    applyPrimaryColor();
    console.log("✅ AppContent loaded");

    const handleProfileUpdate = (e) => {
      if (e.detail) {
        setUser(prev => ({ ...prev, ...e.detail }));
      }
    };

    // الاستماع لحدث تغيير اللون من الإعدادات
    window.addEventListener('appearanceChanged', applyPrimaryColor);
    window.addEventListener('userProfileUpdated', handleProfileUpdate);

    return () => {
      window.removeEventListener('appearanceChanged', applyPrimaryColor);
      window.removeEventListener('userProfileUpdated', handleProfileUpdate);
    };
  }, []);

  // تسجيل الدخول
  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem("currentUser", JSON.stringify(userData));
    
    addActivityLog(
      userData.id,
      userData.nameEn || userData.name || 'User',
      ActivityTypes.LOGIN,
      `تسجيل دخول المستخدم: ${userData.name}`,
      'local'
    );

    navigate("/dashboard");
  };

  // تسجيل الخروج
  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    localStorage.removeItem("user_profile");
    setUser(null);
    navigate("/login");
  };

  return (
    <div className={`app ${language === 'en' ? 'ltr' : 'rtl'} ${darkMode ? "dark" : ""}`}>
      {user ? (
        <>
          <Header
            user={user}
            darkMode={darkMode}
            setDarkMode={setDarkMode}
            onLogout={handleLogout}
            collapsed={collapsed}
            setCollapsed={setCollapsed}
            mobileMenuOpen={mobileMenuOpen}
            setMobileMenuOpen={setMobileMenuOpen}
          />
          <Sidebar
            collapsed={collapsed}
            setCollapsed={setCollapsed}
            mobileMenuOpen={mobileMenuOpen}
            setMobileMenuOpen={setMobileMenuOpen}
            darkMode={darkMode}
            setDarkMode={setDarkMode}
            user={user}
            onLogout={handleLogout}
          />

          {/* ✅ طبقة التغطية عند فتح القائمة في الجوال */}
          {mobileMenuOpen && (
            <div
              className="sidebar-overlay"
              onClick={() => setMobileMenuOpen(false)}
            />
          )}

          <div className="main-wrapper">
            <main className={`main-content ${collapsed ? "expanded" : ""} ${mobileMenuOpen ? "mobile-blur" : ""}`}>
              <Routes>
                {/* ===== المسار الافتراضي ===== */}
                <Route path="/" element={<Navigate to="/dashboard" replace />} />

                {/* ===== الصفحات الرئيسية ===== */}
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute user={user}>
                      <Dashboard user={user} />
                    </ProtectedRoute>
                  }
                />

                {/* ===== الفواتير ===== */}
                <Route
                  path="/invoices"
                  element={
                    <ProtectedRoute user={user} permission={PERMISSIONS.INVOICES}>
                      <Invoices user={user} />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/history"
                  element={
                    <ProtectedRoute user={user} permission={PERMISSIONS.INVOICES}>
                      <InvoiceHistory user={user} />
                    </ProtectedRoute>
                  }
                />

                {/* ===== المنتجات ===== */}
                <Route
                  path="/products"
                  element={
                    <ProtectedRoute user={user} permission={PERMISSIONS.INVENTORY}>
                      <Products user={user} />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/products/add"
                  element={
                    <ProtectedRoute user={user} permission={PERMISSIONS.INVENTORY}>
                      <AddProduct user={user} />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/products/edit/:id"
                  element={
                    <ProtectedRoute user={user} permission={PERMISSIONS.INVENTORY}>
                      <AddProduct user={user} />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/products/view/:id"
                  element={
                    <ProtectedRoute user={user} permission={PERMISSIONS.INVENTORY}>
                      <AddProduct user={user} />
                    </ProtectedRoute>
                  }
                />

                {/* ===== العملاء ===== */}
                <Route
                  path="/customers"
                  element={
                    <ProtectedRoute user={user}>
                      <Customers user={user} />
                    </ProtectedRoute>
                  }
                />

                {/* ===== الموظفين ===== */}
                <Route
                  path="/employees"
                  element={
                    <ProtectedRoute user={user}>
                      <Employees user={user} />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/users"
                  element={
                    <ProtectedRoute user={user} permission={PERMISSIONS.ADMIN}>
                      <Users user={user} />
                    </ProtectedRoute>
                  }
                />



                {/* ===== المخزون الأساسي ===== */}
                <Route
                  path="/inventory"
                  element={
                    <ProtectedRoute user={user} permission={PERMISSIONS.INVENTORY}>
                      <Inventory user={user} />
                    </ProtectedRoute>
                  }
                />

                {/* ===== المخزون المتقدم ===== */}
                <Route
                  path="/inventory/warehouses"
                  element={
                    <ProtectedRoute user={user}>
                      <Warehouses user={user} />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/inventory/categories"
                  element={
                    <ProtectedRoute user={user}>
                      <InventoryCategories user={user} />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/inventory/current-stock"
                  element={
                    <ProtectedRoute user={user}>
                      <CurrentStock user={user} />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/inventory/movements"
                  element={
                    <ProtectedRoute user={user}>
                      <InventoryMovements user={user} />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/inventory/transfers"
                  element={
                    <ProtectedRoute user={user}>
                      <InventoryTransfers user={user} />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/inventory/adjustments"
                  element={
                    <ProtectedRoute user={user}>
                      <InventoryAdjustments user={user} />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/inventory/units"
                  element={
                    <ProtectedRoute user={user}>
                      <UnitsManager user={user} />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/inventory/reports"
                  element={
                    <ProtectedRoute user={user}>
                      <InventoryReports user={user} />  {/* ✅ هذا هو المسار الصحيح */}
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/purchases"
                  element={
                    <ProtectedRoute user={user} permission={PERMISSIONS.PURCHASES}>
                      <Purchases user={user} />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/purchases/returns"
                  element={
                    <ProtectedRoute user={user} permission={PERMISSIONS.PURCHASES}>
                      <PurchaseReturn user={user} />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/purchases/suppliers"
                  element={
                    <ProtectedRoute user={user} permission={PERMISSIONS.PURCHASES}>
                      <Suppliers user={user} />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/purchases/reports"
                  element={
                    <ProtectedRoute user={user} permission={PERMISSIONS.PURCHASES}>
                      <PurchaseReports user={user} />
                    </ProtectedRoute>
                  }
                />

                {/* ===== المبيعات ===== */}
                <Route
                  path="/sales/return"
                  element={
                    <ProtectedRoute user={user} permission={PERMISSIONS.SALES}>
                      <SalesReturn user={user} />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/sales/cancel"
                  element={
                    <ProtectedRoute user={user} permission={PERMISSIONS.SALES}>
                      <SalesCancel user={user} />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/sales/quotation"
                  element={
                    <ProtectedRoute user={user} permission={PERMISSIONS.SALES}>
                      <Quotation user={user} />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/sales/history"
                  element={
                    <ProtectedRoute user={user} permission={PERMISSIONS.SALES}>
                      <SalesHistory user={user} />
                    </ProtectedRoute>
                  }
                />

                {/* ===== المالية ===== */}
                <Route
                  path="/finance"
                  element={
                    <ProtectedRoute user={user} permission={PERMISSIONS.FINANCE}>
                      <Finance user={user} />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/finance/dashboard"
                  element={
                    <ProtectedRoute user={user} permission={PERMISSIONS.FINANCE}>
                      <FinanceDashboard user={user} />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/finance/indicators"
                  element={
                    <ProtectedRoute user={user} permission={PERMISSIONS.FINANCE}>
                      <FinanceIndicators user={user} />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/finance/health"
                  element={
                    <ProtectedRoute user={user} permission={PERMISSIONS.FINANCE}>
                      <FinanceHealth user={user} />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/finance/banks"
                  element={
                    <ProtectedRoute user={user} permission={PERMISSIONS.FINANCE}>
                      <Banks user={user} />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/finance/cashflow"
                  element={
                    <ProtectedRoute user={user} permission={PERMISSIONS.FINANCE}>
                      <CashFlow user={user} />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/finance/customer-balances"
                  element={
                    <ProtectedRoute user={user} permission={PERMISSIONS.FINANCE}>
                      <CustomerBalances user={user} />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/finance/expenses"
                  element={
                    <ProtectedRoute user={user} permission={PERMISSIONS.FINANCE}>
                      <Expenses user={user} />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/finance/expenses/add"
                  element={
                    <ProtectedRoute user={user} permission={PERMISSIONS.FINANCE}>
                      <Expenses user={user} />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/finance/expense-categories"
                  element={
                    <ProtectedRoute user={user} permission={PERMISSIONS.FINANCE}>
                      <ExpenseCategories user={user} />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/finance/expense-reports"
                  element={
                    <ProtectedRoute user={user} permission={PERMISSIONS.FINANCE}>
                      <ExpenseReports user={user} />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/finance/expense-filter"
                  element={
                    <ProtectedRoute user={user} permission={PERMISSIONS.FINANCE}>
                      <ExpenseFilter user={user} />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/finance/payment-voucher"
                  element={
                    <ProtectedRoute user={user} permission={PERMISSIONS.FINANCE}>
                      <PaymentVoucher user={user} />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/finance/receipt-voucher"
                  element={
                    <ProtectedRoute user={user} permission={PERMISSIONS.FINANCE}>
                      <ReceiptVoucher user={user} />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/finance/supplier-balances"
                  element={
                    <ProtectedRoute user={user} permission={PERMISSIONS.FINANCE}>
                      <SupplierBalances user={user} />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/finance/treasury"
                  element={
                    <ProtectedRoute user={user} permission={PERMISSIONS.FINANCE}>
                      <Treasury user={user} />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/finance/reports/profit-loss"
                  element={
                    <ProtectedRoute user={user} permission={PERMISSIONS.FINANCE}>
                      <ProfitLoss user={user} />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/finance/reports/balance-sheet"
                  element={
                    <ProtectedRoute user={user} permission={PERMISSIONS.FINANCE}>
                      <BalanceSheet user={user} />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/finance/reports/cash-flow"
                  element={
                    <ProtectedRoute user={user} permission={PERMISSIONS.FINANCE}>
                      <CashFlowStatement user={user} />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/finance/reports/treasury-movement"
                  element={
                    <ProtectedRoute user={user} permission={PERMISSIONS.FINANCE}>
                      <TreasuryMovement user={user} />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/finance/transactions"
                  element={
                    <ProtectedRoute user={user} permission={PERMISSIONS.FINANCE}>
                      <FinancialTransactions user={user} />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/finance/zakat"
                  element={
                    <ProtectedRoute user={user} permission={PERMISSIONS.FINANCE}>
                      <ZakatCalculator user={user} />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/finance/financial-reports"
                  element={
                    <ProtectedRoute user={user} permission={PERMISSIONS.FINANCE}>
                      <FinancialReports user={user} />
                    </ProtectedRoute>
                  }
                />

                {/* ===== الإنتاج ===== */}
                <Route
                  path="/production"
                  element={
                    <ProtectedRoute user={user} permission={PERMISSIONS.INVENTORY}>
                      <ProductionOrders user={user} />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/production/completed"
                  element={
                    <ProtectedRoute user={user} permission={PERMISSIONS.INVENTORY}>
                      <CompletedProduction user={user} />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/production/bom"
                  element={
                    <ProtectedRoute user={user} permission={PERMISSIONS.INVENTORY}>
                      <ProductionBOM user={user} />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/production/integrated"
                  element={
                    <ProtectedRoute user={user} permission={PERMISSIONS.INVENTORY}>
                      <IntegratedProduction user={user} />
                    </ProtectedRoute>
                  }
                />

                {/* ===== المخزون الإنتاجي ===== */}
                <Route
                  path="/inventory-production"
                  element={
                    <ProtectedRoute user={user} permission={PERMISSIONS.INVENTORY}>
                      <InventoryProduction user={user} />
                    </ProtectedRoute>
                  }
                />

                {/* ===== الصيانة ===== */}
                <Route
                  path="/maintenance"
                  element={
                    <ProtectedRoute user={user} permission={PERMISSIONS.MAINTENANCE}>
                      <Maintenance user={user} />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/maintenance/reports"
                  element={
                    <ProtectedRoute user={user} permission={PERMISSIONS.MAINTENANCE}>
                      <MaintenanceReports user={user} />
                    </ProtectedRoute>
                  }
                />

                {/* ===== الوثائق ===== */}
                <Route
                  path="/documents"
                  element={
                    <ProtectedRoute user={user} permission={PERMISSIONS.DOCUMENTS}>
                      <DocumentsPage user={user} />
                    </ProtectedRoute>
                  }
                />

                {/* ===== النسخ الاحتياطي ===== */}
                <Route
                  path="/backup"
                  element={
                    <ProtectedRoute user={user} permission={PERMISSIONS.ADMIN}>
                      <BackupManager user={user} />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/restore"
                  element={
                    <ProtectedRoute user={user} permission={PERMISSIONS.ADMIN}>
                      <RestoreBackup user={user} />
                    </ProtectedRoute>
                  }
                />

                {/* ===== التقارير ===== */}
                <Route
                  path="/reports"
                  element={
                    <ProtectedRoute user={user} permission={PERMISSIONS.REPORTS}>
                      <Reports user={user} />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/reports/sales"
                  element={
                    <ProtectedRoute user={user} permission={PERMISSIONS.REPORTS}>
                      <SalesReports user={user} />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/reports/purchases"
                  element={
                    <ProtectedRoute user={user} permission={PERMISSIONS.REPORTS}>
                      <PurchaseReports user={user} />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/reports/inventory"
                  element={
                    <ProtectedRoute user={user} permission={PERMISSIONS.REPORTS}>
                      <InventoryReports user={user} />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/reports/employees"
                  element={
                    <ProtectedRoute user={user} permission={PERMISSIONS.REPORTS}>
                      <EmployeeReports user={user} />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/reports/maintenance"
                  element={
                    <ProtectedRoute user={user} permission={PERMISSIONS.REPORTS}>
                      <MaintenanceReports user={user} />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/reports/profit"
                  element={
                    <ProtectedRoute user={user} permission={PERMISSIONS.REPORTS}>
                      <ProfitReports user={user} />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/reports/financial"
                  element={
                    <ProtectedRoute user={user} permission={PERMISSIONS.REPORTS}>
                      <FinancialReports user={user} />
                    </ProtectedRoute>
                  }
                />

                {/* ===== سجل النشاطات ===== */}
                <Route
                  path="/activity-log"
                  element={
                    <ProtectedRoute user={user} permission={PERMISSIONS.ACTIVITY_LOG}>
                      <ActivityLog user={user} />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/activity-log"
                  element={
                    <ProtectedRoute user={user} permission={PERMISSIONS.SETTINGS}>
                      <AdminActivityLog user={user} />
                    </ProtectedRoute>
                  }
                />

                {/* ===== الإعدادات ===== */}
                <Route
                  path="/settings"
                  element={
                    <ProtectedRoute user={user} permission={PERMISSIONS.SETTINGS}>
                      <Settings user={user} darkMode={darkMode} setDarkMode={setDarkMode} />
                    </ProtectedRoute>
                  }
                />

                {/* ===== أي مسار غير معروف ===== */}
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
              </Routes>
            </main>
          </div>

          <BottomNav />
        </>
      ) : (
        <Routes>
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="/register" element={<Register />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      )}
    </div>
  );
}

// ==================== التطبيق الرئيسي ====================
function App() {
  return (
    <BrowserRouter>
      <LanguageProvider>
        <AppContent />
      </LanguageProvider>
    </BrowserRouter>
  );
}

export default App;