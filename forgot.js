// DOM ELEMENTS
const emailInput = document.getElementById("resetEmail");
const resetBtn = document.getElementById("resetBtn");
const resetMsg = document.getElementById("resetMsg");

let isSending = false; // prevent double clicks

resetBtn.onclick = async () => {
  if (isSending) return;

  const email = emailInput.value.trim();
  resetMsg.textContent = "";

  if (!email) {
    showMessage("Please enter your email.", "red");
    return;
  }

  // Firebase not ready yet?
  if (!window.resetPassword) {
    showMessage("System is still loading... try again.", "red");
    return;
  }

  try {
    isSending = true;
    resetBtn.disabled = true;
    resetBtn.textContent = "Sending...";

    // 🔥 Firebase reset
    await window.resetPassword(email);

    // SUCCESS
    showMessage("Reset link sent! Check your inbox.", "lightgreen");

    // Cooldown ONLY on success
    startCooldown();
    return;

  } catch (err) {
    let msg = "Failed to send reset email.";

    switch (err.code) {
      case "auth/user-not-found":
        msg = "No account exists with this email.";
        break;
      case "auth/invalid-email":
        msg = "Invalid email format.";
        break;
      case "auth/too-many-requests":
        msg = "Too many attempts. Try again later.";
        break;
    }

    showMessage(msg, "red");

    // Re-enable button immediately on error
    resetBtn.disabled = false;
    resetBtn.textContent = "Send Reset Link";
    isSending = false;
  }
};

// Cooldown function (30 seconds)
function startCooldown() {
  let time = 30;
  resetBtn.disabled = true;

  const interval = setInterval(() => {
    resetBtn.textContent = `Wait (${time}s)`;
    time--;

    if (time < 0) {
      clearInterval(interval);
      resetBtn.disabled = false;
      resetBtn.textContent = "Send Reset Link";
      isSending = false;
    }
  }, 1000);
}

// Display messages
function showMessage(text, color) {
  resetMsg.textContent = text;
  resetMsg.style.color = color;
}
