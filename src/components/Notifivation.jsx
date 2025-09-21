import { ToastContainer } from "react-toastify";
import { styled } from "@mui/material/styles";
import "react-toastify/dist/ReactToastify.css";

const Notification = () => (
  <StyledToastContainer
    position="top-right"
    closeOnClick
    draggable
    hideProgressBar
    limit={1}
  />
);

export default Notification;

const StyledToastContainer = styled(ToastContainer)({
  ".Toastify__toast": {
    minWidth: "90px",
    maxWidth: "300px",
    borderRadius: "10px",
    fontFamily: "Inter, sans-serif",

    padding: "12px 28px 12px 28px",

    display: "flex",
    alignItems: "center",
    gap: "12px",

    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
  },

  ".Toastify__toast-body": {
    padding: "16px",
    fontSize: "14px",
    fontWeight: 500,
  },

  ".Toastify__toast--success": {
    background: "rgba(255, 255, 255, 0.1)",
    backdropFilter: "blur(16px)",
    color: "#fff",
  },

  ".Toastify__toast--error": {
    background: "rgba(255, 255, 255, 0.1)",
    backdropFilter: "blur(16px)",
    color: "#fff",
  },
});
