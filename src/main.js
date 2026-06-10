import { Howl } from 'howler';
import './style.css';

const $ = (id) => document.getElementById(id);
const app = $('app');

app.innerHTML = `
<main class="min-h-dvh overflow-y-auto bg-gradient-to-br from-slate-100 via-teal-50 to-amber-50 pb-[76px] text-slate-800">
  <section class="mx-auto flex min-h-dvh w-full max-w-md flex-col px-4 pb-[88px] pt-3 sm:max-w-lg">
    <header class="flex items-center justify-between rounded-3xl border border-white/80 bg-white/75 p-3 shadow-xl backdrop-blur">
      <div><h1 class="font-display text-xl text-teal-950">Restore & Sell</h1><p class="text-xs font-bold text-slate-500">Konteyner seç • Lot temizle • Müzayedede kapış</p></div>
      <div class="rounded-2xl bg-slate-900 px-3 py-2 text-right text-white"><p id="money" class="font-display text-lg">$0</p><p id="rank" class="text-[10px] text-amber-200">🏆 0</p></div>
    </header>

    <div class="mt-3 rounded-3xl bg-slate-900 p-3 text-white shadow-lg">
      <div class="flex items-center justify-between"><p id="containerName" class="font-display text-sm text-amber-200">Konteyner bekliyor</p><p id="rivalScore" class="text-xs font-bold text-teal-200">Rakip $0</p></div>
      <div class="mt-2 h-2 overflow-hidden rounded-full bg-white/15"><div id="progressBar" class="h-full w-0 rounded-full bg-gradient-to-r from-teal-300 to-amber-300 transition-all"></div></div>
      <p id="mission" class="mt-2 text-[11px] font-bold text-slate-300">Depo savaşına girmek için konteyner seç.</p>
    </div>

    <section class="relative mt-3 flex flex-none min-h-[275px] items-center justify-center rounded-[2rem] border border-white/80 bg-white/60 p-3 shadow-2xl shadow-teal-950/10 backdrop-blur sm:min-h-[360px]">
      <div id="hint" class="absolute left-5 top-5 z-10 rounded-full bg-teal-900/90 px-3 py-1 text-xs font-bold text-white shadow-lg">Konteyner seç</div>
      <canvas id="gameCanvas" class="touch-none rounded-[1.5rem] bg-gradient-to-b from-slate-50 to-stone-100 shadow-inner ring-1 ring-slate-200"></canvas>
      <div id="startOverlay" class="absolute inset-0 z-30 flex flex-col items-center justify-center rounded-[2rem] bg-white/85 p-8 text-center backdrop-blur-md">
        <div class="mb-4 text-6xl">🚢📦</div><h2 class="font-display text-4xl text-teal-950">Container Wars</h2>
        <p class="mt-3 max-w-xs text-sm font-semibold text-slate-600">Artık tek eşya yok: konteyner seç, içinden çıkan tüm lotu restore et, rakip alıcılara karşı müzayedede sat.</p>
        <button id="startBtn" class="mt-6 rounded-2xl bg-teal-600 px-8 py-4 font-display text-lg text-white shadow-xl active:scale-95">Konteynerlere Git</button>
      </div>
    </section>

    <div id="lotStrip" class="mt-3 grid grid-cols-5 gap-2"></div>

    <section class="mt-3 grid grid-cols-4 gap-2">
      <button data-tool="scrub" class="tool-btn rounded-2xl bg-teal-200 p-2 text-center shadow active:scale-95"><p class="text-xl">🪥</p><p class="text-[10px] font-bold">Kazı</p></button>
      <button data-tool="wash" class="tool-btn rounded-2xl bg-white/85 p-2 text-center shadow active:scale-95"><p class="text-xl">💧</p><p class="text-[10px] font-bold">Yıka</p></button>
      <button data-tool="polish" class="tool-btn rounded-2xl bg-white/85 p-2 text-center shadow active:scale-95"><p class="text-xl">✨</p><p class="text-[10px] font-bold">Cilala</p></button>
      <button id="sendBtn" class="rounded-2xl bg-amber-400 p-2 text-center shadow active:scale-95"><p class="text-xl">🔨</p><p class="text-[10px] font-bold">Sıradaki</p></button>
    </section>

    <div class="mt-2 grid grid-cols-4 gap-2 text-[10px] font-bold text-slate-600">
      <p id="mClean" class="rounded-xl bg-white/70 px-2 py-1">Temiz 0%</p><p id="mPolish" class="rounded-xl bg-white/70 px-2 py-1">Cila 0%</p><p id="mValue" class="rounded-xl bg-white/70 px-2 py-1">$0</p><p id="mCart" class="rounded-xl bg-white/70 px-2 py-1">Lot 0</p>
    </div>
  </section>
</main>

<div id="containerOverlay" class="fixed inset-0 z-40 hidden items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm">
  <div class="w-full max-w-md rounded-[2rem] bg-white p-5 text-center shadow-2xl"><h2 class="font-display text-2xl text-teal-950">3 Konteynerden Birini Kap</h2><p class="mt-1 text-sm font-semibold text-slate-500">Her konteyner farklı lot, risk ve rakip ilgisi taşır.</p><div id="containerGrid" class="mt-5 grid grid-cols-3 gap-3"></div></div>
</div>

<div id="auctionOverlay" class="fixed inset-0 z-40 hidden items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm">
  <div class="w-full max-w-md rounded-[2rem] bg-gradient-to-b from-purple-50 to-white p-4 shadow-2xl">
    <div class="flex items-center justify-between"><div><h2 class="font-display text-xl text-purple-950">Canlı Müzayede</h2><p id="auctionLine" class="text-sm font-bold text-slate-600">Rakipler teklif veriyor...</p></div><div id="auctionClock" class="rounded-2xl bg-purple-600 px-3 py-2 font-display text-white">3</div></div>
    <div id="auctionItems" class="mt-3 max-h-32 overflow-y-auto rounded-2xl bg-white/80 p-2 ring-1 ring-purple-100"></div>
    <div id="bidList" class="mt-3 grid grid-cols-3 gap-2 text-center text-xs"></div>
    <button id="auctionNext" class="mt-4 w-full rounded-2xl bg-amber-400 p-3 font-display text-amber-950 active:scale-95">Müzayedeyi Başlat</button>
  </div>
</div>

<div id="ad-container" aria-label="Reklam alanı" class="fixed bottom-2 left-1/2 z-50 h-[50px] w-[320px] -translate-x-1/2 rounded-xl bg-transparent"></div>
`;

const canvas = $('gameCanvas'), ctx = canvas.getContext('2d');
const dirtCanvas = document.createElement('canvas'), dirtCtx = dirtCanvas.getContext('2d');
const ui = {
  money:$('money'), rank:$('rank'), containerName:$('containerName'), rivalScore:$('rivalScore'), progressBar:$('progressBar'), mission:$('mission'), hint:$('hint'), startOverlay:$('startOverlay'), startBtn:$('startBtn'),
  lotStrip:$('lotStrip'), sendBtn:$('sendBtn'), mClean:$('mClean'), mPolish:$('mPolish'), mValue:$('mValue'), mCart:$('mCart'), containerOverlay:$('containerOverlay'), containerGrid:$('containerGrid'),
  auctionOverlay:$('auctionOverlay'), auctionLine:$('auctionLine'), auctionClock:$('auctionClock'), auctionItems:$('auctionItems'), bidList:$('bidList'), auctionNext:$('auctionNext')
};

const TYPES=['Vazo','Saat','Demlik','Radyo','Kamera','Robot','Gramofon','Kadeh','Pusula','Tablo','Heykel','Mücevher Kutusu','Teleskop','Maske','Fosil','Taç','Daktilo','Oyuncak Tren','Lamba','Ayna','Kılıç','Satranç Takımı','Müzik Kutusu','Porselen Bebek','Harita Tüpü'];
const ICONS=['🏺','🕰️','🫖','📻','📷','🤖','📯','🏆','🧭','🖼️','🗿','💎','🔭','🎭','🦴','👑','⌨️','🚂','💡','🪞','🗡️','♟️','🎼','🪆','🗞️'];
const MATS=['Bakır','Porselen','Gümüş','Bronz','Ahşap','Kristal','Pirinç','Emaye','Altın','Obsidyen','Yakut','Meteor'];
const COLORS=[['#0f766e','#5eead4','#f59e0b'],['#7c2d12','#fbbf24','#451a03'],['#4338ca','#c4b5fd','#facc15'],['#334155','#94a3b8','#14b8a6'],['#7e22ce','#f0abfc','#facc15'],['#155e75','#67e8f9','#fb7185'],['#166534','#86efac','#fde047'],['#be123c','#fda4af','#facc15']];
const CONTAINERS=[['Liman Konteyneri','🚢',1.0],['Terk Edilmiş Depo','🏚️',1.25],['VIP Gümrük Lotu','🔐',1.65],['Müze Tasfiye Kasası','🏛️',2.15]];
let save=JSON.parse(localStorage.getItem('container-restore-v1')||'{}');
let money=save.money||0,trophies=save.trophies||0,level=save.level||1,seed=save.seed||3000,best=save.best||0;
let container=null, choices=[], lot=[], current=0, cart=[], item=null, tool='scrub', dragging=false, clean=0, polish=0, particles=[], floating=[], audioReady=false, clickSfx,sellSfx,upgradeSfx, bids=[], auctionTick=3;

function rnd(s){return()=>((s=(s*1664525+1013904223)>>>0)/4294967296)}
function persist(){localStorage.setItem('container-restore-v1',JSON.stringify({money,trophies,level,seed,best}))}
function initAudio(){if(audioReady)return;audioReady=true;clickSfx=new Howl({src:['/audio/ui-click.wav'],volume:.35});sellSfx=new Howl({src:['/audio/impact-bell-heavy.ogg'],volume:.55});upgradeSfx=new Howl({src:['/audio/ui-switch.wav'],volume:.35})}
function makeItem(s, mult){const r=rnd(s), t=Math.floor(r()*Math.min(TYPES.length,10+level*2)), m=Math.floor(r()*Math.min(MATS.length,5+Math.floor(level/2))), rare=1+Math.floor(r()*(3+level)); return {seed:s,type:t,mat:m,rare,icon:ICONS[t],name:`${MATS[m]} ${TYPES[t]}`,base:Math.floor((70+t*18+m*22+rare*50)*mult*(1+level*.05)),color:COLORS[(t+m+rare)%COLORS.length],shape:(t+rare)%8,variant:Math.floor(r()*999),state:'dirty',score:0}}
function fit(){const wrap=canvas.parentElement.getBoundingClientRect(), size=Math.floor(Math.min(wrap.width-24,wrap.height-24,Math.max(245,window.innerHeight*.42))), dpr=Math.min(devicePixelRatio||1,2); canvas.style.width=canvas.style.height=`${size}px`; canvas.width=dirtCanvas.width=Math.floor(size*dpr); canvas.height=dirtCanvas.height=Math.floor(size*dpr); resetDirt()}
function drawItem(c, it=item){if(!it)return; const w=canvas.width,h=canvas.height,s=w/400,cx=w/2,cy=h*.55,[dark,light,accent]=it.color;c.save();c.translate(cx,cy);c.scale(s,s);c.shadowColor='#0f172a33';c.shadowBlur=18;c.shadowOffsetY=14;let g=c.createLinearGradient(-120,-130,120,145);g.addColorStop(0,light);g.addColorStop(.55,dark);g.addColorStop(1,accent);c.fillStyle=g;c.lineJoin=c.lineCap='round';let sh=it.shape;
 if(sh===0){c.beginPath();c.moveTo(-40,-145);c.quadraticCurveTo(-20,-85,-78,-35);c.bezierCurveTo(-120,25,-82,140,0,145);c.bezierCurveTo(82,140,120,25,78,-35);c.quadraticCurveTo(20,-85,40,-145);c.closePath();c.fill();c.fillRect(-52,-158,104,18)}
 if(sh===1){c.beginPath();c.roundRect(-112,-104,224,208,32);c.fill();c.fillStyle='#fff7ed';c.beginPath();c.arc(0,-5,75,0,Math.PI*2);c.fill();c.strokeStyle=dark;c.lineWidth=10;c.stroke();c.strokeStyle='#111827';c.lineWidth=7;c.beginPath();c.moveTo(0,-5);c.lineTo(0,-58);c.moveTo(0,-5);c.lineTo(42,18);c.stroke()}
 if(sh===2){c.beginPath();c.ellipse(0,25,110,88,0,0,Math.PI*2);c.fill();c.strokeStyle=accent;c.lineWidth=15;c.beginPath();c.arc(0,-10,72,Math.PI*1.08,Math.PI*1.92);c.stroke();c.fillStyle=accent;c.beginPath();c.roundRect(-50,-112,100,42,18);c.fill()}
 if(sh===3){c.beginPath();c.roundRect(-118,-74,236,148,30);c.fill();c.fillStyle='#e2e8f0';c.beginPath();c.roundRect(-74,-38,98,72,14);c.fill();c.fillStyle=accent;for(let i=0;i<3;i++){c.beginPath();c.arc(66+i*21,-10+i*17,11,0,7);c.fill()}}
 if(sh===4){c.beginPath();c.roundRect(-72,-116,144,210,40);c.fill();c.fillStyle=light;c.beginPath();c.arc(0,-38,35,0,7);c.fill();c.fillStyle=accent;c.fillRect(-60,18,120,22)}
 if(sh===5){c.beginPath();c.moveTo(-92,70);c.bezierCurveTo(-116,-58,-64,-142,0,-142);c.bezierCurveTo(64,-142,116,-58,92,70);c.quadraticCurveTo(0,126,-92,70);c.fill();c.fillStyle=accent;for(let i=-2;i<=2;i++){c.beginPath();c.arc(i*34,-105-Math.abs(i)*8,16,0,7);c.fill()}}
 if(sh===6){c.beginPath();c.ellipse(0,0,86,112,0,0,7);c.fill();c.fillStyle=accent;c.fillRect(-12,80,24,62);c.beginPath();c.ellipse(0,148,88,18,0,0,7);c.fill()}
 if(sh===7){c.beginPath();c.moveTo(-104,80);c.lineTo(-72,-88);c.lineTo(0,-135);c.lineTo(72,-88);c.lineTo(104,80);c.closePath();c.fill();c.fillStyle=light;c.beginPath();c.arc(0,-40,42,0,7);c.fill()}
 c.shadowBlur=0;c.fillStyle=accent;let rr=rnd(it.seed+99);for(let i=0;i<5+it.rare;i++){let x=-92+rr()*184,y=-118+rr()*230,rad=5+rr()*13;c.beginPath();rr()>.5?c.arc(x,y,rad,0,7):(c.moveTo(x,y-rad),c.lineTo(x+rad,y),c.lineTo(x,y+rad),c.lineTo(x-rad,y),c.closePath());c.fill()}c.globalCompositeOperation='screen';c.globalAlpha=.25+polish*.45;c.fillStyle='#fff';c.beginPath();c.ellipse(-34,-10,23,120,.25,0,7);c.fill();c.restore();c.globalAlpha=1;c.globalCompositeOperation='source-over'}
function resetDirt(){dirtCtx.clearRect(0,0,dirtCanvas.width,dirtCanvas.height); clean=0; polish=0; if(!item)return; drawItem(dirtCtx,item); dirtCtx.globalCompositeOperation='source-atop'; let g=dirtCtx.createRadialGradient(canvas.width*.4,canvas.height*.25,10,canvas.width*.5,canvas.height*.55,canvas.width*.55);g.addColorStop(0,'rgba(120,73,29,.55)');g.addColorStop(1,'rgba(28,25,23,.95)');dirtCtx.fillStyle=g;dirtCtx.fillRect(0,0,canvas.width,canvas.height);dirtCtx.globalCompositeOperation='source-over';let r=rnd(item.seed+7);for(let i=0;i<900;i++){dirtCtx.fillStyle=i%2?'#29252488':'#92400e77';dirtCtx.beginPath();dirtCtx.arc(r()*canvas.width,r()*canvas.height,(r()*3+1)*canvas.width/400,0,7);dirtCtx.fill()} updateUi()}
function sample(){const d=dirtCtx.getImageData(0,0,canvas.width,canvas.height).data;let v=0,t=0;for(let i=3;i<d.length;i+=16){if(d[i]>5)v++;t++}clean=Math.max(0,Math.min(1,1-v/(t*.23)));if(clean>.94)clean=1;updateUi()}
function itemValue(it=item){return Math.floor((it?.base||0)*(0.18+clean*.55+polish*.22+Math.min(.25,trophies*.002)))}
function chooseContainers(){choices=[0,1,2].map(i=>{let c=CONTAINERS[(level+i+Math.floor(Math.random()*CONTAINERS.length))%CONTAINERS.length];return {name:c[0],icon:c[1],mult:c[2]+Math.random()*.45,count:3+Math.floor(Math.random()*(3+Math.min(3,level)))} });ui.containerGrid.innerHTML=choices.map((c,i)=>`<button data-c="${i}" class="rounded-3xl bg-amber-100 p-3 shadow-lg active:scale-95"><div class="text-5xl">${c.icon}</div><p class="mt-2 text-xs font-bold">${c.name}</p><p class="text-[10px] text-slate-600">${c.count} parça • risk x${c.mult.toFixed(1)}</p></button>`).join('');document.querySelectorAll('[data-c]').forEach(b=>b.onclick=()=>startContainer(+b.dataset.c));ui.containerOverlay.classList.remove('hidden');ui.containerOverlay.classList.add('flex')}
function startContainer(i){initAudio();container=choices[i];seed+=17;lot=Array.from({length:container.count},(_,k)=>makeItem(seed+k*113,container.mult));current=0;cart=[];item=lot[0];ui.containerOverlay.classList.add('hidden');ui.containerOverlay.classList.remove('flex');ui.hint.textContent='Lot başladı: ürünleri hızlıca temizle';resetDirt();renderLot();updateUi();clickSfx?.play();persist()}
function renderLot(){ui.lotStrip.innerHTML=lot.map((it,i)=>`<div class="rounded-2xl ${i===current?'bg-teal-200 ring-2 ring-teal-500':it.state==='cart'?'bg-amber-100':'bg-white/70'} p-2 text-center shadow"><p class="text-xl">${it.icon}</p><p class="truncate text-[9px] font-bold">${it.name}</p></div>`).join('')}
function scrub(e){if(!item||!dragging)return;e.preventDefault();let rect=canvas.getBoundingClientRect(),p=e.touches?e.touches[0]:e,x=(p.clientX-rect.left)*(canvas.width/rect.width),y=(p.clientY-rect.top)*(canvas.height/rect.height),r=(tool==='polish'?25:36)*canvas.width/400; if(tool==='scrub'||tool==='wash'){dirtCtx.save();dirtCtx.globalCompositeOperation='destination-out';let g=dirtCtx.createRadialGradient(x,y,r*.1,x,y,r);g.addColorStop(0,'#000');g.addColorStop(1,'#0000');dirtCtx.fillStyle=g;dirtCtx.beginPath();dirtCtx.arc(x,y,r,0,7);dirtCtx.fill();dirtCtx.restore()} if(tool==='polish'&&clean>.45)polish=Math.min(1,polish+.014); for(let i=0;i<4;i++)particles.push({x,y,vx:(Math.random()-.5)*3,vy:(Math.random()-.5)*3,life:30,color:tool==='polish'?'#facc15':'#2dd4bf'}); if(Math.random()<.2)sample()}
function nextItem(){if(!item)return;sample();item.score=Math.floor((clean*.75+polish*.25)*100);item.final=itemValue();item.state='cart';cart.push(item);current++; if(current>=lot.length){item=null;renderLot();openAuction()}else{item=lot[current];resetDirt();renderLot();ui.hint.textContent=`Sıradaki parça: ${item.name}`;upgradeSfx?.play()} updateUi()}
function openAuction(){ui.auctionItems.innerHTML=cart.map(it=>`<div class="flex items-center justify-between rounded-xl bg-white p-2"><span>${it.icon} ${it.name}</span><b>$${it.final}</b></div>`).join('');bids=[];auctionTick=3;ui.auctionClock.textContent='3';ui.auctionLine.textContent='Lot hazır. Rakip alıcıları bekletme!';ui.auctionNext.textContent='Müzayedeyi Başlat';ui.auctionOverlay.classList.remove('hidden');ui.auctionOverlay.classList.add('flex');updateUi()}
function runAuction(){let base=cart.reduce((a,b)=>a+b.final,0), rival=Math.floor(base*(.85+Math.random()*.55));bids=[['Ada','🧑‍🎨',rival],['Mert','🕵️',Math.floor(base*(.75+Math.random()*.5))],['Ece','👩‍💼',Math.floor(base*(.8+Math.random()*.48))]];let tick=setInterval(()=>{auctionTick--;bids=bids.map(b=>[b[0],b[1],b[2]+Math.floor(Math.random()*base*.08)]);ui.bidList.innerHTML=bids.map(b=>`<div class="rounded-xl bg-purple-100 p-2 text-purple-900"><p>${b[1]}</p><b>${b[0]}</b><p>$${b[2]}</p></div>`).join('');ui.auctionClock.textContent=auctionTick; if(auctionTick<=0){clearInterval(tick);let top=Math.max(...bids.map(b=>b[2])), earned=Math.max(base,top);money+=earned;trophies+=earned>=top?12:5;level=1+Math.floor(trophies/50);best=Math.max(best,money);sellSfx?.play();floating.push({text:`+$${earned}`,x:canvas.width/2,y:canvas.height*.2,life:90});ui.auctionLine.textContent=`Lot satıldı! +$${earned} / kupa ${trophies}`;ui.auctionNext.textContent='Yeni Konteyner';cart=[];lot=[];container=null;persist();updateUi()}},700)}
function updateUi(){ui.money.textContent=`$${money}`;ui.rank.textContent=`🏆 ${trophies}`;ui.containerName.textContent=container?`${container.icon} ${container.name}`:'Konteyner bekliyor';ui.rivalScore.textContent=`Rakip $${cart.reduce((a,b)=>a+(b.final||0),0)}`;ui.progressBar.style.width=lot.length?`${Math.floor((cart.length/lot.length)*100)}%`:'0%';ui.mission.textContent=container?`${lot.length} parçalık lot: ${cart.length}/${lot.length} müzayedeye hazır`:'Supercell tarzı döngü: konteyner aç, lot çıkar, açık artırmada rakipleri geç.';ui.mClean.textContent=`Temiz ${Math.floor(clean*100)}%`;ui.mPolish.textContent=`Cila ${Math.floor(polish*100)}%`;ui.mValue.textContent=`$${itemValue()}`;ui.mCart.textContent=`Lot ${cart.length}`}
function render(){ctx.clearRect(0,0,canvas.width,canvas.height);let bg=ctx.createLinearGradient(0,0,0,canvas.height);bg.addColorStop(0,'#f8fafc');bg.addColorStop(1,'#ecfdf5');ctx.fillStyle=bg;ctx.fillRect(0,0,canvas.width,canvas.height);ctx.fillStyle='#0f766e14';ctx.beginPath();ctx.arc(canvas.width/2,canvas.height*.58,canvas.width*.34,0,7);ctx.fill();if(item){drawItem(ctx,item);ctx.drawImage(dirtCanvas,0,0)}else{ctx.font=`${80*canvas.width/400}px sans-serif`;ctx.textAlign='center';ctx.fillText('📦',canvas.width/2,canvas.height/2)}particles=particles.filter(p=>p.life-->0);for(const p of particles){p.x+=p.vx;p.y+=p.vy;ctx.globalAlpha=p.life/30;ctx.fillStyle=p.color;ctx.beginPath();ctx.arc(p.x,p.y,Math.max(2,p.life/8),0,7);ctx.fill()}floating=floating.filter(f=>f.life-->0);for(const f of floating){f.y-=1;ctx.globalAlpha=f.life/90;ctx.font=`${32*canvas.width/400}px BungeeLocal`;ctx.strokeStyle='#fff';ctx.lineWidth=5;ctx.fillStyle='#0f766e';ctx.strokeText(f.text,f.x,f.y);ctx.fillText(f.text,f.x,f.y)}ctx.globalAlpha=1;requestAnimationFrame(render)}

ui.startBtn.onclick=()=>{initAudio();ui.startOverlay.style.display='none';chooseContainers()};
ui.sendBtn.onclick=nextItem;ui.auctionNext.onclick=()=> ui.auctionNext.textContent==='Yeni Konteyner'?(ui.auctionOverlay.classList.add('hidden'),chooseContainers()):runAuction();
document.querySelectorAll('.tool-btn').forEach(b=>b.onclick=()=>{tool=b.dataset.tool;document.querySelectorAll('.tool-btn').forEach(x=>x.classList.toggle('bg-teal-200',x===b));clickSfx?.play()});
canvas.addEventListener('pointerdown',e=>{initAudio();dragging=true;canvas.setPointerCapture(e.pointerId);scrub(e)});canvas.addEventListener('pointermove',scrub);canvas.addEventListener('pointerup',()=>{dragging=false;sample()});canvas.addEventListener('pointercancel',()=>dragging=false);window.addEventListener('resize',fit);window.addEventListener('pointerdown',initAudio,{once:true});
fit();updateUi();render();
