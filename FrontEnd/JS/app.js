let allWorks = [];

async function getWorks() {
  const url = "http://localhost:5678/api/works";
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Respsonse status: ${response.status}`);
    }

    const json = await response.json();
    allWorks = json; // on stocke tout ici
    displayWorks(allWorks); // on affiche tout au début
  } catch (error) {
    console.error(error.message);
  }
}

getWorks();

function setFigure(data) {
  const figure = document.createElement("figure");

  figure.innerHTML = `<img src=${data.imageUrl} alt=${data.title} />
            <figcaption>${data.title}</figcaption>`;

  document.querySelector(".gallery").append(figure);
}

async function getCategories() {
  const url = "http://localhost:5678/api/categories";
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Respsonse status: ${response.status}`);
    }

    const json = await response.json();
    console.log(json);
    for (let i = 0; i < json.length; i++) {
      setDiv(json[i]);
    }
  } catch (error) {
    console.error(error.message);
  }
}

getCategories();

function setDiv(data) {
  const div = document.createElement("div");
  div.textContent = data.name;
  div.dataset.id = data.id; // on stocke l'id de la catégorie

  // Ajout du clic sur chaque div
  div.addEventListener("click", () => {
    filterWorks(data.id);
  });

  document.querySelector(".div-container").append(div);
}

function displayWorks(works) {
  const gallery = document.querySelector(".gallery");
  gallery.innerHTML = ""; // on vide avant de réafficher
  works.forEach((work) => setFigure(work));
}

function filterWorks(categoryId) {
  if (!categoryId) {
    displayWorks(allWorks); // si aucune catégorie, on affiche tout
  } else {
    const filtered = allWorks.filter((work) => work.categoryId === categoryId);
    displayWorks(filtered);
  }
}
