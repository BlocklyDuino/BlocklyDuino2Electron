var {ipcRenderer} = require("electron");
var {dialog} = require("electron").remote;
var fs = require('fs-extra');

window.addEventListener('load', function load(event) {
    // prepare serial window
    var serialConnectSpeedMenu = document.getElementById('serialConnectSpeed_Menu');
    var serialConnectSpeedAvailable = JSON.parse(localStorage.getItem("availableSpeed"));
    serialConnectSpeedAvailable.forEach(function (serialConnectSpeedAvailable) {
        var option = document.createElement('option');
        option.value = serialConnectSpeedAvailable;
        option.text = serialConnectSpeedAvailable;
        serialConnectSpeedMenu.appendChild(option);
    });
    var connexion = false;
    var graph = false;
    document.getElementById('btn_serialSend').disabled = true;
    document.getElementById('btn_serialPeekClear').onclick = function () {
        document.getElementById('serialPeek').textContent = '';
        line0.data = [];
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
            document.getElementById('btn_serialConnect').innerHTML = MSG['serial_btn_start'];
            document.getElementById('btn_serialSend').disabled = true;
            SerialPortToMonitor.close(function (err) {
                document.getElementById('serialPeek').innerHTML += MSG['serial_info_stop'];
            });
            connexion = false;
            smoothieChart.stop();
        } else {
            SerialPortToMonitor = new SerialPort(comPortToUse, {
                baudRate: baud
            });
            const parser = new Readline({
                delimiter: '\n'
            });
            SerialPortToMonitor.pipe(parser);
            document.getElementById('btn_serialConnect').innerHTML = MSG['serial_btn_stop'];
            document.getElementById('btn_serialSend').disabled = false;
            SerialPortToMonitor.on('open', function () {
                document.getElementById('serialPeek').innerHTML += MSG['serial_info_start'];
                parser.on('data', function (data) {
                    document.getElementById('serialSendBox').value = parseInt(data, 10);
                    smoothieChart.start();
                    document.getElementById('serialPeek').innerHTML += data + "<br>";
                    document.getElementById('serialPeek').scrollTop = document.getElementById('serialPeek').scrollHeight;
                    document.getElementById('serialPeek').animate({
                        scrollTop: document.getElementById('serialPeek').scrollHeight
                    });
                });
            });
            connexion = true;
            smoothieChart.start();
        }
    };
    document.getElementById('btn_serialPeekCSV').onclick = function () {
        dialog.showSaveDialog(window, {
            title: MSG['serial_CSV'],
            defaultPath: 'Programme',
            filters: [{
                    name: 'data',
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
    document.getElementById('btn_serialChart').onclick = function () {
        if (!graph) {
            document.getElementById('serialPeek').style.width = "120px";
            document.getElementById('serialGraphWindow').style.display = 'block';
            graph = true;
        } else {
            document.getElementById('serialPeek').style.width = "610px";
            document.getElementById('serialGraphWindow').style.display = 'none';
            graph = false;
        }
    };
});
