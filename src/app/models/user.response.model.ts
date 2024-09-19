import { Gender } from './assure.model';
import { Authority } from './account.model';

export class UserResponse {
    id?: number;

    usingQr: boolean = false;
    email!: string;
    telephone?: string;
    adresse?: string;
    imageUrl?: string;
    langKey?: string;
    login!: string;

    // Admin et agent
    actived?: boolean;
    authority?: Authority;
    fullName?: string;

    // Client
    numNiu?: string;
    lastName?: string;
    firstName?: string;
    dateNaissance?: Date;
    numCni?: string;
    sexe?: Gender;
    signature?: string;

    // Provider
    nom?: string;
    servicesFournis?: string;
}
