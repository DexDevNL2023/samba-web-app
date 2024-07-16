import { Rule } from '../../models/rule.model';

export class Account {
  // Constructeur de la classe Account qui prend plusieurs paramètres pour initialiser les propriétés de l'objet
  constructor(
    public id: number,
    public authorities: string[],
    public email: string,
    public firstName: string | null,
    public langKey: string,
    public lastName: string | null,
    public login: string,
    public imageUrl: string | null,
    public rules: Rule[] | null,
  ) {}
}
