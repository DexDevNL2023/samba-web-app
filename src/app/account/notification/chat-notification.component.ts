import { Component, OnInit } from '@angular/core';
import { NotificationService } from '../../service/notification.service';
import { AccountService } from '../../core/auth/account.service';
import { Notification } from '../../models/notification.model';
import { Account } from '../../core/auth/account.model';

@Component({
  selector: 'app-chat-notification',
  templateUrl: './chat-notification.component.html'
})
export class ChatNotificationComponent implements OnInit {
  notifications: Notification[] = [];
  account: Account | null = null;
  newMessage: string = '';

  constructor(
    private notificationService: NotificationService,
    private accountService: AccountService
  ) {}

  ngOnInit(): void {
    // Charge les données du compte utilisateur actuellement authentifié lors de l'initialisation du composant
    this.accountService.identity().subscribe(account => {
      if (account) {
        // Récupère toutes les notifications de l'utilisateur
        this.notificationService.getAllNotificationByUtilisateur(account.id).subscribe(notifications => {
          this.notifications = notifications;
          // Marque toutes les notifications comme lues
          this.markAllAsRead();
        });
      }
    });
  }
 
  // Marque toutes les notifications comme lues
  markAllAsRead(): void {
    if (this.account) {
      this.notificationService.markAllAsRead(this.account.id).subscribe();
    }
  }

  // Envoie une nouvelle notification
  sendNotification(): void {
    if (this.newMessage.trim() && this.account) {
      const newNotification: Notification = {
        message: this.newMessage,
        dateEnvoi: new Date(),
        type: 'REQUEST',
        isRead: false,
        utilisateur: { id: this.account.id }
      };

      this.notificationService.create(newNotification).subscribe(notification => {
        this.notifications.push(notification);
        this.newMessage = '';
      });
    }
  }

  shouldShowIcon(index: number): boolean {
    if (index === 0) {
      return true;
    }
    return this.notifications[index].type !== this.notifications[index - 1].type;
  }  
}
