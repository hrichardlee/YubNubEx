function load_overrides() {
	div = document.getElementById('savedOverrides');
	while (div.hasChildNodes()) div.removeChild(div.firstChild);

	commands = [];
	for (command in localStorage) {
		commands.push(command);
	}
	
	commands.sort();
	commands.forEach(function(command) {
		var trNode = document.createElement('tr');
		var cmdNameTdNode = document.createElement('td');
		cmdNameTdNode.appendChild(document.createTextNode(command));
		trNode.appendChild(cmdNameTdNode);
		var cmdTdNode = document.createElement('td');
		cmdTdNode.appendChild(document.createTextNode(localStorage[command]));
		trNode.appendChild(cmdTdNode);
		var removeTdNode = document.createElement('td');
		var linkNode = document.createElement('button');
		linkNode.addEventListener('click', function() { remove_override(command); });
		var textNode2 = document.createTextNode('Remove');
		linkNode.appendChild(textNode2);
		removeTdNode.appendChild(linkNode);
		trNode.appendChild(removeTdNode);
		div.appendChild(trNode);
	});
}

function remove_override(command) {
	localStorage.removeItem(command);
	load_overrides();
}

function save_overrides() {
	localStorage[document.getElementById('newOverrideCommand').value]
		= document.getElementById('newOverrideUrl').value;
	document.getElementById('newOverrideCommand').value = "";
	document.getElementById('newOverrideUrl').value = "";
	
	load_overrides();
}

function clear_overrides() {
	localStorage.clear();
	load_overrides();
}

function init() {
	load_overrides();
	document.getElementById('saveButton').addEventListener('click', save_overrides);
	document.getElementById('clearOverridesButton').addEventListener('click', clear_overrides);
}

document.addEventListener('DOMContentLoaded', init);