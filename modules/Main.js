const {app, BrowserWindow, ipcMain} = require("electron");
const Shortcut = require("electron-localshortcut");
const {Provider, Collection, Dictionary} = require("@sugarcoated/fondant");
const Path = require("path");

class Main extends Provider {
    constructor () {
        super (Main);

        this._mainParentWindows = new Dictionary(BrowserWindow);
        this._mainChildWindows = new Dictionary(BrowserWindow);
        this._mainConfigs = new Collection();
    }

    log (logSender, logMessage) {
        const logDate = (new Date()).toLocaleString();

        console.log(`[Main] [${logDate}] [${logSender}] ${logMessage}`);
    }

    on (onMessage, onHandler) {
        const onLog = onLog => this.log('Main#on', onLog);

        ipcMain.on(onMessage, (onEvent, onArgument) => {
            onLog(`Received '${onMessage}'.`);

            onHandler(onArgument);
        });
    }

    once (onceMessage, onceHandler) {
        const onceLog = onceLog => this.log('Main#once', onceLog);

        ipcMain.once(onceMessage, (onceEvent, onceArgument) => {
            onceLog(`Received '${onceMessage}'.`);

            onceHandler(onceArgument);
        })
    }

    emit (emitChannel, emitData) {
        const emitWindows = this._mainParentWindows;
        const emitWindow = emitWindows.get(1);
        const emitLog = emitLog => this.log('Main#emit', emitLog);

        emitWindow.webContents.send(emitChannel, emitData);
        emitLog(`Send '${emitChannel}`);
    }

    createParent (parentConfig) {
        const parentConfigs = this._mainConfigs;
        const parentWindows = this._mainParentWindows;
        const parentLog = parentLog => this.log('Main#createParent', parentLog);

        let parentWindow = null;

        return new Promise((parentResolve, parentReject) => {
            const parentOpened = app.makeSingleInstance(singleInstance => {
                console.log(parentWindows);

                if (parentWindows.size) {
                    parentLog('Found existing window.');
                    parentWindow = parentWindows.first();

                    if (parentWindow.isMinimized()) {
                        parentWindow.restore();
                        parentLog('Found window was minimised, so restored it.');
                    }

                    parentWindow.focus();
                    parentResolve(parentWindow);
                }
            });

            if (parentOpened) {
                parentLog('Terminating new application process.');
                app.quit();

                parentReject(new Error('Parent window exists.'));
            } else {

                if (app.isReady()) {
                    parentLog('Process was ready, creating window.');
                    parentWindow = new BrowserWindow(parentConfig);

                    parentConfigs.set('Parent', parentConfig);
                    parentWindows.set(1, parentWindow);

                    parentResolve(parentWindow);
                } else {
                    parentLog('Process was not ready, added listener.');

                    app.on('ready', readied => {
                        parentLog('Process readied, creating window.');
                        parentWindow = new BrowserWindow(parentConfig);

                        parentConfigs.set('Parent', parentConfig);
                        parentWindows.set(1, parentWindow);

                        parentResolve(parentWindow);
                    });
                }

                app.on('activate', activation => {
                    parentLog('Process activated, saving existing window.');
                    parentConfigs.set('Parent', parentConfig);
                    parentWindows.set(1, parentWindow);

                    parentResolve(parentWindow);
                });

                setTimeout(function () {
                    parentReject(new Error('Took longer than 5s to ready/activate.'));
                }, 5000);
            }
        })
    }

    removeParent () {
        const parentConfigs = this._mainConfigs;
        const parentWindows = this._mainParentWindows;
        const parentLog = parentLog => this.log('Main#removeParent', parentLog);

        parentLog('Terminating process.');
        app.quit();
    }

    createChild (childName, childConfig) {
        const childConfigs = this._mainConfigs;
        const childParents = this._mainParentWindows;
        const childWindows = this._mainChildWindows;
        const childLog = childLog => this.log('Main#createChild', childLog);

        childConfig.parent = childParents.first();

        if (childWindows.has(childName)) {
            const childOpened = childWindows.get(childName);
            childLog(`Found existing window for '${childName}'.`);

            if (childOpened.isMinimized()) childOpened.restore();

            childOpened.focus();

            return childOpened;
        } else {
            const childOpened = new BrowserWindow(childConfig);
            childLog(`Couldn't find existing window for '${childName}', created a new one.`);

            childConfigs.set(childName, childConfig);
            childWindows.set(childName, childOpened);

            return childOpened;
        }
    }

    showChild (childName) {
        const childWindows = this._mainChildWindows;
        const childWindow = childWindows.get(childName);
        const childLog = childLog => this.log('Main#showChild', childLog);

        childLog(`Showing existing window for '${childName}'.`);
        childWindow.show();
    }

    removeChild (childName) {
        const childConfigs = this._mainConfigs;
        const childWindows = this._mainChildWindows;
        const childLog = childLog => this.log('Main#removeChild', childLog);

        childLog(`Removing child window for '${childName}'.`);
        childConfigs.delete(childName);
        childWindows.delete(childName);
    }

    addShortcut (shortcutWindow, shortcutKeys, shortcutHandler) {
        const shortcutWindows = this._mainParentWindows;
        const shortcutTarget = shortcutWindows.get(shortcutWindow);

        Shortcut.register(shortcutTarget, shortcutKeys, shortcutHandler);
    }
}

module.exports = new Main();
