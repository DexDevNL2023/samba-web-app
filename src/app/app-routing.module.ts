import {RouterModule} from '@angular/router';
import {NgModule} from '@angular/core';
import {AppMainComponent} from './app.main.component';
import {AppNotfoundComponent} from './utilities/notfound/app.notfound.component';
import {AppAccessdeniedComponent} from './utilities/accessdenied/app.accessdenied.component';
import { DashboardComponent } from './shared/dashboard/dashboard.component';
import { UserRouteAccessService } from './core/auth/user-route-access.service';
import PasswordComponent from './account/password/password.component';
import LoginComponent from './login/login.component';
import PasswordResetFinishComponent from './account/password-reset/finish/password-reset-finish.component';
import PasswordResetInitComponent from './account/password-reset/init/password-reset-init.component';
import RegisterComponent from './account/register/register.component';
import SettingsComponent from './account/settings/settings.component';
import { ProfilComponent } from './account/profil/profil.component';
import { AssuranceCrudComponent } from './components/assurance/assurance.crud.component';
import { BrancheCrudComponent } from './components/branche/branche.crud.component';
import { FinanceurCrudComponent } from './components/financeur/financeur.crud.component';
import { AccountCrudComponent } from './components/account/account.crud.component';
import { AssureCrudComponent } from './components/assure/assure.crud.component';
import { DocumentCrudComponent } from './components/document/document.crud.component';
import { DossierMedicalCrudComponent } from './components/dossier-medical/dossier-medical.crud.component';
import { FournisseurCrudComponent } from './components/fournisseur/fournisseur.crud.component';
import { GarantieCrudComponent } from './components/garantie/garantie.crud.component';
import { NotificationCrudComponent } from './components/notification/notification.crud.component';
import { PaiementCrudComponent } from './components/paiement/paiement.crud.component';
import { PoliceAssuranceCrudComponent } from './components/police-assurance/police-assurance.crud.component';
import { PrestationCrudComponent } from './components/prestation/prestation.crud.component';
import { ReclamationCrudComponent } from './components/reclamation/reclamation.crud.component';
import { SinistreCrudComponent } from './components/sinistre/sinistre.crud.component';
import { SouscriptionCrudComponent } from './components/souscription/souscription.crud.component';
 
@NgModule({
    imports: [
        RouterModule.forRoot([
            {
                path: 'admin',
                component: AppMainComponent,
                children: [
                    { path: '', component: DashboardComponent },
                    
                    { path: 'accounts', component: AccountCrudComponent, canActivate: [UserRouteAccessService], data: { authorities: ['ROLE_ADMIN'] } },
                    { path: 'assurances', component: AssuranceCrudComponent, canActivate: [UserRouteAccessService], data: { authorities: ['ROLE_ADMIN', 'ROLE_AGENT', 'ROLE_CLIENT'] } },
                    { path: 'assures', component: AssureCrudComponent, canActivate: [UserRouteAccessService], data: { authorities: ['ROLE_ADMIN', 'ROLE_AGENT'] } },
                    { path: 'branches', component: BrancheCrudComponent, canActivate: [UserRouteAccessService], data: { authorities: ['ROLE_ADMIN'] } },
                    { path: 'documents', component: DocumentCrudComponent, canActivate: [UserRouteAccessService], data: { authorities: ['ROLE_ADMIN', 'ROLE_AGENT', 'ROLE_CLIENT', 'ROLE_PROVIDER'] } },
                    { path: 'dossiers/medicaux', component: DossierMedicalCrudComponent, canActivate: [UserRouteAccessService], data: { authorities: ['ROLE_ADMIN', 'ROLE_AGENT', 'ROLE_CLIENT', 'ROLE_PROVIDER'] } },
                    { path: 'financeurs', component: FinanceurCrudComponent, canActivate: [UserRouteAccessService], data: { authorities: ['ROLE_ADMIN', 'ROLE_PROVIDER'] } },
                    { path: 'fournisseurs', component: FournisseurCrudComponent, canActivate: [UserRouteAccessService], data: { authorities: ['ROLE_ADMIN'] } },
                    { path: 'garanties', component: GarantieCrudComponent, canActivate: [UserRouteAccessService], data: { authorities: ['ROLE_ADMIN', 'ROLE_AGENT', 'ROLE_CLIENT'] } },
                    { path: 'notifications', component: NotificationCrudComponent, canActivate: [UserRouteAccessService], data: { authorities: ['ROLE_ADMIN', 'ROLE_AGENT', 'ROLE_CLIENT', 'ROLE_PROVIDER'] } },
                    { path: 'paiements', component: PaiementCrudComponent, canActivate: [UserRouteAccessService], data: { authorities: ['ROLE_ADMIN', 'ROLE_AGENT', 'ROLE_CLIENT'] } },
                    { path: 'polices/assurances', component: PoliceAssuranceCrudComponent, canActivate: [UserRouteAccessService], data: { authorities: ['ROLE_ADMIN', 'ROLE_AGENT', 'ROLE_CLIENT'] } },
                    { path: 'prestations', component: PrestationCrudComponent, canActivate: [UserRouteAccessService], data: { authorities: ['ROLE_ADMIN', 'ROLE_PROVIDER'] } },
                    { path: 'reclamations', component: ReclamationCrudComponent, canActivate: [UserRouteAccessService], data: { authorities: ['ROLE_ADMIN', 'ROLE_AGENT', 'ROLE_CLIENT'] } },
                    { path: 'sinistres', component: SinistreCrudComponent, canActivate: [UserRouteAccessService], data: { authorities: ['ROLE_ADMIN', 'ROLE_AGENT', 'ROLE_CLIENT', 'ROLE_PROVIDER'] } },
                    { path: 'souscriptions', component: SouscriptionCrudComponent, canActivate: [UserRouteAccessService], data: { authorities: ['ROLE_ADMIN', 'ROLE_AGENT', 'ROLE_CLIENT'] } },

                    { path: 'profile', component: ProfilComponent, canActivate: [UserRouteAccessService], data: { authorities: ['ROLE_ADMIN', 'ROLE_AGENT'] } },
                    { path: 'password', component: PasswordComponent, canActivate: [UserRouteAccessService], data: { authorities: ['ROLE_ADMIN', 'ROLE_AGENT', 'ROLE_CLIENT', 'ROLE_PROVIDER'] } },
                    { path: 'setting', component: SettingsComponent, canActivate: [UserRouteAccessService], data: { authorities: ['ROLE_ADMIN', 'ROLE_AGENT', 'ROLE_CLIENT', 'ROLE_PROVIDER'] } },
                    
                    { path: 'accessdenied', component: AppAccessdeniedComponent },
                    { path: 'notfound', component: AppNotfoundComponent },
                    { path: '**', redirectTo: '/notfound' },
                ]
            },
            { path: 'login', component: LoginComponent },
            { path: 'reset/request', component: PasswordResetInitComponent },
            { path: 'reset/finish', component: PasswordResetFinishComponent },
            { path: 'register', component: RegisterComponent },
            { path: '', redirectTo: '/login', pathMatch: 'full' },
        ], {scrollPositionRestoration: 'enabled'})
    ],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
