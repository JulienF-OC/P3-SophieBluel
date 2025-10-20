let allWorks = [];

async function getWorks() {
  const url = "http://localhost:5678/api/works";
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Response status: ${response.status}`);
    allWorks = await response.json();
    displayWorks(allWorks);
  } catch (error) {
    console.error(error.message);
  }
}

function displayWorks(works) {
  const gallery = document.querySelector(".gallery");
  gallery.innerHTML = "";
  works.forEach((work) => setFigure(work));
}

function setFigure(data) {
  const figure = document.createElement("figure");
  figure.innerHTML = `<img src="${data.imageUrl}" alt="${data.title}" />
  <figcaption>${data.title}</figcaption>`;
  document.querySelector(".gallery").append(figure);
}

async function getCategories() {
  const url = "http://localhost:5678/api/categories";
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Response status: ${response.status}`);
    const json = await response.json();
    setAllFilter(); // bouton "Tous"
    json.forEach((cat) => setDiv(cat));
  } catch (error) {
    console.error(error.message);
  }
}

function setAllFilter() {
  const container = document.querySelector(".div-container");
  const allBtn = document.createElement("div");
  allBtn.textContent = "Tous";
  allBtn.classList.add("filter-btn", "active");
  allBtn.addEventListener("click", () => {
    setActiveFilter(allBtn);
    displayWorks(allWorks);
  });
  container.appendChild(allBtn);
}

function setDiv(data) {
  const div = document.createElement("div");
  div.textContent = data.name;
  div.dataset.id = data.id;

  div.addEventListener("click", () => {
    setActiveFilter(div);
    filterWorks(data.id);
  });

  document.querySelector(".div-container").append(div);
}

function filterWorks(categoryId) {
  const filtered = allWorks.filter((work) => work.categoryId === categoryId);
  displayWorks(filtered);
}

function setActiveFilter(selectedBtn) {
  const allBtns = document.querySelectorAll(".div-container div");
  allBtns.forEach((btn) => btn.classList.remove("active"));
  selectedBtn.classList.add("active");
}

// 🚀 Initialisation
getWorks();
getCategories();

const token = localStorage.getItem("token");
const icon = document.getElementById("userIcon");

if (token) {
  console.log("Connexion utilisateur réussie");
  afficherModeEdition();
  icon.style.display = "inline";
} else {
  console.log("Echec de la connexion utilisateur");
  icon.style.display = "none";
}

function afficherModeEdition() {
  const body = document.querySelector("body");

  // Bande noire en haut
  const banner = document.createElement("div");
  banner.classList.add("edit-mode-banner");
  banner.textContent = "Mode édition";
  body.prepend(banner);

  // Modifier le lien login en logout
  const loginLink = document.querySelector(".login-li");
  loginLink.textContent = "Log out";
  loginLink.addEventListener("click", () => {
    localStorage.removeItem("token");
    window.location.reload();
  });
}
