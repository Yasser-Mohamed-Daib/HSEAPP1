/**
 * Chemical Safety Module - Google Apps Script
 * إدارة السلامة الكيميائية
 */

const ChemicalSafetyModule = {
    /**
     * إضافة سجل سلامة كيميائية
     */
    addChemicalSafety: function(payload, spreadsheetId) {
        try {
            const spreadsheet = SpreadsheetApp.openById(spreadsheetId);
            const sheet = spreadsheet.getSheetByName('ChemicalSafety') || spreadsheet.insertSheet('ChemicalSafety');
            
            if (sheet.getLastRow() === 0) {
                const headers = [
                    'id', 'isoCode', 'chemicalName', 'trainer', 'date',
                    'status', 'description', 'createdAt', 'updatedAt'
                ];
                sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
                sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
            }
            
            const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
            const values = headers.map(key => payload[key] || '');
            sheet.appendRow(values);
            
            return { success: true, message: 'تم إضافة سجل السلامة الكيميائية بنجاح' };
        } catch (error) {
            return { success: false, message: error.toString() };
        }
    }
};

