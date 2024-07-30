import { Rule } from '../../models/rule.model';

export class Account {
  // Constructeur de la classe Account qui prend plusieurs paramètres pour initialiser les propriétés de l'objet
  constructor(
    public id: number,
    public activated: boolean,
    public authorities: string[],
    public email: string,
    public fullName: string | null,
    public langKey: string,
    public login: string,
    public imageUrl: string | null,
    public rules: Rule[] | null,
  ) {}
}
