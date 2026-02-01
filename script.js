// 🔧 1) METS ICI L’ID DE TON GOOGLE SHEET
const SHEET_ID = "1PYXD5iDtxqYmMWwxf64FfOTyXpkRlUj4";

// URLs pour lire et écrire dans Google Sheets via l’API publique
const STOCKS_URL = `https://opensheet.elk.sh/${SHEET_ID}/STOCKS`;
const RESA_URL = `https://opensheet.elk.sh/${SHEET_ID}/RESERVATIONS`;

// Sélecteurs
const reserveButtons = document.querySelectorAll(".reserve-btn");
const formContainer = document.getElementById("reservation-form");
const confirmation = document.getElementById("confirmation");
const selectedTypeSpan = document.getElementById("selected-type");
const quantitySpan = document.getElementById("quantity");
const minusBtn = document.getElementById("minus");
const plusBtn = document.getElementById("plus");
const form = document.getElementById("form");

let selectedType = "";
let quantity = 1;

// 🔹 2) Charger les stocks depuis Google Sheets
async function loadStocks() {
  const response = await fetch(STOCKS_URL);
  const data = await response.json();

  data.forEach(item => {
    const type = item.Type;
    const stock = item.Stock;

    if (type === "Medium Beauté") {
      document.getElementById("stock-medium-beaute").textContent = stock;
    }
    if (type === "Large Beauté") {
      document.getElementById("stock-large-beaute").textContent = stock;
    }
    if (type === "Medium Nourriture") {
      document.getElementById("stock-medium-nourriture").textContent = stock;
    }
    if (type === "Large Nourriture") {
      document.getElementById("stock-large-nourriture").textContent = stock;
    }
  });
}

loadStocks();

// 🔹 3) Quand on clique sur “Réserver”
reserveButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    selectedType = btn.parentElement.getAttribute("data-type");
    selectedTypeSpan.textContent = selectedType;

    quantity = 1;
    quantitySpan.textContent = quantity;

    formContainer.classList.remove("hidden");
    confirmation.classList.add("hidden");

    window.scrollTo({ top: 0, behavior: "smooth" });
  });
});

// 🔹 4) Boutons + et –
plusBtn.addEventListener("click", () => {
  quantity++;
  quantitySpan.textContent = quantity;
});

minusBtn.addEventListener("click", () => {
  if (quantity > 1) {
    quantity--;
    quantitySpan.textContent = quantity;
  }
});

// 🔹 5) Envoi de la réservation dans Google Sheets
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const nom = document.getElementById("nom").value;
  const prenom = document.getElementById("prenom").value;
  const contact = document.getElementById("contact").value;

  const now = new Date().toLocaleString("fr-FR");

  // Envoi via l’API Sheetson-like (opensheet)
await fetch("https://sheetdb.io/api/v1/j6z2qrzvht1dx", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      data: [
        {
          Nom: nom,
          Prénom: prenom,
          Contact: contact,
          "Type de boîte": selectedType,
          Quantité: quantity,
          Date: now
        }
      ]
    })
  });

  formContainer.classList.add("hidden");
  confirmation.classList.remove("hidden");

  form.reset();
});