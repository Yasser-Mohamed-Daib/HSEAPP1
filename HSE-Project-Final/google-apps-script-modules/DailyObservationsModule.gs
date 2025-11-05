/**
 * Daily Observations Module - Google Apps Script
 * إدارة الملاحظات اليومية
 */

const DailyObservationsModule = {
    /**
     * إضافة ملاحظة يومية
     */
    addObservation: function(payload, spreadsheetId) {
        try {
            const spreadsheet = SpreadsheetApp.openById(spreadsheetId);
            const sheet = spreadsheet.getSheetByName('DailyObservations') || spreadsheet.insertSheet('DailyObservations');
            
            if (sheet.getLastRow() === 0) {
                const headers = [
                    'id', 'isoCode', 'supervisor', 'date', 'observationType',
                    'status', 'description', 'correctiveAction', 'images',
                    'createdAt', 'updatedAt'
                ];
                sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
                sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
            }
            
            const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
            const values = headers.map(key => payload[key] || '');
            sheet.appendRow(values);
            
            return { success: true, message: 'تم إضافة الملاحظة اليومية بنجاح' };
        } catch (error) {
            return { success: false, message: error.toString() };
        }
    },
    
    /**
     * تحديث ملاحظة يومية
     */
    updateObservation: function(payload, spreadsheetId) {
        try {
            const spreadsheet = SpreadsheetApp.openById(spreadsheetId);
            const sheet = spreadsheet.getSheetByName('DailyObservations');
            
            if (!sheet) {
                return { success: false, message: 'DailyObservations sheet not found' };
            }
            
            const data = sheet.getDataRange().getValues();
            const headers = data[0];
            const idIndex = headers.indexOf('id');
            
            if (idIndex === -1) {
                return { success: false, message: 'ID column not found' };
            }
            
            for (let i = 1; i < data.length; i++) {
                if (data[i][idIndex] === payload.id) {
                    headers.forEach((header, colIndex) => {
                        if (payload.hasOwnProperty(header)) {
                            sheet.getRange(i + 1, colIndex + 1).setValue(payload[header]);
                        }
                    });
                    const updatedAtIndex = headers.indexOf('updatedAt');
                    if (updatedAtIndex !== -1) {
                        sheet.getRange(i + 1, updatedAtIndex + 1).setValue(new Date().toISOString());
                    }
                    return { success: true, message: 'تم تحديث الملاحظة اليومية بنجاح' };
                }
            }
            
            return { success: false, message: 'Observation not found' };
        } catch (error) {
            return { success: false, message: error.toString() };
        }
    }
};

