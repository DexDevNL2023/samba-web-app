export interface Subfield {
  field: string;      // Le sous-champ de l'entité correspondant à ce sous-champ
  header: string;     // Le nom affiché pour ce sous-champ
  type: string;       // Le type de donnée pour le sous-champ (ex: 'string', 'date', 'number')
  values?: any[];     // tableau de données : Liste optionnelle de valeurs pour le sous-champ
  method?: () => any[];  // La méthode values retourne un tableau de données : Liste optionnelle de valeurs pour le sous-champ
  label?: string;     // Étiquette optionnelle pour ce sous-champ
  key?: string;       // Clé optionnelle pour identifier ce sous-champ de manière unique
  access?: string[];  // Liste des rôles qui peuvent voir cette colonne, facultative
  control?: (item: any, event: any) => void;  // item etant l'objet parent, Méthode à exécuter lors du changement de valeur d'un sous-champ
}