
V.views['console'] = {

	// props: [],

	data: function () {
		return {
			loopFps: 0,
			loopIndex: 0,
			promiseTestValues: ['foo', 'foo', 'foo', 'foo'],
			battery: null
		};
	},

	computed: {

		app: function () {
			return app;
		},

		platformInfo: function () {
			return {
				'promiseTestValues': this.promiseTestValues.join(', '),

				// Services
				audio: app.audio.isAvailable,
				auth: app.auth.isAvailable,
				loop: app.loop.isAvailable,
				storage: app.storage.isAvailable,

				// Plugins
				'app': _.keys(app).join(', '),
				'app.plugins': _.keys(app.plugins).join(', '),
				'_': typeof _,
				'Promise': typeof Promise,

				// Info
				env: app.env.is,
				browser: app.env.browser,
				platform: app.env.platform,
				version: app.env.version,
				uuid: app.env.uuid,
				viewport: app.viewport.width + ' x ' + app.viewport.height,
				battery: this.battery,

				// Booleans
				isWeb: app.env.isWeb,
				isCordova: app.env.isCordova,
				isElectron: app.env.isElectron,
				isIos: app.env.isIos,
				isAndroid: app.env.isAndroid,
				isWindows: app.env.isWindows,
				isMac: app.env.isMac,
				isTizen: app.env.isTizen,

				// JSON
				json: app.json ? JSON.stringify(app.json.all) : 'none'

			};
		}

	},

	methods: {

		reset: function () {
			app.state.loadState(app.state.getInitialState());
		},

		testLoop: function () {
			var vm = this;

			// Toggle
			if (app.loop.getIsRunning()) {
				app.loop.stop();
			} else {

				// Track loop FPS
				app.loop.onFrameUpdate(function () {
					app.log.info('updating frame');
					vm.loopFps = app.loop.getFps();
					vm.loopIndex++;
				});

				// Start loop
				app.loop.start();

				app.log.info('Loop started');

			}

		},

		testSound: function () {
			app.audio.play('on');
		},

		setPromiseTestValue: function (index, val) {
			this.$set(this.promiseTestValues, index, val);
		}

	},

	mounted: function () {
		var vm = this;

		// Battery
		if (app.battery) {
			Promise.all([app.battery.getIsPlugged(), app.battery.getLevel()]).then(function (values) {
				vm.battery = '' + values.join(', ');
			});
		}

		var returnPromise = function () {
			return new Promise(function (resolve, reject) {
				setTimeout(function () {
					var fail = !_.random(1, 1);
					if (fail) {
						reject(new Error('Error message'));
					} else {
						resolve('bar');
					}
				}, _.random(1000, 3000));
			});
		};



		// Run

		vm.setPromiseTestValue(0, 'bar');

		returnPromise().then(function (value) {
			vm.setPromiseTestValue(1, value);
		}, function (error) {
			vm.setPromiseTestValue(1, error.message);
		});

		Promise.all([
			returnPromise(),
			returnPromise()
		]).then(function (values) {
			vm.setPromiseTestValue(2, values[0]);
			vm.setPromiseTestValue(3, values[1]);
		}, function (error) {
			// app.log.error(error.message);
		});

	}

};
