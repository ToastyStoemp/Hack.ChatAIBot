var fs = require("fs");
var path = require("path");

var ChatConnection = require("./config/connection.js");
var config = require("./config/config.json");

var Cleverbot = require('./lib/cleverbot');
var CBot = new Cleverbot;

fs.readdir("", function(err, files) {
  var bot = new ChatConnection(config.url, config.nick, config.channel);

  bot.commands = {};
  bot.init = [];
  bot.parseCmd = function(data) {
    console.log(this.channel + " | " + data.nick + ": " + data.text);

    if (data.nick.indexOf("stam") != -1) {

      var text = data.text;

      var msg = text.toLowerCase()
      var res = msg.replace(config.nick, "cleverbot")

      var directMe = (text.indexOf(config.nick) != -1);
			var directOther = (directMe || text.indexOf("@") != -1);
      var talkChance = Math.floor(Math.random() * 10) <= (text.indexOf("?") == -1 ? 1 : 4);

      if (!directOther && ( directMe || talkChance)) {
        Cleverbot.prepare(function() {
          CBot.write(res, function(response) {
            var answer = response.message;
            var refine = answer.replace("Cleverbot", config.nick);
            refine = refine.replace("3600", "meow");
						if ((refine.indexOf("Clever") == -1) && (refine.indexOf("app") == -1))
            	bot.send(refine)
          });
        });
      }
    }
  }

  bot.on("chat", function(data) {
    bot.parseCmd(data);
  });

  bot.on("info", function(data) {
    console.log(bot.channel + " | INFO : " + data.text);
  });

  bot.on("warn", function(data) {
    console.log(bot.channel + " | WARN : " + data.text);
  });

	bot.on
});
