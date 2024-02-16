const express = require('express');
const os = require('os');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const { execSync } = require('child_process');

const app = express();
const TEMPLATE_DIRECTORY_LOCATION = process.env.TEMPLATE_DIRECTORY_LOCATION ?? "/template/";
const PRIVATE_KEY_LOCATION = process.env.PRIVATE_KEY_LOCATION ?? "/keys/private.key";
const PUBLIC_KEY_LOCATION = process.env.PUBLIC_KEY_LOCATION ?? "/keys/public.key";

app.use(express.text());

app.post("/build/:name", (req, res) => {

    // todo: verify authorization header

    const name = req.params.name;

    const tempDirectory = fs.mkdtempSync(os.tmpdir() + '/');
    try {
        console.log("Received a build request");

        // ... do something with the request
        const sourceFileContents = req.body;

        console.log(`Created temp directory: ${tempDirectory}`)
        console.log("Source file contents: ", sourceFileContents)
        const filesToReplace = [
            'Cargo.lock',
            'package.json',
            'src/Cargo.toml'
        ]
        fs.readdirSync(TEMPLATE_DIRECTORY_LOCATION).forEach(file => {
            console.log(file);
            fs.cpSync(TEMPLATE_DIRECTORY_LOCATION + "/" + file, tempDirectory + '/' + file, {recursive: true});
        })
        for (const fileToReplace of filesToReplace) {
            fs.writeFileSync(
                `${tempDirectory}/${fileToReplace}`,
                fs.readFileSync(
                    `${tempDirectory}/${fileToReplace}`,
                    'utf8'
                ).replaceAll("{{name}}", name)
            )
        }
        fs.writeFileSync(`${tempDirectory}/src/lib.rs`, sourceFileContents);

        const buildResult = execSync(`cd ${tempDirectory} && npm run build`);
        console.log(buildResult.toString());

        fs.readdirSync(tempDirectory + `/target/ink/${name}`).forEach(file => {
            console.log(file);
            if (file.endsWith(".contract")) {
                const fileContents = fs.readFileSync(tempDirectory + `/target/ink/${name}/` + file);
                res.send(fileContents);
            }
        })
    } catch (e) {
        console.error(e);
        res.send(e.toString());
    } finally {
        // clean up
        console.log("Cleaning up temp directory")
        fs.rmSync(tempDirectory, {recursive: true});
    }

    // res.send("Build successful!");

})

app.listen(3000, () => {
    console.log('Server running on port 3000');
})