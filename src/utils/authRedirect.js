// utils/authRedirect.js
import { message } from "antd";

export const redirectToLogin = () => {
  message.warning(
    "You are not logged in. Please login to continue.",
    5 // duration in seconds
  );

  localStorage.clear(); // optional

  setTimeout(() => {
    window.location.href = "/login";
  }, 5000);
};


export const getUserRole = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  return user?.role?.toLowerCase();
};

export const getRoleFlags = () => {
  const role = getUserRole();

  return {
    isAdmin: ["admin", "manager"].includes(role),
    isEmployee: ["employee", "sales associate"].includes(role),
    isCustomer: role === "customer"
  };
};