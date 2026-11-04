const STAGES = [1, 2.5, 5, 10, 16];
const STAGE_NAMES = ['Easy','Medium','Hard','Expert','Impossible'];
const POOLS = {
  indonesia: ['Sheila On 7','Peterpan Noah','Dewa 19','Tulus','Judika','Raisa','Bernadya','Hindia','Pamungkas','Slank'],
  barat: ['Taylor Swift','Ed Sheeran','Bruno Mars','Coldplay','Adele','Queen','Michael Jackson','The Weeknd','Dua Lipa','Maroon 5'],
  kpop: ['BTS','Blackpink','NewJeans','Jungkook','IVE','Stray Kids','Seventeen','Twice','Aespa','BTS Dynamite'],
  tiktok: ['Espresso Sabrina','Birds of a feather','Die with a smile','APT Rose','Blinding Lights','As It Was','Calm Down','Cupid','Make You Mine','Glimpse of Us']
};

let answer=null, stage=0, score=0, streak=0, round=1, playing=false, cutTimer=null, progTimer=null;

const $ = id => document.getElementById(id);
const audio=$('audio'), audioFull=$('audioFull');

async function fetchSongs(query){
  const url=`https://itunes.apple.com/search?term=${encodeURIComponent(query)}&media=music&entity=song&limit=25&country=ID`;
  const r=await fetch(url); const j=await r.json();
  return (j.results||[]).filter(s=>s.previewUrl);
}
async function newRound(){
  $('loading').style.display='block';
  $('reveal').classList.add('hidden');
  $('guesses').innerHTML='';
  $('results').classList.add('hidden');
  $('search').value='';
  stage=0; updateStages();
  $('btnPlay').disabled=true;
  const cat=$('category').value;
  const pool=POOLS[cat];
  const q=pool[Math.floor(Math.random()*pool.length)];
  try{
    let list=await fetchSongs(q);
    if(!list.length) list=await fetchSongs('Top hits Indonesia');
    answer=list[Math.floor(Math.random()*list.length)];
    audio.src=answer.previewUrl;
    audio.load();
    $('loading').style.display='none';
    $('btnPlay').disabled=false;
    $('hint').textContent=`Tekan play untuk dengar intro ${STAGES[0]} detik — ${STAGE_NAMES[0]}`;
    $('round').textContent=round;
  }catch(e){
    $('loading').textContent='❌ Gagal load. Cek internet lalu klik Lagu Baru.';
  }
}

function updateStages(){
  const btns=[...document.querySelectorAll('#levels button')];
  btns.forEach((b,i)=>{
    b.classList.toggle('active', i===stage);
    b.classList.toggle('done', i<stage);
  });
  $('timeLabel').textContent=STAGES[stage].toFixed(1)+'s';
  $('fill').style.width=(STAGES[stage]/16*100)+'%';
}

function playClip(seconds, isFull=false){
  const el=isFull?audioFull:audio;
  if(!isFull){ el.src=answer.previewUrl; }
  el.currentTime=0; el.play();
  playing=true; $('btnPlay').textContent='⏸';
  let start=Date.now();
  clearInterval(progTimer); clearTimeout(cutTimer);
  if(!isFull){
    progTimer=setInterval(()=>{
      const p=(Date.now()-start)/1000;
      const pct=Math.min(p/16*100,100);
      $('fill').style.width=pct+'%';
      if(p>=seconds){ stopClip(); }
    },50);
    cutTimer=setTimeout(stopClip, seconds*1000+150);
  }
}
function stopClip(){
  audio.pause(); clearInterval(progTimer); clearTimeout(cutTimer);
  playing=false; $('btnPlay').textContent='▶';
  $('fill').style.width=(STAGES[stage]/16*100)+'%';
}
$('btnPlay').onclick=()=>{
  if(!answer) return;
  if(playing){ stopClip(); } else { playClip(STAGES[stage]); }
};
document.querySelectorAll('#levels button').forEach(b=>{
  b.onclick=()=>{ stage=+b.dataset.stage; updateStages(); stopClip(); $('hint').textContent=`Level ${STAGE_NAMES[stage]} = ${STAGES[stage]} detik`; };
});

let searchTimeout;
$('search').addEventListener('input', e=>{
  clearTimeout(searchTimeout);
  const q=e.target.value.trim();
  if(q.length<2){ $('results').classList.add('hidden'); return; }
  searchTimeout=setTimeout(async ()=>{
    const list=await fetchSongs(q);
    const box=$('results'); box.innerHTML=''; box.classList.remove('hidden');
    if(!list.length){ box.innerHTML='<div class="item">Tidak ketemu</div>'; return; }
    list.slice(0,8).forEach(s=>{
      const d=document.createElement('div'); d.className='item';
      d.innerHTML=`<img src="${s.artworkUrl60}"><div><div class="t">${s.trackName}</div><div class="a">${s.artistName}</div></div>`;
      d.onclick=()=>submitGuess(s);
      box.appendChild(d);
    });
  },350);
});

function norm(s){ return (s||'').toLowerCase().replace(/[^a-z0-9 ]/g,'').trim(); }
function isCorrect(guess){
  if(!answer) return false;
  if(guess.trackId===answer.trackId) return true;
  return norm(guess.trackName)===norm(answer.trackName);
}
function submitGuess(g){
  $('results').classList.add('hidden'); $('search').value='';
  const ok=isCorrect(g);
  addGuessRow(`${g.trackName} — ${g.artistName}`, ok);
  if(ok) return win();
  // salah -> naik stage
  if(stage>=4) return lose();
  stage++; updateStages();
  $('hint').textContent=`Salah! Sekarang coba ${STAGE_NAMES[stage]} = ${STAGES[stage]}s`;
  stopClip();
}
function addGuessRow(text, ok){
  const d=document.createElement('div');
  d.className='guess '+(ok?'correct':'wrong');
  d.innerHTML=`<span>${ok?'✅':'❌'} ${text}</span><span>${ok?'':STAGE_NAMES[stage]}</span>`;
  $('guesses').appendChild(d);
}
$('btnSkip').onclick=()=>{
  if(!answer||!$('reveal').classList.contains('hidden')) return;
  addGuessRow(`Skip — lewati ${STAGE_NAMES[stage]}`, false);
  if(stage>=4) return lose();
  stage++; updateStages(); stopClip();
  $('hint').textContent=`Di-skip! Intro ${STAGES[stage]}s`;
};
function win(){
  score+= (5-stage)*100; streak++;
  $('score').textContent=score; $('streak').textContent=streak;
  showReveal(true);
}
function lose(){
  streak=0; $('streak').textContent=streak;
  showReveal(false);
}
function showReveal(didWin){
  stopClip();
  $('reveal').classList.remove('hidden');
  $('art').src=answer.artworkUrl100;
  $('revealTitle').textContent=answer.trackName;
  $('revealArtist').textContent=answer.artistName+' • '+ (answer.collectionName||'');
  $('revealMsg').textContent=didWin?`🎉 BENAR di ${STAGE_NAMES[stage]}! +${(5-stage)*100} poin`:`😢 Habis! Jawabannya di atas. Coba lagi!`;
  $('revealMsg').style.color=didWin?'#00ff87':'#ff8fa3';
}
$('btnGiveup').onclick=()=>{ if(answer) lose(); };
$('btnNext').onclick=()=>{ round++; newRound(); };
$('btnNew').onclick=()=>{ round++; newRound(); };
$('category').onchange=()=>{ round=1; newRound(); };
$('btnFull').onclick=()=>{
  audioFull.src=answer.previewUrl;
  audioFull.classList.add('show'); audioFull.controls=true;
  audioFull.play();
};
document.addEventListener('click',e=>{
  if(!e.target.closest('.search-box')) $('results').classList.add('hidden');
});

newRound();
