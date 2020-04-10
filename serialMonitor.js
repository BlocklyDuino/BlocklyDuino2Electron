var {ipcRenderer} = require("electron");
var {dialog } = require("electron").remote;
var fs = require('fs-extra');

window.addEventListener('load', function load(event) {
    var connexion = false;
    document.getElementById('btn_serialSend').disabled = true;
    document.getElementById('btn_serialPeekClear').onclick = function () {
        document.getElementById('serialPeek').textContent = '';
    };
    document.getElementById('btn_serialSend').onclick = function () {
        var input = document.getElementById('serialSendBox').value;
        if (SerialPortToMonitor.isOpen) {
            document.getElementById('serialPeek').innerHTML += input + "<br>";
            SerialPortToMonitor.write(input);
        }
    };
    document.getElementById('btn_serialConnect').onclick = function () {
        const SerialPort = require('serialport');
        const Readline = require('@serialport/parser-readline');
        var baud = parseInt(document.getElementById('serialConnectSpeed_Menu').value);
        var comPortToUse = localStorage.getItem("comPort");
        if (connexion) {
            document.getElementById('btn_serialConnect').innerHTML = "<span class='fa fa-play'></span> Démarrer";
            document.getElementById('btn_serialSend').disabled = true;
            SerialPortToMonitor.close(function (err) {
                document.getElementById('serialPeek').innerHTML += 'arrêt<br>';
            });
            connexion = false;
        } else {
            SerialPortToMonitor = new SerialPort(comPortToUse, {
                    baudRate: baud
                });
            const parser = new Readline({
                    delimiter: '\n'
                });
            SerialPortToMonitor.pipe(parser);
            document.getElementById('btn_serialConnect').innerHTML = "<span class='fa fa-pause'></span> Arrêter";
            document.getElementById('btn_serialSend').disabled = false;
            SerialPortToMonitor.on('open', function () {
                document.getElementById('serialPeek').innerHTML += 'démarrage de la communication<br>';
                parser.on('data', function (data) {
                    document.getElementById('serialPeek').innerHTML += data + "<br>";
                    document.getElementById('serialPeek').scrollTop = document.getElementById('serialPeek').scrollHeight;
                    document.getElementById('serialPeek').animate({
                        scrollTop: document.getElementById('serialPeek').scrollHeight
                    });
                });
            });
            connexion = true;
        }
    };
    document.getElementById('btn_serialPeekCSV').onclick = function () {
        dialog.showSaveDialog(window, {
            title: 'Exporter les données au format CSV',
            defaultPath: 'Programme',
            filters: [{
                    name: 'donnees',
                    extensions: ['csv']
                }
            ]
        },
            function (result) {
            var code = document.getElementById('fenetre_term').innerHTML
                code = code.split('<br>').join('\n')
                if (result === null) {
                    return
                } else {
                    fs.writeFile(result, code, function (err) {
                        if (err)
                            return console.log(err)
                    })
                }
        })
    };
});
