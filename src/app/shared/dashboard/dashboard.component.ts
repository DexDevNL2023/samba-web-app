import { Component, OnInit } from '@angular/core';
import { EventService } from 'src/app/service/eventservice';
import { OverviewBox } from '../../models/OverviewBox';
import { Partner } from '../../models/Partner';
import { PaymentHistory } from '../../models/PaymentHistory';
import { DashboardService } from '../../service/dashboard.service';
import { AppMainComponent } from '../../app.main.component';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

    // Données pour les boîtes d'aperçu
    overviewBoxes: OverviewBox[] = [
        { title: 'Assurés', stats: 2345, details: '+15% depuis la semaine dernière', icon:'pi pi-users' },
        { title: 'Souscriptions', stats: 1150, details: '+25% depuis la semaine dernière', icon:'pi pi-shield' },
        { title: 'Sinistres', stats: 320, details: '+10% depuis la semaine dernière', icon:'pi-exclamation-triangle' },
        { title: 'Réclamations', stats: 98, details: '+5% depuis la semaine dernière', icon:'pi pi-id-card' },
        { title: 'Polices d\'assurances', stats: 1260, details: '+20% depuis la semaine dernière', icon:'pi pi-credit-card' },
        { title: 'Partenaires', stats: 25, details: '+5% depuis la semaine dernière', icon:'pi pi-sitemap' },
        { title: 'Prestations de Soins', stats: 1500, details: '+30% depuis la semaine dernière', icon:'pi pi-heart' },
        { title: 'Dossiers Médicaux', stats: 534, details: '+12% depuis la semaine dernière', icon:'pi pi-folder-open' }
    ];

    // Données pour les partenaires
    partners: Partner[] = [
        { logo: '../../../assets/layout/images/partner-logo1.png', name: 'Partenaire A', insuredCount: 1200, subscriptionPercent: '45%', status: 'up' },
        { logo: '../../../assets/layout/images/partner-logo2.png', name: 'Partenaire B', insuredCount: 800, subscriptionPercent: '30%', status: 'down' },
        { logo: '../../../assets/layout/images/partner-logo3.jpeg', name: 'Partenaire C', insuredCount: 1500, subscriptionPercent: '50%', status: 'up' },
        { logo: '../../../assets/layout/images/partner-logo4.jpeg', name: 'Partenaire D', insuredCount: 600, subscriptionPercent: '25%', status: 'down' },
        { logo: '../../../assets/layout/images/partner-logo5.jpg', name: 'Partenaire E', insuredCount: 1000, subscriptionPercent: '35%', status: 'up' },
        { logo: '../../../assets/layout/images/partner-logo6.png', name: 'Partenaire F', insuredCount: 500, subscriptionPercent: '20%', status: 'up' }
    ];

    // Données pour l'historique des paiements
    paymentHistory: PaymentHistory[] = [
        { type: 'Prestation', amount: '23.000 XAF', style: 'idle' },
        { type: 'Remboursement', amount: '12.000 XAF', style: 'pending'  },
        { type: 'Prime', amount: '150.000 XAF', style: 'completed'  }
    ];

    constructor(private dashboardService: DashboardService, public appMain: AppMainComponent) {}

    ngOnInit() {
        this.fetchDashboardData();
        this.updateBreadcrumb(); // Mettre à jour le breadcrumb initial
    }

    private updateBreadcrumb() {
      // Mettre à jour le breadcrumb en fonction du contexte
      const breadcrumbItems = [
        { icon: 'pi pi-home', routerLink: '/admin' }
      ];
  
      this.appMain.setBreadcrumbItems(breadcrumbItems); // Call the public method instead
    }

    fetchDashboardData() {
      this.dashboardService.fetchDashboardData().subscribe(data => {
        this.overviewBoxes = data.overviewBoxes;
        this.partners = data.partners;
        this.paymentHistory = data.paymentHistory;
      });
    }
}
