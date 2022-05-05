// Place your server entry point code here


// Require minimist module
const args = require('minimist')(process.argv.slice(2))
// See what is stored in the object produced by minimist
console.log(args)
// Store help text 
const help = (`
server.js [options]
--port, -p	Set the port number for the server to listen on. Must be an integer
            between 1 and 65535.
--debug, -d If set to true, creates endlpoints /app/log/access/ which returns
            a JSON access log from the database and /app/error which throws 
            an error with the message "Error test successful." Defaults to 
            false.
--log		If set to false, no log files are written. Defaults to true.
            Logs are always written to database.
--help, -h	Return this message and exit.
`)
// If --help or -h, echo help text to STDOUT and exit
if (args.help || args.h) {
    console.log(help)
    process.exit(0)
}

var express = require('express')
var app = express()
app.use(express.json())
app.use(express.static('./public'));

const fs = require('fs')
const morgan = require('morgan')
const db = require('./src/services/database.js')

app.use(express.urlencoded({extended : true}));
app.use(express.json());

const port = args.port || args.p || 5000





function getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }
  
  function coinFlip() {
    var num = getRandomInt(3)
    if (num == 0){
      return "heads"
    }
    else{
      return "tails"
    }
  }
  
  /** Multiple coin flips
   * 
   * Write a function that accepts one parameter (number of flips) and returns an array of 
   * resulting "heads" or "tails".
   * 
   * @param {number} flips 
   * @returns {string[]} results
   * 
   * example: coinFlips(10)
   * returns:
   *  [
        'heads', 'heads',
        'heads', 'tails',
        'heads', 'tails',
        'tails', 'heads',
        'tails', 'heads'
      ]
   */
  
  function coinFlips(flips) {
    var flipArray = [];
    for (let i = 0; i < flips; i++){
      flipArray.push(coinFlip());
    }
    return flipArray;
  }
  
  /** Count multiple flips
   * 
   * Write a function that accepts an array consisting of "heads" or "tails" 
   * (e.g. the results of your `coinFlips()` function) and counts each, returning 
   * an object containing the number of each.
   * 
   * example: conutFlips(['heads', 'heads','heads', 'tails','heads', 'tails','tails', 'heads','tails', 'heads'])
   * { tails: 5, heads: 5 }
   * 
   * @param {string[]} array 
   * @returns {{ heads: number, tails: number }}
   */
  
  function countFlips(array) {
    var headcount = 0;
    var tailcount = 0;
    for (let i = 0; i < array.length; i++){
      if (array[i] == 'heads'){
        headcount = headcount + 1;
      }
      else{
        tailcount = tailcount + 1
      }
    }
    return {heads: headcount, tails: tailcount};
  }
  
  /** Flip a coin!
   * 
   * Write a function that accepts one input parameter: a string either "heads" or "tails", flips a coin, and then records "win" or "lose". 
   * 
   * @param {string} call 
   * @returns {object} with keys that are the input param (heads or tails), a flip (heads or tails), and the result (win or lose). See below example.
   * 
   * example: flipACoin('tails')
   * returns: { call: 'tails', flip: 'heads', result: 'lose' }
   */
  
  function flipACoin(call) {
    var mycall = call;
    var myflip = coinFlip();
    var myresult = 'lose';
    if (myflip == call){
      myresult = 'win'
    }
  
    return {call: mycall, flip: myflip, result: myresult };
  }
  




// Start an app server
const server = app.listen(port, () => {
    console.log('App listening on port %PORT%'.replace('%PORT%',port))
});

if (args.log == 'false'){
  console.log("not doing the file")
}
else{
  const accessLog = fs.createWriteStream('access.log', {flags : 'a'})
  app.use(morgan('combined', {steam: accessLog}))
}

app.use((req,res,next) => {
  let logdata = {
    remoteaddr : req.ip,
    remoteuser:req.user,
    time: Date.now(),
    method : req.method,
    url: req.url,
    protocol: req.protocol,
    httpversion: req.httpVersion,
    status : res.statusCode,
    referrer: req.headers['referer'],
    useragent : req.headers['user-agent']
  };
  console.log(logdata)
  const statement = db.prepare('insert into accesslog (remoteaddr, remoteuser, time, method, url, protocol, httpversion, status, referrer, useragent) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)')
  const info = statement.run(logdata.remoteaddr, logdata.remoteuser, logdata.time, logdata.method, logdata.url, logdata.protocol, logdata.httpversion, logdata.status, logdata.referrer, logdata.useragent)
  next();
})

app.get('/app/', (req, res, next) => {


  res.json({'message:' : 'lets gooo it works' (200)})
  res.status(200);
    // Respond with status 200
    //     res.statusCode = 200;
    // // Respond with status message "OK"
    //     res.statusMessage = 'OK';
    //     res.writeHead( res.statusCode, { 'Content-Type' : 'text/plain' });
    //     res.end(res.statusCode+ ' ' +res.statusMessage)
    });




app.get('/app/flip/', (req,res) => {
    res.status(200).json({"flip" : coinFlip()})
});
app.get('/app/flip/coins', (req,res,next) => {
  var flips = coinFlips(req.body.number);
  var count = countFlips(flips)
  res.status(200).json({"raw": flips, "summary":count})
});
app.get('/app/flips/:number', (req, res) => {
    const flips = coinFlips(req.params.number);
    res.status(200).json({"raw": flips, "summary" : countFlips(flips)})
        
});

app.get('/app/flip/call/heads', (req,res) => {
    res.status(200).json(flipACoin("heads"))
})
app.get('/app/flip/call/tails', (req,res) => {
    res.status(200).json(flipACoin('tails'))
})

app.post('/app/flip/call/', (req,res,next) =>{
  res.status(200).json(flipACoin(req.body.guess))
}
)
app.post('/app/flip/coins/', (req,res,next) =>{
  var flips = coinFlips(req.body.number)
  res.status(200).json({"raw":flips,"summary": countFlips(flips)})
})
app.get('/app/flip/call/:guess(heads|tails)/', (req,res,next) =>{
  res.status(200).json(flipACoin(req.params.guess))
}
)

if (args.debug || args.d){
  app.get('/app/log/access', (req,res,next) => {
    res.status(200).json(db.prepare("SELECT * FROM accesslog").all());
  })
  app.get('/app/error', (req,res,next) => {
    throw new Error('Error');
  })

}

// Default response for any other request
app.use(function(req, res){
    res.status(404).send('404 NOT FOUND')
});