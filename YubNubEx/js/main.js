(function(yubnubex, $, undefined) {
	var commandSplitChar = '.';
	var paramSplitChar = '`';
	

	// returns a promise containing a list of urls
	function resolveCommand(command, param) {
		if (!command) return $.when(["about:blank"]); // if the command is blank, it's going to be blank ("" signifies open a blank tab)
		
		var storedCommands = new yubnubex.CommandList();
		//todo make this more efficient?
		return storedCommands.fetch().then(function(newStoredCommands) {			
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
		});
	}
	
	function combine(url, param, alreadyEscaped) {
		if (!url) return chrome.extension.getURL('badCommand.html#unknownerror');
		if (!param) param = "";
		return url.replace('%s', alreadyEscaped ? param : escape(param));
	}

	function getExternalCommand(command) {
		var xhr = $.ajax({
			url: 'http://yubnub.org/kernel/man?args=' + command,
			async: false
		});
		
		if (xhr.status === 0) return chrome.extension.getURL('badCommand.html#nointernet');
		if (xhr.status !== 200) return chrome.extension.getURL('badCommand.html#unknownerror');
		
		var el = $("<div></div>");
		el.html(xhr.responseText);
		var commandString = $("span.muted", el).first().text();
		if (commandString) {
			var storedCommands = new yubnubex.CommandList();
			storedCommands.create({
				trigger: command,
				exec: commandString},
				{merge: true});
			
			return commandString;
		} else {
			return chrome.extension.getURL('badCommand.html#unknowncommand');
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
		resolveAndDisplayLoop(0, 0, commands, params);
		
		
		
		function resolveAndDisplayLoop(ic, ip, commands, params) {
			return resolveCommand(commands[ic], params[ip]).then(function (urls) {
				displayUrls(urls, ic === 0 && ip === 0);
				var nextIc = ic < commands.length - 1 ? ic + 1 : 0;
				var nextIp = nextIc === 0 ? ip + 1 : ip;

				if (nextIp < params.length)
					return resolveAndDisplayLoop(nextIc, nextIp, commands, params);
			});
		}
		
		function displayUrls(urls, first) {
			if (first && urls[0]) {
				var firstUrl = urls[0];
				urls = urls.splice(1, urls.length - 1);
				chrome.tabs.query({currentWindow: true, active: true}, function(tab) {
					chrome.tabs.update(tab[0].id, {url: firstUrl});
				});
			}
			
			var i;
			for (i = 0; i < urls.length; i++)
				chrome.tabs.create({url: urls[i], selected: false});
		};
	}

	// receive query, initialize
	chrome.omnibox.onInputEntered.addListener(executeCommand);
	
}(window.yubnubex = window.yubnubex || {}, jQuery));