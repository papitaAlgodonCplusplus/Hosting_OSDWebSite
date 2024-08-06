import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthenticationService } from './authentication.service';

export interface BackblazeUploadResponse {
  name: string;
  fileId: string;
}

@Injectable({
  providedIn: 'root'
})

export class BackblazeService {

  private apiUrl = 'http://localhost:5001/media_api';
  private traceIdentifier: string = "";
  private securityToken: string = "";

  constructor(private http: HttpClient,
              private authenticationService : AuthenticationService
  ) { }

  public startBackblazeService(traceIdentifier: string, securityToken: string) {
    this.traceIdentifier = traceIdentifier;
    this.securityToken = securityToken;
  }

  getFileFromBackBlaze(fileId: string): Observable<any> {
    const url = `${this.apiUrl}/getKuarcWebFile`;

    const body = {
      SessionKey: this.authenticationService.sessionKey,
      SecurityToken: this.securityToken,
      TraceIdentifier: this.traceIdentifier,
      Date: new Date().toISOString(),
      Body: {
        Fguid: fileId
      }
    };

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.post(url, body, { headers });
  }

  uploadFile(byteArray: Uint8Array, fileName: string): Observable<BackblazeUploadResponse> {
    const url = `${this.apiUrl}/uploadFileToKuarc`;
    
    const body = {
      SessionKey: this.authenticationService.sessionKey,
      SecurityToken: this.securityToken,
      TraceIdentifier: this.traceIdentifier,
      Date: new Date().toISOString(),
      Body: {
        FileName: fileName,
        FileContent: Array.from(byteArray)
      }
    };
  
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
  
    return this.http.post<BackblazeUploadResponse>(url, body, { headers });
  }

  inferFileExtension(fileBytes: string): string {
    const mimeTypes: { [key: string]: string } = {
      '/9j/': 'jpeg',
      'iVBORw0KGgo': 'png',
      'JVBERi0xL': 'pdf',
      'R0lGODdh': 'gif',
      'UklGR': 'webp',
      'AAABAAEAEBA': 'ico',
      'SUQz': 'mp3',
      'OggS': 'ogg',
      'fLaC': 'flac',
      'MThd': 'midi',
      '4oCw': 'doc',
      'UEsDBBQAAAA': 'docx',
      'PK': 'zip'
    };
  
    const keys = Object.keys(mimeTypes);
    let index = 0;
    let extension = 'octet-stream';
    
    while (index < keys.length) {
      const key = keys[index];
      if (fileBytes.startsWith(key)) {
        extension = mimeTypes[key];
        index = key.length
      }
      index++;
    }
  
    return extension;
  }
  
  loadDocument(documentBytes: string, extension: string): string {
    const mimeTypes: { [key: string]: string } = {
      'pdf': 'application/pdf',
      'jpeg': 'image/jpeg',
      'png': 'image/png',
      'gif': 'image/gif',
      'webp': 'image/webp',
      'ico': 'image/x-icon',
      'mp3': 'audio/mpeg',
      'ogg': 'audio/ogg',
      'flac': 'audio/flac',
      'midi': 'audio/midi',
      'doc': 'application/msword',
      'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'zip': 'application/zip'
    };
  
    const mimeType = mimeTypes[extension] || 'application/octet-stream';
    return `data:${mimeType};base64,${documentBytes}`;
  }
  
  convertFileToByteArray(file: File): Promise<Uint8Array> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const arrayBuffer = reader.result as ArrayBuffer;
        const byteArray = new Uint8Array(arrayBuffer);
        resolve(byteArray);
      };
      reader.onerror = (error) => reject(error);
      reader.readAsArrayBuffer(file);
    });
  } 
}