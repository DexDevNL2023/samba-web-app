import { Component } from '@angular/core';
import { PrimeNGConfig } from 'primeng/api';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html'
})
export class AppComponent {
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
    }
}
