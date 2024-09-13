import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ToastService {
    // BehaviorSubject pour les messages de toasts
    private toastSubject = new BehaviorSubject<{ severity: string, summary: string, detail: string } | null>(null);
  
    // Exposez un observable pour que les autres parties du code puissent s'abonner aux messages de toasts
    get toastMessages$(): Observable<{ severity: string, summary: string, detail: string } | null> {
      return this.toastSubject.asObservable();
    }
  
    // Méthode pour envoyer un toast
    showToast(severity: string, summary: string, detail: string): void {
      this.toastSubject.next({ severity, summary, detail });
    }
  
    // Méthode pour réinitialiser le toast
    clearToast(): void {
      this.toastSubject.next(null);
    }
}
