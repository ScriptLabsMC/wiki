const workerUrl = "https://getmods.anthonyuribe3456.workers.dev/"; // URL cloudfare worker

fetch(workerUrl)
  .then((res) => res.json())
  .then((body) => {
    const addonsDiv = document.getElementById("addons");
    if (!body.data || body.data.length === 0) return;

    body.data.forEach((mod) => {
      const downloadUrl = mod.latestFiles?.[0]?.downloadUrl || "#";
      const logoUrl = mod.logo?.url || "";
      const downloadCount = mod.downloadCount || 0;

      const card = document.createElement("article");
      card.className = "card glass addon";
      card.innerHTML = `
				<div class="thumb">
					<img src="${logoUrl}" alt="${mod.name}" />
				</div>
				<h3>${mod.name}</h3>
				<p>${mod.summary || ""}</p>
				<small>${downloadCount} descargas</small>
				<div class="actions">
					<a class="btn btn-primary" href="${downloadUrl}" target="_blank">Descargar</a>
					<a class="btn btn-ghost" href="${
            mod.links.websiteUrl || "#"
          }" target="_blank">Detalles</a>
				</div>
			`;
      addonsDiv.appendChild(card);
    });

    const loading = document.getElementById("loading");
    loading.style.display = "none";
  })
  .catch((err) => console.error(err));
