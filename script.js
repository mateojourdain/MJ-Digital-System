// MJ Digital Systems — interactions des pages
document.querySelectorAll(".year").forEach(e=>e.textContent=new Date().getFullYear());
const menu=document.querySelector(".menu"),nav=document.querySelector(".nav");
menu?.addEventListener("click",()=>{const open=nav.classList.toggle("open");menu.setAttribute("aria-expanded",String(open));menu.textContent=open?"✕":"☰";});
const q=document.querySelector("#quote-form");
if(q){
 const pages=[...q.querySelectorAll(".form-page")],steps=[...document.querySelectorAll(".progress>span")];let at=0;
 const show=n=>{at=n;pages.forEach((p,i)=>p.classList.toggle("active",i===n));steps.forEach((s,i)=>{s.classList.toggle("active",i===n);s.classList.toggle("done",i<n);});};
 const valid=()=>{const p=pages[at];for(const el of p.querySelectorAll("[required]")){if(el.type==="radio"){if(!p.querySelector(`input[name="${el.name}"]:checked`)){el.focus();alert("Merci de choisir un type de projet.");return false;}}else if(!el.checkValidity()){el.reportValidity();return false;}}return true;};
 q.querySelectorAll(".next").forEach(b=>b.addEventListener("click",()=>{if(valid())show(Math.min(at+1,2));}));
 q.querySelectorAll(".prev").forEach(b=>b.addEventListener("click",()=>show(Math.max(at-1,0))));
 const pre=new URLSearchParams(location.search).get("formule");if(pre){const sel=q.querySelector("#formule");if(sel){const op=[...sel.options].find(o=>o.textContent.toLowerCase().startsWith(pre.toLowerCase()));if(op)sel.value=op.value;}}
 q.addEventListener("submit",e=>{e.preventDefault();if(!valid())return;const d=new FormData(q);const body=["DEMANDE DE DEVIS — MJ DIGITAL SYSTEMS","",`Activité : ${d.get("activite")}`,`Projet : ${d.get("projet")}`,`Description : ${d.get("description")}`,`Formule : ${d.get("formule")||"À définir"}`,`Options : ${d.getAll("options").join(", ")}`,`Budget : ${d.get("budget")||"À définir"}`,`Délai : ${d.get("delai")||"À définir"}`,"",`Nom : ${d.get("nom")}`,`Entreprise : ${d.get("entreprise")||""}`,`Email : ${d.get("email")}`,`Téléphone : ${d.get("telephone")||""}`,`Ville : ${d.get("ville")||""}`].join("\n");q.hidden=true;document.querySelector(".progress").hidden=true;document.querySelector("#quote-done").hidden=false;location.href="mailto:contact@mjdigitalsystems.fr?subject="+encodeURIComponent("Demande de devis MJ Digital Systems")+"&body="+encodeURIComponent(body);});
}
const cf=document.querySelector("#contact-form");cf?.addEventListener("submit",e=>{e.preventDefault();if(!cf.reportValidity())return;const d=new FormData(cf);const body=`Nom : ${d.get("nom")}\nEmail : ${d.get("email")}\nSujet : ${d.get("sujet")}\n\n${d.get("message")}`;location.href="mailto:contact@mjdigitalsystems.fr?subject="+encodeURIComponent("Contact MJ Digital Systems — "+d.get("sujet"))+"&body="+encodeURIComponent(body);});
