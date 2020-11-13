/**
 * @license
 * Copyright 2020 Sébastien CANET
 * SPDX-License-Identifier: BSD-3-Clause
 */

/**
 * @fileoverview Utility functions for handling serial communication & plotter.
 * @author scanet@libreduc.cc (Sébastien CANET)
 */
 
var {ipcRenderer, dialog} = require("electron");
var fs = require('fs-extra');

window.addEventListener('load', function load(event) {
    var serialConnected = false;
    // prepare serial window
    var serialConnectSpeedMenu = document.getElementById('serialConnectSpeed_Menu');
    var serialConnectSpeedAvailable = JSON.parse(localStorage.getItem("availableSpeed"));
    serialConnectSpeedAvailable.forEach(function (serialConnectSpeedAvailable) {
        var option = document.createElement('option');
        option.value = serialConnectSpeedAvailable;
        option.text = serialConnectSpeedAvailable;
        serialConnectSpeedMenu.appendChild(option);
    });
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
        let SerialPortToMonitor = new SerialPort(comPortToUse, {
            autoOpen: false,
            baudRate: baud
        });
        var parser = SerialPortToMonitor.pipe(new Readline({ delimiter: '\n' }))
        if (!serialConnected) {
            document.getElementById('btn_serialConnect').innerHTML = MSG['serial_btn_stop'];
            document.getElementById('btn_serialSend').disabled = false;
            SerialPortToMonitor.open(function (err) {
                document.getElementById('serialPeek').innerHTML += MSG['serial_info_start']
                });
            serialConnected = true;
            parser.on('data', function (data) {
				if (serialConnected){
                    document.getElementById('serialSendBox').value = parseInt(data, 10);
                    smoothieChart.start();
                    document.getElementById('serialPeek').innerHTML += data + "<br>";
                    document.getElementById('serialPeek').scrollTop = document.getElementById('serialPeek').scrollHeight;
                    document.getElementById('serialPeek').animate({
                        scrollTop: document.getElementById('serialPeek').scrollHeight
                    });
                }
            });
            smoothieChart.start();
        } else {
            document.getElementById('btn_serialConnect').innerHTML = MSG['serial_btn_start'];
            document.getElementById('btn_serialSend').disabled = true;
            SerialPortToMonitor.close(function (err) {
                document.getElementById('serialPeek').innerHTML += MSG['serial_info_stop'];
            });
            serialConnected = false;
            smoothieChart.stop();
        }
    };
	document.getElementById('btn_serialPeekCSV').onclick = function(event) {
		ipcRenderer.send('save-csv');
		var code = document.getElementById('serialPeek').innerHTML;
		code = code.split('<br>');
        fs.writeFile('./toto.csv', code);
	}
	ipcRenderer.on('saved-csv', function(event, savePath){
		var code = document.getElementById('serialPeek').innerHTML;
		code = code.split('<br>').join('\n');
		if (savePath === null) {
			return;
		} else {
			fs.writeFile(savePath, code, function(err){
				if (err) return console.log(err);
			})
		}
	})
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
