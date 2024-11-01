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
      let i = 0;
      let j = 0;
      let data: any;
      let beforeCategory: string | undefined;
  
      const getPlainText = (cell: ExcelJS.Cell): string => {
        if (cell.value && typeof cell.value === 'object') {
          if (cell.value.hasOwnProperty('richText')) {
            return (cell.value as ExcelJS.CellRichTextValue).richText.map(part => part.text).join('');
          }
          if (cell.value.hasOwnProperty('text')) {
            return (cell.value as ExcelJS.CellHyperlinkValue).text || '';
          }
        }
        return cell.text || cell.value?.toString() || '';
      };      
  
      worksheet.eachRow(async (row, rowNumber) => {
        if (i !== 0) {
          const rowValues = row.values as any[];
          const isShopCategory = rowValues.length === 12;
          let doc_id = getPlainText(row.getCell(1));
  
          if (isShopCategory) {
            data = {
              address: getPlainText(row.getCell(2)),
              opening_hours: getPlainText(row.getCell(3)),
              closing_hours: getPlainText(row.getCell(4)),
              holiday: getPlainText(row.getCell(5)),
              latitude: getPlainText(row.getCell(6)),
              longitude: getPlainText(row.getCell(7)),
              mail_address: getPlainText(row.getCell(8)),
              map_url: getPlainText(row.getCell(9)),
              payment: getPlainText(row.getCell(10)),
              phone_number: getPlainText(row.getCell(11))
            };
            await admin.firestore().collection('shops').doc(doc_id).set(data);
            console.log(`Uploaded document with ID: ${doc_id}`);
          } else {
            if (j !== 0 && beforeCategory !== rowValues[1]) {
              await admin.firestore().collection('Products').doc(beforeCategory).set(data);
              console.log(`Uploaded document with ID: ${beforeCategory}`);
              console.log('Data:', data);
              j = 0;
              data = {};
            }
            doc_id = getPlainText(row.getCell(1));
            data = {
              ...data,
              [j]: {
                name: getPlainText(row.getCell(2)),
                price: getPlainText(row.getCell(3)),
                description: getPlainText(row.getCell(4)),
                imagepath: getPlainText(row.getCell(5))
              }
            };
            j++;
            beforeCategory = rowValues[1];
          }
        }
        i++;
      });
  
      if (j !== 0 && beforeCategory) {
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
