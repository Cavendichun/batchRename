#!/usr/bin/env node
const fs = require('fs');
const colors = require('colors');
const path = require('path');
const inquirer = require('inquirer');

// checkArgs();

// function checkArgs() {
//获取命令行参数
const [execPath, mainFilePath, additionalArgs] = process.argv;
//如果不带参数
if (additionalArgs !== '.') {
    console.log('\nTo execute the instructions, enter batchrename .\n'.red);
    return false;
} else {
    //获取所在路径
    const currentPath = process.cwd();
    //获取所有子文件或子文件夹名， 排除掉文件夹
    const childFileArr = fs.readdirSync(currentPath).filter(p => !fs.lstatSync(path.resolve(currentPath, p)).isDirectory());
    console.log('\nFolders in the directory have been excluded\n'.green);
    //询问
    console.log(currentPath.green);
    new Promise((resolve, reject) => {
        inquirer.prompt([
            {
                type: 'confirm',
                message: 'Is this path correct?',
                name: 'confirmPath'
            },
            {
                type: 'input',
                message: 'Please enter a prefix for the filename, and must include a $ symbol in the name to be replaced by a number.',
                name: 'prefix',
                when: function (answers) {
                    return answers.confirmPath === true;
                },
                validate: function (val) {
                    if (val.match(/\$/g) == null) {
                        return 'Please include a $ symbol in the name to be replaced by a number.'
                    } else {
                        return true;
                    }
                }
            }
        ]).then((res) => {
            const { confirmPath, prefix } = res;
            if (confirmPath === true) {
                startRename(prefix, currentPath, childFileArr);
            }
        })
    })
}

function startRename(prefix, currentPath, childFilename) {
    let errlist = [];
    childFilename.map((p, i) => {
        fs.renameSync(
            path.resolve(currentPath, p),
            path.resolve(currentPath, prefix.replace(/\$/g, i) + path.extname(p)),
            function (err) {
                errlist.push(err);
            }
        )
    })
    if (errlist.length === 0) {
        console.log('Rename Success !!!'.green);
    } else {
        console.log('Rename unsuccess !!!'.red);
    }
}