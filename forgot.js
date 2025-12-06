resetBtn.onclick = async () => {
  if (isSending) return;

  const email = emailInput.value.trim();
  resetMsg.textContent = "";

  if (!email) {
    showMessage("Please enter your email.", "red");
    return;
  }

  try {
    isSending = true;
    resetBtn.disabled = true;
    resetBtn.textContent = "Sending...";

    await window.resetPassword(email);

    // SUCCESS
    showMessage("Reset link sent! Check your inbox.", "lightgreen");

    // Start cooldown only on success
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

    // Reset button immediately on error
    resetBtn.disabled = false;
    resetBtn.textContent = "Send Reset Link";
    isSending = false;
  }
};

// Cooldown function
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

function showMessage(text, color) {
  resetMsg.textContent = text;
  resetMsg.style.color = color;
}
