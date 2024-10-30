import { Controller, Post, Res, Body,UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ExcelService } from './excel.service';
import { Response } from 'express';

@Controller('excel')
export class ExcelController {
  constructor(private readonly excelService: ExcelService) {}
  @Post('download')
  async DownloadFile(@Res() res: Response, @Body('category') category: string,) {
      console.log(category);
    const filePath = 'uploads/' + category + '.xlsx';
    let collectionName: string;
    if (category === 'Shop'){
      collectionName = "shops";
    } else if (category === 'Product'){
      collectionName = "Products";
    }
    const data = await this.excelService.GetDocumentsWithFields(collectionName);
    await this.excelService.ExportDataToExcel(data, category, filePath);
    res.download(filePath, category + '.xlsx', (err) => {
      if (err) {
        console.error('Error sending file:', err);
        res.status(500).send('Could not download the file.');
      } else {
        console.log('File sent successfully');
      }
    });
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async UploadFile(@Body('category') category: string, @UploadedFile() file: Express.Multer.File) {
    let collectionName: string;
    if (category === 'Shop'){
      collectionName = "shops";
    } else if (category === 'Product'){
      collectionName = "Products";
    }
    this.excelService.SaveUploadFile(file);
    const data = await this.excelService.ParseExcelFile('uploads/' + file.originalname);
    await this.excelService.SaveToFirestore(data,collectionName);
    // パースしたデータをDBに保存する処理
    return this.excelService.handleFileUpload(file);
  }
}
