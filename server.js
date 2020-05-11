// server side handling

// set up: 
const fs = require('fs');
const $path = require('path');
const express = require('express');

const app = express();
const port = process.env.PORT || 5000;

// use public directory and json
app.use(express.static('public'))
app.use(express.json())

// route that saves the score sent as the body of a request
app.post('/scores',
  (request, response) => {
    console.log('req path: ', request.path);
    console.log('req body: ', request.body)
    const result = JSON.stringify(addScore(request.body))
    console.log(result);
    response.send(JSON.stringify(`Saved: ${result}`));
});
 
// displays the scores.json file data when requested
app.get('/scores.json', (request, response) => {
  let scoreFile = $path.join('src/scores.json');
  try {
    let data = fs.readFileSync(scoreFile);
    let json = JSON.parse(data);
    response.send(json);
  } catch (err) {
    throw err;
  }
});

// adds a score to the the scores.json file 
function addScore(score) {
  console.log('addScore - server.js')
  // get path to file
  let scoreFile = $path.join('src/scores.json');
  console.log({scoreFile})
  try {
    console.log('read file')
    // read file data, push new data to array
    let data = fs.readFileSync(scoreFile);
    let json = JSON.parse(data);
    json.push(score);
    // write new score file 
    fs.writeFileSync(scoreFile, JSON.stringify(json));
    console.log('info saved');
    return score;
  } catch (error) {
    throw error
  }
}

app.listen(port, () => console.log(`Example app listening on port ${port}!`));