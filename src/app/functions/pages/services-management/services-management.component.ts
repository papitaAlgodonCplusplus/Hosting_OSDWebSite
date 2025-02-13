import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { OSDService } from 'src/app/services/osd-event.services';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { BackblazeService } from 'src/app/services/backblaze.service';
import { Store } from '@ngrx/store';
import { ModalActions } from 'src/app/store/actions';
import { from } from 'rxjs';

export interface ServiceRequest {
  id: string;
  clientId: string;
  serviceType: string;
  additionalInfo?: string;
  meetingLink?: string;
  documentId?: string;
  documentId2?: string;
  documentId3?: string;
  document3_id?: string;
  document2_id?: string;
  document_id?: string;
  response?: string;
  appeal?: string;
  answerToAppeal?: string;
  createdAt: Date;
  updatedAt?: Date;
}

@Component({
  selector: 'app-services-management',
  templateUrl: './services-management.component.html',
  styleUrls: ['./services-management.component.css']
})
export class ServicesManagementComponent implements OnInit {
  serviceForm: FormGroup;
  serviceRequests: ServiceRequest[] = [];
  isTrainer: boolean = false;
  isSolutionsClient: boolean = false;
  selectedFile: File | null = null;
  freeProfessionalId: string | null = null;
  clientName: string = '';
  uploadFile: boolean = true;
  serviceTypes: string[] = ['Query simple', 'Sustainability report', 'Mediation arbitration'];
  user: any;

  // ----- Popup (modal) properties for editing/updating -----
  showPopup: boolean = false;
  popupTitle: string = '';
  popupMessage: string = '';
  popupInput: string = '';
  popupUpdateType: 'response' | 'answerToAppeal' | 'appeal' | 'meetingLink' | 'additionalInfo' | null = null;
  currentRequest: ServiceRequest | null = null;
  // -------------------------------------

  // ----- View Popup properties for read-only content -----
  showViewPopup: boolean = false;
  viewPopupTitle: string = '';
  viewPopupContent: string = '';
  // -------------------------------------

  constructor(
    private fb: FormBuilder,
    private osdService: OSDService,
    private authenticationService: AuthenticationService,
    private snackBar: MatSnackBar,
    private backblazeService: BackblazeService,
    private store: Store
  ) {
    // Note that we now add two extra fields: document2 and document3.
    this.serviceForm = this.fb.group({
      serviceType: ['', Validators.required],
      additionalInfo: [''],
      document: [''],
      document2: [''],
      document3: ['']
    });
  }

  ngOnInit(): void {
    setTimeout(() => {
      if (this.authenticationService.userInfo) {
        this.user = this.authenticationService.userInfo;
      }
      if (this.user.osdSolutionType) {
        this.serviceTypes = this.serviceTypes.filter(type =>
          type.toLowerCase().includes(this.user.osdSolutionType.replace(/[€\d]/g, '').toLowerCase().trim())
        );
      }
      this.loadServiceRequests();
    }, 500);
  }

  loadServiceRequests(): void {
    this.osdService.getServiceRequests().subscribe({
      next: async (data: any) => {
        const rawServices = data.Body?.services || [];
        console.log('rawServices', rawServices);
        await (async () => {
          let freeProfessionalId = '';
          await this.osdService.GetFreeProfessionalsDataEvent();
          const profResponse: any = await this.osdService.getFreeProfessionalsList();
          profResponse.forEach((professional: any) => {
            if (professional.userid === this.user.Id) {
              freeProfessionalId = professional.id;
            }
          });
          if (this.user && this.user.FreeProfessionalTypeID === "eea2312e-6a85-4ab6-85ff-0864547e3870") {
            this.isTrainer = freeProfessionalId !== '';
          } else {
            this.isSolutionsClient = true;
          }
        })();
        if (this.isTrainer) {
          this.serviceRequests = rawServices.map((service: any) => ({
            id: service.id,
            clientId: service.client_id,
            serviceType: service.service_type.replace(/[€\d]/g, ''),
            additionalInfo: service.additional_info,
            meetingLink: service.meeting_link,
            documentId: service.document_id,
            documentId2: service.document2_id,
            documentId3: service.document3_id,
            document2_id: service.document2_id,
            document3_id: service.document3_id,
            response: service.response,
            appeal: service.appeal,
            answerToAppeal: service.answer_to_appeal,
            createdAt: new Date(service.created_at),
            updatedAt: service.updated_at ? new Date(service.updated_at) : undefined
          }));
        } else {
          this.serviceRequests = rawServices
            .filter((service: any) => service.client_id === this.user.Id)
            .map((service: any) => ({
              id: service.id,
              clientId: service.client_id,
              serviceType: service.service_type.replace(/[€\d]/g, ''),
              additionalInfo: service.additional_info,
              meetingLink: service.meeting_link,
              documentId: service.document_id,
              documentId2: service.document2_id,
              documentId3: service.document_id3,
              document2_id: service.document2_id,
              document3_id: service.document3_id,
              response: service.response,
              appeal: service.appeal,
              answerToAppeal: service.answer_to_appeal,
              createdAt: new Date(service.created_at),
              updatedAt: service.updated_at ? new Date(service.updated_at) : undefined
            }));
        }
        if (rawServices.length) {
          from(this.osdService.getUserByID(rawServices[0].client_id)).subscribe({
            next: (response: any) => {
              this.clientName = response.Body.user.name;
            },
            error: (err: any) => {
              console.error('Error loading client data', err);
              this.snackBar.open('Error loading client data', 'Close', { duration: 3000 });
            }
          });
        }
      },
      error: (err: any) => {
        console.error('Error loading service requests', err);
        this.snackBar.open('Error loading service requests', 'Close', { duration: 3000 });
      }
    });
  }

  // Called when a file is successfully uploaded for document 1.
  handleFileUploaded(event: { typeFile: string, fileId: string }): void {
    this.serviceForm.patchValue({ document: event.fileId });
  }

  // New: Handler for document 2 uploads.
  handleFileUploaded2(event: { typeFile: string, fileId: string }): void {
    this.serviceForm.patchValue({ document2: event.fileId });
  }

  // New: Handler for document 3 uploads.
  handleFileUploaded3(event: { typeFile: string, fileId: string }): void {
    this.serviceForm.patchValue({ document3: event.fileId });
  }

  onSubmit(): void {
    if (this.serviceForm.invalid) {
      this.snackBar.open('Please complete the form', 'Close', { duration: 3000 });
      return;
    }
    const newRequest: ServiceRequest = {
      id: '',
      clientId: this.user?.Id || 'Unknown Client ID',
      serviceType: this.serviceForm.value.serviceType,
      additionalInfo: this.serviceForm.value.additionalInfo,
      appeal: '',
      documentId: this.serviceForm.value.document,
      documentId2: this.serviceForm.value.document2,
      documentId3: this.serviceForm.value.document3,
      createdAt: new Date(),
      updatedAt: undefined,
      meetingLink: '',
      response: '',
      answerToAppeal: ''
    };
    this.createServiceRequest(newRequest);
  }

  createServiceRequest(request: ServiceRequest): void {
    this.osdService.createServiceRequest(request).subscribe({
      next: () => {
        this.store.dispatch(ModalActions.addAlertMessage({ alertMessage: 'Request submitted' }));
        this.store.dispatch(ModalActions.openAlert());
        this.loadServiceRequests();
      },
      error: (err: any) => {
        console.error('Error creating service request', err);
        this.snackBar.open('Failed to create service request', 'Close', { duration: 3000 });
      }
    });
  }

  // ----- Popup methods for editing/updating -----
  openPopup(
    updateType: 'response' | 'answerToAppeal' | 'appeal' | 'meetingLink' | 'additionalInfo',
    title: string,
    message: string,
    defaultValue: string,
    request: ServiceRequest
  ): void {
    this.popupUpdateType = updateType;
    this.popupTitle = title;
    this.popupMessage = message;
    this.popupInput = defaultValue;
    this.currentRequest = request;
    this.showPopup = true;
  }

  confirmPopup(): void {
    if (this.currentRequest) {
      switch (this.popupUpdateType) {
        case 'response':
          this.currentRequest.response = this.popupInput;
          break;
        case 'answerToAppeal':
          this.currentRequest.answerToAppeal = this.popupInput;
          break;
        case 'appeal':
          this.currentRequest.appeal = this.popupInput;
          break;
        case 'meetingLink':
          this.currentRequest.meetingLink = this.popupInput;
          break;
        case 'additionalInfo':
          this.currentRequest.additionalInfo = this.popupInput;
          break;
      }
      this.currentRequest.updatedAt = new Date();
      this.osdService.updateServiceRequest(this.currentRequest).subscribe({
        next: () => {
          let msg = '';
          switch (this.popupUpdateType) {
            case 'response': msg = 'Response submitted'; break;
            case 'answerToAppeal': msg = 'Answer to appeal submitted'; break;
            case 'appeal': msg = 'Appeal updated'; break;
            case 'meetingLink': msg = 'Videoconference link submitted'; break;
            case 'additionalInfo': msg = 'Additional information submitted'; break;
          }
          this.snackBar.open(msg, 'Close', { duration: 3000 });
          this.loadServiceRequests();
        },
        error: (err: any) => {
          console.error('Error updating request', err);
          this.snackBar.open('Failed to update request', 'Close', { duration: 3000 });
        }
      });
    }
    this.cancelPopup();
  }

  cancelPopup(): void {
    this.showPopup = false;
    this.currentRequest = null;
    this.popupInput = '';
    this.popupUpdateType = null;
  }
  // --------------------------

  // ----- View Popup methods (read-only) -----
  openViewPopup(title: string, content: string): void {
    this.viewPopupTitle = title;
    this.viewPopupContent = content;
    this.showViewPopup = true;
  }

  closeViewPopup(): void {
    this.showViewPopup = false;
    this.viewPopupTitle = '';
    this.viewPopupContent = '';
  }
  // -------------------------------------------

  updateResponse(request: ServiceRequest): void {
    this.openPopup('response', 'Update Response', 'Enter your response for this request:', request.response || '', request);
  }

  updateAnswerToAppeal(request: ServiceRequest): void {
    this.openPopup('answerToAppeal', 'Update Answer to Appeal', 'Enter your answer to the appeal:', request.answerToAppeal || '', request);
  }

  updateInfo(request: ServiceRequest): void {
    this.openPopup('additionalInfo', 'Update Additional Info', 'Enter additional information:', request.additionalInfo || '', request);
  }

  updateAppeal(request: ServiceRequest): void {
    this.openPopup('appeal', 'Update Appeal', 'Enter your appeal:', request.appeal || '', request);
  }

  startVideoconference(request: ServiceRequest): void {
    this.openPopup('meetingLink', 'Start Videoconference', 'Enter the videoconference link:', request.meetingLink || '', request);
  }

  downloadSelectedFile(optionalDocument: any): void {
    let fileId: string;
    if (optionalDocument && optionalDocument !== '') {
      fileId = optionalDocument;
    } else {
      return;
    }
    if (!fileId) { return; }
    this.backblazeService.authorizeAccount().subscribe(response => {
      const apiUrl = response.apiUrl;
      const authorizationToken = response.authorizationToken;
      this.backblazeService.getDownloadUrl(apiUrl, authorizationToken, fileId).subscribe(downloadResponse => {
        const downloadUrl = downloadResponse.downloadUrl;
        const fileName = downloadResponse.fileName;
        if (!downloadUrl || !fileName) {
          return;
        }
        this.backblazeService.downloadFile(downloadUrl, fileName, authorizationToken).subscribe(blob => {
          const downloadURL = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = downloadURL;
          link.download = fileName;
          link.click();
        }, error => {
          console.error(error);
        });
      }, error => {
        console.error(error);
      });
    }, error => {
      console.error(error);
    });
  }

  onFileSelected(event: any): void {
    if (event.target.files && event.target.files.length) {
      this.selectedFile = event.target.files[0];
    }
  }
}
