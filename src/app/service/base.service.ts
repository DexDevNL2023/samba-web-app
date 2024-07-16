import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import * as FileSave from 'file-saver';


@Injectable({ providedIn: 'root' })
export class BaseService {

  constructor(private http: HttpClient) {}

  create(api: string, form: any): Observable<any> {
    console.log("Create ok ", form)
    console.log(`${api}`, JSON.stringify(form));
    return this.http.post<any>(`${environment.apiUrl}/${api}`, JSON.stringify(form));
  }

  generateExcel(title, data) {
    if(data.length > 0){

      data.map(item =>{
        delete item['id'];
        delete item['createdAt'];
        delete item['createdBy'];
        delete item['modifiedAt'];
        delete item['modifiedBy'];
        delete item['isDefault'];
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
