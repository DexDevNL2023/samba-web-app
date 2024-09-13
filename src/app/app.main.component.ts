import {Component, OnInit} from '@angular/core';
import { MenuService } from './service/app.menu.service';
import { AppComponent } from './app.component';
import { AccountService } from './core/auth/account.service';
import { Router } from '@angular/router';
import { BreadcrumbService } from './shared/breadcrumb/app.breadcrumb.service';
import { MenuItem } from 'primeng/api';
import { MessageService} from 'primeng/api';

@Component({
    selector: 'app-main',
    templateUrl: './app.main.component.html'
})
export class AppMainComponent {

    topbarMenuActive: boolean;

    overlayMenuActive: boolean;

    slimMenuActive: boolean;

    slimMenuAnchor = false;

    toggleMenuActive: boolean;

    staticMenuDesktopInactive: boolean;

    staticMenuMobileActive: boolean;

    menuClick: boolean;

    topbarItemClick: boolean;

    activeTopbarItem: any;

    resetMenu: boolean;

    menuHoverActive: boolean;

    configActive: boolean;

    configClick: boolean;

    breadcrumbItems: MenuItem[] = [];

    constructor(private accountService: AccountService, private breadcrumbService: BreadcrumbService, private messageService: MessageService, private router: Router, private menuService: MenuService, public app: AppComponent) { }

    // Méthode exécutée à l'initialisation du composant
    ngOnInit(): void {
        // Exemple de configuration initiale du breadcrumb
        this.breadcrumbItems = [
            { label: 'Home', routerLink: '/admin' }
        ];

        // Écoutez les changements dans la navigation pour mettre à jour le breadcrumb
        this.breadcrumbService.setItems(this.breadcrumbItems);

        // Vérifie si l'utilisateur est déjà authentifié
        this.accountService.identity().subscribe(() => {
        if (!this.accountService.isAuthenticated()) {
            // Redirige vers la page de login si pas authentifié
            this.router.navigate(['/login']);
        }
        });
    }

    public setBreadcrumbItems(items: any[]) {
      this.breadcrumbService.setItems(items);
    }

    public showInfoViaToast(title: string, message: string) {
        this.messageService.add({key: 'tst', severity: 'info', summary: title, detail: message });
    }

    public showWarnViaToast(title: string, message: string) {
        this.messageService.add({key: 'tst', severity: 'warn', summary: title, detail: message });
    }

    public showErrorViaToast(title: string, message: string) {
        this.messageService.add({ key: 'tst', severity: 'error', summary: title, detail: message });
    }

    public showSuccessViaToast(title: string, message: string) {
        this.messageService.add({ key: 'tst', severity: 'success', summary: title, detail: message });
    }

    onLayoutClick() {
        if (!this.topbarItemClick) {
            this.activeTopbarItem = null;
            this.topbarMenuActive = false;
        }

        if (!this.menuClick) {
            if (this.isHorizontal()) {
                this.menuService.reset();
            }

            if (this.overlayMenuActive || this.staticMenuMobileActive) {
                this.hideOverlayMenu();
            }

            if (this.slimMenuActive) {
                this.hideSlimMenu();
            }

            if (this.toggleMenuActive) {
                this.hideToggleMenu();
            }

            this.menuHoverActive = false;
        }

        if (this.configActive && !this.configClick) {
            this.configActive = false;
        }

        this.configClick = false;
        this.topbarItemClick = false;
        this.menuClick = false;
    }

    onMenuButtonClick(event) {
        this.menuClick = true;
        this.topbarMenuActive = false;

        if (this.isOverlay()) {
            this.overlayMenuActive = !this.overlayMenuActive;
        }
        if (this.isToggle()) {
            this.toggleMenuActive = !this.toggleMenuActive;
        }
        if (this.isDesktop()) {
            this.staticMenuDesktopInactive = !this.staticMenuDesktopInactive;
        } else {
            this.staticMenuMobileActive = !this.staticMenuMobileActive;
        }

        event.preventDefault();
    }

    onMenuClick($event) {
        this.menuClick = true;
        this.resetMenu = false;
    }

    onAnchorClick(event) {
        if (this.isSlim()) {
            this.slimMenuAnchor = !this.slimMenuAnchor;
        }
        event.preventDefault();
    }

    onMenuMouseEnter(event) {
        if (this.isSlim()) {
            this.slimMenuActive = true;
        }
    }

    onMenuMouseLeave(event) {
        if (this.isSlim()) {
            this.slimMenuActive = false;
        }
    }

    onTopbarMenuButtonClick(event) {
        this.topbarItemClick = true;
        this.topbarMenuActive = !this.topbarMenuActive;

        this.hideOverlayMenu();

        event.preventDefault();
    }

    onTopbarItemClick(event, item) {
        this.topbarItemClick = true;

        if (this.activeTopbarItem === item) {
            this.activeTopbarItem = null;
        } else {
            this.activeTopbarItem = item;
        }

        event.preventDefault();
    }

    onTopbarSubItemClick(event) {
        event.preventDefault();
    }

    onRippleChange(event) {
        this.app.ripple = event.checked;
    }

    onConfigClick(event) {
        this.configClick = true;
    }

    isHorizontal() {
        return this.app.menuMode === 'horizontal';
    }

    isSlim() {
        return this.app.menuMode === 'slim';
    }

    isOverlay() {
        return this.app.menuMode === 'overlay';
    }

    isToggle() {
        return this.app.menuMode === 'toggle';
    }

    isStatic() {
        return this.app.menuMode === 'static';
    }

    isMobile() {
        return window.innerWidth < 1281;
    }

    isDesktop() {
        return window.innerWidth > 1280;
    }

    isTablet() {
        const width = window.innerWidth;
        return width <= 1280 && width > 640;
    }

    hideOverlayMenu() {
        this.overlayMenuActive = false;
        this.staticMenuMobileActive = false;
    }

    hideSlimMenu() {
        this.slimMenuActive = false;
        this.staticMenuMobileActive = false;
    }

    hideToggleMenu() {
        this.toggleMenuActive = false;
        this.staticMenuMobileActive = false;
    }
}