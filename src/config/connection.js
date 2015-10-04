var WebSocket = require("ws");
var events = require("events");
var util = require('util');

function ChatConnection(url, nick, channel)
{
	this.url = url;
	this.nick = nick;
	this.channel = channel;

	events.EventEmitter.call(this);
	this.ws = new WebSocket(url);
	var that = this;

	this.send = function(text)
	{
		var msgData = JSON.stringify({cmd: "chat", text: text});
		that.ws.send(msgData);
	};

	this.ws.on("open", function()
	{
		var joinData = {cmd: "join", nick: nick, channel: channel};
		that.ws.send(JSON.stringify(joinData));
		var msgData = JSON.stringify({cmd: "chat", text: "I'm trying to make a new client for hack chat"});
		//that.ws.send(msgData);
	});

	this.ws.on("message", function(data, flags)
	{
		var _data = JSON.parse(data);

		that.emit(_data.cmd, _data);
	});
}
util.inherits(ChatConnection, events.EventEmitter);

module.exports = ChatConnection;
