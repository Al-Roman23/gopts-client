import { createBrowserRouter } from "react-router";
import { lazy, Suspense } from "react";
import RootLayout from "../layouts/RootLayout";
import PrivateRoute from "./PrivateRoute";
import RoleRoute from "./RoleRoute";
import DashboardLayout from "../layouts/DashboardLayout";
import AuthLayout from "../layouts/AuthLayout";
import LoadingSpinner from "../components/ui/LoadingSpinner";

// Lazy Load Pages
const Home = lazy(() => import("../pages/Home/Home/Home"));
const AllProductsPage = lazy(() => import("../pages/AllProducts/AllProductsPage"));
const ProductDetailsPage = lazy(() => import("../pages/AllProducts/ProductDetails"));
const BookingForm = lazy(() => import("../pages/AllProducts/BookingForm"));
const PublicTrackOrder = lazy(() => import("../pages/Dashboard/User/TrackOrder/PublicTrackOrder"));
const Login = lazy(() => import("../pages/Auth/Login/Login"));
const Register = lazy(() => import("../pages/Auth/Register/Register"));
const DashboardHome = lazy(() => import("../pages/Dashboard/DashboardHome/DashboardHome"));
const ManageUsers = lazy(() => import("../pages/Dashboard/Admin/ManageUsers/ManageUsers"));
const AllProducts = lazy(() => import("../pages/Dashboard/Admin/AllProducts/AllProducts"));
const AllOrders = lazy(() => import("../pages/Dashboard/Admin/AllOrders/AllOrders"));
const OrderDetails = lazy(() => import("../pages/Dashboard/Admin/OrderDetails/OrderDetails"));
const AddProduct = lazy(() => import("../pages/Dashboard/Manager/AddProduct/AddProduct"));
const ManageProducts = lazy(() => import("../pages/Dashboard/Manager/ManageProducts/ManageProducts"));
const UpdateProduct = lazy(() => import("../pages/Dashboard/Manager/UpdateProduct/UpdateProduct"));
const PendingOrders = lazy(() => import("../pages/Dashboard/Manager/PendingOrders/PendingOrders"));
const ApprovedOrders = lazy(() => import("../pages/Dashboard/Manager/ApprovedOrders/ApprovedOrders"));
const MyOrders = lazy(() => import("../pages/Dashboard/User/MyOrders/MyOrders"));
const Profile = lazy(() => import("../pages/Dashboard/User/Profile/Profile"));
const AdminUpdateProduct = lazy(() => import("../pages/Dashboard/Admin/AdminUpdateProduct/AdminUpdateProduct"));
const PendingProducts = lazy(() => import("../pages/Dashboard/Admin/PendingProducts/PendingProducts"));
const TrackOrder = lazy(() => import("../pages/Dashboard/User/TrackOrder/TrackOrder"));
const AboutPage = lazy(() => import("../pages/About/AboutPage"));
const ContactPage = lazy(() => import("../pages/Contact/ContactPage"));
const NotFoundPage = lazy(() => import("../pages/NotFound/NotFoundPage"));

// Suspense Wrapper
const SuspenseWrapper = ({ children }) => {
  return <Suspense fallback={<LoadingSpinner />}>{children}</Suspense>;
};

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    errorElement: (
      <RootLayout>
        <SuspenseWrapper>
          <NotFoundPage />
        </SuspenseWrapper>
      </RootLayout>
    ),
    children: [
      { index: true, element: <SuspenseWrapper><Home /></SuspenseWrapper> },
      { path: "all-products", element: <SuspenseWrapper><AllProductsPage /></SuspenseWrapper> },
      { path: "about", element: <SuspenseWrapper><AboutPage /></SuspenseWrapper> },
      { path: "contact", element: <SuspenseWrapper><ContactPage /></SuspenseWrapper> },
      {
        path: "product/:id",
        element: (
          <PrivateRoute>
            <SuspenseWrapper><ProductDetailsPage /></SuspenseWrapper>
          </PrivateRoute>
        ),
      },
      {
        path: "booking/:id",
        element: (
          <PrivateRoute>
            <SuspenseWrapper><BookingForm /></SuspenseWrapper>
          </PrivateRoute>
        ),
      },
      { path: "track-order", element: <SuspenseWrapper><PublicTrackOrder /></SuspenseWrapper> },
      { path: "*", element: <SuspenseWrapper><NotFoundPage /></SuspenseWrapper> },
    ],
  },
  {
    path: "/",
    element: <AuthLayout />,
    children: [
      { path: "login", element: <SuspenseWrapper><Login /></SuspenseWrapper> },
      { path: "register", element: <SuspenseWrapper><Register /></SuspenseWrapper> },
    ],
  },
  {
    path: "/dashboard",
    element: (
      <PrivateRoute>
        <DashboardLayout />
      </PrivateRoute>
    ),
    children: [
      { index: true, element: <SuspenseWrapper><DashboardHome /></SuspenseWrapper> },
      {
        path: "track-order",
        element: (
          <RoleRoute allowed={["buyer"]}>
            <SuspenseWrapper><TrackOrder /></SuspenseWrapper>
          </RoleRoute>
        ),
      },
      {
        path: "manage-users",
        element: (
          <RoleRoute allowed={["admin"]}>
            <SuspenseWrapper><ManageUsers /></SuspenseWrapper>
          </RoleRoute>
        ),
      },
      {
        path: "all-products",
        element: (
          <RoleRoute allowed={["admin"]}>
            <SuspenseWrapper><AllProducts /></SuspenseWrapper>
          </RoleRoute>
        ),
      },
      {
        path: "pending-products",
        element: (
          <RoleRoute allowed={["admin"]}>
            <SuspenseWrapper><PendingProducts /></SuspenseWrapper>
          </RoleRoute>
        ),
      },
      {
        path: "all-orders",
        element: (
          <RoleRoute allowed={["admin"]}>
            <SuspenseWrapper><AllOrders /></SuspenseWrapper>
          </RoleRoute>
        ),
      },
      {
        path: "order-details/:id",
        element: (
          <RoleRoute allowed={["admin", "manager"]}>
            <SuspenseWrapper><OrderDetails /></SuspenseWrapper>
          </RoleRoute>
        ),
      },
      {
        path: "add-product",
        element: (
          <RoleRoute allowed={["manager"]}>
            <SuspenseWrapper><AddProduct /></SuspenseWrapper>
          </RoleRoute>
        ),
      },
      {
        path: "manage-products",
        element: (
          <RoleRoute allowed={["manager"]}>
            <SuspenseWrapper><ManageProducts /></SuspenseWrapper>
          </RoleRoute>
        ),
      },
      {
        path: "update-product/:id",
        element: (
          <RoleRoute allowed={["manager"]}>
            <SuspenseWrapper><UpdateProduct /></SuspenseWrapper>
          </RoleRoute>
        ),
      },
      {
        path: "pending-orders",
        element: (
          <RoleRoute allowed={["manager"]}>
            <SuspenseWrapper><PendingOrders /></SuspenseWrapper>
          </RoleRoute>
        ),
      },
      {
        path: "approved-orders",
        element: (
          <RoleRoute allowed={["manager"]}>
            <SuspenseWrapper><ApprovedOrders /></SuspenseWrapper>
          </RoleRoute>
        ),
      },
      {
        path: "my-orders",
        element: (
          <RoleRoute allowed={["buyer"]}>
            <SuspenseWrapper><MyOrders /></SuspenseWrapper>
          </RoleRoute>
        ),
      },
      {
        path: "profile",
        element: (
          <RoleRoute allowed={["buyer", "manager", "admin"]}>
            <SuspenseWrapper><Profile /></SuspenseWrapper>
          </RoleRoute>
        ),
      },
      {
        path: "admin/update-product/:id",
        element: (
          <RoleRoute allowed={["admin"]}>
            <SuspenseWrapper><AdminUpdateProduct /></SuspenseWrapper>
          </RoleRoute>
        ),
      },
    ],
  },
]);
