const loginBtn = document.getElementById("loginBtn");
const loginError = document.getElementById("loginError");

const USERS = [{username:"user", password:"1234"}]; // predefined users

loginBtn.onclick = () => {
  const u = document.getElementById("username").value.trim();
  const p = document.getElementById("password").value.trim();
  const user = USERS.find(x => x.username === u && x.password === p);
  if(user){
    localStorage.setItem("loggedInUser", u);
    window.location.href = "home.html";
  } else {
    loginError.textContent = "Invalid username or password";
  }
};
