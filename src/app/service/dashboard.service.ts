import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { OverviewBox } from '../models/OverviewBox';
import { Partner } from '../models/Partner';
import { PaymentHistory } from '../models/PaymentHistory';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getOverviewBoxes(): Observable<OverviewBox[]> {
    return this.http.get<OverviewBox[]>(`${this.baseUrl}/overview-boxes`);
  }

  getPartners(): Observable<Partner[]> {
    return this.http.get<Partner[]>(`${this.baseUrl}/partners`);
  }

  getPaymentHistory(): Observable<PaymentHistory[]> {
    return this.http.get<PaymentHistory[]>(`${this.baseUrl}/payment-history`);
  }

  fetchDashboardData(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/all-stats`);
  }
}
