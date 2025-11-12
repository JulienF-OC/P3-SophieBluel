let allWorks = []; // On créer un variable qui va stocker les éléments de la gallerie
const gallery = document.querySelector(".gallery"); // On crée tout de suite une constante dont on va beaucoup se servir, qui prend la gallerie

// Ici, création d'une fenêtre popup qui s'ouvre lors de la detection d'un message d'erreur
function showError(message, containerSelector = "body") {
  const oldError = document.querySelector(".error-popup");
  if (oldError) oldError.remove();
  const errorDiv = document.createElement("div");
  errorDiv.classList.add("error-popup");
  errorDiv.textContent = message;
  const container = document.querySelector(containerSelector) || document.body;
  container.appendChild(errorDiv);
}

//Ici c'est la fonction qui va appeler L'API pour trouver les travaux
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
    showError(error.message);
  }
}

//Cette fonction permets l'affichage des travaux
function displayWorks(works) {
  gallery.innerHTML = "";
  works.forEach((work) => setFigure(work));
}

//Ici la fonction permets de générer le contenu HTML des travaux
function setFigure(data) {
  const figure = document.createElement("figure");
  figure.innerHTML = `<img src="${data.imageUrl}" alt="${data.title}" />
  <figcaption>${data.title}</figcaption>`;
  gallery.append(figure);
}

// On va récuperer ici les catégories via l'API
async function getCategory() {
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
      throw new Error(`Erreur inattendue (${response.status})`);
    }
  } catch (error) {
    showError(error.message);
  }
}

//Cette fonction sert a créer le bouton de filtre "Tous"
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

//Ici, on va créer les autres boutons de filtre en récupérant les data des catégories
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

//On va mettre en place le fonctionnement des filtres
function filterWorks(categoryId) {
  const filtered = allWorks.filter((work) => work.categoryId === categoryId);
  displayWorks(filtered);
}

//Cette fonction permet d'ajouter la classe active au filtre selectionné
function setActiveFilter(selectedBtn) {
  const allBtns = document.querySelectorAll(".div-container div");
  allBtns.forEach((btn) => btn.classList.remove("active"));
  selectedBtn.classList.add("active");
}

getWorks();
getCategory();

const token = localStorage.getItem("token"); // On stocke le token de connexion

if (token) {
  ShowLogOut(); // Si connexion, on appelle la fonction qui change le nom "Login" en "Logout"
  document.body.classList.add("connected"); // On ajoute la classe connecter au body pour ajuster les éléments qui s'ajoute lors de la connexion
  document.querySelector(".edit-mode").style.display = "flex";
  document.querySelector(".edit-project").style.display = "inline";
  document.querySelector(".div-container").style.display = "none";
} else {
  document.body.classList.remove("connected");
}

//Ici, on va changer le nom "Login" en "Logout"
function ShowLogOut() {
  const loginLink = document.querySelector(".login-li");
  loginLink.textContent = "logout";
  loginLink.addEventListener("click", () => {
    localStorage.removeItem("token"); // Ici on va retirer le token de connexion pour se déconnecter au clic sur le bouton "Logout"
    window.location.reload();
  });
}

const modal = document.getElementById("modaleProjets");
const open = document.getElementById("ouvrirModale");
const close = document.getElementById("fermerModale");
const modalForm = document.getElementById("ajoutForm");
const modalGallery = document.getElementById("gallery-modale");

//Permets d'ouvrir la modale au clic sur "modifier"
document.getElementById("ouvrirModale").addEventListener("click", () => {
  modal.showModal();
  getWorksModal();
});

close.addEventListener("click", () => {
  modal.close();
  const uploadZone = document.querySelector(".upload-zone");
  //Purge complète de la zone d'upload
  preview.src = "";
  preview.style.display = "none";
  preview.style.display = "none";
  uploadZone.classList.remove("preview-active");
});

//Cette fonction permets d'appeler les travaux dans l'API
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
    showError(error.message);
  }
}

//On permets ici l'affichage des travaux
function displayWorksModal(works) {
  const galleryModal = document.querySelector("#gallery-modale");
  galleryModal.innerHTML = "";

  works.forEach((work) => setFigureModal(work, galleryModal));
}

//On ajoute les éléments HTML des travaux
function setFigureModal(data) {
  const figure = document.createElement("figure");
  figure.classList.add("figure-modale");
  figure.innerHTML = `
    <img src="${data.imageUrl}" alt="${data.title}">
    <button class="delete-btn" data-id="${data.id}">
      <i class="fa-solid fa-trash-can"></i>
    </button>
  `;

  //On ici supprimer les éléments au clic sur l'icone de poubelle
  figure.querySelector(".delete-btn").addEventListener("click", () => {
    deleteWork(data.id);
  });

  document.querySelector("#gallery-modale").append(figure);
}

//On va permettre ici la supression des éléments via un appel à l'API
async function deleteWork(id) {
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
    showError(error.message);
  }
}

//On va permettre ici l'ajout d'éléments via un appel à l'API
async function addWork(formData) {
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
    showError(error.message);
  }
}

const addForm = document.getElementById("ajoutForm");
const addPhotoBtn = document.getElementById("ajouterPhotoBtn");
const separationModale = document.getElementById("separationModale");
const galleryModal = document.getElementById("gallery-modale");
const BackToGallery = document.getElementById("retourGalerie");

//Ici, on permet au clic sur le bouton d'afficher le formulaire d'ajout en cachant le reste
addPhotoBtn.addEventListener("click", () => {
  galleryModal.style.display = "none";
  addPhotoBtn.style.display = "none";
  addForm.style.display = "block";
  modaleTitre.textContent = "Ajout photo";
  separationModale.style.display = "none";
  fillCategory();
});

const uploadZone = document.getElementById("uploadZone");
const browseBtn = document.getElementById("btnParcourir");
const inputImage = document.getElementById("image");
const previewImage = document.getElementById("preview");

//On ajoute ici l'événement de retour à la gallerie
BackToGallery.addEventListener("click", () => {
  const uploadZone = document.querySelector(".upload-zone");
  addForm.style.display = "none";
  galleryModal.style.display = "grid";
  addPhotoBtn.style.display = "block";
  modaleTitre.textContent = "Galerie photo";
  separationModale.style.display = "block";
  preview.src = "";
  preview.style.display = "none";
  preview.style.display = "none";
  uploadZone.classList.remove("preview-active");
});

//Ici, on créer la fonction d'ajout
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
  separationModale.style.display = "block";
});

//On appel ici l'API pour ajouter les catégories dans la selection du formulaire
async function fillCategory() {
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
    showError(error.message);
  }
}

//On permet ici l'ajout d'image
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

//On crée ici une fonction qui va vérifier que les champs sont bien remplis
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
