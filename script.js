/* MJ Digital Systems — navigation et formulaires interactifs */
const CONTACT_EMAIL = "contact@mjdigitalsystems.fr"; // À confirmer avant publication.
document.querySelectorAll(".year").forEach(el => el.textContent = new Date().getFullYear());

// Menu mobile commun aux trois pages.
const menu = document.querySelector(".menu");
const nav = document.querySelector(".nav");
menu?.addEventListener("click", () => {
  const open = nav.classList.toggle("open");
  menu.setAttribute("aria-expanded", String(open));
  menu.textContent = open ? "✕" : "☰";
});
nav?.querySelectorAll("a").forEach(a => a.addEventListener("click", () => {
  nav.classList.remove("open");
  menu?.setAttribute("aria-expanded", "false");
  if (menu) menu.textContent = "☰";
}));

// Formulaire de devis multi-étapes avec validation.
const quote = document.querySelector("#quote-form");
if (quote) {
  const pages = [...quote.querySelectorAll(".form-page")];
  const steps = [...document.querySelectorAll(".progress-step")];
  let active = 0;
  const show = n => {
    active = n;
    pages.forEach((p,i) => p.classList.toggle("active", i === n));
    steps.forEach((s,i) => {
      s.classList.toggle("active", i === n);
      s.classList.toggle("done", i < n);
    });
  };
  const valid = n => {
    const fields = [...pages[n].querySelectorAll("input[required],select[required],textarea[required]")];
    const radioNames = [...new Set(fields.filter(f=>f.type==="radio").map(f=>f.name))];
    for (const name of radioNames) {
      if (!pages[n].querySelector(`input[name="${name}"]:checked`)) {
        pages[n].querySelector(`input[name="${name}"]`).focus();
        alert("Merci de sélectionner un type de projet.");
        return false;
      }
    }
    for (const f of fields.filter(f=>f.type!=="radio")) {
      if (!f.checkValidity()) { f.reportValidity(); f.focus(); return false; }
    }
    return true;
  };
  quote.querySelectorAll(".next").forEach(b=>b.addEventListener("click",()=>{if(valid(active))show(Math.min(2,active+1));}));
  quote.querySelectorAll(".prev").forEach(b=>b.addEventListener("click",()=>show(Math.max(0,active-1))));
  // Pré-sélection des offres depuis la page tarifs.
  const chosen = new URLSearchParams(location.search).get("formule");
  if (chosen) {
    const sel = quote.querySelector("#formule");
    const option = [...sel.options].find(o=>o.textContent.toLowerCase().startsWith(chosen.toLowerCase()));
    if(option) sel.value=option.value;
  }
  quote.addEventListener("submit",e=>{
    e.preventDefault();
    if(!valid(2)) return;
    const d=new FormData(quote);
    const options=d.getAll("options");
    const body=[
      "NOUVELLE DEMANDE DE DEVIS — MJ DIGITAL SYSTEMS","",
      `Activité : ${d.get("activite")}`,
      `Type de projet : ${d.get("projet")}`,
      `Description : ${d.get("description")||"Non renseignée"}`,
      `Formule : ${d.get("formule")}`,
      `Budget : ${d.get("budget")||"Non renseigné"}`,
      `Solutions souhaitées : ${options.join(", ")||"Non précisées"}`,
      `Délai : ${d.get("delai")||"Non précisé"}`,"",
      "COORDONNÉES",
      `Nom : ${d.get("nom")}`,
      `Entreprise : ${d.get("entreprise")||"Non renseignée"}`,
      `E-mail : ${d.get("email")}`,
      `Téléphone : ${d.get("telephone")||"Non renseigné"}`,
      `Ville : ${d.get("ville")||"Non renseignée"}`
    ].join("\n");
    document.querySelector(".progress").hidden=true;
    quote.hidden=true;
    const done=document.querySelector("#quote-done");
    done.hidden=false;
    done.scrollIntoView({behavior:"smooth",block:"center"});
    window.location.href=`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent("Demande de devis — MJ Digital Systems")}&body=${encodeURIComponent(body)}`;
  });
}

// Formulaire de contact.
const contact=document.querySelector("#contact-form");
contact?.addEventListener("submit",e=>{
  e.preventDefault();
  if(!contact.reportValidity()) return;
  const d=new FormData(contact);
  const body=["NOUVEAU MESSAGE — MJ DIGITAL SYSTEMS","",`Nom : ${d.get("nom")}`,`E-mail : ${d.get("email")}`,`Sujet : ${d.get("sujet")}`,"",d.get("message")].join("\n");
  window.location.href=`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent("Contact — "+d.get("sujet"))}&body=${encodeURIComponent(body)}`;
  const button=contact.querySelector('button[type="submit"]');
  button.textContent="E-mail préparé ✓";
});

// Apparition discrète des sections au défilement, sans gêner la lecture.
if ("IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  const revealTargets = document.querySelectorAll(".benefit,.section-head,.service-card,.price-card,.step,.cta-band,.form-shell,.contact-grid,.appointment");
  revealTargets.forEach(el => el.classList.add("reveal"));
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("revealed");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealTargets.forEach(el => observer.observe(el));
}
