import { diskStorage } from 'multer';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import path from 'path';
​

const storage: MulterOptions['storage'] = diskStorage({
    destination: (req, file, callback) => {
        callback(null, path.join(__dirname, '..', '..', 'uploads'));
    },
    filename: (req, file, callback) => {
        callback(null, file.originalname);
    },
});
​
const fileFilter: MulterOptions['fileFilter'] = (req, file, callback) => {
    if (!file.mimetype.startsWith('image/')) {
        return callback(new Error('Seules les images sont autorisées'), false);     // false: reject file
    }
    callback(null, true);   
};
​
export const multerOptions: MulterOptions = {
    storage,
    fileFilter,
    limits: {
        fileSize: 4 * 1024 * 1024, // Limit file size to 4MB
    },
};