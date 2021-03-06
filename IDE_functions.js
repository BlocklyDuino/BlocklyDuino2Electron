﻿/**
 * @license
 * Copyright 2020 Sébastien CANET
 * SPDX-License-Identifier: GPL-3.0
 */

/**
 * @fileoverview Utility functions for handling typed variables.
 * fake IDE code Arduino
 * boardSelector: boards list
 * serialMenu: serial port list
 * serialConnectButton: open modal with serial console
 * verifyButton: verify and compile in hex file
 * uploadButton: upload hex file in Arduino board
 * @author scanet@libreduc.cc (Sébastien CANET)
 */

const {ipcRenderer} = require('electron');
const {exec} = require('child_process');
const fs = require('fs-extra');
const tableify = require('tableify')
const SerialPort = require('serialport');

//populate COM port modal with all com port detected on system
document.getElementById('serialButton').addEventListener("mouseover", function (event) {
    SerialPort.list().then(ports => {
        let portsList = ports.map(function(obj) {
            return {
                path: obj.path,
                manufacturer: obj.manufacturer,
                vendorId: obj.vendorId,
                productId: obj.productId
            }
        });
        if (portsList.length === 0) {
            document.getElementById('portListModalBody').innerHTML = "Aucun port n'est disponible";
        } else {
            document.getElementById('portListModalBody').innerHTML = tableify(portsList);
        }
    })
});

//COM port list inside the modal
document.getElementById('serialMenu').addEventListener("mouseover", function (event) {
    SerialPort.list().then(ports => {
        document.getElementById('serialMenu').options.length = 0;
        ports.forEach(function (port) {
            var option = document.createElement('option');
            option.value = port.path;
            option.text = port.path;
            document.getElementById('serialMenu').appendChild(option);
        });
    });
});

window.addEventListener('load', function load(event) {
    document.getElementById('verifyButton').onclick = function (event) {
        try {
            fs.accessSync('.\\compiler\\tmp', fs.constants.W_OK);
        } catch (err) {
            fs.mkdirSync('.\\compiler\\tmp', {
                recursive: false
            }, (err) => {
                if (err)
                    throw err;
            });
        }
        var file_path = '.\\tmp';
        var file = '.\\compiler\\tmp\\tmp.ino';
        var data = document.getElementsByClassName("ace_content")[0].innerText;
        var boardSelected = document.getElementById('boardMenu').value;
        if ((boardSelected == "none") || (boardSelected == "...") || (boardSelected == "") || (boardSelected == "undefined")) {
            document.getElementById('content_serial').style.color = '#FF0000';
            document.getElementById('content_serial').innerHTML = MSG['IDE_select_board'];
            return;
        } else {
            document.getElementById('content_serial').style.color = '#FFFFFF';
            document.getElementById('content_serial').innerHTML = MSG['IDE_upload1'] + profile.default['description'];
            var upload_arg = profile.default['upload_arg'];
            if (document.getElementById('detailedCompilation').checked === true)
                var cmd = 'arduino-cli.exe compile -v -b ' + upload_arg + ' ' + file_path;
            else
                var cmd = 'arduino-cli.exe compile -b ' + upload_arg + ' ' + file_path;

            fs.writeFile(file, data, (err) => {
                if (err)
                    return console.log(err);
            });
            document.getElementById('content_serial').innerHTML += '<br>' + MSG['IDE_verif_progress'];
            exec(cmd, {
                cwd: './compiler'
            }, (error, stdout, stderr) => {
                if (error) {
                    document.getElementById('content_serial').style.color = '#FF0000';
                    document.getElementById('content_serial').innerHTML = stderr;
                    return;
                }
                document.getElementById('content_serial').style.color = '#00FF00';
                document.getElementById('content_serial').innerHTML = stdout + '<br>' + MSG['IDE_verif_ok'];
            });
        }
    };
    document.getElementById('uploadButton').onclick = function (event) {
        var file_path = '.\\tmp';
        var boardSelected = document.getElementById('boardMenu').value;
        var comPortSelected = document.getElementById('serialMenu').value;
        if ((boardSelected == "none") || (boardSelected == "...") || (boardSelected == "") || (boardSelected == "undefined")) {
            document.getElementById('content_serial').style.color = '#FF0000';
            document.getElementById('content_serial').innerHTML = MSG['IDE_select_board'];
            return;
        } else {
            if (comPortSelected === "none") {
                document.getElementById('content_serial').style.color = '#FF0000';
                document.getElementById('content_serial').innerHTML = MSG['IDE_select_port'];
                return;
            } else {
                document.getElementById('content_serial').style.color = '#FFFFFF';
                document.getElementById('content_serial').innerHTML = MSG['IDE_upload1'] + profile.default['description'] + MSG['IDE_upload2'] + comPortSelected;
                document.getElementById('content_serial').innerHTML += '<br>' + MSG['IDE_upload3'];
                var upload_arg = profile.default['upload_arg'];
            }
        }
        if (document.getElementById('detailedCompilation').checked === true)
            var cmd = 'arduino-cli.exe upload -v -p ' + comPortSelected + ' -b ' + upload_arg + ' ' + file_path;
        else
            var cmd = 'arduino-cli.exe upload -p ' + comPortSelected + ' -b ' + upload_arg + ' ' + file_path;
        exec(cmd, {
            cwd: './compiler'
        }, (error, stdout, stderr) => {
            if (error) {
                document.getElementById('content_serial').style.color = '#FF0000';
                document.getElementById('content_serial').innerHTML = stderr;
                return;
            }
            document.getElementById('content_serial').style.color = '#00FF00';
            document.getElementById('content_serial').innerHTML = stdout + '<br>' + MSG['IDE_upload_ok'];
            const path = require('path');
            fs.readdir('.\\compiler\\tmp', (err, files) => {
                if (err)
                    throw err;
                for (const file of files) {
                    fs.unlink(path.join('.\\compiler\\tmp', file), err => {
                        if (err)
                            throw err;
                    });
                }
            });
        });
    };
    document.getElementById('serialConnectButton').addEventListener('click', function () {
        var langChoice = document.getElementById('languageMenu').value;
        var boardSelected = document.getElementById('boardMenu').value;
        var comPortSelected = document.getElementById('serialMenu').value;
        if ((boardSelected == "none") || (boardSelected == "...") || (boardSelected == "") || (boardSelected == "undefined")) {
            document.getElementById('content_serial').style.color = '#FF0000';
            document.getElementById('content_serial').innerHTML = MSG['IDE_select_board'];
            return;
        } else if (comPortSelected === "none") {
                document.getElementById('content_serial').style.color = '#FF0000';
                document.getElementById('content_serial').innerHTML = MSG['IDE_select_port'];
                return;
            } else {
                document.getElementById('content_hoverButton').style.color = '#FFFFFF';
                document.getElementById('content_hoverButton').innerHTML = MSG['IDE_connect'] + comPortSelected;
                localStorage.setItem("comPort", comPortSelected);
                localStorage.setItem("availableSpeed", JSON.stringify(profile.default['serialList']));
                ipcRenderer.send("serialConnect", langChoice);
        }
    });
    document.getElementById('wiringButton').addEventListener('click', function () {
  		// var val = location.search.match(new RegExp('[?&]lang=([^&]+)'));
  		// var argLangChoice = val ? decodeURIComponent(val[1].replace(/\+/g, '%20')) : 'en';
        var langChoice = document.getElementById('languageMenu').value;
        ipcRenderer.send("hackCable", langChoice);
    });
    document.getElementById('factoryButton').addEventListener('click', function () {
  		// var val = location.search.match(new RegExp('[?&]lang=([^&]+)'));
  		// var argLangChoice = val ? decodeURIComponent(val[1].replace(/\+/g, '%20')) : 'en';
        var langChoice = document.getElementById('languageMenu').value;
        ipcRenderer.send("blockFactory", langChoice);
    });
    document.getElementById('htmlButton').addEventListener('click', function () {
  		// var val = location.search.match(new RegExp('[?&]lang=([^&]+)'));
  		// var argLangChoice = val ? decodeURIComponent(val[1].replace(/\+/g, '%20')) : 'en';
        var langChoice = document.getElementById('languageMenu').value;
        ipcRenderer.send("blocklyHTML", langChoice);
    });
});