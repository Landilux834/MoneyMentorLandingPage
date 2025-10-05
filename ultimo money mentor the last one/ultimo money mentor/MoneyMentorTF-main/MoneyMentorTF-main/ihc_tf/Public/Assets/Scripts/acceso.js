document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM completamente cargado");

  // Cambiar entre las vistas
  const container = document.querySelector(".container");
  const toggleSignUp = document.querySelector("#toggle-sign-up");
  const toggleSignIn = document.querySelector("#toggle-sign-in");

  toggleSignUp.addEventListener("click", () => {
    container.classList.add("sign-up-mode");
  });

  toggleSignIn.addEventListener("click", () => {
    container.classList.remove("sign-up-mode");
  });

  // Manejador de registro
  const signUpForm = document.querySelector("#sign-up-form");
  signUpForm.addEventListener("submit", (event) => {
    event.preventDefault();
    console.log("Evento de registro activado");

    const username = document.querySelector("#register-username").value.trim();
    const email = document.querySelector("#register-email").value.trim();
    const password = document.querySelector("#register-password").value;

    if (username && email && password) {
      if (localStorage.getItem(username)) {
        alert("Este usuario ya está registrado. Por favor, inicia sesión.");
      } else {
        localStorage.setItem(username, JSON.stringify({ email, password }));
        alert("Registro exitoso. Ahora puedes iniciar sesión.");
        signUpForm.reset();
      }
    } else {
      alert("Por favor, completa todos los campos.");
    }
  });

  // Manejador de inicio de sesión
  const signInForm = document.querySelector("#sign-in-form");
  signInForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const username = document.querySelector("#login-username").value.trim();
    const password = document.querySelector("#login-password").value.trim();

    const storedUser = localStorage.getItem(username);
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      if (userData.password === password) {
        localStorage.setItem("currentUser", username);
        alert("Inicio de sesión exitoso.");
        window.location.href = "menu.html";
      } else {
        alert("Contraseña incorrecta.");
      }
    } else {
      alert("Usuario no encontrado. Por favor, regístrate.");
    }
  });
});



function simulateLogin(platform) {
  switch (platform) {
      case 'Google':
          window.location.href = "https://accounts.google.com/o/oauth2/v2/auth";
          break;
      case 'Facebook':
          window.location.href = "https://www.facebook.com/v12.0/dialog/oauth";
          break;
      case 'Twitter':
          window.location.href = "https://twitter.com/i/oauth2/authorize";
          break;
      case 'Linkedin':
          window.location.href = "https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=SIMULATED_CLIENT_ID&redirect_uri=https://mi-simulacion.com/linkedin/callback&scope=r_liteprofile%20r_emailaddress";
          break;
  }
}
