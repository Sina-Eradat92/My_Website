//Gobal variables

var cvs = document.getElementById("game1");
var ctx = cvs.getContext('2d');
var lastFrameTimeMs = 0;
var maxFPS = 60;
var delta = 0;
var timestep = 1000 / 60;

// Objeccts
function Pipe(x, topY, bottomY)
{
    this.top = new Image();
    this.bottom = new Image();
    this.x = x;
    this.topY = topY;
    this.bottomY = bottomY;
    this.top.src = "img/flap/pipeNorth.png";
    this.bottom.src = "img/flap/pipeSouth.png";

    this.draw = function(){
        ctx.drawImage(this.top,this.x,this.topY);
        ctx.drawImage(this.bottom,this.x,this.bottomY);
    }

    this.update = function(delta){
        this.x -= speed * delta;
    }

    this.getX = function()
    {
        return this.x;
    }

}// end pipe

//Player
function Player(src, x, y)
{
    this.player = new Image();
    this.player.src = src;
    this.x = x;
    this.y = y;

    this.draw = function(){
        ctx.drawImage(this.player,this.x,this.y);
    }

    this.update = function(gravity, delta){
        if(this.y >= ((cvs.height - fg.height) - this.player.height))
        {
            this.y = ((cvs.height - fg.height) - this.player.height);

        }
        else
        {
            this.y += gravity * delta;
        }
        console.log(this.y);
    }

    this.move = function(gravity, delta, offset){
        this.y -= 25;
        console.log("flap");
    }

}

// Assets
var player;
var bg = new Image();
var fg = new Image();
var pipes = [];

// Pipe variables
var vGap = 85;
var hGap = 5;
var floor = 394;
var pipeWidth = 52;
var pipHeight = 242;


// Game variables
var speed = 0.08;
var gravity = 0.08;

// Main draw function called by game loop
function draw()
{
    ctx.drawImage(bg,0,0);
    player.draw();
    for(var i = 0; i < pipes.length; i++)
    {
        pipes[i].draw();
    }
    player.draw();
    ctx.drawImage(fg,0,cvs.height - fg.height);
}

// Main update function called by game loop
// Delta is the frame rate
function update(delta)
{
    player.update(gravity, delta);

    for(var i = 0; i < pipes.length; i++)
    {
        pipes[i].update(delta);
    }
    if (pipes[0].getX() <= (0 - (pipeWidth+20))) {
        pipes.shift();
        pipes.push(new Pipe(pipes[pipes.length-1].getX() + (pipeWidth * hGap), 0, 300));
        console.log(pipes.length);
    }
    // See the lead pipe location
    //console.log(pipes[0].getX());
}

// Main game loop
function game(timestamp)
{
    // Throttle the frame rate.
    if (timestamp < lastFrameTimeMs + (1000 / maxFPS)) {

        requestAnimationFrame(game);
        return;
    }
    delta += timestamp - lastFrameTimeMs;
    lastFrameTimeMs = timestamp;

    while (delta >= timestep) {
        update(timestep);
        delta -= timestep;
    }

    ctx.clearRect(0, 0, cvs.width, cvs.height);
    draw();
    requestAnimationFrame(game);
}

// Entry point of the game
function load(){
    playerSrc = "img/flap/bird.png";
    bg.src = "img/flap/bg.png";
    fg.src = "img/flap/fg.png";

    // load player
    player = new Player(playerSrc,20,50);
    document.addEventListener("keydown", player.move(gravity,delta,2));
    for(var i = 0; i < 5; i++)
    {
        pipes.push(new Pipe(cvs.width + ((pipeWidth * hGap) * i), 0, 300));
        console.log(pipes[i].x);
    }

}

function flap(){
    console.log("flap");
}

// Start
console.log(" FlappyBird.js loaded...");
load();
requestAnimationFrame(game);
//setInterval(function(){game();}, 100);
