const express = require('express');
const app = express();
const cors = require('cors');
const multer = require("multer");
const bodyParser = require('body-parser');
const tesseractController = require('./tesseract.controller');

const port = 3000;

// app.use(
//     fileUpload());
// enable CORS
app.use(cors());
// parse application/json
app.use(bodyParser.json());
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: true}));

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
       cb(null, 'uploads');
    },
    filename: function (req, file, cb) {
       cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
    }
 });
 var upload = multer({ dest: 'upload/'});

 app.use('/uploads', express.static('uploads'));

// app.use(express.json({limit: '50mb'}));
// app.use(bodyParser.urlencoded({ extended: false,limit: "50mb" }));
// app.use(bodyParser.json({limit: "50mb"}));
// app.use(express.urlencoded({
//     extended: true,
//     limit: '50mb'
// }));
// app.use(express.json({limit: '50mb'}));
app.get('', (req, res) => {
    res.send('Send a POST request to /read-image. For more information, read the readme.md file at this project. =)');
});

app.post('/read-image', upload.single('file'),(req, res) => {
    console.log('Body: ', req.file);
    tesseractController
        .recognizeImage(req.file.path)
        .then((result) => {
            res
                .status(200)
                .send(result)
        })
        .catch((err) => {
            res
                .status(500)
                .send(err);
        });
});

app.get('', (req, res) => {
    res.send('Hello World!');
});

app.listen(port, () => {
    console.log(`OCR Server is listening at port ${port}`);
});
