const list = document.getElementById("tutorialList");
const loading = document.getElementById("loading");
const noVideos = document.getElementById("not-found");

fetch("https://tu-worker.cloudflareworkers.com")
  .then((res) => res.json())
  .then((data) => {
    loading.style.display = "none";

    if (data.length === 0) {
      noVideos.style.display = "flex";
      return;
    }

    data.forEach((video) => {
      const article = document.createElement("article");
      article.className = "card glass";
      article.dataset.level = video.level || "no-category";

      article.innerHTML = `
        <h3>${video.title}</h3>
        ${video.thumbnail ? `<img src="${video.thumbnail}" alt="miniatura">` : ""}
        <p>Publicado: ${video.published}</p>
        <div class="actions">
          <a class="btn btn-primary" href="${video.link}" target="_blank" rel="noopener">Ver video</a>
        </div>
      `;

      list.appendChild(article);
    });
  })
  .catch((err) => {
    loading.style.display = "none";
    noVideos.style.display = "flex";
    noVideos.style.flexDirection = "column";
    noVideos.style.alignItems = "center";
    console.error(err);
  });
