/**
 * @license
 * Visual Blocks Language
 *
 * Copyright 2012 Google Inc.
 * https://developers.google.com/blockly/
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @fileoverview Helper functions for generating Arduino for blocks.
 * @author scanet@libreduc.cc (SebCanet)
 */

/*
 * auto save and restore blocks
 */
function auto_save_and_restore_blocks() {
    // Store the blocks for the duration of the reload.
    // MSIE 11 does not support sessionStorage on file:// URLs.
    if (window.sessionStorage) {
        var xml = Blockly.Xml.workspaceToDom(Blockly.getMainWorkspace());
        var text = Blockly.Xml.domToText(xml);
        window.sessionStorage.loadOnceBlocks = text;
    }
};

var fullScreen_ = false;

/**
 * Full screen, thanks to HTML5 API
 */
function fullScreen(_element) {
    var elementClicked = _element || document.documentElement;
    // HTML5
    if (document.fullscreenElement) {
        if (!document.fullscreenElement) {
            elementClicked.requestFullscreen();
            document.addEventListener('fullscreenchange', exitFullScreen, false);
        } else {
            document.exitFullscreen();
            document.removeEventListener('fullscreenchange', exitFullScreen, false);
        }
    } else
        // Mozilla
        if (document.mozFullScreenEnabled) {
            if (!document.mozFullScreenElement) {
                elementClicked.mozRequestFullScreen();
                document.addEventListener('mozfullscreenchange', exitFullScreen, false);
            } else {
                document.mozCancelFullScreen();
                document.removeEventListener('mozfullscreenchange', exitFullScreen, false);
            }
        } else
            // Chrome, Safari and Opera
            if (document.webkitFullscreenEnabled) {
                if (!document.webkitFullscreenElement) {
                    elementClicked.webkitRequestFullscreen();
                    document.addEventListener('webkitfullscreenchange', exitFullScreen, false);
                } else {
                    document.webkitExitFullscreen();
                    document.removeEventListener('webkitfullscreenchange', exitFullScreen, false);
                }
            } else
                // IE/Edge
                if (document.msFullscreenEnabled) {
                    if (!document.msFullscreenElement) {
                        elementClicked.msRequestFullscreen();
                        document.addEventListener('MSFullscreenChange', exitFullScreen, false);
                    } else {
                        document.msExitFullscreen();
                        document.removeEventListener('MSFullscreenChange', exitFullScreen, false);
                    }
                }
};

function exitFullScreen() {
    if (document.fullscreenElement || document.webkitIsFullScreen || document.mozFullScreen || document.msFullscreenElement !== null)
        if (fullScreen_ === false) {
            fullScreenButton.className = 'iconButtonsClicked';
            fullScreen_ = true;
        } else {
            fullScreenButton.className = 'iconButtons';
            fullScreen_ = false;
        }
};

/**
 * Copy code from div code_peek in clipboard system
 */
Code.copyToClipboard = function () {
    if (document.selection) { // IE
        var range = document.body.createTextRange();
        range.moveToElementText(document.getElementById("code_peek"));
        range.select();
    } else if (window.getSelection) {
        var range = document.createRange();
        range.selectNode(document.getElementById("code_peek"));
        window.getSelection().removeAllRanges();
        window.getSelection().addRange(range);
    }
    document.execCommand("copy");
};

/**
 * modal controllers
 */
Code.boardsListModalShow = function () {
    document.getElementById('overlayForModals').style.display = "block";
    document.getElementById('boardListModal').classList.add('show');
    var boardValue = document.getElementById("boardMenu").value;
    if (boardValue !== 'none') {
        document.getElementById("boardDescriptionSelector").selectedIndex = boardValue;
        document.getElementById("boardDescriptionSelector").value = boardValue;
        document.getElementById("boardDescriptionSelector").options[document.getElementById("boardDescriptionSelector").selectedIndex].style.backgroundColor = 'yellow';
    }
    window.addEventListener('click', Code.boardsListModalHide, 'once');
    Code.boardDescription();
}
Code.portsListModalShow = function () {
    document.getElementById('overlayForModals').style.display = "block";
    document.getElementById('portListModal').classList.add('show');
    window.addEventListener('click', Code.portsListModalHide, 'once');
}
document.getElementById("closeModalBoards").onclick = function () {
    document.getElementById('overlayForModals').style.display = "none";
    document.getElementById('boardListModal').classList.remove('show');
}
document.getElementById("closeModalPorts").onclick = function () {
    document.getElementById('overlayForModals').style.display = "none";
    document.getElementById('portListModal').classList.remove('show');
}
// When the user clicks anywhere outside of the modal, close it
Code.boardsListModalHide = function (event) {
    if (!document.getElementById('boardListModal').contains(event.target)) {
        document.getElementById('overlayForModals').style.display = "none";
        document.getElementById('boardListModal').classList.remove('show');
    }
}
Code.portsListModalHide = function (event) {
    if (!document.getElementById('boardListModal').contains(event.target)) {
        document.getElementById('overlayForModals').style.display = "none";
        document.getElementById('portListModal').classList.remove('show');
    }
}
/**
 * change information in the boards modal
 **/
Code.boardDescription = function () {
    var boardValue = document.getElementById("boardDescriptionSelector").value;
    if (boardValue === '')
        boardValue = 'none';
    document.getElementById("arduino_board_mini_picture").setAttribute("src", profile[boardValue]['picture']);
    document.getElementById("board_connect").textContent = profile[boardValue]['usb'];
    document.getElementById("board_cpu").textContent = profile[boardValue]['cpu'];
    document.getElementById("board_voltage").textContent = profile[boardValue]['voltage'];
    document.getElementById("board_inout").textContent = profile[boardValue]['inout'];

};
/**
 * Undo/redo functions
 */
Code.Undo = function () {
    Blockly.getMainWorkspace().undo(0);
};
Code.Redo = function () {
    Blockly.getMainWorkspace().undo(1);
};

/**
 * Creates an INO file containing the Arduino code from the Blockly workspace and
 * prompts the users to save it into their local file system.
 */
Code.saveCodeFile = function () {
    var utc = new Date().toJSON().slice(0, 10).replace(/-/g, '_');
    var dataToSave = Blockly.Arduino.workspaceToCode(Blockly.getMainWorkspace());
    var blob = new Blob([dataToSave], {
        type: 'text/plain;charset=utf-8'
    });
    var fileNameSave = prompt(MSG['saveXML_span']);
    if (fileNameSave !== null) {
        var fakeDownloadLink = document.createElement("a");
        fakeDownloadLink.download = fileNameSave + ".ino";
        fakeDownloadLink.href = window.URL.createObjectURL(blob);
        fakeDownloadLink.onclick = function destroyClickedElement(event) {
            document.body.removeChild(event.target);
        };
        fakeDownloadLink.style.display = "none";
        document.body.appendChild(fakeDownloadLink);
        fakeDownloadLink.click();
    }
};

/**
 * Creates an XML file containing the blocks from the Blockly workspace and
 * prompts the users to save it into their local file system.
 */
Code.saveXmlBlocklyFile = function () {
    var xmlData = Blockly.Xml.workspaceToDom(Blockly.getMainWorkspace());
    var dataToSave = Blockly.Xml.domToPrettyText(xmlData);
    var blob = new Blob([dataToSave], {
        type: 'text/xml;charset=utf-8'
    });
    var fileNameSave = prompt(MSG['saveXML_span']);
    if (fileNameSave !== null) {
        var fakeDownloadLink = document.createElement("a");
        fakeDownloadLink.download = fileNameSave + ".bduino";
        fakeDownloadLink.href = window.URL.createObjectURL(blob);
        fakeDownloadLink.onclick = function destroyClickedElement(event) {
            document.body.removeChild(event.target);
        };
        fakeDownloadLink.style.display = "none";
        document.body.appendChild(fakeDownloadLink);
        fakeDownloadLink.click();
    }
};

/**
 * Add or replace a parameter to the URL.
 *
 * @param {string} name The name of the parameter.
 * @param {string} value Value to set
 * @return {string} The url completed with parameter and value
 */
Code.addReplaceParamToUrl = function (url, param, value) {
    var re = new RegExp("([?&])" + param + "=.*?(&|$)", "i");
    var separator = url.indexOf('?') !== -1 ? "&" : "?";
    if (url.match(re)) {
        return url.replace(re, '$1' + param + "=" + value + '$2');
    } else {
        return url + separator + param + "=" + value;
    }
};

/**
 * Creates an XML file containing the blocks from the Blockly workspace and
 * prompts the users to save it into their local file system.
 */
Code.openXmlDialog = function () {
    document.getElementById('loadXMLfile').click();
};

/**
 * Load blocks from local file.
 */
Code.loadXmlBlocklyFile = function (files) {
    // Only allow uploading one file
    if (files.length !== 1) {
        return;
    }
    // FileReader
    var reader = new FileReader();
    reader.onloadend = function (event) {
        var target = event.target;
        // 2 == FileReader.DONE
        if (target.readyState === 2) {
            try {
                var xmlData = Blockly.Xml.textToDom(target.result);
            } catch (e) {
                alert(MSG['loadXML_error_span'] + e);
                return;
            }
            var count = Blockly.getMainWorkspace().getAllBlocks().length;
            if (count && confirm(MSG['loadXML_span'])) {
                Blockly.getMainWorkspace().clear();
            }
            Blockly.Xml.domToWorkspace(xmlData, Blockly.getMainWorkspace());
        }
        var search = window.location.search;
        search = search.replace(/([?&]url=)[^&]*/, '');
        window.location = window.location.protocol + '//'
             + window.location.host + window.location.pathname
             + search;
    };
    // Reset value of input after loading because Chrome will not fire
    // a 'change' event if the same file is loaded again.
    document.getElementById('loadXMLfile').value = '';
    reader.readAsText(files[0], "UTF-8");
    Blockly.getMainWorkspace().render();
};

/**
 * Reset workspace and parameters
 */
Code.ResetWorkspace = function () {
    var count = Blockly.mainWorkspace.getAllBlocks(false).length;
    if (window.confirm(Blockly.Msg['DELETE_ALL_BLOCKS'].replace('%1', count))) {
        Blockly.Events.disable();
        Blockly.getMainWorkspace().clear();
        Blockly.getMainWorkspace().trashcan.contents_ = [];
        Blockly.getMainWorkspace().trashcan.setOpen('false');
        window.removeEventListener('unload', auto_save_and_restore_blocks, false);
        localStorage.clear();
        sessionStorage.clear();
        Code.renderContent();
        Blockly.Events.enable();
    }
    if (window.location.hash) {
        window.location.hash = '';
    }
    window.location = window.location.protocol + '//' + window.location.host + window.location.pathname;
};

/**
 * Change font size in blocks in all workspace
 */
Code.changeRenderingConstant = function (value) {
    var type = document.getElementById('rendering-constant-selector').value;
    if (type === 'fontSize') {
        var fontStyle = {
            'size': value
        };
        Blockly.getMainWorkspace().getTheme().setFontStyle(fontStyle);
    }
    // Refresh theme.
    Blockly.getMainWorkspace().setTheme(Blockly.getMainWorkspace().getTheme());
};
