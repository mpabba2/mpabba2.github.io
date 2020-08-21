class Pipe{
  //static variables for Pipe class
  static prevPipe = undefined;
  static pipeGap = 200; //120
  static pipeSpeed = 4;

  constructor(){
    this.pipeWidth = width/12;
    this.xPos = width - this.pipeWidth;
    if (Pipe.prevPipe == undefined){
      this.yTopPos = height/3;
      Pipe.prevPipe = this;
    }
    else{
      let min = -150;
      let max = 150;
      //adding random height difference from previous pipe
      var newYPos;
      do{
        newYPos = Pipe.prevPipe.yTopPos + Math.floor(Math.random() * (max - min + 1) ) + min;
      } while(newYPos < 0 || newYPos > height - Pipe.pipeGap);

      this.yTopPos = newYPos;
      Pipe.prevPipe = this;
    }
  }

  draw(){
    //drawing top portion
    fill('white');
    image(pipeImgTop, this.xPos, 0, this.pipeWidth, this.yTopPos);
    //rect(this.xPos, 0, this.pipeWidth, this.yTopPos);
    //image(pipeImg, this.xPos, 0, this.pipeWidth, this.yTopPos);
    //drawing bottom portion
    //rect(this.xPos, this.yTopPos + Pipe.pipeGap, this.pipeWidth, height - Pipe.pipeGap - this.yTopPos);
    image(pipeImgBottom, this.xPos, this.yTopPos + Pipe.pipeGap, this.pipeWidth, height - Pipe.pipeGap - this.yTopPos);

  }

  update(){
    this.xPos -= Pipe.pipeSpeed;
  }

  //checks if x,y coordinates is within pipe
  ifCollision(cx, cy, rad){
    //checking if ball hit top or bottom of screen
    if(cy <= rad || (cy + rad >= height)){
      return true;
    }
    //checking if ball went above screen
    // if(cy < 0 && cx >= this.xPos && cx <= this.xPos + this.pipeWidth){
    //   return true;
    // }
    //checking top Rectangle
    let testX = cx;
    let testY = cy;

    if(cx < this.xPos){
      testX =   this.xPos;
    }
    else if(cx > this.xPos + this.pipeWidth){
      testX = this.xPos + this.pipeWidth;
    }

    if(cy < 0){
      testY = 0;
    }
    else if(cy > this.yTopPos){
      testY = this.yTopPos;
    }

    let d = dist(cx, cy, testX, testY)
    if(d <= rad){
      return true;
    }

    //checking bottom Rectangle
    testX = cx;
    testY = cy;

    if(cx < this.xPos){
      testX =   this.xPos;
    }
    else if(cx > this.xPos + this.pipeWidth){
      testX = this.xPos + this.pipeWidth;
    }

    if(cy < this.yTopPos + Pipe.pipeGap){
      testY =  this.yTopPos + Pipe.pipeGap;
    }
    else if(cy > height){
      testY = height;
    }

    d = dist(cx, cy, testX, testY)
    if(d <= rad){
      return true;
    }

    return false;

  }



}
