(() => {
  'use strict';
  const root=document.querySelector('[data-content-root]');
  const params=new URLSearchParams(location.search);
  const id=params.get('id')||'';
  const requested=(params.get('lang')||'pt').toLowerCase();
  const esc=s=>String(s??'').replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
  const textFor=(obj,lang,fallback='')=>typeof obj==='string'?obj:(obj&&(obj[lang]||obj.pt||obj.en))||fallback;
  const fmt=(iso,lang)=>{if(!/^\d{4}-\d{2}-\d{2}$/.test(iso||''))return '';return new Intl.DateTimeFormat(lang==='en'?'en-US':'pt-BR',{day:'2-digit',month:'short',year:'numeric',timeZone:'UTC'}).format(new Date(iso+'T00:00:00Z')).replace('.','');};
  const pathFor=(map,lang)=>map&&typeof map==='object'?map[lang]:null;
  async function init(){
    try{
      const r=await fetch('data/biblioteca.json',{cache:'no-store'}); if(!r.ok)throw new Error('catalog');
      const payload=await r.json(); const items=Array.isArray(payload)?payload:(payload.items||[]);
      const item=items.find(x=>x.slug===id && x.published!==false); if(!item)throw new Error('notfound');
      const lang=item.languages.includes(requested)?requested:(item.defaultLanguage&&item.languages.includes(item.defaultLanguage)?item.defaultLanguage:item.languages[0]);
      const isEn=lang==='en'; const contentPath=pathFor(item.content,lang); if(!contentPath)throw new Error('nocontent');
      const cr=await fetch(contentPath,{cache:'no-store'}); if(!cr.ok)throw new Error('content'); const body=await cr.text();
      const langLinks=item.languages.map(l=>`<a class="btn ${l===lang?'btn-primary':'btn-secondary'}" href="conteudo.html?id=${encodeURIComponent(item.slug)}&lang=${l}">${l==='pt'?'Português':'English'}</a>`).join('');
      const pdfPath=pathFor(item.pdf,lang);
      const pdf=pdfPath?`<div class="content-download"><div><strong>${isEn?'PDF version':'Versão em PDF'}</strong><p>${isEn?'Open or save the formatted PDF version of this publication.':'Abra ou salve a versão diagramada desta publicação em PDF.'}</p></div><a class="btn btn-primary" href="${esc(pdfPath)}" target="_blank" rel="noopener noreferrer">${isEn?'Open PDF':'Abrir PDF'} ↗</a></div>`:'';
      const updated=item.updated&&item.updated!==item.date?`<span>${isEn?'Updated':'Atualizado'}: ${fmt(item.updated,lang)}</span>`:'';
      root.innerHTML=`<a class="content-back" href="biblioteca.html">← ${isEn?'Back to library':'Voltar à biblioteca'}</a><article><header class="content-head"><span class="eyebrow">${esc(item.area)} · ${esc(item.subarea)}</span><h1>${esc(textFor(item.title,lang,item.slug))}</h1><p class="content-summary">${esc(textFor(item.description,lang,''))}</p><div class="content-meta"><span>${esc(item.type)}</span><span>${esc(item.level)}</span><span>${fmt(item.date,lang)}</span>${updated}</div>${item.languages.length>1?`<div class="content-lang-actions">${langLinks}</div>`:''}</header><div class="content-body">${body}${pdf}</div></article>`;
      document.documentElement.lang=lang==='en'?'en':'pt-BR'; document.title=textFor(item.title,lang,item.slug)+' | Biblioteca';
      const meta=document.querySelector('meta[name="description"]'); if(meta)meta.setAttribute('content',textFor(item.description,lang,'Publicação da Biblioteca de Leandro M. Justino.'));
    }catch(err){
      const messages={notfound:'Conteúdo não encontrado ou ainda não publicado.',nocontent:'O conteúdo foi cadastrado, mas o arquivo de leitura deste idioma ainda não foi configurado.',content:'O arquivo de leitura não pôde ser carregado.',catalog:'O catálogo não pôde ser carregado.'};
      root.innerHTML=`<a class="content-back" href="biblioteca.html">← Voltar à biblioteca</a><div class="content-error"><h1>Não foi possível abrir esta publicação.</h1><p>${messages[err.message]||'Verifique os arquivos e abra o projeto pelo Live Server do VS Code.'}</p></div>`;
      console.error(err);
    }
  }
  init();
})();