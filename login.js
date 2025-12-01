// login.js (Firebase-enabled)
const emailInput = document.getElementById("emailInput");
const passwordInput = document.getElementById("passwordInput");
const loginBtn = document.getElementById("loginBtn");
const loginMsg = document.getElementById("loginMsg");

// If firebase isn't loaded yet, show a clear error
if (!window.firebaseSignInWithEmail) {
  console.warn("Firebase not initialized yet. Make sure the module script in login.html is present.");
}

loginBtn.onclick = async () => {
  const email = emailInput.value.trim();
  const pass = passwordInput.value;

  if (!email || !pass) {
    loginMsg.textContent = "Please fill all fields.";
    return;
  }

  try {
    // use the helper exposed by login.html's module script
    await window.firebaseSignInWithEmail(email, pass);
    // success - redirect handled by auth state in module or perform redirect
    window.location.href = "home.html";
  } catch (err) {
    // Friendly error messages
    if (err.code) {
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
        loginMsg.textContent = "Invalid email or password.";
      } else {
        loginMsg.textContent = err.message;
      }
    } else {
      loginMsg.textContent = "Login failed.";
    }
  }
};
