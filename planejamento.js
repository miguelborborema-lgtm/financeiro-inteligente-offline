
'use strict';
(() => {
  const KEY = 'financeiro_inteligente_planejamento_v1';
  const ids = ['fdIncome','fdEssentials','fdPersonal','fdReserve','fdGoal','fdSaved'];
  const $ = id => document.getElementById(id);
  const money = n => new Intl.NumberFormat('pt-BR',{style:'currency',currency:'BRL'}).format(n);
  const defaults = () => ({income:0,essentials:50,personal:30,reserve:20,goal:0,saved:0});
  const num = id => Number($(id).value);
  const valid = data => data && typeof data === 'object' && !Array.isArray(data) &&
    ['income','goal','saved'].every(k => typeof data[k] === 'number' && Number.isFinite(data[k]) && data[k]>=0 && data[k]<=999999999) &&
    ['essentials','personal','reserve'].every(k => Number.isInteger(data[k]) && data[k]>=0 && data[k]<=100) &&
    data.essentials+data.personal+data.reserve===100;
  const values = () => ({income:num('fdIncome'),essentials:num('fdEssentials'),personal:num('fdPersonal'),reserve:num('fdReserve'),goal:num('fdGoal'),saved:num('fdSaved')});
  const display = data => { for(const [id,key] of [['fdIncome','income'],['fdEssentials','essentials'],['fdPersonal','personal'],['fdReserve','reserve'],['fdGoal','goal'],['fdSaved','saved']]) $(id).value = data[key] || (['fdEssentials','fdPersonal','fdReserve'].includes(id)?0:''); update(); };
  function update(){
    const d=values(); const validNumbers=ids.every(id=>$(id).value==='' || (Number.isFinite(num(id)) && num(id)>=0 && num(id)<=999999999));
    const pctValid=['essentials','personal','reserve'].every(k=>Number.isInteger(d[k])&&d[k]>=0&&d[k]<=100);
    const total=d.essentials+d.personal+d.reserve;
    const ok=validNumbers&&pctValid&&total===100;
    $('fdValidation').textContent=!validNumbers?'Informe valores válidos e não negativos.':!pctValid?'Os percentuais devem ser números inteiros de 0 a 100.':total!==100?`Os percentuais somam ${total}%. Ajuste para 100%.`:'';
    for(const [key,cap] of [['essentials','Essentials'],['personal','Personal'],['reserve','Reserve']]){
      $("fd"+cap+"Label").textContent=d[key]+'%';
      $('fd'+cap+'Value').textContent=ok?money(Math.round(d.income*d[key])/100):'—';
      $('fd'+cap+'Bar').style.width=ok?d[key]+'%':'0%';
    }
    $('fdSave').disabled=!ok;
    const remaining=Math.max(0,d.goal-d.saved);const monthly=ok?Math.round(d.income*d.reserve)/100:0;
    $('fdGoalResult').textContent=!ok?'Corrija os percentuais para simular.':d.goal<=0?'Informe o valor do objetivo para simular.':remaining===0?'Objetivo já alcançado com o valor informado.':monthly<=0?'Defina uma renda e um percentual para reserva acima de zero.':`Guardando ${money(monthly)} por mês, você poderia alcançar o objetivo em aproximadamente ${Math.ceil(remaining/monthly)} mês(es), sem considerar rendimentos.`;
    return ok;
  }
  function save(){if(!update())return false;try{localStorage.setItem(KEY,JSON.stringify(values()));$('fdSaveStatus').textContent='Planejamento salvo neste navegador. Inclua-o no seu backup JSON.';return true;}catch(e){$('fdSaveStatus').textContent='Não foi possível salvar. Verifique o armazenamento do navegador.';return false;}}
  function getData(){try{const d=JSON.parse(localStorage.getItem(KEY));return valid(d)?d:defaults();}catch(e){return defaults();}}
  function setData(d){if(!valid(d))return false;try{localStorage.setItem(KEY,JSON.stringify(d));display(d);return true;}catch(e){return false;}}
  function clearData(){try{localStorage.removeItem(KEY);display(defaults());return true;}catch(e){return false;}}
  window.FIPlanning={getData,setData,clearData,validateData:valid};
  const saved=getData();display(saved);
  for(const id of ids)$(id).addEventListener('input',()=>{update();$('fdSaveStatus').textContent='Alterações ainda não salvas.';});
  $('fdSave').addEventListener('click',save);
  $('fdReset').addEventListener('click',()=>{const d=values();display({...d,essentials:50,personal:30,reserve:20});$('fdSaveStatus').textContent='Clique em Salvar planejamento para confirmar.';});
  $('fdUseMonth').addEventListener('click',()=>{const month=Number($('monthSelect').value)+1,year=Number($('yearSelect').value);let total=0;try{const arr=JSON.parse(localStorage.getItem('financeiro_inteligente_offline_v1'))||[];if(Array.isArray(arr))for(const t of arr)if(t.type==='receita'&&Number(t.date.slice(0,4))===year&&Number(t.date.slice(5,7))===month&&Number.isFinite(t.amount))total+=t.amount;}catch(e){}$('fdIncome').value=total.toFixed(2);update();$('fdSaveStatus').textContent='Receitas carregadas. Clique em Salvar planejamento.';});
})();
