import { Injectable } from '@nestjs/common';
import { admin } from '../firebase';
import * as ExcelJS from 'exceljs';
import * as fs from 'fs';
import * as path from 'path';
import { before } from 'node:test';

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
        Object.keys(item.fields).forEach(key => {
          const field = item.fields[key];
          const row = [
            item.id,
            field.name || '',
            field.price || '',
            field.description || '',
            field.imagepath || ''
          ];
          worksheet.addRow(row);
        });
      });
    }

    await workbook.xlsx.writeFile(filePath);
    console.log(`Data exported to ${filePath}`);
  }

  async UploadDataFromExcelToFirestore(filePath: string) {
    const workbook = new ExcelJS.Workbook();
    try {
      await workbook.xlsx.readFile(filePath);
      const worksheet = workbook.getWorksheet(1);
      var i = 0;
      var j = 0;
      let data;
      let beforeCategory;

      worksheet.eachRow(async (row, rowNumber) => {
        if (i !== 0) {
          const rowValues = row.values;
          const isShopCategory = rowValues.length === 12;
          let doc_id = rowValues[1] as string;

          if(isShopCategory) {
            doc_id = rowValues[1] as string;
            data = {
              address: rowValues[2],
              opening_hours: rowValues[3],
              closing_hours: rowValues[4],
              holiday: rowValues[5],
              latitude: rowValues[6],
              longitude: rowValues[7],
              mail_address: rowValues[8],
              map_url: rowValues[9],
              payment: rowValues[10],
              phone_number: rowValues[11]
            };
            await admin.firestore().collection('shops').doc(doc_id).set(data);
            console.log(`Uploaded document with ID: ${doc_id}`);
          } else {
            if (j !== 0 && beforeCategory !== rowValues[1]) {
              admin.firestore().collection('Products').doc(beforeCategory).set(data);
              console.log(`Uploaded document with ID: ${beforeCategory}`);
              console.log('Data:', data);
              j = 0;
              data = {};
            }
            doc_id = rowValues[1] as string;
            data = {
              ...data,
              [j]: {
                name: rowValues[2],
                price: rowValues[3],
                description: rowValues[4],
                imagepath: rowValues[5]
              }
            };
            j++;
            beforeCategory = rowValues[1];
          }
        }
        i++;
      });
      if (j !== 0 && beforeCategory){
        await admin.firestore().collection('Products').doc(beforeCategory).set(data);
        console.log(`Uploaded document with ID: ${beforeCategory}`);
        console.log('Data:', data);
      }
      console.log('Data uploaded to Firestore');
    } catch (error) {
      console.error('Error uploading data from Excel to Firestore:', error);
      throw error;
    }
  }
}
