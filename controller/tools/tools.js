const JSZip = require("jszip");
const { DOMParser, XMLSerializer } = require("xmldom");
const path = require("path");

const multer = require('multer');

const fs = require('fs').promises;

const directoryPath = path.join(__dirname, 'public');
// Open the Word document
const readFile = async (path) => {
    const buffer = await fs.readFile(path);

    return buffer;
};
const updateDocProperties = async (file, properties, filename) => {
    // Read the Word file as a ZIP archive
    const zip = await JSZip.loadAsync(file);



    // Open the "docProps/core.xml" file, which contains the document properties
    const coreXml = await zip.file("docProps/core.xml").async("string");
    const coreDoc = new DOMParser().parseFromString(coreXml, "application/xml");

    // Update the document properties
    for (let key in properties) {
        const value = properties[key];
        let element;

        // Select the element based on the key and the appropriate namespace URI
        if (key === "creator") {
            element = coreDoc.getElementsByTagNameNS(
                "http://purl.org/dc/elements/1.1/",
                "creator"
            )[0];
        } else if (key === "lastModifiedBy") {
            element = coreDoc.getElementsByTagNameNS(
                "http://schemas.openxmlformats.org/package/2006/metadata/core-properties",
                "lastModifiedBy"
            )[0];
        } else if (key === "created") {
            element = coreDoc.getElementsByTagNameNS(
                "http://purl.org/dc/terms/",
                "created"
            )[0];
        } else if (key === "modified") {
            element = coreDoc.getElementsByTagNameNS(
                "http://purl.org/dc/terms/",
                "modified"
            )[0];
        }
        (element) ? (element.childNodes[0].nodeValue = value, element.childNodes[0].data = value) : (console.log(`Element not found for key ${key}`))

        // Update the value of the element

    }

    // Save the updated document properties to the ZIP archive
    const serializedXml = new XMLSerializer().serializeToString(coreDoc);
    zip.file("docProps/core.xml", serializedXml);

    // Save the updated Word document
    const updatedFileBuffer = await zip.generateAsync({ type: "nodebuffer" });

    // Save the buffer to a file
    await fs.writeFile(__dirname + `./../../public/files/${filename}`, updatedFileBuffer);
};
// Express route handler for updating document properties



exports.post_docproperties_updator = async (req, res, next) => {
    try {
        const docxfile = req.file;
        if (!docxfile) {
            throw new Error("No file uploaded");
        }
        const { creator, lastModifiedBy, created, modified } = req.body;


        let properties = {
            creator,
            lastModifiedBy,
            created,
            modified,
        };
        const uploadedFilePath = path.join(__dirname, `./../../public/files/${docxfile.filename}`);;
        const filebuffer = await readFile(uploadedFilePath);
        updateDocProperties(filebuffer, properties, docxfile.filename);
        // Send the updated file as a response
        res.json({ path: uploadedFilePath, status: "OK" });
    } catch (err) {
        next(err);
    }
};

exports.get_filesinfolder = async (req, res, next) => {
    try {
        const directoryPath = path.join(__dirname, './../../public/files'); // change this to your directory path
        fs.readdir(directoryPath, (err, files) => {
            if (err) {
                console.error(err);
                res.status(500).json({ error: 'Internal server error' });
                return;
            }

            const fileList = [];
            files.forEach((file) => {
                fileList.push(file);
            });

            res.json({ files: fileList });
        });
    } catch (err) {
        next(err);
    }
}
