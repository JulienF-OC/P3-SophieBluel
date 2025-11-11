const form = document.querySelector(".log-form"); // Ajout d'une constante prenant le formulaire

form.addEventListener("submit", async (event) => {
  event.preventDefault(); // On supprime l'événement par défault

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const oldError = document.querySelector(".error-message");
  if (oldError) oldError.remove();

  try {
    const response = await fetch("http://localhost:5678/api/users/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (response.status === 200) {
      const data = await response.json();
      localStorage.setItem("token", data.token); // Ici, on va stocker le token dans le localStorage
      window.location.href = "index.html"; // On va rediriger ici l'utilisateur sur la page d'accueil si il y a connexion
    } else if (response.status === 401) {
      throw new Error(
        "Erreur serveur (401) : Les éléments d'authentification sont incorrects"
      );
    } else if (response.status === 404) {
      throw new Error(
        "Erreur serveur (404) : L'adresse mail utilisée est incorrecte"
      );
    } else {
      throw new Error(`Erreur inattendue (${response.status})`);
    }
  } catch (error) {
    // On va créer ici un nouvel élément qui affichera les messages d'erreurs sous le formulaire
    const errorMsg = document.createElement("p");
    errorMsg.classList.add("error-message-login");
    errorMsg.textContent = error.message;
    form.appendChild(errorMsg);
  }
});
