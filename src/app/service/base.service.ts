import { Injectable } from '@angular/core';
import * as FileSave from 'file-saver';


@Injectable({ providedIn: 'root' })
export class BaseService {

  generateExcel(title, data) {
    if(data.length > 0){

      data.map(item =>{
        delete item['id'];
        delete item['createdBy'];
        delete item['createdAt'];
        delete item['updatedBy'];
        delete item['updatedAt'];
        delete item['deletedAt'];
        delete item['deletedBy'];
        delete item['isDeleted'];
      })
    }else{
      data = [];
    }
    import("xlsx").then(xlsx => {
        const worksheet = xlsx.utils.json_to_sheet(data);
        const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
        const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
        this.saveAsExcelFile(excelBuffer, title);
    });
  }

  saveAsExcelFile(buffer: any, fileName: string): void {
      let EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
      let EXCEL_EXTENSION = '.xlsx';
      const data: Blob = new Blob([buffer], {
          type: EXCEL_TYPE
      });
      FileSave.saveAs(data, fileName + EXCEL_EXTENSION);
  }

  printListe(title: string, data: any){
    const win = window.open(
      '',
      title,
      `width=800,height=400,screenX=200,screenY=200`
    );
    win.document.write('<html><head><title>'+title+'</title><link rel="stylesheet" type="text/css" href="../../../print.css"></head><body>');
    win.document.write(data);
    win.document.write('</body></html>');
    win.print();
    win.close();
  }

  public makePdf(title: string, data: any) {
    const win = window.open(
      '',
      title,
      `width=800,height=400,screenX=200,screenY=200`
    );
    win.document.write('<html><head><title>'+title+'</title><link rel="stylesheet" type="text/css" href="../../../print.css"></head><body>');
    win.document.write(data);
    win.document.write('</body></html>');
  }

  buildExportData(donnees){
    let exportData = [];
    donnees.forEach(item => {
      item.data.forEach(element => {
        exportData.push(element);
      })
    });
    return exportData;
  }
}
