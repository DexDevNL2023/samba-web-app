import { Component, OnInit } from '@angular/core';
import { Table, TableModule } from 'primeng/table'; // Import du composant Table de PrimeNG
import { GenericCrudService } from '../service/generic.crud.service'; // Import du service GenericCrudService
import { BaseEntity } from '../models/base-entity.model'; // Import du modèle NewBaseEntity
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'; // Import des modules Angular pour la construction de formulaires
import { AppMainComponent } from '../app.main.component';
import { DialogModule } from 'primeng/dialog';
import { ToolbarModule } from 'primeng/toolbar';
import { AccountService } from '../core/auth/account.service';
import { BaseService } from '../service/base.service';
import { PortraitComponent } from '../shared/portrait/portrait.demo.component';
import { EntityByBranch } from '../models/entity-by-branch.model';
import { MessageService } from 'primeng/api';
import readXlsxFile from 'read-excel-file';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AppRoutingModule } from '../app-routing.module';
import { BrowserModule } from '@angular/platform-browser';

@Component({
  selector: 'app-generic-crud',
  standalone: true,
  imports: [ CommonModule, RouterModule, BrowserModule, AppRoutingModule, ReactiveFormsModule, PortraitComponent, ToolbarModule, TableModule, DialogModule ],
  templateUrl: './generic.crud.component.html', // Template HTML pour ce composant
  styleUrls: ['./generic.crud.component.scss'] // Fichier de style CSS pour ce composant
})
export abstract class GenericCrudComponent<Entity extends BaseEntity> implements OnInit {
  branches: EntityByBranch<Entity>[] = [];
  data: any[] = [];
  items: Entity[] = [];
  rowsPerPageOptions = [5, 10, 20]; // Options pour le nombre d'éléments par page
  displayItemDialog: boolean = false; 
  selectedItemView: any;
  displayItemListDialog: boolean = false; 
  selectedItemListView: any;
  displayDialog: boolean = false; // Variable pour contrôler l'affichage du dialogue d'ajout/modification d'élément
  displayDeleteDialog: boolean = false; // Variable pour contrôler l'affichage du dialogue de suppression d'un élément
  displayDeleteItemsDialog: boolean = false; // Variable pour contrôler l'affichage du dialogue de suppression de plusieurs éléments
  selectedItem: Entity; // Élément de type Entity actuellement sélectionné ou en cours de modification
  selectedItems: Entity[] = []; // Tableau d'éléments de type Entity sélectionnés
  submitted: boolean = false; // Indicateur pour soumission de formulaire
  componentLink: string = '';
  importLink: string = '';
  entityName: string = '';
  moduleKey: string = '';
  expandedRows: { [key: string]: boolean } = {};
  isExpanded = false;
  isTable = true;
  formGroup: FormGroup; // Groupe de contrôles de formulaire
  // Déclaration de la variable loading pour contrôler l'affichage du skeleton loader
  loading: boolean = true;
  imageUrlPreview: string | ArrayBuffer | null = null;

  // Configuration des colonnes de la table
  cols: any[] = [];

  constructor(
    private messageService: MessageService,
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
    // Initialise les colonnes de la table
    this.getColumns();
    this.getRequiredFields();
    this.updateBreadcrumb(); // Mettre à jour le breadcrumb initial

    // Simulate fetching data from a service
    this.fetchBranches();
  }

  fetchBranches(): void {
    // Au chargement du composant, récupère tous les éléments via le service
    if(this.isTable) {
      this.service.query().subscribe(data => {
        this.items = data;
        this.loading = false; // Marque le chargement comme terminé une fois que les données sont récupérées
      });
    } else {
      this.service.queryByBranch().subscribe(data => {
        this.branches = data;
        this.items = this.branches.flatMap(branch => branch.partenaires?.flatMap(partenaire => partenaire.data) || []);
        this.loading = false; // Marque le chargement comme terminé une fois que les données sont récupérées
      });
    }
  }

  // Méthode abstraite à implémenter pour initialiser les colonnes de la table
  protected abstract getColumns(): void;

  // Méthode abstraite pour récupérer les champs nécessaires spécifiques à l'entité (à implémenter dans la classe dérivée)
  protected abstract getRequiredFields(): string[];

  private updateBreadcrumb() {
    // Mettre à jour le breadcrumb en fonction du contexte
    const breadcrumbItems = [
      { label: 'Home', routerLink: '/admin' },
      { label: this.entityName, routerLink: this.componentLink }
    ];

    this.appMain.setBreadcrumbItems(breadcrumbItems); // Call the public method instead
  }

  // Method to calculate the total number of subscriptions for a given branch
  calculateTotalSubscriptions(branch: EntityByBranch<Entity>): number {
    return branch.partenaires?.reduce((total, registrant) => total + (registrant.data?.length || 0), 0) || 0;
  }

  // Method to get the severity class based on the subscription status
  getSeverity(status: string): string {
    switch (status) {
      // Cas pour le statut de souscription
      case 'ACTIVE':
          return 'info';
      case 'ON_RISK':
          return 'success';
      case 'WATTING':
          return 'warning';
      case 'RESILIE':
          return 'danger';

      // Cas pour InsuranceType
      case 'PERSONNE':
          return 'info';
      case 'BIEN':
          return 'primary';
      case 'AGRICOLE':
          return 'success';

      // Cas pour GarantieStatus
      case 'ACTIVE':
          return 'success';
      case 'EXPIREE':
          return 'danger';
      case 'SUSPENDUE':
          return 'warning';

      // Cas pour NotificationType
      case 'PAIEMENT':
          return 'info';
      case 'SOUSCRIPTION':
          return 'primary';
      case 'SINISTRE':
          return 'danger';
      case 'REQUEST':
          return 'warning';

      // Cas pour PaymentType
      case 'PRIME':
          return 'success';
      case 'REMBOURSEMENT':
          return 'info';
      case 'PRESTATION':
          return 'primary';

      // Cas pour PaymentStatus
      case 'PENDING':
          return 'warning';
      case 'COMPLETED':
          return 'success';
      case 'FAILED':
          return 'danger';

      // Cas pour PrestationType
      case 'CONSULTATION':
      case 'HOSPITALISATION':
      case 'SOINS_PARAMEDICAUX':
      case 'RADIOLOGIE':
      case 'ANALYSES_LABORATOIRE':
      case 'PHARMACIE':
      case 'CHIRURGIE':
      case 'URGENCES':
      case 'SOINS_DENTAIRES':
      case 'SOINS_OCULAIRES':
      case 'MATERNITE':
      case 'REEDUCATION':
      case 'PSYCHOTHERAPIE':
      case 'SOINS_A_DOMICILE':
      case 'AMBULANCE':
      case 'VACCINATION':
      case 'TELEMEDECINE':
      case 'NUTRITION':
      case 'PHYSIOTHERAPIE':
      case 'AUTRES':
          return 'info';

      // Cas pour PrestationStatus
      case 'NON_REMBOURSE':
          return 'danger';
      case 'EN_ATTENTE':
          return 'warning';
      case 'REMBOURSE':
          return 'success';

      // Cas pour RapportType
      case 'PERFORMANCE':
          return 'primary';
      case 'PAIEMENT':
          return 'info';
      case 'SINISTRE':
          return 'danger';

      // Cas pour ReclamationStatus
      case 'EN_COURS':
          return 'warning';
      case 'RESOLUE':
          return 'success';
      case 'REJETEE':
          return 'danger';

      // Cas pour ClaimStatus
      case 'EN_ATTENTE':
          return 'warning';
      case 'APPROUVE':
          return 'success';
      case 'ANNULE':
          return 'danger';

      // Cas pour Gender
      case 'MALE':
          return 'info';
      case 'FEMALE':
          return 'primary';
      case 'OTHER':
          return 'warning';

      default:
          return 'default';
    }
  }

  expandAll() {
    this.isExpanded = !this.isExpanded;

    if (this.isExpanded) {
      this.branches.forEach(branch => {
        this.expandedRows[branch.name] = true;
        branch.partenaires.forEach((registrant: any) => {
          this.expandedRows[registrant.name] = true;
        });
      });
    } else {
      this.expandedRows = {};
    }
  }

  getAllFields() {
    return this.cols.map(col => col.field);
  }

  onFileSelected(event: any): void {
      const file = event.files[0];
      if (file) {
          const reader = new FileReader();
          reader.onload = (e) => {
              this.imageUrlPreview = reader.result;
          };
          reader.readAsDataURL(file);
      }
  }

  async onFileChange($event: any) {
      let listes: any[] = [];
      try {
          let input = $event.files as FileList;
          if (input.length > 0) {
          const data = await readXlsxFile(input[0]);
          data.map((row) => {
              type MyObject = {};
              if (data[0] != row) {            
              let item: MyObject = {};
              for (let index = 0; index < data[0].length; index++) {
                  const entete = data[0][index];
                  const value = row[index];
                  item[''+entete+''] = value;   
              }
              listes.push(item);
              }
          });
          console.log(listes);
          this.baseService.create(this.importLink, listes).subscribe(data => {
              console.log(data);
              if(data){
               this.ngOnInit();
              }
          });
          } else {
              this.messageService.add({ severity: 'error', summary: 'Erreur', detail: "Fichier incorrect!", life: 5000 });
          }
      } catch (e) {
          this.messageService.add({ severity: 'error', summary: 'Erreur', detail: e, life: 5000 });
      }
  }

  // Méthode pour éditer un élément spécifique
  openItemView(item: { cols: any[], data: any }) {
      this.selectedItemView = item;
      this.displayItemDialog = true;
  }

  // Méthode pour éditer un élément spécifique
  openItemListView(item: { cols: any[], data: any }) {
      this.selectedItemListView = item;
      this.displayItemListDialog = true;
  }

  // Méthode privée pour créer les contrôles de formulaire requis
  private createFormControls(): { [key: string]: FormControl } {
      const controls: { [key: string]: FormControl } = {}; // Initialise un objet vide pour les contrôles de formulaire
      const requiredFields = this.getRequiredFields(); // Récupère la liste des champs requis
      console.log(requiredFields);

      this.cols.forEach(col => { // Parcours toutes les colonnes
          const isRequired = requiredFields.includes(col.field); // Vérifie si le champ est requis
          console.log(col);
          console.log(isRequired);

          switch (col.type) {
              case 'id':
                  if (isRequired) {
                      controls[col.field] = new FormControl({ value: null, disabled: true }, Validators.required);
                  } else {
                      controls[col.field] = new FormControl({ value: null, disabled: true });
                  }
                  break;
              case 'boolean':
                  if (isRequired) {
                      controls[col.field] = new FormControl(false, Validators.required);
                  } else {
                      controls[col.field] = new FormControl(false);
                  }
                  break;
              case 'currency':
                  if (isRequired) {
                      controls[col.field] = new FormControl(0, [Validators.required, Validators.min(0)]);
                  } else {
                      controls[col.field] = new FormControl(0);
                  }
                  break;
              case 'objet':
                  if (isRequired) {
                      controls[col.field] = new FormControl(null, Validators.required);
                  } else {
                      controls[col.field] = new FormControl(null);
                  }
                  break;
              case 'list':
                  if (isRequired) {
                      controls[col.field] = new FormControl([], Validators.required);
                  } else {
                      controls[col.field] = new FormControl([]);
                  }
                  break;
              default:
                  if (isRequired) {
                      controls[col.field] = new FormControl('', Validators.required);
                  } else {
                      controls[col.field] = new FormControl('');
                  }
                  break;
          }
      });
      return controls; // Retourne les contrôles de formulaire créés
  }

  // Méthode privée pour mettre à jour les contrôles de formulaire avec les valeurs de l'élément en cours d'édition// Méthode privée pour mettre à jour les contrôles de formulaire lors de l'édition
  private updateFormControls(): void {
      this.getAllFields().forEach(field => {
          const value = this.selectedItem[field] || '';
          this.formGroup.get(field)?.setValue(value);
      });
  }

  getEnumLabel(enumType: any, value: string) {
    const enumObj = enumType.find((e: any) => e.value === value);
    return enumObj ? enumObj.label : value;
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

  // Vérifie si l'utilisateur possède l'autorisation d'accéder à un traitement donné
  hasAccessToPermission(permissionKey: string): boolean {
    return this.accountService.hasAccessToPermission(this.moduleKey, permissionKey);
  }

  exportExcel(){
    this.baseService.generateExcel(this.entityName, this.items);
  }

  printListe() {
    console.log("call service to print");
    this.baseService.printListe(this.entityName, document.getElementById('toPrint').innerHTML);
  }

  refreshPage(data){
    if(data){
     this.ngOnInit();
    }
  }
}