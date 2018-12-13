var numberColor = 'black';
var faceColor = 'white';
var hourColor = 'balck';

var control = [3];

window.onload = function linked(){
    console.log("clock js loaded")
    var canvas = document.getElementById("canvas");
    var ctx = canvas.getContext("2d");
    var radius = canvas.height / 2;

    ctx.translate(radius, radius);
    radius = radius * 0.90;

    control[0] = document.forms["number-form"].elements["number-radio"];
    control[1] = document.forms["hand-form"].elements["hand-radio"];
    control[2] = document.forms["face-form"].elements["face-radio"];

    setInterval(function(){drawClock(ctx, radius);}, 1000);
}

function drawClock(ctx, radius){
    var radios = control[0];
    for(var i = 0; i < radios.length; i++) {
        radios[i].onclick = function() {
            numberColor = this.value;
        }
    }

    var radios = control[1];
    for(var i = 0; i < radios.length; i++) {
        radios[i].onclick = function() {
            hourColor = this.value;
        }
    }

    var radios = control[2];
    for(var i = 0; i < radios.length; i++) {
        radios[i].onclick = function() {
            faceColor = this.value;
        }
    }


    drawFace(ctx, radius);
    drawNumbers(ctx, radius);
    drawTime(ctx, radius);
}

//Draw the clock face
function drawFace(ctx, radius){
    var grad;

    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, 2 * Math.PI);
    ctx.fillStyle = faceColor;
    ctx.fill();

    grad = ctx.createRadialGradient(0, 0 ,radius * 0.95, 0, 0, radius * 1.05);
    grad.addColorStop(0, '#333');
    grad.addColorStop(0.5, 'white');
    grad.addColorStop(1, '#333');
    ctx.strokeStyle = grad;
    ctx.lineWidth = radius*0.1;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(0, 0, radius * 0.1, 0, 2 * Math.PI);
    ctx.fillStyle = '#333';
    ctx.fill();
} // end draw face

    // Draw the numbers
    function drawNumbers(ctx, radius){
        var ang;
        var num;
        ctx.font = radius * 0.15 + "px arial";
        ctx.textBaseline = "middle";
        ctx.textAlign = "center";
        ctx.fillStyle = numberColor;
        for(num = 1; num < 13; num++){
            ang = num * Math.PI / 6;
            ctx.rotate(ang);
            ctx.translate(0, -radius * 0.85);
            ctx.rotate(-ang);
            ctx.fillText(num.toString(), 0, 0);
            ctx.rotate(ang);
            ctx.translate(0, radius * 0.85);
            ctx.rotate(-ang);
        }// end loop
    } // end draw numbers

    // Get and draw the time using draw hand(length and with scale with radius)
    function drawTime(ctx, radius){
        var now = new Date();
        var hour = now.getHours();
        var minute = now.getMinutes();
        var second = now.getSeconds();
        //hour
        hour = hour%12;
        hour = (hour*Math.PI/6)+(minute*Math.PI/(6*60))+(second*Math.PI/(360*60));
        drawHand(ctx, hour, radius*0.5, radius*0.07);
        //minute
        minute = (minute*Math.PI/30)+(second*Math.PI/(30*60));
        drawHand(ctx, minute, radius*0.8, radius*0.07);
        // second
        second = (second*Math.PI/30);
        drawHand(ctx, second, radius*0.9, radius*0.02);
    } // End draw time

    // Draw the hands of the clock
    function drawHand(ctx, pos, length, width) {
          ctx.beginPath();
          ctx.lineWidth = width;
          ctx.lineCap = "round";
          ctx.strokeStyle = hourColor;
          ctx.moveTo(0,0);
          ctx.rotate(pos);
          ctx.lineTo(0, -length);
          ctx.stroke();
          ctx.rotate(-pos);
    } // end draw hand
