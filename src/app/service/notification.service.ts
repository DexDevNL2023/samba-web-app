import { ToastService } from './toast.service';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Notification } from '../models/notification.model';
import { GenericCrudService } from './generic.crud.service';
import { Observable, tap, BehaviorSubject, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { RessourceResponse } from './../models/ressource.response.model';


@Injectable({ providedIn: 'root' })
export class NotificationService extends GenericCrudService<Notification> {
    private allNotificationsSubject: BehaviorSubject<Notification[]> = new BehaviorSubject<Notification[]>([]);
    private unreadNotificationsSubject: BehaviorSubject<Notification[]> = new BehaviorSubject<Notification[]>([]);

    constructor(http: HttpClient, toastService: ToastService) {
        super(http, toastService, 'api/notifications');
    }

    // Récupérer les notifications par ID d'utilisateur
    getNotificationsByUserId(userId: number): Observable<Notification[]> {
        return this.http.get<RessourceResponse<Notification[]>>(`${this.resourceUrl}/user/${userId}`).pipe(
            map(response => this.handleResponse(response, 'Récupérer les notifications par utilisateur')),
            tap(notifications => {
                this.allNotificationsSubject.next(notifications);
            }),
            catchError(() => of([]))
        );
    }

    // Méthode pour marquer toutes les notifications non lues comme lues
    markAsReadNotificationsByUserId(userId: number): Observable<Notification[]> {
        return this.http.put<RessourceResponse<Notification[]>>(`${this.resourceUrl}/read/${userId}`, {}).pipe(
            map(response => this.handleResponse(response, 'Marquer les notifications comme lues')),
            tap(notifications => this.unreadNotificationsSubject.next(notifications)),
            catchError(() => of([]))
        );
    }

    // Méthode pour récupérer les notifications non lu associé à un utilisateur spécifique
    getUnreadNotificationsByUserId(userId: number): Observable<Notification[]> {
        return this.http.get<RessourceResponse<Notification[]>>(`${this.resourceUrl}/unread/${userId}`).pipe(
            map(response => this.handleResponse(response, 'Récupérer les notifications non lues')),
            tap(notifications => this.unreadNotificationsSubject.next(notifications)),
            catchError(() => of([]))
        );
    }

    // Méthode pour obtenir l'état de toutes les notifications
    getAllNotificationState(): Observable<Notification[]> {
        return this.allNotificationsSubject.asObservable();
    }

    // Méthode pour obtenir l'état de toutes les notifications non lu
    getUnreadNotificationState(): Observable<Notification[]> {
        return this.unreadNotificationsSubject.asObservable();
    }
}
