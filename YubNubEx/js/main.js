var commandSplitChar = '.';
var paramSplitChar = '`';

// returns a list of urls
function resolveCommand(command, param) {
	if (command == "") return ["about:blank"]; // if the command is blank, it's going to be blank ("" signifies open a blank tab)
	
	var commandString = localStorage[command]; // see if we have the command cached/overrided
	if (commandString == null) return [combine(getExternalCommand(command), param)]; // if we don't have the command, go get it from yubnub
	
	//if it's in the internal storage, it could be any number of things
	if (commandString.substr(0, 7) == 'http://' ||
		commandString.substr(0, 8) == 'https://') { // if it's a straight url, we're done
		return [combine(commandString, param)];
	} else if (commandString.indexOf(" ") == -1) {	// if there are no spaces, it's a conglomerate command
		return commandString.split(commandSplitChar).map(function(subcommand) {
			return resolveCommand(subcommand, param);
		}).reduce(function(prev, current) {
			return prev.concat(current);
		}, []);
	} else {	// if there is a space, it includes a parameter transformation
		var split = commandString.indexOf(" ");
		subcommands = commandString.substring(0, split);
		paramTransform = commandString.substring(split + 1);
		return resolveCommand(subcommands, combine(paramTransform, param, true));
	}
}

function combine(url, param, alreadyEscaped) {
	if (url == null) return chrome.extension.getURL('badCommand.html');
	if (param == null) param = "";
	return url.replace('%s', alreadyEscaped ? param : escape(param)); //not sure if we should be doing the escaping here
}

function getExternalCommand(command) {
	//do it synchronously for now. oh well
	var xhr = new XMLHttpRequest();
	xhr.open('GET',
		'http://yubnub.org/kernel/man?args=' + command,
		false);
	xhr.send();
	
	if (xhr.status == 200) {
		var i = xhr.responseText.indexOf('<span class="muted">');
		if (i != -1) {
			var temp = xhr.responseText.substring(i + 20);
			i = temp.indexOf('</span>');
			if (i != -1) {
				commandString = temp.substring(0, i);
				//save commandString
				localStorage[command] = commandString;
				return commandString;
			}
		}
	}
	//what if it fails?
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