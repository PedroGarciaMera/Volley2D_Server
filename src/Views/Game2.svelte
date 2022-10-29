<script>
    import { onMount } from 'svelte/internal';
    import { C_Ball } from '../classes.js';
    import { Name } from '../stores.js';

    // GET CANVAS
    let canvas; let ctx; onMount(() => {ctx = canvas.getContext('2d');})

    // VARS
    let Ball = new C_Ball();

    let PJS = []; let PJr = 1;
    let FloorTop = 0; let Bits = 0;
    let Net = {x:0, ty:0, bw:1, tr:1}
    let score = {l:"?",r:"?"};

    let w_w = window.innerWidth; let w_h = window.innerHeight;
    let s_w = 1; let s_h = 1;
    let g_w = 1136; let g_h = 640;

    // SOCKET
    let WS = new C_Socket("ws://92.59.246.19:22122/game");

    WS.addEvent("gameCfg",(data) => {
        PJr = data.pjR; Ball.r = data.ballR; FloorTop = data.floorTop; Bits = data.bits; Net = data.net;

        WS.sendMSG("name",$Name);
    });
    WS.addEvent("score",(data) => { score.l=data.l; score.r=data.r; });

    WS.addEvent("update",(data) => update(data.pjs,data.ball) );


    // Keyboard
    let key2Action = { 
        KeyA:"left", ArrowLeft:"left",
        KeyD:"right", ArrowRight:"right",
        KeyW:"jump", ArrowUp:"jump",
        KeyJ:"shoot", KeyX:"shoot", Space:"shoot"
    }
    async function keydown(e){ if (!key2Action.hasOwnProperty(e.code)) return; WS.sendMSG("buttonP",key2Action[e.code]); }
    async function keyup(e){ if (!key2Action.hasOwnProperty(e.code)) return; WS.sendMSG("buttonR",key2Action[e.code]); }

    // Windows resize
    function handleResize(){
        w_w = window.innerWidth; w_h = window.innerHeight;
        s_w = w_w/g_w; s_h = w_h/g_h;
    }
    handleResize();

    // UPDATE & DRAW
    function update(pjs,ball){ PJS = pjs; Ball.update(ball); drawCTX(); }

    function drawCTX(){
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    
        ctx.save();
        ctx.scale(s_w, s_h);
        ctx.strokeStyle = "white";

        // Bits
        ctx.beginPath(); ctx.arc(0, Bits.y, Bits.r, 0, Math.PI*2); ctx.stroke();
        ctx.beginPath(); ctx.arc(g_w, Bits.y, Bits.r, 0, Math.PI*2); ctx.stroke();

        // PJS
        PJS.forEach(pj => {
            ctx.lineWidth = 1;
            ctx.fillStyle = `#F${pj.hit.ing ? "8" : "F"}F${pj.hit.ed ? "8" : "F"}`;
            ctx.beginPath();
            ctx.arc(pj.x, pj.y, PJr, 0, Math.PI * 2);
            ctx.fill();

            if (pj.hit.ing){
                ctx.lineWidth = 3;
                ctx.beginPath();
                ctx.arc(pj.x, pj.y, PJr, 0, pj.hit.v*Math.PI*2);
                ctx.stroke();
            }

            // Name
            ctx.lineWidth = 1;
            ctx.font = "20px Arial";
            ctx.textAlign = "center";
            ctx.textBaseline = "top";	
            ctx.strokeText(pj.name, pj.x, pj.y+PJr);
        });
        ctx.lineWidth = 2;
        ctx.fillStyle = "white";

        Ball.draw(ctx);
        // Net
        ctx.lineWidth = Net.bw;
        ctx.beginPath(); ctx.moveTo(Net.x, FloorTop); ctx.lineTo(Net.x, Net.ty); ctx.stroke();
        ctx.beginPath(); ctx.arc(Net.x, Net.ty, Net.tr, 0, Math.PI * 2); ctx.fill();

        // Floor
        ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(0, FloorTop); ctx.lineTo(g_w, FloorTop); ctx.stroke();

        // Score
        ctx.font = "64px Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "top";	
        ctx.strokeText(`${score.l} - ${score.r}`, g_w/2, 0);

        // Conection Status
        ctx.lineWidth = 4; ctx.strokeStyle = WS.getStateColor(); ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(ctx.canvas.width, 0); ctx.stroke();

        // TEST
        // ctx.font = "32px Arial";
        // ctx.textAlign = "left";
        // ctx.strokeText(`${touches[0]?.clientX} ${touches[1]?.clientX}`, 0, 0);

        //
        ctx.restore();
    }

    // TOUCH    
    let touchs = [];
    function touchStart(X,Y){
        if (X<=w_w/2 && Y>w_h*0.7){ touchs.push("left"); WS.sendMSG("buttonP","left"); }
        if (X>w_w/2 && Y>w_h*0.7){ touchs.push("right"); WS.sendMSG("buttonP","right"); }
        if (X<=w_w/2 && Y<=w_h*0.7){ touchs.push("jump"); WS.sendMSG("buttonP","jump"); }
        if (X>w_w/2 && Y<=w_h*0.7){ touchs.push("shoot"); WS.sendMSG("buttonP","shoot"); }
    }
    function touchEnd(){ WS.sendMSG("buttonR",touchs.shift()); }


</script>

<svelte:window on:resize|passive={handleResize}
    on:keydown={keydown} 
    on:keyup={keyup}
    on:touchstart={(e) => touchStart(e.touches[e.touches.length-1].clientX,e.touches[e.touches.length-1].clientY)}
	on:touchend={(e) => touchEnd()}
/>

<canvas bind:this={canvas} style="background-color:black;" width={w_w} height={w_h}></canvas>




