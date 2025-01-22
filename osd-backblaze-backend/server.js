const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();
 
// Habilitar CORS para que el frontend pueda hacer solicitudes
app.use(cors());

// Middleware para interpretar JSON en las solicitudes
app.use(express.json());

// Endpoint para autorizar la cuenta de Backblaze
app.get('/authorize', async (req, res) => {
  const accountId = '0055738d4931ced000000000d';  // Reemplaza con tu Account ID de Backblaze
  const applicationKey = 'K005vHrgizyOMTX4aOalnxVUcICyb+Q';  // Reemplaza con tu Application Key de Backblaze

  const credentials = Buffer.from(`${accountId}:${applicationKey}`).toString('base64');
  const headers = {
    'Authorization': `Basic ${credentials}`
  };

  try {
    const response = await axios.get('https://api.backblazeb2.com/b2api/v2/b2_authorize_account', { headers });
    res.json(response.data);  // Enviar los datos de autorización al frontend
  } catch (error) {
    console.error('Error al autorizar cuenta:', error.response.data);
    res.status(500).json({ error: 'Error al autorizar cuenta de Backblaze' });
  }
});

// Endpoint para obtener la URL de subida
app.post('/get-upload-url', async (req, res) => {
  const { apiUrl, authorizationToken, bucketId } = req.body;

  const headers = {
    'Authorization': authorizationToken
  };

  try {
    const response = await axios.post(`${apiUrl}/b2api/v2/b2_get_upload_url`, { bucketId }, { headers });
    res.json(response.data);  // Enviar la URL de subida al frontend
  } catch (error) {
    console.error('Error al obtener la URL de subida:', error.response.data);
    res.status(500).json({ error: 'Error al obtener la URL de subida de Backblaze' });
  }
});

const multer = require('multer');
const upload = multer();

app.post('/upload-file', upload.single('fileData'), async (req, res) => {
  const { uploadUrl, authorizationToken, fileName } = req.body;
  const fileData = req.file.buffer;  // El archivo se puede obtener como un buffer con multer.

  const headers = {
    'Authorization': authorizationToken,
    'X-Bz-File-Name': encodeURIComponent(fileName),
    'Content-Type': 'b2/x-auto',
    'X-Bz-Content-Sha1': 'do_not_verify'
  };

  try {
    const response = await axios.post(uploadUrl, fileData, { headers });
    res.json(response.data);
  } catch (error) {
    console.error('Error al subir el archivo:', error.response.data);
    res.status(500).json({ error: 'Error al subir el archivo a Backblaze' });
  }
});

// Endpoint para obtener la URL de descarga usando el fileId
app.get('/get-download-url', async (req, res) => {
  const { fileId, authorizationToken, apiUrl, downloadUrl } = req.query;

  const headers = {
    'Authorization': authorizationToken
  };

  try {
    // Obtener los detalles del archivo usando el fileId
    const response = await axios.get(`${apiUrl}/b2api/v2/b2_get_file_info?fileId=${fileId}`, { headers });

    const fileName = response.data.fileName;

    if (!fileName) {
      throw new Error('El nombre del archivo no está disponible.');
    }

    // Usar el nombre del bucket que ya conocemos (Osd-Bucket)
    const bucketName = 'Osd-Bucket';

    // Formar la URL de descarga
    const finalDownloadUrl = `${downloadUrl}/file/${bucketName}/${encodeURIComponent(fileName)}`;


    // Enviar la URL de descarga de vuelta al frontend
    res.json({ downloadUrl: finalDownloadUrl, fileName });
  } catch (error) {
    console.error('Error al obtener la información del archivo:', error.response ? error.response.data : error);
    res.status(500).json({ error: 'Error al obtener la información del archivo de Backblaze' });
  }
});


app.get('/download-file', async (req, res) => {
  const { downloadUrl, fileName, authorizationToken } = req.query; // Agregamos el authorizationToken

  try {
    // Realizar la solicitud HTTP GET a la URL de descarga con el token de autorización
    const response = await axios({
      method: 'get',
      url: downloadUrl,
      responseType: 'stream', // Necesitamos el archivo en formato de stream
      headers: {
        'Authorization': authorizationToken // Añadimos el token de autorización en los headers
      }
    });

    // Configurar las cabeceras para que el archivo se descargue con el nombre correcto
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    res.setHeader('Content-Type', response.headers['content-type']);

    // Pasar el archivo descargado al cliente
    response.data.pipe(res);
  } catch (error) {
    console.error('Error al descargar el archivo:', error.message || error.response?.data || error);
    res.status(500).json({ error: 'Error al descargar el archivo de Backblaze' });
  }
});

app.post('/delete-file', async (req, res) => {
  const { fileId, authorizationToken, apiUrl } = req.body;

  const headers = {
    'Authorization': authorizationToken
  };

  try {
    // Obtener los detalles del archivo usando el fileId
    const fileInfoResponse = await axios.get(`${apiUrl}/b2api/v2/b2_get_file_info?fileId=${fileId}`, { headers });

    const fileName = fileInfoResponse.data.fileName;

    if (!fileName) {
      throw new Error('No se pudo obtener el nombre del archivo para su eliminación.');
    }

    // Eliminar el archivo usando el fileId y fileName obtenidos
    const deleteResponse = await axios.post(`${apiUrl}/b2api/v2/b2_delete_file_version`, {
      fileName: fileName,
      fileId: fileId
    }, { headers });

    // Responder con la confirmación de eliminación
    res.json({ message: 'Archivo eliminado exitosamente', data: deleteResponse.data });
  } catch (error) {
    console.error('Error al obtener o eliminar el archivo:', error.response ? error.response.data : error);
    res.status(500).json({ error: 'Error al obtener o eliminar el archivo de Backblaze' });
  }
});

// Iniciar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
});
