/**
 * Near Miss Module - Google Apps Script
 * إدارة الحوادث الوشيكة
 */

const NearMissModule = {
    /**
     * إضافة حادث وشيك جديد
     */
    addNearMiss: function(payload, spreadsheetId) {
        try {
            const spreadsheet = SpreadsheetApp.openById(spreadsheetId);
            const sheet = spreadsheet.getSheetByName('NearMiss') || spreadsheet.insertSheet('NearMiss');
            
            // إضافة رؤوس إذا لم تكن موجودة
            if (sheet.getLastRow() === 0) {
                const headers = [
                    'id', 'title', 'description', 'date', 'location',
                    'reportedBy', 'status', 'actionsTaken', 'createdAt', 'updatedAt'
                ];
                sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
                sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
            }
            
            // إضافة الحادث الوشيك
            const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
            const values = headers.map(key => payload[key] || '');
            sheet.appendRow(values);
            
            return { success: true, message: 'تم إضافة الحادث الوشيك بنجاح' };
        } catch (error) {
            return { success: false, message: error.toString() };
        }
    }
};

