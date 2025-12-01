// signup.js
const usernameInput = document.getElementById("signupUsername");
const emailInput = document.getElementById("signupEmail");
const passwordInput = document.getElementById("signupPassword");
const signupBtn = document.getElementById("signupBtn");
const signupMsg = document.getElementById("signupMsg");

signupBtn.onclick = async () => {
  const name = usernameInput.value.trim();
  const email = emailInput.value.trim();
  const pass = passwordInput.value;

  if (!name || !email || !pass) {
    signupMsg.textContent = "All fields are required.";
    return;
  }

  try {
    // create user in Firebase Auth and set displayName
    await window.firebaseCreateUser(name, email, pass);
    signupMsg.textContent = "Account created! Redirecting...";
    setTimeout(() => { window.location.href = "index.html"; }, 800);
  } catch (err) {
    if (err.code === 'auth/email-already-in-use') {
      signupMsg.textContent = "Email already exists.";
    } else {
      signupMsg.textContent = err.message || "Signup failed.";
    }
  }
};
