/**
 * ISO Modules - Google Apps Script
 * إدارة وثائق ISO
 */

const ISOModules = {
    /**
     * إضافة وثيقة ISO
     */
    addISODocument: function(payload, spreadsheetId) {
        try {
            const spreadsheet = SpreadsheetApp.openById(spreadsheetId);
            const sheet = spreadsheet.getSheetByName('ISODocuments') || spreadsheet.insertSheet('ISODocuments');
            
            if (sheet.getLastRow() === 0) {
                const headers = [
                    'id', 'isoCode', 'name', 'type', 'version',
                    'department', 'createdAt', 'updatedAt'
                ];
                sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
                sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
            }
            
            const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
            const values = headers.map(key => payload[key] || '');
            sheet.appendRow(values);
            
            return { success: true, message: 'تم إضافة وثيقة ISO بنجاح' };
        } catch (error) {
            return { success: false, message: error.toString() };
        }
    },
    
    /**
     * إضافة إجراء ISO
     */
    addISOProcedure: function(payload, spreadsheetId) {
        try {
            const spreadsheet = SpreadsheetApp.openById(spreadsheetId);
            const sheet = spreadsheet.getSheetByName('ISOProcedures') || spreadsheet.insertSheet('ISOProcedures');
            
            if (sheet.getLastRow() === 0) {
                const headers = [
                    'id', 'isoCode', 'name', 'department', 'version',
                    'createdAt', 'updatedAt'
                ];
                sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
                sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
            }
            
            const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
            const values = headers.map(key => payload[key] || '');
            sheet.appendRow(values);
            
            return { success: true, message: 'تم إضافة إجراء ISO بنجاح' };
        } catch (error) {
            return { success: false, message: error.toString() };
        }
    },
    
    /**
     * إضافة نموذج ISO
     */
    addISOForm: function(payload, spreadsheetId) {
        try {
            const spreadsheet = SpreadsheetApp.openById(spreadsheetId);
            const sheet = spreadsheet.getSheetByName('ISOForms') || spreadsheet.insertSheet('ISOForms');
            
            if (sheet.getLastRow() === 0) {
                const headers = [
                    'id', 'isoCode', 'name', 'type',
                    'createdAt', 'updatedAt'
                ];
                sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
                sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
            }
            
            const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
            const values = headers.map(key => payload[key] || '');
            sheet.appendRow(values);
            
            return { success: true, message: 'تم إضافة نموذج ISO بنجاح' };
        } catch (error) {
            return { success: false, message: error.toString() };
        }
    },
    
    /**
     * إضافة SOP/JHA
     */
    addSOPJHA: function(payload, spreadsheetId) {
        try {
            const spreadsheet = SpreadsheetApp.openById(spreadsheetId);
            const sheet = spreadsheet.getSheetByName('SOPJHA') || spreadsheet.insertSheet('SOPJHA');
            
            if (sheet.getLastRow() === 0) {
                const headers = [
                    'id', 'isoCode', 'type', 'title', 'department',
                    'issueDate', 'status', 'version', 'procedures',
                    'hazards', 'requiredPPE', 'createdAt', 'updatedAt'
                ];
                sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
                sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
            }
            
            const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
            const values = headers.map(key => payload[key] || '');
            sheet.appendRow(values);
            
            return { success: true, message: 'تم إضافة SOP/JHA بنجاح' };
        } catch (error) {
            return { success: false, message: error.toString() };
        }
    }
};

