// server side handling

// set up: 
const fs = require('fs');
const $path = require('path');
const express = require('express');

const app = express();
const port = process.env.PORT || 5000;


app.post('/scores',
  express.urlencoded({extended: false}),
  (request, response) => {
    console.log(request.path);
    console.log(request.body)
    // console.log("Body is:", JSON.stringify(request.body))
    const result = addScore(request.body)
    response.send(`Saved: ${result}`);
});

app.get('/scores.json', (request, response) => {
  response.type('application/json');
  response.send(JSON.stringify([
    {name: 'nick', value: 100, date: "2019-01-01T12:15:01"},
    {name: 'adam', value: 75, date: "2019-01-01T12:30:01"},
    {name: 'john', value: 90, date: "2019-10-20T12:30:01"}
  ]))
});

function addScore(body) {
  let scoreFile = $path.join('src/scores.json');
  const score = JSON.stringify(body)
  try {
    fs.appendFileSync(scoreFile, score) 
    console.log('info saved');
    return score;
  } catch (error) {
    throw error
  }
}

app.listen(port, () => console.log(`Example app listening on port ${port}!`));