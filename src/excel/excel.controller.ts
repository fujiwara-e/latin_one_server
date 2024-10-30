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
    try {

        const data = await this.excelService.GetDocumentsWithFields(category);
        await this.excelService.ExportDataToExcel(data, category, filePath);

        res.download(filePath, category + '.xlsx', (err) => {
            if (err) {
                console.error('Error sending file:', err);
                res.status(500).send('Could not download the file.');
            } else {
                console.log('File sent successfully');
            }
        });
    } catch (error) {
        console.error('Error generating or sending file:', error);
      res.status(500).send('An error occurred during file generation.');
    }
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async UploadFile(@UploadedFile() file: Express.Multer.File) {
    // Shop か Product かを判断する処理
    this.excelService.SaveUploadFile(file);
    this.excelService.ParseExcelFile('uploads/' + file.originalname);
    // パースしたデータをDBに保存する処理
    return this.excelService.handleFileUpload(file);
  }
}
