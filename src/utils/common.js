import toast from "react-simple-toasts";

export const showToast = (message, theme = "success") => {
  toast(message, { theme });
};
