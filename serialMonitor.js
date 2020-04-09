var {ipcRenderer} = require("electron");
var remote = require('electron').remote;
var fs = require('fs-extra');

window.addEventListener('load', function load(event) {
    var connexion = false;
    document.getElementById('btn_serialSend').disabled = true;
    document.getElementById('btn_serialPeekClear').onclick = function () {
        document.getElementById('serialPeek').textContent = '';
    };
    document.getElementById('btn_serialSend').onclick = function () {
        var entree = document.getElementById('serialSendBox').value;
        if (SerialPortToMonitor.isOpen) {
            document.getElementById('serialPeek').innerHTML += entree + "<br>";
            SerialPortToMonitor.write(entree);
        }
    };
    document.getElementById('btn_serialConnect').onclick = function (event) {
        var SerialPort = require('serialport');
        var Readline = require('@serialport/parser-readline');
        var moniteur = document.getElementById('serialPeek');
        var baud = parseInt(document.getElementById('serialConnectSpeed_Menu').value);
        var comPortToUse = localStorage.getItem("comPort");
        SerialPortToMonitor = new SerialPort(comPortToUse, {
            baudRate: baud,
            autoOpen: false
        });
        var parser = SerialPortToMonitor.pipe(new Readline({
            delimiter: '\n'
        }));
        if (connexion) {
            document.getElementById('btn_serialConnect').innerHTML = "<span class='fa fa-play'> Démarrer</span>";
            document.getElementById('btn_serialSend').disabled = true;
            SerialPortToMonitor.close(function (err) {
                moniteur.innerHTML += 'arrêt<br>';
            });
            connexion = false;
        } else {
            document.getElementById('btn_serialConnect').innerHTML = "<span class='fa fa-pause'></span> Arrêter";
            document.getElementById('btn_serialSend').disabled = false;
            SerialPortToMonitor.on('open', function () {
                moniteur.innerHTML += 'démarrage de la communication<br>';
            });
            connexion = true;
            SerialPortToMonitor.on('data', function (data) {
                if (connexion) {
                    moniteur.innerHTML += data + "<br>";
                    moniteur.scrollTop = moniteur.scrollHeight;
                    moniteur.animate({
                        scrollTop: moniteur.scrollHeight
                    });
                }
            });
        }
    };
    document.getElementById('btn_serialPeekCSV').onclick = function (event) {
        ipcRenderer.send('save-csv');
    };
    ipcRenderer.on('saved-csv', function (event, path) {
        var code = document.getElementById('serialPeek').innerHTML;
        code = code.split('<br>').join('\n');
        if (path === null) {
            return;
        } else {
            fs.writeFile(path, code, function (err) {
                if (err)
                    return console.log(err);
            });
        }
    });
});
