// ================== SUPABASE ==================
const SUPABASE_URL = 'https://odmavgvlwkddevuejqwq.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9kbWF2Z3Zsd2tkZGV2dWVqcXdxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk2NTM3MDEsImV4cCI6MjA5NTIyOTcwMX0.YKAfMn2ktzWGMKfJHHzG6BW8_iG_-UiHlZCSW-Ckq_E';

const supabase = Supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

let currentUser = null;
let packs = [];

// ====================== LOGIN ======================
async function login() {
  const email = document.getElementById('loginEmail').value.trim();
  const password = document.getElementById('loginPass').value.trim();

  if (!email || !password) return alert("Preencha email e senha!");

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) alert("Erro: " + error.message);
  else {
    currentUser = data.user;
    loadDashboard();
  }
}

async function register() {
  const email = prompt("Digite seu email:");
  const password = prompt("Crie uma senha (mínimo 6 caracteres):");

  if (!email || !password) return;

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: { emailRedirectTo: window.location.origin }
  });

  if (error) alert(error.message);
  else alert("✅ Conta criada!\nVerifique seu email (incluindo spam).");
}

async function loginWithGoogle() {
  await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo: window.location.origin }
  });
}

// ====================== DASHBOARD ======================
function loadDashboard() {
  document.getElementById('loginScreen').classList.remove('active');
  document.getElementById('dashboard').classList.add('active');

  const name = currentUser?.email?.split('@')[0] || "Arcanjo";
  document.getElementById('userName').textContent = name;
  document.getElementById('headerName').textContent = name;
}

function showSection(section) {
  document.querySelectorAll('.section').forEach(s => s.classList.add('hidden'));
  document.getElementById(section + 'Section').classList.remove('hidden');
}

// Funções de edição
function editBio() {
  const newBio = prompt("Nova biografia:", document.getElementById('userBio').textContent);
  if (newBio) document.getElementById('userBio').textContent = newBio;
}

function editProfilePic() {
  const url = prompt("URL da nova foto:", document.getElementById('profilePic').src);
  if (url) document.getElementById('profilePic').src = url;
}

function editCover() {
  const url = prompt("URL da nova capa:");
  if (url) document.getElementById('coverPhoto').style.backgroundImage = url('${url}');
}

// Packs (simples, salvo no localStorage por enquanto)
function renderPacks() {
  const container = document.getElementById('packsContainer');
  container.innerHTML = packs.length ? '' : '<p style="grid-column:1/-1;text-align:center">Nenhum pack criado ainda.</p>';

  packs.forEach((pack, i) => {
    const div = document.createElement('div');
    div.className = 'pack-card';
    div.innerHTML = <h3>\( {pack.title}</h3><p> \){pack.description}</p><strong>R$ ${pack.price}</strong>;
    container.appendChild(div);
  });
}

function showCreatePackModal() {
  document.getElementById('packModal').classList.remove('hidden');
}

function closeModal() {
  document.getElementById('packModal').classList.add('hidden');
}

function createPack() {
  const title = document.getElementById('packTitle').value;
  const desc = document.getElementById('packDesc').value;
  const price = document.getElementById('packPrice').value;

  if (title && price) {
    packs.push({title, description: desc, price});
    renderPacks();
    closeModal();
  }
}

// Inicialização
supabase.auth.onAuthStateChange((event, session) => {
  if (session?.user) {
    currentUser = session.user;
    loadDashboard();
  }
});