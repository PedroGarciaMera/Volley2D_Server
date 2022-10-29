<script>
    import { Canvas, Layer, t } from "svelte-canvas";
    import { C_Ball } from '../classes.js';
    import { Name } from '../stores.js';

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
    WS.addEvent("update",(data) => { PJS = data.pjs; Ball.update(data.ball); });
    WS.addEvent("score",(data) => { score.l=data.l; score.r=data.r; });

    //
    let key2Action = { 
        a:"left", ArrowLeft:"left",
        d:"right", ArrowRight:"right",
        w:"jump", ArrowUp:"jump",
        j:"shoot", x:"shoot"
    }

    async function keydown(e){
        // if (!Object.hasOwn(key2Action, e.key)) return;
        if (!key2Action.hasOwnProperty(e.key)) return;

        WS.sendMSG("buttonP",key2Action[e.key]);
    }

    async function keyup(e){
        if (!key2Action.hasOwnProperty(e.key)) return;

        WS.sendMSG("buttonR",key2Action[e.key]);
    }

    function handleResize()
    {
        w_w = window.innerWidth; w_h = window.innerHeight;
        s_w = w_w/g_w; s_h = w_h/g_h;
    }
    handleResize();

    
    $: render = ({ context, width, height }) => {
        if (height>width) return;

        context.save();
        context.scale(s_w, s_h);
        context.strokeStyle = "white";

        // Bits
        context.beginPath(); context.arc(0, Bits.y, Bits.r, 0, Math.PI*2); context.stroke();
        context.beginPath(); context.arc(g_w, Bits.y, Bits.r, 0, Math.PI*2); context.stroke();

        // PJS
        PJS.forEach(pj => {
            context.lineWidth = 1;
            context.fillStyle = `rgba(255, ${pj.hit.ing ? "127" : "255"}, 255, ${pj.hit.ed ? "0.5" : "1"})`;
            context.beginPath();
            context.arc(pj.x, pj.y, PJr, 0, Math.PI * 2);
            context.fill();

            if (pj.hit.ing){
                context.lineWidth = 3;
                context.beginPath();
                context.arc(pj.x, pj.y, PJr, 0, pj.hit.v*Math.PI*2);
                context.stroke();
            }

            // Name
            context.lineWidth = 1;
            context.font = "20px Arial";
            context.textAlign = "center";
            context.textBaseline = "top";	
            context.strokeText(pj.name, pj.x, pj.y+PJr);
        });
        context.lineWidth = 2;
        context.fillStyle = "white";

        Ball.draw(context);
        // Net
        context.lineWidth = Net.bw;
        context.beginPath(); context.moveTo(Net.x, FloorTop); context.lineTo(Net.x, Net.ty); context.stroke();
        context.beginPath(); context.arc(Net.x, Net.ty, Net.tr, 0, Math.PI * 2); context.fill();

        // Floor
        context.lineWidth = 2;
        context.beginPath(); context.moveTo(0, FloorTop); context.lineTo(g_w, FloorTop); context.stroke();

        // Score
        context.font = "64px Arial";
        context.textAlign = "center";
        context.textBaseline = "top";	
        context.strokeText(`${score.l} - ${score.r}`, g_w/2, 0);

        // TEST
        // context.font = "32px Arial";
        // context.textAlign = "left";
        // context.strokeText(`${touches[0]?.clientX} ${touches[1]?.clientX}`, 0, 0);

        //
        context.restore();
    };

    let touch = false; let touches = []
</script>

<svelte:window on:resize|passive={handleResize}
    on:keydown={keydown} 
    on:keyup={keyup}
    on:touchstart={(e) => touches = e.touches}
	on:touchmove={(e) => touches = e.touches}
	on:touchend={(e) => touches = e.touches}
/>

<!-- <Canvas bind:width={w_w} bind:height={w_h} style={"background-color:#111; touch-action:none"}>
    <Layer {render} />
</Canvas> -->


