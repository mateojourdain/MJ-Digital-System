// MJ Digital Systems — interactions du site vitrine
const EMAIL_DESTINATION = "contact@mjdigitalsystems.fr"; // À modifier si nécessaire.

const menuButton = document.querySelector(".menu-toggle");
const nav = document.querySelector(".main-nav");
menuButton?.addEventListener("click", () => {
  const opened = nav.classList.toggle("open");
  menuButton.setAttribute("aria-expanded", String(opened));
  menuButton.setAttribute("aria-label", opened ? "Fermer le menu" : "Ouvrir le menu");
});
nav?.querySelectorAll("a").forEach(link => link.addEventListener("click", () => {
  nav.classList.remove("open");
  menuButton?.setAttribute("aria-expanded", "false");
}));
document.querySelector("#year").textContent = new Date().getFullYear();

// Pré-sélection de la formule depuis les cartes tarifaires.
document.querySelectorAll("[data-plan]").forEach(link => link.addEventListener("click", () => {
  const plan = link.dataset.plan;
  const select = document.querySelector("#formule");
  if (select) {
    const option = [...select.options].find(o => o.textContent.startsWith(plan));
    if (option) select.value = option.value;
  }
}));

// Formulaire de devis en trois étapes.
const quoteForm = document.querySelector("#quoteForm");
const pages = [...document.querySelectorAll(".form-page")];
const progress = [...document.querySelectorAll(".progress-step")];
let currentPage = 0;
function showPage(index) {
  currentPage = index;
  pages.forEach((page, i) => page.classList.toggle("active", i === index));
  progress.forEach((step, i) => {
    step.classList.toggle("active", i === index);
    step.classList.toggle("done", i < index);
  });
  document.querySelector(".quote-form-wrap").scrollIntoView({behavior:"smooth",block:"center"});
}
function validatePage(index) {
  const fields = [...pages[index].querySelectorAll("input,select,textarea")].filter(el => el.required);
  for (const field of fields) {
    if (field.type === "radio") {
      const group = pages[index].querySelectorAll(`[name="${field.name}"]`);
      if (![...group].some(el => el.checked)) { group[0].focus(); return false; }
    } else if (!field.checkValidity()) {
      field.reportValidity(); field.focus(); return false;
    }
  }
  return true;
}
document.querySelectorAll(".next-step").forEach(btn => btn.addEventListener("click", () => {
  if (validatePage(currentPage)) showPage(Math.min(currentPage + 1, 2));
}));
document.querySelectorAll(".prev-step").forEach(btn => btn.addEventListener("click", () => showPage(Math.max(currentPage - 1, 0))));

function mailto(subject, body) {
  const href = `mailto:${EMAIL_DESTINATION}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  window.location.href = href;
}
quoteForm.addEventListener("submit", event => {
  event.preventDefault();
  if (!validatePage(2)) return;
  const data = new FormData(quoteForm);
  const options = data.getAll("options");
  const lines = [
    "NOUVELLE DEMANDE DE DEVIS — MJ DIGITAL SYSTEMS",
    "",
    `Activité : ${data.get("activite")}`,
    `Type de projet : ${data.get("projet")}`,
    `Description : ${data.get("description") || "Non renseignée"}`,
    `Formule : ${data.get("formule")}`,
    `Budget : ${data.get("budget") || "Non renseigné"}`,
    `Solutions souhaitées : ${options.length ? options.join(", ") : "Non précisées"}`,
    `Délai : ${data.get("delai") || "Non précisé"}`,
    "",
    "COORDONNÉES",
    `Nom : ${data.get("nom")}`,
    `Entreprise : ${data.get("entreprise") || "Non renseignée"}`,
    `E-mail : ${data.get("email")}`,
    `Téléphone : ${data.get("telephone") || "Non renseigné"}`,
    `Ville : ${data.get("ville") || "Non renseignée"}`
  ];
  document.querySelector("#quoteSuccess").hidden = false;
  quoteForm.hidden = true;
  document.querySelector(".form-progress").hidden = true;
  mailto("Demande de devis — MJ Digital Systems", lines.join("\n"));
});

document.querySelector("#contactForm").addEventListener("submit", event => {
  event.preventDefault();
  const data = new FormData(event.currentTarget);
  if (!event.currentTarget.reportValidity()) return;
  const body = [
    "NOUVEAU MESSAGE — MJ DIGITAL SYSTEMS", "",
    `Nom : ${data.get("nom")}`, `E-mail : ${data.get("email")}`,
    `Sujet : ${data.get("sujet")}`, "", data.get("message")
  ].join("\n");
  mailto(`Contact — ${data.get("sujet")}`, body);
  const button = event.currentTarget.querySelector('button[type="submit"]');
  button.textContent = "Message préparé dans votre e-mail ✓";
});

// Apparition douce des blocs au défilement (avec repli si non pris en charge).
if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) { entry.target.classList.add("is-visible"); observer.unobserve(entry.target); }
  }), {threshold:0.12});
  document.querySelectorAll(".service-card,.price-card,.steps article,.value-strip article").forEach(el => {
    el.classList.add("reveal"); observer.observe(el);
  });
}
