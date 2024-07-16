import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserExtra } from '../models/user-extra.model';
import { MedicalRecord } from '../models/medical-record.model';
import { Notification } from '../models/notification.model';
import { Souscription } from '../models/souscription.model';
import { GenericCrudService } from './generic.crud.service';

@Injectable({ providedIn: 'root' })
export class UserExtraService extends GenericCrudService<UserExtra> {

    constructor(http: HttpClient) {
        super(http, 'users');
    }

    // Méthode pour récupérer les dossiers médicaux d'un utilisateur
    getMedicalRecords(userId: number): Observable<MedicalRecord[]> {
        return this.http.get<MedicalRecord[]>(`${this.baseUrl}/${this.endpoint}/${userId}/dossiers`);
    }

    // Méthode pour récupérer les notifications d'un utilisateur
    getNotifications(userId: number): Observable<Notification[]> {
        return this.http.get<Notification[]>(`${this.baseUrl}/${this.endpoint}/${userId}/notifications`);
    }

    // Méthode pour récupérer les souscriptions d'un utilisateur
    getSouscriptions(userId: number): Observable<Souscription[]> {
        return this.http.get<Souscription[]>(`${this.baseUrl}/${this.endpoint}/${userId}/souscriptions`);
    }
}
