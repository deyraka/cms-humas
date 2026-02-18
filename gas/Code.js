function doGet() {
  // Memastikan pemanggilan file 'index' (i kecil) sesuai standar GAS
  return HtmlService.createTemplateFromFile('index')
    .evaluate()
    .setTitle('Content Plan Calendar')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

function getAppVersion() {
  try {
    return PropertiesService.getScriptProperties().getProperty('APP_VERSION') || 'v2026.1.11';
  } catch (e) {
    return 'v2026.1.11';
  }
}

/**
 * Fungsi untuk menyimpan atau memperbarui data ke sheet Content_Plan
 * @param {Object} formData - Data dari form UI
 */
function saveContentPlan(formData) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('Content_Plan');
  const fullData = sheet.getDataRange().getValues();
  const headers = fullData[0];
  
  const colMap = {};
  headers.forEach((h, i) => colMap[h] = i);
  
  const idColIndex = colMap['ID'];
  const idIndexMap = {};
  for (let i = 1; i < fullData.length; i++) {
    const rowId = fullData[i][idColIndex];
    if (rowId) idIndexMap[rowId] = i + 1;
  }

  // --- LOGIKA UPDATE VS CREATE ---
  
  if (formData.ID && idIndexMap[formData.ID]) {
    // SKENARIO 1: UPDATE PARSIAL
    const rowIndex = idIndexMap[formData.ID];
    // Ambil data lama di baris tersebut agar data kolom lain tidak hilang
    const existingRowData = fullData[rowIndex - 1]; 
    
    // Hanya timpa kolom yang ada di dalam formData
    Object.keys(formData).forEach(key => {
      if (colMap.hasOwnProperty(key)) {
        existingRowData[colMap[key]] = formData[key];
      }
    });

    sheet.getRange(rowIndex, 1, 1, existingRowData.length).setValues([existingRowData]);
    return { success: true, message: "Kolom spesifik ID " + formData.ID + " berhasil diupdate" };

  } else {
    // SKENARIO 2: CREATE BARU
    // Gunakan array kosong karena ini data baru
    const rowData = new Array(headers.length).fill("");
    
    Object.keys(formData).forEach(key => {
      if (colMap.hasOwnProperty(key)) {
        rowData[colMap[key]] = formData[key];
      }
    });

    const newId = generateCustomID();
    rowData[idColIndex] = newId;
    sheet.appendRow(rowData);
    return { success: true, message: "Data baru tersimpan dengan ID: " + newId };
  }
}

function generateCustomID() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let randomPart = '';
  for (let i = 0; i < 5; i++) {
    randomPart += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  const now = new Date();
  const mm = ("0" + (now.getMonth() + 1)).slice(-2);
  const yy = now.getFullYear().toString().slice(-2);
  return `${randomPart}.${mm}${yy}`;
}
/* function saveContentPlan(formData) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('Content_Plan');
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  
  // Mencari index kolom berdasarkan header
  const colMap = {};
  headers.forEach((h, i) => colMap[h] = i);
  
  // Menyiapkan array baris baru berdasarkan urutan kolom di sheet
  const rowData = new Array(headers.length).fill("");
  
  // Mapping data dari form ke kolom sheet (sesuaikan dengan nama kolom di spreadsheet Anda)
  // Asumsi kolom: ID, Tanggal_Rilis, Jam_Rilis, Judul_Cover, Rubrikasi, Jenis_Media, Ide_Konten, Referensi, Link_Hasil, Status
  rowData[colMap['Tanggal_Rilis']] = formData.Tanggal_Rilis;
  rowData[colMap['Jam_Rilis']] = formData.Jam_Rilis;
  rowData[colMap['Judul_Cover']] = formData.Judul_Cover;
  rowData[colMap['Rubrikasi']] = formData.Rubrikasi;
  rowData[colMap['Jenis_Media']] = formData.Jenis_Media;
  rowData[colMap['Ide_Konten']] = formData.Ide_Konten;
  rowData[colMap['Referensi']] = formData.Referensi;
  rowData[colMap['Link_Hasil']] = formData.Link_Hasil || "";
  rowData[colMap['Status']] = formData.Status || "draft";
  // rowData[colMap['ID']] = formData.ID;

  if (formData.ID) {
    // Update data yang sudah ada
    const idColIndex = colMap['ID'];
    for (let i = 1; i < data.length; i++) {
      if (data[i][idColIndex] == formData.ID) {
        // Pertahankan ID lama
        rowData[idColIndex] = formData.ID;
        sheet.getRange(i + 1, 1, 1, rowData.length).setValues([rowData]);
        return { success: true, message: "Konten berhasil diperbarui" };
      }
    }
  } else {
    // Create data baru
    // const newId = "CP-" + Utilities.getUuid().substring(0, 8).toUpperCase();
    rowData[colMap['ID']] = formData.ID;
    sheet.appendRow(rowData);
    return { success: true, message: "Draft baru berhasil disimpan" };
  }
} */

function getContentPlanData() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('Content_Plan');
  if (!sheet) return JSON.stringify([]);
  
  const data = sheet.getDataRange().getValues();
  if (data.length < 2) return JSON.stringify([]);
  
  const headers = data[0].map(h => h.toString().trim());
  const rows = data.slice(1);
  
  const results = rows.map((row, index) => {
    // Gunakan 'ID' (Uppercase) agar sinkron dengan template Vue
    let obj = { ID: index + 1 }; 
    headers.forEach((header, i) => {
      let value = row[i];
      
      if (value instanceof Date) {
        if (header.toLowerCase().includes('jam')) {
          obj[header] = Utilities.formatDate(value, Session.getScriptTimeZone(), "HH:mm");
        } else {
          // Format ISO agar mudah dibaca oleh new Date() di Javascript
          obj[header] = Utilities.formatDate(value, Session.getScriptTimeZone(), "yyyy-MM-dd");
        }
      } else {
        // Pastikan nilai kosong menjadi null agar logic v-if di Vue akurat
        obj[header] = (value === "") ? null : value;
      }
    });
    return obj;
  });

  return JSON.stringify(results); // Mengirim string JSON lebih aman
}

function authenticateUser(username, pin) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('Users');
  if (!sheet) return null;
  const data = sheet.getDataRange().getValues();
  const headers = data[0].map(h => h.toString().trim());
  const rows = data.slice(1);
  
  const idxUser = headers.indexOf('Username');
  const idxPin = headers.indexOf('Pin');
  const idxNama = headers.indexOf('Nama');
  const idxRole = headers.indexOf('Role');
  
  const userRow = rows.find(row => 
    row[idxUser].toString().toLowerCase() === username.toLowerCase() && 
    row[idxPin].toString() === pin.toString()
  );

  if (userRow) {
    return { Nama: userRow[idxNama], Role: userRow[idxRole] };
  }
  return null;
}

/**
 * Mengambil konfigurasi status dari sheet Metadata_Status
 * Diperbaiki dengan filter untuk membuang baris kosong yang terdeteksi
 */
function getStatusSettings() {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName('Metadata_Status');
    
    if (!sheet) {
      throw new Error("Sheet 'Metadata_Status' tidak ditemukan!");
    }

    const lastRow = sheet.getLastRow();
    if (lastRow <= 1) return JSON.stringify([]);

    const lastColumn = sheet.getLastColumn();
    const data = sheet.getRange(1, 1, lastRow, lastColumn).getValues();
    
    const headers = data[0];
    const rows = data.slice(1);

    // Filter dan Map data
    const statusSettings = rows
      .filter(row => row[headers.indexOf('Status_Name')] !== "") // HANYA ambil baris yang Status_Name-nya tidak kosong
      .map(row => {
        let obj = {};
        headers.forEach((header, index) => {
          obj[header] = row[index];
        });
        return obj;
      });

    // Urutkan berdasarkan Sort_Priority (Ascending)
    statusSettings.sort((a, b) => (Number(a.Sort_Priority) || 0) - (Number(b.Sort_Priority) || 0));

    console.log("Total data ditemukan:", statusSettings.length + "\n" + JSON.stringify(statusSettings));
    return JSON.stringify(statusSettings); 
    
  } catch (error) {
    console.error("Error in getStatusSettings:", error.message);
    return JSON.stringify({ error: error.message });
  }
}

/**
 * Fungsi General untuk mengambil metadata dari sheet apa pun secara dinamis
 * @param {string} sheetName Nama sheet metadata (Metadata_Rubrikasi, dll)
 * @return {Array} Array of Objects
 */
function getMetadata(sheetName) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName(sheetName);
    if (!sheet) return [];

    const data = sheet.getDataRange().getValues();
    const headers = data[0];
    const results = [];

    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      const obj = {};
      headers.forEach((header, index) => {
        obj[header] = row[index];
      });
      // Pastikan baris tidak kosong (cek kolom pertama)
      if (obj[headers[0]] !== "") {
        results.push(obj);
      }
    }
    return results;
  } catch (e) {
    console.error("Error getMetadata " + sheetName + ": " + e.message);
    return [];
  }
}

/**
 * Fungsi pembungkus (wrapper) untuk memanggil semua metadata sekaligus 
 * agar proses loading di Vue lebih cepat (hanya 1x request ke GAS)
 */
function getAllMetadata() {
  return {
    rubrikasi: getMetadata('Metadata_Rubrikasi'),
    pilar: getMetadata('Metadata_Pilar'),
    jenisMedia: getMetadata('Metadata_Jenis_Media'),
    status: getMetadata('Metadata_Status') // Jika ingin sekalian refresh status
  };
}