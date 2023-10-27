const os = require("os");
const fs = require('fs');

const WindowsUsername = os.userInfo().username;
const DownloadsPath = `C:\\Users\\${WindowsUsername}\\Downloads`;

let extensionVariables = {};
let extensionFolders = {};

function errorHandler(err) {
    console.error(`Error: ${err}`);
};

function getExtension(filename) {
    var name_array = filename.split(".");
    return name_array[name_array.length - 1];
};

try {
    const configFile = fs.readFileSync("config.json", "utf-8");
    const configJSON = JSON.parse(configFile);

    for(const fieldname in configJSON.extensions) {
        if(configJSON.extensions.hasOwnProperty(fieldname)) {
            extensionVariables[fieldname] = configJSON.extensions[fieldname];
        };
    };

    for(const fieldname in configJSON.folderNames) {
        extensionFolders[fieldname] = configJSON.folderNames[fieldname];
    };
} catch(err) {
    errorHandler(err);
};

for(const fieldname in extensionFolders) {
    if(!fs.existsSync(`${DownloadsPath}\\${extensionFolders[fieldname]}`)) {
        fs.mkdirSync(`${DownloadsPath}\\${extensionFolders[fieldname]}`);
    };
};

fs.readdir(DownloadsPath, (err, files) => {
    if(err) {
        errorHandler(err);
    } else {
        files.forEach((file) => {
            const filePath = `${DownloadsPath}\\${file}`;

            fs.stat(filePath, (err, fileStat) => {
                if(err) {
                    errorHandler(err);
                } else {
                    if(fileStat.isFile()) {
                        for(let extensionPack in extensionVariables) {
                            for(let extensionVariable in extensionVariables[extensionPack]) {
                                if(getExtension(file) == extensionVariables[extensionPack][extensionVariable]) {
                                    fs.renameSync(`${DownloadsPath}\\${file}`, `${DownloadsPath}\\${extensionFolders[extensionPack]}\\${file}`);
                                };
                            };
                        };
                    } else if(fileStat.isDirectory()) {
                        if(!Object.values(extensionFolders).includes(file)) {
                            fs.renameSync(`${DownloadsPath}\\${file}`, `${DownloadsPath}\\Folders\\${file}`);
                        }
                    };
                };
            });
        });
    };
});