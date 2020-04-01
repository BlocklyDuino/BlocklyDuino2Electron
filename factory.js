var remote = require('electron').remote 
var { ipcRenderer } = require("electron")
var fs = require('fs')

window.addEventListener('load', function load(event) {
	var window = remote.getCurrentWindow()
	if(!window.isMaximized())window.maximize()
	document.getElementById('btn_quit').onclick = function() {
		window.close()
	}
	document.getElementById('btn_max').onclick = function() {
		if(window.isMaximized()){
            window.unmaximize()
			document.getElementById('btn_max').innerHTML="<span class='fa fa-window-maximize fa-lg'></span>"
        }else{
            window.maximize()
			document.getElementById('btn_max').innerHTML="<span class='fa fa-window-restore fa-lg'></span>"
        }
	}
	document.getElementById('btn_add').onclick = function(){
		var dataB = document.getElementById('languagePre').textContent
		var dataG = editor.getValue()
		fs.writeFileSync('./www/blocs&generateurs/factory/add.js', dataB + "\n" + dataG)
		localStorage.setItem("factoryBlock",blockType)
		ipcRenderer.send("addBlock", blockType)
		window.close()
	}
})