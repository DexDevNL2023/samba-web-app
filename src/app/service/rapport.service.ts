import { ToastService } from './toast.service';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Rapport } from '../models/rapport.model';
import { GenericCrudService } from './generic.crud.service';

@Injectable({ providedIn: 'root' })
export class RapportService extends GenericCrudService<Rapport> {

    constructor(http: HttpClient, toastService: ToastService) {
        super(http, toastService, 'api/rapports');
    }
}
