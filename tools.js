var Tools = (function(){
    var log;

    /**
     * Set function used for logging in this module
     * @param logger
     */
    function setLogger(logger) {
        log = logger;
    }

    /**
     * helper function for rendering the list
     */
    function inspectObj(obj, list, cb) {
        var prop, ar = [];
        for (prop in obj) {
            ar.push(prop);
        }
        list.innerHTML = '<li>' + ar.sort().join('</li><li>') + '</li>';
        if (typeof cb === 'function') {
            cb();
        }
    }

    function getType(smthng) {
        return Object.prototype.toString.call(smthng).slice(8, -1);
    }

    function e(arg){
        if (typeof arg === "function") {
            return arg;
        } else {
            return function (er) { console.error('[' + arg + '] ' + er); };
        }
    }

    function saveFile(location, name, contents) {
        function rs(dir) {
            var fh  = dir.createFile(name);
            if (getType(fh) === "File") {
                fh.openStream('w', function(fs){
                    fs.write(contents);
                    fs.close();
                    log('File written: ' + location + '/' + name);
                }, e('openStream'), 'UTF-8');
            }
        }

        tizen.filesystem.resolve(location, rs, e('resolve'), 'rw');
    }

    function listRoot(location, cb) {
        tizen.filesystem.resolve(location, rs, cb, 'r');
        function rs(dir) {
            dir.listFiles(cb);
        }
    }

    function getFile(location, name, callback) {
        tizen.filesystem.resolve(location, rs, e('resolve'), 'r');
        function rs(dir) {
            callback(dir.resolve(name));
        }
    }

    function readFileAsText(location, name, callback) {
        getFile(location, name, function(fh){
            fh.readAsText(callback);
        });
    }

    function getFileURI(location, name, callback) {
        getFile(location, name, function(fh){
            callback(fh.toURI());
        });
    }

    function listStorages(cb) {
        tizen.filesystem.listStorages(cb, cb);
    }

    function listen(listener) {
        tizen.filesystem.addStorageStateChangeListener(listener);
    }

    return {
        setLogger: setLogger,
        inspectObj: inspectObj,
        listStorages: listStorages,
        listRoot: listRoot,
        getFile: getFile,
        getFileURI: getFileURI,
        readFileAsText: readFileAsText,
        listen: listen
    }
}());