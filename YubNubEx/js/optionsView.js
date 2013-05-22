(function(yubnubex, $, undefined) {
	var commands = new yubnubex.CommandList();

	var CommandView = Backbone.View.extend({
		tagName: "tr",
		events: {
			"click .remove-cmd": "removeCmd"
		},
		template: _.template($('#command-template').html()),
		initialize: function() {
			this.listenTo(this.model, 'change', this.render);
			this.listenTo(this.model, 'destroy', this.remove);
		},
		render: function() {
			this.$el.html(this.template(this.model.toJSON()));
			return this;
		},
		removeCmd: function() {
			this.model.destroy();
		}
		});
		
	var OptionsView = Backbone.View.extend({
		el: $("#options-view"),
		events: {
			"click #save-new-cmd": "saveNewCmd",
			"click #clear-all-cmds": "clearAllCmds"
		},
		initialize: function() {
			this.listenTo(commands, "sort", this.render);
			
			commands.fetch();
		},
		addOne: function(cmd) {
			var view = new CommandView({model: cmd});
			this.$("#commands-table").append(view.render().el);
		},
		render: function() {
			this.$("#commands-table").empty();
			var that = this;
			commands.each(function (c) {
				that.addOne(c);
			});
			return this;
		},
		saveNewCmd: function() {
			commands.create({
				trigger: this.$("#new-cmd-trigger").val(),
				exec: this.$("#new-cmd-exec").val()
			},
				{merge: true});
			this.$("#new-cmd-trigger").val("");
			this.$("#new-cmd-exec").val("");
			this.$("#new-cmd-trigger").focus();
		},
		clearAllCmds: function(){
			while (commands.length > 0)
				commands.at(0).destroy();
		}
		});
		
	var optionsView = new OptionsView();
}(window.yubnubex = window.yubnubex || {}, jQuery));