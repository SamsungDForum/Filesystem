(function () {

    'use strict';

    var objectsCollection = {},
            $logsEl = null,
            $mainList = null,
            $selected = null,
            $contents = null,
            $path = null,
            topLevel = true;

    /**
     * Displays logging information on the screen and in the console.
     * @param {string} msg - Message to log.
     */
    function log(msg) {
        if (msg) {
            // Update logs
            console.log('[Filesystem]: ', msg);
            $logsEl.innerHTML += msg + '<br />';
        } else {
            // Clear logs
            $logsEl.innerHTML = '';
        }

        $logsEl.scrollTop = $logsEl.scrollHeight;
    }

    /**
     * Register keys used in this application
     */
    function registerKeys() {
        var usedKeys = ['0'];

        usedKeys.forEach(
                function (keyName) {
                    tizen.tvinputdevice.registerKey(keyName);
                }
        );
    }


    /**
     * Handle input from remote
     */
    function registerKeyHandler() {
        document.addEventListener(
                'keydown', function (e) {
                    switch (e.keyCode) {
                        //key 0
                        case 48:
                            log();
                            break;
                        //key enter
                        case 13:
                            enterAction();
                            break;
                        //key up
                        case 38:
                            selectPrev();
                            break;
                        //key down
                        case 40:
                            selectNext();
                            break;
                        //key left
                        case 37:
                            directoryUp();
                            break;
                        //key return
                        case 10009:
                            tizen.application.getCurrentApplication().exit();
                            break;
                    }
                }
        );
    }

    /**
     * Display application version
     */
    function displayVersion() {
        var el = document.createElement('div');
        el.id = 'version';
        el.innerHTML = 'ver: ' + tizen.application.getAppInfo().version;
        document.body.appendChild(el);
    }

    /**
     *
     */
    function enterAction() {
        var elementName = $selected.innerText,
                elementObject = null,
                fileExt = null,
                root = null,
                uri = null,
                img = null;

        if (topLevel) {
            // get virtual root's contents and list them
            Tools.listRoot(
                    elementName, function (files) {
                        handleFileList(files, true);
                    }
            );
            topLevel = false;
            $path.innerText = elementName;
        } else {
            elementObject = objectsCollection[elementName];
            if (elementObject.isDirectory) {
                elementObject.listFiles(handleFileList);
            } else {
                fileExt = elementName.match(/\.([a-z]{3,})$/);
                fileExt = (
                                  fileExt
                          ) ? fileExt.pop() : '';
                root = elementObject.fullPath.split("/")[0];
                switch (fileExt) {
                    case 'js':
                    case 'html':
                    case 'xml':
                    case 'txt':
                        Tools.readFileAsText(
                                root, elementName, function (contents) {
                                    $contents.innerText = contents;
                                }
                        );
                        break;
                    case 'jpg':
                    case 'png':
                    case 'gif':
                        uri = elementObject.toURI();
                        img = new Image();
                        img.src = uri;
                        $contents.appendChild(img);
                        break;
                }
                $path.innerText = elementObject.path;
            }
        }
    }

    /**
     * go one level up or show message that we're already at highest level
     */
    function directoryUp() {
        displayStorages();
    }


    function handleFileList(files, handleTopLevel) {
        var i = 0, j = files.length, el = null;

        if (files.code) {
            log('Error thrown: ' + files.message);
            if (handleTopLevel) {
                topLevel = true;
            }
            return;
        }

        objectsCollection = {};

        if (!files.length) {
            objectsCollection['<em>This folder is empty</em>'] = {"This folder is": "empty"};
        } else {
            for (i; i < j; i++) {
                el = files[i];
                if (el.name) {
                    objectsCollection[el.name] = el;
                } else if (el.label) {
                    objectsCollection[el.label] = el;
                }
            }
            $path.innerText = files[0].path;
        }
        Tools.inspectObj(
                objectsCollection, $mainList, function () {
                    select($mainList.firstElementChild);
                }
        );
    }

    /**
     * @global $mainList
     */
    function displayStorages() {
        Tools.listStorages(handleFileList);
        $path.innerText = 'storages';
        topLevel = true;
    }

    function previewSelected(label) {
        var elementToPreview = null,
                propsToShow = undefined;

        elementToPreview = objectsCollection[label];

        if (elementToPreview.path) {
            propsToShow = ['isFile', 'isDirectory', 'fullPath', 'readOnly', 'length', 'fileSize', 'name'];
        }

        try {
            $contents.innerHTML = JSON.stringify(elementToPreview, propsToShow).slice(1, -1).replace(/,/g, "<br>\n");
        } catch (e) {
            console.error(e);
        }
    }

    /**
     *
     */
    function select(el) {
        if ($selected) {
            $selected.classList.remove('selected');
        }
        $selected = el;
        $selected.classList.add('selected');
        previewSelected($selected.innerText);
        $selected.scrollIntoViewIfNeeded();
    }

    function selectNext() {
        if ($selected.nextElementSibling) {
            select($selected.nextElementSibling);
        } else {
            select($selected.parentElement.firstElementChild);
        }
    }

    function selectPrev() {
        if ($selected.previousElementSibling) {
            select($selected.previousElementSibling);
        } else {
            select($selected.parentElement.lastElementChild);
        }
    }

    /**
     * Start the application once loading is finished
     */
    window.onload = function () {
        $mainList = document.querySelector('#dirtree');
        $logsEl = document.querySelector('#logs');
        $contents = document.querySelector('#contents');
        $path = document.querySelector('#path');

        if (typeof window.tizen === "undefined") {
            log('This application needs to be run on Tizen device');
            return;
        }

        displayVersion();
        registerKeys();
        registerKeyHandler();
        displayStorages();
        Tools.setLogger(log);
        Tools.listen(displayStorages);
    }
})();
