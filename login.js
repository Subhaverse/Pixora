const emailInput = document.getElementById("emailInput");
const passwordInput = document.getElementById("passwordInput");
const loginBtn = document.getElementById("loginBtn");
const loginMsg = document.getElementById("loginMsg");

let isLoggingIn = false; // prevent double login

// Login button click
loginBtn.onclick = async () => {
  if (isLoggingIn) return; // block repeated clicks

  const email = emailInput.value.trim();
  const pass = passwordInput.value;

  // Clear old message
  loginMsg.textContent = "";

  if (!email || !pass) {
    loginMsg.textContent = "Please fill all fields.";
    loginMsg.style.color = "red";
    return;
  }

  // Check Firebase function availability
  if (!window.firebaseSignInWithEmail) {
    loginMsg.textContent = "Login system not ready. Please refresh.";
    loginMsg.style.color = "red";
    return;
  }

  try {
    isLoggingIn = true;
    loginBtn.disabled = true;
    loginBtn.textContent = "Signing in...";

    await window.firebaseSignInWithEmail(email, pass);

    window.location.href = "home.html";
  } 
  catch (err) {
    let message = "Login failed. Please try again.";

    if (err.code) {
      switch (err.code) {
        case "auth/user-not-found":
        case "auth/wrong-password":
          message = "Invalid email or password.";
          break;
        case "auth/invalid-email":
          message = "Invalid email format.";
          break;
        case "auth/too-many-requests":
          message = "Too many attempts. Try again later.";
          break;
        default:
          message = err.message;
      }
    }

    loginMsg.textContent = message;
    loginMsg.style.color = "red";
  } 
  finally {
    isLoggingIn = false;
    loginBtn.disabled = false;
    loginBtn.textContent = "Sign In";
  }
};

// Trigger login on Enter
document.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !isLoggingIn) {
    loginBtn.click();
  }
});
