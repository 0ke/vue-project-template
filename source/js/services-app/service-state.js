
V.services.state = {

	data: function () {
		return {
			hasState: false
		};
	},

	computed: {

		isLoaded: function () {
			if (
				!app.data.isLoading &&
				this.hasState
			) {
				return true;
			}
			return false;
		}

	},

	methods: {



		// State handling

		// 1st load
		getInitialState: function () {

			// Basic format
			var state = {};

			l('initial state', state);

			return state;
		},

		collectState: function () {

			// Basic format
			var state = {};

			// Do something with `state`
			if (app.preferences && app.preferences.values) {
				state.preferences = _.merge({}, app.preferences.values);
			}

			return state;
		},

		loadState: function (state) {

			// Do something with `state`
			if (state.preferences) {
				app.preferences.loadValues(state.preferences);
			}

			return this;
		},

		storeState: function () {
			return app.storage.set('state', this.collectState());
		},

		fetchStoredState: function () {
			return app.storage.get('state');
		},



		// Life cycle

		afterLoad: function () {
			var dfd = jQuery.Deferred();

			// Load fetched state
			this.fetchStoredState().done(function (state) {
				if (state) {
					this.loadState(state);
				} else {
					this.loadState(this.getInitialState());
				}

			// Load initial state
			}).fail(function () {
				this.loadState(this.getInitialState());

			// Resolve either way
			}).always(function () {
				this.hasState = true;
				dfd.resolve();
			});

			return dfd.promise();
		}

	}

};
