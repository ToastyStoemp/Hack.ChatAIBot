var fs = require("fs");
var path = require("path");

var ChatConnection = require("./config/connection.js");
var config = require("./config/config.json");

var Cleverbot = require('./lib/cleverbot');
var CBot = new Cleverbot;

var mute = false;

fs.readdir("", function(err, files)
{
	var bot = new ChatConnection(config.url, config.nick, config.channel);

	bot.commands = {};
	bot.init = [];
	bot.parseCmd = function (data) {
		console.log(this.channel + " | " + data.nick + ": " + data.text);
		
		if (data.nick != this.nick) {
			
			var text = data.text;
			
			if (text === "-mute")
				mute = !mute;
			
			else if (text === "-source")
				bot.send(refine);
			
			var msg = text.toLowerCase()
			var res = msg.replace("toastybot", "cleverbot")
			
			console.log(res)
			
			if (!mute) {
				Cleverbot.prepare(function () {
					CBot.write(res, function (response) {
						var answer = response.message;
						var refine = answer.replace("Cleverbot", "ToastyBot");
						bot.send(refine)
					});
				});
			}
			
		}
	}

	bot.on("chat", function(data)
	{
		bot.parseCmd(data);
	});

	bot.on("info", function(data)
	{
		console.log(bot.channel + " | INFO : " + data.text);
	});

	bot.on("warn", function(data)
	{
		console.log(bot.channel + " | WARN : " + data.text);
	});
});
