const form = document.querySelector(".log-form");

form.addEventListener("submit", async (event) => {
  event.preventDefault();

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
      console.log("Réponse API :", data);

      localStorage.setItem("token", data.token);
      console.log("Token sauvegardé :", localStorage.getItem("token"));
      window.location.href = "index.html";
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
    console.error("Erreur :", error.message);
  }
});

const token = localStorage.getItem("token");

if (token) {
  console.log("Connexion utilisateur réussie");
} else {
  console.log("Echec de la connexion utilisateur");
}
