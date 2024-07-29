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
import { DocumentSinistreCrudComponent } from './components/document/document.crud.component';
import { FinanceurCrudComponent } from './components/financeur/financeur.crud.component';
 
@NgModule({
    imports: [
        RouterModule.forRoot([
            {
                path: 'admin',
                component: AppMainComponent,
                children: [
                    { path: '', component: DashboardComponent, canActivate: [UserRouteAccessService], data: { authorities: ['ROLE_ADMINISTRATOR', 'ROLE_AGENT'] } },
                    { path: 'assurances', component: AssuranceCrudComponent, canActivate: [UserRouteAccessService], data: { authorities: ['ROLE_ADMINISTRATOR', 'ROLE_AGENT', 'ROLE_CLIENT', 'ROLE_PROVIDER'] } },
                    { path: 'branches', component: BrancheCrudComponent, canActivate: [UserRouteAccessService], data: { authorities: ['ROLE_ADMINISTRATOR'] } },
                    { path: 'documents/sinistres', component: DocumentSinistreCrudComponent, canActivate: [UserRouteAccessService], data: { authorities: ['ROLE_ADMINISTRATOR', 'ROLE_AGENT', 'ROLE_CLIENT'] } },
                    { path: 'financeurs', component: FinanceurCrudComponent, canActivate: [UserRouteAccessService], data: { authorities: ['ROLE_ADMINISTRATOR', 'ROLE_PROVIDER'] } },
                    { path: 'profile', component: ProfilComponent, canActivate: [UserRouteAccessService], data: { authorities: ['ROLE_ADMINISTRATOR', 'ROLE_AGENT'] } },
                    { path: 'password', component: PasswordComponent, canActivate: [UserRouteAccessService], data: { authorities: ['ROLE_ADMINISTRATOR', 'ROLE_AGENT', 'ROLE_CLIENT', 'ROLE_PROVIDER'] } },
                    { path: 'setting', component: SettingsComponent, canActivate: [UserRouteAccessService], data: { authorities: ['ROLE_ADMINISTRATOR', 'ROLE_AGENT', 'ROLE_CLIENT', 'ROLE_PROVIDER'] } },
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
