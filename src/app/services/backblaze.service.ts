import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BackblazeService {
  private backendUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) { }

  authorizeAccount(): Observable<any> {
    return this.http.get(`${this.backendUrl}/authorize`);
  }

  getUploadUrl(apiUrl: string, authorizationToken: string, bucketId: string): Observable<any> {
    const body = { apiUrl, authorizationToken, bucketId };
    return this.http.post(`${this.backendUrl}/get-upload-url`, body);
  }

  uploadFile(uploadUrl: string, authorizationToken: string, fileName: string, file: Blob): Observable<any> {
    const formData = new FormData();
    formData.append('fileData', file);
    formData.append('fileName', fileName);
    formData.append('authorizationToken', authorizationToken);
    formData.append('uploadUrl', uploadUrl);

    return this.http.post(`${this.backendUrl}/upload-file`, formData);
  }


  getDownloadUrl(apiUrl: string, authorizationToken: string, fileId: string): Observable<any> {
    const params = new HttpParams()
      .set('fileId', fileId)
      .set('authorizationToken', authorizationToken)
      .set('apiUrl', apiUrl)
      .set('downloadUrl', 'https://f005.backblazeb2.com'); // Asegúrate de pasar la downloadUrl correcta

    return this.http.get(`${this.backendUrl}/get-download-url`, { params });
  }

  // Descargar el archivo con la URL generada y el nombre del archivo
  downloadFile(downloadUrl: string, fileName: string, authorizationToken: string): Observable<Blob> {
    const params = new HttpParams()
      .set('downloadUrl', downloadUrl)
      .set('fileName', fileName)
      .set('authorizationToken', authorizationToken);

    return this.http.get(`${this.backendUrl}/download-file`, {
      params,
      responseType: 'blob' // Para manejar la respuesta como archivo
    });
  }

}
