class NeuralNetwork{

  constructor(iN, hN, oN, brain){
    this.inputNodes = iN;
    this.hiddenNodes = hN;
    this.outputNodes = oN;

    if(brain instanceof tf.Sequential){
      this.model = brain;
    }

    else{
      this.model = tf.sequential();

      //adding hidden layer
      const hidden = tf.layers.dense({
        units: this.hiddenNodes,
        activation: "sigmoid",
        inputShape: [this.inputNodes]
      });

      const output = tf.layers.dense({
        units: this.outputNodes,
        activation: "sigmoid"
      });

      //adding layers
      this.model.add(hidden);
      this.model.add(output);
    }




  }

  //assumes tf tensor of proper shape
  predict(inputs){
    // let output = tf.tidy( () => this.model.predict(inputs));
    // inputs.dispose();
    // return output;
    return tf.tidy( () => {
      //console.log("sync");
      return this.model.predict(inputs).dataSync();
    });
  }

  // predict(inputs){
  //   // let output = tf.tidy( () => this.model.predict(inputs));
  //   // inputs.dispose();
  //   // return output;
  //   return tf.tidy( () => {
  //     console.log("sync");
  //     return this.model.predict(inputs);
  //   }).data();
  // }

  dispose(){
    this.model.dispose();
  }

  copy(){
    const newModel = tf.sequential();

    //adding hidden layer
    const hidden = tf.layers.dense({
      units: this.hiddenNodes,
      activation: "sigmoid",
      inputShape: this.inputNodes
    });

    const output = tf.layers.dense({
      units: this.outputNodes,
      activation: "sigmoid"
    });

    //adding layers
    newModel.add(hidden);
    newModel.add(output);

    newModel.setWeights(this.model.getWeights());

    return newModel;
  }

  mutate(mutateRate){
    let modelWeights = this.model.getWeights();
    let mutatedWeights = [];
    for(let i = 0; i < modelWeights.length; i++){
      //let tensor = modelWeights[i];
      let shape = modelWeights[i].shape;
      let data = modelWeights[i].dataSync().slice();

      for(let j = 0; j < data.length; j++){
        if(random(1) < mutateRate){
          data[j] += randomGaussian() * 0.5;
        }
      }

      let tensor = tf.tensor(data, shape);
      //mutatedWeights[i] = tf.tensor(data, shape);
      mutatedWeights[i] = tensor;
    }

    this.model.setWeights(mutatedWeights);
  }
}
