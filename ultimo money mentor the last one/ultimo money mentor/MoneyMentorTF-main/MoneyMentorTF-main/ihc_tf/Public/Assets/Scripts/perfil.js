document.addEventListener('DOMContentLoaded', () => {
  /* ======================================================
     1. Mostrar / Ocultar Historial
  ====================================================== */
  const showHistorialButton = document.getElementById('show-historial');
  const returnProfileButton = document.getElementById('return-profile');
  const historialSection = document.getElementById('historial');
  const profileSection = document.querySelector('.containerProfile');

  if (showHistorialButton) {
    showHistorialButton.addEventListener('click', (e) => {
      e.preventDefault();
      profileSection.style.display = 'none';
      historialSection.style.display = 'block';
      historialSection.scrollIntoView({ behavior: 'smooth' });

      populateHistorialTable();
    });
  }

  if (returnProfileButton) {
    returnProfileButton.addEventListener('click', (e) => {
      e.preventDefault();
      historialSection.style.display = 'none';
      profileSection.style.display = 'flex';
      profileSection.scrollIntoView({ behavior: 'smooth' });
    });
  }

  function populateHistorialTable() {
    const historialBody = document.getElementById('historial-body');
    historialBody.innerHTML = '';

    const activities = [
      { descripcion: 'Ingreso', monto: 500, fecha: '21/09/2024', total: 500 },
      { descripcion: 'Egreso', monto: 100, fecha: '05/10/2024', total: 400 },
      { descripcion: 'Egreso', monto: 150, fecha: '11/10/2024', total: 250 },
      { descripcion: 'Ingreso', monto: 300, fecha: '30/10/2024', total: 550 },
      { descripcion: 'Ingreso', monto: 250, fecha: '19/11/2024', total: 800 },
    ];

    activities.forEach((activity) => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td class="${activity.descripcion === 'Egreso' ? 'danger' : 'primary'}">${activity.descripcion}</td>
        <td>${activity.monto}</td>
        <td>${activity.fecha}</td>
        <td class="${activity.total < 0 ? 'danger' : 'success'}">${activity.total}</td>
      `;
      historialBody.appendChild(tr);
    });
  }

  /* ======================================================
     2. Cargar datos del usuario
  ====================================================== */
  const currentUser = localStorage.getItem("currentUser");

  if (!currentUser) {
    window.location.href = "index.html";
    return;
  }

  const usernameDisplay = document.getElementById("username-display");
  const userFullname = document.getElementById("user-fullname");
  const userEmail = document.getElementById("user-email");
  const userPhone = document.getElementById("user-phone");
  const profilePic = document.getElementById("profile-pic");   // <-- FOTO PERFIL
  const profileInput = document.getElementById("profileImage"); // <-- INPUT FILE

  if (usernameDisplay) usernameDisplay.textContent = currentUser;
  if (userFullname) userFullname.textContent = currentUser;

  const storedUser = localStorage.getItem(currentUser);
  let userData = storedUser ? JSON.parse(storedUser) : {};

  if (userData.email && userEmail) userEmail.textContent = userData.email;
  if (userData.phone && userPhone) userPhone.textContent = userData.phone;

  // cargar foto desde localStorage si existe
  if (userData.profileImage && profilePic) {
    profilePic.src = userData.profileImage;
  }

  /* ======================================================
     3. Inputs de edición
  ====================================================== */
  const inputFullname = document.getElementById("fullname");
  const inputEmail = document.getElementById("email");
  const inputPhone = document.getElementById("phone");
  const inputAddress = document.getElementById("address");
  const inputPassword = document.getElementById("password");
  
  // precargar en inputs
  if (userData.fullname) inputFullname.value = userData.fullname;
  if (userData.email) inputEmail.value = userData.email;
  if (userData.phone) inputPhone.value = userData.phone;
  if (userData.address) inputAddress.value = userData.address;
  if (userData.password) inputPassword.value = userData.password;
  
  // detectar clicks en botones lápiz dentro del form
  document.querySelectorAll(".edit-details .input-wrapper button").forEach((button) => {
    button.addEventListener("click", () => {
      // leer valores actuales de inputs
      const newFullname = inputFullname.value.trim();
      const newEmail = inputEmail.value.trim();
      const newPhone = inputPhone.value.trim();
      const newAddress = inputAddress.value.trim();
      const newPassword = inputPassword.value.trim();
  
      // actualizar objeto userData
      userData.fullname = newFullname;
      userData.email = newEmail;
      userData.phone = newPhone;
      userData.address = newAddress;
      userData.password = newPassword;
  
      // guardar en localStorage
      localStorage.setItem(currentUser, JSON.stringify(userData));
  
      // refrescar la vista izquierda
      if (userFullname) userFullname.textContent = newFullname || currentUser;
      if (userEmail) userEmail.textContent = newEmail || "No registrado";
      if (userPhone) userPhone.textContent = newPhone || "No registrado";
  
      alert("Datos actualizados correctamente");
    });
  });

  /* ======================================================
     4. Subir foto de perfil (solo vista previa)
  ====================================================== */
  if (profileInput) {
    profileInput.addEventListener("change", function(event) {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
          const imageData = e.target.result;
          profilePic.src = imageData;

          // guardar imagen en localStorage dentro del userData
          userData.profileImage = imageData;
          localStorage.setItem(currentUser, JSON.stringify(userData));
        };
        reader.readAsDataURL(file);
      }
    });
  }
});
