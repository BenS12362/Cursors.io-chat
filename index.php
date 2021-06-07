<?php
$myfile = fopen("ips.txt", "a") or die("Ip getter failed!!!!!!!!");
$addr = $_SERVER["REMOTE_ADDR"];
$txt = "$addr\n";
fwrite($myfile, $txt);
fclose($myfile);
?><style>
#cmsg {
	border: 2px solid black;
	overflow-y: auto;
	overflow-x: auto;
	height: 300;
	width: 300;
}
#ppl {
	border: 2px solid black;
	overflow-y: auto;
	overflow-x: auto;
	height: 175;
	width: 175;
}

#acmsg {}
</style>
<script>
var webSocket = new WebSocket("ws://108.93.48.197:1334");

function writechatmsg(cmsg) {
	var tscmsg = cmsg;
	webSocket.send(JSON.stringify({
		func: "newmsg",
		msg: tscmsg
	}));
}
webSocket.onopen = function(event) {
	webSocket.send(JSON.stringify({
		func: "success"
	}));
	webSocket.onmessage = function(event) {
		let control = JSON.parse(event.data);
		switch(control.func) {
			case "recieved":
                               
				var cmsg = document.getElementById("cmsg");
                                var messages = document.getElementById("cmsg");
                                function scrollToBottom() {
  messages.scrollTop = messages.scrollHeight;
}
                                shouldScroll = messages.scrollTop + messages.clientHeight === messages.scrollHeight;
				var chatmsg = document.createElement("div");
				chatmsg.id = "acmsg";
				chatmsg.innerHTML = "Connected to chat server";
				cmsg.appendChild(chatmsg);
                                if (shouldScroll) {
    scrollToBottom();
  }
				break;
			case "writemsg":
				if(control.msg === undefined) {
	
				} else {
                                        var messages = document.getElementById("cmsg");
                                        function scrollToBottom() {
  messages.scrollTop = messages.scrollHeight;
}
                                shouldScroll = messages.scrollTop + messages.clientHeight === messages.scrollHeight;
					var msg = document.getElementById("msg");
					msg.play();
					var cmsg = document.getElementById("cmsg");
					var chatmsg = document.createElement("div");
					chatmsg.id = "acmsg";
					chatmsg.innerHTML = control.msg;
					cmsg.appendChild(chatmsg);
                                        if (shouldScroll) {
    scrollToBottom();
  }
				}
				break;
			case "chname":
				if(control.msg === undefined) {

				} else {
                                        var messages = document.getElementById("cmsg");
                                function scrollToBottom() {
  messages.scrollTop = messages.scrollHeight;
}
                                shouldScroll = messages.scrollTop + messages.clientHeight === messages.scrollHeight;
					var cmsg = document.getElementById("cmsg");
					var chatmsg = document.createElement("div");
					chatmsg.id = "acmsg";
					chatmsg.innerHTML = control.msg;
					cmsg.appendChild(chatmsg);
                                         if (shouldScroll) {
    scrollToBottom();
  }
				}
                                break;
			case "nofclients":
				var numconnected = document.getElementById("numconnected");
				numconnected.innerHTML = "People connected: " + control.ncli;
                                var people = control.people;
                                var text = "";
                                for (var i = 0;i<people.length;i++){text += "<div>" + people[i][1] + "</div><br>";}
                                var ppl = document.getElementById("ppl");
				ppl.innerHTML = text;
				break;
                        case "clicks": 
                        writechatmsg(control.clicks + " total clicks. " + control.cliclicks + " clicks from you.");
                         break;
		}
	}
}
</script>
<script>
function csubm(event, tmsg) {
	if(event.keyCode === 13) {
		var chat = document.getElementById("chat");
		writechatmsg(tmsg);
		chat.value = "";
	}
}

function changename() {
	var newname = document.getElementById("name").value;
	webSocket.send(JSON.stringify({
		func: "cname",
                name: newname
	}));
}
function chname(name) {
	webSocket.send(JSON.stringify({
		func: "cname",
                name: name
	}));
}
function ban(name){	webSocket.send(JSON.stringify({
		func: "ban",
                name: name
	}));}
function unban(name){	webSocket.send(JSON.stringify({
		func: "unban",
                name: name
	}));}
        function banlist(){	webSocket.send(JSON.stringify({
		func: "blist"
	}));}
                function bclick(){	webSocket.send(JSON.stringify({
		func: "click"
	}));}
        function resetClicks(){webSocket.send(JSON.stringify({func:"creset"}));}
</script>
<div id="cmsg" height="300"></div>
<br>
<input id="chat" onkeydown="csubm(event,this.value)">
<button onclick="var chat = document.getElementById('chat').value; writechatmsg(chat);">Send chat message</button>
<br>
<input id="name">
<button onclick="changename()">Change username</button>
<p id="numconnected"></p>
<div id="ppl" height="100"></div>
<audio id="msg" src="/skype.m4a" style="display:none;"></audio>