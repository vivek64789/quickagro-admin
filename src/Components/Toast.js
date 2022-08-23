import { ToastContainer, toast } from "react-toastify";

const lightToast = {
  style: {
    background: "white",
    color: "var(--primaryColor)",
    textAlign: "center",
    fontWeight: "600",
  },
  hideProgressBar: true,
  position: "bottom-center",
  autoClose: 3000,
};

const darkToast = {
  style: {
    background: "var(--primaryColor)",
    color: "white",
    textAlign: "center",
    fontWeight: "600",
  },
  hideProgressBar: true,
  position: "bottom-center",
  autoClose: 3000,
};

export { lightToast, darkToast, ToastContainer, toast };
