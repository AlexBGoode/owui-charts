(function(){
var c=document.getElementById('chart');
if(!c){c=document.createElement('div');c.id='chart';document.body.appendChild(c);}
var s=document.createElement('style');
s.textContent='*{margin:0;padding:0;box-sizing:border-box}body{background:#0f172a;font-family:system-ui,sans-serif;padding:16px}#chart{position:relative;width:100%}';
document.head.appendChild(s);
var d=document.createElement('script');
d.src='https://d3js.org/d3.v7.min.js';
d.onload=function(){r()};
document.head.appendChild(d);
function fv(v){
  if(Math.abs(v)>=1e9)return(v/1e9).toFixed(1)+' млрд';
  if(Math.abs(v)>=1e6)return(v/1e6).toFixed(1)+' млн';
  return v.toFixed(1);
}
function r(){
  if(typeof CHART_DATA==='undefined'||!CHART_DATA.length){document.body.innerHTML='<p style=color:#ef4444>No CHART_DATA</p>';return;}
  var cfg=typeof CHART_CONFIG!=='undefined'?CHART_CONFIG:{};
  var title=cfg.title||'Chart',yL=cfg.yLabel||'Value',suf=cfg.valueSuffix||'';
  var data=CHART_DATA.map(function(d){return{date:new Date(d.month),value:d.value};}).sort(function(a,b){return a.date-b.date;});
  var m={t:50,r:30,b:50,l:80};
  var w=Math.min(window.innerWidth-20,800)-m.l-m.r;
  var h=360-m.t-m.b;
  var svg=d3.select('#chart').append('svg').attr('width',w+m.l+m.r).attr('height',h+m.t+m.b).append('g').attr('transform','translate('+m.l+','+m.t+')');
  svg.append('text').attr('x',w/2).attr('y',-25).attr('text-anchor','middle').style('font-size','16px').style('font-weight','bold').style('fill','#e2e8f0').text(title);
  var x=d3.scaleTime().domain(d3.extent(data,function(d){return d.date;})).range([0,w]);
  var y=d3.scaleLinear().domain([0,d3.max(data,function(d){return d.value;})*1.1]).range([h,0]);
  svg.append('g').attr('class','grid').call(d3.axisLeft(y).tickSize(-w).tickFormat('')).selectAll('line').style('stroke','#334155').style('stroke-dasharray','3,3');
  svg.selectAll('.grid .domain').remove();
  svg.append('g').attr('transform','translate(0,'+h+')').call(d3.axisBottom(x).tickFormat(d3.timeFormat('%b %Y'))).selectAll('text').style('fill','#94a3b8').attr('transform','rotate(-30)').style('text-anchor','end');
  svg.append('g').call(d3.axisLeft(y).ticks(6).tickFormat(function(d){return fv(d);})).selectAll('text').style('fill','#94a3b8');
  svg.selectAll('.domain').style('stroke','#475569');svg.selectAll('.tick line').style('stroke','#475569');
  svg.append('text').attr('transform','rotate(-90)').attr('y',-65).attr('x',-h/2).attr('text-anchor','middle').style('fill','#94a3b8').style('font-size','12px').text(yL);
  var defs=svg.append('defs');var gr=defs.append('linearGradient').attr('id','aG').attr('x1','0%').attr('y1','0%').attr('x2','0%').attr('y2','100%');
  gr.append('stop').attr('offset','0%').attr('stop-color','#3b82f6').attr('stop-opacity',0.3);
  gr.append('stop').attr('offset','100%').attr('stop-color','#3b82f6').attr('stop-opacity',0.02);
  svg.append('path').datum(data).attr('fill','url(#aG)').attr('d',d3.area().x(function(d){return x(d.date);}).y0(h).y1(function(d){return y(d.value);}).curve(d3.curveMonotoneX));
  svg.append('path').datum(data).attr('fill','none').attr('stroke','#3b82f6').attr('stroke-width',2.5).attr('d',d3.line().x(function(d){return x(d.date);}).y(function(d){return y(d.value);}).curve(d3.curveMonotoneX));
  svg.selectAll('.dot').data(data).enter().append('circle').attr('cx',function(d){return x(d.date);}).attr('cy',function(d){return y(d.value);}).attr('r',4).attr('fill','#3b82f6').attr('stroke','#1e293b').attr('stroke-width',2).style('cursor','pointer').on('mouseover',function(e,d){d3.select(this).transition().duration(150).attr('r',7);tt.style('opacity',1).html('<b>'+d3.timeFormat('%d.%m.%Y')(d.date)+'</b><br>'+fv(d.value)+suf).style('left',(e.offsetX+15)+'px').style('top',(e.offsetY-40)+'px');}).on('mouseout',function(){d3.select(this).transition().duration(150).attr('r',4);tt.style('opacity',0);});
  var tt=d3.select('#chart').append('div').style('position','absolute').style('background','#1e293b').style('color','#e2e8f0').style('padding','8px 12px').style('border-radius','6px').style('font-size','13px').style('pointer-events','none').style('opacity',0).style('border','1px solid #475569').style('z-index','10');
  function rH(){window.parent.postMessage({type:'iframe:height',height:document.documentElement.scrollHeight},'*');}
  window.addEventListener('load',rH);if(typeof ResizeObserver!=='undefined'){new ResizeObserver(rH).observe(document.body);}
}
})();
