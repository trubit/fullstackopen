// Shared layout for all notifications.
const baseStyle = {
  width: "100%",
  boxSizing: "border-box",
  padding: "10px 12px",
  borderRadius: "4px",
  marginBottom: "12px",
  fontSize: "16px",
};

// Green success message styling.
const successStyle = {
  border: "2px solid #2e7d32",
  color: "#2e7d32",
  backgroundColor: "#e9f7ea",
};

// Red error message styling.
const errorStyle = {
  border: "2px solid #d32f2f",
  color: "#d32f2f",
  backgroundColor: "#fde7e9",
};

// Shows a notification message; type controls the color.
const Notification = ({ message, type = "success" }) => {
  if (!message) {
    return null;
  }

  // Pick the style based on the message type.
  const variantStyle = type === "error" ? errorStyle : successStyle;

  return <div style={{ ...baseStyle, ...variantStyle }}>{message}</div>;
};

export default Notification;
