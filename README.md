
# <img src="https://raw.githubusercontent.com/BlocklyDuino/BlocklyDuinoElectron/master/src/app.png" alt="BlockyDuino icon"> BlocklyDuino2Electron

Electron version of BlocklyDuino2, autonomous client, multi OS with uploading integrated, this graphical environment is free and open source graphic language.

Arduino programs are created by assembling blocks, thanks to drag'n'drop, then result is compiled and uploaded in the board.

This app works just on Windows operating systems, but soon on Linux and MacOS. You can download it in [release section](https://github.com/BlocklyDuino/BlocklyDuinoElectron/releases).


![BlocklyDuinoElectron Screenshot](https://github.com/BlocklyDuino/BlocklyDuinoElectron/blob/master/src/screencap.png)

## Demo

BlocklyDuino2 is a simple webware, you can give it a try [here.](https://blocklyduino.github.io/BlocklyDuino-v2/)

You can download it [here](https://github.com/BlocklyDuino/BlocklyDuino-v2) and launch 'index.html'.

But for BlocklyDuino2Electron you have to download a version from  [releases](https://github.com/BlocklyDuino/BlocklyDuino2Electron/releases) and launch it from your computer.

**Ask for help** in the [forum](http://blockly.technologiescollege.fr/forum/).

## How to use by yourself

Clone or [download the source code](https://github.com/BlocklyDuino/BlocklyDuinoElectron/archive/master.zip).

### Requirements

You'll need [Node.js](https://nodejs.org) installed on your computer.

Install all required tools (as Administrator or sudo):

 - tools for compiling on Windows

``` bash
> npm install -g windows-build-tools
```

 - addon build tool

``` bash
> npm install -g node-gyp
```

### Getting Started 

```bash
> cd BlocklyDuinoElectron-master
> electron .
```

### Build

```bash
> npx electron-builder
```

## Links and thanks

Tools without which nothing would not have been possible :

- [Blocklino](https://github.com/fontainejp/blocklino)
- [Blockly@rduino](https://github.com/technologiescollege/Blockly-at-rduino)
- [BlocklyDuino](https://github.com/BlocklyDuino/BlocklyDuino)
- [Blockly](https://developers.google.com/blockly)
- [Font Awesome](http://fontawesome.io)
- [Node.js](https://nodejs.org/fr/)
- [electron](https://electronjs.org/)
- [electron-builder](https://github.com/electron-userland/electron-builder)
- [Serialport](https://github.com/node-serialport/node-serialport)
- [Arduino-cli](https://github.com/arduino/arduino-cli)
