// Unlock My Heart - Mobile Puzzle + Story Prototype
(function(){
  const app = document.getElementById('app');
  const state = { screen:'menu', unlocked:[], level:0, storyQueue:null };

  const levels = [
    { id:1, title:'ด่าน 1: ความทรงจำแรก', img:'assets/level1.jpg', grid:3,
      storyBefore:[
        { text:'จำได้ไหม? วันที่เราได้เจอกันครั้งแรก
หัวใจมันเต้นแรงแบบบอกไม่ถูก ❤️' },
        { text:'วันนี้มาลองต่อภาพนี้ให้สมบูรณ์
เพื่อปลดล็อกข้อความจากใจเรากัน' }
      ],
      message:'เก่งมาก! ทุกชิ้นส่วนเหมือนความทรงจำของเรา ที่ลงตัวเสมอ',
      storyAfter:[ { text:'ต่อจิ๊กซอว์สำเร็จแล้ว เหมือนเราที่เติมเต็มกันและกัน' } ] },

    { id:2, title:'ด่าน 2: ทริปแรกของเรา', img:'assets/level2.jpg', grid:4,
      storyBefore:[ { text:'ทริปแรกที่เราไปด้วยกัน…
รอยยิ้มของเธอยังชัดอยู่ในใจ' }, { text:'ต่อภาพนี้ให้ครบ แล้วรับข้อความลับจากเรา' } ],
      message:'เราชอบเวลาที่ได้เดินข้าง ๆ กัน ไม่ว่าเส้นทางไหน',
      storyAfter:[ { text:'ตอนนั้นเราแอบคิดว่า… ถ้าได้ไปกับเธออีกสักพันครั้งก็คงดี' } ] },

    { id:3, title:'ด่าน 3: ของโปรดของเธอ', img:'assets/level3.jpg', grid:3,
      storyBefore:[ { text:'เราใส่ใจเรื่องเล็ก ๆ ของเธอเสมอ
ไม่ว่าจะเมนูโปรด เพลงโปรด หรือสีที่เธอชอบ' } ],
      message:'ทุกวันกับเธอคือของโปรดของเรา',
      storyAfter:[ { text:'พร้อมรับเซอร์ไพรส์สุดท้ายรึยัง? ไปกันเลย!' } ] }
  ];

  function h(tag, attrs={}, children=[]) {
    const el = document.createElement(tag);
    for (const k in attrs) {
      if (k === 'class') el.className = attrs[k];
      else if (k.startsWith('on') && typeof attrs[k] === 'function') el.addEventListener(k.substring(2), attrs[k]);
      else if (k === 'html') el.innerHTML = attrs[k];
      else el.setAttribute(k, attrs[k]);
    }
    for (const c of (Array.isArray(children)?children:[children])) {
      if (c == null) continue; if (typeof c === 'string') el.appendChild(document.createTextNode(c)); else el.appendChild(c);
    }
    return el;
  }
  function setScreen(name){ state.screen = name; render(); }

  function render(){
    app.innerHTML = '';
    const container = h('div', {class:'container'}, [ h('div', {class:'card'}, []) ]);
    const card = container.firstChild; app.appendChild(container);

    if (state.screen === 'menu') {
      card.appendChild(h('div', {class:'center'}, [ h('div', {class:'h1'}, 'Unlock My Heart'), h('p', {class:'p'}, 'เกมปริศนา + เนื้อเรื่องหวาน ๆ สำหรับเธอ') ]));
      card.appendChild(h('button', {class:'btn', onclick:()=>startLevel(0)}, 'เริ่มเกม'));
      card.appendChild(h('button', {class:'btn secondary', onclick:()=>setScreen('gallery')}, 'แกลเลอรี'));
      card.appendChild(h('div', {class:'footer'}, '© คุณสร้างด้วยความรัก'));
    }
    if (state.screen === 'gallery') {
      card.appendChild(h('div', {class:'header'}, [ h('button', {class:'icon-btn', onclick:()=>setScreen('menu')}, '← เมนู'), h('div', {class:'h1'}, 'แกลเลอรี'), h('span', {}) ]));
      const grid = h('div', {class:'gallery'}, []);
      const unlocked = state.unlocked.length ? state.unlocked : [];
      if (!unlocked.length) card.appendChild(h('p', {class:'p'}, 'ยังไม่มีอะไรปลดล็อก ลุยเล่นด่านกันก่อน!'));
      unlocked.forEach(u => grid.appendChild(h('img', {src: u.img, alt: u.title})));
      card.appendChild(grid);
      card.appendChild(h('button', {class:'btn ghost', onclick:()=>setScreen('menu')}, 'กลับ'));
    }
    if (state.screen === 'story') renderStory(card);
    if (state.screen === 'level') renderLevel(card);
    if (state.screen === 'ending') renderEnding();
  }

  function pushStory(scenes, next){ if (!scenes || !scenes.length) { next && next(); return; } state.storyQueue = { scenes: JSON.parse(JSON.stringify(scenes)), idx:0, onDone: next }; setScreen('story'); }

  function renderStory(card){
    const q = state.storyQueue; if (!q) { setScreen('menu'); return; }
    const s = q.scenes[q.idx];
    card.appendChild(h('div', {class:'header'}, [ h('button', {class:'icon-btn', onclick:()=>{ q.idx=q.scenes.length-1; render(); }}, 'ข้าม >>'), h('div', {class:'h1'}, 'เรื่องราวของเรา'), h('span') ]));
    if (s.img) { const img=new Image(); img.src=s.img; img.style.width='100%'; img.style.borderRadius='16px'; img.style.marginBottom='12px'; card.appendChild(img); }
    const p = h('p', {class:'p', html:(s.text||'').replace(/
/g,'<br>')}); p.style.fontSize='18px'; p.style.lineHeight='1.6'; card.appendChild(p);
    const dots = h('div', {class:'center', style:'margin:8px 0;'});
    for (let i=0;i<q.scenes.length;i++){ dots.appendChild(h('span', {html:'•', style:`font-size:20px; margin:0 4px; ${i===q.idx?'color:var(--red)':'color:#ffd1dc'}`})); }
    card.appendChild(dots);
    card.appendChild(h('button', {class:'btn', onclick:()=>{ if (q.idx<q.scenes.length-1){ q.idx++; render(); } else { const done=q.onDone; state.storyQueue=null; done&&done(); } }}, (q.idx<q.scenes.length-1?'ถัดไป':'เริ่มกันเลย')));
  }

  function renderLevel(card){
    const L = levels[state.level]; if (!L) { setScreen('menu'); return; }
    card.appendChild(h('div', {class:'header'}, [ h('button', {class:'icon-btn', onclick:()=>setScreen('menu')}, '←'), h('div', {class:'h1'}, L.title), h('img', {src:'assets/lock.png', alt:'lock', style:'width:28px;height:28px;opacity:.7'}) ]));
    card.appendChild(h('div', {class:'status'}, [ h('span', {class:'badge'}, `ตาราง ${L.grid}×${L.grid}`), h('div', {class:'progress'}, h('span', {id:'bar'})) ]));
    const gridEl = h('div', {class:'grid'}); card.appendChild(gridEl);
    card.appendChild(h('div', {style:'display:flex; gap:8px; margin-top:12px;'}, [ h('button', {class:'btn secondary', onclick:()=>setupPuzzle(L, gridEl)}, 'สับไพ่ใหม่'), h('button', {class:'btn', onclick:()=>solveDirect(L)}, 'ข้ามด่าน') ]));
    setupPuzzle(L, gridEl);
  }

  function setupPuzzle(L, gridEl){
    gridEl.innerHTML=''; const N=L.grid; gridEl.style.gridTemplateColumns=`repeat(${N}, 1fr)`;
    const tiles = []; for (let i=0;i<N*N;i++) tiles.push(i);
    for (let i=tiles.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [tiles[i],tiles[j]]=[tiles[j],tiles[i]]; }
    const bar=document.getElementById('bar'); let selected=null;
    function update(){ const elems=[...gridEl.children]; const order=elems.map(el=>+el.dataset.id); const right=order.reduce((a,v,i)=>a+(v===i?1:0),0); const pct=Math.round(100*right/(N*N)); bar.style.width=pct+'%'; elems.forEach((el,i)=>{ if(+el.dataset.id===i) el.classList.add('correct'); else el.classList.remove('correct'); }); if(pct===100) solved(); }
    function solved(){ setTimeout(()=>{ const Lc=levels[state.level]; if(!state.unlocked.find(u=>u.img===Lc.img)) state.unlocked.push({img:Lc.img,title:Lc.title}); showModal(Lc.message, ()=>{ const next=()=>{ state.level++; if(state.level>=levels.length) setScreen('ending'); else startLevel(state.level); }; pushStory(Lc.storyAfter, next); }); }, 250); }
    function tileEl(id){ const tile=h('div',{class:'tile'}); tile.dataset.id=id; tile.style.backgroundImage=`url(${L.img})`; tile.style.backgroundSize=`${N*100}% ${N*100}%`; const row=Math.floor(id/N); const col=id%N; tile.style.backgroundPosition=`${(col/(N-1))*100}% ${(row/(N-1))*100}%`; tile.addEventListener('click',()=>{ const elems=[...gridEl.children]; const idx=elems.indexOf(tile); if(selected==null){ selected=idx; tile.style.outline='3px solid var(--red)'; } else if(selected===idx){ tile.style.outline=''; selected=null; } else { const other=elems[selected]; other.style.outline=''; const after=(a,b)=> a.nextSibling===b?a:a.nextSibling; gridEl.insertBefore(other, after(tile, other)); gridEl.insertBefore(tile, elems[selected]); selected=null; update(); } }); return tile; }
    tiles.forEach(id=>gridEl.appendChild(tileEl(id))); update();
  }

  function solveDirect(L){ showModal('ข้ามด่านแล้วนะ ❤️', ()=>{ const Lc=levels[state.level]; if(!state.unlocked.find(u=>u.img===Lc.img)) state.unlocked.push({img:Lc.img,title:Lc.title}); pushStory(Lc.storyAfter, ()=>{ state.level++; if(state.level>=levels.length) setScreen('ending'); else startLevel(state.level); }); }); }
  function startLevel(i){ state.level=i; const L=levels[state.level]; pushStory(L.storyBefore, ()=> setScreen('level')); }

  function showModal(message, onClose){ let overlay=document.querySelector('.overlay'); if(!overlay){ overlay=h('div',{class:'overlay'}, h('div',{class:'modal'},[])); document.body.appendChild(overlay);} const modal=overlay.firstChild; modal.innerHTML=''; modal.appendChild(h('div',{class:'h1'},'ปลดล็อกสำเร็จ!')); modal.appendChild(h('p',{class:'p'},message)); modal.appendChild(h('button',{class:'btn',onclick:()=>{ overlay.classList.remove('show'); onClose&&onClose(); }},'ต่อไป')); overlay.classList.add('show'); }

  function renderEnding(){ app.innerHTML=''; const container=document.createElement('div'); container.className='container'; const card=document.createElement('div'); card.className='card center'; container.appendChild(card); card.appendChild(h('div',{class:'h1'},'เซอร์ไพรส์สุดท้าย')); card.appendChild(h('p',{class:'p'},'ขอบคุณที่เล่นเกมนี้ คุณคือคนพิเศษที่สุดของเรา ❤️')); const img=new Image(); img.src='assets/level1.jpg'; img.style.width='100%'; img.style.borderRadius='16px'; card.appendChild(img); card.appendChild(h('button',{class:'btn',onclick:()=>setScreen('menu')},'กลับสู่เมนู')); app.appendChild(container); }

  render();
})();
