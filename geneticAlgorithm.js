var mutateRate = .2;

function createNewGeneration(){
  calculateFitness();
  for(let i = 0; i < popSize; i++){
    //birdArray.push(createBird()); //try tidy() this
    tf.tidy(() => birdArray.push(createBird()));
  }
  //release memory in savedBirds
  for(let i = 0; i < savedBirds.length; i++){
    //console.log(savedBirds[i].brain);
    //console.log(tf.memory());
    savedBirds[i].brain.dispose();
    //console.log(tf.memory());
  }

  savedBirds = []; //reset savedBirds
  pipeArray = [];
}
function createBird(){
  let index = 0;
  let r = random(1);

  while (r > 0){
    r -= savedBirds[index].fitness;
    index += 1;
  }
  index -= 1;
  let birdCopy = new Bird(savedBirds[index].brain.copy()); //copying birdCopy
  birdCopy.brain.mutate(mutateRate); //mutate bird

  return birdCopy;
}

// function mutate(bird){
//     //console.log(bestBird);
//     let birdModel = bird.brain.copy();
//     const weights = birdModel.getWeights();
//     let mutatedWeights = [];
//     for(let i = 0; i < weights.length; i++){
//       let tensor = weights[i];
//       let shape = weights[i].shape;
//       let data = tensor.dataSync().slice();
//       for(let j = 0; j < data.length; j++){
//         if(random(1) < mutateRate){
//           data[j] += randomGaussian();
//         }
//       }
//       let newTensor = tf.tensor(data, shape);
//       mutatedWeights[i] = newTensor;
//
//     }
//
//     birdModel.setWeights(mutatedWeights);
//     return new Bird(birdModel);
// }

function calculateFitness(){
  let sum = 0;
  for(let i = 0; i < savedBirds.length; i++){
    sum += savedBirds[i].score;
  }

  for(let i = 0; i < savedBirds.length; i++){
    savedBirds[i].fitness = savedBirds[i].score / sum;
  }
  // let bestBird = undefined;
  // let birdFitness = -1;
  // for(let i = 0; i < savedBirds.length; i++){
  //   if(savedBirds[i].fitness > birdFitness){
  //     birdFitness = savedBirds[i].fitness;
  //     bestBird = savedBirds[i];
  //   }
  // }
  // return bestBird;
}

function pickBird(){

}
