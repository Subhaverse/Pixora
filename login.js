const emailInput = document.getElementById("emailInput");
const passwordInput = document.getElementById("passwordInput");
const loginBtn = document.getElementById("loginBtn");
const loginMsg = document.getElementById("loginMsg");

const users = JSON.parse(localStorage.getItem("users") || "[]");

// Email/Password Login
loginBtn.onclick = () => {
  const email = emailInput.value.trim();
  const pass = passwordInput.value;

  if (!email || !pass) {
    loginMsg.textContent = "Please fill all fields.";
    return;
  }

  const user = users.find(u => u.email === email && u.password === pass);
  if (!user) {
    loginMsg.textContent = "Invalid email or password.";
    return;
  }

  localStorage.setItem("sessionUser", JSON.stringify(user));
  window.location.href = "home.html";
};

// Google Login
window.onload = () => {
  google.accounts.id.initialize({
    client_id: "763660019548-6q46a2r1h23rt373f67rtatju36g5aue.apps.googleusercontent.com",
    callback: googleLoginSuccess
  });

  google.accounts.id.renderButton(
    document.getElementById("googleLogin"),
    { theme: "outline", size: "large", width: "100%" }
  );
};

function googleLoginSuccess(response) {
  const data = JSON.parse(atob(response.credential.split(".")[1]));

  const googleUser = {
    name: data.name,
    email: data.email,
    picture: data.picture
  };

  localStorage.setItem("sessionUser", JSON.stringify(googleUser));
  window.location.href = "home.html";
}
