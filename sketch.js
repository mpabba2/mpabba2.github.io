var bird;
var pipeArray = [];
var birdArray = [];
var savedBirds = [];
var popSize = 100;
var generationCount = 0;
var pipeImgTop = undefined;
var pipeImgBottom = undefined;
var backgroundImg = undefined;
var ballDown = undefined;
var ballUp = undefined;
var ifBestBird = false;
var checkbox;
var ifTrain = true;


// function preload(){
//   img = loadImage('https://mpabba2.github.io/assets/green_pipe.png');
// }

function setup(){
  //loading in images
  pipeImgTop = loadImage(pipeImgTopString);
  pipeImgBottom = loadImage(pipeImgBottomString);
  backgroundImg = loadImage(backgroundString);
  ballDown = loadImage(ballDownString);
  ballUp = loadImage(ballUpString);

  //checkbox setup
  checkbox = createCheckbox("Check to play trained model", false);
  checkbox.changed(checkedEvent);

  createCanvas(900,500);

  //add inital pipe
  pipeArray.push(new Pipe());
  for(let i = 0; i < popSize; i++){
    birdArray.push(new Bird());
  }
}

function draw(){
  //bird.update();
  //bird.draw();
  for(let i = 0; i < birdArray.length; i++){
    birdArray[i].update();
    //birdArray[i].draw();
  }

  //updating and drawing pipes
  for(let i = 0; i < pipeArray.length; i++){
    pipeArray[i].update();
    //pipeArray[i].draw();

    for(let j =-0; j < birdArray.length; j++){
      if(pipeArray[i].ifCollision(birdArray[j].xPos, birdArray[j].yPos, birdArray[j].diameter/2)){
        //console.log("collision");
        savedBirds.push(birdArray[j]);

        // //test
        // let bCopy = new Bird(birdArray[j].brain.copy());
        // bCopy.brain.mutate(0.1);
        // birdArray[j].brain.model.getWeights()[0].print();
        // bCopy.brain.model.getWeights()[0].print();

        birdArray.splice(j, 1);

      }
    }
  }

  //checking if any pipes are off screen
  if(pipeArray.length > 0 && pipeArray[0].xPos < 0){
    pipeArray.shift(); //removing first element
  }

  //if need to add in another pipe
  if(pipeArray.length == 0 || (width - pipeArray[pipeArray.length-1].xPos - pipeArray[pipeArray.length-1].pipeWidth ) > pipeArray[pipeArray.length-1].pipeWidth * 5){
    pipeArray.push(new Pipe());
  }

  //if colloision detected (might want to optimize by only hcecking first pipe if only 1 bird)
  // for(let i = 0; i < pipeArray.length; i++){
  //   if(pipeArray[i].ifCollision(bird.xPos, bird.yPos, bird.diameter/2)){
  //     noLoop();
  //   }
  // }

  // for(let i = 0; i < birdArray.length; i++){
  //   for(let j = 0; j < pipeArray.length; j++){
  //     if(pipeArray[j].ifCollision(birdArray[i].xPos, birdArray[i].yPos, birdArray[i].diameter/2)){
  //       console.log("collision!");
  //     }
  //   }
  // }

  //bird making prediction, get feedback when framecount % 20 == 0
  if(frameCount % 5 == 0){
    for(let i = 0; i < birdArray.length; i++){
      //console.log("think");
      birdArray[i].think(pipeArray);
      // if(random(1) < 0.5){
      //   birdArray[i].up();
      //
      // }
    }
    //console.log("done");
  }

  //drawing birds and pipes
  //background('black');
  image(backgroundImg, 0, 0, width, height);
  textSize(15);
  if(ifTrain){
    text("Generation: " + generationCount, width - (width/6), height/30, width/6, height/20);
  }
  else{
    text("Generation: N/A", width - (width/6), height/30, width/6, height/20);
  }
  text("Number of Birds: " + birdArray.length, width - (width/6), height/30 + height/20, width/6, height/20);

  for(let bird of birdArray){
    bird.draw();
  }
  for (let pipe of pipeArray){
    pipe.draw();
  }

  //if next generation needs to be called
  if(ifTrain && birdArray.length == 0){
    createNewGeneration();
    generationCount++;
    //console.log("generation " + generationCount);
  }

  //if best bird fails
  if(!ifTrain && birdArray.length == 0){
    createSavedBird();
  }


}

function createSavedBird(){
 tf.tidy( () => {
   birdArray = [];
   savedBirds = [];
 });
 pipeArray = [];

 //create model from data.js
 const newModel = tf.sequential();

 //adding hidden layer
 const hidden = tf.layers.dense({
   units: Bird.hidNode,
   activation: "sigmoid",
   inputShape: Bird.inNode
 });

 const output = tf.layers.dense({
   units: Bird.outNode,
   activation: "sigmoid"
 });

 //adding layers
 newModel.add(hidden);
 newModel.add(output);

 newModel.setWeights(best_bird_weights);

 birdArray.push(new Bird(newModel));
}

function checkedEvent(){
  //release memory in savedBirds
  for(let i = 0; i < savedBirds.length; i++){
    savedBirds[i].brain.dispose();
  }

  for(let i = 0; i < birdArray.length; i++){
    birdArray[i].brain.dispose();
  }

  tf.tidy( () => {
    birdArray = [];
    savedBirds = [];
  });
  pipeArray = [];
  pipeArray.push(new Pipe());

  generationCount = 0;

  if(this.checked()){
    ifTrain = false;
    createSavedBird();
    popSize = 1;
  }
  //if unchecked
  else{
    ifTrain = true;
    popSize = 100;

    for(let i = 0; i < popSize; i++){
      birdArray.push(new Bird());
    }
  }
}

//key bindings
// function keyPressed(){
//   if(key == ' '){
//     birdArray[0].up();
//   }
// }
