import { ConfirmationEffectuerPrestation } from './site/effectuer-prestation/steps/confirmation.prestation';
import { DocumentsEffectuerPrestation } from './site/effectuer-prestation/steps/documents.prestation';
import { InformationEffectuerPrestation } from './site/effectuer-prestation/steps/information.prestation';
import { EffectuerPrestation } from './site/effectuer-prestation/effectuer-prestation';
import { AssureDetailComponent } from './site/assure-detail/assure-detail.component';
import { AssureListComponent } from './site/assure-list/assure-list.component';
import { SinistreListComponent } from './site/sinistre-list/sinistre-list.component';
import { ConfirmationPrestation } from './site/reclamation-prestation/steps/confirmation.prestation';
import { InformationPrestation } from './site/reclamation-prestation/steps/information.prestation';
import { ReclamationPrestation } from './site/reclamation-prestation/reclamation-prestation';
import { PrestationListComponent } from './site/prestation-list/prestation-list.component';
import { ConfirmationPaiement } from './site/payer-prime/steps/confirmation.paiement';
import { InformationPaiement } from './site/payer-prime/steps/information.paiement';
import { PayerPrime } from './site/payer-prime/payer-prime';
import { ConfirmationReclamation } from './site/demande-remboursement/steps/confirmation.reclamation';
import { InformationReclamation } from './site/demande-remboursement/steps/information.reclamation';
import { DemandeRemboursement } from './site/demande-remboursement/demande-remboursement';
import { ConfirmationSinistre } from './site/declaration-sinistre/steps/confirmation.sinistre';
import { DocumentsSinistre } from './site/declaration-sinistre/steps/documents.sinistre';
import { InformationSinistre } from './site/declaration-sinistre/steps/information.sinistre';
import { DeclarationSinistre } from './site/declaration-sinistre/declaration-sinistre';
import { EffectuerSouscription } from './site/effectuer-souscription/effectuer-souscription';
import { ConfirmationSouscription } from './site/effectuer-souscription/steps/confirmation.souscription';
import { ModePaiementSouscription } from './site/effectuer-souscription/steps/paiement.souscription';
import { FrequencePaiementSouscription } from './site/effectuer-souscription/steps/frequence.souscription';
import { SouscriptionDetailComponent } from './site/souscription-detail/souscription-detail.component';
import { SouscriptionListComponent } from './site/souscription-list/souscription-list.component';
import { ProduitComponent } from './site/produit/produit.component';
import { SiteComponent } from './site/main/site.component';
import { ScanCniComponent } from './account/scan-cni/scan-cni.component';
import { RecuPaiementCrudComponent } from './components/recu-paiement/recu-paiement.crud.component';
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
import { ContratAssuranceCrudComponent } from './components/contrat-assurance/contrat-assurance.crud.component';
import { CompanyComponent } from './company/company.component';
import { ProduitDetailComponent } from './site/produit-detail/produit-detail.component';

@NgModule({
    imports: [
        RouterModule.forRoot([
            // Route par défaut redirigeant vers /site
            { path: '', redirectTo: '/site', pathMatch: 'full' },

            { path: 'site', component: SiteComponent, children: [
                // Route par défaut de /site, redirige vers ProduitComponent
                { path: '', component: ProduitComponent },
                { path: 'produit/detail/:id', component: ProduitDetailComponent },
                { path: 'souscription/list', component: SouscriptionListComponent },
                { path: 'souscription/detail/:id', component: SouscriptionDetailComponent },
                { path: 'effectuer/souscription', component: EffectuerSouscription, children: [
                        { path: 'steps/frequence', component: FrequencePaiementSouscription },
                        { path: 'steps/paiement', component: ModePaiementSouscription },
                        { path: 'steps/confirmation', component: ConfirmationSouscription },
                ]},
                { path: 'declarer/sinistre', component: DeclarationSinistre, children: [
                        { path: 'steps/information', component: InformationSinistre },
                        { path: 'steps/documents', component: DocumentsSinistre },
                        { path: 'steps/confirmation', component: ConfirmationSinistre },
                ]},
                { path: 'payer/prime', component: PayerPrime, children: [
                        { path: 'steps/information', component: InformationPaiement },
                        { path: 'steps/confirmation', component: ConfirmationPaiement },
                ]},
                { path: 'prestation/list', component: PrestationListComponent },
                { path: 'reclamation/prestation', component: ReclamationPrestation, children: [
                        { path: 'steps/information', component: InformationPrestation },
                        { path: 'steps/confirmation', component: ConfirmationPrestation },
                ]},
                { path: 'sinistre/list', component: SinistreListComponent },
                { path: 'demander/remboursement', component: DemandeRemboursement, children: [
                        { path: 'steps/information', component: InformationReclamation },
                        { path: 'steps/confirmation', component: ConfirmationReclamation },
                ]},
                { path: 'assure/list', component: AssureListComponent },
                { path: 'assure/detail/:id', component: AssureDetailComponent },
                { path: 'effectuer/prestation', component: EffectuerPrestation, children: [
                        { path: 'steps/information', component: InformationEffectuerPrestation },
                        { path: 'steps/documents', component: DocumentsEffectuerPrestation },
                        { path: 'steps/confirmation', component: ConfirmationEffectuerPrestation },
                ]},
            ]},

            // Routes pour la section admin
            {
                path: 'admin',
                component: AppMainComponent,
                children: [
                    { path: '', component: DashboardComponent },

                    // Autres routes de l'application admin...
                    { path: 'accounts', component: AccountCrudComponent, canActivate: [UserRouteAccessService], data: { authorities: ['ROLE_ADMIN'] } },
                    { path: 'assurances', component: AssuranceCrudComponent, canActivate: [UserRouteAccessService], data: { authorities: ['ROLE_ADMIN', 'ROLE_AGENT', 'ROLE_CLIENT'] } },
                    { path: 'assures', component: AssureCrudComponent, canActivate: [UserRouteAccessService], data: { authorities: ['ROLE_ADMIN', 'ROLE_AGENT'] } },
                    { path: 'branches', component: BrancheCrudComponent, canActivate: [UserRouteAccessService], data: { authorities: ['ROLE_ADMIN'] } },
                    { path: 'contrats/assurances', component: ContratAssuranceCrudComponent, canActivate: [UserRouteAccessService], data: { authorities: ['ROLE_ADMIN', 'ROLE_AGENT', 'ROLE_CLIENT'] } },
                    { path: 'documents', component: DocumentCrudComponent, canActivate: [UserRouteAccessService], data: { authorities: ['ROLE_ADMIN', 'ROLE_AGENT', 'ROLE_CLIENT', 'ROLE_PROVIDER'] } },
                    { path: 'dossiers/medicaux', component: DossierMedicalCrudComponent, canActivate: [UserRouteAccessService], data: { authorities: ['ROLE_ADMIN', 'ROLE_AGENT', 'ROLE_CLIENT', 'ROLE_PROVIDER'] } },
                    { path: 'financeurs', component: FinanceurCrudComponent, canActivate: [UserRouteAccessService], data: { authorities: ['ROLE_ADMIN', 'ROLE_PROVIDER'] } },
                    { path: 'fournisseurs', component: FournisseurCrudComponent, canActivate: [UserRouteAccessService], data: { authorities: ['ROLE_ADMIN'] } },
                    { path: 'garanties', component: GarantieCrudComponent, canActivate: [UserRouteAccessService], data: { authorities: ['ROLE_ADMIN', 'ROLE_AGENT', 'ROLE_CLIENT'] } },
                    { path: 'notifications', component: NotificationCrudComponent, canActivate: [UserRouteAccessService], data: { authorities: ['ROLE_ADMIN', 'ROLE_AGENT', 'ROLE_CLIENT', 'ROLE_PROVIDER'] } },
                    { path: 'paiements', component: PaiementCrudComponent, canActivate: [UserRouteAccessService], data: { authorities: ['ROLE_ADMIN', 'ROLE_AGENT', 'ROLE_CLIENT'] } },
                    { path: 'recus/paiements', component: RecuPaiementCrudComponent, canActivate: [UserRouteAccessService], data: { authorities: ['ROLE_ADMIN', 'ROLE_AGENT'] } },
                    { path: 'polices/assurances', component: PoliceAssuranceCrudComponent, canActivate: [UserRouteAccessService], data: { authorities: ['ROLE_ADMIN', 'ROLE_AGENT', 'ROLE_CLIENT'] } },
                    { path: 'prestations', component: PrestationCrudComponent, canActivate: [UserRouteAccessService], data: { authorities: ['ROLE_ADMIN', 'ROLE_PROVIDER'] } },
                    { path: 'reclamations', component: ReclamationCrudComponent, canActivate: [UserRouteAccessService], data: { authorities: ['ROLE_ADMIN', 'ROLE_AGENT', 'ROLE_CLIENT'] } },
                    { path: 'sinistres', component: SinistreCrudComponent, canActivate: [UserRouteAccessService], data: { authorities: ['ROLE_ADMIN', 'ROLE_AGENT', 'ROLE_CLIENT', 'ROLE_PROVIDER'] } },
                    { path: 'souscriptions', component: SouscriptionCrudComponent, canActivate: [UserRouteAccessService], data: { authorities: ['ROLE_ADMIN', 'ROLE_AGENT', 'ROLE_CLIENT'] } },

                    { path: 'profile', component: ProfilComponent, canActivate: [UserRouteAccessService], data: { authorities: ['ROLE_ADMIN', 'ROLE_AGENT', 'ROLE_CLIENT', 'ROLE_PROVIDER'] } },
                    { path: 'password', component: PasswordComponent, canActivate: [UserRouteAccessService], data: { authorities: ['ROLE_ADMIN', 'ROLE_AGENT', 'ROLE_CLIENT', 'ROLE_PROVIDER'] } },
                    { path: 'setting', component: SettingsComponent, canActivate: [UserRouteAccessService], data: { authorities: ['ROLE_ADMIN', 'ROLE_AGENT', 'ROLE_CLIENT', 'ROLE_PROVIDER'] } },

                    { path: 'company', component: CompanyComponent, canActivate: [UserRouteAccessService], data: { authorities: ['ROLE_ADMIN'] } },

                    // Routes pour pages d'erreurs
                    { path: 'accessdenied', component: AppAccessdeniedComponent },
                    { path: 'notfound', component: AppNotfoundComponent },
                    { path: '**', redirectTo: '/notfound' },
                ]
            },

            // Auth routes (login, register, reset password)
            { path: 'login', component: LoginComponent },
            { path: 'reset/request', component: PasswordResetInitComponent },
            { path: 'reset/finish', component: PasswordResetFinishComponent },
            { path: 'register', component: RegisterComponent },
            { path: 'scan/cni', component: ScanCniComponent },
            { path: '**', redirectTo: '/site' },
        ], {scrollPositionRestoration: 'enabled'})
    ],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
