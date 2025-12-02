// login.js (Firebase-enabled)
const emailInput = document.getElementById("emailInput");
const passwordInput = document.getElementById("passwordInput");
const loginBtn = document.getElementById("loginBtn");
const loginMsg = document.getElementById("loginMsg");

// Check if Firebase is initialized
if (!window.firebaseSignInWithEmail) {
  console.warn("Firebase not initialized yet. Make sure the module script in login.html is present.");
}

// Login button click
loginBtn.onclick = async () => {
  const email = emailInput.value.trim();
  const pass = passwordInput.value;

  // Empty fields check
  if (!email || !pass) {
    loginMsg.textContent = "Please fill all fields.";
    loginMsg.style.color = "red";
    return;
  }

  try {
    // Firebase sign in
    await window.firebaseSignInWithEmail(email, pass);

    // Redirect to home page on success
    window.location.href = "home.html";
  } 
  catch (err) {
    console.error("Login Error:", err);

    // Friendly error messages
    if (err.code) {
      switch (err.code) {
        case "auth/user-not-found":
        case "auth/wrong-password":
          loginMsg.textContent = "Invalid email or password.";
          break;
        case "auth/invalid-email":
          loginMsg.textContent = "Invalid email format.";
          break;
        case "auth/too-many-requests":
          loginMsg.textContent = "Too many attempts. Try again later.";
          break;
        default:
          loginMsg.textContent = err.message;
      }
    } 
    else {
      loginMsg.textContent = "Login failed. Please try again.";
    }

    loginMsg.style.color = "red";
  }
};

// Optional: trigger login with Enter key
document.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    loginBtn.click();
  }
});

// Optional: Show/hide password (if HTML eye icon is used)
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
