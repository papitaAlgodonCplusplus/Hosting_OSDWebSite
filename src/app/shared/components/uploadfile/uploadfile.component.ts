import { Component, EventEmitter, Input, Output } from '@angular/core';
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
  @Input() readOnly!: boolean;
  @Input() fileId!: string;
  @Input() fileName!: string;
  @Output() blurEvent: EventEmitter<void> = new EventEmitter<void>();
  @Output() inputChange: EventEmitter<any> = new EventEmitter();
  selectedFile!: File;
  @Output() fileUploaded: EventEmitter<{ typeFile: string, fileName: string, fileId: string }> = new EventEmitter();

  constructor(
    private validationsService: ValidationsService,
    private backblazeService: BackblazeService
  ) { }

  onInputChange() {
    this.inputChange.emit();
  }

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }

  uploadSelectedFile() {
    const bucketId = 'b51703b85d4409a3911c0e1d';

    this.backblazeService.authorizeAccount().subscribe(response => {
      const apiUrl = response.apiUrl;
      const authorizationToken = response.authorizationToken;

      this.backblazeService.getUploadUrl(apiUrl, authorizationToken, bucketId).subscribe(uploadResponse => {
        const uploadUrl = uploadResponse.uploadUrl;
        const uploadAuthToken = uploadResponse.authorizationToken;

        this.backblazeService.uploadFile(uploadUrl, uploadAuthToken, this.selectedFile.name, this.selectedFile).subscribe(uploadResult => {
          // Obtener el fileId desde la respuesta
          const fileId = uploadResult.fileId || uploadResult.fileId;
          this.fileId = fileId;  // Guardar el fileId para uso posterior
          console.log(this.typeFile);

          // Emitir el evento con el nombre del archivo y el ID
          this.fileUploaded.emit({ typeFile: this.typeFile, fileName: this.selectedFile.name, fileId: fileId });

        }, error => {
          console.error('Error al subir el archivo:', error);
        });
      }, error => {
        console.error('Error al obtener la URL de subida:', error);
      });
    }, error => {
      console.error('Error al autorizar la cuenta:', error);
    });
  }

  downloadSelectedFile() {
    const fileId = this.fileId; // Asegúrate de que fileId esté guardado
    const bucketId = 'b51703b85d4409a3911c0e1d';

    if (!fileId) {
      console.error('No se ha subido ningún archivo para descargar.');
      return;
    }

    this.backblazeService.authorizeAccount().subscribe(response => {
      const apiUrl = response.apiUrl;
      const authorizationToken = response.authorizationToken;

      // Obtener la URL de descarga y el nombre del archivo a partir del fileId
      this.backblazeService.getDownloadUrl(apiUrl, authorizationToken, fileId).subscribe(downloadResponse => {
        const downloadUrl = downloadResponse.downloadUrl;
        const fileName = downloadResponse.fileName || this.fileName; // Usa el nombre devuelto o el que ya tengas

        if (!downloadUrl || !fileName) {
          console.error('URL de descarga o nombre del archivo indefinidos.');
          return;
        }

        console.log("URL de descarga obtenida:", downloadUrl);

        // Descargar el archivo usando la URL de descarga
        this.backblazeService.downloadFile(downloadUrl, fileName, authorizationToken).subscribe(blob => {
          const downloadURL = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = downloadURL;
          link.download = fileName; // Nombre que se usará para guardar el archivo
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


}
