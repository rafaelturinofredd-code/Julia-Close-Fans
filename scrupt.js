// ================== SUPABASE CONFIG ==================
const SUPABASE_URL = 'https://odmavgvlwkddevuejqwq.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9kbWF2Z3Zsd2tkZGV2dWVqcXdxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk2NTM3MDEsImV4cCI6MjA5NTIyOTcwMX0.YKAfMn2ktzWGMKfJHHzG6BW8_iG_-UiHlZCSW-Ckq_E';

const supabase = Supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

let currentUser = null;

// ====================== LOGIN ======================
async function login() {
  const email = document.getElementById('loginEmail').value.trim();
  const password = document.getElementById('loginPass').value.trim();

  if (!email || !password) return alert("Preencha email e senha!");

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) alert("Erro ao entrar: " + error.message);
  else {
    currentUser = data.user;
    loadDashboard();
  }
}

// ====================== CRIAR CONTA ======================
async function register() {
  const email = prompt("Digite seu email:");
  const password = prompt("Crie uma senha (mínimo 6 caracteres):");

  if (!email || !password) return;

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { emailRedirectTo: window.location.origin }
  });

  if (error) alert("Erro: " + error.message);
  else alert("✅ Conta criada!\nVerifique seu email para confirmar.");
}

// ====================== LOGIN COM GOOGLE ======================
async function loginWithGoogle() {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo: window.location.origin }
  });
  if (error) alert(error.message);
}

// ====================== DASHBOARD ======================
function loadDashboard() {
  document.getElementById('loginScreen').classList.remove('active');
  document.getElementById('dashboard').classList.add('active');

  const displayName = currentUser?.email?.split('@')[0] || "Arcanjo";
  document.getElementById('userName').textContent = displayName;
  document.getElementById('headerName').textContent = displayName;
}

// ====================== VERIFICAÇÃO DE LOGIN ======================
supabase.auth.onAuthStateChange((event, session) => {
  if (session?.user) {
    currentUser = session.user;
    loadDashboard();
  }
});

// Inicializa
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('loginScreen').classList.add('active');
});