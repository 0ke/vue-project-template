
V.views['pic'] = {

	props: [
		'width',
		'height',
		'defer',
		'alt',
		'src',
		'background',
		'block'
	],

	data: function () {
		return {
			isLoaded: false,
			isFailed: false
		};
	},

	computed: {
		url: function () {
			if (this.src.substr(0, 4) == 'http') {
				return this.src;
			}
			return app.paths.public + this.src;
		},
		classes: function () {
			return {
				'is-loaded' : this.isLoaded,
				'is-failed' : this.isFailed,
				'has-background' : this.background,
				'block': this.block
			};
		},
		style: function () {
			return !this.background ? {} : {
				backgroundImage: 'url(' + this.url + ')'
			};
		}
	},

	mounted: function () {
		var vm = this;
		var options = {};
		var selector;

		if (this.background) {
			options.background = true;
			selector = app.plugins.jQuery(this.$el);
		} else {
			selector = app.plugins.jQuery(this.$el).find('img');
		}

		// l('pic isLoaded', this.url, selector);

		// Fancy loading
		if (window.imagesLoaded && this.defer) {	
			selector
				.imagesLoaded(options)
				.done(function() {
					vm.isLoaded = true;
				})
				.fail(function() {
					vm.isFailed = true;
				});

		// Show immediately
		} else {
			vm.isLoaded = true;
		}

	}

};
