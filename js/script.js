var canvas, ctx;
var pressedKeys = [];
var backgroundImg;
var player=null;
var playerWidth=100;
var playerHeight=100;
var enemies = [];
var stepSize= 7;
var uncontrolledPlayers = [];
var globalX, globalY;
function Player(x, y, w, h, image)
{
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.image = image;
    this.state = true;
}
Player.prototype.Draw = function()
{
    ctx.drawImage(this.image, this.x - this.w/2 - globalX, this.y - this.h/2 - globalY);
}

Player.prototype.CheckCollisions = function()
{
    if(enemies.length > 0)
    {
       for(var ekey in enemies)
       {
           if(enemies[ekey] != undefined)
           {
               var leftP = this.x - this.w/2;
               var rightP = this.x + this.w/2;
               var topP = this.y - this.h/2;
               var bottomP = this.y + this.h/2;
               var leftE = enemies[ekey].x - enemies[ekey].w/2;
               var rightE = enemies[ekey].x + enemies[ekey].w/2;
               var topE = enemies[ekey].y - enemies[ekey].h/2;
               var bottomE = enemies[ekey].y + enemies[ekey].h/2;
               
           }
       }
    }
}

function UncontrolledPlayer(x, y, w, h, image)
{
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.image = image;
}

UncontrolledPlayer.prototype.Draw = function()
{
}
function Enemy(x, y, w, h, image)
{
    
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.image = image;
}
Enemy.prototype.Draw = function()
{
    
    ctx.drawImage(this.image, this.x-this.w/2, this.y);
}

function drawScene(){
    processPressedKeys();
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.drawImage(backgroundImg, 0, 0, 700, 700, 0, 0, 700, 700);
    player.Draw();
    if (enemies.length > 0) {
            for (var ekey in enemies) {
                if (enemies[ekey] != undefined) {
                    enemeis[ekey].Draw();
                }
            }
        }
    
}

function processPressedKeys() {
    if (pressedKeys[37] != undefined) { // 'Left' key
        if (player.x - player.w / 2 > 10) {
            player.x -= stepSize;
        }
    }
    else if (pressedKeys[38] != undefined) { // 'Up' key
        if (player.y - player.h / 2 > 10) {
            player.y -= stepSize;
        }
    }
    else if (pressedKeys[39] != undefined) { // 'Right' key
        if (player.x + player.w / 2 < canvas.width - 10) {
            player.x += stepSize;
        }
    }
     else if (pressedKeys[40] != undefined) { // 'Down' key
        if (player.y + player.h / 2 < canvas.height - 10) {
            player.y += stepSize;
        }
    }
}

$(function(){
    canvas = document.getElementById('scene');
    ctx = canvas.getContext('2d');
    
    backgroundImg=new Image();
    //backgroundImg.src = 'images/dirt.png';
    backgroundImg.onload=function(){}
    globalX = 0;
globalY = 0;
    var playerImg= new Image();
    playerImg.src='images/enemy.png';
    playerImg.onload=function(){
        player=new Player(canvas.width /2, canvas.height- playerHeight-10, playerWidth, playerHeight, playerImg);
    }
    
    $(window).keydown(function (evt){ // onkeydown event handle
        var pk = pressedKeys[evt.keyCode];
        if (! pk) {
            pressedKeys[evt.keyCode] = 1; // add all pressed keys into array
        }
    });
     $(window).keyup(function (evt) { // onkeyup event handle
        var pk = pressedKeys[evt.keyCode];
        if (pk) {
            delete pressedKeys[evt.keyCode]; // remove pressed key from array
        }
    });
    
    setInterval(drawScene, 30);


});
