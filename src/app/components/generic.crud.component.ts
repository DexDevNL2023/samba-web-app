import { Observable } from 'rxjs';
import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { Table } from 'primeng/table';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AppMainComponent } from '../app.main.component';
import { AccountService } from '../core/auth/account.service';
import { BaseService } from '../service/base.service';
import { MessageService } from 'primeng/api';
import readXlsxFile from 'read-excel-file';
import { Column } from '../models/column.model';
import { BaseEntity } from '../models/base-entity.model';
import { GenericCrudService } from '../service/generic.crud.service';
import { PortraitComponent } from '../shared/portrait/portrait.demo.component';

@Component({
  selector: 'app-generic-crud',
  template: ``
})
export abstract class GenericCrudComponent<Entity extends BaseEntity> implements OnInit {
  @ViewChild(PortraitComponent, { static: false }) tableComponent!: PortraitComponent;
  printPreviewVisible: boolean = false;
  rowsPerPageOptions = [5, 10, 20]; // Options pour le nombre d'éléments par page
  displayItemDialog: boolean = false;
  selectedItemView: any = {};
  displayItemListDialog: boolean = false;
  selectedItemListView: any = {};
  displayDialog: boolean = false; // Variable pour contrôler l'affichage du dialogue d'ajout/modification d'élément
  displayDeleteDialog: boolean = false; // Variable pour contrôler l'affichage du dialogue de suppression d'un élément
  displayDeleteItemsDialog: boolean = false; // Variable pour contrôler l'affichage du dialogue de suppression de plusieurs éléments
  selectedItem: Entity | null = {} as Entity; // Élément de type Entity actuellement sélectionné ou en cours de modification
  selectedItems: Entity[] = []; // Tableau d'éléments de type Entity sélectionnés
  submitted: boolean = false; // Indicateur pour soumission de formulaire
  componentLink: string = '';
  entityName: string = '';
  roleKey: string = '';
  formGroup: FormGroup; // Groupe de contrôles de formulaire
  // Déclaration de la variable loading pour contrôler l'affichage du skeleton loader
  loading: boolean = true;
  // Configuration des colonnes de la table
  cols: Column[] = [];
  items: Entity[] = [];
  permissions: { [key: string]: Observable<boolean> } = {};

  constructor(
    private messageService: MessageService,
    private baseService: BaseService,
    public accountService: AccountService,
    private fb: FormBuilder, // Service pour construire des formulaires
    private service: GenericCrudService<Entity>, // Service pour les opérations CRUD génériques
    public appMain: AppMainComponent // Donne acces aux methodes de app.main.component depuis le composant fille
  ) {}

  async ngOnInit(): Promise<void> {
    // Récupérer les champs nécessaires spécifiques à l'entité (à implémenter dans la classe dérivée)
    this.getRequiredFields();

    // Initialise les colonnes de la table
    this.initializeColumns();

    // Initialiser le formGroup ici, après que this.cols soit défini
    this.formGroup = this.fb.group(this.createFormControls());

    // Mettre à jour le breadcrumb initial
    this.updateBreadcrumb();

    // Simulate fetching data from a service
    await this.fetchDatas();

    // Initialise les autrs donnees
    this.initializeOthers();

    // Mise a jour des permissions sur les traitements
    this.updatePermissions();

    // Subscribe to role changes to update permissions dynamically
    this.accountService.getRoleState().subscribe(() => {
      // Mise a jour des permissions sur les traitements
      this.updatePermissions();
    });
  }

  // Méthode abstraite à implémenter pour initialiser les colonnes de la table
  protected abstract initializeColumns(): void;

  // Méthode abstraite à implémenter pour initialiser tous autres fonctions
  protected abstract initializeOthers(): void;

  // Méthode abstraite pour récupérer les champs nécessaires spécifiques à l'entité (à implémenter dans la classe dérivée)
  protected abstract getRequiredFields(): string[];

  protected async fetchDatas(): Promise<void> {
    // Au chargement du composant, récupère tous les éléments via le service
      try {
        this.items = await this.service.query().toPromise();
        this.loading = false; // Marque le chargement comme terminé une fois que les données sont récupérées
    } catch (error) {
      this.items = [];
      this.loading = false; // Marque le chargement comme terminé une fois que les données sont récupérées
    }
  }

  protected updateBreadcrumb() {
    // Mettre à jour le breadcrumb en fonction du contexte
    const breadcrumbItems = [
      { label: 'Home', routerLink: '/admin' },
      { label: this.entityName, routerLink: this.componentLink }
    ];

    this.appMain.setBreadcrumbItems(breadcrumbItems); // Call the public method instead
  }

  // Méthode pour vérifier si l'utilisateur a toutes les autorisations dans une liste
  hasAuthority(authorities: string[]): boolean {
    // Si la liste des autorités est vide ou non définie, retourner true (autorisations par défaut)
    if (!authorities || authorities.length === 0) {
      return true;
    }

    // Utilise accountService pour vérifier si l'utilisateur a au moins une des autorités
    const result: boolean = this.accountService.hasAnyAuthority(authorities);
    return result;
  }

  /**
   * Met à jour les valeurs des colonnes et de leurs sous-champs en exécutant les méthodes associées.
   */
  protected async updateColumnAndSubFieldValues(): Promise<void> {
    for (const column of this.cols) {
      // Mettre à jour les valeurs de la colonne
      if (column.method) {
        // Met à jour les valeurs de la colonne
        await this.updateColumnValues(column.field);
      }

      // Mettre à jour les valeurs des sous-champs si disponibles
      if (column.subfield) {
        for (const subColumn of column.subfield) {
          if (subColumn.method) {
            // Met à jour les valeurs du sous-champ
            await this.updateSubFieldValues(column.field, subColumn.field);
          }
        }
      }
    }
  }

  /**
   * Met à jour les valeurs d'une colonne spécifique.
   * @param field - Le champ de la colonne à mettre à jour.
   * @param values - Les valeurs à assigner à la colonne.
   */
  protected setColumnValues(field: string, values: any[]) {
    const column = this.cols.find(col => col.field === field);
    if (column) {
      column.values = values;
    }
  }

  /**
   * Met à jour les valeurs d'un sous-champ spécifique dans les colonnes.
   * @param parentField - Le champ parent contenant le sous-champ.
   * @param subField - Le sous-champ à mettre à jour.
   * @param values - Les valeurs à assigner au sous-champ.
   */
  protected setSubFieldValues(parentField: string, subField: string, values: any[]) {
    const parentColumn = this.cols.find(col => col.field === parentField);
    if (parentColumn && parentColumn.subfield) {
      const subColumn = parentColumn.subfield.find(sub => sub.field === subField);
      if (subColumn) {
        subColumn.values = values;
      }
    }
  }

  /**
   * Met à jour les valeurs d'une colonne spécifique en exécutant la méthode associée.
   * @param field - Le champ de la colonne à mettre à jour.
   */
  protected async updateColumnValues(field: string): Promise<void> {
    const column = this.cols.find(col => col.field === field);
    if (column && column.method) {
      // Exécute la méthode pour récupérer les valeurs
      const values = await column.method(); // Attendre les valeurs asynchrones
      this.setColumnValues(field, values); // Met à jour les valeurs de la colonne
    }
  }

  /**
   * Met à jour les valeurs d'un sous-champ spécifique dans une colonne.
   * @param parentField - Le champ parent contenant le sous-champ.
   * @param subField - Le sous-champ à mettre à jour.
   */
  protected async updateSubFieldValues(parentField: string, subField: string): Promise<void> {
    const parentColumn = this.cols.find(col => col.field === parentField);
    if (parentColumn && parentColumn.subfield) {
      const subColumn = parentColumn.subfield.find(sub => sub.field === subField);
      if (subColumn && subColumn.method) {
        // Exécute la méthode pour récupérer les valeurs du sous-champ
        const subValues = await subColumn.method(); // Attendre que la méthode asynchrone se termine
        this.setSubFieldValues(parentField, subField, subValues); // Met à jour les valeurs du sous-champ
      }
    }
  }

  protected async openItemView(parent: Entity, item: { field: string, id: number }) {
    this.selectedItem = { ...parent }; // Copie l'élément à éditer dans la variable parent
    if (!this.selectedItem || !item || item.id == null || !item.field) {
        console.error('Invalid item parameters provided.');
        return;
    }

    if (item && item.id != null && item.field) {
      const { id, field } = item;

      // Find the corresponding column
      const column = this.cols.find(col => col.field === field);
      if (column) {
        // Met à jour les valeurs de la colonne de façon asynchrone
        await this.updateColumnAndSubFieldValues();
        // Update values for the field before opening the view
        const values = column.values;

        if (values) {
          // Filter the item based on the ID
          const filteredData = this.filterItemById(id, values, 'id');

          if (filteredData) {
            // Set the selected item view
            this.selectedItemView = { cols: column.subfield || [], data: filteredData };
            this.displayItemDialog = true; // Show dialog
          } else {
              console.error(`No item found with ID: ${id} in field: ${field}`);
          }
        } else {
            console.error(`No values found for field: ${field}`);
        }
      } else {
          console.error(`Column with field: ${field} not found.`);
      }
    } else {
      console.error('Invalid item parameters provided.');
    }
  }

  protected async openItemListView(parent: Entity, item: { field: string, ids: number[] }) {
    this.selectedItem = { ...parent }; // Copie l'élément à éditer dans la variable item
    if (!this.selectedItem || !item || !item.ids || !item.field) {
        console.error('Invalid item parameters provided.');
        return;
    }

    if (item && item.ids && item.field) {
      const ids = item.ids; // List of IDs to filter
      const field = item.field; // Field of type 'list'

      // Find the corresponding column
      const column = this.cols.find(col => col.field === field);
      if (column) {
        // Met à jour les valeurs de la colonne de façon asynchrone
        await this.updateColumnAndSubFieldValues();
        // Update values for the field before opening the view
        const values = column.values;

        if (values) {
          // Filter the items based on the IDs
          const filteredDatas = this.filterItemsByIds(ids, values, 'id');

          // Set the selected item list view
          this.selectedItemListView = { cols: column.subfield || [], data: filteredDatas };
          this.displayItemListDialog = true; // Show dialog
        } else {
            console.error(`No values found for field: ${field}`);
        }
      } else {
          console.error(`Column with field: ${field} not found.`);
      }
    } else {
      console.error('Invalid item parameters provided.');
    }
  }

  /**
   * Retourne l'élément correspondant à l'ID fourni.
   * @param id - ID à rechercher.
   * @param values - Liste des éléments à filtrer.
   * @param key - Clé de l'élément à comparer (par exemple, 'id').
   * @returns - L'élément correspondant à l'ID ou `null` si aucun élément n'est trouvé.
   */
  protected filterItemById(id: number, values: any[], key: string): any | null {
      return values.find(item => item[key] === id) || null;
  }

  /**
   * Retourne les éléments correspondant aux IDs fournis.
   * @param ids - Liste des IDs à rechercher.
   * @param values - Liste des éléments à filtrer.
   * @param key - Clé de l'élément à comparer (par exemple, 'id').
   * @returns - Liste des éléments correspondant aux IDs.
   */
  protected filterItemsByIds(ids: number[], values: any[], key: string): any[] {
      return values.filter(item => ids.includes(item[key]));
  }

  // Method to get the severity class based on the entity status
  protected getSeverity(status: string): string {
    switch (status) {
        // SubscriptionStatus
        case 'ACTIVE':
            return 'info';
        case 'ON_RISK':
            return 'success';
        case 'WAITING':
            return 'warning';
        case 'RESILIE':
            return 'danger';

        // InsuranceType & ContratType
        case 'PERSONNE':
            return 'info';
        case 'BIEN':
            return 'primary';
        case 'AGRICOLE':
            return 'success';
        case 'SANTE':
            return 'warning';

        // GarantieStatus
        case 'ACTIVEE':
            return 'success';
        case 'EXPIREE':
            return 'danger';
        case 'SUSPENDUE':
            return 'warning';

        // TypeNotification
        case 'INFO':
            return 'info';
        case 'PAYMENT':
            return 'primary';
        case 'REMINDER':
            return 'warning';
        case 'CLAIM':
            return 'danger';
        case 'PROFILE':
            return 'info';

        // PaymentType
        case 'PRIME':
            return 'success';
        case 'REMBOURSEMENT':
            return 'info';
        case 'PRESTATION':
            return 'primary';

        // PaymentStatus
        case 'PENDING':
            return 'warning';
        case 'COMPLETED':
            return 'success';
        case 'FAILED':
            return 'danger';

        // PrestationType
        case 'BIEN':
            return 'primary';
        case 'AGRICOLE':
            return 'success';
        case 'PERSONNE':
            return 'info';
        case 'SANTE':
            return 'warning';

        // PrestationStatus
        case 'NON_REMBOURSE':
            return 'danger';
        case 'EN_ATTENTE':
            return 'warning';
        case 'REMBOURSE':
            return 'success';

        // RapportType
        case 'PERFORMANCE':
            return 'primary';
        case 'PAIEMENT':
            return 'info';
        case 'SINISTRE':
            return 'danger';

        // StatutReclamation & ClaimStatus
        case 'EN_COURS':
            return 'warning';
        case 'APPROUVEE':
        case 'APPROUVE':
            return 'success';
        case 'REJETEE':
        case 'ANNULE':
            return 'danger';
        case 'EN_ATTENTE':
            return 'warning';

        // Gender
        case 'MALE':
            return 'info';
        case 'FEMALE':
            return 'primary';
        case 'OTHER':
            return 'warning';

        // PaymentFrequency
        case 'MENSUEL':
            return 'info';
        case 'TRIMESTRIEL':
            return 'primary';
        case 'SEMESTRIEL':
            return 'success';
        case 'ANNUEL':
            return 'warning';

        // FinanceurType (not in initial severity mapping but added for completeness)
        case 'ASSUREUR':
            return 'primary';
        case 'MUTUELLE':
            return 'info';
        case 'ORGANISME_PUBLIC':
            return 'success';

        default:
            return 'default';
    }
  }

  protected getAllFields() {
    return this.cols.map(col => col.field);
  }

  protected onFileSelected(field: string, event: any): void {
      const file = event.files[0];
      if (file) {
          // Lecture du fichier pour une prévisualisation
          const reader = new FileReader();
          reader.onload = (e) => {
            const base64String = (reader.result as string);
            // Mise à jour de la valeur du champ dans le formGroup
            this.formGroup.get(field)?.setValue(base64String);
          };
          reader.readAsDataURL(file);

          // Optionnel : Log ou traitement selon le type de fichier
          console.log('Fichier sélectionné:', file);
      }
  }

  // Improved error handling in onFileChange()
  protected async onFileChange($event: any) {
    try {
      let input = $event.files as FileList;
      if (input.length > 0) {
        const data = await readXlsxFile(input[0]);
        const processedData = this.processExcelData(data);
        this.service.createAll(processedData).subscribe(
          data => {
            this.ngOnInit();
          },
          error => {
            this.messageService.add({ severity: 'error', summary: 'Erreur', detail: 'Échec de l\'importation.', life: 5000 });
          }
        );
      } else {
        this.messageService.add({ severity: 'error', summary: 'Erreur', detail: "Fichier incorrect!", life: 5000 });
      }
    } catch (e) {
      this.messageService.add({ severity: 'error', summary: 'Erreur', detail: e.message || 'Erreur inconnue', life: 5000 });
    }
  }

  // Helper method for processing Excel data
  protected processExcelData(data: any[]): any[] {
    let listes: any[] = [];
    data.slice(1).forEach(row => {
      let item: any = {};
      row.forEach((value, index) => {
        item[data[0][index]] = value;
      });
      listes.push(item);
    });
    return listes;
  }

  // Méthode pour créer les contrôles de formulaire avec gestion de l'état actif/inactif
  protected createFormControls(): { [key: string]: FormControl } {
    const controls: { [key: string]: FormControl } = {}; // Initialise un objet vide pour les contrôles de formulaire
    const requiredFields = this.getRequiredFields(); // Récupère la liste des champs requis

    this.cols.forEach(col => { // Parcours toutes les colonnes
        const isRequired = requiredFields.includes(col.field); // Vérifie si le champ est requis
        const isDisabled = !this.hasAuthority(col.access); // Utilise votre logique pour activer ou désactiver

        switch (col.type) {
            case 'id':
                controls[col.field] = new FormControl({ value: null, disabled: isDisabled }, isRequired ? Validators.required : null);
                break;
            case 'boolean':
                controls[col.field] = new FormControl({ value: false, disabled: isDisabled }, isRequired ? Validators.required : null);
                break;
            case 'currency':
                controls[col.field] = new FormControl({ value: 0, disabled: isDisabled }, isRequired ? [Validators.required, Validators.min(0)] : null);
                break;
            case 'image':
              // Make sure 'imageUrl' field exists and is handled properly
              controls[col.field] = new FormControl({ value: '', disabled: isDisabled }, isRequired ? Validators.required : null);
              break;
            case 'objet':
                controls[col.field] = new FormControl({ value: null, disabled: isDisabled }, isRequired ? Validators.required : null);
                break;
            case 'list':
                controls[col.field] = new FormControl({ value: [], disabled: isDisabled }, isRequired ? Validators.required : null);
                break;
            default:
                controls[col.field] = new FormControl({ value: '', disabled: isDisabled }, isRequired ? Validators.required : null);
                break;
        }
    });

    return controls; // Retourne les contrôles de formulaire créés
  }

  // Méthode privée pour mettre à jour les contrôles de formulaire avec les valeurs de l'élément en cours d'édition// Méthode privée pour mettre à jour les contrôles de formulaire lors de l'édition
  protected updateFormControls(): void {
      this.getAllFields().forEach(field => {
          const value = this.selectedItem[field] || '';
          this.formGroup.get(field)?.setValue(value);
      });
  }

  // Méthode pour activer ou désactiver les champs selon des conditions
  protected updateFieldAccessibility() {
    this.cols.forEach(col => {
        const control = this.formGroup.get(col.field);
        if (this.hasAuthority(col.access)) {
            control?.enable(); // Active le champ si l'utilisateur a l'autorisation
        } else {
            control?.disable(); // Désactive le champ si l'utilisateur n'a pas l'autorisation
        }
    });
  }

  protected getEnumLabel(enumType: any, value: string) {
    const enumObj = enumType.find((e: any) => e.value === value);
    return enumObj ? enumObj.label : value;
  }

  // Méthode pour ouvrir le dialogue d'ajout d'un nouvel élément
  protected async openNew() {
    // Initialise les autrs donnees
    this.initializeOthers();
    this.selectedItem = {} as Entity; // Initialise un nouvel élément
    // Initialiser les valeurs des colonnes et de leurs sous-champs en exécutant les méthodes associées.
    await this.updateColumnAndSubFieldValues();
    this.updateFieldAccessibility(); // Mettre a jour les acces sur les champs
    this.submitted = false; // Réinitialise le soumission du formulaire
    this.displayDialog = true; // Affiche le dialogue d'ajout/modification
  }

  // Méthode pour ouvrir le dialogue de suppression de plusieurs éléments
  protected deleteSelectedItems() {
    this.displayDeleteItemsDialog = true; // Affiche le dialogue de suppression de plusieurs éléments
  }

  // Méthode pour éditer un élément spécifique
  protected async editItem(item: Entity) {
    // Initialise les autrs donnees
    this.initializeOthers();
    this.selectedItem = { ...item }; // Copie l'élément à éditer dans la variable item
    // Initialiser les valeurs des colonnes et de leurs sous-champs en exécutant les méthodes associées.
    await this.updateColumnAndSubFieldValues();
    this.updateFormControls(); // Met à jour les contrôles de formulaire lors de l'édition
    this.updateFieldAccessibility(); // Mettre a jour les acces sur les champs
    this.displayDialog = true; // Affiche le dialogue d'ajout/modification
  }

  // Méthode pour supprimer un élément spécifique
  protected deleteItem(item: Entity) {
    this.displayDeleteDialog = true; // Affiche le dialogue de suppression d'un élément
    this.selectedItem = { ...item }; // Copie l'élément à supprimer dans la variable item
  }

  // Méthode pour confirmer la suppression de plusieurs éléments sélectionnés
  protected async confirmDeleteSelected(): Promise<void> {
      this.displayDeleteItemsDialog = false;

      const selectedIds = this.selectedItems.map((item: any) => item.id);

      if (selectedIds.length > 0) {
          try {
              await this.service.deleteAll(selectedIds).toPromise(); // Utilisation de `await` pour attendre la suppression
              this.items = this.items.filter(item => !selectedIds.includes((item as any).id));
              this.showToast('Successful', `${this.entityName} Deleted`, 'error');
              this.selectedItems = [];

              // Appel asynchrone pour récupérer les nouvelles données
              await this.fetchDatas();
          } catch (error) {
              this.showToast('Error', `Failed to delete ${this.entityName}`, 'error');
              console.error('Error deleting items:', error);
          }
      }
  }

  // Méthode pour confirmer la suppression d'un élément spécifique
  protected async confirmDelete(): Promise<void> {
      this.displayDeleteDialog = false;

      try {
          await this.service.delete((this.selectedItem as any).id).toPromise(); // Suppression avec `await`
          this.items = this.items.filter(val => val !== this.selectedItem);
          this.showToast('Successful', `${this.entityName} Deleted`, 'warn');
          this.selectedItem = {} as Entity;

          // Appel asynchrone pour récupérer les nouvelles données
          await this.fetchDatas();
      } catch (error) {
          this.showToast('Error', `Failed to delete ${this.entityName}`, 'error');
          console.error('Error deleting item:', error);
      }
  }

  // Méthode pour sauvegarder un nouvel élément ou mettre à jour un élément existant
  protected async saveItem(): Promise<void> {
      this.submitted = true;

      if (this.formGroup.valid) {
          this.selectedItem = { ...this.formGroup.value }; // Copie des valeurs du formulaire

          try {
              if ((this.selectedItem as any).id) {
                  // Mise à jour de l'élément existant
                  const updatedItem = await this.service.update(this.selectedItem).toPromise();
                  this.items[this.findIndexById((this.selectedItem as any).id)] = updatedItem;
                  this.showToast('Successful', `${this.entityName} Updated`, 'info');
              } else {
                  // Création d'un nouvel élément
                  const newItem = await this.service.create(this.selectedItem).toPromise();
                  this.items.push(newItem);
                  this.showToast('Successful', `${this.entityName} Created`, 'success');
              }

              this.items = [...this.items]; // Mise à jour des éléments
              this.displayDialog = false; // Fermer le dialogue
              this.resetForm(); // Réinitialise le formulaire
              await this.fetchDatas(); // Récupère les nouvelles données
          } catch (error) {
              this.showToast('Error', `Failed to save ${this.entityName}`, 'error');
              console.error('Error saving item:', error);
          }
      }
  }

  /**
   * Réinitialise le formulaire et les données sélectionnées.
   */
  private resetForm(): void {
      this.selectedItem = {} as Entity;
      this.formGroup.reset();
  }

  /**
   * Affiche un toast avec un message et une gravité spécifique.
   * @param title - Le titre du toast
   * @param message - Le message du toast
   * @param severity - La gravité ('success', 'info', 'warn', 'error')
   */
  private showToast(title: string, message: string, severity: 'success' | 'info' | 'warn' | 'error'): void {
    switch (severity) {
      case 'success':
        this.appMain.showSuccessViaToast(title, message);
        break;
      case 'info':
        this.appMain.showInfoViaToast(title, message);
        break;
      case 'warn':
        this.appMain.showWarnViaToast(title, message);
        break;
      case 'error':
        this.appMain.showErrorViaToast(title, message);
        break;
      default:
        this.appMain.showInfoViaToast(title, message);
        break;
    }
  }

  // Méthode pour masquer le dialogue d'ajout/modification
  protected hideDialog() {
    this.displayDialog = false; // Masque le dialogue d'ajout/modification
    this.submitted = false; // Réinitialise le soumission du formulaire
    this.formGroup.reset(); // Réinitialise les contrôles de formulaire
  }

  // Méthode pour trouver l'index d'un élément dans le tableau d'éléments par son ID
  protected findIndexById(id: string): number {
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
  protected onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains'); // Applique le filtre global sur la table
  }

  private updatePermissions(): void {
    this.permissions['WRITE_PERMISSION'] = this.accountService.hasAccessToPermission(this.roleKey, 'WRITE_PERMISSION');
    this.permissions['EDIT_PERMISSION'] = this.accountService.hasAccessToPermission(this.roleKey, 'EDIT_PERMISSION');
    this.permissions['DELET_PERMISSION'] = this.accountService.hasAccessToPermission(this.roleKey, 'DELET_PERMISSION');
    this.permissions['READ_PERMISSION'] = this.accountService.hasAccessToPermission(this.roleKey, 'READ_PERMISSION');
    this.permissions['PRINT_PERMISSION'] = this.accountService.hasAccessToPermission(this.roleKey, 'PRINT_PERMISSION');
    this.permissions['ACTIVE_ACCOUNT_PERMISSION'] = this.accountService.hasAccessToPermission(this.roleKey, 'ACTIVE_ACCOUNT_PERMISSION');
    this.permissions['CHANGE_PERMISSION'] = this.accountService.hasAccessToPermission(this.roleKey, 'CHANGE_PERMISSION');
  }

  // Vérifie si l'utilisateur possède l'autorisation d'accéder à un traitement donné
  hasAccessToPermission(permissionKey: string): Observable<boolean> {
    return this.permissions[permissionKey];
  }

  protected exportExcel(){
    this.baseService.generateExcel(this.entityName, this.items);
  }

  showPrintPreview() {
      this.printPreviewVisible = true;
  }
}