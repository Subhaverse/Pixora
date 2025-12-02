// DOM elements
const usernameInput = document.getElementById("signupUsername");
const emailInput = document.getElementById("signupEmail");
const passwordInput = document.getElementById("signupPassword");
const signupBtn = document.getElementById("signupBtn");
const signupMsg = document.getElementById("signupMsg");
const toggleIcon = document.getElementById("togglePassword");

// ----- PASSWORD TOGGLE FUNCTION -----
function togglePassword(inputId, icon) {
  const field = document.getElementById(inputId);
  if (field.type === "password") {
    field.type = "text";
    icon.textContent = "visibility_off";
  } else {
    field.type = "password";
    icon.textContent = "visibility";
  }
}

// Attach click handler
toggleIcon.onclick = () => togglePassword("signupPassword", toggleIcon);

// ----- UPDATE ICON VISIBILITY -----
passwordInput.addEventListener("input", () => {
  if (passwordInput.value.length > 0) {
    toggleIcon.classList.add("show"); // show icon when typing
    // Keep icon text as is; do not reset
  } else {
    toggleIcon.classList.remove("show"); // hide icon if empty
    passwordInput.type = "password";     // always hide empty password
    // ✅ do NOT reset toggleIcon.textContent
  }
});

// ----- SIGNUP FUNCTION -----
signupBtn.onclick = async () => {
  const name = usernameInput.value.trim();
  const email = emailInput.value.trim();
  const pass = passwordInput.value;

  if (!name || !email || !pass) {
    showMessage("All fields are required.", "red");
    return;
  }

  try {
    await window.firebaseCreateUser(name, email, pass);
    showMessage("Account created! Redirecting...", "green");
    setTimeout(() => window.location.href = "index.html", 1000);
  } catch (err) {
    let message = "Signup failed.";
    switch (err.code) {
      case "auth/email-already-in-use":
        message = "Email already exists.";
        break;
      case "auth/invalid-email":
        message = "Invalid email format.";
        break;
      case "auth/weak-password":
        message = "Password should be at least 6 characters.";
        break;
      default:
        message = err.message || "Signup failed.";
    }
    showMessage(message, "red");
  }
};

// Press Enter to submit
document.addEventListener("keydown", (e) => {
  if (e.key === "Enter") signupBtn.click();
});

// ----- HELPER FUNCTION -----
function showMessage(msg, color) {
  signupMsg.textContent = msg;
  signupMsg.style.color = color;
}
