
const modal=document.getElementById("modal");
const modalTitle=document.getElementById("modalTitle");
const modalText=document.getElementById("modalText");
function openModal(title,text){
 if(!modal)return;
 modalTitle.textContent=title; modalText.textContent=text; modal.classList.add("show");
}
function closeModal(){if(modal)modal.classList.remove("show")}
document.addEventListener("click",e=>{
 if(e.target.matches("[data-close]") || e.target===modal) closeModal();
 const plan=e.target.closest("[data-plan]");
 if(plan){
  window.location.href=`checkout.html?plano=${encodeURIComponent(plan.dataset.plan)}`;
  return;
 }
 const download=e.target.closest("[data-download]");
 if(download){e.preventDefault();showToast("Download iniciado!");}
 const support=e.target.closest("[data-support]");
 if(support){e.preventDefault();openModal("Fale com o suporte","Olá! Nossa equipe está pronta para ajudar. Em uma versão real, este botão poderia abrir um chat ou WhatsApp.");}
});
document.querySelectorAll(".faq-q").forEach(btn=>{
 btn.addEventListener("click",()=>btn.parentElement.classList.toggle("open"));
});
function showToast(msg){
 const t=document.getElementById("toast"); if(!t)return;
 t.textContent=msg;t.classList.add("show");setTimeout(()=>t.classList.remove("show"),2500);
}
document.addEventListener("keydown",e=>{if(e.key==="Escape")closeModal()});
