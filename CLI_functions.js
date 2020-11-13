/**
 * @license
 * Copyright 2020 Sébastien CANET
 * SPDX-License-Identifier: GPL-3.0
 */

/**
 * @fileoverview Arduino CLI control.
 * @author scanet@libreduc.cc (Sébastien CANET)
 */
 
const {ipcRenderer} = require('electron');
const {exec} = require('child_process');
const fs = require('fs-extra');

window.addEventListener('load', function load(event) {
    document.getElementById('coreUpdateButton').onclick = function (event) {
        document.getElementById('content_serial').style.color = '#00FF00';
        document.getElementById('content_serial').innerHTML = MSG['coreUpdateButton_msg'];
        var cmd = 'arduino-cli.exe core update-index';
        exec(cmd, {
            cwd: './compiler'
        }, (error, stdout, stderr) => {
            if (error) {
                document.getElementById('content_serial').style.color = '#FF0000';
                document.getElementById('content_serial').innerHTML = stderr;
                return;
            }
            document.getElementById('content_serial').style.color = '#00FF00';
            document.getElementById('content_serial').innerHTML = stdout;
        });
    };
    document.getElementById('cleanCLIcacheButton').onclick = function (event) {
        var file_path = '.\\tmp';
        document.getElementById('content_serial').style.color = '#00FF00';
        document.getElementById('content_serial').innerHTML = MSG['cleanCLIcacheButton_msg'];
        fs.remove(file_path, err => {
            recursive: true;
            if (err) {
                return console.log(err);
                document.getElementById('content_serial').style.color = '#FF0000';
                document.getElementById('content_serial').innerHTML = MSG['cleanCLIcacheButton_error_msg'];

            } else {
                document.getElementById('content_serial').style.color = '#00FF00';
                document.getElementById('content_serial').innerHTML = MSG['cleanCLIcacheButton_success_msg'];
            }
        });
    };
    document.getElementById('listBoardsButton').onclick = function (event) {
        var cmd = 'arduino-cli.exe board list';
        document.getElementById('content_serial').style.color = '#00FF00';
        document.getElementById('content_serial').innerHTML = MSG['listBoardsButton_msg'];
        exec(cmd, {
            cwd: './compiler'
        }, (error, stdout, stderr) => {
            if (error) {
                document.getElementById('content_serial').style.color = '#FF0000';
                document.getElementById('content_serial').innerHTML = stderr;
                document.getElementById('content_serial').scrollTop = stderr.offsetHeight + stderr.offsetTop;
                return;
            }
            document.getElementById('content_serial').style.color = '#00FF00';
            document.getElementById('content_serial').innerHTML = stdout;
            document.getElementById('content_serial').scrollTop = stdout.offsetHeight + stdout.offsetTop;
        });
    };
    document.getElementById('installBoardsButton').onclick = function (event) {
        var cmd = 'arduino-cli.exe core install "' + document.getElementById("installBoardsInput").value + '"';
        document.getElementById('content_serial').style.color = '#00FF00';
        document.getElementById('content_serial').innerHTML = MSG['installBoardsButton_msg'];
        exec(cmd, {
            cwd: './compiler'
        }, (error, stdout, stderr) => {
            if (error) {
                document.getElementById('content_serial').style.color = '#FF0000';
                document.getElementById('content_serial').innerHTML = stderr;
                document.getElementById('content_serial').scrollTop = stderr.offsetHeight + stderr.offsetTop;
                return;
            }
            document.getElementById('content_serial').style.color = '#00FF00';
            document.getElementById('content_serial').innerHTML = stdout;
            document.getElementById('content_serial').scrollTop = stdout.offsetHeight + stdout.offsetTop;
        });
    };
    document.getElementById('searchlLibButton').onclick = function (event) {
        var cmd = 'arduino-cli.exe lib search "' + document.getElementById("searchlLibInput").value + '"';
        document.getElementById('content_serial').style.color = '#00FF00';
        document.getElementById('content_serial').innerHTML = MSG['searchlLibButton_msg'];
        exec(cmd, {
            cwd: './compiler'
        }, (error, stdout, stderr) => {
            if (error) {
                document.getElementById('content_serial').style.color = '#FF0000';
                document.getElementById('content_serial').innerHTML = stderr;
                document.getElementById('content_serial').scrollTop = stderr.offsetHeight + stderr.offsetTop;
                return;
            }
            document.getElementById('content_serial').style.color = '#00FF00';
            document.getElementById('content_serial').innerHTML = stdout;
            document.getElementById('content_serial').scrollTop = stdout.offsetHeight + stdout.offsetTop;
        });
    };
    document.getElementById('installLibButton').onclick = function (event) {
        var cmd = 'arduino-cli.exe lib install "' + document.getElementById("installLibInput").value + '"';
        document.getElementById('content_serial').style.color = '#00FF00';
        document.getElementById('content_serial').innerHTML = MSG['installLibButton_msg'];
        exec(cmd, {
            cwd: './compiler'
        }, (error, stdout, stderr) => {
            if (error) {
                document.getElementById('content_serial').style.color = '#FF0000';
                document.getElementById('content_serial').innerHTML = stderr;
                document.getElementById('content_serial').scrollTop = stderr.offsetHeight + stderr.offsetTop;
                return;
            }
            document.getElementById('content_serial').style.color = '#00FF00';
            document.getElementById('content_serial').innerHTML = stdout;
            document.getElementById('content_serial').scrollTop = stdout.offsetHeight + stdout.offsetTop;
            //error sent without 'error' in function, need to double instruction
            // document.getElementById('content_serial').style.color = '#FF0000';
            // document.getElementById('content_serial').innerHTML += stderr;
        });
    };
});