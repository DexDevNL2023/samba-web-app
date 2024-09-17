export class SignupRequest {
    fullName: string;
    login: string;
    email: string;
    password: string;
    imageUrl?: string;
    generatePassword: boolean = false;
}