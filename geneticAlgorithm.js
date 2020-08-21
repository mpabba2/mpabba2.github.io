var mutateRate = .2;

function createNewGeneration(){
  calculateFitness();

  //saving bird
  if(saveBest){
    saveBest = false;
    saveBird();
    //let serializedBrain = JSON.stringify(saveBird.brain.model);
    //save(serializedBrain, "best_bird.json");
  }

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
    //sum += savedBirds[i].score;
    //taking square of fitness
    sum += pow(savedBirds[i].score, 2);
  }

  for(let i = 0; i < savedBirds.length; i++){
    //savedBirds[i].fitness = savedBirds[i].score / sum;
    //square of fitness
    savedBirds[i].fitness = pow(savedBirds[i].score, 2) / sum;
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

//returns best bird based on fitness
function getBestBird(){
  let bestBird = undefined;
  let bestFit = Infinity;
  for(bird of savedBirds){
    if(bird.fitness < bestFit){
      bestBird = bird;
      bestFit = bird.fitness;
    }
  }
  return bestBird;
}

async function saveBird(){
  let bestBird = getBestBird();
  await bestBird.brain.model.save("localstorage://best-brain");

}
