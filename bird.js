class Bird{
  constructor(inBrain){
    this.brain = new NeuralNetwork(5, 8, 1, inBrain);
    this.xPos = width/6;
    this.diameter = 30;
    this.yPos = height/2;

    this.lift = -30;
    this.gravity = 1.2;
    this.velocity = 0;
    this.score = 0;
    this.fitness = 0;
  }

  draw(){
    fill('white');
    circle(this.xPos, this.yPos, this.diameter);
  }

  update(){
    //updating score
    this.score++;

    //updating pos
    this.velocity += this.gravity;
    this.velocity *= 0.9;
    this.yPos += this.velocity;

    if((this.yPos + (this.diameter/2))> height){
      this.yPos = height - this.diameter/2;
      this.velocity = 0;
    }

    if(this.yPos < this.diameter/2){
      this.yPos = this.diameter/2
    }


  }

  think(pipeList){
    //find closest pipe to pass input paramters
    let closestPipe = undefined;
    let closePipeX = undefined;
    for(let i = 0; i < pipeList.length; i++){
      if(closePipeX == undefined || (this.xPos < pipeList[i].xPos && pipeList[i].xPos < closePipeX)){
        closePipeX = pipeList[i].xPos;
        closestPipe = pipeList[i];
      }
    }

    let inputs = [];
    inputs[0] = closestPipe.xPos / width; //xPos of pipe
    inputs[1] = closestPipe.yTopPos / height; //yTopPos of pipe
    inputs[2] = (closestPipe.yTopPos + Pipe.pipeGap) / height; //yBottomPos of pipe
    //inputs[3] = 1 / (1 + exp(-1 * this.velocity)) ; //bird velocity
    inputs[3] = map(this.velocity, -12, 12, 0, 1); //mapping using approximate max velocity
    inputs[4] = this.yPos / height; //bird yPos

    // console.log(inputs);
    tf.tidy( () => {
      let output = this.brain.predict(tf.tensor([inputs]));
      //console.log(output);
      if(output[0] > 0.5){
        this.up();
        //console.log("up");
      }
      else{
        //console.log("down");
      }
    });

    // tf.tidy( () => {
    //   this.brain.predict(tf.tensor([inputs])).then( (output) => {
    //     //console.log(output);
    //     if(output[0] > 0.5){
    //       this.up();
    //     }
    //   });
    //
    //
    // });

    //console.log(output.dataSync()[0]);
    //output.dispose(); //remove output tensor
    //this.up();
  }

  up(){
    this.velocity += this.lift;
  }

}
