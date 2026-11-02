const types=[['01','Монолитная плита','Сплошное железобетонное основание под всей площадью здания.','Для домов с различными материалами стен; параметры определяются расчетом.','slab'],['02','Ленточный фундамент','Железобетонная лента под несущими стенами дома.','Выбор глубины и сечения зависит от грунта и нагрузок.','strip'],['03','Свайно-ростверковый','Сваи, объединенные ростверком в единую конструкцию.','Решение для передачи нагрузки на расчетные слои грунта.','piles'],['04','Утепленная шведская плита (УШП)','Основание с теплоизоляцией и инженерными коммуникациями.','Требует заранее согласованного проекта инженерных систем.','warm']];
document.getElementById('typeCards').innerHTML=types.map(([n,title,desc,note,kind])=>`<article class="type-card"><div class="diagram ${kind}" aria-hidden="true"><div class="base"></div><span>${n} / СХЕМА КОНСТРУКЦИИ</span></div><div class="card-copy"><h3>${title}</h3><p>${desc}</p><p class="micro">${note}</p><a href="#cost" data-type="${title}">Рассчитать этот тип</a></div></article>`).join('');
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
