var canvas, ctx;
var pressedKeys = [];
var player=null;
var enemies = [];
var stepSize= 7;


function Player(x, y, w, h, image)
{
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.image = image;
}
Player.prototype.Draw = function()
{
    ctx.drawImage(this.image, this.x - this.w/2, this.y - h/2);
}

Player.prototype.CheckCollisions = function()
{
    if(enemies.length > 0)
    {
       for(var ekey in enemies)
       {
           if(enemies[ekey] != undefined)
           {
               if(this.y - this.h/2 < enemies[ekey].y + enemies[ekey].h/2 && this.x-this.w/2 < 
           }
       }
    }
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
    processKeys();
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    player.Draw();
    
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
            player.x += stepSize;
        }
    }
}

$(function(){
    canvas = document.getElementById('scene');
    ctx = canvas.getContext('2d');
    
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


}