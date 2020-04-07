/* fake IDE code Arduino
 ** boardMenu: Arduino boards list
 ** serialMenu: serial port list
 ** serialConnectButton: open modal with serial console
 ** verifyButton: verify and compile in hex file
 ** uploadButton: upload hex file in Arduino board
 */
const {
    ipcRenderer
} = require('electron');
const {
    exec
} = require('child_process');
const fs = require('fs-extra');
const SerialPort = require('serialport');

var serialPortsMenu = document.getElementById('serialMenu');

serialPortsMenu.addEventListener("mouseover", function (event) {
    SerialPort.list().then(ports => {
        serialPortsMenu.options.length = 0;
        ports.forEach(function (port) {
            var option = document.createElement('option');
            option.value = port.path;
            option.text = port.path + ' ' + port.manufacturer;
            serialPortsMenu.appendChild(option);
        });
    });
});

window.addEventListener('load', function load(event) {
    document.getElementById('serialConnectButton').addEventListener('click', function () {
        var comPortSelected = document.getElementById('serialMenu').value;
        if (comPortSelected != "none" && comPortSelected != "" && comPortSelected != "undefined") {
            localStorage.setItem("comPort", comPortSelected);
            ipcRenderer.send("serialConnect", "");
            document.getElementById('content_hoverButton').style.color = '#FFFFFF';
            document.getElementById('content_hoverButton').innerHTML = MSG['IDE_connect'] + comPortSelected;
        } else {
            document.getElementById('content_hoverButton').style.color = '#FFFFFF';
            document.getElementById('content_hoverButton').innerHTML = MSG['IDE_select_port'];
            return
        }
    });
    document.getElementById('verifyButton').onclick = function (event) {
        try {
            fs.accessSync('.\\arduino\\tmp', fs.constants.W_OK);
        } catch (err) {
            fs.mkdirSync('.\\arduino\\tmp', {
                recursive: false
            }, (err) => {
                if (err)
                    throw err;
            });
        }
        var file_path = '.\\tmp';
        var file = '.\\arduino\\tmp\\tmp.ino';
        var data = document.getElementById('content_code').innerText;
        var boardSelected = document.getElementById('boardMenu').value;
        if (boardSelected !== "none" && boardSelected !== "" && boardSelected !== "undefined") {
            document.getElementById('content_serial').style.color = '#FFFFFF';
            document.getElementById('content_serial').innerHTML = 'Carte ' + profile.default['description'];
        } else {
            document.getElementById('content_serial').style.color = '#FF0000';
            document.getElementById('content_serial').innerHTML = MSG['IDE_select_board'];
            return;
        }
        if (document.getElementById('detailedCompilation').prop('checked'))
            var cmd = 'arduino-cli.exe --debug compile --fqbn ' + upload_arg + ' ' + file_path;
        else
            var cmd = 'arduino-cli.exe compile --fqbn ' + upload_arg + ' ' + file_path;
        
        fs.writeFile(file, data, (err) => {
            if (err)
                return console.log(err);
        });
        document.getElementById('content_serial').innerHTML += MSG['IDE_verif_progress'];
        exec(cmd, {
            cwd: './arduino'
        }, (error, stdout, stderr) => {
            if (error) {
                document.getElementById('content_serial').style.color = '#FF0000';
                document.getElementById('content_serial').innerHTML = stderr;
                return;
            }
            document.getElementById('content_serial').style.color = '#00FF00';
            document.getElementById('content_serial').innerHTML = stdout + MSG['IDE_verif_ok'];
        });
    };
    document.getElementById('uploadButton').onclick = function (event) {
        var file_path = '.\\tmp';
        var boardSelected = document.getElementById('boardMenu').value;
        var comPortSelected = document.getElementById('serialMenu').value;
        if (boardSelected === "none") {
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
                document.getElementById('content_serial').innerHTML = MSG['IDE_upload1'] + profile.default['description'] + MSG['IDE_upload2'] + com;
                document.getElementById('content_serial').innerHTML += MSG['IDE_upload3'];
                var upload_arg = profile.default['upload_arg'];
            }
        }
        if (document.getElementById('detailedCompilation').prop('checked'))
            var cmd = 'arduino-cli.exe --debug upload -p ' + comPortSelected + ' --fqbn ' + upload_arg + ' ' + file_path;
        else
            var cmd = 'arduino-cli.exe upload -p ' + comPortSelected + ' --fqbn ' + upload_arg + ' ' + file_path;
        console.log(cmd);
        exec(cmd, {
            cwd: './arduino'
        }, (error, stdout, stderr) => {
            if (error) {
                document.getElementById('content_serial').style.color = '#FF0000';
                document.getElementById('content_serial').innerHTML = stderr;
                return;
            }
            document.getElementById('content_serial').style.color = '#00FF00';
            document.getElementById('content_serial').innerHTML = stdout + MSG['IDE_upload_ok'];
            const path = require('path');
            fs.readdir('.\\arduino\\tmp', (err, files) => {
                if (err)
                    throw err;
                for (const file of files) {
                    fs.unlink(path.join('.\\arduino\\tmp', file), err => {
                        if (err)
                            throw err;
                    });
                }
            });
        });
    };
});
