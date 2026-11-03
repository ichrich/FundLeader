const types=[['01','Монолитная плита','Сплошное железобетонное основание под всей площадью здания.','Для домов с различными материалами стен; параметры определяются расчетом.','slab'],['02','Ленточный фундамент','Железобетонная лента под несущими стенами дома.','Выбор глубины и сечения зависит от грунта и нагрузок.','strip'],['03','Свайно-ростверковый','Сваи, объединенные ростверком в единую конструкцию.','Решение для передачи нагрузки на расчетные слои грунта.','piles'],['04','Утепленная шведская плита (УШП)','Основание с теплоизоляцией и инженерными коммуникациями.','Требует заранее согласованного проекта инженерных систем.','warm']];
document.getElementById('typeCards').innerHTML=types.map(([n,title,desc,note,kind])=>`<article class="type-card"><div class="diagram ${kind}" aria-hidden="true"><img src="assets/foundation-${kind}.svg" alt="" width="600" height="400" loading="lazy"></div><div class="card-copy"><h3>${title}</h3><p>${desc}</p><p class="micro">${note}</p><a href="#cost" data-type="${title}">Рассчитать этот тип</a></div></article>`).join('');
document.querySelectorAll('[data-type]').forEach(a=>a.addEventListener('click',()=>{document.getElementById('foundation').value=a.dataset.type;}));
document.getElementById('estimate').addEventListener('submit',e=>{e.preventDefault();document.getElementById('estimateResult').textContent=`Параметры: ${document.getElementById('foundation').value}, ${document.getElementById('area').value} м², ${document.getElementById('wall').value.toLowerCase()}. Для сметы потребуются проект и данные участка. Это демонстрация. заявка не отправлена.`;});
document.getElementById('contactForm').addEventListener('submit',e=>{e.preventDefault();document.getElementById('contactResult').textContent='На готовом сайте здесь будет отправка заявки менеджеру. Сейчас это демонстрация: данные никуда не отправлены.';});

document.querySelector('[data-usp]').addEventListener('click',()=>{document.getElementById('foundation').value='Утепленная шведская плита (УШП)';});
const reducedMotion=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if ('IntersectionObserver' in window && !reducedMotion) {
 const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('is-visible');observer.unobserve(entry.target);}}),{threshold:0.08});
 document.querySelectorAll('.section-heading,.type-card,.engineering-visual,.engineering>div:last-child,.scope-grid>p,.steps article,.work-grid article,.faq>div,.contact>div').forEach((el,i)=>{el.classList.add('reveal');el.style.setProperty('--delay',`${(i%4)*65}ms`);observer.observe(el);});
}

// FAQ animation adapted from the supplied universal landing template.
document.querySelectorAll('.faq details').forEach(details=>{
 const summary=details.querySelector('summary');
 const answer=document.createElement('div');answer.className='faq-answer';
 while(summary.nextSibling)answer.append(summary.nextSibling);
 details.append(answer);
 let animation=null;
 let expanded=details.open;
 summary.addEventListener('click',event=>{
  event.preventDefault();expanded=!expanded;
  const from=details.getBoundingClientRect().height;
  if(animation){animation.cancel();animation=null;}
  details.open=true;
  details.classList.toggle('is-expanded',expanded);
  const to=expanded?details.getBoundingClientRect().height:summary.getBoundingClientRect().height+46+1;
  if(window.matchMedia('(prefers-reduced-motion: reduce)').matches){details.open=expanded;return;}
  details.style.overflow='hidden';
  animation=details.animate([{height:from+'px'},{height:to+'px'}],{duration:360,easing:'cubic-bezier(.22,1,.36,1)'});
  animation.onfinish=()=>{details.open=expanded;details.style.overflow='';animation=null;};
 });
});

// Keep native selects as the form values; render consistent option panels.
document.querySelectorAll('select').forEach(select=>{
 const wrapper=document.createElement('div');wrapper.className='select-control';select.before(wrapper);wrapper.append(select);
 const trigger=document.createElement('button');trigger.type='button';trigger.className='select-trigger';trigger.id=select.id+'-trigger';trigger.setAttribute('aria-haspopup','listbox');trigger.setAttribute('aria-expanded','false');
 const label=document.querySelector(`label[for="${select.id}"]`);if(label){label.id=select.id+'-label';trigger.setAttribute('aria-labelledby',label.id+' '+trigger.id);label.htmlFor=trigger.id;}
 const panel=document.createElement('ul');panel.className='select-options';panel.id=select.id+'-options';panel.setAttribute('role','listbox');panel.setAttribute('aria-labelledby',label?label.id:trigger.id);panel.hidden=true;trigger.setAttribute('aria-controls',panel.id);
 const sync=()=>{trigger.textContent=select.selectedOptions[0]?.textContent||'';Array.from(panel.children).forEach((item,i)=>item.setAttribute('aria-selected',String(i===select.selectedIndex)));};
 const close=()=>{panel.hidden=true;trigger.setAttribute('aria-expanded','false');};
 Array.from(select.options).forEach((option,i)=>{const item=document.createElement('li');item.className='select-option';item.setAttribute('role','option');item.tabIndex=-1;item.textContent=option.textContent;item.addEventListener('click',()=>{select.selectedIndex=i;select.dispatchEvent(new Event('change',{bubbles:true}));close();trigger.focus();});item.addEventListener('keydown',event=>{let next=i;if(event.key==='ArrowDown')next=(i+1)%panel.children.length;else if(event.key==='ArrowUp')next=(i-1+panel.children.length)%panel.children.length;else if(event.key==='Home')next=0;else if(event.key==='End')next=panel.children.length-1;else if(event.key==='Enter'||event.key===' '){event.preventDefault();item.click();return;}else if(event.key==='Escape'||event.key==='Tab'){close();if(event.key==='Escape'){event.preventDefault();trigger.focus();}return;}else return;event.preventDefault();panel.children[next].focus();});panel.append(item);});
 const open=()=>{document.dispatchEvent(new Event('close-selects'));sync();panel.hidden=false;trigger.setAttribute('aria-expanded','true');panel.children[select.selectedIndex]?.focus();};
 trigger.addEventListener('click',()=>panel.hidden?open():close());trigger.addEventListener('keydown',event=>{if(event.key==='ArrowDown'||event.key==='ArrowUp'){event.preventDefault();open();}});select.addEventListener('change',sync);document.addEventListener('close-selects',close);document.addEventListener('click',event=>{if(!wrapper.contains(event.target))close();});wrapper.addEventListener('focusout',()=>{setTimeout(()=>{if(!wrapper.contains(document.activeElement))close();},0);});
 wrapper.append(trigger,panel);select.classList.add('select-native');select.required=false;select.tabIndex=-1;sync();
});
document.querySelectorAll('[data-type],[data-usp]').forEach(link=>link.addEventListener('click',()=>document.getElementById('foundation').dispatchEvent(new Event('change'))));
