// DOM ELEMENTS
const emailInput = document.getElementById("resetEmail");
const resetBtn = document.getElementById("resetBtn");
const resetMsg = document.getElementById("resetMsg");

let isSending = false; // prevent double clicks

// ---------- RESET BUTTON CLICK ----------
resetBtn.onclick = async () => {
  if (isSending) return;

  const email = emailInput.value.trim();
  resetMsg.textContent = "";

  if (!email) {
    showMessage("Please enter your email.", "red");
    return;
  }

  if (!window.firebaseSendResetEmail) {
    showMessage("Reset system not ready. Refresh page.", "red");
    return;
  }

  try {
    isSending = true;
    resetBtn.disabled = true;
    resetBtn.textContent = "Sending...";

    await window.firebaseSendResetEmail(email);

    showMessage("Password reset link sent! Check your inbox.", "lightgreen");
  } 
  catch (err) {
    let msg = "Failed to send reset email.";

    switch (err.code) {
      case "auth/user-not-found":
        msg = "No account is registered with this email.";
        break;
      case "auth/invalid-email":
        msg = "Invalid email format.";
        break;
      case "auth/too-many-requests":
        msg = "Too many attempts. Try again later.";
        break;
      default:
        msg = err.message || msg;
    }

    showMessage(msg, "red");
  }
  finally {
    isSending = false;
    resetBtn.disabled = false;
    resetBtn.textContent = "Send Reset Link";
  }
};

// Press Enter to submit
document.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !isSending) resetBtn.click();
});

// ---------- Helper function ----------
function showMessage(text, color) {
  resetMsg.textContent = text;
  resetMsg.style.color = color;
}
