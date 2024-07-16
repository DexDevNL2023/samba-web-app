import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Registration } from './register.model';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class RegisterService {
  private http = inject(HttpClient);

  // Déclaration de l'URL de base pour les requêtes API
  protected baseUrl = environment.apiUrl;

  save(registration: Registration): Observable<{}> {
    return this.http.post(`${this.baseUrl}/api/registe`, registration);
  }
}
