function doPost(e) {
  var sheetId = e.parameter.sheetId || "1kVXne88AUwc_ovhd5iByRgNG0PqgNzaD1YjHL4xrm6A";
  var sheetName = e.parameter.sheetName || "wolkesau@gmail.com";
  var data = JSON.parse(e.postData.contents);
  
  var output = ContentService.createTextOutput(JSON.stringify({
    result: addBloodPressureData(sheetId, sheetName, data)
  })).setMimeType(ContentService.MimeType.JSON);
  
  // 設置 CORS headers
  return HtmlService.createHtmlOutput()
    .setContent(output.getContent())
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function addBloodPressureData(sheetId, sheetName, data) {
  var sheet = SpreadsheetApp.openById(sheetId).getSheetByName(sheetName);
  sheet.appendRow([data.收縮壓, data.舒張壓, data.心率, data.時間]);
  return JSON.stringify({status: 'success'});
}

function doGet(e) {
  var sheetId = e.parameter.sheetId || "1kVXne88AUwc_ovhd5iByRgNG0PqgNzaD1YjHL4xrm6A";
  var sheetName = e.parameter.sheetName || "wolkesau@gmail.com";

  var bloodPressureData = getBloodPressureData(sheetId, sheetName);
  
  return ContentService.createTextOutput(JSON.stringify({
    status: 200,
    message: '成功',
    data: bloodPressureData
  }))
  .setMimeType(ContentService.MimeType.JSON);
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

  return result;
}


