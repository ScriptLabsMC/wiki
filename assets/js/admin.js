// Verificar login
if (sessionStorage.getItem("adminLoggedIn") !== "true") {
	window.location.href = "../login.html";
}

// Datos dummy de ejemplo
let teamMembers = [
	{ id: 1, name: "a.j.r._.uribe", role: "Lead Dev", avatar: "🛠️" },
	{ id: 2, name: "Colaborador", role: "UI / Docs", avatar: "🧰" },
	{ id: 3, name: "Mentor", role: "Tutoriales", avatar: "🧠" }
];

// Renderizar miembros
function renderTeam() {
	const container = document.getElementById("teamList");
	container.innerHTML = "";
	teamMembers.forEach((member) => {
		const card = document.createElement("div");
		card.className = "member-card";

		card.innerHTML = `
      <div class="avatar">${member.avatar}</div>
      <h3>${member.name}</h3>
      <p>${member.role}</p>
      <div class="actions">
        <button class="edit">Editar</button>
        <button class="delete">Borrar</button>
      </div>
    `;

		// Editar
		card.querySelector(".edit").addEventListener("click", () => {
			const newName = prompt("Nuevo nombre:", member.name);
			const newRole = prompt("Nuevo rol:", member.role);
			if (newName) member.name = newName;
			if (newRole) member.role = newRole;
			renderTeam();
		});

		// Borrar
		card.querySelector(".delete").addEventListener("click", () => {
			if (confirm(`Eliminar a ${member.name}?`)) {
				teamMembers = teamMembers.filter((m) => m.id !== member.id);
				renderTeam();
			}
		});

		container.appendChild(card);
	});
}

// Agregar nuevo miembro
document.getElementById("addMemberBtn").addEventListener("click", () => {
	const name = prompt("Nombre del miembro:");
	const role = prompt("Rol del miembro:");
	const avatar = prompt("Avatar (emoji o iniciales):");
	if (name && role) {
		const newId = Math.max(...teamMembers.map((m) => m.id)) + 1;
		teamMembers.push({ id: newId, name, role, avatar: avatar || "👤" });
		renderTeam();
	}
});

// Inicializar
renderTeam();
