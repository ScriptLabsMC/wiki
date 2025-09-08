const WORKER = "https://team.anthonyuribe3456.workers.dev";

function imgOrDefault(url) {
  if (!url || url === "null" || url === "undefined") return "/assets/img/svg/person.svg";
  return url;
}

function showOverview(member) {
  // No abrir otro modal si ya hay uno
  if (document.querySelector(".team-modal")) return;

  const modal = document.createElement("div");
  modal.className = "team-modal";
  modal.innerHTML = `
    <div class="modal-content glass">
      <button class="close-btn">&times;</button>
      <div class="avatar"><img src="${imgOrDefault(member.avatar)}" alt=""></div>
      <h2>${member.name}</h2>
      <p><em>${member.role || ""}</em></p>
      <p>${member.bio || ""}</p>
    </div>
  `;
  document.body.appendChild(modal);

  // Cerrar al click en botón
  modal.querySelector(".close-btn").onclick = () => modal.remove();

  // Cerrar al click fuera del contenido
  modal.onclick = (e) => {
    if (e.target === modal) modal.remove();
  };
}

async function loadTeam() {
  try {
    const res = await fetch(`${WORKER}/team`);
    if (!res.ok) { console.error("Error fetching team:", res.status); return; }

    const team = await res.json();
    const container = document.querySelector(".grid-3.team");
    if (!container) { console.error("Container not found"); return; }

    container.innerHTML = "";

    team.forEach(member => {
      const card = document.createElement("div");
      card.className = "card glass person";

      card.innerHTML = `
        <div class="avatar"><img src="${imgOrDefault(member.avatar)}" alt=""></div>
        <h3 style="font-family:cursive;font-size:20pt">${member.name}</h3>
        <p>${member.role || ""}</p>
      `;

      card.addEventListener("click", () => showOverview(member));
      container.appendChild(card);
    });

    // CTA card al final
    const ctaCard = document.createElement("div");
    ctaCard.className = "card glass";
    ctaCard.style.textAlign = "center";
    ctaCard.innerHTML = `
      <h3>¿Quieres formar parte de nuestro equipo?</h3>
      <p>Hey, ¿Quieres unirte a nuestro equipo de desarrollo? puedes llenar este 
      <a href="/pages/misc/form.html" style="color: var(--primary);"><strong>formulario</strong></a>.</p>
    `;
    container.appendChild(ctaCard);

  } catch (e) { console.error("Error loading team:", e); }
}

window.addEventListener("load", loadTeam);