 'use strict';
(()=>{
const $=id=>document.getElementById(id),KEY='financeiro_inteligente_patrimonio_v1',BRL=n=>new Intl.NumberFormat('pt-BR',{style:'currency',currency:'BRL'}).format(n),defaults={target:30000,initial:0,deposit:500,deadline:'2027-06',benchmark:'cdi',cdbPct:100,customRate:8};
const valid=d=>!!d&&typeof d==='object'&&['target','initial','deposit','cdbPct','customRate'].every(k=>Number.isFinite(d[k])&&d[k]>=0&&d[k]<=1e9)&&d.target>0&&/^\d{4}-(0[1-9]|1[0-2])$/.test(d.deadline)&&['zero','selic','cdi','cdb','custom'].includes(d.benchmark);
// Campos monetários: a apresentação é pt-BR, mas os cálculos recebem números reais.
const moneyIds=['pmTarget','pmInitial','pmDeposit'];
const parseMoney=value=>{
 let s=String(value??'').replace(/\s|R\$/gi,'').trim();
 if(!s)return NaN;
 if(!/^[0-9.,]+$/.test(s))return NaN;
 const comma=s.lastIndexOf(','),dot=s.lastIndexOf('.');
 if(comma>=0){s=s.replace(/\./g,'').replace(',','.');}
 else if(dot>=0){
   // Em pt-BR, 30.000 representa trinta mil; 1200.50 representa decimal.
   if(/^\d{1,3}(\.\d{3})+$/.test(s))s=s.replace(/\./g,'');
   else if((s.match(/\./g)||[]).length>1)return NaN;
 }
 const n=Number(s);return Number.isFinite(n)?n:NaN;
};
const moneyValue=id=>parseMoney($(id).value);
const formatMoney=id=>{const el=$(id),n=moneyValue(id);if(Number.isFinite(n)&&n>=0)el.value=BRL(n);};
const read=()=>({target:moneyValue('pmTarget'),initial:moneyValue('pmInitial'),deposit:moneyValue('pmDeposit'),deadline:$('pmDeadline').value,benchmark:$('pmBenchmark').value,cdbPct:+$('pmCdbPct').value,customRate:+$('pmCustomRate').value});
const set=d=>{if(!valid(d))return false;for(const [k,id] of Object.entries({target:'pmTarget',initial:'pmInitial',deposit:'pmDeposit',deadline:'pmDeadline',benchmark:'pmBenchmark',cdbPct:'pmCdbPct',customRate:'pmCustomRate'}))$(id).value=d[k];moneyIds.forEach(formatMoney);update();return true;};
const rate=d=>({zero:0,selic:13.75,cdi:13.65,cdb:13.65*d.cdbPct/100,custom:d.customRate})[d.benchmark]/100;
const balance=(initial,deposit,r,n)=>r===0?initial+deposit*n:initial*Math.pow(1+r,n)+deposit*(Math.pow(1+r,n)-1)/r;
const monthsTo=(d,r)=>{if(d.initial>=d.target)return 0;if(d.deposit<=0&&r<=0)return null;let lo=0,hi=1200;if(balance(d.initial,d.deposit,r,hi)<d.target)return null;while(lo<hi){const mid=Math.floor((lo+hi)/2);if(balance(d.initial,d.deposit,r,mid)>=d.target)hi=mid;else lo=mid+1;}return lo;};
const horizon=d=>{const now=new Date();const [y,m]=d.deadline.split('-').map(Number);return Math.max(0,(y-now.getFullYear())*12+m-(now.getMonth()+1)+1);};
function update(){const d=read();$('pmCdbWrap').hidden=d.benchmark!=='cdb';$('pmCustomWrap').hidden=d.benchmark!=='custom';if(!valid(d)||d.cdbPct>300||d.customRate>100){$('pmSummary').textContent='Informe valores válidos para calcular.';return;}const r=Math.pow(1+rate(d),1/12)-1,n=horizon(d),m=monthsTo(d,r),future=balance(d.initial,d.deposit,r,n),factor=r===0?n:(Math.pow(1+r,n)-1)/r,required=Math.max(0,(d.target-d.initial*Math.pow(1+r,n))/(factor||1));$('pmMonths').textContent=m===null?'Mais de 100 anos':m===0?'Meta alcançada':m+' meses';$('pmAtDeadline').textContent=BRL(future);$('pmRequired').textContent=n===0?'Prazo encerrado':BRL(required);$('pmYield').textContent=BRL(Math.max(0,future-d.initial-d.deposit*n));$('pmPrincipal').textContent=BRL(d.initial+d.deposit*n);$('pmInterest').textContent=BRL(Math.max(0,future-d.initial-d.deposit*n));$('pmSummary').textContent=n===0?'Escolha uma data futura para simular.':future>=d.target?'No cenário escolhido, sua meta seria atingida até a data informada.':`No cenário escolhido, faltariam ${BRL(d.target-future)} na data. Para alcançar a meta nesse prazo, o aporte mensal estimado seria ${BRL(required)}.`;const end=Math.max(1,Math.min(120,n||24)),steps=Math.min(28,end),vals=Array.from({length:steps},(_,i)=>balance(d.initial,d.deposit,r,Math.round((i+1)*end/steps))),max=Math.max(...vals,1);$('pmProjection').replaceChildren(...vals.map(v=>{const el=document.createElement('i');el.style.height=Math.max(2,100*v/max)+'%';el.title=BRL(v);return el;}));}
function save(){const d=read();if(!valid(d)||d.cdbPct>300||d.customRate>100){$('pmStatus').textContent='Confira os valores antes de salvar.';return;}try{localStorage.setItem(KEY,JSON.stringify(d));$('pmStatus').textContent='Meta salva neste navegador.';}catch(e){$('pmStatus').textContent='Não foi possível salvar. Faça backup dos dados.';}}
window.FIPatrimonio={getData:()=>read(),setData:d=>{if(!set(d))return false;try{localStorage.setItem(KEY,JSON.stringify(d));return true;}catch(e){return false;}},clearData:()=>{try{localStorage.removeItem(KEY);set(defaults);return true;}catch(e){return false;}},validateData:valid};
try{const d=JSON.parse(localStorage.getItem(KEY));set(valid(d)?d:defaults);}catch(e){set(defaults);}
for(const el of document.querySelectorAll('#patrimonio input,#patrimonio select'))el.addEventListener('input',update);
for(const id of moneyIds){
 const el=$(id);
 el.addEventListener('focus',()=>{const n=moneyValue(id);if(Number.isFinite(n))el.value=n.toFixed(2).replace('.',',');el.select();});
 el.addEventListener('blur',()=>{formatMoney(id);update();});
}$('pmSave').addEventListener('click',save);
$('pmDownload').addEventListener('click',()=>{const d=read();if(!valid(d))return;const r=Math.pow(1+rate(d),1/12)-1,n=horizon(d),value=balance(d.initial,d.deposit,r,n);const lines=['MANUAL DO PATRIMÔNIO — FINANCEIRO INTELIGENTE','',`Objetivo: ${BRL(d.target)}`,`Patrimônio inicial: ${BRL(d.initial)}`,`Aporte mensal: ${BRL(d.deposit)}`,`Prazo: ${d.deadline}`,`Taxa anual simulada: ${(rate(d)*100).toFixed(2)}%`,`Valor bruto projetado: ${BRL(value)}`,'','1. Registre receitas e despesas para conhecer sua capacidade de poupança.','2. Crie uma reserva de emergência adequada às suas necessidades.','3. Defina meta, prazo e aporte mensal realista.','4. Considere liquidez, riscos, impostos e custos antes de investir.','5. Revise a estratégia mensalmente e ajuste suas projeções.','','Referências: Banco Central (bcb.gov.br), Portal do Investidor (gov.br/investidor), Tesouro Direto (tesourodireto.com.br).','Simulação educativa, não representa rentabilidade garantida. Taxas de referência de setembro/outubro de 2026. Não inclui impostos, custos ou inflação.'];const blob=new Blob([lines.join('\n')],{type:'text/plain;charset=utf-8'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='Manual_do_Patrimonio.txt';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);});
})();