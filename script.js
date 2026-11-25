
/* ============ EDIT THIS SECTION ============ */
var CONFIG={
  whatsapp:'919999999999',          // country code + number, no + or spaces
  instagram:'gift_wrapping_chennai',
  /* DYNAMIC PHOTOS: paste the "Publish to web > CSV" link of a Google Sheet here.
     Sheet columns (row 1 = headings):  image | title | category
     "image" can be any image link or a Google Drive share link.
     Leave empty to use the PHOTOS list below. */
  sheetCsv:'https://docs.google.com/spreadsheets/d/e/2PACX-1vTnLNhAMJ7hXnoQ5I0cdLED3iJX2hUuMzoAjfc5sBd4GefqccK9BU24sByyC3n-pqjlGYUTbZe7ZAkd/pub?gid=0&single=true&output=csv '
};
var PHOTOS=[ /* fallback list: {img:'images/photo1.jpg',title:'Bridal trousseau',cat:'Trousseau'} */
 {img:'',title:'Bridal trousseau tray',cat:'Trousseau'},{img:'',title:'Festive hamper',cat:'Hampers'},{img:'',title:'Wedding return gifts',cat:'Return Gifts'},
 {img:'',title:'Corporate Diwali box',cat:'Corporate'},{img:'',title:'Regional craft basket',cat:'Hampers'},{img:'',title:'Engagement platter',cat:'Trousseau'},
 {img:'',title:'Baby shower favours',cat:'Return Gifts'},{img:'',title:'Festive gifting set',cat:'Festive'},{img:'',title:'Silk saree packing',cat:'Trousseau'},
 {img:'',title:'Executive gift hamper',cat:'Corporate'},{img:'',title:'Navratri return gifts',cat:'Festive'},{img:'',title:'Customised keepsake box',cat:'Hampers'}
];
/* ============================================ */

(function(){
var $=function(s,c){return(c||document).querySelector(s)},$$=function(s,c){return[].slice.call((c||document).querySelectorAll(s))};
var reduce=matchMedia('(prefers-reduced-motion:reduce)').matches,body=document.body,vh=innerHeight;
var clamp=function(v,a,b){return Math.max(a,Math.min(b,v))};
var GR=['linear-gradient(150deg,#3a1d12,#7a3b18)','linear-gradient(150deg,#2a1a10,#8a6a2a)','linear-gradient(150deg,#3b1620,#7a2a3a)','linear-gradient(150deg,#1d2a24,#3f5a46)','linear-gradient(150deg,#2b1f12,#b07a2a)'];
var AR=['4/5','1/1','3/4','4/5','5/6','1/1'];

/* mandala (preloader + logo) */
function mandala(el,n){var h='';for(var i=0;i<n;i++)h+='<ellipse cx="0" cy="-22" rx="9" ry="22" pathLength="1" transform="rotate('+(i*360/n)+')"/>';h+='<circle r="10" pathLength="1"/><circle r="52" pathLength="1"/>';el.innerHTML=h}
mandala($('#mand'),8);mandala($('#lm'),8);$('#lm').setAttribute('stroke-width','4');$$('#lm *').forEach(function(e){e.style.strokeDasharray='none'});

/* preloader */
function go(){$('#pre').classList.add('out');body.classList.remove('load');setTimeout(function(){body.classList.add('go')},500)}
if(reduce){body.classList.remove('load');body.classList.add('go');$('#pre').style.display='none'}else setTimeout(go,2400);

/* ---------- dynamic photos ---------- */
function drive(u){var m=u.match(/drive\.google\.com\/file\/d\/([^/]+)/)||u.match(/drive\.google\.com\/open\?id=([^&]+)/);return m?'https://drive.google.com/thumbnail?id='+m[1]+'&sz=w1200':u}
function csv(t){var rows=[],r=[],c='',q=false;for(var i=0;i<t.length;i++){var ch=t[i];
  if(q){if(ch=='"'){if(t[i+1]=='"'){c+='"';i++}else q=false}else c+=ch}
  else if(ch=='"')q=true;else if(ch==','){r.push(c);c=''}
  else if(ch=='\n'||ch=='\r'){if(ch=='\r'&&t[i+1]=='\n')i++;r.push(c);c='';rows.push(r);r=[]}else c+=ch}
  if(c||r.length){r.push(c);rows.push(r)}return rows}
function load(){
  if(!CONFIG.sheetCsv)return Promise.resolve(PHOTOS);
  return fetch(CONFIG.sheetCsv,{cache:'no-store'}).then(function(r){return r.text()}).then(function(t){
    var rows=csv(t).filter(function(r){return r[0]&&r[0].trim()});
    if(rows.length&&/image|photo|url|link/i.test(rows[0][0]))rows.shift();
    var out=rows.map(function(r){return{img:drive(r[0].trim()),title:(r[1]||'').trim(),cat:(r[2]||'Gifts').trim()}});
    return out.length?out:PHOTOS}).catch(function(){return PHOTOS});
}
function media(p,i){
  var ph='<div class="ph" style="--g:'+GR[i%GR.length]+';--ar:'+AR[i%AR.length]+'"><svg viewBox="0 0 48 48"><use href="#i'+(i%4)+'"/></svg></div>';
  return p.img?'<img src="'+p.img+'" alt="'+(p.title||'Gift creation')+'" loading="lazy" decoding="async" referrerpolicy="no-referrer" onerror="phf(this,'+i+')">':ph}
window.phf=function(el,i){var d=document.createElement('div');d.className='ph';d.style.cssText='--g:'+GR[i%GR.length]+';--ar:'+AR[i%AR.length];d.innerHTML='<svg viewBox="0 0 48 48"><use href="#i'+(i%4)+'"/></svg>';el.replaceWith(d)};

var items=[],shown=[],li=0;
function build(list){
  items=list;
  /* hero columns */
  var cols=[[],[],[]];for(var k=0;k<Math.max(9,list.length);k++)cols[k%3].push(k%list.length);
  $('#vis').innerHTML=cols.map(function(c,ci){var h=c.map(function(i){return'<div class="it">'+media(list[i],i)+'</div>'}).join('');return'<div class="col" style="--t:'+(34+ci*9)+'s">'+h+h+'</div>'}).join('');
  /* gallery */
  var cats=['All'].concat(list.map(function(p){return p.cat}).filter(function(c,i,a){return a.indexOf(c)===i}));
  var ch=$('#chips');ch.innerHTML='';
  cats.forEach(function(c,k){var b=document.createElement('button');b.textContent=c;b.setAttribute('aria-pressed',k===0);b.onclick=function(){
    $$('button',ch).forEach(function(x){x.setAttribute('aria-pressed',x===b)});
    $$('.gi').forEach(function(g){var m=c==='All'||g.dataset.c===c;
      if(m){g.style.display='';requestAnimationFrame(function(){g.classList.remove('out')})}
      else{g.classList.add('out');setTimeout(function(){if(g.classList.contains('out'))g.style.display='none'},380)}})};ch.appendChild(b)});
  $('#gl').innerHTML=list.map(function(p,i){return'<button class="gi rv" style="--d:'+((i%3)*.08)+'s" data-i="'+i+'" data-c="'+p.cat+'" aria-label="View '+(p.title||'photo')+'">'+media(p,i)+'<figcaption><small>'+p.cat+'</small><b>'+(p.title||'')+'</b></figcaption></button>'}).join('');
  $$('.gi').forEach(function(g){io.observe(g);g.onclick=function(){openLb(+g.dataset.i)}});
}

/* lightbox */
var lb=$('#lb'),lbox=$('#lbox');
function openLb(i){shown=$$('.gi').filter(function(g){return g.style.display!=='none'}).map(function(g){return+g.dataset.i});li=shown.indexOf(i);paint();lb.classList.add('open');$('#lx').focus()}
function paint(){var p=items[shown[li]],i=shown[li];lbox.innerHTML=media(p,i).replace('loading="lazy"','')+'<p><small>'+p.cat+'</small>'+(p.title||'')+'</p>'}
function step(d){li=(li+d+shown.length)%shown.length;paint()}
$('#lx').onclick=function(){lb.classList.remove('open')};$('#lp').onclick=function(){step(-1)};$('#ln').onclick=function(){step(1)};
lb.addEventListener('click',function(e){if(e.target===lb)lb.classList.remove('open')});
addEventListener('keydown',function(e){if(!lb.classList.contains('open'))return;if(e.key==='Escape')lb.classList.remove('open');if(e.key==='ArrowLeft')step(-1);if(e.key==='ArrowRight')step(1)});
var sx=0;lbox.addEventListener('pointerdown',function(e){sx=e.clientX});lbox.addEventListener('pointerup',function(e){var d=e.clientX-sx;if(Math.abs(d)>50)step(d>0?-1:1)});

/* reveal observer */
var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{threshold:.15});
$$('.rv').forEach(function(e){io.observe(e)});
build(PHOTOS);load().then(function(l){if(l!==PHOTOS)build(l)});

/* services */
var SV=[['Luxe Trousseau Packing','Bridal trays, saree packing and trousseau styling with regional crafts and rich finishes.'],['Gift Hampers','Curated hampers for birthdays, anniversaries and thank-yous, built around your recipient.'],['Return Gifts','Elegant favours for weddings, baby showers and housewarmings, from ten pieces to hundreds.'],['Corporate Gifting','Premium boxes for clients and teams, branded to your needs and delivered on schedule.'],['Festive Gifting','Diwali, Navratri, Pongal and more. Seasonal hampers designed early and sold out fast.'],['Fully Customised','Names, themes, colors and contents chosen by you. If you can imagine it, we can style it.']];
$('#sg').innerHTML=SV.map(function(s,i){return'<div class="sv rv" style="--d:'+((i%3)*.1)+'s"><div class="n">0'+(i+1)+'</div><h3>'+s[0]+'</h3><p>'+s[1]+'</p></div>'}).join('');
$$('.sv').forEach(function(c){io.observe(c);c.addEventListener('mousemove',function(e){var r=c.getBoundingClientRect();c.style.setProperty('--mx',(e.clientX-r.left)+'px');c.style.setProperty('--my',(e.clientY-r.top)+'px')})});

/* scrubbed statement */
var stm=$('#stm');stm.innerHTML=stm.textContent.split(' ').map(function(w){return'<span>'+w+'</span>'}).join(' ');var sw=$$('span',stm);

/* gold dust */
var cv=$('#dust'),cx=cv.getContext('2d'),P=[],W,H;
function rs(){W=cv.width=cv.offsetWidth;H=cv.height=cv.offsetHeight;P=[];for(var i=0;i<Math.round(W/28);i++)P.push({x:Math.random()*W,y:Math.random()*H,r:Math.random()*1.6+.4,v:Math.random()*.35+.1,a:Math.random()*6.28})}
rs();addEventListener('resize',rs);
var heroVis=true;new IntersectionObserver(function(e){heroVis=e[0].isIntersecting}).observe($('#hero'));
function dust(t){if(heroVis){cx.clearRect(0,0,W,H);P.forEach(function(p){p.y-=p.v;p.x+=Math.sin(p.a+t/1800)*.3;if(p.y<-4){p.y=H+4;p.x=Math.random()*W}
  cx.globalAlpha=.25+.55*Math.abs(Math.sin(p.a+t/900));cx.fillStyle='#EBD596';cx.beginPath();cx.arc(p.x,p.y,p.r,0,6.28);cx.fill()})}requestAnimationFrame(dust)}
if(!reduce)requestAnimationFrame(dust);

/* marquee + scroll loop + glow */
var mq=$('#mq'),mx=0,dir=-1,lastY=scrollY,vel=0,hd=$('#hd'),gx=0,gy=0,tx=0,ty=0,gl=$('#glow');
function frame(){
  var y=scrollY;vel+=((y-lastY)-vel)*.1;lastY=y;if(Math.abs(vel)>.5)dir=vel>0?-1:1;
  mx+=dir*(1+Math.abs(vel)*.35);var half=mq.scrollWidth/2;if(mx<=-half)mx+=half;if(mx>0)mx-=half;mq.style.transform='translateX('+mx+'px)';
  hd.classList.toggle('s',y>30);
  $('#bar').style.transform='scaleX('+clamp(y/(document.body.scrollHeight-vh),0,1)+')';
  var r=stm.getBoundingClientRect(),p=clamp((vh*.8-r.top)/(r.height+vh*.2),0,1),k=Math.floor(p*sw.length*1.05);
  sw.forEach(function(s,i){s.classList.toggle('on',i<k)});
  gx+=(tx-gx)*.1;gy+=(ty-gy)*.1;gl.style.transform='translate('+gx+'px,'+gy+'px)';
  requestAnimationFrame(frame)}
if(!reduce){frame();addEventListener('mousemove',function(e){tx=e.clientX;ty=e.clientY})}else sw.forEach(function(s){s.classList.add('on')});

/* count up */
var done=false;new IntersectionObserver(function(es){if(es[0].isIntersecting&&!done){done=true;
  $$('[data-n]').forEach(function(el){var end=+el.dataset.n,t0=null,s=el.dataset.s||'';
    (function st(t){t0=t0||t;var p=Math.min((t-t0)/1600,1),v=end*(1-Math.pow(1-p,3));el.textContent=(end<100?v.toFixed(1):Math.round(v))+s;if(p<1)requestAnimationFrame(st)})(performance.now())})}
},{threshold:.5}).observe($('.stats'));

/* form */
function pills(id,arr){var box=$(id),sel=0;arr.forEach(function(t,k){var b=document.createElement('button');b.type='button';b.textContent=t;b.setAttribute('aria-pressed',k===0);b.onclick=function(){sel=k;$$('button',box).forEach(function(x){x.setAttribute('aria-pressed',x===b)})};box.appendChild(b)});return function(){return arr[sel]}}
var gO=pills('#occ',['Wedding','Engagement','Baby shower','Festive','Corporate','Other']),gT=pills('#typ',['Trousseau','Hampers','Return gifts','Custom']);
$('#form').addEventListener('submit',function(e){e.preventDefault();var n=$('#n').value.trim(),p=$('#p').value.trim(),nt=$('#note');
  if(!n||!p){nt.textContent='Please enter your name and phone number.';return}
  var m='Hi Gift & Wrapping Chennai, I am '+n+' ('+p+'). I am looking for '+gT().toLowerCase()+' for a '+gO().toLowerCase()+($('#d').value?' on '+$('#d').value:'')+($('#q').value?', quantity '+$('#q').value:'')+'. '+$('#m').value.trim();
  nt.textContent='Opening WhatsApp...';window.open('https://wa.me/'+CONFIG.whatsapp+'?text='+encodeURIComponent(m),'_blank')});
$$('a[href^="https://wa.me/"]').forEach(function(a){a.href='https://wa.me/'+CONFIG.whatsapp});

/* menu */
var bg=$('#burger'),mn=$('#menu');
bg.onclick=function(){var o=mn.classList.toggle('open');bg.setAttribute('aria-expanded',o);bg.textContent=o?'Close':'Menu'};
$$('#menu a').forEach(function(a){a.addEventListener('click',function(){mn.classList.remove('open');bg.textContent='Menu'})});
})();
