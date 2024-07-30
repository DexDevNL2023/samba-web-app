import { Component, OnInit, ViewChild } from '@angular/core';
import { Table } from 'primeng/table';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AppMainComponent } from '../../app.main.component';
import { AccountService } from '../../core/auth/account.service';
import { BaseService } from '../../service/base.service';
import { EntityByBranch } from '../../models/entity-by-branch.model';
import { MessageService } from 'primeng/api';
import readXlsxFile from 'read-excel-file';
import { Column } from '../../models/column.model';
import { Paiement, PaymentStatus, PaymentType } from '../../models/paiement.model';
import { PaiementService } from '../../service/paiement.service';
import { PortraitComponent } from '../../shared/portrait/portrait.demo.component';
import { PaymentFrequency, Souscription, SubscriptionStatus } from '../../models/souscription.model';

@Component({
  selector: 'app-paiement-crud',
  templateUrl: './../generic.crud.component.html'
})
export class PaiementCrudComponent implements OnInit {
  @ViewChild(PortraitComponent, { static: false }) tableComponent!: PortraitComponent;
  printPreviewVisible: boolean = false;
  rowsPerPageOptions = [5, 10, 20]; // Options pour le nombre d'éléments par page
  displayItemDialog: boolean = false; 
  selectedItemView: any;
  displayItemListDialog: boolean = false; 
  selectedItemListView: any;
  displayDialog: boolean = false; // Variable pour contrôler l'affichage du dialogue d'ajout/modification d'élément
  displayDeleteDialog: boolean = false; // Variable pour contrôler l'affichage du dialogue de suppression d'un élément
  displayDeleteItemsDialog: boolean = false; // Variable pour contrôler l'affichage du dialogue de suppression de plusieurs éléments
  selectedItem: Paiement; // Élément de type Paiement actuellement sélectionné ou en cours de modification
  selectedItems: Paiement[] = []; // Tableau d'éléments de type Paiement sélectionnés
  submitted: boolean = false; // Indicateur pour soumission de formulaire
  componentLink: string = '';
  importLink: string = '';
  entityName: string = '';
  moduleKey: string = '';
  isTable = true;
  expandedRows: { [key: string]: boolean } = {};
  isExpanded = false;
  formGroup: FormGroup; // Groupe de contrôles de formulaire
  // Déclaration de la variable loading pour contrôler l'affichage du skeleton loader
  loading: boolean = true;
  imageUrlPreview: string | ArrayBuffer | null = null;
  // Configuration des colonnes de la table
  cols: Column[] = [
    { field: 'id', header: 'ID', type: 'id' },
    { field: 'numeroPaiement', header: 'Num Paiement', type: 'text' },
    { field: 'datePaiement', header: 'Date du paiement', type: 'date' },
    { field: 'montant', header: 'Montant', type: 'currency' },
    { field: 'type', header: 'Type', type: 'enum', values: [], label: 'label', key: 'value' },
    { field: 'status', header: 'Status', type: 'enum', values: [], label: 'label', key: 'value' },
    { field: 'souscription', header: 'Souscription', type: 'objet', values: [], label: 'numeroSouscription', key: 'id', subfield: [
      { field: 'id', header: 'ID', type: 'id' },
      { field: 'numeroSouscription', header: 'Num Souscription', type: 'text' },
      { field: 'dateSouscription', header: 'Date de souscription', type: 'date' },
      { field: 'dateExpiration', header: 'Date d\'expiration', type: 'date' },
      { field: 'status', header: 'Status', type: 'enum', values: [], label: 'label', key: 'value' },
      { field: 'frequencePaiement', header: 'Frequency', type: 'enum', values: [], label: 'label', key: 'value' }
      ]
    }
  ];
  
  items: Paiement[] = [
    // Paiements pour Assurance Santé
    {
      id: 1,
      numeroPaiement: 'P001',
      datePaiement: new Date('2024-01-15'),
      montant: 60000,
      type: PaymentType.PRIME,
      status: PaymentStatus.COMPLETED,
      souscription: 3
    },
    {
      id: 2,
      numeroPaiement: 'P002',
      datePaiement: new Date('2024-01-20'),
      montant: 70000,
      type: PaymentType.PRIME,
      status: PaymentStatus.PENDING,
      souscription: 2
    },
  
    // Paiements pour Assurance Automobile
    {
      id: 3,
      numeroPaiement: 'P003',
      datePaiement: new Date('2024-02-10'),
      montant: 25000,
      type: PaymentType.REMBOURSEMENT,
      status: PaymentStatus.COMPLETED,
      souscription: 4
    },
    {
      id: 4,
      numeroPaiement: 'P004',
      datePaiement: new Date('2024-03-05'),
      montant: 35000,
      type: PaymentType.REMBOURSEMENT,
      status: PaymentStatus.FAILED,
      souscription: 1
    },
  
    // Paiements pour Assurance Agricole
    {
      id: 5,
      numeroPaiement: 'P005',
      datePaiement: new Date('2024-04-15'),
      montant: 40000,
      type: PaymentType.PRESTATION,
      status: PaymentStatus.COMPLETED,
      souscription: 1
    },
    {
      id: 6,
      numeroPaiement: 'P006',
      datePaiement: new Date('2024-05-20'),
      montant: 50000,
      type: PaymentType.PRESTATION,
      status: PaymentStatus.PENDING,
      souscription: 3
    },
  
    // Paiements pour Assurance Vie
    {
      id: 7,
      numeroPaiement: 'P007',
      datePaiement: new Date('2024-06-25'),
      montant: 200000,
      type: PaymentType.PRIME,
      status: PaymentStatus.COMPLETED,
      souscription: 2
    },
    {
      id: 8,
      numeroPaiement: 'P008',
      datePaiement: new Date('2024-07-10'),
      montant: 120000,
      type: PaymentType.PRIME,
      status: PaymentStatus.PENDING,
      souscription: 4
    }
  ]; 
  branches: EntityByBranch<Paiement>[] = [
      {
          name: 'Branch A',
          partenaires: [
              {
                  name: 'Registrant A1',
                  data: this.items // Reuse existing items
              }
          ]
      },
      {
          name: 'Branch B',
          partenaires: [
              {
                  name: 'Registrant B1',
                  data: this.items // Reuse existing items
              }
          ]
      }
  ];
  souscriptions: Souscription[] = [
    {
      id: 1,
      numeroSouscription: 'SUB001',
      dateSouscription: new Date('2023-01-01'),
      dateExpiration: new Date('2024-01-01'),
      status: 'ACTIVE',
      frequencePaiement: 'MENSUEL',
      assure: 1,
      police: 1,
      paiements: [1, 2, 3],
      sinistres: [1, 2]
    },
    {
      id: 2,
      numeroSouscription: 'SUB002',
      dateSouscription: new Date('2022-06-01'),
      dateExpiration: new Date('2023-06-01'),
      status: 'ON_RISK',
      frequencePaiement: 'ANNUEL',
      assure: 2,
      police: 2,
      paiements: [4],
      sinistres: [3]
    },
    {
      id: 3,
      numeroSouscription: 'SUB003',
      dateSouscription: new Date('2024-02-15'),
      dateExpiration: new Date('2025-02-15'),
      status: 'WAITING',
      frequencePaiement: 'TRIMESTRIEL',
      assure: 3,
      police: 3,
      paiements: [5, 6],
      sinistres: []
    },
    {
      id: 4,
      numeroSouscription: 'SUB004',
      dateSouscription: new Date('2021-09-01'),
      dateExpiration: new Date('2022-09-01'),
      status: 'RESILIE',
      frequencePaiement: 'SEMESTRIEL',
      assure: 4,
      police: 4,
      paiements: [7, 8],
      sinistres: [4]
    }
  ];
  
  // Liste pour Gender
  paymentTypes = [
    { label: 'Prime', value: PaymentType.PRIME },
    { label: 'Remboursement', value: PaymentType.REMBOURSEMENT },
    { label: 'Prestation', value: PaymentType.PRESTATION }
  ];
  paymentStatuses = [
    { label: 'En Attente', value: PaymentStatus.PENDING },
    { label: 'Complété', value: PaymentStatus.COMPLETED },
    { label: 'Échoué', value: PaymentStatus.FAILED }
  ];
  frequencies = [
    { label: 'Annuel', value: PaymentFrequency.ANNUEL },
    { label: 'Mensuel', value: PaymentFrequency.MENSUEL },
    { label: 'Semestriel', value: PaymentFrequency.SEMESTRIEL },
    { label: 'Trimestriel', value: PaymentFrequency.TRIMESTRIEL }
  ];
  status = [
    { label: 'Activee', value: SubscriptionStatus.ACTIVE },
    { label: 'On risk', value: SubscriptionStatus.ON_RISK },
    { label: 'Resiliee', value: SubscriptionStatus.RESILIE },
    { label: 'En attente', value: SubscriptionStatus.WAITING }
  ];

  constructor(
    private messageService: MessageService,
    private baseService: BaseService,
    private accountService: AccountService,
    private fb: FormBuilder, // Service pour construire des formulaires
    private service: PaiementService, // Service pour les opérations CRUD génériques
    public appMain: AppMainComponent // Donne acces aux methodes de app.main.component depuis le composant fille
  ) {
    // Initialisation du groupe de contrôles de formulaire avec les contrôles créés
    this.formGroup = this.fb.group(this.createFormControls());
    this.entityName = 'Paiement';
    this.componentLink = '/admin/paiements';
    this.importLink = '/import-paiement';
    this.moduleKey = 'PAIEMENT_MODULE';
    this.isTable = true;
  }

  ngOnInit() {
    this.initializeData();
    // Initialise les colonnes de la table
    //this.loadSouscriptions();
    this.assignColumnValues();
    this.getRequiredFields();
    this.updateBreadcrumb(); // Mettre à jour le breadcrumb initial

    // Simulate fetching data from a service
    //this.fetchBranches();
  }

  // Sample data initialization
  private initializeData(): void {
    this.loading = false;
  }

  // Chargement des souscriptions associés à une assure
  loadSouscriptions(): void {
    this.service.getAllSouscriptions().subscribe((souscriptions: Souscription[]) => {
        this.souscriptions = souscriptions;
    });
  }

  // Méthode abstraite pour récupérer les champs nécessaires spécifiques à l'entité (à implémenter dans la classe dérivée)
  protected getRequiredFields(): string[] { // Ajoutez le modificateur override
    return ['numeroPaiement', 'montant'];
  }

  /**
   * Assigner les valeurs aux colonnes en fonction des champs spécifiés.
   */
  protected assignColumnValues(): void { // Ajoutez le modificateur override
    this.setColumnValues('type', this.paymentTypes);
    this.setColumnValues('status', this.paymentStatuses);
    this.setColumnValues('souscription', this.souscriptions);
    this.setSubFieldValues('souscription', 'status', this.status);
    this.setSubFieldValues('souscription', 'frequencePaiement', this.frequencies);
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

  protected fetchBranches(): void {
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

  protected updateBreadcrumb() {
    // Mettre à jour le breadcrumb en fonction du contexte
    const breadcrumbItems = [
      { label: 'Home', routerLink: '/admin' },
      { label: this.entityName, routerLink: this.componentLink }
    ];

    this.appMain.setBreadcrumbItems(breadcrumbItems); // Call the public method instead
  }

  /**
   * Ouvre la vue d'un élément spécifique à partir de l'ID et du champ.
   * @param item - L'objet contenant les informations sur le champ et l'ID.
   */
  openItemView(item: { field: string, id: number }) {
      if (item && item.id != null && item.field) {
          const { id, field } = item;

          // Trouver la colonne correspondante à partir des colonnes configurées
          const column = this.cols.find(col => col.field === field);

          if (column) {
              // Assurer que la colonne a des valeurs à filtrer
              const values = column.values;

              if (values) {
                  // Filtrer l'élément en fonction des IDs et du champ clé
                  const filteredData = this.filterItemById(id, values, 'id');

                  if (filteredData) {
                      // Configurer la vue de l'élément avec les colonnes et l'élément trouvé
                      this.selectedItemView = { cols: column.subfield || [], data: filteredData };
                      this.displayItemDialog = true;
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

  /**
   * Retourne l'élément correspondant à l'ID fourni.
   * @param id - ID à rechercher.
   * @param values - Liste des éléments à filtrer.
   * @param key - Clé de l'élément à comparer (par exemple, 'id').
   * @returns - L'élément correspondant à l'ID ou `null` si aucun élément n'est trouvé.
   */
  private filterItemById(id: number, values: any[], key: string): any | null {
      return values.find(item => item[key] === id) || null;
  }

  /**
   * Ouvre la vue de la liste des éléments en filtrant selon les IDs fournis.
   * @param item - L'objet contenant les colonnes et les données de l'élément.
   */
  openItemListView(item: { field: string, ids: number[] }) {
      if (item && item.ids && item.field) {
          const ids = item.ids; // Liste des IDs à filtrer
          const field = item.field; // Champ de type 'list'

          // Trouver la colonne correspondante à partir des colonnes configurées
          const column = this.cols.find(col => col.field === field);

          if (column) {
              // Assurer que la colonne a des valeurs à filtrer
              const values = column.values;
              if (values) {
                  // Filtrer les éléments en fonction des IDs et du champ clé
                  const filteredDatas = this.filterItemsByIds(ids, values, 'id');
                  
                  // Configurer la vue de la liste avec les colonnes et les données filtrées
                  this.selectedItemListView = { cols: column.subfield || [], data: filteredDatas };
                  this.displayItemListDialog = true;
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
   * Retourne les éléments correspondant aux IDs fournis.
   * @param ids - Liste des IDs à rechercher.
   * @param values - Liste des éléments à filtrer.
   * @param key - Clé de l'élément à comparer (par exemple, 'id').
   * @returns - Liste des éléments correspondant aux IDs.
   */
  private filterItemsByIds(ids: number[], values: any[], key: string): any[] {
      return values.filter(item => ids.includes(item[key]));
  }

  // Method to calculate the total number of subscriptions for a given branch
  protected calculateTotalSubscriptions(branch: EntityByBranch<Paiement>): number {
    return branch.partenaires?.reduce((total, registrant) => total + (registrant.data?.length || 0), 0) || 0;
  }

  // Method to get the severity class based on the subscription status
  protected getSeverity(status: string): string {
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

  protected expandAll() {
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

  protected getAllFields() {
    return this.cols.map(col => col.field);
  }

  protected onFileSelected(event: any): void {
      const file = event.files[0];
      if (file) {
          const reader = new FileReader();
          reader.onload = (e) => {
              this.imageUrlPreview = reader.result;
          };
          reader.readAsDataURL(file);
      }
  }

  // Improved error handling in onFileChange()
  protected async onFileChange($event: any) {
    try {
      let input = $event.files as FileList;
      if (input.length > 0) {
        const data = await readXlsxFile(input[0]);
        const processedData = this.processExcelData(data);
        this.baseService.create(this.importLink, processedData).subscribe(
          data => {
            console.log(data);
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

  // Méthode privée pour créer les contrôles de formulaire requis
  protected createFormControls(): { [key: string]: FormControl } {
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
  protected updateFormControls(): void {
      this.getAllFields().forEach(field => {
          const value = this.selectedItem[field] || '';
          this.formGroup.get(field)?.setValue(value);
      });
  }

  protected getEnumLabel(enumType: any, value: string) {
    const enumObj = enumType.find((e: any) => e.value === value);
    return enumObj ? enumObj.label : value;
  }

  // Méthode pour ouvrir le dialogue d'ajout d'un nouvel élément
  protected openNew() {
    this.selectedItem = {} as Paiement; // Initialise un nouvel élément
    this.submitted = false; // Réinitialise le soumission du formulaire
    this.displayDialog = true; // Affiche le dialogue d'ajout/modification
  }

  // Méthode pour ouvrir le dialogue de suppression de plusieurs éléments
  protected deleteSelectedItems() {
    this.displayDeleteItemsDialog = true; // Affiche le dialogue de suppression de plusieurs éléments
  }

  // Méthode pour éditer un élément spécifique
  protected editItem(item: Paiement) {
    this.selectedItem = { ...item }; // Copie l'élément à éditer dans la variable item
    this.updateFormControls(); // Met à jour les contrôles de formulaire lors de l'édition
    this.displayDialog = true; // Affiche le dialogue d'ajout/modification
  }

  // Méthode pour supprimer un élément spécifique
  protected deleteItem(item: Paiement) {
    this.displayDeleteDialog = true; // Affiche le dialogue de suppression d'un élément
    this.selectedItem = { ...item }; // Copie l'élément à supprimer dans la variable item
  }

  // Méthode pour confirmer la suppression de plusieurs éléments sélectionnés
  protected confirmDeleteSelected() {
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
  protected confirmDelete() {
    this.displayDeleteDialog = false; // Ferme le dialogue de suppression d'un élément
    this.service.delete((this.selectedItem as any).id).subscribe(() => { // Supprime l'élément via le service
      this.items = this.items.filter(val => val !== this.selectedItem); // Met à jour le tableau d'éléments après suppression
      this.appMain.showWarnViaToast('Successful', this.entityName + ' Deleted'); // Affiche un message de succès pour la suppression
      this.selectedItem = {} as Paiement; // Réinitialise l'élément
    });
  }

  // Méthode pour masquer le dialogue d'ajout/modification
  protected hideDialog() {
    this.displayDialog = false; // Masque le dialogue d'ajout/modification
    this.submitted = false; // Réinitialise le soumission du formulaire
    this.formGroup.reset(); // Réinitialise les contrôles de formulaire
  }

  // Méthode pour sauvegarder un nouvel élément ou mettre à jour un élément existant
  protected saveItem() {
    this.submitted = true; // Indique que le formulaire est soumis

    if (this.formGroup.valid) { // Vérifie la validité du formulaire
      this.selectedItem = { ...this.formGroup.value }; // Copie les valeurs du formulaire dans l'élément à sauvegarder
      if ((this.selectedItem as any).id) { // Si l'élément a un ID, effectue une mise à jour
        this.service.update(this.selectedItem).subscribe(() => { // Met à jour l'élément via le service
          this.items[this.findIndexById((this.selectedItem as any).id)] = this.selectedItem; // Met à jour le tableau d'éléments avec l'élément mis à jour
          this.appMain.showInfoViaToast('Successful', this.entityName + ' Updated'); // Affiche un message de succès pour la mise à jour
          this.items = [...this.items]; // Met à jour le tableau d'éléments
          this.displayDialog = false; // Masque le dialogue d'ajout/modification
          this.selectedItem = {} as Paiement; // Réinitialise l'élément
          this.formGroup.reset(); // Réinitialise les contrôles de formulaire
        });
      } else { // Sinon, crée un nouvel élément
        this.service.create(this.selectedItem).subscribe(newItem => { // Crée un nouvel élément via le service
          this.items.push(newItem); // Ajoute le nouvel élément au tableau d'éléments
          this.appMain.showSuccessViaToast('Successful', this.entityName + ' Created'); // Affiche un message de succès pour la création
          this.items = [...this.items]; // Met à jour le tableau d'éléments
          this.displayDialog = false; // Masque le dialogue d'ajout/modification
          this.selectedItem = {} as Paiement; // Réinitialise l'élément
          this.formGroup.reset(); // Réinitialise les contrôles de formulaire
        });
      }
    }
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

  // Vérifie si l'utilisateur possède l'autorisation d'accéder à un traitement donné
  protected hasAccessToPermission(permissionKey: string): boolean {
    return this.accountService.hasAccessToPermission(this.moduleKey, permissionKey);
  }

  protected exportExcel(){
    this.baseService.generateExcel(this.entityName, this.items);
  }

  showPrintPreview() {
      this.printPreviewVisible = true;
  }
}
