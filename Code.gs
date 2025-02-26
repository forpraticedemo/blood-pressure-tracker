function doPost(e) {
  var sheetId = e.parameter.sheetId || "1kVXne88AUwc_ovhd5iByRgNG0PqgNzaD1YjHL4xrm6A";
  var sheetName = e.parameter.sheetName || "wolkesau@gmail.com";
  var data = JSON.parse(e.postData.contents);
  return ContentService.createTextOutput(addBloodPressureData(sheetId, sheetName, data)).setMimeType(ContentService.MimeType.JSON).setHeader("Access-Control-Allow-Origin", "*");
}

function addBloodPressureData(sheetId, sheetName, data) {
  var sheet = SpreadsheetApp.openById(sheetId).getSheetByName(sheetName);
  sheet.appendRow([data.收縮壓, data.舒張壓, data.心率, data.時間]);
  return JSON.stringify({status: 'success'});
}

function doGet(e) {
  var sheetId = e.parameter.sheetId || "1kVXne88AUwc_ovhd5iByRgNG0PqgNzaD1YjHL4xrm6A";
  var sheetName = e.parameter.sheetName || "wolkesau@gmail.com";
  return ContentService.createTextOutput(getBloodPressureData(sheetId, sheetName)).setMimeType(ContentService.MimeType.JSON).setHeader("Access-Control-Allow-Origin", "*");
}

function getBloodPressureData(sheetId, sheetName) {
  var sheet = SpreadsheetApp.openById(sheetId).getSheetByName(sheetName);
  var data = sheet.getDataRange().getValues();
  var result = [];

  for (var i = 1; i < data.length; i++) {
    var row = data[i];
    result.push({
      "收縮壓": row[0],
      "舒張壓": row[1],
      "心率": row[2],
      "時間": row[3]
    });
  }

  return JSON.stringify(result);
}