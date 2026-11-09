window.FS=(function(){
const CATS=[["sneakers","Sneakers","👟"],["retro","Retro Games","🕹️"],["clothing","Brand Clothing","🧥"],["electronics","Electronics","🔌"],["toys","Toys & Collectibles","🧸"],["home","Home & Kitchen","🏠"]];
const G=[["#7c5cff","#ff4ecd"],["#ff8a3d","#ffd166"],["#22d3a5","#7c5cff"],["#ff4ecd","#ff8a3d"],["#3d9bff","#22d3a5"],["#ffd166","#ff4ecd"]];
// real mode: no demo catalog. every item comes from the boss console.
const SEED=[];
const SEEDV=2;
const FEES={ebay:{n:"eBay",rate:0.1325,flat:0.30},mercari:{n:"Mercari",rate:0.136,flat:0},facebook:{n:"Facebook Marketplace",rate:0,flat:0},poshmark:{n:"Poshmark",rate:0.20,flat:0}};
const ls=(k,f)=>{try{const v=localStorage.getItem(k);return v?JSON.parse(v):f}catch(e){return f}};
const sv=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}};
// wipe demo products/orders once when real mode activates (their own finds in fs_opps are kept)
if(ls("fs_seedv",0)!==SEEDV){sv("fs_products",SEED);sv("fs_orders",[]);sv("fs_seedv",SEEDV);}
function score(o){
  const f=FEES[o.mkt]||FEES.ebay;
  const fees=Math.round(((o.sell*f.rate+f.flat)+Number.EPSILON)*100)/100;
  const profit=Math.round(((o.sell-o.buy-o.ship-fees)+Number.EPSILON)*100)/100;
  const margin=o.sell>0?profit/o.sell:0;
  const roi=(o.buy+o.ship)>0?profit/(o.buy+o.ship):0;
  const set=ls("fs_settings",{minMargin:0.25,budget:200});
  let verdict="PASS";
  if(profit>=5&&margin>=set.minMargin) verdict="GO";
  else if(profit>0) verdict="WATCH";
  return {fees,profit,margin,roi,verdict,set};
}
const money=n=>"$"+(Math.round(n*100)/100).toFixed(2);
return {CATS,G,FEES,ls,sv,score,money};
})();
