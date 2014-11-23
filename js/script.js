var canvas, ctx;
var pressedKeys = [];
var backgroundImg;
var player=null;
var enemies = [];
var stepSize= 7;
var uncontrolledPlayers = [];
var globalX, globalY;
var time=0;
var playerXstart,playerYstart;

//pass top left as (x, y)
function CheckCollision(x1, y1, w1, h1, x2, y2, w2, h2)
{
    var left1 = x1;
    var right1 = x1 + w1;
    var top1 = y1;
    var bottom1 = y1 + h1;
    var left2 = x2;
    var right2 = x2 + w2;
    var top2 = y2;
    var bottom2 = y2 + h2;
    if(bottom1 <= top2)
        return false;
    if(top1 >= bottom2)
        return false;
    if(right1 <= left2)
        return false;
    if(left1 >= right2)
        return false;
    return true;
}
function Player(x, y, w, h, image)
{
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.image = image;
    //true = civilian, false = soldier
    this.state = true;
    this.frame =0;
    this.points = 0;
}
Player.prototype.Draw = function()
{
//ctx.drawImage(this.image,this.x - this.w/2 - globalX, this.y - this.h/2 - globalY);
    var curFrame;
    if(Math.floor(time/10)%2){
        curFrame=this.frame;
    }
    else{
        curFrame=this.frame+1; 
    } 
    ctx.drawImage(this.image, this.w*curFrame, 0, this.w, this.h, this.x - this.w/2 - globalX, this.y - this.h/2 - globalY,32,32);
    
}

Player.prototype.CheckCollisions = function()
{
    if(this.state)
    {
        if(enemies.length > 0)
        {
           for(var ekey in enemies)
           {
               if(enemies[ekey] != undefined)
               {
                   if(CheckCollision(this.x - this.w/2, this.y - this.h/2, this.w, this.h,
                       enemies[ekey].x - enemies[ekey].w/2, enemies[ekey].y - enemies[ekey].h/2,
                       enemies[ekey].w, enemies[ekey].h))
                       {
                            playerXstart=this.x;
                            playerYstart=this.y;
                            this.image.src='images/soldiersprite.png'
                            this.state = false;
                       }
                   
               }
           }
        }
    }
    else
    {
        if(uncontrolledPlayers.length > 0)
        {
            for(var pkey in uncontrolledPlayers)
            {
                if(uncontrolledPlayers[pkey] != undefined)
                {
                    if(CheckCollision(this.x - this.w/2, this.y - this.h/2, this.w, this.h,         uncontrolledPlayers[pkey].x - uncontrolledPlayers[pkey].w/2, uncontrolledPlayers[pkey].y - uncontrolledPlayers[pkey].h/2, uncontrolledPlayers[pkey].w, uncontrolledPlayers[pkey].h))
                        this.points++;
                }
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
    this.frame = 0;
}

UncontrolledPlayer.prototype.Draw = function()
{
    if(CheckCollision(this.x - this.w/2, this.y - this.h/2, this.w, this.h, globalX, globalY, canvas.width,
        canvas.height))
        ctx.drawImage(this.image, this.w*this.frame, 0, this.w, this.h, this.x - this.w/2 - globalX, this.y - this.h/2 - globalY);
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
    
    if(CheckCollision(this.x - this.w/2, this.y - this.h/2, this.w, this.h, globalX, globalY, canvas.width,
        canvas.height))
        ctx.drawImage(this.image, this.x-this.w/2 - globalX, this.y - this.h/2 - globalY);
}

function drawScene(){
    time++;
    updateScene();
    processPressedKeys();
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.drawImage(backgroundImg, globalX, globalY, ctx.canvas.width, ctx.canvas.width, 0, 0, 700, 700);
    player.Draw();
    if (enemies.length > 0) {
        for (var ekey in enemies) {
            if (enemies[ekey] != undefined) {
                enemies[ekey].Draw();
            }
        }
    }
    /*if (uncontrolledPlayers.length > 0) {
        for (var ekey in uncontrolledPlayers) {
            if (uncontrolledPlayers[ekey] != undefined) {
                uncontrolledPlayers[ekey].Draw();
            }
        }
    }*/
    player.CheckCollisions();
    
}

function updateScene(){
    // update enemies and uncontrolled players status
    // send current location data to server
}

function processPressedKeys() {
    if (pressedKeys[37] != undefined) { // 'Left' key
        if (player.x - player.w / 2 > 10) {
            player.frame=2;
            player.x -= stepSize;
            globalX -= stepSize;
        }
    }
    else if (pressedKeys[38] != undefined) { // 'Up' key
        if (player.y - player.h / 2 > 10) {
            player.frame=6;
            player.y -= stepSize;
            globalY -= stepSize;
        }
    }
    else if (pressedKeys[39] != undefined) { // 'Right' key
        if (player.x + player.w / 2 < canvas.width - 10) {
            player.frame=4;
            player.x += stepSize;
            globalX += stepSize;
        }
    }
    else if (pressedKeys[40] != undefined) { // 'Down' key
        if (player.y + player.h / 2 < canvas.height - 10) {
            player.frame=0;
            player.y += stepSize;
            globalY += stepSize;
        }
    }
}

$(function(){
    canvas = document.getElementById('scene');
    ctx = canvas.getContext('2d');
    
    backgroundImg=new Image();
    backgroundImg.src = 'images/levelmap.jpg';
    backgroundImg.onload=function(){}
        globalX = 0;
        globalY = 0;
    var playerImg= new Image();
    playerImg.src='images/usersprite.png';
    playerXstart=canvas.width /2;
    playerYstart=canvas.height/2
    playerImg.onload=function(){
        player=new Player(playerXstart,playerYstart , playerImg.width/8, playerImg.height, playerImg);

    }
    var enemyImg=new Image();
    enemyImg.src= 'images/enemy.png';
    enemyImg.onload=function(){}
    
    enemies[0]=new Enemy(40, 50, 70,70, enemyImg);   
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
