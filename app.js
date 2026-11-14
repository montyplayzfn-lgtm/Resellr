const $=id=>document.getElementById(id);
let current=null;
const money=n=>new Intl.NumberFormat('en-GB',{style:'currency',currency:'GBP'}).format(n);
$('analysis-form').addEventListener('submit',e=>{
  e.preventDefault();
  const buy=Number($('buy').value),sell=Number($('sell').value),costs=Number($('costs').value||0);
  const profit=sell-buy-costs;
  current={product:$('product').value.trim(),brand:$('brand').value.trim(),size:$('size').value.trim(),condition:$('condition').value,platform:$('platform').value,buy,sell,costs,profit,date:new Date().toLocaleDateString('en-GB')};
  $('profit').textContent=money(profit);
  $('profit').style.color=profit>=0?'var(--green)':'#ff8b78';
  $('breakdown').textContent=`Sale ${money(sell)} − buy ${money(buy)} − other costs ${money(costs)}.`;
  $('verdict').textContent=profit>0?'Positive estimated margin':profit===0?'Break-even estimate':'Estimated loss';
  $('save').disabled=false;
});
function renderSaved(){
  const items=JSON.parse(localStorage.getItem('resellr-saved')||'[]');
  $('count').textContent=`${items.length} SAVED`;
  $('saved-list').innerHTML=items.length?items.map(x=>`<div class="saved-item"><div><strong>${escapeHtml(x.product)}</strong><small>${escapeHtml(x.brand||'Unbranded')} · ${escapeHtml(x.platform)} · ${x.date}</small></div><b>${money(x.profit)}</b></div>`).join(''):'Your saved product research will appear here on this device.';
  $('saved-list').className=items.length?'':'empty';
}
function escapeHtml(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
$('save').addEventListener('click',()=>{if(!current)return;const items=JSON.parse(localStorage.getItem('resellr-saved')||'[]');items.unshift(current);localStorage.setItem('resellr-saved',JSON.stringify(items.slice(0,30)));renderSaved();$('save').textContent='Saved ✓';});
if('serviceWorker' in navigator){window.addEventListener('load',()=>navigator.serviceWorker.register('/sw.js').catch(()=>{}));}
renderSaved();
