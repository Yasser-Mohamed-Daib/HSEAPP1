/**
 * HSE Modules - Google Apps Script
 * إدارة أنشطة HSE
 */

const HSEModules = {
    /**
     * إضافة تدقيق HSE
     */
    addHSEAudit: function(payload, spreadsheetId) {
        try {
            const spreadsheet = SpreadsheetApp.openById(spreadsheetId);
            const sheet = spreadsheet.getSheetByName('HSEAudits') || spreadsheet.insertSheet('HSEAudits');
            
            if (sheet.getLastRow() === 0) {
                const headers = [
                    'id', 'type', 'date', 'auditor', 'status',
                    'description', 'createdAt', 'updatedAt'
                ];
                sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
                sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
            }
            
            const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
            const values = headers.map(key => payload[key] || '');
            sheet.appendRow(values);
            
            return { success: true, message: 'تم إضافة تدقيق HSE بنجاح' };
        } catch (error) {
            return { success: false, message: error.toString() };
        }
    },
    
    /**
     * إضافة عدم مطابقة HSE
     */
    addHSENonConformity: function(payload, spreadsheetId) {
        try {
            const spreadsheet = SpreadsheetApp.openById(spreadsheetId);
            const sheet = spreadsheet.getSheetByName('HSENonConformities') || spreadsheet.insertSheet('HSENonConformities');
            
            if (sheet.getLastRow() === 0) {
                const headers = [
                    'id', 'date', 'description', 'status',
                    'createdAt', 'updatedAt'
                ];
                sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
                sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
            }
            
            const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
            const values = headers.map(key => payload[key] || '');
            sheet.appendRow(values);
            
            return { success: true, message: 'تم إضافة عدم المطابقة HSE بنجاح' };
        } catch (error) {
            return { success: false, message: error.toString() };
        }
    },
    
    /**
     * إضافة إجراء تصحيحي HSE
     */
    addHSECorrectiveAction: function(payload, spreadsheetId) {
        try {
            const spreadsheet = SpreadsheetApp.openById(spreadsheetId);
            const sheet = spreadsheet.getSheetByName('HSECorrectiveActions') || spreadsheet.insertSheet('HSECorrectiveActions');
            
            if (sheet.getLastRow() === 0) {
                const headers = [
                    'id', 'description', 'responsible', 'dueDate', 'status',
                    'createdAt', 'updatedAt'
                ];
                sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
                sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
            }
            
            const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
            const values = headers.map(key => payload[key] || '');
            sheet.appendRow(values);
            
            return { success: true, message: 'تم إضافة الإجراء التصحيحي HSE بنجاح' };
        } catch (error) {
            return { success: false, message: error.toString() };
        }
    },
    
    /**
     * إضافة هدف HSE
     */
    addHSEObjective: function(payload, spreadsheetId) {
        try {
            const spreadsheet = SpreadsheetApp.openById(spreadsheetId);
            const sheet = spreadsheet.getSheetByName('HSEObjectives') || spreadsheet.insertSheet('HSEObjectives');
            
            if (sheet.getLastRow() === 0) {
                const headers = [
                    'id', 'name', 'description', 'dueDate', 'responsible', 'status',
                    'createdAt', 'updatedAt'
                ];
                sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
                sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
            }
            
            const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
            const values = headers.map(key => payload[key] || '');
            sheet.appendRow(values);
            
            return { success: true, message: 'تم إضافة هدف HSE بنجاح' };
        } catch (error) {
            return { success: false, message: error.toString() };
        }
    },
    
    /**
     * إضافة تقييم مخاطر HSE
     */
    addHSERiskAssessment: function(payload, spreadsheetId) {
        try {
            const spreadsheet = SpreadsheetApp.openById(spreadsheetId);
            const sheet = spreadsheet.getSheetByName('HSERiskAssessments') || spreadsheet.insertSheet('HSERiskAssessments');
            
            if (sheet.getLastRow() === 0) {
                const headers = [
                    'id', 'activity', 'location', 'date', 'riskLevel', 'status',
                    'createdAt', 'updatedAt'
                ];
                sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
                sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
            }
            
            const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
            const values = headers.map(key => payload[key] || '');
            sheet.appendRow(values);
            
            return { success: true, message: 'تم إضافة تقييم مخاطر HSE بنجاح' };
        } catch (error) {
            return { success: false, message: error.toString() };
        }
    }
};

