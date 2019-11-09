// server side handling

// set up: 
const fs = require('fs');
const $path = require('path');
const express = require('express');

const app = express();
const port = process.env.PORT || 5000;

app.use(express.static('public'))
app.use(express.json())


app.post('/scores',
  (request, response) => {
    console.log('req path: ', request.path);
    console.log('req body: ', request.body)
    console.log("Body is:", JSON.stringify(request.body))
    const result = JSON.stringify(addScore(request.body))
    console.log(result);
    response.send(JSON.stringify(`Saved: ${result}`));
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
  console.log('addScore - server.js')
  let scoreFile = $path.join('src/scores.json');
  const score = body;
  console.log({scoreFile})
  try {
    console.log('read file')
    let data = fs.readFileSync(scoreFile);
    let json = JSON.parse(data);
    json.push(score);
    fs.writeFileSync(scoreFile, JSON.stringify(json));
    console.log('info saved');
    return score;
  } catch (error) {
    throw error
  }
}

app.listen(port, () => console.log(`Example app listening on port ${port}!`));