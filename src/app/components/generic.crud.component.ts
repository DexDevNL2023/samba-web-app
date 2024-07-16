import { Component, OnInit } from '@angular/core';
import { Table, TableModule } from 'primeng/table'; // Import du composant Table de PrimeNG
import { GenericCrudService } from '../service/generic.crud.service'; // Import du service GenericCrudService
import { BaseEntity } from '../models/base-entity.model'; // Import du modèle NewBaseEntity
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms'; // Import des modules Angular pour la construction de formulaires
import { AppMainComponent } from '../app.main.component';
import { DialogModule } from 'primeng/dialog';
import { ToolbarModule } from 'primeng/toolbar';
import { AccountService } from '../core/auth/account.service';
import { BaseService } from '../service/base.service';

@Component({
  selector: 'app-generic-crud',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, ToolbarModule, TableModule, DialogModule],
  templateUrl: './generic.crud.component.html', // Template HTML pour ce composant
  styleUrls: ['./generic.crud.component.scss'] // Fichier de style CSS pour ce composant
})
export abstract class GenericCrudComponent<Entity extends BaseEntity> implements OnInit {
 
  displayDialog: boolean = false; // Variable pour contrôler l'affichage du dialogue d'ajout/modification d'élément
  displayDeleteDialog: boolean = false; // Variable pour contrôler l'affichage du dialogue de suppression d'un élément
  displayDeleteItemsDialog: boolean = false; // Variable pour contrôler l'affichage du dialogue de suppression de plusieurs éléments
  items: Entity[] = []; // Tableau d'éléments de type Entity
  selectedItem: Entity; // Élément de type Entity actuellement sélectionné ou en cours de modification
  selectedItems: Entity[] = []; // Tableau d'éléments de type Entity sélectionnés
  submitted: boolean = false; // Indicateur pour soumission de formulaire
  // Configuration des colonnes de la table
  cols: any[] = [
    { field: 'id', header: 'ID', type: 'id' },
    { field: 'product', header: 'Name', type: 'text' },
    { field: 'image', header: 'Image', type: 'image' },
    { field: 'price', header: 'Price', type: 'currency' },
    { field: 'description', header: 'Description', type: 'textarea' },
    { field: 'dateCreated', header: 'Create At', type: 'date' },
    { field: 'inventoryStatus', header: 'Status', type: 'dropdown' },
    { field: 'category', header: 'Category', type: 'entity', subfield: [{ field: 'id', header: 'ID', type: 'id' }, { field: 'name', header: 'Label', type: 'text' }]},
    { field: 'orders', header: 'Orders', type: 'entities', subfield: [{ field: 'id', header: 'ID', type: 'id' }, { field: 'dateOrder', header: 'Order At', type: 'date' }, { field: 'amount', header: 'Amount', type: 'currency' }]},
  ];
  entityName: string = ''; // Nom de l'Entity
  rowsPerPageOptions = [5, 10, 20]; // Options pour le nombre d'éléments par page
  formGroup: FormGroup; // Groupe de contrôles de formulaire
  // Déclaration de la variable loading pour contrôler l'affichage du skeleton loader
  loading: boolean = true;

  constructor(
    private baseService: BaseService,
    private accountService: AccountService,
    private fb: FormBuilder, // Service pour construire des formulaires
    private service: GenericCrudService<Entity>, // Service pour les opérations CRUD génériques
    public appMain: AppMainComponent // Donne acces aux methodes de app.main.component depuis le composant fille
  ) {
    // Initialisation du groupe de contrôles de formulaire avec les contrôles créés
    this.formGroup = this.fb.group(this.createFormControls());
  }

  ngOnInit() {
    // Au chargement du composant, récupère tous les éléments via le service
    this.service.query().subscribe(data => {
        this.items = data;
        this.loading = false; // Marque le chargement comme terminé une fois que les données sont récupérées
    });
    // Initialise les colonnes de la table
    this.initColumns();
    this.updateBreadcrumb(); // Mettre à jour le breadcrumb initial
  }

  // Méthode abstraite à implémenter pour initialiser les colonnes de la table
  abstract initColumns(): void;

  // Méthode abstraite pour récupérer les champs nécessaires spécifiques à l'entité (à implémenter dans la classe dérivée)
  protected abstract getRequiredFields(): string[];
  
  protected abstract getEntityDetails(): { name: string, link: string, isExpandable: boolean, fields: { name: string, type: string }[] };
  
  protected abstract getModuleKey(): string;

  private updateBreadcrumb() {
    // Mettre à jour le breadcrumb en fonction du contexte
    const breadcrumbItems = [
      { label: 'Home', routerLink: '/admin' },
      { label: this.getEntityDetails().name, routerLink: this.getEntityDetails().link }
    ];

    this.appMain.setBreadcrumbItems(breadcrumbItems); // Call the public method instead
  }

  // Méthode pour ouvrir le dialogue d'ajout d'un nouvel élément
  openNew() {
    this.selectedItem = {} as Entity; // Initialise un nouvel élément
    this.submitted = false; // Réinitialise le soumission du formulaire
    this.displayDialog = true; // Affiche le dialogue d'ajout/modification
  }

  // Méthode pour ouvrir le dialogue de suppression de plusieurs éléments
  deleteSelectedItems() {
    this.displayDeleteItemsDialog = true; // Affiche le dialogue de suppression de plusieurs éléments
  }

  // Méthode pour éditer un élément spécifique
  editItem(item: Entity) {
    this.selectedItem = { ...item }; // Copie l'élément à éditer dans la variable item
    this.updateFormControls(); // Met à jour les contrôles de formulaire lors de l'édition
    this.displayDialog = true; // Affiche le dialogue d'ajout/modification
  }

  // Méthode pour supprimer un élément spécifique
  deleteItem(item: Entity) {
    this.displayDeleteDialog = true; // Affiche le dialogue de suppression d'un élément
    this.selectedItem = { ...item }; // Copie l'élément à supprimer dans la variable item
  }

  // Méthode pour confirmer la suppression de plusieurs éléments sélectionnés
  confirmDeleteSelected() {
    this.displayDeleteItemsDialog = false; // Ferme le dialogue de suppression de plusieurs éléments
    this.selectedItems.forEach(selectedItem => {
      this.service.delete((selectedItem as any).id).subscribe(() => { // Supprime chaque élément sélectionné via le service
        this.items = this.items.filter(val => val !== selectedItem); // Met à jour le tableau d'éléments après suppression
      });
    });
    this.appMain.showErrorViaToast('Successful', this.entityName + ' Deleted'); // Affiche un message de succès pour la suppression
    this.selectedItems = []; // Réinitialise les éléments sélectionnés
  }

  // Méthode pour confirmer la suppression d'un élément spécifique
  confirmDelete() {
    this.displayDeleteDialog = false; // Ferme le dialogue de suppression d'un élément
    this.service.delete((this.selectedItem as any).id).subscribe(() => { // Supprime l'élément via le service
      this.items = this.items.filter(val => val !== this.selectedItem); // Met à jour le tableau d'éléments après suppression
      this.appMain.showWarnViaToast('Successful', this.entityName + ' Deleted'); // Affiche un message de succès pour la suppression
      this.selectedItem = {} as Entity; // Réinitialise l'élément
    });
  }

  // Méthode pour masquer le dialogue d'ajout/modification
  hideDialog() {
    this.displayDialog = false; // Masque le dialogue d'ajout/modification
    this.submitted = false; // Réinitialise le soumission du formulaire
    this.formGroup.reset(); // Réinitialise les contrôles de formulaire
  }

  // Méthode pour sauvegarder un nouvel élément ou mettre à jour un élément existant
  saveItem() {
    this.submitted = true; // Indique que le formulaire est soumis

    if (this.formGroup.valid) { // Vérifie la validité du formulaire
      this.selectedItem = { ...this.formGroup.value }; // Copie les valeurs du formulaire dans l'élément à sauvegarder
      if ((this.selectedItem as any).id) { // Si l'élément a un ID, effectue une mise à jour
        this.service.update(this.selectedItem).subscribe(() => { // Met à jour l'élément via le service
          this.items[this.findIndexById((this.selectedItem as any).id)] = this.selectedItem; // Met à jour le tableau d'éléments avec l'élément mis à jour
          this.appMain.showInfoViaToast('Successful', this.entityName + ' Updated'); // Affiche un message de succès pour la mise à jour
          this.items = [...this.items]; // Met à jour le tableau d'éléments
          this.displayDialog = false; // Masque le dialogue d'ajout/modification
          this.selectedItem = {} as Entity; // Réinitialise l'élément
          this.formGroup.reset(); // Réinitialise les contrôles de formulaire
        });
      } else { // Sinon, crée un nouvel élément
        this.service.create(this.selectedItem).subscribe(newItem => { // Crée un nouvel élément via le service
          this.items.push(newItem); // Ajoute le nouvel élément au tableau d'éléments
          this.appMain.showSuccessViaToast('Successful', this.entityName + ' Created'); // Affiche un message de succès pour la création
          this.items = [...this.items]; // Met à jour le tableau d'éléments
          this.displayDialog = false; // Masque le dialogue d'ajout/modification
          this.selectedItem = {} as Entity; // Réinitialise l'élément
          this.formGroup.reset(); // Réinitialise les contrôles de formulaire
        });
      }
    }
  }

  // Méthode pour trouver l'index d'un élément dans le tableau d'éléments par son ID
  findIndexById(id: string): number {
    let index = -1; // Initialise l'index à -1 (non trouvé)
    for (let i = 0; i < this.items.length; i++) { // Parcours tous les éléments du tableau
      if ((this.items[i] as any).id === id) { // Si l'ID de l'élément correspond à celui recherché
        index = i; // Met à jour l'index trouvé
        break; // Sort de la boucle
      }
    }
    return index; // Retourne l'index trouvé ou -1 si non trouvé
  }

  // Méthode pour appliquer un filtre global sur la table
  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains'); // Applique le filtre global sur la table
  }

  // Méthode privée pour créer les contrôles de formulaire requis
  private createFormControls(): { [key: string]: FormControl } {
    const controls: { [key: string]: FormControl } = {}; // Initialise un objet vide pour les contrôles de formulaire
    this.getRequiredFields().forEach(field => { // Parcours tous les champs requis
      controls[field] = new FormControl('', Validators.required); // Crée un contrôle de formulaire requis pour chaque champ
    });
    return controls; // Retourne les contrôles de formulaire créés
  }

  // Méthode privée pour mettre à jour les contrôles de formulaire avec les valeurs de l'élément en cours d'édition
  private updateFormControls(): void {
    const formValues = {}; // Initialise un objet vide pour les valeurs du formulaire
    this.getRequiredFields().forEach(field => { // Parcours tous les champs requis
      formValues[field] = this.selectedItem[field]; // Copie les valeurs de l'élément dans les valeurs du formulaire
    });
    this.formGroup.patchValue(formValues); // Met à jour les contrôles de formulaire avec les valeurs du formulaire
  }

  // Vérifie si l'utilisateur possède l'autorisation d'accéder à un traitement donné
  hasAccessToPermission(permissionKey: string): boolean {
    return this.accountService.hasAccessToPermission(this.getModuleKey(), permissionKey);
  }

  exportExcel(){
    this.baseService.generateExcel(this.getEntityDetails().name, this.items);
  }

  printListe() {
    console.log("call service to print");
    this.baseService.printListe(this.getEntityDetails().name, document.getElementById('toPrint').innerHTML);
  }

  refreshPage(data){
    if(data){
     this.ngOnInit();
    }
  }
}