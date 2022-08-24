/*const sharp = require('sharp');

class ImageProcessingUtils {
    async resizeImage(source, imgSize) {
        const { width, height } = imgSize;
        try {
            const bufferArray = await sharp(source)
                .resize(width, height)
                .max()
                .toBuffer();
            return bufferArray;
        } catch (error) {
            throw error;
        }
    }

    async resizeImages(files, imgSize) {
        if (!files || !imgSize) {
            throw new Error('You must provide array files and imgSize arguments');
        }

        let resizedImages = files.map(async (file) => {
            const generalFile = file;
            if (generalFile.mimetype.includes('image')) {
                generalFile.buffer = await this.resizeImage(generalFile.buffer, imgSize);
                generalFile.size = generalFile.buffer.length;
            }
            return generalFile;
        });

        resizedImages = await Promise.all(resizedImages);
        return resizedImages;
    }
}

module.exports = new ImageProcessingUtils();
*/