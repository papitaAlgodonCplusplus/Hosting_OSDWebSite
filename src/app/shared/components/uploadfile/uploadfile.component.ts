import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BackblazeService } from 'src/app/services/backblaze.service';
import { ValidationsService } from 'src/app/services/validations.service';

@Component({
  selector: 'shared-uploadfile',
  templateUrl: './uploadfile.component.html',
  styleUrls: ['./uploadfile.component.css']
})
export class UploadfileComponent {
  @Input() typeFile!: string;
  @Input() label!: string;
  @Input() bgColor: string = 'bg-white';
  @Input() readOnly: boolean = false;
  @Input() fileId: string = '';
  @Input() fileName: string = '';
  @Input() uploadFile: boolean = false;
  @Input() formGroup!: FormGroup;
  @Input() fieldName!: string;
  @Input() isModified: boolean = false;
  @Output() blurEvent: EventEmitter<void> = new EventEmitter<void>();
  @Output() inputChange: EventEmitter<any> = new EventEmitter();
  @Output() fileUploaded: EventEmitter<{ typeFile: string, fileId: string }> = new EventEmitter();

  selectedFile!: File;
  bucketId: string = 'b51703b85d4409a3911c0e1d';

  constructor(
    private backblazeService: BackblazeService,
    private validationsService: ValidationsService
  ) { }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['uploadFile'] && changes['uploadFile'].currentValue === true) {
      this.uploadSelectedFile();
    }
  }

  onInputChange() {
    this.inputChange.emit()
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0]
      this.fileName = input.files[0].name
      this.formGroup.patchValue({
        [this.fieldName]: input.files[0].name
      });
    } else {
      this.fileName = '';
    }
  }


  isValidField(field: string): boolean | null {
    return this.validationsService.isValidField(this.formGroup, field);
  }

  getFieldError(field: string): string | null {
    return this.validationsService.getFieldError(this.formGroup, field);
  }

  uploadSelectedFile() {
    if (this.selectedFile) {
      this.backblazeService.authorizeAccount().subscribe(response => {
        const apiUrl = response.apiUrl;
        const authorizationToken = response.authorizationToken;

        this.backblazeService.getUploadUrl(apiUrl, authorizationToken, this.bucketId).subscribe(uploadResponse => {
          const uploadUrl = uploadResponse.uploadUrl;
          const uploadAuthToken = uploadResponse.authorizationToken;

          this.backblazeService.uploadFile(uploadUrl, uploadAuthToken, this.selectedFile.name, this.selectedFile).subscribe(uploadResult => {
            const fileId = uploadResult.fileId

            this.fileUploaded.emit({ typeFile: this.typeFile, fileId: fileId });

          }, error => {
            console.error('Error al subir el archivo:', error);
          });
        }, error => {
          console.error('Error al obtener la URL de subida:', error);
        });
      }, error => {
        console.error('Error al autorizar la cuenta:', error);
      });
    } else {
      console.error('No se ha seleccionado un archivo');
    }
  }


  downloadSelectedFile() {
    const fileId = this.fileId;

    if (!fileId) {
      console.error('No se ha subido ningún archivo para descargar.');
      return;
    }

    this.backblazeService.authorizeAccount().subscribe(response => {
      const apiUrl = response.apiUrl;
      const authorizationToken = response.authorizationToken;

      this.backblazeService.getDownloadUrl(apiUrl, authorizationToken, fileId).subscribe(downloadResponse => {
        const downloadUrl = downloadResponse.downloadUrl;
        const fileName = downloadResponse.fileName

        if (!downloadUrl || !fileName) {
          console.error('URL de descarga o nombre del archivo indefinidos.');
          return;
        }

        this.backblazeService.downloadFile(downloadUrl, fileName, authorizationToken).subscribe(blob => {
          const downloadURL = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = downloadURL;
          link.download = fileName;
          link.click();
        }, error => {
          console.error('Error al descargar el archivo:', error);
        });

      }, error => {
        console.error('Error al obtener la URL de descarga:', error);
      });

    }, error => {
      console.error('Error al autorizar la cuenta:', error);
    });
  }

  modifySelectedFile() {
    const fileId = this.fileId;
    this.fileName = "";

    if (!fileId) {
      console.error('No hay archivo para moodificar.');
      return;
    }

    // this.backblazeService.authorizeAccount().subscribe(response => {
    //   const apiUrl = response.apiUrl;
    //   const authorizationToken = response.authorizationToken;

    //   this.backblazeService.modifyFile(apiUrl, authorizationToken, fileId).subscribe(modifyResponse => {
    //     const isDeletedFile = modifyResponse;

    //     if (isDeletedFile == true) {
    //       this.backblazeService.getUploadUrl(apiUrl, authorizationToken, this.bucketId).subscribe(uploadResponse => {
    //         const uploadUrl = uploadResponse.uploadUrl;
    //         const uploadAuthToken = uploadResponse.authorizationToken;

    //         this.backblazeService.uploadFile(uploadUrl, uploadAuthToken, this.selectedFile.name, this.selectedFile).subscribe(uploadResult => {
    //           const fileId = uploadResult.fileId || uploadResult.fileId;

    //           this.fileUploaded.emit({ typeFile: this.typeFile, fileName: this.selectedFile.name, fileId: fileId });

    //         }, error => {
    //           console.error('Error al subir el archivo:', error);
    //         });
    //       }, error => {
    //         console.error('Error al obtener la URL de subida:', error);
    //       });
    //     }
    //   })
    // }, error => {
    //   console.error('Error al autorizar la cuenta:', error);
    // });
  }
}
