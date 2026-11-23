const params = new URLSearchParams(window.location.search);
const requestedRole = params.get("role");
const role = requestedRole === "faculty" ? "faculty" : "student";
const roleLabel = role === "faculty" ? "FACULTY PORTAL" : "STUDENT PORTAL";
const loginForm = document.querySelector("#portal-login-form");
const loginStatus = document.querySelector("#login-status");
const loginButton = document.querySelector("#login-submit");
const demoLink = document.querySelector("#open-portal-demo");

document.querySelector("#login-role-label").textContent = roleLabel;
document.querySelector("#login-title").textContent = role === "faculty" ? "Faculty sign in" : "Student sign in";
demoLink.href = `${role}-portal.html?demo=1`;

loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!loginForm.reportValidity()) return;
  loginButton.disabled = true;
  loginStatus.textContent = "Verifying your account…";
  try {
    const user = await CampusApi.login(loginForm.elements.email.value.trim(), loginForm.elements.password.value);
    if (user.user.role !== role) {
      await CampusApi.logout();
      throw new Error("This account cannot enter the selected portal.");
    }
    window.location.href = `${role}-portal.html`;
  } catch (error) {
    loginStatus.textContent = error.message || "Sign-in failed. Check your connection and account details.";
  } finally {
    loginButton.disabled = false;
  }
});