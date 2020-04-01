var { ipcRenderer } = require("electron")
var remote = require('electron').remote 
var fs = require('fs')

window.addEventListener('load', function load(event) {
	var window = remote.getCurrentWindow() 
	var connexion = false
	document.getElementById('btn_serialSend').disabled=true
	document.getElementById('btn_serialPeekClear').onclick = function() {
		document.getElementById('serialPeek').textContent = ''
	}
	document.getElementById('btn_serialSend').onclick = function() {
		var entree = document.getElementById('schbox').value
		if (s_p.isOpen) {
			document.getElementById('serialPeek').innerHTML += entree+"<br>"
			s_p.write(entree)
		}
	}
	document.getElementById('btn_serialConnect').onclick = function(event) {
		var SerialPort = require("serialport")
		var line = require('@serialport/parser-readline')
		var moniteur = document.getElementById('serialPeek')
		var baud = parseInt(localStorage.getItem("baudrate"))
		var com = localStorage.getItem("com")
		s_p = new SerialPort(com,{baudRate:baud, autoOpen:false})
		var parser = s_p.pipe(new line({ delimiter: '\n' }))
		if (connexion){
			document.getElementById('btn_serialConnect').innerHTML="<span class='fa fa-play'> Démarrer</span>"
			document.getElementById('btn_serialSend').disabled=true
			s_p.close(function (err) { moniteur.innerHTML += 'arrêt<br>' })
			connexion = false
		} else {
			document.getElementById('btn_serialConnect').innerHTML="<span class='fa fa-pause'> Arrêter</span>"
			document.getElementById('btn_serialSend').disabled=false
			s_p.open(function (err) { moniteur.innerHTML += 'démarrage de la communication<br>' })
			connexion = true
			parser.on('data', function(data){
				if (connexion){
					moniteur.innerHTML += data + "<br>"
					moniteur.scrollTop = moniteur.scrollHeight;
					moniteur.animate({scrollTop: moniteur.scrollHeight})
				}
			})
		}
	}
	document.getElementById('btn_serialPeekCSV').onclick = function(event) {
		ipcRenderer.send('save-csv')
	}
	ipcRenderer.on('saved-csv', function(event, path){
		var code = document.getElementById('serialPeek').innerHTML
		code = code.split('<br>').join('\n')
		if (path === null) {
			return
		} else {
			fs.writeFile(path, code, function(err){
				if (err) return console.log(err)
			})
		}
	})
})