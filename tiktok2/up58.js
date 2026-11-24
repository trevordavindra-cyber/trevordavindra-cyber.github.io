'use strict';
(function(){
    if(window.__tk2up58){return;}
    window.__tk2up58=1;

    // fallback helpers
    var S = window.S || {clips:[]};
    var r1 = window.r1 || function(sel){ return document.querySelector(sel); };
    var log = window.log || function(txt){ console.log(txt); };
    var mkBtn = window.mkBtn || function(id,label,card){
        var b=document.createElement('button');
        b.id=id;
        b.textContent=label;
        b.style.margin='4px';
        if(card)card.appendChild(b);
        return b;
    };
    var mkRow = window.mkRow || function(card,title){
        var row=document.createElement('div');
        row.className='row';
        var span=document.createElement('span');
        span.textContent=title;
        row.appendChild(span);
        if(card)card.appendChild(row);
        return row;
    };
    var dl = window.dl || function(fname,txt){
        var a=document.createElement('a');
        a.href='data:text/plain;charset=utf-8,'+encodeURIComponent(txt);
        a.download=fname;
        a.style.display='none';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    // locate SOUND LAB card to insert after
    var soundLab = null;
    // try a few heuristics
    var possible = document.querySelectorAll('.card, .panel, div');
    for(var i=0;i<possible.length;i++){
        var el=possible[i];
        if(el.textContent && el.textContent.indexOf('SOUND LAB')>-1){
            soundLab=el;
            break;
        }
    }
    // create COLOR LAB card
    var colorCard=document.createElement('div');
    colorCard.className='card';
    var h=document.createElement('h2');
    h.textContent='COLOR LAB';
    colorCard.appendChild(h);
    // insert after soundLab or at end of body
    if(soundLab && soundLab.parentNode){
        if(soundLab.nextSibling){
            soundLab.parentNode.insertBefore(colorCard,soundLab.nextSibling);
        }else{
            soundLab.parentNode.appendChild(colorCard);
        }
    }else{
        document.body.appendChild(colorCard);
    }

    // helper to get clips safely
    function getClips(){
        if(!S.clips || !Array.isArray(S.clips) || S.clips.length===0){
            return null;
        }
        return S.clips;
    }

    // Button 1: LOOK PRESETS
    mkRow(colorCard,'LOOK PRESETS');
    mkBtn('f58b1','LOOK PRESETS',colorCard).addEventListener('click',function(){
        var clips=getClips();
        if(!clips){log('Add clips first for LOOK PRESETS.');return;}
        var looks=['clean','warm','cold','teal-orange','film','vaporwave','noir','bleach'];
        var out=[];
        for(var i=0;i<clips.length;i++){
            var clip=clips[i];
            var look=looks[i%looks.length];
            out.push('Clip '+(clip.name||i)+': Look '+look+' -> Grade: lift 0.95, gamma 1.0, gain 1.05, sat +10%');
        }
        log(out.join('\n'));
    });

    // Button 2: SKIN TONE FIX
    mkRow(colorCard,'SKIN TONE FIX');
    mkBtn('f58b2','SKIN TONE FIX',colorCard).addEventListener('click',function(){
        var clips=getClips();
        if(!clips){log('Add clips first for SKIN TONE FIX.');return;}
        var out=[];
        for(var i=0;i<clips.length;i++){
            var clip=clips[i];
            out.push('Clip '+(clip.name||i)+': Reduce saturation -10%, shift hue +5° to tame skin.');
        }
        log(out.join('\n'));
    });

    // Button 3: MATCH CLIPS
    mkRow(colorCard,'MATCH CLIPS');
    mkBtn('f58b3','MATCH CLIPS',colorCard).addEventListener('click',function(){
        var clips=getClips();
        if(!clips){log('Add clips first for MATCH CLIPS.');return;}
        if(clips.length<2){log('Need at least 2 clips to match.');return;}
        var base=clips[0];
        var baseB=base.brightness||0;
        var baseC=base.contrast||0;
        var out=['Match plan:'];
        for(var i=1;i<clips.length;i++){
            var c=clips[i];
            var b=c.brightness||0;
            var con=c.contrast||0;
            var adjB=baseB-b;
            var adjC=baseC-con;
            out.push('Clip '+(c.name||i)+': adjust brightness '+adjB.toFixed(2)+', contrast '+adjC.toFixed(2));
        }
        log(out.join('\n'));
    });

    // Button 4: CONTRAST PASS
    mkRow(colorCard,'CONTRAST PASS');
    mkBtn('f58b4','CONTRAST PASS',colorCard).addEventListener('click',function(){
        var clips=getClips();
        if(!clips){log('Add clips first for CONTRAST PASS.');return;}
        var out=[];
        for(var i=0;i<clips.length;i++){
            var clip=clips[i];
            out.push('Clip '+(clip.name||i)+': Apply S‑curve (0,0) (0.25,0.2) (0.5,0.5) (0.75,0.8) (1,1).');
        }
        log(out.join('\n'));
    });

    // Button 5: GRAIN LADDER
    mkRow(colorCard,'GRAIN LADDER');
    mkBtn('f58b5','GRAIN LADDER',colorCard).addEventListener('click',function(){
        var clips=getClips();
        if(!clips){log('Add clips first for GRAIN LADDER.');return;}
        var vibes=['soft','neutral','gritty','film','heavy'];
        var out=[];
        for(var i=0;i<clips.length;i++){
            var clip=clips[i];
            var strength=(i%5)+1; // 1-5
            out.push('Clip '+(clip.name||i)+': Grain strength '+strength+' ('+vibes[strength-1]+')');
        }
        log(out.join('\n'));
    });

    // Button 6: LUT SHEET
    mkRow(colorCard,'LUT SHEET');
    mkBtn('f58b6','LUT SHEET',colorCard).addEventListener('click',function(){
        var clips=getClips();
        if(!clips){log('Add clips first for LUT SHEET.');return;}
        var header='Clip | Look | Exposure | Contrast | Saturation | Temp';
        var lines=[header];
        var looks=['clean','warm','cold','teal-orange','film','vaporwave','noir','bleach'];
        for(var i=0;i<clips.length;i++){
            var clip=clips[i];
            var look=looks[i%looks.length];
            var exp= (clip.exposure!==undefined)?clip.exposure.toFixed(2):'0.00';
            var con= (clip.contrast!==undefined)?clip.contrast.toFixed(2):'1.00';
            var sat= (clip.saturation!==undefined)?clip.saturation.toFixed(2):'1.00';
            var temp= (clip.temp!==undefined)?clip.temp.toString():'6500K';
            lines.push((clip.name||i)+' | '+look+' | '+exp+' | '+con+' | '+sat+' | '+temp);
        }
        log(lines.join('\n'));
    });

    // Button 7: VIGNETTE PLAN
    mkRow(colorCard,'VIGNETTE PLAN');
    mkBtn('f58b7','VIGNETTE PLAN',colorCard).addEventListener('click',function(){
        var clips=getClips();
        if(!clips){log('Add clips first for VIGNETTE PLAN.');return;}
        var out=[];
        for(var i=0;i<clips.length;i++){
            var clip=clips[i];
            var strength = (i%2===0)?'20%' : '0%';
            out.push('Clip '+(clip.name||i)+': Vignette '+strength);
        }
        log(out.join('\n'));
    });

    // Button 8: COLOR SCRIPT
    mkRow(colorCard,'COLOR SCRIPT');
    mkBtn('f58b8','COLOR SCRIPT',colorCard).addEventListener('click',function(){
        var clips=getClips();
        if(!clips){log('Add clips first for COLOR SCRIPT.');return;}
        var moods=['red','orange','yellow','green','blue','indigo','violet','gray'];
        var out=[];
        for(var i=0;i<clips.length;i++){
            var clip=clips[i];
            var mood=moods[i%moods.length];
            out.push('Clip '+(clip.name||i)+': Mood '+mood+', keep continuity with previous scene.');
        }
        log(out.join('\n'));
    });

    // Button 9: WHITE BALANCE
    mkRow(colorCard,'WHITE BALANCE');
    mkBtn('f58b9','WHITE BALANCE',colorCard).addEventListener('click',function(){
        var clips=getClips();
        if(!clips){log('Add clips first for WHITE BALANCE.');return;}
        var out=[];
        for(var i=0;i<clips.length;i++){
            var clip=clips[i];
            var temp=clip.temp||6500;
            var tint=clip.tint||0;
            out.push('Clip '+(clip.name||i)+': Temp '+temp+'K, Tint '+tint);
        }
        log(out.join('\n'));
    });

    // Button 10: GRADE SHEET .TXT
    mkRow(colorCard,'GRADE SHEET .TXT');
    mkBtn('f58b10','GRADE SHEET .TXT',colorCard).addEventListener('click',function(){
        var clips=getClips();
        if(!clips){log('Add clips first for GRADE SHEET.');return;}
        var sections=[];
        // reuse earlier functions logic to build text
        // 1. LOOK PRESETS
        var looks=['clean','warm','cold','teal-orange','film','vaporwave','noir','bleach'];
        var lines1=[];
        for(var i=0;i<clips.length;i++){
            var clip=clips[i];
            var look=looks[i%looks.length];
            lines1.push('Clip '+(clip.name||i)+': Look '+look);
        }
        sections.push('LOOK PRESETS\n'+lines1.join('\n'));

        // 2. SKIN TONE FIX
        var lines2=[];
        for(var i=0;i<clips.length;i++){
            var clip=clips[i];
            lines2.push('Clip '+(clip.name||i)+': Sat -10%, Hue +5°');
        }
        sections.push('SKIN TONE FIX\n'+lines2.join('\n'));

        // 3. CONTRAST PASS
        var lines3=[];
        for(var i=0;i<clips.length;i++){
            var clip=clips[i];
            lines3.push('Clip '+(clip.name||i)+': S‑curve (0,0) (0.25,0.2) (0.5,0.5) (0.75,0.8) (1,1)');
        }
        sections.push('CONTRAST PASS\n'+lines3.join('\n'));

        // 4. GRAIN LADDER
        var lines4=[];
        for(var i=0;i<clips.length;i++){
            var strength=(i%5)+1;
            lines4.push('Clip '+(clips[i].name||i)+': Grain '+strength);
        }
        sections.push('GRAIN LADDER\n'+lines4.join('\n'));

        // 5. LUT SHEET
        var header='Clip | Look | Exposure | Contrast | Saturation | Temp';
        var lines5=[header];
        for(var i=0;i<clips.length;i++){
            var clip=clips[i];
            var look=looks[i%looks.length];
            var exp= (clip.exposure!==undefined)?clip.exposure.toFixed(2):'0.00';
            var con= (clip.contrast!==undefined)?clip.contrast.toFixed(2):'1.00';
            var sat= (clip.saturation!==undefined)?clip.saturation.toFixed(2):'1.00';
            var temp= (clip.temp!==undefined)?clip.temp.toString():'6500K';
            lines5.push((clip.name||i)+' | '+look+' | '+exp+' | '+con+' | '+sat+' | '+temp);
        }
        sections.push('LUT SHEET\n'+lines5.join('\n'));

        // 6. VIGNETTE PLAN
        var lines6=[];
        for(var i=0;i<clips.length;i++){
            var strength = (i%2===0)?'20%' : '0%';
            lines6.push('Clip '+(clips[i].name||i)+': Vignette '+strength);
        }
        sections.push('VIGNETTE PLAN\n'+lines6.join('\n'));

        // 7. COLOR SCRIPT
        var moods=['red','orange','yellow','green','blue','indigo','violet','gray'];
        var lines7=[];
        for(var i=0;i<clips.length;i++){
            var mood=moods[i%moods.length];
            lines7.push('Clip '+(clips[i].name||i)+': Mood '+mood);
        }
        sections.push('COLOR SCRIPT\n'+lines7.join('\n'));

        // 8. WHITE BALANCE
        var lines8=[];
        for(var i=0;i<clips.length;i++){
            var temp=clips[i].temp||6500;
            var tint=clips[i].tint||0;
            lines8.push('Clip '+(clips[i].name||i)+': Temp '+temp+'K, Tint '+tint);
        }
        sections.push('WHITE BALANCE\n'+lines8.join('\n'));

        var fullText=sections.join('\n\n');
        dl('color_grade_sheet.txt',fullText);
        log('Grade sheet downloaded.');
    });

})();