import { ConfirmationEffectuerPrestation } from './site/effectuer-prestation/steps/confirmation.prestation';
import { DocumentsEffectuerPrestation } from './site/effectuer-prestation/steps/documents.prestation';
import { InformationEffectuerPrestation } from './site/effectuer-prestation/steps/information.prestation';
import { EffectuerPrestation } from './site/effectuer-prestation/effectuer-prestation';
import { EffectuerPrestationService } from './service/effectuer-prestation.service';
import { AssureDetailComponent } from './site/assure-detail/assure-detail.component';
import { AssureListComponent } from './site/assure-list/assure-list.component';
import { SinistreListComponent } from './site/sinistre-list/sinistre-list.component';
import { InformationPrestation } from './site/reclamation-prestation/steps/information.prestation';
import { ConfirmationPrestation } from './site/reclamation-prestation/steps/confirmation.prestation';
import { ReclamationPrestation } from './site/reclamation-prestation/reclamation-prestation';
import { PrestationListComponent } from './site/prestation-list/prestation-list.component';
import { PayerPrimeService } from './service/payer.prime.service';
import { ConfirmationPaiement } from './site/payer-prime/steps/confirmation.paiement';
import { InformationPaiement } from './site/payer-prime/steps/information.paiement';
import { PayerPrime } from './site/payer-prime/payer-prime';
import { DemandeRemboursementService } from './service/demande-remboursement.service';
import { ConfirmationReclamation } from './site/demande-remboursement/steps/confirmation.reclamation';
import { InformationReclamation } from './site/demande-remboursement/steps/information.reclamation';
import { DemandeRemboursement } from './site/demande-remboursement/demande-remboursement';
import { InformationSinistre } from './site/declaration-sinistre/steps/information.sinistre';
import { DocumentsSinistre } from './site/declaration-sinistre/steps/documents.sinistre';
import { ConfirmationSinistre } from './site/declaration-sinistre/steps/confirmation.sinistre';
import { DeclarationSinistre } from './site/declaration-sinistre/declaration-sinistre';
import { DeclareSinistreService } from './service/declare-sinistre.service';
import { ConfirmationSouscription } from './site/effectuer-souscription/steps/confirmation.souscription';
import { ModePaiementSouscription } from './site/effectuer-souscription/steps/paiement.souscription';
import { FrequencePaiementSouscription } from './site/effectuer-souscription/steps/frequence.souscription';
import { EffectuerSouscription } from './site/effectuer-souscription/effectuer-souscription';
import { EffectuerSouscriptionService } from './service/effectuer-souscription.service';
import { SouscriptionDetailComponent } from './site/souscription-detail/souscription-detail.component';
import { SouscriptionListComponent } from './site/souscription-list/souscription-list.component';
import { ProduitComponent } from './site/produit/produit.component';
import { HeaderComponent } from './site/header/header.component';
import { FooterComponent } from './site/footer/footer.component';
import { SiteComponent } from './site/main/site.component';
import { ScanCniComponent } from './account/scan-cni/scan-cni.component';
import { RecuPaiementCrudComponent } from './components/recu-paiement/recu-paiement.crud.component';
import { RecuPaiementService } from './service/recu-paiement.service';
import { RoleService } from './service/role.service';
import { PermissionService } from './service/permission.service';
import { AuthorizationService } from './service/authorization.service';
import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {DatePipe, HashLocationStrategy, LocationStrategy} from '@angular/common';
import {AppRoutingModule} from './app-routing.module';

import {AccordionModule} from 'primeng/accordion';
import {AutoCompleteModule} from 'primeng/autocomplete';
import {AvatarModule} from 'primeng/avatar';
import {AvatarGroupModule} from 'primeng/avatargroup';
import {BadgeModule} from 'primeng/badge';
import {BreadcrumbModule} from 'primeng/breadcrumb';
import {ButtonModule} from 'primeng/button';
import {CalendarModule} from 'primeng/calendar';
import {CardModule} from 'primeng/card';
import {CarouselModule} from 'primeng/carousel';
import {CascadeSelectModule} from 'primeng/cascadeselect';
import {ChartModule} from 'primeng/chart';
import {CheckboxModule} from 'primeng/checkbox';
import {ChipModule} from 'primeng/chip';
import {ChipsModule} from 'primeng/chips';
import {ConfirmDialogModule} from 'primeng/confirmdialog';
import {ConfirmPopupModule} from 'primeng/confirmpopup';
import {ColorPickerModule} from 'primeng/colorpicker';
import {ContextMenuModule} from 'primeng/contextmenu';
import {DataViewModule} from 'primeng/dataview';
import {DialogModule} from 'primeng/dialog';
import {DividerModule} from 'primeng/divider';
import {DropdownModule} from 'primeng/dropdown';
import {FieldsetModule} from 'primeng/fieldset';
import {FileUploadModule} from 'primeng/fileupload';
import {FullCalendarModule} from '@fullcalendar/angular';
import {GalleriaModule} from 'primeng/galleria';
import {ImageModule} from 'primeng/image';
import {InplaceModule} from 'primeng/inplace';
import {InputNumberModule} from 'primeng/inputnumber';
import {InputMaskModule} from 'primeng/inputmask';
import {InputSwitchModule} from 'primeng/inputswitch';
import {InputTextModule} from 'primeng/inputtext';
import {InputTextareaModule} from 'primeng/inputtextarea';
import {KnobModule} from 'primeng/knob';
import {ListboxModule} from 'primeng/listbox';
import {MegaMenuModule} from 'primeng/megamenu';
import {MenuModule} from 'primeng/menu';
import {MenubarModule} from 'primeng/menubar';
import {MessagesModule} from 'primeng/messages';
import {MessageModule} from 'primeng/message';
import {MultiSelectModule} from 'primeng/multiselect';
import {OrderListModule} from 'primeng/orderlist';
import {OrganizationChartModule} from 'primeng/organizationchart';
import {OverlayPanelModule} from 'primeng/overlaypanel';
import {PaginatorModule} from 'primeng/paginator';
import {PanelModule} from 'primeng/panel';
import {PanelMenuModule} from 'primeng/panelmenu';
import {PasswordModule} from 'primeng/password';
import {PickListModule} from 'primeng/picklist';
import {ProgressBarModule} from 'primeng/progressbar';
import {RadioButtonModule} from 'primeng/radiobutton';
import {RatingModule} from 'primeng/rating';
import {RippleModule} from 'primeng/ripple';
import {ScrollPanelModule} from 'primeng/scrollpanel';
import {ScrollTopModule} from 'primeng/scrolltop';
import {SelectButtonModule} from 'primeng/selectbutton';
import {SidebarModule} from 'primeng/sidebar';
import {SkeletonModule} from 'primeng/skeleton';
import {SlideMenuModule} from 'primeng/slidemenu';
import {SliderModule} from 'primeng/slider';
import {SplitButtonModule} from 'primeng/splitbutton';
import {SplitterModule} from 'primeng/splitter';
import {StepsModule} from 'primeng/steps';
import {TabMenuModule} from 'primeng/tabmenu';
import {TableModule} from 'primeng/table';
import {TabViewModule} from 'primeng/tabview';
import {TagModule} from 'primeng/tag';
import {TerminalModule} from 'primeng/terminal';
import {TieredMenuModule} from 'primeng/tieredmenu';
import {TimelineModule} from 'primeng/timeline';
import {ToastModule} from 'primeng/toast';
import {ToggleButtonModule} from 'primeng/togglebutton';
import {ToolbarModule} from 'primeng/toolbar';
import {TooltipModule} from 'primeng/tooltip';
import {TreeModule} from 'primeng/tree';
import {TreeTableModule} from 'primeng/treetable';
import {VirtualScrollerModule} from 'primeng/virtualscroller';

import {AppComponent} from './app.component';
import {AppMainComponent} from './app.main.component';
import {AppMenuComponent} from './shared/menu/app.menu.component';
import {AppMenuitemComponent} from './shared/menu/app.menuitem.component';
import {AppTopBarComponent} from './shared/topbar/app.topbar.component';
import {AppFooterComponent} from './shared/footer/app.footer.component';
import {AppNotfoundComponent} from './utilities/notfound/app.notfound.component';
import {AppAccessdeniedComponent} from './utilities/accessdenied/app.accessdenied.component';

import {EventService} from './service/eventservice';
import {MenuService} from './service/app.menu.service';
import {DashboardComponent} from './shared/dashboard/dashboard.component';

import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AssuranceService } from './service/assurance.service';
import { DocumentService } from './service/document.service';
import { FinanceurService } from './service/financeur.service';
import { FournisseurService } from './service/fournisseur.service';
import { GarantieService } from './service/garantie.service';
import { DossierMedicalService } from './service/dossier-medical.service';
import { NotificationService } from './service/notification.service';
import { PaiementService } from './service/paiement.service';
import { PoliceAssuranceService } from './service/police-assurance.service';
import { PrestationService } from './service/prestation.service';
import { RapportService } from './service/rapport.service';
import { ReclamationService } from './service/reclamation.service';
import { SinistreService } from './service/sinistre.service';
import { SouscriptionService } from './service/souscription.service';
import { AssureService } from './service/assure.service';
import { RouterModule } from '@angular/router';
import LoginComponent from './login/login.component';
import PasswordComponent from './account/password/password.component';
import PasswordResetFinishComponent from './account/password-reset/finish/password-reset-finish.component';
import PasswordResetInitComponent from './account/password-reset/init/password-reset-init.component';
import RegisterComponent from './account/register/register.component';
import SettingsComponent from './account/settings/settings.component';
import { AccountService } from './core/auth/account.service';
import { StateStorageService } from './core/auth/state-storage.service';
import { AuthExpiredInterceptor } from './core/interceptor/auth-expired.interceptor';
import { AuthInterceptor } from './core/interceptor/auth.interceptor';
import { LoginService } from './login/login.service';
import { CompanyService } from './service/company.service';
import { BaseService } from './service/base.service';
import { UserRouteAccessService } from './core/auth/user-route-access.service';
import { ProfilComponent } from './account/profil/profil.component';
import { BreadcrumbService } from './shared/breadcrumb/app.breadcrumb.service';
import { BrancheService } from './service/branche.service';
import { AppBreadcrumbComponent } from './shared/breadcrumb/app.breadcrumb.component';
import { MessageService } from 'primeng/api';
import { AppConfigComponent } from './app.config.component';
import { DashboardService } from './service/dashboard.service';
import { AssuranceCrudComponent } from './components/assurance/assurance.crud.component';
import { PortraitComponent } from './shared/portrait/portrait.demo.component';
import { BrancheCrudComponent } from './components/branche/branche.crud.component';
import { DocumentCrudComponent } from './components/document/document.crud.component';
import { FinanceurCrudComponent } from './components/financeur/financeur.crud.component';
import { DossierMedicalCrudComponent } from './components/dossier-medical/dossier-medical.crud.component';
import { FournisseurCrudComponent } from './components/fournisseur/fournisseur.crud.component';
import { GarantieCrudComponent } from './components/garantie/garantie.crud.component';
import { NotificationCrudComponent } from './components/notification/notification.crud.component';
import { AssureCrudComponent } from './components/assure/assure.crud.component';
import { PaiementCrudComponent } from './components/paiement/paiement.crud.component';
import { PoliceAssuranceCrudComponent } from './components/police-assurance/police-assurance.crud.component';
import { PrestationCrudComponent } from './components/prestation/prestation.crud.component';
import { ReclamationCrudComponent } from './components/reclamation/reclamation.crud.component';
import { SinistreCrudComponent } from './components/sinistre/sinistre.crud.component';
import { SouscriptionCrudComponent } from './components/souscription/souscription.crud.component';
import { AccountCrudService } from './service/account.crud.service';
import { AccountCrudComponent } from './components/account/account.crud.component';
import { ContratAssuranceService } from './service/contrat-assurance.service';
import { ContratAssuranceCrudComponent } from './components/contrat-assurance/contrat-assurance.crud.component';
import { AuthentificationService } from './service/authentification.service';
import { CompanyComponent } from './company/company.component';
import { ProduitDetailComponent } from './site/produit-detail/produit-detail.component';

@NgModule({
    imports: [
        BrowserModule,
        AppRoutingModule,
        HttpClientModule,
        BrowserAnimationsModule,
        AccordionModule,
        AutoCompleteModule,
        AvatarGroupModule,
        AvatarModule,
        BadgeModule,
        BreadcrumbModule,
        ButtonModule,
        CalendarModule,
        CardModule,
        CarouselModule,
        CascadeSelectModule,
        ChartModule,
        CheckboxModule,
        ChipsModule,
        ChipModule,
        ConfirmDialogModule,
        ConfirmPopupModule,
        ColorPickerModule,
        ContextMenuModule,
        DataViewModule,
        DialogModule,
        DividerModule,
        DropdownModule,
        FieldsetModule,
        FileUploadModule,
        FullCalendarModule,
        GalleriaModule,
        ImageModule,
        InplaceModule,
        InputNumberModule,
        InputMaskModule,
        InputSwitchModule,
        InputTextModule,
        InputTextareaModule,
        KnobModule,
        ListboxModule,
        MegaMenuModule,
        MenuModule,
        MenubarModule,
        MessageModule,
        MessagesModule,
        MultiSelectModule,
        OrderListModule,
        OrganizationChartModule,
        OverlayPanelModule,
        PaginatorModule,
        PanelModule,
        PanelMenuModule,
        PasswordModule,
        PickListModule,
        ProgressBarModule,
        RadioButtonModule,
        RatingModule,
        RippleModule,
        ScrollPanelModule,
        ScrollTopModule,
        SelectButtonModule,
        SidebarModule,
        SkeletonModule,
        SlideMenuModule,
        SliderModule,
        SplitButtonModule,
        SplitterModule,
        StepsModule,
        TableModule,
        TabMenuModule,
        TabViewModule,
        TagModule,
        TerminalModule,
        TieredMenuModule,
        TimelineModule,
        ToastModule,
        ToggleButtonModule,
        ToolbarModule,
        TooltipModule,
        TreeModule,
        TreeTableModule,
        VirtualScrollerModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule,
    ],
    declarations: [
        AppComponent,
        AppMainComponent,
        AppMenuComponent,
        AppMenuitemComponent,
        AppConfigComponent,
        AppTopBarComponent,
        AppFooterComponent,
        DashboardComponent,
        AppNotfoundComponent,
        AppAccessdeniedComponent,
        LoginComponent,
        PasswordComponent,
        PasswordResetFinishComponent,
        PasswordResetInitComponent,
        RegisterComponent,
        SettingsComponent,
        ProfilComponent,
        AppBreadcrumbComponent,
        AccountCrudComponent,
        AssuranceCrudComponent,
        AssureCrudComponent,
        BrancheCrudComponent,
        ContratAssuranceCrudComponent,
        DocumentCrudComponent,
        DossierMedicalCrudComponent,
        FinanceurCrudComponent,
        FournisseurCrudComponent,
        GarantieCrudComponent,
        NotificationCrudComponent,
        PaiementCrudComponent,
        RecuPaiementCrudComponent,
        PoliceAssuranceCrudComponent,
        PrestationCrudComponent,
        ReclamationCrudComponent,
        SinistreCrudComponent,
        SouscriptionCrudComponent,
        PortraitComponent,
        CompanyComponent,
        ScanCniComponent,
        SiteComponent,
        FooterComponent,
        HeaderComponent,
        ProduitComponent,
        ProduitDetailComponent,
        SouscriptionListComponent,
        SouscriptionDetailComponent,
        EffectuerSouscription,
        FrequencePaiementSouscription,
        ModePaiementSouscription,
        ConfirmationSouscription,
        DeclarationSinistre,
        InformationSinistre,
        DocumentsSinistre,
        ConfirmationSinistre,
        DemandeRemboursement,
        InformationReclamation,
        ConfirmationReclamation,
        PayerPrime,
        InformationPaiement,
        ConfirmationPaiement,
        PrestationListComponent,
        ReclamationPrestation,
        ConfirmationPrestation,
        InformationPrestation,
        SinistreListComponent,
        AssureListComponent,
        AssureDetailComponent,
        EffectuerPrestation,
        InformationEffectuerPrestation,
        DocumentsEffectuerPrestation,
        ConfirmationEffectuerPrestation,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    providers: [
        {provide: LocationStrategy, useClass: HashLocationStrategy}, DatePipe,
        BreadcrumbService, EventService, MenuService, AssuranceService, DocumentService, UserRouteAccessService,
        FinanceurService, FournisseurService, GarantieService, DossierMedicalService, BaseService, BrancheService,
        NotificationService, PaiementService, PoliceAssuranceService, PrestationService, AccountCrudService,
        RapportService, ReclamationService, SinistreService, SouscriptionService, AssureService, LoginService,
        RoleService, PermissionService, AuthorizationService, CompanyService, MessageService, AuthentificationService,
        AccountService, StateStorageService, CompanyService, DashboardService, ContratAssuranceService, RecuPaiementService,
        EffectuerSouscriptionService, DeclareSinistreService, DemandeRemboursementService, PayerPrimeService, EffectuerPrestationService,
        {
          provide: HTTP_INTERCEPTORS,
          useClass: AuthInterceptor,
          multi: true,
        },
        {
          provide: HTTP_INTERCEPTORS,
          useClass: AuthExpiredInterceptor,
          multi: true,
        },
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
