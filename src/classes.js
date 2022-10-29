const PI2 = Math.PI * 2;

export class C_Ball{
    constructor(){ this.x=0; this.y=0; this.ax=0; this.ay=0; this.r=1; }

    update(data){ this.x=data.x; this.y=data.y; this.ax=data.ax; this.ay=data.ay; }
    draw(ctxt) {
        ctxt.beginPath(); ctxt.arc(this.x, this.y, this.r, 0, PI2); ctxt.stroke();
        ctxt.beginPath(); ctxt.moveTo(this.x, this.y); ctxt.lineTo(this.ax, this.ay); ctxt.stroke();
    }
}