export class ScanRequest {
    email: string;
    password: string;
    imageUrl?: string;
    generatePassword: boolean = false;
}