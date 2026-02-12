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
}

/**
 * Mengambil data dari Google Sheet 'Content_Plan'
 * URL Database: https://docs.google.com/spreadsheets/d/1B2tyfau0H71XjkZoc3t9Af5zCImr2SRug4CcklhkkaM/edit
 */
// function getContentPlanData() {
//   const ss = SpreadsheetApp.getActiveSpreadsheet();
//   const sheet = ss.getSheetByName('Content_Plan');
//   if (!sheet) return [];
  
//   const data = sheet.getDataRange().getValues();
//   if (data.length < 2) return [];
  
//   const headers = data[0].map(h => h.toString().trim());
//   const rows = data.slice(1);
  
//   return rows.map((row, index) => {
//     let obj = { id: index };
//     headers.forEach((header, i) => {
//       let value = row[i];
      
//       // Handle formatting Date & Time dari Sheet
//       if (value instanceof Date) {
//         if (header.toLowerCase().includes('jam')) {
//           obj[header] = Utilities.formatDate(value, Session.getScriptTimeZone(), "HH:mm");
//         } else {
//           obj[header] = Utilities.formatDate(value, Session.getScriptTimeZone(), "yyyy-MM-dd");
//         }
//       } else {
//         obj[header] = value;
//       }
//     });
//     return obj;
//   });
// }
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