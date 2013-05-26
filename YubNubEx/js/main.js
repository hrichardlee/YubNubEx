(function(yubnubex, $, undefined) {
	var commandSplitChar = '.';
	var paramSplitChar = '`';
	
	var storedCommands = new yubnubex.CommandList();

	// returns a list of urls
	function resolveCommand(command, param) {
		if (!command) return ["about:blank"]; // if the command is blank, it's going to be blank ("" signifies open a blank tab)
		
		//todo make this more efficient?
		storedCommands.fetch();
		var storedCommand = storedCommands.get(command);
		if (!storedCommand)
			return [combine(getExternalCommand(command), param)]; // if we don't have the command, go get it from yubnub
		var commandString = storedCommand.get("exec");
		
		//if it's in the internal storage, it could be any number of things:
		if (/\w+:\/\//.test(commandString)) {
			// if it's a protocol		
			return [combine(commandString, param)];
		} else if (commandString.indexOf(" ") == -1) {
			// if there are no spaces, it's a conglomerate command
			return commandString.split(commandSplitChar).map(function(subcommand) {
				return resolveCommand(subcommand, param);
			}).reduce(function(prev, current) {
				return prev.concat(current);
			}, []);
		} else {
			// if there is a space, it includes a parameter transformation
			var split = commandString.indexOf(" ");
			subcommands = commandString.substring(0, split);
			paramTransform = commandString.substring(split + 1);
			return resolveCommand(subcommands, combine(paramTransform, param, true));
		}
	}
	
	function combine(url, param, alreadyEscaped) {
		if (!url) return chrome.extension.getURL('badCommand.html');
		if (!param) param = "";
		return url.replace('%s', alreadyEscaped ? param : escape(param));
	}

	function getExternalCommand(command) {
		var data = $.ajax({
			url: 'http://yubnub.org/kernel/man?args=' + command,
			async: false
		}).responseText;
		
		var el = $("<div></div>");
		el.html(data);
		var commandString = $("span.muted", el).first().text();
		if (commandString) {
			storedCommands.create({
				trigger: command,
				exec: commandString},
				{merge: true});
			
			return commandString;
		} else {
			//TODO command could not be parsed. or yubnub could not be reached breaking change?
		}
	}

	function executeCommand(text) {
		// parse the input
		var text = text.trim();
		var split = text.indexOf(' ');
		var commandText, paramText;
		if (split == -1) {	//if there's no space, make all parameters empty string
			commandText = text;
			paramText = '';
		} else {
			commandText = text.substring(0, split);
			paramText = text.substring(split + 1);
		}
		
		var commands = commandText.split(commandSplitChar);
		var params = paramText.split(paramSplitChar);
		
		//gather urls
		var urls = [];
		for (var param in params) {
			for (var command in commands) {
				urls = urls.concat(resolveCommand(commands[command], params[param]));
			}
		}
		
		//display urls
		urls.forEach(function(url, index) {
			if (index == 0) {
				chrome.tabs.getSelected(null, function(tab) {
					chrome.tabs.update(tab.id, {url: url});
				});
			} else {
				chrome.tabs.create({url: url, selected: false});
			}
		});
	}

	// receive query, initialize
	chrome.omnibox.onInputEntered.addListener(executeCommand);
	
}(window.yubnubex = window.yubnubex || {}, jQuery));