import { Subfield } from "./subfield.model";

export interface Column {
  field: string;      // Le champ de l'entité correspondant à cette colonne
  header: string;     // Le nom affiché pour cette colonne
  type: string;       // Le type de donnée (ex: 'string', 'number', 'date', 'image', etc.)
  values?: any[] | any;     // tableau de données : Liste optionnelle de valeurs
  method?: () => any[] | any;  // La méthode values retourne un tableau de données : Liste optionnelle de valeurs (ex: pour un champ dropdown ou sélection multiple)
  label?: string;     // Étiquette optionnelle pour la colonne
  key?: string;       // Clé optionnelle pour identifier un champ unique
  access?: string[];  // Liste des rôles qui peuvent voir cette colonne, facultative
  control?: (item: any[] | any, event: any) => void;  // item etant l'objet parent, Méthode à exécuter lors du changement de valeur d'un champ
  action?: (item: any[] | any) => void;  // Nouvelle propriété pour stocker une méthode liée à une action sur le click
  subfield?: Subfield[];  // Sous-champs optionnels pour les colonnes complexes (ex: objets imbriqués)
}