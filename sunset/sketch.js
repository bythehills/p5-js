let offset = 0
let t = 0
let noiseFac = 0.005;
let heightFac = 300;
let perlinArr = [];
let spacing = 5;
let treeArr = [];
let cloudArr = [];
let margin = 50;
let edgeColor = "#63411e";
let poleArr = [];
//64, 52, 105
let r = 64;
let g = 52; 
let b = 105;
let HILL_COLOR = "#46476b";
let polesDrawn;
let circleX = 0;
let circleY = 0;

function setup() {
	createCanvas(800, 400);
	background(100);
	fillPerlin();
    polesDrawn = random(3, 5);
  circleX = random(100, 200);
  circleY = random(100, 300);
}

function draw() {
// Create a linear gradient
// The start gradient point is at x=20, y=0
// The end gradient point is at x=220, y=0
    var gradient = drawingContext.createLinearGradient(width/2, 0, width/2, height);

    // Add three color stops
    gradient.addColorStop(1, '#ffbb73');

    gradient.addColorStop(0, '#9898fa');

    // Set the fill style and draw a rectangle
    drawingContext.fillStyle = gradient;
    rect(0, 0, width, height);
	drawClouds();
  drawExtraClouds();
	blendMode(BLEND);
  drawingContext.shadowOffsetX = 0;
  drawingContext.shadowOffsetY = -10;
  drawingContext.shadowBlur = 5;
  drawingContext.shadowColor = HILL_COLOR;
	drawHills();
	// drawPoles();
	noStroke();
	fill("#28b536");
	// for (let i = 0; i < 900; i+= 20){
	// 	push();
	// 	rectMode(CENTER);
	// 	translate(i, 450);
	// 	x = map(noise(i), -1, 1, 3.5, 5);
	// 	shearY(PI / (x));
	// 	shearX(PI / (x));
	// 	angle = sin(i - offset);
	// 	rotate(angle);
	// 	rect(0, -10 , 100, 100, 90, 90, 90, 90);
	// 	pop();
	// }
  drawingContext.shadowOffsetX = 0;
  drawingContext.shadowOffsetY = 0;
  drawingContext.shadowBlur = 10;
  drawingContext.shadowColor = edgeColor;
  rectMode(CORNER);
	drawOverlay();
  drawingContext.shadowOffsetX = 0;
  drawingContext.shadowOffsetY = 0;
  drawingContext.shadowBlur = 0;
  drawingContext.shadowColor = 'black';
	t += 0.005;
	offset = (offset + 0.05);
  circleX += noise(t) * 0.1;
  circleY += noise(t+ 200) * 0.1;
}

function drawOverlay(){
	blendMode(DARKEST);
	fill("black");
	// Create a linear gradient
	// The start gradient point is at x=20, y=0
	// The end gradient point is at x=220, y=0
	var gradient = drawingContext.createLinearGradient(400, 0, 400, margin);

	// Add three color stops
	gradient.addColorStop(0.8, 'black');
	gradient.addColorStop(1, edgeColor);

	drawingContext.fillStyle = gradient;
	rect(0, 0, 800, margin); //top rect
	// rect(0, 0, margin, 800); //left rect
	// rect(width - margin, 0, margin, 800); //right rect
	var gradient2 = drawingContext.createLinearGradient(400, height - margin, 400, height);

	// Add three color stops
	gradient2.addColorStop(0.2, 'black');
	gradient2.addColorStop(0, edgeColor);
  drawingContext.shadowOffsetX = 10;
	drawingContext.fillStyle = gradient2;
	rect(0, height - margin, 800, 100); //bottom rect
	fill("black");
	strokeWeight(1);
	blendMode(MULTIPLY);
  drawingContext.shadowOffsetX = 10;
  drawingContext.shadowOffsetY = 0;
  drawingContext.shadowBlur = 2;
  drawingContext.shadowColor = '#a18e60';

	for (let i = -10; i < width + 10; i += 2){
		r += (100 * noise(i));
		g += (100 * noise(i));
		b += (100 * noise(i));
		stroke(color(r, g, b));
		line(i, height, i, 0);
	}
	noStroke();
	blendMode(BLEND);
}

function drawHills(){
  let prevPoleX = 0;
  let prevPoleY = 0;
	for (let i = 0; i < width; i+= 5){
		let noiseVal = noise((i * 0.2) * noiseFac);
		noiseVal = noiseVal * heightFac;
        if (i % 10 == 0){
          strokeWeight(1)
          drawingContext.shadowOffsetY = -5;
          if(poleArr[i/spacing] != 0){
            line(i, noiseVal + 200, i, noiseVal + 130);
            line(i - 10, noiseVal + 135, i + 10, noiseVal + 140);
            noFill();
            if (prevPoleX == 0 && prevPoleY == 0){
              prevPoleX = i;
              prevPoleY = noiseVal;
            } else {
              // beginShape();
              // curveVertex(i, noiseVal + 120);
              // curveVertex(prevPoleX, prevPoleY);
              // endShape();
              let midX = (prevPoleX + i)/2;
              let midY = ((noiseVal + 140) + (prevPoleY + 140))/2
              noFill();
              beginShape();
              curveVertex(i, noiseVal + 140);
              curveVertex(i, noiseVal + 140);
              curveVertex(midX, midY - (prevPoleX - i) * 0.1);
              curveVertex(prevPoleX - 1, prevPoleY + 137);
              curveVertex(prevPoleX - 1, prevPoleY + 137);
              endShape();
              // line(i, noiseVal + 140, prevPoleX, prevPoleY + 140)
              prevPoleX = i;
              prevPoleY = noiseVal;
            }
          }
        }
        drawingContext.shadowOffsetY = -10;
		strokeWeight(20);
		stroke(HILL_COLOR);
		line(i, height, i, noiseVal + 200)
    }
}

function drawExtraClouds(){
  blendMode(ADD);
  fill("#ff6505")
  circle(circleX, circleY, 30);
  noFill();
  stroke(0);
  strokeWeight(2 * noise(t + 90));
  for(let i = 0; i < polesDrawn; i++){
    line(0, 300 * noise(i) + 100, width, 300 * noise(i) + 100);
  }

}


function fillPerlin(){
	for (let row = 0; row < height; row += spacing){
		// perlinArr[row/spacing] = []
		cloudArr[row/spacing] = [];
		for (let col = 0; col < width; col += spacing){
			noiseDetail(5, 0.5);
			let r = random(0, 1);
			if (r < 0.1){
				poleArr.push(col * spacing + random(-10, 10)); //push x value
			}
			let noiseVal = 255 * (noise(col * 0.02, (row) * 0.02));
            if (noiseVal < 20){
              poleArr.push(col * spacing);        
            } else if (noiseVal < 70 && col > 0){
              cloudArr[row/spacing].push(new Cloud(col * spacing, row * spacing, 300, 70));
			// } else if (noiseVal < 90){
			// 	cloudArr[row/spacing].push(new Cloud(col * spacing, row * spacing, 40, 40));
			// } else if (noiseVal < 100){
			// 	cloudArr[row/spacing].push(new Cloud(col * spacing, row * spacing, 30, 30));
			} else {
              cloudArr[row/spacing].push(0);
              poleArr.push(0);
			}
		}
	}
	
	
}

function drawClouds(){
	fill("white");
	for (let row = 0; row < cloudArr.length; row++){
		for (let col = 0; col < cloudArr[row].length; col++){
			// let noiseVal = perlinArr[row][col];
			if (cloudArr[row][col] != 0){
				if (minute() % 2 == 0){
					cloudArr[row][col].draw("cirrus");
				} else {
					cloudArr[row][col].draw("cumulus");
				}
			}
		}
	}
}

//draws 3 different types of clouds
//cirrus (wispy)
//cumulus (regular)
//stratus (long)
class Cloud{
	constructor(x, y, width, height){
		this.x = x;
		this.y = y + random(- 10, 10);
		this.width = width;
		this.height = height;
		this.cumulusWidth = width + random(-5, 5);
		this.cumulusHeight = height + random(-5, 5);
		this.speed = random(0.2, 0.3); //moves by this.speed per frame
		this.cirrusHeight = random(40, 50);
		this.cirrusWidth = random(150, 200);
        this.cornerRad = 0;
        this.offset = random(100, 400);
	}
	
	draw(type){
		blendMode(ADD);
      rectMode(CENTER)
	  drawingContext.shadowOffsetX = 10;
		drawingContext.shadowOffsetY = 10;
		drawingContext.shadowBlur = 30;
		drawingContext.shadowColor = "#ff0f66";
		var gradient = drawingContext.createRadialGradient(this.x, this.y, 30,  
																											this.x, this.y, 80);

		// Add three color stops
		gradient.addColorStop(0, '#353c5c');
		gradient.addColorStop(1, 'white');

		// Set the fill style and draw a rectangle
		// drawingContext.fillStyle = gradient;
      noFill();
      stroke(0, 255);
      strokeWeight(noise(t));
        this.x += 0.1;
      // rect(this.x, this.y, this.width, this.height, this.cornerRad, this.cornerRad, this.width, this.width);
      var x1 = 0 + abs(this.x * noise(t + 15));
      var x2 = 0 + abs(this.x * noise(t + 25));
      var x3 = 0 + abs(this.x * noise(t + 35));
      var x4 = 0 + abs(this.x * noise(t + 45));
      var y1 = 0 + abs(this.y * noise(t + 55));
      var y2 = 0 + abs(this.y * noise(t + 65));
      var y3 = 0 + abs(this.y * noise(t + 75));
      var y4 = 0 + abs(this.y * noise(t + 85));
      bezier(x1, y1, x2, y2, x3, y3, x3, y3);

	}		
	
}