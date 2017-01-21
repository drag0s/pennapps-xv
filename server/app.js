const express = require('express');
const cors = require('cors');
const app = express();
const expressWs = require('express-ws')(app);
const say = require('say');

app.use(cors());

app.use("/audio", express.static(__dirname + '/audio'));

app.listen(3000, () => {
  console.log('Listening on 3000');
});

const connections = [];

app.get('/', (req, res) => {
  res.status(200).sendFile(__dirname + '/index.html');
});

app.get('/send', (req, res) => {
  connections.forEach(c => {
  try {
    if (req.query.msg == 'space') {
      c.send(' ');
    } else if (req.query.msg == '.') {
      c.send(req.query.msg + ' ');
    } else {
      c.send(req.query.msg);
    }
    console.log("msg sended to front");
} catch(e) { console.log("failed sending msg"); }
});
res.status(200).send('sent ' + req.query.msg + ' to frontend');
});

function toHex(str) {
  return new Buffer(str).toString('base64');
}

app.get('/speak', (req, res) => {
  const str = req.query.msg;
  const file = __dirname + '/audio/' + toHex(str) + '.wav';
  console.log(file)
  say.export(str, 'Alex', 0.75, file, function(err) {
    if (err) {
      console.log('lol error');
      return res.status(400).send(err);
    }
    else {
      console.log('Text has been saved to ' + file);
      return res.status(200).send({});
    }
  });
});


app.ws('/', (ws, req) => {
  connections.push(ws);
console.log("new front connected with id " + id);
ws.on('message', (msg) => {
  console.log(msg);
});
});

app.listen(3000);