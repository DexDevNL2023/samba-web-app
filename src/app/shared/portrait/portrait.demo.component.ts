import { CommonModule, DatePipe } from '@angular/common';
import { Component, ElementRef, Input, OnInit } from '@angular/core';
import { Company } from '../../models/company.model';
import { CompanyService } from '../../service/company.service';
import { HeaderPrintData } from '../../models/headerPrintData';

@Component({
  selector: 'app-demo-portrait',
  templateUrl: './portrait.demo.component.html'
})
export class PortraitComponent {

  @Input() cols: any[] = [];
  @Input() items: any[] = [];
  @Input() titlePage: string = '';

  today = new Date();
  headerPrintData: HeaderPrintData = new HeaderPrintData();
  data: Company = null;

  constructor(private paramService: CompanyService){}

  ngOnInit() {
    this.paramService.getCurrentCompany().subscribe(data => {
        this.data = data; // Assignez les données récupérées à this.data
        this.initHeaderPrintData(data); // Puis initialisez les données d'en-tête
    }, error => {
        console.error("Error fetching current company data", error);
        // Vous pouvez aussi gérer les erreurs ici, par exemple en affichant un message à l'utilisateur
    });
  }

  initHeaderPrintData(data: Company) {
    if (data) {  // Vérifiez si data n'est pas null
      this.headerPrintData.enteteDroite = data.enteteDroite?.split(";") || [];
      this.headerPrintData.enteteGauche = data.enteteGauche?.split(";") || [];
      this.headerPrintData.piedPage = data.piedPage?.split(";") || [];
      this.headerPrintData.param = data;
    } else {
      // Gérer le cas où data est null si nécessaire
      console.warn("Data is null or undefined. Cannot initialize header print data.");
    }
  }

  displayValue(row: any, dataKey: string) {
      let keys = dataKey.split('.');
      let value = null;
      if (keys.length > 1) {
          let object = row[keys[0]];
          value = object[keys[1]];
      } else {
          value = row[dataKey];
      }
      return value;
  }

  print() {
      window.print();
  }
}
