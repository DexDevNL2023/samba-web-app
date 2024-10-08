export class GenericUtils {
    public static GenerateNumero(prefixe: string): string {
        // Génère un nombre aléatoire entre 0 et 99999
        const randomNumber = Math.floor(Math.random() * 100000);
        // Formate le nombre avec des zéros devant pour obtenir 5 chiffres
        const formattedNumber = String(randomNumber).padStart(5, '0');
        // Retourne le numéro avec le préfixe
        return `${prefixe}-${formattedNumber}`;
    }
}