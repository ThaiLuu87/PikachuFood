/* Food sprite library — each draws in a 0..100 box, top-left at origin.
   Renderer sets translate/scale + lineWidth/stroke before calling. */
(function(){
const OL = '#23121c';
// build a path then fill+stroke
function P(c, fill, build, stroke){
  c.beginPath(); build(c);
  if(fill){ c.fillStyle = fill; c.fill(); }
  if(stroke !== false) c.stroke();
}
function rrp(c,x,y,w,h,r){
  c.moveTo(x+r,y);
  c.arcTo(x+w,y,x+w,y+h,r); c.arcTo(x+w,y+h,x,y+h,r);
  c.arcTo(x,y+h,x,y,r); c.arcTo(x,y,x+w,y,r); c.closePath();
}
function el(c,x,y,rx,ry,rot){ c.ellipse(x,y,rx,ry,rot||0,0,Math.PI*2); }
function dot(c,col,x,y,r){ c.beginPath(); c.arc(x,y,r,0,7); c.fillStyle=col; c.fill(); }
// thin outlined line (stem)
function stem(c,col,w,pts){ c.beginPath(); c.moveTo(pts[0],pts[1]); for(let i=2;i<pts.length;i+=2)c.lineTo(pts[i],pts[i+1]); c.lineWidth=w; c.strokeStyle=col; c.stroke(); c.lineWidth=5; c.strokeStyle=OL; }

const I = {};

I.eggplant=function(c){
  P(c,'#7e2f95',cc=>el(cc,53,60,20,29,-0.12));
  P(c,'#a04cb6',cc=>el(cc,45,52,6,15,-0.2),false);
  P(c,'#4ea03b',cc=>{cc.moveTo(53,38);cc.lineTo(40,26);cc.lineTo(49,32);cc.lineTo(45,18);cc.lineTo(55,30);cc.lineTo(63,20);cc.lineTo(59,33);cc.lineTo(68,30);cc.closePath();});
};
I.redcan=function(c){ // coke
  P(c,'#d8202c',cc=>rrp(cc,33,22,34,58,9));
  P(c,'#b01622',cc=>rrp(cc,58,24,8,54,5),false);
  P(c,'#9b9b9b',cc=>rrp(cc,35,16,30,10,4));
  P(c,'#f2f2f2',cc=>{cc.moveTo(36,52);cc.bezierCurveTo(46,44,54,60,64,50);cc.lineTo(64,58);cc.bezierCurveTo(54,68,46,52,36,60);cc.closePath();},false);
};
I.pepsi=function(c){ // blue can
  P(c,'#1660c8',cc=>rrp(cc,33,22,34,58,9));
  P(c,'#0c46a0',cc=>rrp(cc,58,24,8,54,5),false);
  P(c,'#9b9b9b',cc=>rrp(cc,35,16,30,10,4));
  P(c,'#ffffff',cc=>el(cc,50,50,13,13),true);
  P(c,'#e23',cc=>{cc.moveTo(37,46);cc.bezierCurveTo(50,42,50,42,63,46);cc.lineTo(63,50);cc.bezierCurveTo(50,46,50,46,37,50);cc.closePath();},false);
  P(c,'#1660c8',cc=>{cc.moveTo(37,52);cc.bezierCurveTo(50,56,50,56,63,52);cc.lineTo(63,55);cc.bezierCurveTo(50,59,50,59,37,55);cc.closePath();},false);
};
I.maki=function(c){ // dark sushi roll, rainbow center
  P(c,'#243524',cc=>el(cc,50,54,30,24));
  P(c,'#11200f',cc=>el(cc,50,62,30,16),false);
  P(c,'#f3ead4',cc=>el(cc,50,50,19,15));
  dot(c,'#ff5a3c',43,47,3.2); dot(c,'#48c24a',57,46,3.2);
  dot(c,'#ffd23c',50,54,3.2); dot(c,'#f06bd0',44,55,2.6); dot(c,'#4aa3ff',57,55,2.6);
};
I.greenroll=function(c){ // light green spiral roll
  P(c,'#b6da6b',cc=>{rrp(cc,22,40,56,30,14);});
  P(c,'#cdeb8c',cc=>el(cc,68,55,12,15),true);
  P(c,'#7fae3e',cc=>{cc.arc(68,55,8,0,4.4);},false);
  P(c,'#7fae3e',cc=>{cc.arc(68,55,4,0,4.4);},false);
};
I.pineapple=function(c){
  P(c,'#e8a72a',cc=>el(cc,50,58,21,28));
  P(c,'#c9851a',cc=>{ // crosshatch lines
    for(let i=-2;i<=2;i++){cc.moveTo(34,46+i*9);cc.lineTo(66,52+i*9);cc.moveTo(34,52+i*9);cc.lineTo(66,46+i*9);}
  },true);
  P(c,'#4ea03b',cc=>{cc.moveTo(50,32);cc.lineTo(38,14);cc.lineTo(46,26);cc.lineTo(42,8);cc.lineTo(52,24);cc.lineTo(60,10);cc.lineTo(56,26);cc.lineTo(64,16);cc.lineTo(58,30);cc.closePath();});
};
I.drumstick=function(c){
  P(c,'#b86a2c',cc=>el(cc,58,42,20,18,-0.3));
  P(c,'#a65a22',cc=>el(cc,62,38,7,7),false);
  P(c,'#e8d9bf',cc=>{rrp(cc,28,58,26,12,6);});
  P(c,'#ffffff',cc=>el(cc,26,66,9,8),true);
  P(c,'#ffffff',cc=>el(cc,26,56,8,7),true);
};
I.cheesewedge=function(c){ // yellow triangle wedge
  P(c,'#f4c324',cc=>{cc.moveTo(20,64);cc.lineTo(78,40);cc.lineTo(80,64);cc.closePath();});
  P(c,'#ffe06a',cc=>{cc.moveTo(20,64);cc.lineTo(78,40);cc.lineTo(78,48);cc.lineTo(22,60);cc.closePath();},false);
  dot(c,'#d89a10',40,58,4); dot(c,'#d89a10',58,52,3.5); dot(c,'#d89a10',66,57,3);
};
I.cheeseswiss=function(c){ // yellow block holes
  P(c,'#f4c324',cc=>{cc.moveTo(24,46);cc.lineTo(60,34);cc.lineTo(80,44);cc.lineTo(80,64);cc.lineTo(44,72);cc.lineTo(24,62);cc.closePath();});
  P(c,'#ffe06a',cc=>{cc.moveTo(24,46);cc.lineTo(60,34);cc.lineTo(80,44);cc.lineTo(60,42);cc.lineTo(24,52);cc.closePath();},false);
  dot(c,'#d89a10',40,58,4.5); dot(c,'#d89a10',60,56,3.6); dot(c,'#d89a10',52,64,3);
};
I.apple=function(c){
  P(c,'#d3263a',cc=>{el(cc,40,52,17,19);});
  P(c,'#d3263a',cc=>{el(cc,60,52,17,19);});
  P(c,'#d3263a',cc=>{cc.moveTo(24,48);cc.bezierCurveTo(24,74,40,82,50,78);cc.bezierCurveTo(60,82,76,74,76,48);cc.bezierCurveTo(64,36,36,36,24,48);cc.closePath();});
  stem(c,'#5a3410',5,[50,38,52,24]);
  P(c,'#4ea03b',cc=>el(cc,62,26,9,5,-0.6));
  P(c,'#ef6a78',cc=>el(cc,38,46,5,9,-0.3),false);
};
I.grapes=function(c){
  const col='#8a3fb0';
  [[44,46],[56,46],[50,56],[40,57],[60,57],[46,67],[56,67],[51,77]].forEach(p=>{P(c,col,cc=>el(cc,p[0],p[1],8,8));});
  P(c,'#a86fc8',cc=>el(cc,44,46,3,3),false);
  P(c,'#4ea03b',cc=>{cc.moveTo(56,38);cc.lineTo(72,30);cc.lineTo(66,40);cc.lineTo(78,38);cc.lineTo(64,46);cc.closePath();});
  stem(c,'#5a3410',5,[55,40,58,30]);
};
I.baguette=function(c){
  P(c,'#7a4a1e',cc=>el(cc,50,52,30,15,-0.35));
  P(c,'#9c6630',cc=>el(cc,50,49,26,10,-0.35),false);
  P(c,'#5a3414',cc=>{for(let i=-2;i<=2;i++){cc.moveTo(40+i*8,42+i*5);cc.lineTo(48+i*8,38+i*5);}},true);
};
I.muffin=function(c){ // brown sprinkled top, pink wrapper
  P(c,'#6b3d18',cc=>{cc.moveTo(28,46);cc.bezierCurveTo(28,28,72,28,72,46);cc.bezierCurveTo(72,52,28,52,28,46);cc.closePath();});
  P(c,'#d05a96',cc=>{cc.moveTo(30,48);cc.lineTo(70,48);cc.lineTo(62,76);cc.lineTo(38,76);cc.closePath();});
  P(c,'#f08cc0',cc=>{for(let i=0;i<5;i++){cc.moveTo(34+i*8,49);cc.lineTo(31+i*8,75);}},true);
  [['#ff5a5a',38,40],['#5ad0ff',48,36],['#ffe23c',58,40],['#7cff5a',44,44],['#ff8cf0',62,44],['#fff',52,42]].forEach(s=>dot(c,s[0],s[1],s[2],2.2));
};
I.donut=function(c){ // pink frosted ring
  P(c,'#c98a4a',cc=>el(cc,50,54,26,21));
  P(c,'#ef8fc4',cc=>el(cc,50,50,26,20));
  P(c,'#c98a4a',cc=>el(cc,50,52,9,7),true);
  [['#fff',40,44],['#ffe23c',58,44],['#7cd0ff',50,40],['#ff5a8a',64,52],['#7cff8a',36,54]].forEach(s=>dot(c,s[0],s[1],s[2],2));
};
I.candlecake=function(c){ // birthday cake, purple top, candle
  P(c,'#fff5f0',cc=>rrp(cc,26,54,48,20,4));
  P(c,'#8a3fb0',cc=>{cc.moveTo(26,54);cc.bezierCurveTo(36,46,64,46,74,54);cc.lineTo(74,58);cc.bezierCurveTo(64,50,36,50,26,58);cc.closePath();});
  P(c,'#caa0e0',cc=>{for(let i=0;i<4;i++){cc.moveTo(34+i*11,52);cc.lineTo(38+i*11,60);}},true);
  P(c,'#ffd23c',cc=>rrp(cc,47,30,7,16,2));
  P(c,'#ff7a1a',cc=>{cc.moveTo(50,30);cc.bezierCurveTo(45,24,55,22,50,16);cc.bezierCurveTo(46,22,54,26,50,30);cc.closePath();});
};
I.cakeslice=function(c){ // layered triangle slice
  P(c,'#caa06a',cc=>{cc.moveTo(24,70);cc.lineTo(76,70);cc.lineTo(70,38);cc.closePath();});
  P(c,'#8a5a2e',cc=>{cc.moveTo(24,70);cc.lineTo(76,70);cc.lineTo(75,62);cc.lineTo(25,62);cc.closePath();},false);
  P(c,'#fff2d8',cc=>{cc.moveTo(26,58);cc.lineTo(74,58);cc.lineTo(73,52);cc.lineTo(28,52);cc.closePath();},false);
  P(c,'#8a5a2e',cc=>{cc.moveTo(30,48);cc.lineTo(72,48);cc.lineTo(70,38);cc.closePath();},false);
};
I.pizza=function(c){ // slice
  P(c,'#f2c14a',cc=>{cc.moveTo(50,24);cc.lineTo(26,72);cc.lineTo(74,72);cc.closePath();});
  P(c,'#e88a2a',cc=>{cc.moveTo(26,72);cc.lineTo(74,72);cc.lineTo(72,66);cc.lineTo(28,66);cc.closePath();},false);
  P(c,'#f2d98a',cc=>{cc.moveTo(50,24);cc.lineTo(40,44);cc.lineTo(60,44);cc.closePath();},false);
  dot(c,'#d23030',44,54,4); dot(c,'#d23030',58,58,4); dot(c,'#d23030',50,66,3.6);
};
I.mushroom=function(c){
  P(c,'#cfc9c2',cc=>{cc.moveTo(24,52);cc.bezierCurveTo(24,30,76,30,76,52);cc.bezierCurveTo(60,60,40,60,24,52);cc.closePath();});
  P(c,'#eae6df',cc=>el(cc,42,42,8,5,-0.3),false);
  P(c,'#e8e2da',cc=>{rrp(cc,42,54,16,22,5);});
};
I.chocolate=function(c){
  P(c,'#5a3416',cc=>{cc.moveTo(28,40);cc.lineTo(70,32);cc.lineTo(74,62);cc.lineTo(32,70);cc.closePath();});
  P(c,'#7a4a22',cc=>{cc.moveTo(28,40);cc.lineTo(70,32);cc.lineTo(70,38);cc.lineTo(28,46);cc.closePath();},false);
  P(c,'#3a2010',cc=>{cc.moveTo(43,37);cc.lineTo(47,68);cc.moveTo(58,34);cc.lineTo(61,65);cc.moveTo(30,52);cc.lineTo(72,46);},true);
};
I.fries=function(c){ // red box yellow fries
  P(c,'#ffd23c',cc=>{for(let i=0;i<5;i++){rrp(cc,30+i*8,24,6,30,2);}});
  P(c,'#e8202c',cc=>{cc.moveTo(26,46);cc.lineTo(74,46);cc.lineTo(68,78);cc.lineTo(32,78);cc.closePath();});
  P(c,'#fff',cc=>{cc.moveTo(34,52);cc.lineTo(66,52);},true);
};
I.banana=function(c){
  P(c,'#f4cf2e',cc=>{cc.moveTo(28,36);cc.bezierCurveTo(34,68,62,78,76,64);cc.bezierCurveTo(66,70,44,60,40,38);cc.closePath();});
  P(c,'#6b4a14',cc=>el(cc,30,35,3,5),true);
  P(c,'#fbe88a',cc=>{cc.moveTo(34,42);cc.bezierCurveTo(40,62,58,70,68,64);},false);
};
I.cherries=function(c){
  P(c,'#d3263a',cc=>el(cc,40,66,12,12));
  P(c,'#d3263a',cc=>el(cc,62,62,12,12));
  stem(c,'#3a7a2c',5,[40,56,52,32,62,52]);
  P(c,'#4ea03b',cc=>el(cc,66,30,9,5,-0.5));
  P(c,'#ef6a78',cc=>el(cc,37,62,3,5),false);
};
I.watermelon=function(c){
  P(c,'#2e8b3a',cc=>{cc.moveTo(20,46);cc.bezierCurveTo(50,78,50,78,80,46);cc.closePath();});
  P(c,'#eaf6d8',cc=>{cc.moveTo(24,47);cc.bezierCurveTo(50,72,50,72,76,47);cc.closePath();},false);
  P(c,'#f0506a',cc=>{cc.moveTo(28,48);cc.bezierCurveTo(50,68,50,68,72,48);cc.closePath();});
  [[40,52],[50,56],[60,52],[45,58],[55,58]].forEach(p=>dot(c,'#23121c',p[0],p[1],2.2));
};
I.corn=function(c){
  P(c,'#f2cf3c',cc=>el(cc,50,52,15,27,0.15));
  P(c,'#d8a91a',cc=>{for(let r=-2;r<=2;r++){cc.moveTo(38,40+r*9);cc.lineTo(62,42+r*9);}},true);
  P(c,'#5ea83a',cc=>{cc.moveTo(40,36);cc.bezierCurveTo(26,46,30,74,40,78);cc.bezierCurveTo(40,60,42,46,50,40);cc.closePath();});
  P(c,'#5ea83a',cc=>{cc.moveTo(60,36);cc.bezierCurveTo(74,46,70,74,60,78);cc.bezierCurveTo(60,60,58,46,50,40);cc.closePath();});
};
I.nigiri=function(c){ // salmon on rice
  P(c,'#f6f0e6',cc=>rrp(cc,26,54,48,18,9));
  P(c,'#f08a4a',cc=>{cc.moveTo(24,52);cc.bezierCurveTo(40,40,60,40,78,50);cc.bezierCurveTo(60,52,40,54,24,56);cc.closePath();});
  P(c,'#fbd0a8',cc=>{cc.moveTo(30,50);cc.bezierCurveTo(44,44,58,44,70,49);},true);
};
I.pear=function(c){
  P(c,'#d6d23a',cc=>{cc.moveTo(50,34);cc.bezierCurveTo(38,34,40,50,34,60);cc.bezierCurveTo(28,76,46,84,50,82);cc.bezierCurveTo(54,84,72,76,66,60);cc.bezierCurveTo(60,50,62,34,50,34);cc.closePath();});
  stem(c,'#5a3410',5,[52,34,56,22]);
  P(c,'#4ea03b',cc=>el(cc,60,24,8,4,-0.6));
  P(c,'#ecea8a',cc=>el(cc,42,58,5,11,-0.2),false);
};
I.avocado=function(c){
  P(c,'#3a7a2c',cc=>{cc.moveTo(50,28);cc.bezierCurveTo(34,30,32,54,38,66);cc.bezierCurveTo(46,80,54,80,62,66);cc.bezierCurveTo(68,54,66,30,50,28);cc.closePath();});
  P(c,'#b6d96b',cc=>{cc.moveTo(50,38);cc.bezierCurveTo(42,40,42,56,46,64);cc.bezierCurveTo(50,72,50,72,54,64);cc.bezierCurveTo(58,56,58,40,50,38);cc.closePath();});
  P(c,'#7a4a1e',cc=>el(cc,50,58,9,11));
};
I.cocktail=function(c){ // blue martini
  P(c,'#3aa0ff',cc=>{cc.moveTo(28,34);cc.lineTo(72,34);cc.lineTo(50,58);cc.closePath();});
  P(c,'#bfe6ff',cc=>{cc.moveTo(32,36);cc.lineTo(68,36);cc.lineTo(60,42);cc.lineTo(40,42);cc.closePath();},false);
  stem(c,'#2a3540',6,[50,58,50,74]);
  P(c,'#cfd6dc',cc=>{rrp(cc,38,74,24,5,2);});
  P(c,'#ff5a5a',cc=>el(cc,70,32,4,4),true);
  stem(c,'#7cd0ff',4,[70,32,76,20]);
};
I.icedcoffee=function(c){ // brown cup w/ straw
  P(c,'#8a5a2e',cc=>{cc.moveTo(32,40);cc.lineTo(68,40);cc.lineTo(63,78);cc.lineTo(37,78);cc.closePath();});
  P(c,'#a8702e',cc=>{cc.moveTo(34,44);cc.lineTo(66,44);cc.lineTo(65,52);cc.lineTo(35,52);cc.closePath();},false);
  P(c,'#c9c2b8',cc=>{rrp(cc,30,36,40,7,3);});
  stem(c,'#e85a8a',7,[58,38,64,18]);
};
I.beer=function(c){ // mug
  P(c,'#f2c83c',cc=>rrp(cc,30,38,34,42,6));
  P(c,'#f6da6a',cc=>rrp(cc,34,44,8,30,4),false);
  P(c,'#fff',cc=>{cc.moveTo(28,40);cc.bezierCurveTo(28,28,40,26,46,32);cc.bezierCurveTo(54,26,66,30,66,40);cc.bezierCurveTo(50,36,40,36,28,40);cc.closePath();});
  P(c,'#f2c83c',cc=>{rrp(cc,64,48,16,22,8);},true);
  P(c,'#000',cc=>{rrp(cc,68,53,7,12,4);},false);
};
I.friedegg=function(c){
  P(c,'#fbfbf6',cc=>{cc.moveTo(34,46);cc.bezierCurveTo(24,40,26,60,38,62);cc.bezierCurveTo(40,74,60,74,64,62);cc.bezierCurveTo(80,62,78,42,66,44);cc.bezierCurveTo(64,34,42,34,34,46);cc.closePath();});
  P(c,'#f6b81a',cc=>el(cc,50,52,12,11));
  P(c,'#fbd96a',cc=>el(cc,46,48,4,4),false);
};
I.popsicle=function(c){ // red ice pop, bite
  P(c,'#d3263a',cc=>{rrp(cc,34,28,30,38,12);});
  P(c,'#ef6a78',cc=>rrp(cc,38,32,7,26,4),false);
  P(c,'#f6e3c0',cc=>rrp(cc,45,64,8,22,3));
  // bite top-right
  P(c,'#f8c9e7',cc=>el(cc,62,32,7,7),false);
};
I.icecream=function(c){ // cone + swirl
  P(c,'#e8b86a',cc=>{cc.moveTo(38,52);cc.lineTo(62,52);cc.lineTo(50,82);cc.closePath();});
  P(c,'#a8702e',cc=>{cc.moveTo(42,58);cc.lineTo(46,58);cc.lineTo(50,72);cc.moveTo(54,56);cc.lineTo(58,56);cc.lineTo(52,68);},true);
  P(c,'#fbfbf6',cc=>{cc.moveTo(36,52);cc.bezierCurveTo(30,44,40,40,42,42);cc.bezierCurveTo(42,32,58,32,58,42);cc.bezierCurveTo(62,38,70,46,64,52);cc.bezierCurveTo(50,56,46,56,36,52);cc.closePath();});
  P(c,'#f06bb0',cc=>{cc.moveTo(40,48);cc.bezierCurveTo(48,44,54,44,60,48);},true);
  P(c,'#f06bb0',cc=>{cc.moveTo(44,42);cc.bezierCurveTo(48,39,52,39,56,42);},true);
};
I.hamburger=function(c){
  P(c,'#e0a23c',cc=>{cc.moveTo(26,42);cc.bezierCurveTo(26,26,74,26,74,42);cc.bezierCurveTo(58,48,42,48,26,42);cc.closePath();});
  [['#ffd23c',46],['#ffd23c',60]].forEach(()=>{});
  P(c,'#5ea83a',cc=>{cc.moveTo(26,48);cc.bezierCurveTo(40,42,60,42,74,48);cc.bezierCurveTo(66,54,34,54,26,48);cc.closePath();});
  P(c,'#ffce3c',cc=>{cc.moveTo(30,52);cc.lineTo(70,52);cc.lineTo(64,58);cc.lineTo(36,58);cc.closePath();});
  P(c,'#7a4420',cc=>{rrp(cc,28,56,44,12,5);});
  P(c,'#e0a23c',cc=>{cc.moveTo(28,68);cc.bezierCurveTo(40,76,60,76,72,68);cc.bezierCurveTo(60,72,40,72,28,68);cc.closePath();});
  dot(c,'#fff',40,34,1.8); dot(c,'#fff',52,32,1.8); dot(c,'#fff',60,35,1.8);
};
I.sandwich=function(c){ // triangle
  P(c,'#e8c87a',cc=>{cc.moveTo(24,40);cc.lineTo(76,40);cc.lineTo(50,74);cc.closePath();});
  P(c,'#f4e2b0',cc=>{cc.moveTo(28,44);cc.lineTo(72,44);cc.lineTo(50,52);cc.closePath();},false);
  P(c,'#5ea83a',cc=>{cc.moveTo(30,50);cc.lineTo(70,50);cc.lineTo(58,60);cc.lineTo(42,60);cc.closePath();},false);
  P(c,'#e07a5a',cc=>{cc.moveTo(36,56);cc.lineTo(64,56);cc.lineTo(50,68);cc.closePath();},false);
};
I.carrot=function(c){
  P(c,'#ef8a2a',cc=>{cc.moveTo(38,44);cc.lineTo(62,44);cc.lineTo(50,82);cc.closePath();});
  P(c,'#f6a84a',cc=>{cc.moveTo(42,46);cc.lineTo(58,46);cc.lineTo(50,60);cc.closePath();},false);
  P(c,'#d86a14',cc=>{cc.moveTo(44,52);cc.lineTo(56,52);cc.moveTo(46,60);cc.lineTo(54,60);},true);
  P(c,'#4ea03b',cc=>{cc.moveTo(50,44);cc.lineTo(36,26);cc.lineTo(46,34);cc.lineTo(42,20);cc.lineTo(52,32);cc.lineTo(60,22);cc.lineTo(56,36);cc.lineTo(64,30);cc.lineTo(56,42);cc.closePath();});
};
I.milk=function(c){ // blue/white carton
  P(c,'#eaf4fb',cc=>{cc.moveTo(34,40);cc.lineTo(66,40);cc.lineTo(66,78);cc.lineTo(34,78);cc.closePath();});
  P(c,'#bfe0f4',cc=>{cc.moveTo(34,40);cc.lineTo(50,30);cc.lineTo(66,40);cc.lineTo(50,46);cc.closePath();});
  P(c,'#7ab8e0',cc=>{cc.moveTo(50,30);cc.lineTo(50,46);cc.lineTo(66,40);cc.closePath();},false);
  P(c,'#2a6bb0',cc=>{cc.moveTo(40,58);cc.lineTo(60,58);cc.moveTo(40,64);cc.lineTo(58,64);cc.moveTo(40,70);cc.lineTo(56,70);},true);
};
I.cupcake=I.muffin;

window.ICONS = I;
window.ICON_OL = OL;
})();
