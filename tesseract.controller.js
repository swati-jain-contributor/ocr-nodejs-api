var Tesseract = require('tesseract.js');
const _recognizeImage = (imgUrl) => {
    return new Promise((resolve, reject) => {
        console.log(Tesseract.recognize(imgUrl));

        try {
            Tesseract.recognize(imgUrl)
                .then((result) => {
                    console.log('Result: ', result.data.text);
                    resolve(result.data.text);
                })
                .catch((err) => {
                    console.error('Error: ', err);
                    reject(err);
                });
        } catch (error) {
            console.log('Error: ', error);
        }
    });
}

module.exports = {
    recognizeImage: _recognizeImage
}
