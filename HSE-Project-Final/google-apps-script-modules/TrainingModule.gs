/**
 * Training Module - Google Apps Script
 * إدارة التدريبات
 */

const TrainingModule = {
    /**
     * إضافة تدريب جديد
     */
    addTraining: function(payload, spreadsheetId) {
        try {
            const spreadsheet = SpreadsheetApp.openById(spreadsheetId);
            const sheet = spreadsheet.getSheetByName('Training') || spreadsheet.insertSheet('Training');
            
            // إضافة رؤوس إذا لم تكن موجودة
            if (sheet.getLastRow() === 0) {
                const headers = [
                    'id', 'title', 'description', 'date', 'duration', 'trainer',
                    'participants', 'location', 'status', 'certificates',
                    'createdAt', 'updatedAt'
                ];
                sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
                sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
            }
            
            // إضافة التدريب
            const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
            const values = headers.map(key => payload[key] || '');
            sheet.appendRow(values);
            
            return { success: true, message: 'تم إضافة التدريب بنجاح' };
        } catch (error) {
            return { success: false, message: error.toString() };
        }
    }
};

