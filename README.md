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

## ChangeLog

Check changelog [here](https://github.com/BlocklyDuino/BlocklyDuino2Electron/blob/master/CHANGELOG.txt)

## Tools used

[Ace editor](https://ace.c9.io)

[Arduino-CLI](https://github.com/arduino/arduino-cli)

[Electron](https://www.electronjs.org/)

[Node SerialPort](https://serialport.io/)


## Authors and Contributors

Sébastien Canet ([scanet@libreduc.cc](scanet@libreduc.cc)).

The BlocklyDuino2 project is also inspired by [Blockly@rduino](https://github.com/technologiescollege/Blockly-at-rduino), [ardublockly](https://github.com/carlosperate/ardublockly), [Blocklino](https://github.com/fontainejp/blocklino) and [STudio4Education](https://github.com/A-S-T-U-C-E/S4E_Electron).


## License

Copyright (C) 2020 Sébastien Canet scanet@libreduc.cc
-   Licensed under the GNU General Public License v3.0.
-   You may not use this project or any file except in compliance with the License.
-   You may obtain a copy of the License at [https://opensource.org/licenses/GPL-3.0](https://opensource.org/licenses/GPL-3.0).

Code from Blockly is licensed under the Apache 2.0 license.
Code from STudio4Education is licensed under the BSD 3-Clause license.

# arduino-cli

![cli-logo](https://raw.githubusercontent.com/arduino/arduino-cli/master/docs/img/CLI_Logo_small.png)

Arduino CLI is an all-in-one solution that provides builder, boards/library manager,
uploader, discovery and many other tools needed to use any Arduino compatible
board and platforms.

[![tests-badge]](https://github.com/Arduino/arduino-cli/actions?workflow=test)
[![nightly-badge]](https://github.com/Arduino/arduino-cli/actions?workflow=nightly)
[![docs-badge]](https://github.com/Arduino/arduino-cli/actions?workflow=docs)
[![codecov-badge]](https://codecov.io/gh/arduino/arduino-cli)

> **Note:** this software is currently under active development: anything can change
  at any time, API and UI must be considered unstable until we release version 1.0.0.

## Docs

For guidance on installation and development, see the [User documentation](https://arduino.github.io/arduino-cli/latest/).


# Links and thanks

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
