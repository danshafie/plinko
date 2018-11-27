const outputs = [];

// const predictionPoint = 300;

function onScoreUpdate(dropPosition, bounciness, size, bucketLabel) {
  // Ran every time a balls drops into a bucket
  outputs.push([dropPosition, bounciness, size, bucketLabel]);
}

function distance(pointA, pointB) {
  return (
    _.chain(pointA)
      .zip(pointB)
      .map(([a, b]) => (a - b) ** 2)
      .sum()
      .value() ** 0.5
  );
}

function runAnalysis() {
  let numberCorrect = 0;
  const testSetSize = 10;
  const [testSet, trainingSet] = splitDataset(outputs, testSetSize);
  // console.log("trainingSet", trainingSet);
  // console.log("testSet", testSet);

  _.range(1, 15).forEach(k => {
    for (let i = 0; i < testSet.length; i++) {
      const bucket = knn(trainingSet, _.initial([i][0]), k);
      //this is the test set value
      // console.log("testSet[i][3]", testSet[i][3]);
      //this is the training set value
      // console.log("bucket", bucket);
      if (bucket === testSet[i][3]) {
        numberCorrect++;
      }
    }

    console.log("accuracy: ", numberCorrect / testSetSize);
  });

  // const accuracy = _.chain(testSet)
  //   .filter(testPoint => knn(trainingSet, testPoint[0] === testPoint[3]))
  //   .size()
  //   .divide(testSetSize)
  //   .value();

  // console.log("accuracy: ", accuracy);
}
//returns one integer
function knn(data, point, k) {
  return _.chain(data)
    .map(row => {
      return [distance(_.initial(row), point), _.last(row)];
    })
    .sortBy(row => row[0])
    .slice(0, k)
    .countBy(row => row[1])
    .toPairs()
    .sortBy(row => row[1])
    .last()
    .first()
    .parseInt()
    .value();
}

function splitDataset(data, testCount) {
  const shuffled = _.shuffle(data);

  const testSet = _.slice(shuffled, 0, testCount);
  // console.log("testSet", testSet);
  const trainingSet = _.slice(shuffled, testCount);
  // console.log("trainingSet", trainingSet);

  return [testSet, trainingSet];
}
