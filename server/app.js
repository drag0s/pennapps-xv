const express = require('express');
const cors = require('cors');
const app = express();
const expressWs = require('express-ws')(app);

app.use(cors());

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
        c.send(req.query.msg);
        console.log("msg sended to front");
      } catch(e) { console.log("failed sending msg"); }
    });
  res.status(200).send('sent ' + req.query.msg + ' to frontend');
});



app.ws('/', (ws, req) => {
  connections.push(ws);
  console.log("new front connected with id " + id);
  ws.on('message', (msg) => {
    console.log(msg);
  });
});

app.listen(3000);