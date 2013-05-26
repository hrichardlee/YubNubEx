(function(yubnubex, $, undefined) {
	var Command = Backbone.Model.extend({
		idAttribute: "trigger"
		});
		
	var CommandList = Backbone.Collection.extend({
		model: Command,
		chromeStorage: new Backbone.ChromeStorage("YubNubEx-commands", "sync"),
		comparator: function(m){
			return m.get("trigger");
		}
		});
		
	yubnubex.CommandList = CommandList;
}(window.yubnubex = window.yubnubex || {}, jQuery));