let allWorks = [];

async function getWorks() {
  const url = "http://localhost:5678/api/works";
  try {
    const response = await fetch(url);
    if (response.status === 200) {
      allWorks = await response.json();
      displayWorks(allWorks);
    } else if (response.status === 500) {
      throw new Error(
        "Erreur serveur (500) : Une erreur interne est survenue."
      );
    } else {
      throw new Error(`Erreur inattendue (${response.status})`);
    }
  } catch (error) {
    console.error(" Erreur :", error.message);
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
    if (response.status === 200) {
      const json = await response.json();
      setAllFilter();
      json.forEach((cat) => setFilter(cat));
    } else if (response.status === 500) {
      throw new Error(
        "Erreur serveur (500) : Une erreur interne est survenue."
      );
    } else {
      // Pour tout autre code inattendu
      throw new Error(`Erreur inattendue (${response.status})`);
    }
  } catch (error) {
    console.error(" Erreur :", error.message);
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

function setFilter(data) {
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
  ShowLogOut();
  document.body.classList.add("connected");
  document.querySelector(".edit-mode").style.display = "flex";
  document.querySelector(".edit-project").style.display = "inline";
  document.querySelector(".div-container").style.display = "none";
} else {
  console.log("Echec de la connexion utilisateur");
  document.body.classList.remove("connected");
}

function ShowLogOut() {
  const loginLink = document.querySelector(".login-li");
  loginLink.textContent = "logout";
  loginLink.addEventListener("click", () => {
    localStorage.removeItem("token");
    window.location.reload();
  });
}

const modal = document.getElementById("modaleProjets");
const open = document.getElementById("ouvrirModale");
const close = document.getElementById("fermerModale");
const modalForm = document.getElementById("ajoutForm");
const modalGallery = document.getElementById("gallery-modale");

document.getElementById("ouvrirModale").addEventListener("click", () => {
  const modal = document.getElementById("modaleProjets");
  modal.showModal();
  getWorksModal();
});
close.addEventListener("click", () => modal.close());

async function getWorksModal() {
  const urlWorks = "http://localhost:5678/api/works";
  try {
    const response = await fetch(urlWorks);
    if (response.status === 200) {
      const allWorks = await response.json();
      displayWorksModal(allWorks);
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
function displayWorksModal(works) {
  const galleryModal = document.querySelector("#gallery-modale");
  galleryModal.innerHTML = "";

  works.forEach((work) => setFigureModal(work, galleryModal));
}

function setFigureModal(data) {
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

    if (response.status === 200 || response.status === 204) {
      console.log(`Projet ${id} supprimé avec succès.`);
      getWorksModal();
      getWorks();
    } else if (response.status === 401) {
      throw new Error(
        "Erreur serveur (401) : Vous n'êtes pas autorisé à supprimer cet élément."
      );
    } else if (response.status === 500) {
      throw new Error(
        "Erreur serveur (500) : Une erreur du serveur est survenue."
      );
    } else {
      throw new Error(`Erreur inattendue (${response.status})`);
    }
  } catch (error) {
    console.error("Erreur :", error.message);
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

    if (response.status === 201) {
      console.log("Projet ajouté avec succès.");
      getWorksModal();
      getWorks();
    } else if (response.status === 400) {
      throw new Error(
        "Erreur serveur (400) : Une erreur dans la requete est survenue."
      );
    } else if (response.status === 401) {
      throw new Error(
        "Erreur serveur (401) : Vous nêtes pas autorisé à ajouter un élément."
      );
    } else if (response.status === 500) {
      throw new Error(
        "Erreur serveur (500) : Une erreur du serveur est survenue."
      );
    } else {
      throw new Error(`Erreur inattendue (${response.status})`);
    }
  } catch (error) {
    console.error("Erreur :", error.message);
  }
}

const addForm = document.getElementById("ajoutForm");
const addPhotoBtn = document.getElementById("ajouterPhotoBtn");

const galleryModal = document.getElementById("gallery-modale");
const BackToGallery = document.getElementById("retourGalerie");

addPhotoBtn.addEventListener("click", () => {
  galleryModal.style.display = "none";
  addPhotoBtn.style.display = "none";
  addForm.style.display = "block";
  modaleTitre.textContent = "Ajout photo";
  const separationModale = document.getElementById("separationModale");
  separationModale.style.display = "none";
  remplirCategoriesForm();
});

const uploadZone = document.getElementById("uploadZone");
const browseBtn = document.getElementById("btnParcourir");
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

BackToGallery.addEventListener("click", () => {
  const uploadZone = document.querySelector(".upload-zone");
  addForm.style.display = "none";
  galleryModal.style.display = "grid";
  addPhotoBtn.style.display = "block";
  modaleTitre.textContent = "Galerie photo";
  separationModale.style.display = "block";
  preview.src = "";
  preview.style.display = "none";
  preview.src = "";
  preview.style.display = "none";
  uploadZone.classList.remove("preview-active");
});

addForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const modalTitre = document.getElementById("modaleTitre");
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

  addForm.reset();
  addForm.style.display = "none";
  galleryModal.style.display = "grid";
  addPhotoBtn.style.display = "block";
});

async function remplirCategoriesForm() {
  try {
    const response = await fetch("http://localhost:5678/api/categories");
    if (response.status === 200) {
      const categories = await response.json();
      const select = document.getElementById("category");

      select.innerHTML = '<option value=""></option>';

      categories.forEach((cat) => {
        const option = document.createElement("option");
        option.value = cat.id;
        option.textContent = cat.name;
        select.appendChild(option);
      });
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

const checkBtn = document.getElementById("btnValider");
const titleInput = document.getElementById("titre");
const categorySelect = document.getElementById("category");
const imageInput = document.getElementById("image");

function checkInput() {
  const titleOK = titleInput.value.trim() !== "";
  const categoryOK = categorySelect.value.trim() !== "";
  const imageOK = imageInput.files.length > 0;

  if (titleOK && categoryOK && imageOK) {
    checkBtn.disabled = false;
    checkBtn.style.backgroundColor = "#1D6154";
  } else {
    checkBtn.disabled = true;
    checkBtn.style.backgroundColor = "#A7A7A7";
  }
}

titleInput.addEventListener("input", checkInput);
categorySelect.addEventListener("change", checkInput);
imageInput.addEventListener("change", checkInput);

BackToGallery.addEventListener("click", () => {
  addForm.reset();
  checkInput();
});

document.getElementById("ouvrirModale").addEventListener("click", () => {
  addForm.reset();
  checkInput();
});
