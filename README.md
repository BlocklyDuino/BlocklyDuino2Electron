# ![enter image description here](https://raw.githubusercontent.com/BlocklyDuino/BlocklyDuino2Electron/master/src/app.png) BlocklyDuino2Electron

Electron version of [BlocklyDuino2](https://github.com/BlocklyDuino/BlocklyDuino-v2), autonomous client, multi OS with uploading integrated. This graphical environment is a free and open source graphic language.

Arduino programs are created by assembling blocks, thanks to drag'n'drop, then result is compiled and uploaded in the board.

This app works just on Windows operating systems, but soon on Linux and MacOS. You can download it in [release section](https://github.com/BlocklyDuino/BlocklyDuino2Electron/releases).


![BlocklyDuinoElectron Screenshot](https://raw.githubusercontent.com/BlocklyDuino/BlocklyDuino2Electron/master/src/screencap.png)

## BlocklyDuino's Demo

BlocklyDuino2 is a simple webware, you can give it a try [here.](https://blocklyduino.github.io/BlocklyDuino-v2/)

You can download it [here](https://github.com/BlocklyDuino/BlocklyDuino-v2) and launch `index.html`.

But for BlocklyDuino2Electron you have to download a version from  [releases](https://github.com/BlocklyDuino/BlocklyDuino2Electron/releases) and launch it from your computer.

## Help and how-to

Wiki available on Github: https://github.com/BlocklyDuino/BlocklyDuino2Electron/wiki

**Ask for help** in the [forum](http://blockly.technologiescollege.fr/forum/).

## How to use by yourself

Clone or [download the source code](https://github.com/BlocklyDuino/BlocklyDuino2Electron/archive/master.zip).

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
> cd BlocklyDuino2Electron-master
> npm install
> npm start
```

### Build

```bash
> npm run compile
```

## Links and thanks

Tools without which nothing would have been possible (*and millions of thanks to their creators!*) :

- [Blockly](https://developers.google.com/blockly)
- [BlocklyDuino](https://github.com/BlocklyDuino/BlocklyDuino)
- [Blockly@rduino](https://github.com/technologiescollege/Blockly-at-rduino)
- [Blocklino](https://github.com/fontainejp/blocklino)
- [STudio4Education](https://github.com/A-S-T-U-C-E/STudio4Education)
- [Font Awesome](http://fontawesome.io)
- [Node.js](https://nodejs.org/fr/)
- [electron](https://electronjs.org/)
- [electron-builder](https://github.com/electron-userland/electron-builder)
- [Serialport](https://github.com/node-serialport/node-serialport)
- [Arduino-cli](https://github.com/arduino/arduino-cli)
