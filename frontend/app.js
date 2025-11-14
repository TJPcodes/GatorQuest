const BASE = 'http://localhost:5000/api/users';

function toJSON(res){
  return res.json().catch(()=>({ message: 'Invalid JSON response', status: res.status }))
}

async function post(path, body){
  const res = await fetch(`${BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  const json = await toJSON(res);
  return { status: res.status, ok: res.ok, body: json };
}

document.getElementById('registerForm').addEventListener('submit', async (e)=>{
  e.preventDefault();
  const fd = new FormData(e.target);
  const payload = { email: fd.get('email'), password: fd.get('password') };
  const out = document.getElementById('registerResult');
  out.textContent = 'Waiting...';
  try{
    const r = await post('/register', payload);
    out.textContent = JSON.stringify(r, null, 2);
  }catch(err){ out.textContent = String(err) }
});

document.getElementById('loginForm').addEventListener('submit', async (e)=>{
  e.preventDefault();
  const fd = new FormData(e.target);
  const payload = { email: fd.get('email'), password: fd.get('password') };
  const out = document.getElementById('loginResult');
  out.textContent = 'Waiting...';
  try{
    const r = await post('/login', payload);
    out.textContent = JSON.stringify(r, null, 2);
  }catch(err){ out.textContent = String(err) }
});
