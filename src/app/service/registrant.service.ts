import { ToastService } from './toast.service';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { GenericCrudService } from './generic.crud.service';
import { map, catchError } from 'rxjs/operators';
import { RessourceResponse } from './../models/ressource.response.model';
import { LiteRegistrant } from '../models/lite.registrant.model';
import { Registrant } from '../models/registrant.model';


@Injectable({ providedIn: 'root' })
export class RegistrantService extends GenericCrudService<LiteRegistrant> {

    constructor(http: HttpClient, toastService: ToastService) {
        super(http, toastService, 'api/registrants');
    }

    // Récupérer les registrants par branche ID
    getByBrancheId(brancheId: number): Observable<LiteRegistrant[]> {
        return this.http.get<RessourceResponse<LiteRegistrant[]>>(`${this.resourceUrl}/find/by/branche/${brancheId}`).pipe(
            map(response => this.handleResponse(response, 'Récupérer les registrants par branche ID')),
            catchError(() => of([]))
        );
    }

    // Récupérer les registrants par fournisseur ID
    getByFournisseurId(fournisseurId: number): Observable<LiteRegistrant[]> {
        return this.http.get<RessourceResponse<LiteRegistrant[]>>(`${this.resourceUrl}/find/by/fournisseur/${fournisseurId}`).pipe(
            map(response => this.handleResponse(response, 'Récupérer les registrants par fournisseur ID')),
            catchError(() => of([]))
        );
    }

    // Récupérer un registrant par branche ID et fournisseur ID
    getByBrancheIdAndFournisseurId(brancheId: number, fournisseurId: number): Observable<LiteRegistrant> {
        return this.http.get<RessourceResponse<LiteRegistrant>>(`${this.resourceUrl}/find/by/branche/${brancheId}/fournisseur/${fournisseurId}`).pipe(
            map(response => this.handleResponse(response, 'Récupérer le registrant par branche ID et fournisseur ID')),
            catchError(() => of(null))
        );
    }

    // Récupérer un registrant par assure ID
    getByAssureId(assureId: number): Observable<LiteRegistrant> {
        return this.http.get<RessourceResponse<LiteRegistrant>>(`${this.resourceUrl}/find/by/assure/${assureId}`).pipe(
            map(response => this.handleResponse(response, 'Récupérer le registrant par assure ID')),
            catchError(() => of(null))
        );
    }

    // Récupérer un registrant par user ID
    getByUserId(userId: number): Observable<Registrant> {
        return this.http.get<RessourceResponse<Registrant>>(`${this.resourceUrl}/find/by/user/${userId}`).pipe(
            map(response => this.handleResponse(response, 'Récupérer le registrant par user ID')),
            catchError(() => of(null))
        );
    }
}
