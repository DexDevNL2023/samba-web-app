import { ToastService } from './toast.service';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GenericCrudService } from './generic.crud.service';
import { Permission } from '../models/permission.model';

@Injectable({ providedIn: 'root' })
export class PermissionService extends GenericCrudService<Permission> {

    constructor(http: HttpClient, toastService: ToastService) {
        super(http, toastService, 'api/permissions');
    }
}
