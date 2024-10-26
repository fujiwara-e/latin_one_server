import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class ExcelService {

  SaveUploadFile(file: Express.Multer.File) {
    const uploadPath = 'uploads';
    const filePath = path.join(uploadPath, file.originalname);
    fs.writeFileSync(filePath, file.buffer);
  }
  handleFileUpload(file: Express.Multer.File) {
    console.log(file);
    return {
      message: 'File uploaded successfully',
      filename: file.filename,
    };
  }
}
