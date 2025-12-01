// home.js
const logoutBtn = document.getElementById("logoutBtn");
const profileName = document.getElementById("profileName");
const profileEmail = document.getElementById("profileEmail");
const profilePic = document.getElementById("profilePic");

// Wait a short time for firebaseAuth to be available
function populateProfile() {
  const auth = window.firebaseAuth;
  if (!auth || !auth.currentUser) {
    // try again shortly (auth state changes will redirect if unauthenticated)
    setTimeout(populateProfile, 100);
    return;
  }

  const user = auth.currentUser;
  profileName.textContent = user.displayName || "Unknown User";
  profileEmail.textContent = user.email || "";
  profilePic.src = user.photoURL || "https://via.placeholder.com/64";
}

populateProfile();

logoutBtn.onclick = async () => {
  if (window.firebaseLogout) {
    await window.firebaseLogout();
  } else {
    // fallback: try signOut directly if auth is available
    if (window.firebaseAuth) {
      try {
        await window.firebaseAuth.signOut();
      } catch (e) { /* ignore */ }
    }
    window.location.href = "index.html";
  }
};
