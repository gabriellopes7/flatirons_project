import { diskStorage } from 'multer';
import { extname } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';

export const multerConfig: MulterOptions = {
  storage: diskStorage({
    destination: './uploads',
    filename: (req, file, callback) => {
      const uniqueSuffix = uuidv4();
      const ext = extname(file.originalname);
      callback(null, `${uniqueSuffix}${ext}`);
    },
  }),
  fileFilter: (req, file, callback) => {
    if (file.mimetype !== 'text/csv' && !file.originalname.endsWith('.csv')) {
      return callback(new Error('Only CSV files are allowed'), false);
    }
    callback(null, true);
  },
  limits: {
    fileSize: 1024 * 1024 * 5, 
  },
};