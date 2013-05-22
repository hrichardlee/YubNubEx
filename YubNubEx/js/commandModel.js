(function(yubnubex, $, undefined) {
	var Command = Backbone.Model.extend({
		idAttribute: "trigger"
		});
		
	var CommandList = Backbone.Collection.extend({
		model: Command,
		localStorage: new Backbone.LocalStorage("YubNubEx-commands"),
		comparator: function(m){
			return m.get("trigger");
		}
		});
		
	yubnubex.CommandList = CommandList;
}(window.yubnubex = window.yubnubex || {}, jQuery));