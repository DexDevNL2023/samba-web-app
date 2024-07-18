import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MessageService } from 'primeng/api';
import readXlsxFile from 'read-excel-file';
import { BaseService } from '../../service/base.service';
import { DialogModule } from 'primeng/dialog';
import { ProgressBarModule } from 'primeng/progressbar';


@Component({
  selector: 'app-demo-import',
  standalone: true,
  imports: [DialogModule, ProgressBarModule],
  templateUrl: './import.demo.component.html'
})
export class ImportComponent {
  importDialog: boolean;
  imported: boolean;
  load: boolean;
  @Input() importLink: string;
  @Output() refresh = new EventEmitter<string>();
  constructor(private baseService: BaseService, private messageService: MessageService) {
  }

  ngOnInit() {
    console.log(this.importLink, 1);
  }

  hideDialog() {
    this.importDialog = false;
    this.imported = false;
    this.ngOnInit();
  }

  openNew() {
    this.imported = false;
    this.importDialog = true;
  }

  async onFileChange($event: any) {
    this.load = true;
    let listes: any[] = [];
    try {
      let input = $event.files as FileList;
      if (input.length > 0) {
        const data = await readXlsxFile(input[0]);
        data.map((row) => {
          type MyObject = {};
          if (data[0] != row) {            
            let item: MyObject = {};
            for (let index = 0; index < data[0].length; index++) {
              const entete = data[0][index];
              const value = row[index];
              item[''+entete+''] = value;   
            }
            listes.push(item);
          }
        });
        console.log(listes);
        this.baseService.create(this.importLink, listes).subscribe(result => {
          console.log(result);

          this.load = false;
          this.hideDialog();
          this.refresh.emit('refresh');
        });
      } else {
        this.messageService.add({ severity: 'error', summary: 'Erreur', detail: "Fichier incorrect!", life: 5000 });
        this.load = false;
      }
    } catch (e) {
      this.load = false;
      this.messageService.add({ severity: 'error', summary: 'Erreur', detail: e, life: 5000 });
    }
  }
}
