
// TARGET (midnight IST on Dec 20, 2025)
const TARGET_ISO = '2025-12-20T00:00:00+05:30';
const targetDate = new Date(TARGET_ISO);

// Credentials (device-specific bypass)
const DEFAULT_CREDENTIALS = { user: 'paramu', pass: '1qaz2wsx@@' };
const BYPASS_KEY = 'special_bypass_v5';
const OPENED_KEY = 'special_surprise_opened_v5';

// Elements (mapped after DOM ready)
let loaderCard, countdownCard, finalCard, cakeButton, splash, messageBox, mainMessage, reopenBtn, floatingLayer;
let cornerBtn, loginModal, loginSubmit, loginCancel, loginUser, loginPass, loginFeedback;

// Secret message
const SECRET_MESSAGE = "Paramu,adeye  many more happy returns of the day, dee thangapulla \ud83d\udc96 Nee life-long happy-aa irukka naa prayer pannikkura \ud83e\udd0d Indha day unakk\u0101na day\u2026 enjoy pannittu full-ah happy-aa iru okvaa loosu \ud83d\ude04\ud83c\udf89 Nee en life-la vandha apro tha en life happy-aa, pudhusa-maari irukku \u2728 Unakum appadiye irukka naa prayer pannikkura\u2026 naa un kooda thaan iruppen life-long \u2764\ufe0f Thanks\u2026 love u dee pondati miss u dee etha  unna katti pudichu sollanum-nu irunduchi \u2026 aana mudiyala \ud83e\udd7a\ud83d\udc95 Innum konjam time\u2026 one year thaan correct-aa, apram ellam seri aagidum la \ud83d\ude0c\ud83d\udcab I love you sooo much dee\u2026 unmele enakku irukkura love romba special, deee, adhu eppovum appadiye thaan irukkum \u2764\ufe0f\u200d\ud83d\udd25\u2728 Again, many more happy birthday dee \ud83c\udf82\ud83d\udc97 Unakku pudicha ell\u0101m nadakkum\u2026 happy birthday dee thango \ud83d\udc9d I love you endlessly." ;

// DOM ready
window.addEventListener('DOMContentLoaded', ()=>{
  loaderCard = document.getElementById('loaderCard');
  countdownCard = document.getElementById('countdownCard');
  finalCard = document.getElementById('finalCard');
  cakeButton = document.getElementById('cakeButton');
  splash = document.getElementById('splash');
  messageBox = document.getElementById('messageBox');
  mainMessage = document.getElementById('mainMessage');
  reopenBtn = document.getElementById('reopenBtn');
  floatingLayer = document.getElementById('floatingLayer');
  cornerBtn = document.getElementById('cornerBtn');
  loginModal = document.getElementById('loginModal');
  loginSubmit = document.getElementById('loginSubmit');
  loginCancel = document.getElementById('loginCancel');
  loginUser = document.getElementById('loginUser');
  loginPass = document.getElementById('loginPass');
  loginFeedback = document.getElementById('loginFeedback');

  // show loader then countdown
  setTimeout(()=>{ loaderCard.classList.add('hidden'); countdownCard.classList.remove('hidden'); updateCountdown(); const iv=setInterval(()=>{ if(!updateCountdown()){ clearInterval(iv); onCountdownEnd(); } },1000); startFloating(); restoreOpenState(); },800);

  setupCornerLogin();
});
// (functions follow...)
function updateCountdown(){ const now=new Date(); const diff=targetDate-now; if(diff<=0) return false; const s=Math.floor(diff/1000)%60; const m=Math.floor(diff/1000/60)%60; const h=Math.floor(diff/1000/60/60)%24; const d=Math.floor(diff/1000/60/60/24); document.getElementById('days').textContent=d; document.getElementById('hours').textContent=h; document.getElementById('minutes').textContent=m; document.getElementById('seconds').textContent=s; lockCake(true); return true; }
function onCountdownEnd(){ lockCake(false); if(cakeButton){ cakeButton.classList.add('unlocked'); cakeButton.classList.remove('locked'); cakeButton.setAttribute('title','Tap to open your surprise'); cakeButton.removeEventListener('click', onCakeClick); cakeButton.addEventListener('click', onCakeClick); } }
function lockCake(locked){ if(!cakeButton) return; if(locked){ cakeButton.classList.add('locked'); cakeButton.classList.remove('unlocked'); cakeButton.style.pointerEvents='auto'; } else { cakeButton.classList.remove('locked'); cakeButton.classList.add('unlocked'); cakeButton.style.pointerEvents='auto'; } }
function onCakeClick(){ const now=new Date(); if(now<targetDate && !isBypassAllowedOnThisDevice()){ if(cakeButton){ cakeButton.animate([{transform:'translateY(0)'},{transform:'translateY(-6px)'},{transform:'translateY(0)'}],{duration:320}); const diff=targetDate-now; const h=Math.floor(diff/1000/60/60)%24; const d=Math.floor(diff/1000/60/60/24); const prev=cakeButton.querySelector?cakeButton.querySelector('.cake-inner').textContent:cakeButton.textContent; if(cakeButton.querySelector) cakeButton.querySelector('.cake-inner').textContent=`Locked • ${d}d ${h}h`; setTimeout(()=>{ if(cakeButton.querySelector) cakeButton.querySelector('.cake-inner').textContent=prev; },1500); } return; } if(localStorage.getItem(OPENED_KEY)){ showMessage(); return; } if(splash){ splash.classList.remove('hidden'); splash.classList.add('show'); } if(cakeButton) cakeButton.animate([{transform:'scale(1)'},{transform:'scale(1.06)'},{transform:'scale(0.6)'}],{duration:420}); setTimeout(()=>{ revealMessage(); },480); }
function revealMessage(){ if(messageBox) messageBox.classList.remove('hidden'); if(mainMessage) mainMessage.textContent=SECRET_MESSAGE; try{ localStorage.setItem(OPENED_KEY,'1'); }catch(e){} if(countdownCard) countdownCard.classList.add('hidden'); if(finalCard) finalCard.classList.remove('hidden'); }
function showMessage(){ if(countdownCard) countdownCard.classList.add('hidden'); if(finalCard) finalCard.classList.remove('hidden'); if(messageBox) messageBox.classList.remove('hidden'); if(mainMessage) mainMessage.textContent=SECRET_MESSAGE; }
function restoreOpenState(){ const opened=localStorage.getItem(OPENED_KEY); const now=new Date(); if(opened && now>=targetDate){ if(countdownCard) countdownCard.classList.add('hidden'); if(finalCard) finalCard.classList.remove('hidden'); if(messageBox) messageBox.classList.remove('hidden'); if(mainMessage) mainMessage.textContent=SECRET_MESSAGE; if(cakeButton) cakeButton.removeEventListener('click', onCakeClick); } else if(isBypassAllowedOnThisDevice()){ lockCake(false); if(cakeButton){ cakeButton.classList.add('unlocked'); cakeButton.classList.remove('locked'); cakeButton.removeEventListener('click', onCakeClick); cakeButton.addEventListener('click', onCakeClick); } } else if(now>=targetDate){ onCountdownEnd(); } }
function setupReopen(){ if(!reopenBtn) return; reopenBtn.addEventListener('click', ()=>{ try{ localStorage.removeItem(OPENED_KEY); }catch(e){} if(splash){ splash.classList.remove('hidden'); splash.classList.add('show'); } setTimeout(()=>{ revealMessage(); },420); }); } setupReopen();
function startFloating(){ if(!floatingLayer) return; const shapes=['💖','✨','🌟','💫','❤']; for(let i=0;i<18;i++){ const el=document.createElement('div'); el.className='float-shape'; el.textContent=shapes[Math.floor(Math.random()*shapes.length)]; el.style.left=(5+Math.random()*90)+'%'; el.style.top=(5+Math.random()*85)+'%'; el.style.fontSize=(10+Math.random()*22)+'px'; floatingLayer.appendChild(el); const dur=5000+Math.random()*9000; el.animate([{transform:'translateY(0)'},{transform:'translateY(' + (10+Math.random()*40) + 'px)'},{transform:'translateY(0)'}],{duration:dur,iterations:Infinity,easing:'ease-in-out'}); } }
function setupCornerLogin(){ try{ if(!cornerBtn||!loginModal){ cornerBtn=document.getElementById('cornerBtn'); loginModal=document.getElementById('loginModal'); loginSubmit=document.getElementById('loginSubmit'); loginCancel=document.getElementById('loginCancel'); loginUser=document.getElementById('loginUser'); loginPass=document.getElementById('loginPass'); loginFeedback=document.getElementById('loginFeedback'); if(!cornerBtn||!loginModal) return; } loginFeedback.textContent=''; cornerBtn.addEventListener('click',()=>{ loginFeedback.textContent=''; if(loginUser) loginUser.value=''; if(loginPass) loginPass.value=''; loginModal.classList.remove('hidden'); if(loginUser) loginUser.focus(); }); if(loginCancel) loginCancel.addEventListener('click',()=>loginModal.classList.add('hidden')); if(loginSubmit) loginSubmit.addEventListener('click',attemptLogin); if(loginPass) loginPass.addEventListener('keydown',(e)=>{ if(e.key==='Enter') attemptLogin(); }); function attemptLogin(){ const u=(loginUser&&loginUser.value)?loginUser.value.trim():''; const p=(loginPass&&loginPass.value)?loginPass.value.trim():''; if(!u||!p){ if(loginFeedback) loginFeedback.textContent='Enter username and password.'; return; } if(u===DEFAULT_CREDENTIALS.user&&p===DEFAULT_CREDENTIALS.pass){ try{ localStorage.setItem(BYPASS_KEY,'1'); }catch(e){} if(loginFeedback){ loginFeedback.style.color='#2c7a44'; loginFeedback.textContent='Unlocked on this device ✅'; } setTimeout(()=>{ loginModal.classList.add('hidden'); },700); const now=new Date(); if(now>=targetDate){ revealMessage(); }else{ lockCake(false); if(cakeButton){ cakeButton.classList.add('unlocked'); cakeButton.classList.remove('locked'); cakeButton.removeEventListener('click', onCakeClick); cakeButton.addEventListener('click', onCakeClick); } } } else { if(loginFeedback){ loginFeedback.style.color='#a33f6c'; loginFeedback.textContent='Incorrect credentials.'; } if(loginModal) loginModal.animate([{transform:'translateX(0)'},{transform:'translateX(-8px)'},{transform:'translateX(8px)'},{transform:'translateX(0)'}],{duration:280}); } } }catch(e){} }
function isBypassAllowedOnThisDevice(){ try{ return !!localStorage.getItem(BYPASS_KEY); }catch(e){ return false; } }
