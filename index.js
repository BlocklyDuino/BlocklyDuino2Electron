var { ipcRenderer, shell, clipboard } = require("electron")
var sp = require('serialport')
var fs = require('fs')
var path = require('path')

window.addEventListener('load', function load(event){
	sp.list(function(err,ports){
		var opt = document.createElement('option')
		opt.value = "com"
		opt.text = Blockly.Msg.com1
		portserie.appendChild(opt)
		ports.forEach(function(port) {
			if (port.vendorId){
				var opt = document.createElement('option')
				opt.value = port.comName
				opt.text = port.comName
				portserie.appendChild(opt)
			}
		})
		localStorage.setItem("nb_com",ports.length)
		if (portserie.options.length > 1) {
			portserie.selectedIndex = 1
			localStorage.setItem("com",portserie.options[1].value)
		} else {
			localStorage.setItem("com","com")
		}
	})
	sp.list(function(err,ports){
		var messageUSB = document.getElementById('serialMenu')
		if (ports.length === 0) {
			messageUSB.innerHTML = "Aucun port n'est disponible"
		} else {
		tableHTML = tableify(ports)
		messageUSB.innerHTML = tableHTML
		}
	})
	$('#portserie').mouseover(function(){
		sp.list(function(err,ports) {
			var nb_com = localStorage.getItem("nb_com"), menu_opt = portserie.getElementsByTagName('option')
			if(ports.length > nb_com){
				ports.forEach(function(port){
					if (port.vendorId){
						var opt = document.createElement('option')
						opt.value = port.comName
						opt.text = port.comName
						portserie.appendChild(opt)
						localStorage.setItem("com",port.comName)
					}
				})
				localStorage.setItem("nb_com",ports.length)
				localStorage.setItem("com",portserie.options[1].value)
			}
			if(ports.length < nb_com){
				while(menu_opt[1]) {
					portserie.removeChild(menu_opt[1])
				}
				localStorage.setItem("com","com")
				localStorage.setItem("nb_com",ports.length)
			}
		})
	})
	$('#btn_term').on('click', function(){
		if (portserie.value=="com"){
			$("#message").modal("show")
			messageDiv.style.color = '#000000'
			messageDiv.innerHTML = Blockly.Msg.com2 + quitDiv
			return
		}
		if (localStorage.getItem("prog") == "python") { ipcRenderer.send("repl", "") } else { ipcRenderer.send("prompt", "") }
	})
})