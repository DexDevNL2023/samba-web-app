import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Document } from '../models/document.model';
import { GenericCrudService } from './generic.crud.service';

@Injectable({ providedIn: 'root' })
export class DocumentService extends GenericCrudService<Document> {

    constructor(http: HttpClient) {
        super(http, 'documents-sinistres');
    }
}
