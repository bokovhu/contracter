const path = require('path');
const fs = require('fs');

function copyScript(
    packageName,
    copyAs
) {
    console.log(`Copying ${packageName} to ${copyAs}`);
    const packagePath = path.join(__dirname, `../packages/${packageName}`);
    const indexJsPath = path.join(packagePath, 'index.js');
    const outScriptsPath = path.join(__dirname, './scripts');
    if (!fs.existsSync(outScriptsPath)) {
        fs.mkdirSync(outScriptsPath, { recursive: true });
    }
    const outPath = path.join(outScriptsPath, copyAs);
    fs.copyFileSync(indexJsPath, outPath);
}


copyScript('lib-contact-book', "lib-contact-book.js");
copyScript('lib-contract-registry', "lib-contract-registry.js");
copyScript('lib-contract-deployer', "lib-contract-deployer.js");
copyScript('lib-web3-init', "lib-web3-init.js");
copyScript('lib-contract-editor', "lib-contract-editor.js");
copyScript('lib-code-generator', "lib-code-generator.js");
