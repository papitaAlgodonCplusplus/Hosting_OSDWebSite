import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class BackblazeService {

  private apiUrl = '/b2api/v2';  // Cambiado para que utilice el proxy
  private authUrl = '/b2api/v3/b2_authorize_account'; // Cambiado para que utilice el proxy
  private accountId = '0055738d4931ced000000000d';  // Tu accountId
  private applicationKey = 'K005vHrgizyOMTX4aOalnxVUcICyb+Q';  // Tu applicationKey
  private authToken!: string;
  private bucketId = 'b51703b85d4409a3911c0e1d'; // El bucketId de tu bucket

  constructor(private http: HttpClient) { }

  // Método para autorizarse y subir el archivo
  async authorizeAndUploadFile(file: File): Promise<any> {
    try {
      // Primero autorizamos
      await this.authorizeAccount();
      console.log('Autorización completada, preparando para subir archivo...');

      // Luego subimos el archivo
      const response = await this.uploadFile(file);
      console.log('Archivo subido exitosamente:', response);
      return response;
    } catch (error) {
      console.error('Error durante el proceso de autorización o subida:', error);
      throw error;
    }
  }

  // Método privado para autorizarse en Backblaze y obtener el token
  private async authorizeAccount(): Promise<void> {
    const credentials = `${this.accountId}:${this.applicationKey}`;
    const encodedCredentials = btoa(credentials);

    const headers = new HttpHeaders({
      'Authorization': 'Basic ' + encodedCredentials
    });

    console.log('Iniciando autorización...');

    try {
      const response: any = await this.http.get(this.authUrl, { headers }).toPromise();
      if (!response.authorizationToken) {
        throw new Error('No se recibió un token de autorización');
      }
      this.authToken = response.authorizationToken;
      console.log('Token de autorización recibido:', this.authToken);
    } catch (error) {
      console.error('Error en la autorización:', error);
      throw error;
    }
  }

  private async getUploadUrl(): Promise<any> {
    // Cambiamos a la versión correcta v2 de la API
    const url = `${this.apiUrl}/b2_get_upload_url`;  // La URL debe ser para POST
    const body = { bucketId: this.bucketId };  // El bucketId se pasa en el cuerpo cuando usamos POST
    const headers = new HttpHeaders({ 'Authorization': this.authToken });
    
    console.log('AuthToken:', this.authToken);
    console.log('bucketId:', this.bucketId);
    console.log('Solicitando URL de subida...');
  
    try {
      // Realizamos la solicitud POST
      const response: any = await this.http.post(url, body, { headers }).toPromise();
      if (!response.uploadUrl || !response.authorizationToken) {
        throw new Error('No se pudo obtener la URL de subida');
      }
      console.log('URL de subida obtenida:', response.uploadUrl);
      return response;
    } catch (error: any) {  
      if (error.status) {
        console.error(`Error HTTP: ${error.status} - ${error.statusText}`);
        console.error('Detalles del error:', error.error);
      } else if (error instanceof Error) {
        console.error('Error estándar:', error.message);
      } else {
        console.error('Error desconocido:', error);
      }
  
      // Lanzamos nuevamente el error para que pueda ser manejado más adelante
      throw error;
    }
  }
  

  // Método privado para subir el archivo
  private async uploadFile(file: File): Promise<any> {
    console.log('Preparando para subir el archivo...');

    try {
      const uploadResponse = await this.getUploadUrl();
      const uploadUrl = uploadResponse.uploadUrl;
      const uploadAuthToken = uploadResponse.authorizationToken;

      console.log('Subiendo archivo a la URL:', uploadUrl);

      const headers = new HttpHeaders({
        'Authorization': uploadAuthToken,
        'X-Bz-File-Name': encodeURIComponent(file.name),
        'Content-Type': file.type,
        'X-Bz-Content-Sha1': 'do_not_verify'  // Puedes calcular el SHA1 real si es necesario
      });

      const formData = new FormData();
      formData.append('file', file);

      const response = await this.http.post(uploadUrl, formData, { headers }).toPromise();
      console.log('Respuesta recibida de la subida del archivo:', response);
      return response;
    } catch (error) {
      console.error('Error subiendo el archivo:', error);
      throw error;
    }
  }
}
