import { ToastService } from './toast.service';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GenericCrudService } from './generic.crud.service';
import { ContratAssurance } from '../models/contrat-assurance.model';

@Injectable({ providedIn: 'root' })
export class ContratAssuranceService extends GenericCrudService<ContratAssurance> {

    constructor(http: HttpClient, toastService: ToastService) {
        super(http, toastService, 'contrats-assurances');
    }
}
