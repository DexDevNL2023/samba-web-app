import { ToastService } from './toast.service';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PoliceAssurance } from '../models/police-assurance.model';
import { Assurance } from '../models/assurance.model';
import { Garantie } from '../models/garantie.model';
import { Souscription } from '../models/souscription.model';
import { GenericCrudService } from './generic.crud.service';

@Injectable({ providedIn: 'root' })
export class PoliceAssuranceService extends GenericCrudService<PoliceAssurance> {

    constructor(http: HttpClient, toastService: ToastService) {
        super(http, toastService, 'polices');
    }

    // Méthode pour récupérer l'assurance associée à une police d'assurance spécifique
    getAllAssurances(): Observable<Assurance[]> {
        return this.http.get<Assurance[]>(`${this.baseUrl}/${this.endpoint}/all/assurances`);
    }

    // Méthode pour récupérer toutes les garanties associées à une police d'assurance
    getAllGaranties(): Observable<Garantie[]> {
        return this.http.get<Garantie[]>(`${this.baseUrl}/${this.endpoint}/all/garanties`);
    }

    // Méthode pour récupérer toutes les souscriptions associées à une police d'assurance
    getAllSouscriptions(): Observable<Souscription[]> {
        return this.http.get<Souscription[]>(`${this.baseUrl}/${this.endpoint}/all/souscriptions`);
    }
}
