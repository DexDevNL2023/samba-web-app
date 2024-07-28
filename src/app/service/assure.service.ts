import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin, Observable } from 'rxjs';
import { DossierMedical } from '../models/medical-record.model';
import { Notification } from '../models/notification.model';
import { Souscription } from '../models/souscription.model';
import { GenericCrudService } from './generic.crud.service';
import { Registrant } from '../models/registrant.model';
import { UserData } from '../models/user-data.model';
import { Assure } from '../models/assure.model';

@Injectable({ providedIn: 'root' })
export class AssureService extends GenericCrudService<Assure> {

    constructor(http: HttpClient) {
        super(http, 'assures');
    }

    // Méthode pour récupérer les dossiers médicaux d'un utilisateur
    getRegistrant(assureId: number): Observable<Registrant> {
        return this.http.get<Registrant>(`${this.baseUrl}/${this.endpoint}/${assureId}/registrant`);
    }

    // Méthode pour récupérer les dossiers médicaux d'un utilisateur
    getMedicalRecords(assureId: number): Observable<DossierMedical[]> {
        return this.http.get<DossierMedical[]>(`${this.baseUrl}/${this.endpoint}/${assureId}/dossiers`);
    }

    // Méthode pour récupérer les notifications d'un utilisateur
    getNotifications(assureId: number): Observable<Notification[]> {
        return this.http.get<Notification[]>(`${this.baseUrl}/${this.endpoint}/${assureId}/notifications`);
    }

    // Méthode pour récupérer les souscriptions d'un utilisateur
    getSouscriptions(assureId: number): Observable<Souscription[]> {
        return this.http.get<Souscription[]>(`${this.baseUrl}/${this.endpoint}/${assureId}/souscriptions`);
    }

    // Méthode pour récupérer les données combinées d'un utilisateur
    getUserDetails(assureId: number): Observable<UserData> {
        return forkJoin({
            registrant: this.getRegistrant(assureId),
            dossiers: this.getMedicalRecords(assureId),
            souscriptions: this.getSouscriptions(assureId)
        });
    }
}
