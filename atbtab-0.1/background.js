let t = null;
let slideshowWindows = new Array();
const defaults = {
	interval: 15,
	order: "forward",
	reload: false,
	automaticallyStart: false
}
let interval = 15;
let order = "forward";
let reload = false;
let automaticallyStart = false;

class slideshowWindow {
	constructor(id) {
		this.id = id;
		this.count = 0;
	}
}

function setWindowIconTitle(windowId) {
	let path = "icons/tab-slideshow-we-2colors.svg";
	let title = browser.i18n.getMessage("browserActionTitle");
	if (containsSlideshowWindowId(windowId)) {
		path = "icons/tab-slideshow-we-2-2colors.svg";
		title = browser.i18n.getMessage("browserActionTitleRunning");
	}
	browser.browserAction.setIcon({
		path: path,
		windowId: windowId
	});
	browser.browserAction.setTitle({
		title: title,
		windowId: windowId
	});
}

function containsSlideshowWindowId(id) {
	let b = false;
	for (let sw of slideshowWindows) {
		if (sw.id == id) {
			b = true;
			break;
		}
	}
	return b;
}

function timer() {
	let changeWindowIds = new Array();
	for (let sw of slideshowWindows) {
		sw.count = sw.count + 1;
		if (interval <= sw.count) {
			changeWindowIds.push(sw.id);
			sw.count = 0;
		}
	}
	for (let changeWindowId of changeWindowIds) {
		browser.tabs.query({
			windowId: changeWindowId
		}, (tabs) => {
			let array = new Array(tabs.length);
			let activeTabId = 0;
			for (let i = 0; i < tabs.length; i++) {
				array[i] = tabs[i].id;
				if (tabs[i].active == true) {
					activeTabId = tabs[i].id;
				}
			}
			let nextTabId = array[0];
			if (order == "random") {
				for (let i = 0; i < array.length; i++) {
					if (array[i] == activeTabId) {
						array.splice(i, 1);
						break;
					}
				}
				if (0 < array.length) {
					nextTabId = array[Math.floor(Math.random() * array.length)];
				}
			} else if (order == "reverse") {
				if (array.indexOf(activeTabId) != 0) {
					nextTabId = array[array.indexOf(activeTabId) - 1];
				} else {
					nextTabId = array[array.length - 1];
				}
			} else {
				if (array.indexOf(activeTabId) != array.length - 1) {
					nextTabId = array[array.indexOf(activeTabId) + 1];
				}
			}
			browser.tabs.update(nextTabId, {
				active: true
			});
			if (reload) {
				browser.tabs.reload(nextTabId);
			}
		});
	}
}

browser.browserAction.onClicked.addListener((tab) => {
	windowManager(tab.windowId);
});

function windowsOnRemoved(windowId) {
	for (let i = 0; i < slideshowWindows.length; i++) {
		if (slideshowWindows[i].id == windowId) {
			slideshowWindows.splice(i, 1);
			i = i - 1;
		}
	}
	if (slideshowWindows.length == 0 && t != null) {
		t = clearInterval(t);
		browser.windows.onRemoved.removeListener(windowsOnRemoved);
	}
}

browser.storage.local.get(defaults, (options) => {
	interval = options.interval;
	order = options.order;
	reload = options.reload;
	automaticallyStart = options.automaticallyStart;
	if (automaticallyStart) {
		browser.windows.onCreated.addListener(windowsOnCreated);
		browser.windows.getAll({}, (windows) => {
			for (let window of windows) {
				windowManager(window.id);
			}
		});
	} else {
		browser.windows.onCreated.removeListener(windowsOnCreated);
	}
});

browser.runtime.onMessage.addListener((message) => {
	if (message.interval != null) {
		interval = message.interval;
	}
	if (message.order != null) {
		order = message.order;
	}
	if (message.reload != null) {
		reload = message.reload;
	}
	if (message.automaticallyStart != null) {
		automaticallyStart = message.automaticallyStart;
		if (automaticallyStart) {
			browser.windows.onCreated.addListener(windowsOnCreated);
		} else {
			browser.windows.onCreated.removeListener(windowsOnCreated);
		}
	}
});

function windowManager(windowId) {
	browser.windows.getAll({}, (windows) => {
		let allWindowIds = new Array();
		for (let window of windows) {
			allWindowIds.push(window.id);
		}
		for (let i = 0; i < slideshowWindows.length; i++) {
			if (allWindowIds.indexOf(slideshowWindows[i].id) == -1) {
				slideshowWindows.splice(i, 1);
				i = i - 1;
			}
		}
		if (containsSlideshowWindowId(windowId)) {
			for (let i = 0; i < slideshowWindows.length; i++) {
				if (slideshowWindows[i].id == windowId) {
					slideshowWindows.splice(i, 1);
					i = i - 1;
				}
			}
		} else {
			slideshowWindows.push(new slideshowWindow(windowId));
		}
		setWindowIconTitle(windowId);
		if (slideshowWindows.length == 0 && t != null) {
			t = clearInterval(t);
			browser.windows.onRemoved.removeListener(windowsOnRemoved);
		} else if (slideshowWindows.length != 0 && t == null) {
			t = setInterval(timer, 1000);
			browser.windows.onRemoved.addListener(windowsOnRemoved);
		}
	});
}

function windowsOnCreated(window) {
	if (automaticallyStart) {
		windowManager(window.id);
	}
}