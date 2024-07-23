import { CommonModule, DatePipe } from '@angular/common';
import { Component, ElementRef, Input, OnInit } from '@angular/core';
import { Company } from '../../models/company.model';
import { CompanyService } from '../../service/company.service';
import { HeaderPrintData } from '../../models/headerPrintData';


@Component({
  selector: 'app-demo-portrait',
  standalone: true,
  imports: [ CommonModule ],
  templateUrl: './portrait.demo.component.html',
  styleUrls: ['./portrait.demo.component.scss']
})
export class PortraitComponent {

    today =  new Date();
    headerPrintData: HeaderPrintData = new HeaderPrintData();

    @Input() titlePage: string;

    @Input() tableHeaders: any[];
    @Input() tableRows: any[];

   constructor(private paramService: CompanyService){}

   ngOnInit() {
     this.paramService.getParametres().subscribe(data => {this.initHeaderPrintData(data)});
   }
 
   initHeaderPrintData(data: Company){
     this.headerPrintData.enteteDroite =  data.enteteDroite?.split(";");
     this.headerPrintData.enteteGauche =  data.enteteGauche?.split(";");
     this.headerPrintData.piedPage =  data.piedPage?.split(";");
     this.headerPrintData.param =  data;
   }

   displayValue(row: any, dataKey: string){
     let keys = dataKey.split('.');
      let value = null;
     if(keys.length > 1){
       let object = row[keys[0]]
       value =  object[keys[1]];
     }else{
       value =  row[dataKey];
     }
     return value;
   }
}
