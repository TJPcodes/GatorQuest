// Simple auth tester: registers a timestamped user then logs in
// Usage: node testAuth.js
//new
const BASE = process.env.BASE || 'http://localhost:5000';

async function run(){
  try{
    const email = `test+${Date.now()}@example.com`;
    const password = 'Test123!';
    console.log('Registering', email);

    const reg = await fetch(`${BASE}/api/users/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const regText = await reg.text();
    console.log('Register HTTP', reg.status);
    console.log('Register body:', regText);

    console.log('Logging in...');
    const login = await fetch(`${BASE}/api/users/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const loginText = await login.text();
    console.log('Login HTTP', login.status);
    console.log('Login body:', loginText);
  }catch(err){
    console.error('Test failed:', err);
    process.exitCode = 2;
  }
}

run();
