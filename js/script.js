var canvas, ctx;
var pressedKeys = [];
var backgroundImg;
var player=null;
var enemies = {};
var stepSize= 8;
var uncontrolledPlayers = {};
var globalX, globalY;
var time=0;
var playerImg, soldierImg, citizenImg;
var rootRef;
var userID;
var playerX, playerY;
var mapW, mapH;
var fireSet=true;
var rocks = [];
var rockImg;

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
function Rock(x, y, w, h)
{
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
}

Rock.prototype.Draw = function()
{
    ctx.drawImage(rockImg, this.x - this.w/2 - globalX, this.y - this.h/2 - globalY);
}
function Player(x, y, w, h)
{
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    //true = civilian, false = soldier
    this.state = 1;
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
    ctx.drawImage(playerImg, (this.w/2)*curFrame, 0, this.w/2, this.h/2, this.x - this.w/2 - globalX, this.y - this.h/2 - globalY,32,32);
}

Player.prototype.CheckCollisions = function()
{
    if(this.state==1)
    {
        for (ekey in enemies) {
            if (enemies.hasOwnProperty(ekey)){
                if(CheckCollision(this.x - this.w/2, this.y - this.h/2, this.w, this.h,
                    enemies[ekey].x - enemies[ekey].w/2, enemies[ekey].y - enemies[ekey].h/2,
                    enemies[ekey].w, enemies[ekey].h))
                {
                    playerX=this.x;
                    playerY=this.y;
                    playerImg.src='images/soldier1mainsprite.png'
                    citizenImg.src='images/userghostsprite.png'
                    enemyImg.src='images/soldier1ghostsprite.png'
                    this.state = 2;
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

function UncontrolledPlayer(x, y, w, h)
{
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.frame = 0;
    this.points=0;
}

UncontrolledPlayer.prototype.Draw = function()
{
    if(CheckCollision(this.x - this.w/2, this.y - this.h/2, this.w, this.h, globalX, globalY, canvas.width,
        canvas.height)){
        var curFrame;
        if(Math.floor(time/10)%2){
            curFrame=this.frame;
        }
        else{
            curFrame=this.frame+1; 
        } 
        ctx.drawImage(citizenImg, this.w*curFrame, 0, this.w, this.h, this.x - this.w/2 - globalX, this.y - this.h/2 - globalY,32,32);
}   }

function Enemy(x, y, w, h)
{
    
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.frame=0;
    this.points=0;
}
Enemy.prototype.Draw = function()
{
    
    if(CheckCollision(this.x - this.w/2, this.y - this.h/2, this.w, this.h, globalX, globalY, canvas.width,
        canvas.height)){
        var curFrame;
        if(Math.floor(time/10)%2){
            curFrame=this.frame;
        }
        else{
            curFrame=this.frame+1; 
        } 
        ctx.drawImage(enemyImg, this.w*curFrame, 0, this.w, this.h, this.x - this.w/2 - globalX, this.y - this.h/2 - globalY,32,32);
    }
}

function drawScene(){
    //console.log("(",player.x,",",player.y,")");
    time++;
    rootRef.child(userID).set({"x_val":player.x,"y_val":player.y,"state":player.state, "points":player.points, "w":player.w,"h":player.h});
    processPressedKeys();
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    //ctx.drawImage(backgroundImg, globalX, globalY, ctx.canvas.width, ctx.canvas.width, 0, 0, 700, 700);
    for(i = 0; i <= canvas.width / backgroundImg.width; i++)
    {
        for(j = 0; j <= canvas.height / backgroundImg.height; j++)
            ctx.drawImage(backgroundImg, i * backgroundImg.width, j*backgroundImg.height);
    }
    for(i = 0; i < rocks.length; i++)
        rocks[i].Draw()
    player.Draw();
    for (var ekey in enemies) {
        if (enemies.hasOwnProperty(ekey)) {
            enemies[ekey].Draw();
        }
    }
    for (var ekey in uncontrolledPlayers) {
        if (uncontrolledPlayers.hasOwnProperty(ekey)) {
            uncontrolledPlayers[ekey].Draw();
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


function processPressedKeys() {
    if (pressedKeys[37] != undefined) { // 'Left' key
            player.frame=2;
            player.x -= stepSize;
            globalX -= stepSize;
            if(player.x - player.w /2 < 0)
                player.x = player.w/2;
            for(i = 0; i < rocks.length; i++)
            {
                if(CheckCollision(player.x - player.w/2, player.y - player.h/2, player.w, player.h, 
                    rocks[i].x - rocks[i].w/2, rocks[i].y - rocks[i].h/2, rocks[i].w, rocks[i].h))
                    player.x = rocks[i].x + rocks[i].w/2 + player.w/2;
            }
    }
    else if (pressedKeys[38] != undefined) { // 'Up' key
            player.frame=6;
            player.y -= stepSize;
            globalY -= stepSize;
            if(player.y - player.h/2 < 0)
                player.y = player.h/2;
            for(i = 0; i < rocks.length; i++)
            {
                if(CheckCollision(player.x - player.w/2, player.y - player.h/2, player.w, player.h, 
                    rocks[i].x - rocks[i].w/2, rocks[i].y - rocks[i].h/2, rocks[i].w, rocks[i].h))
                    player.y = rocks[i].y + rocks[i].h/2 + player.h/2;
            }
    }
    else if (pressedKeys[39] != undefined) { // 'Right' key
            player.frame=4;
            player.x += stepSize;
            globalX += stepSize;
            if(player.x + player.w > mapW)
                player.x = mapW - player.w/2;
            for(i = 0; i < rocks.length; i++)
            {
                if(CheckCollision(player.x - player.w/2, player.y - player.h/2, player.w, player.h, 
                    rocks[i].x - rocks[i].w/2, rocks[i].y - rocks[i].h/2, rocks[i].w, rocks[i].h))
                    player.x = rocks[i].x - rocks[i].w/2 - player.w/2;
            }
    }
    else if (pressedKeys[40] != undefined) { // 'Down' key
            player.frame=0;
            player.y += stepSize;
            globalY += stepSize;
            if(player.y + player.h > mapH)
                player.y = mapH - player.h/2;
            for(i = 0; i < rocks.length; i++)
            {
                if(CheckCollision(player.x - player.w/2, player.y - player.h/2, player.w, player.h, 
                    rocks[i].x - rocks[i].w/2, rocks[i].y - rocks[i].h/2, rocks[i].w, rocks[i].h))
                    {
                        console.log(rocks[i]);
                        player.y = rocks[i].y - rocks[i].h/2 - player.h/2;
                    }
            }
    }
    
    globalX = player.x - canvas.width/2;
    globalY = player.y - canvas.height/2;
    if(globalX < 0)
         globalX = 0;
    if(globalY < 0)
                globalY = 0;
    if(globalX + canvas.width > mapW)
                globalX = mapW - canvas.width;
    if(globalY + canvas.height > mapH)
                globalY = mapH - canvas.height;
    else if (pressedKeys[13]){
        rootRef.child(userID).set(null);
        window.close();
    }
}

$(function(){
    canvas = document.getElementById('scene');
    ctx = canvas.getContext('2d');
    
    backgroundImg=new Image();
    backgroundImg.src = 'images/dirt.png';
    backgroundImg.onload=function(){}
    globalX = 0;
    globalY = 0;
    mapW = 1024;
    mapH = 1024;
    playerImg= new Image();
    playerImg.src='images/usermainsprite.png';
    playerX=canvas.width/2;
    playerY=canvas.height/2;

    playerImg.onload=function(){
        player=new Player(playerX,playerY, playerImg.width/4, playerImg.height*2);
        if(fireSet){
            var tempRef=rootRef.push({"x_val":player.x,"y_val":player.y,"state":player.state, "points":player.points, "w": player.w,"h":player.h });
            userID=tempRef.key();
            rootRef.on('child_changed', function(dataSnapshot) {

                var snapKey=dataSnapshot.key();
                if(snapKey!=userID){
                    if(enemies.hasOwnProperty(snapKey)){
                        if(dataSnapshot.val().state==2){
                            delete enemies[snapKey];
                            uncontrolledPlayers[snapKey]=new UncontrolledPlayer(dataSnapshot.val().x_val, dataSnapshot.val().y_val, dataSnapshot.val().w, dataSnapshot.val().h);
                            uncontrolledPlayers[snapKey].state=dataSnapshot.val().state;
                            uncontrolledPlayers[snapKey].points=dataSnapshot.val().points;
                        }
                        else{
                            enemies[snapKey].x=dataSnapshot.val().x_val;
                            enemies[snapKey].y=dataSnapshot.val().y_val;
                            enemies[snapKey].state=dataSnapshot.val().state;
                            enemies[snapKey].state=dataSnapshot.val().points;
                        }
                    }
                    if(uncontrolledPlayers.hasOwnProperty(snapKey)){
                        if(dataSnapshot.val().state==2){
                            delete uncontrolledPlayers[snapKey];
                            enemies[snapKey]=new Enemy(dataSnapshot.val().x_val, dataSnapshot.val().y_val, dataSnapshot.val().w, dataSnapshot.val().h);
                            enemies[snapKey].state=dataSnapshot.val().state;
                            enemies[snapKey].points=dataSnapshot.val().points;
                        }
                        else{
                            uncontrolledPlayers[snapKey].x=dataSnapshot.val().x_val;
                            uncontrolledPlayers[snapKey].y=dataSnapshot.val().y_val;
                            uncontrolledPlayers[snapKey].state=dataSnapshot.val().state;
                            uncontrolledPlayers[snapKey].state=dataSnapshot.val().points;
                        }
                    }
                }
            });
            rootRef.on('child_added', function(dataSnapshot) {
                if(snapKey!=userID){
                    var snapKey=dataSnapshot.key();
                    console.log(dataSnapshot.val().state);
                    if(dataSnapshot.val().state==2){
                        enemies[snapKey]=new Enemy(dataSnapshot.val().x_val, dataSnapshot.val().y_val, dataSnapshot.val().w, dataSnapshot.val().h);
                        enemies[snapKey].state=dataSnapshot.val().state;
                        enemies[snapKey].points=dataSnapshot.val().points;
                    }
                    else if(dataSnapshot.val().state==1){
                        uncontrolledPlayers[snapKey]=new UncontrolledPlayer(dataSnapshot.val().x_val, dataSnapshot.val().y_val, dataSnapshot.val().w, dataSnapshot.val().h);
                        uncontrolledPlayers[snapKey].state=dataSnapshot.val().state;
                        uncontrolledPlayers[snapKey].points=dataSnapshot.val().points;
                    }
                }
                
            });
            // Retrieve new posts as they are added to Firebase
            /*ref.on("child_added", function(snapshot) {
            var newPost = snapshot.val();
            console.log("Author: " + newPost.author);
            console.log("Title: " + newPost.title);
            });*/
            fireSet=false;
        }
    }
    
    
    enemyImg=new Image();
    enemyImg.src= 'images/soldier1mainsprite.png';
    enemyImg.onload=function(){}
    
    citizenImg=new Image();
    citizenImg.src= 'images/userghostsprite.png';
    citizenImg.onload=function(){}
    
    rockImg = new Image();
    rockImg.src = 'images/rock.png';
    rockImg.onload = function()
    {
            rocks[0] = new Rock(983, 97, rockImg.width, rockImg.height);
            rocks[1] = new Rock(504, 691, rockImg.width, rockImg.height);
            rocks[2] = new Rock(727, 616, rockImg.width, rockImg.height);
            rocks[3] = new Rock(186, 929, rockImg.width, rockImg.height);
            rocks[4] = new Rock(996, 577, rockImg.width, rockImg.height);
            rocks[5] = new Rock(945, 864, rockImg.width, rockImg.height);
            rocks[6] = new Rock(575, 303, rockImg.width, rockImg.height);
            rocks[7] = new Rock(419, 403, rockImg.width, rockImg.height);
            rocks[8] = new Rock(666, 561, rockImg.width, rockImg.height);
            rocks[9] = new Rock(591, 17, rockImg.width, rockImg.height);
            rocks[10] = new Rock(985, 382, rockImg.width, rockImg.height);
            rocks[11] = new Rock(553, 602, rockImg.width, rockImg.height);
            rocks[12] = new Rock(719, 38, rockImg.width, rockImg.height);
            rocks[13] = new Rock(46, 640, rockImg.width, rockImg.height);
            rocks[14] = new Rock(457, 230, rockImg.width, rockImg.height);
            rocks[15] = new Rock(327, 573, rockImg.width, rockImg.height);
            rocks[16] = new Rock(241, 416, rockImg.width, rockImg.height);
            rocks[17] = new Rock(8, 832, rockImg.width, rockImg.height);
            rocks[18] = new Rock(737, 968, rockImg.width, rockImg.height);
            rocks[19] = new Rock(522, 194, rockImg.width, rockImg.height);
            rocks[20] = new Rock(35, 709, rockImg.width, rockImg.height);
            rocks[21] = new Rock(1012, 443, rockImg.width, rockImg.height);
            rocks[22] = new Rock(846, 610, rockImg.width, rockImg.height);
            rocks[23] = new Rock(147, 407, rockImg.width, rockImg.height);
            rocks[24] = new Rock(424, 488, rockImg.width, rockImg.height);
            rocks[25] = new Rock(871, 738, rockImg.width, rockImg.height);
            rocks[26] = new Rock(316, 385, rockImg.width, rockImg.height);
            rocks[27] = new Rock(423, 400, rockImg.width, rockImg.height);
            rocks[28] = new Rock(16, 11, rockImg.width, rockImg.height);
            rocks[29] = new Rock(242, 469, rockImg.width, rockImg.height);
            rocks[30] = new Rock(19, 473, rockImg.width, rockImg.height);
            rocks[31] = new Rock(890, 569, rockImg.width, rockImg.height);
            rocks[32] = new Rock(377, 260, rockImg.width, rockImg.height);
            rocks[33] = new Rock(204, 898, rockImg.width, rockImg.height);
            rocks[34] = new Rock(69, 90, rockImg.width, rockImg.height);


    }
    enemies[0]=new Enemy(40, 50, 70,70);   
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
    rootRef = new Firebase('https://escape-from-the-un.firebaseio.com');
    
    setInterval(drawScene, 30);


});
