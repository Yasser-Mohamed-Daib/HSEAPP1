/**
 * PTW Module - Google Apps Script
 * إدارة تصاريح العمل
 */

const PTWModule = {
    /**
     * إضافة تصريح عمل جديد
     */
    addPTW: function(payload, spreadsheetId) {
        try {
            const spreadsheet = SpreadsheetApp.openById(spreadsheetId);
            const sheet = spreadsheet.getSheetByName('PTW') || spreadsheet.insertSheet('PTW');
            
            // إضافة رؤوس إذا لم تكن موجودة
            if (sheet.getLastRow() === 0) {
                const headers = [
                    'id', 'title', 'workType', 'location', 'startDate', 'endDate',
                    'requestedBy', 'approvedBy', 'status', 'safetyMeasures',
                    'createdAt', 'updatedAt'
                ];
                sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
                sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
            }
            
            // إضافة التصريح
            const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
            const values = headers.map(key => payload[key] || '');
            sheet.appendRow(values);
            
            return { success: true, message: 'تم إضافة تصريح العمل بنجاح' };
        } catch (error) {
            return { success: false, message: error.toString() };
        }
    }
};

