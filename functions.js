/* fake IDE code Arduino
 ** serialMenu: serial port list
 ** serialConnectButton: open modal with serial console
 ** verifyButton: verify and compile in hex file
 ** uploadButton: upload hex file in Arduino board
 */
const {
    ipcRenderer
} = require('electron');
const { exec } = require('child_process');
const fs = require('fs-extra')
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
        ipcRenderer.send("serialConnect", "")
    })
	document.getElementById('verifyButton').onclick = function(event) {
		try {
			fs.accessSync('.\\arduino\\tmp', fs.constants.W_OK)
			} catch (err) {
				fs.mkdirSync('.\\arduino\\tmp', { recursive: false }, (err) => {
					if (err) throw err
					})
		}
		var file_path = '.\\tmp'
		var file = '.\\arduino\\tmp\\tmp.ino'
		var data = document.getElementById('content_code').innerText
		var boardSelected = document.getElementById('boardMenu').value
		if (boardSelected != "none") {
			document.getElementById('content_serial').style.color = '#ffffff'
			document.getElementById('content_serial').innerHTML = 'Carte ' + profile.default['description']
			var upload_arg = profile.default['upload_arg']
			} else {
				document.getElementById('content_serial').style.color = '#ff0000'
				document.getElementById('content_serial').innerHTML = 'S�lectionner une carte !'
				return
		}
		/*if ($('#detailedCompilation').prop('checked'))
				var cmd = 'arduino-cli.exe --debug compile --fqbn ' + upload_arg + ' ' + file_path
			else*/
				var cmd = 'arduino-cli.exe compile --fqbn ' + upload_arg + ' ' + file_path
		fs.writeFile(file, data, (err) => {
			if (err) return console.log(err)
		});
		document.getElementById('content_serial').innerHTML += '\nV�rification : en cours...\n' + '<i class="fa fa-spinner fa-pulse fa-1_5x fa-fw"></i>'
		exec(cmd , {cwd: './arduino'} , (error, stdout, stderr) => {
			if (error) {
				document.getElementById('content_serial').style.color = '#ff0000'
				document.getElementById('content_serial').innerHTML = stderr
				return
			}
			document.getElementById('content_serial').style.color = '#00ff00'
			document.getElementById('content_serial').innerHTML = stdout + '\nV�rification : OK'
		})
	}
	document.getElementById('uploadButton').onclick = function(event) {
		var file_path = '.\\tmp'
		var boardSelected = document.getElementById('boardMenu').value
		var com = document.getElementById('serialMenu').value
		if (boardSelected === "none"){
			document.getElementById('content_serial').style.color = '#ff0000'
			document.getElementById('content_serial').innerHTML = 'S�lectionner une carte !'
			return
			} else {
				if (com=="no_com"){
				document.getElementById('content_serial').style.color = '#ff0000'
				document.getElementById('content_serial').innerHTML = 'S�lectionner un port !'
				return
				} else {
					document.getElementById('content_serial').style.color = '#ffffff'
					document.getElementById('content_serial').innerHTML = 'Carte ' + profile.default['description'] + ' sur port ' + com
					var upload_arg = profile.default['upload_arg']
				}
		}
		/*if ($('#detailedCompilation').prop('checked'))
				var cmd = 'arduino-cli.exe --debug upload -p ' + com + ' --fqbn ' + upload_arg + ' ' + file_path
			else*/
				var cmd = 'arduino-cli.exe upload -p ' + com + ' --fqbn ' + upload_arg + ' ' + file_path
		document.getElementById('content_serial').innerHTML = 'Carte ' + profile.default['description'] + ' sur port ' + com
		document.getElementById('content_serial').innerHTML += '\nT�l�versement : en cours...\n' + '<i class="fa fa-spinner fa-pulse fa-1_5x fa-fw"></i>'
		console.log(cmd)
		exec(cmd , {cwd: './arduino'} , (error, stdout, stderr) => {
			if (error) {
				document.getElementById('content_serial').style.color = '#ff0000'
				document.getElementById('content_serial').innerHTML = stderr
				return
			}
			document.getElementById('content_serial').style.color = '#00ff00'
			document.getElementById('content_serial').innerHTML = stdout + '\nT�l�versement : OK'
			const path = require('path')
			fs.readdir('.\\arduino\\tmp', (err, files) => {
			  if (err) throw err;
			  for (const file of files) {
				fs.unlink(path.join('.\\arduino\\tmp', file), err => {
				  if (err) throw err
				})
			  }
			})
		})
	}
});