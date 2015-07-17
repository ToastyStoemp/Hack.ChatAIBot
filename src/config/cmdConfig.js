var fs = require("fs");
var path = require("path");

var init = function(bot)
{
	bot.config = {};

	fs.readdir("./", function(err, files)
	{
		if(err)
			throw err;

		for(var i = 0; i < files.length; i++)
		{
			if(path.extname(files[i]) == ".json")
			{
				var data = require("./" + files[i]);

				var name = path.basename("." + files[i], ".json")

				bot.config[name] = data;
			}
		}

		bot.emit("config");
	});
};

var configCmd = function(bot, sender, args)
{
	if(bot.requirePerm(sender, "config"))
		return;

	args[0] = args[0] || "";

	if(args[0] == "set" && typeof args[1] != 'undefined' && typeof args[2] != 'undefined')
	{
		var name = args[1] || "undefined";
		console.log(args.slice(2).join(" "))
		var value = JSON.parse(args.slice(2).join(" ")) || "";
		
		var split = name.split(".");
		var obj = bot.config;

		for(var i = 0; i < split.length - 1; i++)
		{
			if(typeof obj[split[i]] == 'undefined')
			{
				bot.send("@" + sender + " " + split[i - 1] + " has no property " + split[i]);
				return;
			}

			obj = obj[split[i]];
		}
		obj[split[split.length - 1]] = value;
	}
	else if(args[0] == "get")
	{
		var split = (args[1] || "").split(".");
		var out = bot.config;
		for(var i = 0; i < split.length; i++)
		{
			if(typeof out[split[i]] == 'undefined')
			{
				bot.send("@" + sender + " could not read property " + split[i]);
				return;
			}
			else
			{
				out = out[split[i]];
			}
		}

		try
		{
			bot.send("@" + sender + " " + JSON.stringify(out));
		}
		catch(e)
		{
			bot.send("@" + sender + " error parsing json (maybe circular object?)");
		}
	}
	else if(args[0] == "save")
	{
		for(var key in bot.config)
		{
			if(!bot.config.hasOwnProperty(key))
				continue;

			fs.writeFile("./src/data/" + key + ".json", JSON.stringify(bot.config[key]), function(err)
			{
				if(err)
					throw err;
			});
		}
	}
}

module.exports = { init: init, config: configCmd };
