import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Notification } from '../models/notification.model';
import { GenericCrudService } from './generic.crud.service';
import { UserExtra } from '../models/assure.model';


@Injectable({ providedIn: 'root' })
export class NotificationService extends GenericCrudService<Notification> {
    private allNotificationsSubject: BehaviorSubject<Notification[]> = new BehaviorSubject<Notification[]>([]);
    private unreadNotificationsSubject: BehaviorSubject<Notification[]> = new BehaviorSubject<Notification[]>([]);

    constructor(http: HttpClient) {
        super(http, 'notifications');
    }

    // Méthode pour récupérer l'utilisateur associé à une notification spécifique
    getUtilisateur(notificationId: number): Observable<UserExtra> {
        return this.http.get<UserExtra>(`${this.baseUrl}/${this.endpoint}/${notificationId}/user`);
    }

    // Méthode pour récupérer toutes les notifications associé à un utilisateur spécifique
    getAllNotificationByUtilisateur(utilisateurId: number): Observable<Notification[]> {
        return this.http.get<Notification[]>(`${this.baseUrl}/${this.endpoint}/${utilisateurId}/all`).pipe(
            tap(notifications => this.allNotificationsSubject.next(notifications))
        );
    }

    // Méthode pour récupérer les notifications non lu associé à un utilisateur spécifique
    getUnreadNotificationByUtilisateur(utilisateurId: number): Observable<Notification[]> {
        return this.http.get<Notification[]>(`${this.baseUrl}/${this.endpoint}/${utilisateurId}/unread`).pipe(
            tap(notifications => this.unreadNotificationsSubject.next(notifications))
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

    // Méthode pour marquer toutes les notifications non lues comme lues
    markAllAsRead(utilisateurId: number): Observable<Notification[]> {
        return this.http.put<Notification[]>(`${this.baseUrl}/${this.endpoint}/${utilisateurId}/mark-all-as-read`, {}).pipe(
            tap(notifications => {
                this.allNotificationsSubject.next(notifications);
                this.unreadNotificationsSubject.next(notifications.filter(notification => !notification.isRead));
            })
        );
    }
}
