// Get DOM elements
const usernameInput = document.getElementById("signupUsername");
const emailInput = document.getElementById("signupEmail");
const passwordInput = document.getElementById("signupPassword");
const signupBtn = document.getElementById("signupBtn");
const signupMsg = document.getElementById("signupMsg");
const toggleIcon = document.getElementById("togglePassword");

// ----- PASSWORD TOGGLE -----
toggleIcon.onclick = () => {
  if (passwordInput.type === "password") {
    passwordInput.type = "text";               // show password
    toggleIcon.textContent = "visibility_off"; // show closed eye
  } else {
    passwordInput.type = "password";           // hide password
    toggleIcon.textContent = "visibility";     // show open eye
  }
  toggleIcon.classList.add("show");            // keep icon visible
};

// ----- UPDATE ICON VISIBILITY DYNAMICALLY -----
passwordInput.addEventListener("input", () => {
  if (!passwordInput.value) {
    toggleIcon.classList.remove("show");       // hide icon when empty
    toggleIcon.textContent = "visibility";     // reset icon
    passwordInput.type = "password";           // always hide empty password
  } else {
    toggleIcon.classList.add("show");          // show icon when typing
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

    setTimeout(() => {
      window.location.href = "index.html";
    }, 1000);

  } catch (err) {
    handleSignupError(err);
  }
};

// Press Enter to submit
document.addEventListener("keydown", (e) => {
  if (e.key === "Enter") signupBtn.click();
});

// ----- HELPER FUNCTIONS -----
function showMessage(msg, color) {
  signupMsg.textContent = msg;
  signupMsg.style.color = color;
}

function handleSignupError(err) {
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
