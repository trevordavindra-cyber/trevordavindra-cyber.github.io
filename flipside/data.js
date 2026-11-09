window.FS=(function(){
const CATS=[["sneakers","Sneakers","👟"],["retro","Retro Games","🕹️"],["clothing","Brand Clothing","🧥"],["electronics","Electronics","🔌"],["toys","Toys & Collectibles","🧸"],["home","Home & Kitchen","🏠"]];
const G=[["#7c5cff","#ff4ecd"],["#ff8a3d","#ffd166"],["#22d3a5","#7c5cff"],["#ff4ecd","#ff8a3d"],["#3d9bff","#22d3a5"],["#ffd166","#ff4ecd"]];
const SEED=[
{id:"p1",name:"Retro Convoy 2000 Handheld",cat:"retro",e:"🎮",buy:18,price:59,compare:79,rating:4.7,rc:214,stock:3,cond:"Refurbished · boxed",desc:"Late-90s handheld console, fresh capacitors, original shell. The nostalgia play that keeps climbing.",tags:"retro console handheld games"},
{id:"p2",name:"AeroGrip '98 Reissue Sneakers",cat:"sneakers",e:"👟",buy:40,price:95,rating:4.5,rc:188,stock:5,cond:"New in box",desc:"Deadstock reissue in the colorway collectors hunt. Sizes run true.",tags:"sneakers shoes reissue"},
{id:"p3",name:"Canyon Denim Trucker Jacket",cat:"clothing",e:"🧥",buy:12,price:45,rating:4.3,rc:96,stock:2,cond:"Pre-owned · excellent",desc:"Heavy vintage denim, no seam fading, original label inside.",tags:"denim jacket vintage"},
{id:"p4",name:"Pixel Pals Figure — Series 2",cat:"toys",e:"🧸",buy:6,price:24,rating:4.8,rc:341,stock:8,cond:"New · sealed",desc:"Blind-box chase variant. Series 2 rares have doubled since spring.",tags:"figure collectible toy"},
{id:"p5",name:"Lumen Bluetooth Speaker",cat:"electronics",e:"🔊",buy:15,price:39,compare:49,rating:4.2,rc:127,stock:6,cond:"New · open box",desc:"Clearance grab: retail $49, we pass the margin to you.",tags:"speaker audio bluetooth"},
{id:"p6",name:"Vintage Film Camera M2",cat:"electronics",e:"📷",buy:25,price:88,rating:4.6,rc:73,stock:2,cond:"Pre-owned · tested",desc:"New light seals, shutter tested at all speeds. Film is back and prices show it.",tags:"camera film 35mm vintage"},
{id:"p7",name:"Cloudline Throw Blanket",cat:"home",e:"🛏️",buy:9,price:28,rating:4.4,rc:210,stock:10,cond:"New",desc:"Retail overstock, tags on. Always sells by late fall.",tags:"blanket home cozy"},
{id:"p8",name:"Steel Thermo Flask 32oz",cat:"home",e:"🥤",buy:7,price:22,rating:4.5,rc:512,stock:12,cond:"New",desc:"Liquidation-lot price, name-brand quality.",tags:"flask bottle water"},
{id:"p9",name:"Runner RG-7 Wireless Earbuds",cat:"electronics",e:"🎧",buy:11,price:34,compare:45,rating:4.1,rc:289,stock:7,cond:"New",desc:"Deal-bin electronics that flip fast on weekends.",tags:"earbuds audio wireless"},
{id:"p10",name:"Heritage Crewneck Sweatshirt",cat:"clothing",e:"👕",buy:10,price:32,rating:4.3,rc:154,stock:4,cond:"New",desc:"Brand knit, no pilling. Sizes M and L.",tags:"sweatshirt knitwear"},
{id:"p11",name:"Arcade Stick Classic",cat:"retro",e:"🕹️",buy:30,price:85,rating:4.6,rc:88,stock:2,cond:"Refurbished",desc:"Rebuilt stick and buttons, fights like new. The fighting-game scene keeps demand hot.",tags:"arcade controller fightstick"},
{id:"p12",name:"Merchants of the Dunes Board Game",cat:"toys",e:"🎲",buy:14,price:42,rating:4.7,rc:167,stock:3,cond:"New · shrink on",desc:"Out-of-print auction staple. Complete, unplayed.",tags:"board game oop"},
{id:"p13",name:"Halo Desk Lamp",cat:"home",e:"💡",buy:8,price:26,rating:4.2,rc:95,stock:5,cond:"New",desc:"Minimalist lamp from a store closing. Dorm-season favorite.",tags:"lamp lighting desk"},
{id:"p14",name:"Trail Cap All-Weather",cat:"clothing",e:"🧢",buy:5,price:18,rating:4.0,rc:62,stock:9,cond:"New",desc:"Impulse-buy cap that rounds out every cart.",tags:"cap hat outdoor"}
];
const FEES={ebay:{n:"eBay",rate:0.1325,flat:0.30},mercari:{n:"Mercari",rate:0.136,flat:0},facebook:{n:"Facebook Marketplace",rate:0,flat:0},poshmark:{n:"Poshmark",rate:0.20,flat:0}};
const ls=(k,f)=>{try{const v=localStorage.getItem(k);return v?JSON.parse(v):f}catch(e){return f}};
const sv=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}};
if(!ls("fs_products",null)) sv("fs_products",SEED);
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
