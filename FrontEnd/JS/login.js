const form = document.querySelector(".log-form");

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  // Supprimer anciens messages d’erreur
  const oldError = document.querySelector(".error-message");
  if (oldError) oldError.remove();

  try {
    const response = await fetch("http://localhost:5678/api/users/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    console.log("Réponse API :", data);

    if (!response.ok) {
      throw new Error(data.message || "Identifiant ou mot de passe incorrect");
    }

    localStorage.setItem("token", data.token);
    console.log("Token sauvegardé :", localStorage.getItem("token"));

    window.location.href = "index.html";
  } catch (error) {
    const errorMsg = document.createElement("p");
    errorMsg.textContent = error.message;
    errorMsg.classList.add("error-message");
    errorMsg.style.color = "red";
    errorMsg.style.marginTop = "10px";
    form.appendChild(errorMsg);
    console.error(error);
  }
});

const token = localStorage.getItem("token");

if (token) {
  console.log("Connexion utilisateur réussie");
  afficherModeEdition();
} else {
  console.log("Echec de la connexion utilisateur");
}

function afficherModeEdition() {
  const body = document.querySelector("body");

  // Bande noire en haut
  const banner = document.createElement("div");
  banner.classList.add("edit-mode-banner");

  const icon = document.createElement("span");
  icon.classList.add("edit-icon");
  icon.innerHTML = '<i class="fa-solid fa-pen-to-square"></i>';

  const text = document.createElement("span");
  text.textContent = "Mode édition";

  banner.appendChild(icon);
  banner.appendChild(text);
  body.prepend(banner);

  // Modifier le lien login en logout
  const loginLink = document.querySelector(".login-li");
  loginLink.textContent = "Log out";
  loginLink.addEventListener("click", () => {
    localStorage.removeItem("token");
    window.location.reload();

    const projetModif = document.createElement("div");
    projetModif.classList.add("modif-projet");
    projetModif.textContent = "modifier";
    document.getElementById("Portfolio").append(projetModif);
  });
}
