const express = require('express');
var fs = require('fs');
const app = express();
const cors = require('cors');
const multer = require("multer");
const bodyParser = require('body-parser');
const tesseractController = require('./tesseract.controller');

const port = 3001;
const { createWorker } = require('tesseract.js');
const path = require('path');

const worker = createWorker({
  langPath: path.join(__dirname, '', 'lang-data'), 
  logger: m => console.log(m),
});

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
let data="";
	req.on('data', chunk => {
		console.log('kjhjkh');
    data += chunk;
  }).on('end', () => {
	 var buf = Buffer.from(data, 'base64');
fs.writeFile('image.png', buf, function(){});
   console.log('Body: ', path.join(__dirname, 'image.png'));
    (async () => {
        await worker.load();
        await worker.loadLanguage('eng');
        await worker.initialize('eng');
        const { data: { text } } = await worker.recognize(path.join(__dirname, 'image.png'));
        console.log(text);
        res
                .status(200)
                .send(text);
      })();

});

//    console.log('Body: ', req.body.length);
  //  (async () => {
    //    await worker.load();
    //    await worker.loadLanguage('eng');
    //    await worker.initialize('eng');
     //   const { data: { text } } = await worker.recognize(req.body);
     //   console.log(text);
     //   res
     //           .status(200)
      //          .send(text);
    //  })();
      
    // tesseractController
    //     .recognizeImage(req.file.path)
    //     .then((result) => {
    //         res
    //             .status(200)
    //             .send(result)
    //     })
    //     .catch((err) => {
    //         res
    //             .status(500)
    //             .send(err);
    //     });
});

app.get('', (req, res) => {
    res.send('Hello World!');
});

app.listen(port, () => {
    console.log(`OCR Server is listening at port ${port}`);
});
