var bird;
var pipeArray = [];
var birdArray = [];
var savedBirds = [];
var popSize = 100;
var generationCount = 0;
var pipeImg = undefined;

function preload(){
  img = loadImage('assets/green_pipe.png');
}

function setup(){
  createCanvas(900,500);
  background('black');
  //add inital pipe
  pipeArray.push(new Pipe());
  for(let i = 0; i < popSize; i++){
    birdArray.push(new Bird());
  }
  // birdArray.push(new Bird());
  // birdArray.push(new Bird());

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
  background('black');

  for(let bird of birdArray){
    bird.draw();
  }
  for (let pipe of pipeArray){
    pipe.draw();
  }

  //if next generation needs to be called
  if(birdArray.length == 0){
    createNewGeneration();
    generationCount++;
    console.log("generation " + generationCount);

  }


}

// //key bindings
// function keyPressed(){
//   if(key == ' '){
//     birdArray.up();
//   }
// }
