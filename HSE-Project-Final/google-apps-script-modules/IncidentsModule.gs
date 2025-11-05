/**
 * Incidents Module - Google Apps Script
 * إدارة الحوادث
 */

const IncidentsModule = {
    /**
     * إضافة حادث جديد
     */
    addIncident: function(payload, spreadsheetId) {
        try {
            const spreadsheet = SpreadsheetApp.openById(spreadsheetId);
            const sheet = spreadsheet.getSheetByName('Incidents') || spreadsheet.insertSheet('Incidents');
            
            // إضافة رؤوس إذا لم تكن موجودة
            if (sheet.getLastRow() === 0) {
                const headers = [
                    'id', 'isoCode', 'title', 'description', 'date', 'location',
                    'severity', 'status', 'reportedBy', 'correctiveAction',
                    'image', 'createdAt', 'updatedAt'
                ];
                sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
                sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
            }
            
            // إضافة الحادث
            const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
            const values = headers.map(key => payload[key] || '');
            sheet.appendRow(values);
            
            return { success: true, message: 'تم إضافة الحادث بنجاح' };
        } catch (error) {
            return { success: false, message: error.toString() };
        }
    },
    
    /**
     * تحديث حادث
     */
    updateIncident: function(payload, spreadsheetId) {
        try {
            const spreadsheet = SpreadsheetApp.openById(spreadsheetId);
            const sheet = spreadsheet.getSheetByName('Incidents');
            
            if (!sheet) {
                return { success: false, message: 'Incidents sheet not found' };
            }
            
            const data = sheet.getDataRange().getValues();
            const headers = data[0];
            const idIndex = headers.indexOf('id');
            
            if (idIndex === -1) {
                return { success: false, message: 'ID column not found' };
            }
            
            // البحث عن الحادث وتحديثه
            for (let i = 1; i < data.length; i++) {
                if (data[i][idIndex] === payload.id) {
                    headers.forEach((header, colIndex) => {
                        if (payload.hasOwnProperty(header)) {
                            sheet.getRange(i + 1, colIndex + 1).setValue(payload[header]);
                        }
                    });
                    // تحديث updatedAt
                    const updatedAtIndex = headers.indexOf('updatedAt');
                    if (updatedAtIndex !== -1) {
                        sheet.getRange(i + 1, updatedAtIndex + 1).setValue(new Date().toISOString());
                    }
                    return { success: true, message: 'تم تحديث الحادث بنجاح' };
                }
            }
            
            return { success: false, message: 'Incident not found' };
        } catch (error) {
            return { success: false, message: error.toString() };
        }
    },
    
    /**
     * الحصول على حادث
     */
    getIncident: function(payload, spreadsheetId) {
        try {
            const spreadsheet = SpreadsheetApp.openById(spreadsheetId);
            const sheet = spreadsheet.getSheetByName('Incidents');
            
            if (!sheet) {
                return { success: false, message: 'Incidents sheet not found', data: null };
            }
            
            const data = sheet.getDataRange().getValues();
            const headers = data[0];
            const idIndex = headers.indexOf('id');
            
            if (idIndex === -1) {
                return { success: false, message: 'ID column not found', data: null };
            }
            
            // البحث عن الحادث
            for (let i = 1; i < data.length; i++) {
                if (data[i][idIndex] === payload.id) {
                    const incident = {};
                    headers.forEach((header, colIndex) => {
                        incident[header] = data[i][colIndex];
                    });
                    return { success: true, data: incident };
                }
            }
            
            return { success: false, message: 'Incident not found', data: null };
        } catch (error) {
            return { success: false, message: error.toString(), data: null };
        }
    }
};

