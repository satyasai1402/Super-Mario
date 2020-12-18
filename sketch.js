var bg, bgImg;
var ground,groundImg;
var brick,brickImg, bricksGroup;
var mario,marioAni,marioCollided;
var obstacle,obstacleAni,obstaclesGroup;
var score=0;
var gameState="play";
var gameOverImg,restartImg,restart,gameOver;

function preload(){
  bgImg=loadImage("bg.png");
  groundImg=loadImage("ground2.png");
  brickImg=loadImage("brick.png");
  gameOverImg=loadImage("gameOver.png");
  restartImg=loadImage("restart.png");
  marioAni=loadAnimation("mario00.png","mario01.png","mario02.png","mario03.png");
  marioCollided=loadAnimation("collided.png");
  obstacleAni=loadAnimation("obstacle1.png","obstacle2.png","obstacle3.png");
   
  backSound=loadSound("background.mp3");
  jumpSound=loadSound("jump.mp3");
  dieSound=loadSound("die.mp3");
  checkSound=loadSound("checkPoint.mp3");
}

function setup(){
  createCanvas(600,390);
  backSound.play();
  
  bg=createSprite(300,185,600,390);
  bg.addImage(bgImg);
  
  ground=createSprite(300,355,600,80);
  ground.addImage(groundImg);
  
  mario=createSprite(50,280,20,70);
  mario.addAnimation("mario",marioAni);
  mario.addAnimation("collided", marioCollided);
  mario.scale=1.5;
  mario.x=50;
  
  mario.setCollider("rectangle",0,0,30,30)
  
  brick = createSprite(600,220,10,10);
  
  gameOver=createSprite(300,150);
  gameOver.addImage("over",gameOverImg);
  
  restart=createSprite(300,180);
  restart.addImage("restart",restartImg);
  
  gameOver.visible=false;
  restart.visible=false;
  restart.scale=0.5;
 
  //groups
  bricksGroup=new Group();
  obstaclesGroup=new Group();
}
function draw(){ 
  if(ground.x<0){
    ground.x=ground.width/2;
  }
  ground.velocityX=-10;  
  if(gameState==="play"){
  
  if(keyDown("space")&& mario.y>=230){
    mario.velocityY=-12;
    jumpSound.play();
    }
  mario.velocityY=mario.velocityY+0.8;
  spawnBricks();    
  spawnObstacles();
    for(var i=0; i<bricksGroup.length;i++){
    if(mario.isTouching(bricksGroup.get(i))){
      bricksGroup.get(i).destroy();
      score=score+1;
    }
      if(score>0 && score%5===0){
    checkSound.play();
    ground.velocityX=-(10+(score*0.1));
  }
    }
  if(mario.isTouching(obstaclesGroup)){
    backSound.stop();
    gameState="end";
    dieSound.play();
  }
  }
  if (gameState==="end"){
    ground.velocityX=0;
    mario.changeAnimation("collided",marioCollided);
    bricksGroup.setVelocityXEach(0);
    obstaclesGroup.setVelocityXEach(0);
    mario.velocityY=0;
    gameOver.visible=true;
    restart.visible=true;
    
    if(mousePressedOver(restart)) {
      reset();
      backSound.play();
    }
  }
  mario.collide(ground); 
  drawSprites();
  textSize(20);
  stroke("black");
  fill("black");
  text("SCORE: "+score,450,100);
}

function spawnBricks(){
  if(frameCount%40===0){
    brick = createSprite(600,220,10,10);
    brick.y = Math.round(random(160,210));
    brick.addImage(brickImg);
    brick.velocityX=-4;
    brick.lifeTime=150;
    bricksGroup.add(brick);
  }   
}

function spawnObstacles(){
  if (frameCount % 75 === 0) {
    obstacle = createSprite(600,290,10,10);
    obstacle.addAnimation("obsta",obstacleAni);
    obstacle.velocityX=-(4+score/20);
    console.log(obstacle.velocityX)
    obstacle.lifeTime=150;
    obstacle.setCollider("rectangle",0,0,30,50)
    obstaclesGroup.add(obstacle);
  }
}

function reset(){
  gameState = "play";
  gameOver.visible = false;
  restart.visible = false;
  
  obstaclesGroup.destroyEach();
  bricksGroup.destroyEach();
  
  mario.changeAnimation("mario",marioAni);
      
  score = 0;
  
}