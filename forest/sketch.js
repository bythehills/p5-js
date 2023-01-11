// p5.js + handsfree.js (by Oz Ramos)
// Documentation: https://handsfree.js.org/
// https://unpkg.com/handsfree@8.5.1/build/lib/handsfree.js
// Note: this downloads large models the first time it's run.

//recursive tree code adapted from 
//https://github.com/CodingTrain/website/blob/main/CodingChallenges/CC_015_FractalTreeArray/P5/branch.js
//inspired by eyvind earle winter scenes! 

let handsfree; // The handsfree.js tracker
let webcam; // A webcam video (for display only)

let trunkBottom = 0;
let trunkTop = 0;
let branchLeft = 0;
let branchRight = 0;
let branchRoot = 0
let groundY = 0;
let cx = 400;
let cy = 300;

let rotAngle = 3.14/10;
let branchArr = [];
let treeDiff = [];
let treeDiffY = [];
let levels = 1;
let beginX = 0;
let beginY = 0;


let t = 0;
let rayAmt = 0;
let rayArr = []; //array of ray coords

let prevBranchLeft = 0;
let prevBranchRight = 0;

let branchExpandLimit = 5; //recurse 10 times
let beginWeight = 5;
let treeCount = 10; //amount of trees
let mainBranchAngle = 0;

let maxGroundY = 0;
//------------------------------------------
function setup() {
  createCanvas(640, 1000); 
  
  // Optionally, create a webcam object. It's just for show.
  webcam = createCapture(VIDEO);
  webcam.size(640, 480);
  webcam.hide();
  
  // Configure handsfree.js to track hands, body, and/or face.
  handsfree = new Handsfree({
    showDebug: false, /* shows or hides the camera */
    hands: false,      /* acquire hand data? */
    pose: true,       /* acquire body data? */
    facemesh: false,   /* acquire face data? */
    maxNumHands: 2
  });
  handsfree.start();
  chooseFaceLandmarks(); // See below
  
   trunkBottom = createVector(0, 0)
   trunkTop = createVector(0, 0);
   branchLeft = createVector(0, 0);
   branchRight = createVector(0, 0);
   branchRoot = createVector(0, 0)
  prevBranchLeft = createVector(0, 0);
  prevBranchRight = createVector(0, 0);
  
  for (let i = 0; i < treeCount; i++){
    treeDiff.push(random(50, 100));
    treeDiffY.push(random(0, 100));
  }
  
  rayAmt = random(5, 10);
  for (let i = 0; i < rayAmt; i++){
    rayArr.push(createVector(random(-width, width + 300), random(0, height)));
  }

}


//------------------------------------------
function draw() {
  background(255);
  
  // drawVideoBackground();
  // drawHandPoints();
  fillTreePoints();
  drawBackground();
  drawOverlay();
  drawPosePoints(); 
  expandTree();
  drawGround();
  showTree();
  drawFinLayer();
  // drawFacePoints();
  
  noStroke(); 
  fill('black'); 
  text("FPS: " + int(frameRate()), 10, 20); 
  t += 0.5;
}


//------------------------------------------
function drawVideoBackground(){
  push();
  translate(width, 0);
  scale(-1,1);
  tint(255,255,255, 72);
  image(webcam, 0, 0, width, height);
  tint(255);
  pop();
}

//------------------------------------------
//draw functions :3c

function drawGround(){
  noStroke(); 
  var gradient = drawingContext.createLinearGradient(width/2, groundY, width/2, height);
  blendMode(LIGHTEST);
  // Add three color stops
  gradient.addColorStop(1, color(255, 255, 255, 0));
  gradient.addColorStop(0, 'white');

  // Set the fill style and draw a rectangle
  drawingContext.fillStyle = gradient;
  rect(0, groundY, width, height);
  stroke("#b6d1fc");
  strokeWeight(5);
  blendMode(DARKEST);
  drawingContext.shadowOffsetX = 0;
  drawingContext.shadowOffsetY = -10;
  drawingContext.shadowBlur = 10;
  drawingContext.shadowColor = '#66abff';
  
  for (let i = -300; i < width + 300; i+=80){
    // line(i, height + 20, lerp(i, cx, 0.7), groundY);
    triangle(i, height, lerp(i, cx, 0.7), groundY, i + (height - groundY)/2, height);
  }
  blendMode(BLEND);
}

function drawOverlay(){
  blendMode(LIGHTEST);
  fill("#f2e3b6");
  var gradient = drawingContext.createRadialGradient(cx, cy, 0, cx, cy, 40);
  noStroke();
  // Add three color stops
  gradient.addColorStop(0, '#f2e3b6');
  gradient.addColorStop(1, color(242, 227, 182, 0));

  // Set the fill style and draw a rectangle
  drawingContext.fillStyle = gradient;
  circle(cx, cy, 50);
  
  drawingContext.shadowOffsetX = 0;
  drawingContext.shadowOffsetY = -10;
  drawingContext.shadowBlur = 20;
  drawingContext.shadowColor = 'white';
  blendMode(LIGHTEST);
    for (let i = groundY - 125; i < groundY; i+= 50 * noise(i)){
    noStroke();
    strokeWeight(10 * noise(i));
      fill("#bccae0");
    ellipse(width/2, i + 30 * noise(i), width + 100, 10 * noise(i));
  }
  blendMode(BLEND);
}

function drawFinLayer(){
  blendMode(EXCLUSION);
  var gradient = drawingContext.createLinearGradient(width/2, 0, width/2, height);

  // Add three color stops
  gradient.addColorStop(0, '#a3b9ff');
  gradient.addColorStop(0.5, '#f0f2f5');
  gradient.addColorStop(1, '#a3b9ff');

  // Set the fill style and draw a rectangle
  drawingContext.fillStyle = gradient;
  rect(0, 0, width, height);
  blendMode(SCREEN);
  maxGroundY = 2000;
  if (groundY > maxGroundY){ //ground not in view, sun is big
    maxGroundY = groundY;
  }
  var gradient2 = drawingContext.createRadialGradient(cx, cy, 0, cx, cy, ((groundY/maxGroundY)) * 1000);
  noStroke();
  // Add three color stops
  gradient2.addColorStop(0, 'orange');
  gradient2.addColorStop(0.5, color(0, 0, 0, 0));

  drawingContext.fillStyle = gradient2;
  circle(cx, cy, ( abs(groundY/maxGroundY)) * 1000);
  
  noStroke();
  drawingContext.shadowOffsetX = 0;
  drawingContext.shadowOffsetY = -10;
  drawingContext.shadowBlur = 20;
  drawingContext.shadowColor = 'orange';

  for (let i = 0; i < rayAmt; i++){
    if (rayArr[i].y < height/2){
      rayArr[i].y = 0;
    } else {
      rayArr[i].y = height;
    }
    fill(color(0, 0, 0, 180 * noise(t + i)));
    triangle(rayArr[i].x, rayArr[i].y, cx, cy, rayArr[i].x + (height - groundY)/2, rayArr[i].y);
    // stroke("black");
    // strokeWeight(10 * noise(t));
    // line(rayArr[i].x, rayArr[i].y, cx, cy);
  }

//   for (let i = 0; i < rayAmt; i++){
//     triangle(100 * i, 0, cx, cy, (100 * i) + (height - groundY)/2, 0);
//   }

  blendMode(BLEND);
}
function drawBackground(){
  background("#8ab6eb");
  var gradient = drawingContext.createLinearGradient(width/2, 0, width/2, height);

  // Add three color stops
  gradient.addColorStop(0, '#b9cdf0');
  gradient.addColorStop(1, '#4c83e0');

  // Set the fill style and draw a rectangle
  drawingContext.fillStyle = gradient;
  rect(0, 0, width, height);
  //draw clouds
  
}

function expandTree(){
  for (let i = 0; i < branchExpandLimit; i++){
    //recurse every branch 5 times
    for (let j = branchArr.length - 1; j >= 0; j--){
      if (!branchArr[j].finished){
        branchArr[j].branch(rotAngle);
        branchArr[j].branch(-rotAngle);
      }
      branchArr[j].finished = true;
    }
  }
}

function showTree(){
  stroke("black")
  let offset = -400;
  drawingContext.shadowOffsetX = 0;
  drawingContext.shadowOffsetY = -5;
  drawingContext.shadowBlur = 0;
  drawingContext.shadowColor = '#f7d5b2';
  /*
  list of nice shadow colors
  #fff3bf
  ffa896
  ffe5d1
  */
    for (let i = 0; i < treeCount; i++){
      push();
      translate(offset, treeDiffY[i]);
      strokeWeight(beginWeight);
      stroke(color(0, 0, 0, 100 + 2 * treeDiffY[i]))
      bezier(trunkBottom.x, trunkBottom.y, trunkBottom.x,    
               trunkBottom.y,
              trunkTop.x, trunkTop.y, trunkTop.x, trunkTop.y);

      for (let i = 0; i < branchArr.length; i++){
        branchArr[i].show();
      }
      offset += treeDiff[i];
      pop();
    }
  blendMode(BLEND);
}

//------------------------------------------
class Branch{
  constructor(begin, end, weight){
    this.begin = begin;
    this.end = end;
    this.finished = false;
    this.randomAngle = random(0.3, 0.67)
    this.weight = weight;
    this.width = weight/2;
  }
  
  show(){
    strokeWeight(this.weight);
    noFill();
    blendMode(DARKEST);
    stroke("#606e9c");
    bezier(this.begin.x, this.begin.y,
           this.begin.x, this.begin.y + 30, this.end.x, this.end.y, 
          this.end.x, this.end.y)
    let shadowStart = abs(this.begin.y - groundY) + groundY;
    let shadowEnd = abs(this.end.y - groundY) + groundY;
    // if (this.weight < beginWeight){
    //   fill("#d62f37");
    //   noStroke();
    //   circle(this.end.x, this.end.y, 5);
    // }
    stroke("black");
    //how should i calculate weighted avg....
    // bezier(lerp(this.begin.x, cx, 0.7), shadowStart,
    //        lerp(this.begin.x, cx, 0.7), shadowStart + 30, lerp(this.end.x, cx, 0.7), shadowEnd, 
    //       lerp(this.end.x, cx, 0.7), shadowEnd)

    // triangle(this.begin.x - this.width, this.begin.y, this.begin.x + this.width, this.begin.y, this.end.x, this.end.y);
  }
  
  branch(angle){
    //get direction vector
    let dir = p5.Vector.sub(this.end, this.begin);
    dir.rotate(angle);
    dir.mult(0.67);
    //rotate and shorten it and add to end
    let newEnd = p5.Vector.add(this.end, dir);
    let b = new Branch(this.end, newEnd, this.weight - 0.5);
    //push new branch onto array
    branchArr.push(b);
  }
}

function fillTreePoints(){
  //reset every draw cycle :3c
  branchArr = [];
  if (handsfree.data.pose) {
    if (handsfree.data.pose.poseLandmarks){
      var poseLandmarks = handsfree.data.pose.poseLandmarks;
      var nPoseLandmarks = poseLandmarks.length; 
      
      groundY = poseLandmarks[25].y;
      groundY = map(groundY, 0, 1, 0, height);
      // groundY = 300;
      
      trunkBottom.x = (poseLandmarks[25].x + poseLandmarks[26].x)/2;
      trunkBottom.x = map(trunkBottom.x, 0, 1, width, 0);
      trunkBottom.y = (poseLandmarks[25].y + poseLandmarks[26].y)/2;
      trunkBottom.y = map(trunkBottom.y, 0, 1, 0, height);

      
      branchLeft.x = poseLandmarks[13].x;
      branchLeft.x = map(branchLeft.x, 0, 1, width, 0);
      branchLeft.y = poseLandmarks[13].y;
      branchLeft.y = map(branchLeft.y, 0, 1, 0, height);
      
      branchRight.x = poseLandmarks[14].x;
      branchRight.x = map(branchRight.x, 0, 1, width, 0);
      branchRight.y = poseLandmarks[14].y;
      branchRight.y = map(branchRight.y, 0, 1, 0, height);
      
      branchRoot.x = (poseLandmarks[23].x + poseLandmarks[24].x)/2;
      branchRoot.x = map(branchRoot.x, 0, 1, width, 0);
      branchRoot.y = (poseLandmarks[23].y + poseLandmarks[24].y)/2;
      branchRoot.y = map(branchRoot.y, 0, 1, 0, height);

      // trunkTop.x = poseLandmarks[0].x;
      // trunkTop.x = map(trunkTop.x, 0, 1, width, 0);
      // trunkTop.y = poseLandmarks[0].y;
      // trunkTop.y = map(trunkTop.y, 0, 1, 0, height);
      trunkTop.x = branchRoot.x;
      trunkTop.y = branchRoot.y;

      if (branchArr.length == 0){
        beginWeight = beginWeight;
        var A = 0.97;
        var B = 1.0-A;
        branchLeft.x = A*prevBranchLeft.x + B*branchLeft.x; 
        branchLeft.y = A * prevBranchLeft.y + B * branchLeft.y;
        branchRight.x = A*prevBranchRight.x + B*branchRight.x; 
        branchRight.y = A * prevBranchRight.y + B * branchRight.y;

        //add left and right arm as beginning branches
        branchArr.push(new Branch(branchRoot, branchLeft, beginWeight/1.5));
        branchArr.push(new Branch(branchRoot, branchRight, beginWeight/1.5));
        prevBranchRight = branchRight;
        prevBranchLeft = branchLeft;
      }
    }
  }
}
//------------------------------------------
// POSE: Full body tracking with 33 2D landmarks

function drawPosePoints(){
  fill('blue');
  stroke('black'); 
  strokeWeight(1);
  if (handsfree.data.pose) {
    if (handsfree.data.pose.poseLandmarks){
      var poseLandmarks = handsfree.data.pose.poseLandmarks;
      var nPoseLandmarks = poseLandmarks.length; 

      
      // for (var i = 0; i < nPoseLandmarks; i++) {
      //   var px = poseLandmarks[i].x;
      //   var py = poseLandmarks[i].y;
      //   px = map(px, 0, 1, width, 0);
      //   py = map(py, 0, 1, 0, height);
      //   fill('blue');
      //   stroke('black');
      //   text(i, px - 10, py - 10)
      //   textSize(10);
      //   circle(px, py, 9);
        //nose 0 
        //TL 11 13 23 TR 12 14 24
        //arms 
        //left 18 right 20
        //trunk is determined by bezier curve
        //if angle between arms is certain angle, draw trunks
        
        
      // }
      
    }
  }
}

//------------------------------------------
// HANDS: 21 2D landmarks per hand, up to 4 hands at once
// Detects pinching states, hand pointers, and gestures

function drawHandPoints() {

  if (handsfree.data.hands) {
    if (handsfree.data.hands.multiHandLandmarks) {
      var handLandmarks = handsfree.data.hands.multiHandLandmarks;   
      var nHands = handLandmarks.length;
      
      var handVertexIndices = [
        [17,0,1,5,9,13,17], /* palm */
        [1,2,3,4], /* thumb */
        [5,6,7,8], /* index */
        [9,10,11,12], /* middle */
        [13,14,15,16], /* ring */
        [17,18,19,20], /* pinky */
        ];
      
      // Draw lines connecting the parts of the fingers
      noFill(); 
      stroke('black'); 
      for (var h = 0; h < nHands; h++) {
        for (var f=0; f<handVertexIndices.length; f++){ // finger
          beginShape(); 
          for (var j=0; j<handVertexIndices[f].length; j++){
            var ji = handVertexIndices[f][j];
            var jx = handLandmarks[h][ji].x;
            var jy = handLandmarks[h][ji].y;
            jx = map(jx, 0, 1, width, 0);
            jy = map(jy, 0, 1, 0, height);
            vertex(jx, jy); 
          }
          endShape(); 
        }
      }
      
      // Draw just the points of the hands
      stroke('black'); 
      fill('red'); 
      for (var h = 0; h < nHands; h++) {
        for (var i = 0; i <= 20; i++) {
          var px = handLandmarks[h][i].x;
          var py = handLandmarks[h][i].y;
          px = map(px, 0, 1, width, 0);
          py = map(py, 0, 1, 0, height);
          circle(px, py, 9);
        }
      }

    }
  }
}


//------------------------------------------
// FACE: 468 2D face landmarks
function drawFacePoints(){
  noFill(); 
  stroke('black'); 
  
  if (handsfree.data.facemesh) {
    if (handsfree.data.facemesh.multiFaceLandmarks) {
      var faceLandmarks = handsfree.data.facemesh.multiFaceLandmarks;   
      var nFaces = faceLandmarks.length;
  
      // Draw all 468 points in the face mesh
      for (var f = 0; f < nFaces; f++) {
        var nFaceLandmarks = faceLandmarks[f].length; 
        for (var i = 0; i < nFaceLandmarks; i++) {
          var px = faceLandmarks[f][i].x;
          var py = faceLandmarks[f][i].y;
          px = map(px, 0, 1, width, 0);
          py = map(py, 0, 1, 0, height);
          circle(px, py, 1);
        }
        
        // Draw just a subset of keypoints as triangles (see below)
        for (var j = 0; j < TRI.length; j+=3){
          var a = faceLandmarks[f][VTX[TRI[j  ]]];
          var b = faceLandmarks[f][VTX[TRI[j+1]]];
          var c = faceLandmarks[f][VTX[TRI[j+2]]];
          ax = map(a.x, 0, 1, width, 0);
          ay = map(a.y, 0, 1, 0, height);
          bx = map(b.x, 0, 1, width, 0);
          by = map(b.y, 0, 1, 0, height);
          cx = map(c.x, 0, 1, width, 0);
          cy = map(c.y, 0, 1, 0, height);
          triangle(ax,ay,bx,by,cx,cy);
        }
        
      }
    
    }
  }
}


//================================================================
let TRI;
let VTX;
function chooseFaceLandmarks(){
  // Choose your preferred set of face keypoints: 7,33,68,468
  // Uncomment one of the pairings below. (See landmarks.js)
  //
  // === Bare minimum, 7 points ===
  // VTX = VTX7; TRI = TRI7;
  // === 'Important' facial features, 33 points ===
  // VTX = VTX33; TRI = TRI33;
  // === Standard facial landmarks, 68 points ===
  VTX = VTX68; TRI = TRI68;
  // === Full facemesh; 468 points ===
  // VTX = VTX468; TRI = TRI468;
}