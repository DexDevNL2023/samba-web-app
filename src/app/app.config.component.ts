import {Component, OnInit} from '@angular/core';
import { AppComponent } from './app.component';
import { AppMainComponent } from './app.main.component';

@Component({
    selector: 'app-config',
    template: `
        <a style="cursor: pointer" id="layout-config-button" class="layout-config-button" (click)="onConfigButtonClick($event)">
            <i class="pi pi-cog"></i>
        </a>
        <div class="layout-config" [ngClass]="{'layout-config-active': appMain.configActive}" (click)="appMain.onConfigClick($event)">
            <h5>Menu Type</h5>
            <div class="field-radiobutton">
                <p-radioButton name="menuMode" value="static" [(ngModel)]="app.menuMode" inputId="mode1"></p-radioButton>
                <label for="mode1">Static</label>
            </div>
            <div class="field-radiobutton">
                <p-radioButton name="menuMode" value="overlay" [(ngModel)]="app.menuMode" inputId="mode2"></p-radioButton>
                <label for="mode2">Overlay</label>
            </div>
            <div class="field-radiobutton">
                <p-radioButton name="menuMode" value="horizontal" [(ngModel)]="app.menuMode" inputId="mode3"></p-radioButton>
                <label for="mode3">Horizontal</label>
            </div>
            <div class="field-radiobutton">
                <p-radioButton name="menuMode" value="slim" [(ngModel)]="app.menuMode" inputId="mode4"></p-radioButton>
                <label for="mode4">Slim</label>
            </div>
            <div class="field-radiobutton">
                <p-radioButton name="menuMode" value="toggle" [(ngModel)]="app.menuMode" inputId="mode5"></p-radioButton>
                <label for="mode5">Toggle</label>
            </div>

            <h5>Menu Color</h5>
            <div class="field-radiobutton">
                <p-radioButton name="lightMenu" [value]="true" [(ngModel)]="app.lightMenu" inputId="lightMenu1"></p-radioButton>
                <label for="lightMenu1">Light</label>
            </div>
            <div class="field-radiobutton">
                <p-radioButton name="lightMenu" [value]="false" [(ngModel)]="app.lightMenu" inputId="lightMenu2"></p-radioButton>
                <label for="lightMenu2">Dark</label>
            </div>

            <h5>Input Style</h5>
            <div class="field-radiobutton">
                <p-radioButton name="inputStyle" value="outlined" [(ngModel)]="app.inputStyle" inputId="inputStyle1"></p-radioButton>
                <label for="inputStyle1">Outlined</label>
            </div>
            <div class="field-radiobutton">
                <p-radioButton name="inputStyle" value="filled" [(ngModel)]="app.inputStyle" inputId="inputStyle2"></p-radioButton>
                <label for="inputStyle2">Filled</label>
            </div>

            <h5>Ripple Effect</h5>
			<p-inputSwitch [ngModel]="app.ripple" (onChange)="appMain.onRippleChange($event)"></p-inputSwitch>

            <h5>Component Themes</h5>
            <div class="layout-themes">
                <div *ngFor="let t of themes">
                    <a style="cursor: pointer" (click)="changeTheme(t.name)" [ngStyle]="{'background-color': t.color}">
                    </a>
                </div>
            </div>
        </div>
    `
})
export class AppConfigComponent implements OnInit {

    themes: any[];

    constructor(public appMain: AppMainComponent, public app: AppComponent) {}

    ngOnInit() {
        this.themes = [
            {name: 'blue-grey', color: '#3D72B4'},
            {name: 'blue-orange', color: '#147df0'},
            {name: 'cyan-deeporange', color: '#00B4DB'},
            {name: 'darkpink-cyan', color: '#C06C84'},
            {name: 'deeppurple-teal', color: '#5F2C82'},
            {name: 'green-orange', color: '#96C93D'},
            {name: 'green-pink', color: '#57CA85'},
            {name: 'green-purple', color: '#56AB2F'},
            {name: 'indigo-purple', color: '#4B79A1'},
            {name: 'indigo-yellow', color: '#4E54C8'},
            {name: 'orange-cyan', color: '#e96443'},
            {name: 'orange-indigo', color: '#F3904F'},
            {name: 'pink-cyan', color: '#E94057'},
            {name: 'pink-teal', color: '#d9427c'},
            {name: 'teal-yellow', color: '#136A8A'},
        ];
    }

    changeTheme(theme: string) {
        this.app.theme = theme;
        const layoutLink: HTMLLinkElement = document.getElementById('layout-css') as HTMLLinkElement;
        const layoutHref = 'assets/layout/css/layout-' + theme + '.css';

        this.replaceLink(layoutLink, layoutHref);

        const themeLink: HTMLLinkElement = document.getElementById('theme-css') as HTMLLinkElement;
        const themeHref = 'assets/theme/theme-' + theme + '.css';

        this.replaceLink(themeLink, themeHref);
    }

    isIE() {
        return /(MSIE|Trident\/|Edge\/)/i.test(window.navigator.userAgent);
    }

    replaceLink(linkElement, href) {
        if (this.isIE()) {
            linkElement.setAttribute('href', href);
        } else {
            const id = linkElement.getAttribute('id');
            const cloneLinkElement = linkElement.cloneNode(true);

            cloneLinkElement.setAttribute('href', href);
            cloneLinkElement.setAttribute('id', id + '-clone');

            linkElement.parentNode.insertBefore(cloneLinkElement, linkElement.nextSibling);

            cloneLinkElement.addEventListener('load', () => {
                linkElement.remove();
                cloneLinkElement.setAttribute('id', id);
            });
        }
    }

    onConfigButtonClick(event) {
        this.appMain.configActive = !this.appMain.configActive;
        this.appMain.configClick = true;
        event.preventDefault();
    }
}
