const form = document.getElementById("loginForm");
form.addEventListener("submit", (e) => {
	e.preventDefault();
	const pass = document.getElementById("password").value;

	// Temporal: se reemplazará con Worker/MongoDB
	if (pass === "1234") {
		sessionStorage.setItem("adminLoggedIn", "true");
		window.location.href = "../pages/admin.html";
	} else {
		alert("Contraseña incorrecta");
	}
});
