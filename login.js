const GOOGLE_CLIENT_ID = '763660019548-6q46a2r1h23rt373f67rtatju36g5aue.apps.googleusercontent.com';

function decodeJwt(jwt) {
  const parts = jwt.split('.');
  if (parts.length !== 3) return null;
  try {
    const payload = atob(parts[1].replace(/-/g,'+').replace(/_/g,'/'));
    return JSON.parse(decodeURIComponent(escape(payload)));
  } catch(e){ console.error(e); return null; }
}

// Local login
const signinUsername = document.getElementById('signinUsername');
const signinPassword = document.getElementById('signinPassword');
const signinBtn = document.getElementById('signinBtn');
const signinMsg = document.getElementById('signinMsg');

function loadUsers(){ return JSON.parse(localStorage.getItem('users')||'[]'); }

signinBtn.addEventListener('click', ()=>{
  const u = signinUsername.value.trim();
  const p = signinPassword.value;
  signinMsg.textContent = '';
  if(!u||!p){ signinMsg.textContent='Enter username/email and password'; return; }
  const users = loadUsers();
  const user = users.find(x => (x.username===u || x.email===u) && x.password===p);
  if(!user){ signinMsg.textContent='Invalid credentials'; return; }
  const profile = { source:'local', id:'local:'+user.username, name:user.name||user.username, email:user.email, picture:user.picture||'' };
  localStorage.setItem('sessionUser', JSON.stringify(profile));
  window.location.href='home.html';
});

// --- Google login ---
function handleGoogleCredential(response){
  if(!response?.credential) return alert('Google sign-in failed.');
  const payload = decodeJwt(response.credential);
  if(!payload) return alert('Failed to decode Google profile.');
  const profile = { source:'google', id:payload.sub, name:payload.name, email:payload.email, picture:payload.picture };
  localStorage.setItem('sessionUser', JSON.stringify(profile));
  window.location.href='home.html';
}

window.addEventListener('load', ()=>{
  const trySetup = ()=>{
    if(window.google && google.accounts && google.accounts.id){
      google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: handleGoogleCredential
      });

      // Render Google button styled like your primary button
      google.accounts.id.renderButton(
        document.getElementById('gSignInWrapper'),
        {
          type: 'standard',  // required
          theme: 'outline',  // outline keeps it simple
          size: 'large',
          shape: 'rectangular',
          text: 'continue_with', // "Continue with Google"
        }
      );
    } else {
      setTimeout(trySetup, 200);
    }
  };
  trySetup();
});
