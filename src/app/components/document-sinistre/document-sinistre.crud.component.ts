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
import { DocumentSinistre } from '../../models/document-sinistre.model';
import { DocumentSinistreService } from '../../service/document-sinistre.service';
import { PortraitComponent } from '../../shared/portrait/portrait.demo.component';
import { ClaimStatus, Sinistre } from '../../models/sinistre.model';

@Component({
  selector: 'app-document-sinistre-crud',
  templateUrl: './../generic.crud.component.html'
})
export class DocumentSinistreCrudComponent implements OnInit {
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
  selectedItem: DocumentSinistre; // Élément de type DocumentSinistre actuellement sélectionné ou en cours de modification
  selectedItems: DocumentSinistre[] = []; // Tableau d'éléments de type DocumentSinistre sélectionnés
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
    { field: 'nom', header: 'Nom', type: 'text' },
    { field: 'description', header: 'description', type: 'textarea' },
    { field: 'url', header: 'Telecharger', type: 'url' },
    { field: 'dateTelechargement', header: 'Telecharger le', type: 'date' },
    { field: 'sinistre', header: 'Sinistre', type: 'objet', values: [], label: 'numeroSinistre', key: 'id', subfield: [
        { field: 'id', header: 'ID', type: 'id' },
        { field: 'numeroSinistre', header: 'Num Sinistre', type: 'text' },
        { field: 'dateDeclaration', header: 'Date de declaration', type: 'date' },
        { field: 'dateTraitement', header: 'Date de traitement', type: 'date' },
        { field: 'status', header: 'Status', type: 'enum', values: [], label: 'label', key: 'value' },
        { field: 'montantSinistre', header: 'Montant du sinistre', type: 'currency' },
        { field: 'montantApprouve', header: 'Montant approuve', type: 'currency' }
      ]
    }
  ];
  
  items: DocumentSinistre[] = [
    {
      id: 1,
      nom: 'Photo du Sinistre',
      description: 'Photo montrant les dommages causés par l\'accident',
      url: 'http://example.com/photo-sinistre.jpg',
      dateTelechargement: new Date('2023-06-01'),
      sinistre: 1
    },
    {
      id: 2,
      nom: 'Vidéo du Sinistre',
      description: 'Vidéo enregistrée par une caméra de surveillance',
      url: 'http://example.com/video-sinistre.mp4',
      dateTelechargement: new Date('2023-06-02'),
      sinistre: 1
    },
    {
      id: 3,
      nom: 'Facture de Réparation',
      description: 'Facture des coûts de réparation des dommages',
      url: 'http://example.com/facture-reparation.pdf',
      dateTelechargement: new Date('2023-06-03'),
      sinistre: 2
    },
    {
      id: 4,
      nom: 'Rapport Médical',
      description: 'Rapport médical décrivant les blessures subies',
      url: 'http://example.com/rapport-medical.pdf',
      dateTelechargement: new Date('2023-06-04'),
      sinistre: 2
    }
  ];
  branches: EntityByBranch<DocumentSinistre>[] = [
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
  sinistres: Sinistre[] = [
    {
      id: 1,
      numeroSinistre: 'S001',
      raison: 'Accident de voiture',
      dateDeclaration: new Date('2023-01-01'),
      dateTraitement: new Date('2023-01-10'),
      status: ClaimStatus.EN_ATTENTE,
      montantSinistre: 10000,
      montantApprouve: 8000,
      souscription: 1,
      fournisseur: 1,
      prestationSoin: 1,
      reclamations: [1, 2],
      documents: [1, 2]
    },
    {
      id: 2,
      numeroSinistre: 'S002',
      raison: 'Incendie de maison',
      dateDeclaration: new Date('2023-02-01'),
      dateTraitement: new Date('2023-02-15'),
      status: ClaimStatus.APPROUVE,
      montantSinistre: 20000,
      montantApprouve: 15000,
      souscription: 2,
      fournisseur: 2,
      prestationSoin: 2,
      reclamations: [3, 4],
      documents: [3, 4]
    }
  ];

  // Liste pour ClaimStatus
  claimStatus = [
    { label: 'En attente', value: ClaimStatus.EN_ATTENTE },
    { label: 'Approuve', value: ClaimStatus.APPROUVE },
    { label: 'Annule', value: ClaimStatus.ANNULE }
  ];

  constructor(
    private messageService: MessageService,
    private baseService: BaseService,
    private accountService: AccountService,
    private fb: FormBuilder, // Service pour construire des formulaires
    private service: DocumentSinistreService, // Service pour les opérations CRUD génériques
    public appMain: AppMainComponent // Donne acces aux methodes de app.main.component depuis le composant fille
  ) {
    // Initialisation du groupe de contrôles de formulaire avec les contrôles créés
    this.formGroup = this.fb.group(this.createFormControls());
    this.entityName = 'DocumentSinistre';
    this.componentLink = '/admin/document-sinistres';
    this.importLink = '/import-document-sinistre';
    this.moduleKey = 'DOCUMENT_SINISTRE_MODULE';
    this.isTable = true;
  }

  ngOnInit() {
    this.initializeData();
    // Initialise les colonnes de la table
    //this.loadPartenaires();
    this.assignColumnValues();
    this.getRequiredFields();
    this.updateBreadcrumb(); // Mettre à jour le breadcrumb initial

    // Simulate fetching data from a service
    //this.fetchDocumentSinistres();
  }

  // Sample data initialization
  private initializeData(): void {
    this.loading = false;
  }
  
  // Chargement des polices associés à une document-sinistre
  loadSinistres(): void {
    this.service.getAllSinistres().subscribe((sinistres: Sinistre[]) => {
        this.sinistres = sinistres;
    });
  }

  // Méthode abstraite pour récupérer les champs nécessaires spécifiques à l'entité (à implémenter dans la classe dérivée)
  protected getRequiredFields(): string[] { // Ajoutez le modificateur override
    return ['nom', 'url'];
  }

  /**
   * Assigner les valeurs aux colonnes en fonction des champs spécifiés.
   */
  protected assignColumnValues(): void { // Ajoutez le modificateur override
    this.setColumnValues('sinistre', this.sinistres);
    this.setSubFieldValues('sinistre', 'status', this.claimStatus);
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

  protected fetchDocumentSinistres(): void {
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
  protected calculateTotalSubscriptions(branch: EntityByBranch<DocumentSinistre>): number {
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
    this.selectedItem = {} as DocumentSinistre; // Initialise un nouvel élément
    this.submitted = false; // Réinitialise le soumission du formulaire
    this.displayDialog = true; // Affiche le dialogue d'ajout/modification
  }

  // Méthode pour ouvrir le dialogue de suppression de plusieurs éléments
  protected deleteSelectedItems() {
    this.displayDeleteItemsDialog = true; // Affiche le dialogue de suppression de plusieurs éléments
  }

  // Méthode pour éditer un élément spécifique
  protected editItem(item: DocumentSinistre) {
    this.selectedItem = { ...item }; // Copie l'élément à éditer dans la variable item
    this.updateFormControls(); // Met à jour les contrôles de formulaire lors de l'édition
    this.displayDialog = true; // Affiche le dialogue d'ajout/modification
  }

  // Méthode pour supprimer un élément spécifique
  protected deleteItem(item: DocumentSinistre) {
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
      this.selectedItem = {} as DocumentSinistre; // Réinitialise l'élément
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
          this.selectedItem = {} as DocumentSinistre; // Réinitialise l'élément
          this.formGroup.reset(); // Réinitialise les contrôles de formulaire
        });
      } else { // Sinon, crée un nouvel élément
        this.service.create(this.selectedItem).subscribe(newItem => { // Crée un nouvel élément via le service
          this.items.push(newItem); // Ajoute le nouvel élément au tableau d'éléments
          this.appMain.showSuccessViaToast('Successful', this.entityName + ' Created'); // Affiche un message de succès pour la création
          this.items = [...this.items]; // Met à jour le tableau d'éléments
          this.displayDialog = false; // Masque le dialogue d'ajout/modification
          this.selectedItem = {} as DocumentSinistre; // Réinitialise l'élément
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
