import { ToastService } from './toast.service';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Document } from '../models/document.model';
import { GenericCrudService } from './generic.crud.service';

@Injectable({ providedIn: 'root' })
export class DocumentService extends GenericCrudService<Document> {

    constructor(http: HttpClient, toastService: ToastService) {
        super(http, toastService, 'documents');
    }
}
