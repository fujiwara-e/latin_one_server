import { Injectable } from '@nestjs/common';
import { admin } from '../firebase';
import * as ExcelJS from 'exceljs';
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

  async ParseExcelFile(filePath: string): Promise<any[]> {
    const workbook = new ExcelJS.Workbook();
    const data = [];

    try {
      await workbook.xlsx.readFile(filePath);
      const worksheet = workbook.getWorksheet(1);

      worksheet.eachRow((row, rowNumber) => {
        if (rowNumber !== 1) {
          const rowData = row.values;
          data.push(rowData);
        }
      });
      console.log('Data:', data);
      return data;
    } catch (error) {
      console.error('Error parsing Excel file:', error);
      throw error;
    }
  }

  async GetDocumentsWithFields(collectionName: string): Promise<{ id: string; fields: any }[]> {
    const data: { id: string; fields: any }[] = [];
    const snapshot = await admin.firestore().collection(collectionName).get();

    snapshot.forEach(doc => {
      data.push({ id: doc.id, fields: doc.data() });
    });
    console.log('Data:', data);
    return data;
  }

  async ExportDataToExcel(data: { id: string; fields: any }[], category: string, filePath: string) {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Data');
    if(category === 'shop') {
      const headers = [
        'Name', 'address', 'opening_hours', 'closing_hours', 'holiday',
        'latitude', 'longitude', 'mail_address', 'map_url', 'payment', 'phone_number'
      ];
      worksheet.addRow(headers);

      data.forEach(item => {
        const row = [
          item.id,
          item.fields.address,
          item.fields.opening_hours,
          item.fields.closing_hours,
          item.fields.holiday,
          item.fields.latitude,
          item.fields.longitude,
          item.fields.mail_address,
          item.fields.map_url,
          item.fields.payment,
          item.fields.phone_number,
        ];
        worksheet.addRow(row);
      });
    } else if(category === 'product') {
      const headers = [
        'Category', 'Name', 'Price', 'Description', 'ImagePath'
      ];
      worksheet.addRow(headers);

      data.forEach(item => {
        const row = [
          item.id,
          item.fields.description,
          item.fields.image,
          item.fields.price,
          item.fields.shop_id,
        ];
        worksheet.addRow(row);
      });
    }

    await workbook.xlsx.writeFile(filePath);
    console.log(`Data exported to ${filePath}`);
  }

  async PostDataToFirestore(data: any[], collectionName: string) {
    data.forEach(async item => {
      await admin.firestore().collection(collectionName).doc(item.id).set(item.fields);
    });
  }
}
