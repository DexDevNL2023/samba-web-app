import { Component, OnInit } from '@angular/core';
import { MessageService, ConfirmationService } from 'primeng/api';
import { CompanyService } from '../service/company.service';
import { AppMainComponent } from '../app.main.component';
import { Company } from '../models/company.model';

@Component({
    selector: 'app-company',
    templateUrl: './company.component.html'
})
export class CompanyComponent implements OnInit {

    company: Company = null; // Replace `any` with the actual type
    submitted!: boolean;
    cols!: any[];
    statuses!: any[];

    isEditable?: boolean = true;
    editButtonLabel?: string = "Modifier";
    editButtonIcon?: string = "pi pi-pencil";

    imageUrlPreview: string | ArrayBuffer | null = null;

    constructor(
        private paramService: CompanyService,
        private messageService: MessageService,
        public appMain: AppMainComponent // Donne acces aux methodes de app.main.component depuis le composant fille
    ) {
        this.appMain.setBreadcrumbItems([
            { label: 'Home', routerLink: '/admin' },
            { label: 'Company', routerLink: '/admin/company' }
        ]);
    }

    ngOnInit() {
        this.paramService.getCurrentCompany().subscribe(data => { this.company = data });
    }

    makeEditable() {
        this.isEditable = !this.isEditable;
        this.editButtonLabel = this.isEditable ? "Modifier" : "Annuler";
        this.editButtonIcon = this.isEditable ? "pi pi-pencil" : "pi pi-times";
    }

    saveForm() {
        this.submitted = true;
        console.log(this.company);
        if (this.company.name?.trim() && this.company.sigle?.trim() && this.company.email?.trim()) {
            if (this.company.id) {
            this.paramService.updateCompany(this.company).subscribe(
                () => {
                this.makeEditable();
                this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Company updated', life: 3000 });
                },
                (error) => {
                this.messageService.add({ severity: 'error', summary: 'Error', detail: error.message, life: 5000 });
                }
            );
            } else {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: "Company ID not found.", life: 5000 });
            }
        }
    }

    onFileSelected(field: string, event: any): void {
        const file = event.files[0];
        if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            this.imageUrlPreview = reader.result;
        };
        reader.readAsDataURL(file);
        }
    }
}
