import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar'; // still using snackBar for alerts
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
  // This indicates which field we are updating: 'response', 'answerToAppeal', 'appeal', 'meetingLink', or 'additionalInfo'
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
    // Notice that the appeal field is not included in the creation form.
    this.serviceForm = this.fb.group({
      serviceType: ['', Validators.required],
      additionalInfo: [''],
      document: ['']
    });
  }

  ngOnInit(): void {
    // We use a small delay to ensure user info is set.
    setTimeout(() => {
      if (this.authenticationService.userInfo) {
        this.user = this.authenticationService.userInfo;
      }
      if (this.user.osdSolutionType) {
        console.log('User OSD Solution Type', this.user.osdSolutionType.replace(/[€\d]/g, ''));
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
        // Save raw services first.
        const rawServices = data.Body?.services || [];

        // Process free professional data and set trainer flag.
        await (async () => {
          let freeProfessionalId = '';
          await this.osdService.GetFreeProfessionalsDataEvent();
          const profResponse: any = await this.osdService.getFreeProfessionalsList();
          profResponse.forEach((professional: any) => {
            if (professional.userid === this.user.Id) {
              console.log('Free Professional ID inside promise', professional.id);
              freeProfessionalId = professional.id;
            }
          });
          console.log('Free Professional ID after promise resolved:', freeProfessionalId);
          if (this.user && this.user.FreeProfessionalTypeID === "eea2312e-6a85-4ab6-85ff-0864547e3870") {
            this.isTrainer = freeProfessionalId !== '';
          } else {
            this.isSolutionsClient = true;
          }
        })();

        // Now that we have the correct isTrainer flag, filter the services.
        if (this.isTrainer) {
          // For trainers, show all services.
          this.serviceRequests = rawServices.map((service: any) => ({
            id: service.id,
            clientId: service.client_id,
            serviceType: service.service_type.replace(/[€\d]/g, ''),
            additionalInfo: service.additional_info,
            meetingLink: service.meeting_link,
            documentId: service.document_id,
            response: service.response,
            appeal: service.appeal,
            answerToAppeal: service.answer_to_appeal,
            createdAt: new Date(service.created_at),
            updatedAt: service.updated_at ? new Date(service.updated_at) : undefined
          }));
        } else {
          // For non-trainers, show only the services that belong to the current user.
          this.serviceRequests = rawServices
            .filter((service: any) => service.client_id === this.user.Id)
            .map((service: any) => ({
              id: service.id,
              clientId: service.client_id,
              serviceType: service.service_type.replace(/[€\d]/g, ''),
              additionalInfo: service.additional_info,
              meetingLink: service.meeting_link,
              documentId: service.document_id,
              response: service.response,
              appeal: service.appeal,
              answerToAppeal: service.answer_to_appeal,
              createdAt: new Date(service.created_at),
              updatedAt: service.updated_at ? new Date(service.updated_at) : undefined
            }));
        }

        // Fetch client data for clientName (using first service's client_id as example)
        if (rawServices.length) {
          from(this.osdService.getUserByID(rawServices[0].client_id)).subscribe({
            next: (response: any) => {
              console.log('Client data loaded', response);
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

  // Called by shared-uploadfile when a file is successfully uploaded.
  handleFileUploaded(event: { typeFile: string, fileId: string }): void {
    console.log('File uploaded', event);
    this.serviceForm.patchValue({ document: event.fileId });
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

  // Trainer: update the service response using the pop-up window.
  updateResponse(request: ServiceRequest): void {
    this.openPopup('response', 'Update Response', 'Enter your response for this request:', request.response || '', request);
  }

  // Trainer: update answer to appeal using the pop-up window.
  updateAnswerToAppeal(request: ServiceRequest): void {
    this.openPopup('answerToAppeal', 'Update Answer to Appeal', 'Enter your answer to the appeal:', request.answerToAppeal || '', request);
  }

  // All: update additional information using the pop-up window.
  updateInfo(request: ServiceRequest): void {
    this.openPopup('additionalInfo', 'Update Additional Info', 'Enter additional information:', request.additionalInfo || '', request);
  }

  // Client: update their appeal using the pop-up window.
  updateAppeal(request: ServiceRequest): void {
    this.openPopup('appeal', 'Update Appeal', 'Enter your appeal:', request.appeal || '', request);
  }

  // Trainer: start a videoconference using the pop-up window.
  startVideoconference(request: ServiceRequest): void {
    this.openPopup('meetingLink', 'Start Videoconference', 'Enter the videoconference link:', request.meetingLink || '', request);
  }

  // Download a file using the Backblaze service.
  downloadSelectedFile(optionalDocument: any): void {
    let fileId: string;
    console.log("Optional Document", optionalDocument);
    if (optionalDocument && optionalDocument !== '') {
      fileId = optionalDocument;
    } else {
      return;
    }
    if (!fileId) {
      return;
    }
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
