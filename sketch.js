const Engine = Matter.Engine;
const Render = Matter.Render;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Constraint = Matter.Constraint;
const Body = Matter.Body;
const Composites = Matter.Composites;
const Composite = Matter.Composite;

let engine;
let world;
var ground, bridge;
var leftWall, rightWall;
var jointPoint;
var jointLink;

var stones = [];

let zombie, breakButton;
let sadZombieImg, zombie1Img, zombie2Img, zombie3Img, zombie4Img, backgroundImg;
let stoneImg;

function preload() {
  zombie1Img = loadImage("./assets/zombie1.png");
  zombie2Img = loadImage("./assets/zombie2.png");
  zombie3Img = loadImage("./assets/zombie3.png");
  zombie4Img = loadImage("./assets/zombie4.png");

  sadZombieImg = loadImage("./assets/sad_zombie.png");
  
  stoneImg = loadImage("./assets/stone.png");
  backgroundImg = loadImage("./assets/background.png");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  engine = Engine.create();
  world = engine.world;
  frameRate(80);

  zombie = createSprite(width / 2, height - 110);

  zombie.addAnimation("facingRight", zombie1Img, zombie2Img, zombie1Img);
  zombie.addAnimation("facingLeft", zombie3Img, zombie4Img, zombie3Img);

  zombie.addImage("sadZombie", sadZombieImg);

  zombie.scale = 0.1;
  zombie.velocityX = 4;

  breakButton = createButton("");
  breakButton.position(width - 200, height / 2 - 50);
  breakButton.class("breakButton");
  breakButton.mouseClicked(handleButtonPressed);

  ground = new Base(0, height - 10, width * 2, 20, "#795548", true);
  leftWall = new Base(300, height / 2 + 50, 600, 100, "#8d6e63", true);
  rightWall = new Base(width - 300, height / 2 + 50, 600, 100, "#8d6e63", true);

  bridge = new Bridge(15, { x: width / 2 - 400, y: height / 2 });
  jointPoint = new Base(width - 600, height / 2 + 10, 40, 20, "#8d6e63", true);

  Matter.Composite.add(bridge.body, jointPoint);
  jointLink = new Link(bridge, jointPoint);

  for (var i = 0; i <= 8; i++) {
    var x = random(width / 2 - 200, width / 2 + 300);
    var y = random(-10, 140);
    var stone = new Stone(x, y, 80, 80);
    stones.push(stone);
  }
}

function draw() {
  background(backgroundImg);
  Engine.update(engine);

  ground.show();
  bridge.show();
  leftWall.show();
  rightWall.show();

  for (var stone of stones) {
    stone.show();
    
    let pos = stone.body.position;
    let distance = dist(zombie.position.x, zombie.position.y, pos.x, pos.y);

    if (distance <= 50) {
      zombie.velocityX = 0;
      Matter.Body.setVelocity(stone.body, {x : 10, y : -10});
      zombie.changeImage("sadZombie");
      collided = true;
    }
  }

  drawSprites();
}

function handleButtonPressed() {
  jointLink.detach();
  setTimeout(() => {
    bridge.break();
  }, 1500);
}