import { Component, OnInit } from '@angular/core';
import { PrimeNGConfig } from 'primeng/api';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
    menuMode = 'slim';

    inputStyle = 'outlined';

    ripple: boolean;

    theme = 'teal-yellow';
    
    lightMenu = true;

    constructor(private primengConfig: PrimeNGConfig) {
    }

    ngOnInit() {
        this.primengConfig.ripple = true;
        this.ripple = true;
        this.loadStyle('assets/theme/theme-teal-yellow.css', 'theme-css');
        this.loadStyle('assets/layout/css/layout-teal-yellow.css', 'layout-css');
    }

    loadStyle(href: string, id: string) {
      const existingLink = document.getElementById(id) as HTMLLinkElement;
      if (existingLink) {
        existingLink.href = href;
      } else {
        const head = document.getElementsByTagName('head')[0];
        const link = document.createElement('link');
        link.id = id;
        link.rel = 'stylesheet';
        link.href = href;
        head.appendChild(link);
      }
    }
}
