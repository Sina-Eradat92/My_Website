//Gobal variables

var cvs = document.getElementById("game1");
var ctx = cvs.getContext('2d');
var lastFrameTimeMs = 0;
var maxFPS = 60;
var delta = 0;
var timestep = 1000 / 60;

// Objeccts
function Pipe(x)
{
    this.top = new Image();
    this.bottom = new Image();
    this.top.src = "img/flap/pipeNorth.png";
    this.bottom.src = "img/flap/pipeSouth.png";
    this.x = x;
    this.topY = Math.random() * (0 - -200) + -200;  //max: 0 min: -200
    this.bottomY = (this.topY + 242) + 85 ;

    //console.log("top:" + this.topY + " bottom:" + this.bottomY);
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

    this.collider = function(playerX, playerY, offset)
    {
        if(((playerX + (playerX / 2)) >= (this.x - (this.top.width/2))) && (playerY <= (this.topY + 242-offset) || (playerY >= this.bottomY+offset)))
        {
            //console.log("collder:" + playerY + " vs " + bottomY); //use this (this.topY + 242) ((this.topY + 242) + 85)
            return true;
        }
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
        else if (this.y <= 0 ){
            this.y = 1;
        }
        else
        {
            this.y += gravity * delta;
        }
        //console.log(this.y);
    }

    this.move = function(up){
        this.y -= up;
        //console.log(this.y);
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
var hitVBuffer = 0;
var flap = 20;
var xPos = 20;
var yPos = 100;
var score = 0;


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

    // Score
    ctx.font = "60px Arial"
    ctx.fillStyle = "Black"
    ctx.fillText(score,cvs.width/2 - 30,cvs.height-30)
}

// Main update function called by game loop
// Delta is the frame rate
function update(delta)
{
    // Update the player
    player.update(gravity, delta);

    // Update the pipes
    for(var i = 0; i < pipes.length; i++)
    {
        pipes[i].update(delta);
    }

    if (pipes[0].getX() <= (0 - (pipeWidth+20))) {
        pipes.shift();
        pipes.push(new Pipe(pipes[pipes.length-1].getX() + (pipeWidth * hGap)));
        score += 1;
    }

    // Colision detection
    if(player.y <= 1 || player.y >= 368 || pipes[0].collider(player.x, player.y,hitVBuffer))
    {
        player.x = ((pipes[0].x - pipes[0].top.width/2)) ;
        gameover();
        console.log("Game Over");

    }

    // safe guard
    if(player.x < -5){
        player.x = xPos;
    }
    // Info
    //console.log(pipes[0].getX());
    //console.log("player-" + player.y + " top-" + pipes[0].topY + " bottom-" + pipes[0].bottomY);
    //console.log(score);
}// end update

// Game Over
function gameover() {
    score = 0;
    this.draw = function(){
        ctx.font = "30px Arial"
        ctx.fillStyle = "Black"
        ctx.fillText("GAMEOVER!",(cvs.width/2)-100, cvs.height/2);
        clearInterval(animateInterval);
    }
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
    score = 0;

    // load player
    player = new Player(playerSrc,xPos, yPos);
    document.addEventListener("keydown", function move(){player.move(flap);});
    document.getElementById("game1").addEventListener("mousedown", function move(){player.move(flap);});
    document.getElementById("game1").addEventListener("mouseup", function move(){});

    for(var i = 0; i < 5; i++)
    {
        pipes.push(new Pipe(cvs.width + ((pipeWidth * hGap) * i)));
        console.log(pipes[i].x);
    }

}

// Start
console.log(" FlappyBird.js loaded...");
load();
requestAnimationFrame(game);
//setInterval(function(){game();}, 100);
