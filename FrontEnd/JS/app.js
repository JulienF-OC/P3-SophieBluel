let allWorks = [];

async function getWorks() {
  const url = "http://localhost:5678/api/works";
  try {
    const response = await fetch(url);
    if (response.status === 200) {
      const allWorks = await response.json();
      displayWorks(allWorks);
    } else if (response.status === 500) {
      throw new Error(
        "Erreur serveur (500) : Une erreur interne est survenue."
      );
    } else {
      throw new Error(`Erreur inattendue (${response.status})`);
    }
  } catch (error) {
    console.error("Erreur :", error.message);
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
    setAllFilter();
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

getWorks();
getCategories();

const token = localStorage.getItem("token");

if (token) {
  console.log("Connexion utilisateur réussie");
  afficherLogOut();
  document.querySelector(".edit-mode").style.display = "flex";
  document.querySelector(".edit-project").style.display = "inline";
  document.querySelector(".div-container").style.display = "none";
} else {
  console.log("Echec de la connexion utilisateur");
}

function afficherLogOut() {
  const loginLink = document.querySelector(".login-li");
  loginLink.textContent = "Log out";
  loginLink.addEventListener("click", () => {
    localStorage.removeItem("token");
    window.location.reload();
  });
}

const modale = document.getElementById("modaleProjets");
const ouvrir = document.getElementById("ouvrirModale");
const fermer = document.getElementById("fermerModale");
const modaleForm = document.getElementById("ajoutForm");
const modaleGallery = document.getElementById("gallery-modale");

document.getElementById("ouvrirModale").addEventListener("click", () => {
  const modale = document.getElementById("modaleProjets");
  modale.showModal();
  getWorksModale();
});
fermer.addEventListener("click", () => modale.close());

async function getWorksModale() {
  const urlWorks = "http://localhost:5678/api/works";
  try {
    const response = await fetch(urlWorks);
    if (!response.ok) throw new Error(`Response status: ${response.status}`);
    const allWorks = await response.json();
    displayWorksModale(allWorks);
  } catch (error) {
    console.error(error.message);
  }
}

function displayWorksModale(works) {
  const galleryModale = document.querySelector("#gallery-modale");
  galleryModale.innerHTML = "";

  works.forEach((work) => setFigureModale(work, galleryModale));
}

function setFigureModale(data) {
  const figure = document.createElement("figure");
  figure.classList.add("figure-modale");

  figure.innerHTML = `
    <img src="${data.imageUrl}" alt="${data.title}">
    <button class="delete-btn" data-id="${data.id}">
      <i class="fa-solid fa-trash-can"></i>
    </button>
  `;

  figure.querySelector(".delete-btn").addEventListener("click", () => {
    deleteWork(data.id);
  });

  document.querySelector("#gallery-modale").append(figure);
}

async function deleteWork(id) {
  const token = localStorage.getItem("token");

  if (!token) {
    alert("Vous devez être connecté pour supprimer un projet.");
    return;
  }

  try {
    const response = await fetch(`http://localhost:5678/api/works/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        accept: "*/*",
      },
    });

    if (response.ok) {
      console.log(`Projet ${id} supprimé avec succès.`);
      getWorksModale();
    } else {
      console.error(`Erreur: ${response.status}`);
    }
  } catch (error) {
    console.error("Erreur lors de la suppression:", error);
  }
}

async function addWork(formData) {
  const token = localStorage.getItem("token");
  if (!token) {
    alert("Vous devez être connecté pour ajouter un projet.");
    return;
  }

  try {
    const response = await fetch("http://localhost:5678/api/works", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        accept: "*/*",
      },
      body: formData,
    });

    if (response.ok) {
      console.log("Projet ajouté avec succès.");
      getWorksModale();
    } else {
      console.error(`Erreur: ${response.status}`);
    }
  } catch (error) {
    console.error("Erreur lors de l'ajout :", error);
  }
}

const ajoutForm = document.getElementById("ajoutForm");
const ajouterPhotoBtn = document.getElementById("ajouterPhotoBtn");

const galleryModale = document.getElementById("gallery-modale");
const retourGalerie = document.getElementById("retourGalerie");

ajouterPhotoBtn.addEventListener("click", () => {
  galleryModale.style.display = "none";
  ajouterPhotoBtn.style.display = "none";
  ajoutForm.style.display = "block";
  modaleTitre.textContent = "Ajout photo";
  const separationModale = document.getElementById("separationModale");
  separationModale.style.display = "none";
  remplirCategoriesForm();
});

const uploadZone = document.getElementById("uploadZone");
const btnParcourir = document.getElementById("btnParcourir");
const inputImage = document.getElementById("image");
const previewImage = document.getElementById("preview");

inputImage.addEventListener("change", () => {
  const file = inputImage.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      preview.src = e.target.result;
      preview.style.display = "block";
      uploadZone.querySelector("i").style.display = "none";
      uploadZone.querySelector("label").style.display = "none";
      uploadZone.querySelector("p").style.display = "none";
    };
    reader.readAsDataURL(file);
  }
});

retourGalerie.addEventListener("click", () => {
  const uploadZone = document.querySelector(".upload-zone");
  ajoutForm.style.display = "none";
  galleryModale.style.display = "grid";
  ajouterPhotoBtn.style.display = "block";
  modaleTitre.textContent = "Galerie photo";
  separationModale.style.display = "block";
  preview.src = "";
  preview.style.display = "none";
  preview.src = "";
  preview.style.display = "none";
  uploadZone.classList.remove("preview-active");
});

ajoutForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const modaleTitre = document.getElementById("modaleTitre");
  const imageInput = document.getElementById("image");
  const titreInput = document.getElementById("titre");
  const categorySelect = document.getElementById("category");

  if (!imageInput.files[0] || !titreInput.value || !categorySelect.value) {
    alert("Veuillez remplir tous les champs avant de valider.");
    return;
  }

  const formData = new FormData();
  formData.append("image", imageInput.files[0]);
  formData.append("title", titreInput.value);
  formData.append("category", categorySelect.value);

  await addWork(formData);

  ajoutForm.reset();
  ajoutForm.style.display = "none";
  galleryModale.style.display = "grid";
  ajouterPhotoBtn.style.display = "block";
});

async function remplirCategoriesForm() {
  try {
    const response = await fetch("http://localhost:5678/api/categories");
    if (!response.ok) throw new Error(`Erreur: ${response.status}`);

    const categories = await response.json();
    const select = document.getElementById("category");

    select.innerHTML = '<option value=""></option>';

    categories.forEach((cat) => {
      const option = document.createElement("option");
      option.value = cat.id;
      option.textContent = cat.name;
      select.appendChild(option);
    });
  } catch (error) {
    console.error("Erreur lors du chargement des catégories:", error);
  }
}

inputImage.addEventListener("change", () => {
  const file = inputImage.files[0];
  const uploadZone = document.querySelector(".upload-zone");
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      preview.src = e.target.result;
      preview.style.display = "block";
      uploadZone.classList.add("preview-active");
    };
    reader.readAsDataURL(file);
  }
});
