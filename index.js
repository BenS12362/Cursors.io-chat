const WebSocket = require("ws");
var SerialPort = require("serialport");
var arduinoCOMPort = "COM3";
var Filter = require('bad-words');
var customFilter = new Filter({ placeHolder: 'x'});
const fs = require('fs');
function writef(content){fs.writeFile('clicks.txt', content, err => {
  if (err) {
    return
  }
  //file written successfully
})}
function writef2(content){var content2 = JSON.stringify(content);fs.writeFile('cliclick.txt', content2, err => {
  if (err) {
    return
  }
  //file written successfully
})}

//var arduinoSerialPort = new SerialPort(arduinoCOMPort, {  baudRate: 9600});
let wss = new WebSocket.Server({port:1334});
var ida = [];
var posXa = [];
var posYa = [];
var colora = [];
var namea = [];
var nicka = [];
var nicka2 = [
  [
    "192.168.1.240",
    "owner of count.topcat.io"
  ]
];
var clicka = JSON.parse(fs.readFileSync('cliclick.txt', 'utf8'));
var bana = [];
function findInd(ip){for(var i = 0;i<nicka.length;i++){if(nicka[i][0] === ip){return i;}}}
function findInd2(ip){for(var i = 0;i<bana.length;i++){if(bana[i][0] === ip){return true;}}}
function findInd3(ip){for(var i = 0;i<nicka2.length;i++){if(nicka2[i][0] === ip){return i;}}}
function findInd4(name){for(var i = 0;i<nicka.length;i++){if(nicka[i][1].includes(name)){return i;}}}
function findInd5(name){for(var i = 0;i<bana.length;i++){if(bana[i][1] === name){return i;}}}
function findInd6(name){for(var i = 0;i<bana.length;i++){if(bana[i][1].includes(name)){return i;}}}
function findInd7(ip){for(var i = 0;i<clicka.length;i++){if(clicka[i][0] === ip){return i;}}}
var clicks = parseInt(fs.readFileSync('clicks.txt', 'utf8'));
wss.on('connection', function(ws,req) {
console.log("Client connected");
var ip = ws._socket.remoteAddress;
var ip2 = ip.toString();
var ip3 = ip2.slice(7);if(findInd(ip3) != undefined){ws.close();console.log(ip3 + " was caught trying to open more than one tab");}var ban = findInd2(ip3);if (ban === true){ws.close();}
console.log("If the ip worked: " + ip3);
var ind2 = findInd3(ip3);
var ind3 = findInd7(ip3);
if(clicka[ind3] === undefined){clicka.push([ip3,0]);}
if(ind2 != undefined){nicka.push([ip3,nicka2[ind2][1]]);nicka2.push(nicka2[ind2][1]);
wss.broadcast(JSON.stringify({func:"chname",msg:nicka2[ind2][1] + " joined the chat!"}));}else {nicka.push([ip3,"Nonamer"]);
nicka2.push([ip3,"Nonamer"]);wss.broadcast(JSON.stringify({func:"chname",msg:"A new person joined the chat!"}));}
  var speopleConnected = setInterval(function(){var ban = findInd2(ip3);if (ban === true){ws.send(JSON.stringify({func:"recieved"}));ws.send(JSON.stringify({func:"writemsg",msg:"You have been banned! The websocket will close and u wont be able to send anymore messages."}));ws.close();console.log("Banned player disconnected!");} var noc = 0;
     wss.clients.forEach(function each(client) {
       noc = noc+1;
    });ws.send(JSON.stringify({func:"nofclients",ncli:noc,people:nicka}));},1000);
  ws.on("close", function() {
  console.log("Client disonnected");
  clearInterval(speopleConnected);
  })
  ws.on('message', function(msg) {
   var success = {func:"recieved"};
    let control = JSON.parse(msg)
    switch (control.func) {
      case "success":
      ws.send(JSON.stringify(success));
      case "newmsg":
      if (control.msg != undefined&control.msg!=""){
      var ind = findInd3(ip3);
      var name = nicka2[ind][1];
      var msg = name + ": " + control.msg;
      var msg2 = customFilter.clean(msg);
      wss.broadcast(JSON.stringify({func:"writemsg",msg:msg2}));}
      break;
      case "newbus": wss.broadcast(JSON.stringify({func:"writebus",bus:control.bus})); arduinoSerialPort.write(control.bus); break;
      case "cname": if(control.name != undefined&control.name != ""){var ind = findInd3(ip3);
      var ind2 = findInd(ip3);
      var oldname = nicka2[ind][1];
      var msg2 = customFilter.clean(control.name);
      nicka2[ind][1] = msg2;nicka[ind2][1] = msg2; var msg = "'" + oldname+"' changed their name to '" + msg2 + "'"; wss.broadcast(JSON.stringify({func:"chname",msg:msg}));}   break;
      case "ban": var ban = findInd4(control.name);var ban2 = findInd2(ban); if(ban2 != true&ban!=undefined){bana.push([nicka[ban][0],nicka[ban][1]]); wss.broadcast(JSON.stringify({func:"chname",msg:nicka[ban][1] + " has been banned!"}));} break;
      case "unban": var unban = findInd6(control.name);if(unban != undefined){wss.broadcast(JSON.stringify({func:"chname",msg:bana[unban][1] + " has been unbanned!"}));bana.splice(unban,1);} break;
      case "blist": ws.send(JSON.stringify({func:"chname",msg:bana})); break;
      case "click": clicks += 1;
      writef(clicks.toString());
      var ind = findInd7(ip3);
      clicka[ind][1] = clicka[ind][1] + 1;
      writef2(clicka);
      ws.send(JSON.stringify({func:"clicks",clicks:clicks,cliclicks:clicka[ind][1]}));
      break;
      case "creset": writef("0");writef2([]);clicks=0;for(var i = 0;i<clicka.length;i++){clicka[i][1] = 0;} break;
    }
  })
  ws.on('close', function(msg) {
var ind = findInd(ip3);
nicka.splice(ind,1);

});
});
wss.broadcast = function broadcast(msg) {
   wss.clients.forEach(function each(client) {
       client.send(msg);
    });
};



