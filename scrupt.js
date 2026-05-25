function subscribe(index) {
  if (packs[index].subscribed) {
    alert("🎉 Conteúdo liberado!");
    return;
  }
  
  if (confirm(Assinar por R$ ${packs[index].price}/mês?)) {
    packs[index].subscribed = true;
    alert("✅ Assinatura realizada com sucesso!");
    renderPacks();
    saveData();
  }
}

// ====================== INICIALIZAÇÃO ======================
loadSavedData();

if (currentUser) {
  loadDashboard();
} else {
  document.getElementById('loginScreen').classList.add('active');
}