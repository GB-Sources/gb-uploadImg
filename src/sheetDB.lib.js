class spreadsheetDB {
  constructor (_sheetName, _id){
    this.id = _id;
    this.sp = this.getSpreadsheet(this.id);
    this.sheetData = !_sheetName? null : this.getSheet(_sheetName);
  }

  createSheet(_sheetName){
    var candidateSheet = this.sp.insertSheet();
    candidateSheet.setName(_sheetName);

    return candidateSheet;
  }

  getSpreadsheet(_id){
    return !_id? SpreadsheetApp.getActiveSpreadsheet() : SpreadsheetApp.openById(_id);
  }

  getSheet (_sheetName){
    return !_sheetName? this.sp.getActiveSheet() : this.sp.getSheetByName(_sheetName)
  }

  getLastRowData(isExtendHeader,_sheetData){
    const sheet = !_sheetData? this.sheetData : _sheetData;
    const lastRow = sheet.getLastRow();
    return isExtendHeader? lastRow+1 : lastRow;
  }

  bulkInput(_arr, _sheetName){
    var numOfCol = _arr.length;
    if (!numOfCol) return;

    var _sheetData = !_sheetName ? this.sheetData : this.getSheet(_sheetName);
    var lastRow = this.getLastRowData(null, _sheetData);
    var activeRow = _sheetData.setActiveRange(_sheetData.getRange(lastRow + 1,1,1,numOfCol));
    return activeRow.setValues([_arr])
  }

  getAllData(_sheetName){
    var sheet = !_sheetName ? this.sheetData : this.getSheet(_sheetName);
    var col_length = sheet.getLastColumn();
    var row_length = sheet.getLastRow();
    var range = sheet.getRange(1,1,row_length, col_length);
    var value = range.getValues();

    return value;
  }
}
