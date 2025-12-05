const btn = document.getElementById("resetBtn");
const msg = document.getElementById("resetMsg");
const emailInput = document.getElementById("resetEmail");

let cooldown = false;

btn.addEventListener("click", async () => {
  const email = emailInput.value.trim();
  msg.style.color = "red";

  if (!email) {
    msg.textContent = "Please enter an email.";
    return;
  }

  if (cooldown) return;

  try {
    await resetPassword(email);

    msg.style.color = "lightgreen";
    msg.textContent = "Reset link sent!";

    startCooldown();

  } catch (err) {
    msg.style.color = "red";
    msg.textContent = err.message || "Something went wrong";
  }
});

function startCooldown() {
  cooldown = true;
  let timeLeft = 30;

  btn.disabled = true;
  btn.style.opacity = "0.6";
  btn.textContent = "Wait";    // 🔥 Only “WAIT” here

  msg.style.color = "#c7d2e0";
  msg.textContent = `You can send again in ${timeLeft}s`;

  const timer = setInterval(() => {
    timeLeft--;
    msg.textContent = `You can send again in ${timeLeft}s`; // 🔥 Countdown only here

    if (timeLeft <= 0) {
      clearInterval(timer);
      cooldown = false;

      btn.disabled = false;
      btn.style.opacity = "1";
      btn.textContent = "Send Reset Link"; // restore after cooldown

      msg.textContent = "";
    }
  }, 1000);
}
