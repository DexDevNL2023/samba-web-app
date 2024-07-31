import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PoliceAssurance } from '../models/police-assurance.model';
import { Paiement } from '../models/paiement.model';
import { Sinistre } from '../models/sinistre.model';
import { GenericCrudService } from './generic.crud.service';
import { Assure } from '../models/assure.model';
import { Reclamation } from '../models/reclamation.model';
import { ContratAssurance } from '../models/contrat-assurance.model';

@Injectable({ providedIn: 'root' })
export class ContratAssuranceService extends GenericCrudService<ContratAssurance> {

    constructor(http: HttpClient) {
        super(http, 'contrats-assurances');
    }
}
