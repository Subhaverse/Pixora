const usernameInput = document.getElementById("signupUsername");
const emailInput = document.getElementById("signupEmail");
const passwordInput = document.getElementById("signupPassword");
const signupBtn = document.getElementById("signupBtn");
const signupMsg = document.getElementById("signupMsg");

let users = JSON.parse(localStorage.getItem("users") || "[]");

signupBtn.onclick = () => {
  const name = usernameInput.value.trim();
  const email = emailInput.value.trim();
  const pass = passwordInput.value;

  if (!name || !email || !pass) {
    signupMsg.textContent = "All fields are required.";
    return;
  }

  if (users.some(u => u.email === email)) {
    signupMsg.textContent = "Email already exists.";
    return;
  }

  const newUser = { name, email, password: pass };
  users.push(newUser);

  localStorage.setItem("users", JSON.stringify(users));
  signupMsg.textContent = "Account created! Redirecting...";

  setTimeout(() => { window.location.href = "index.html"; }, 1200);
};
