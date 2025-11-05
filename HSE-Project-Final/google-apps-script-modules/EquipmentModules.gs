/**
 * Equipment Modules - Google Apps Script
 * إدارة المعدات
 */

const EquipmentModules = {
    /**
     * إضافة معدات الحريق
     */
    addFireEquipment: function(payload, spreadsheetId) {
        try {
            const spreadsheet = SpreadsheetApp.openById(spreadsheetId);
            const sheet = spreadsheet.getSheetByName('FireEquipment') || spreadsheet.insertSheet('FireEquipment');
            
            if (sheet.getLastRow() === 0) {
                const headers = [
                    'id', 'equipmentNumber', 'equipmentType', 'location', 'checkDate',
                    'status', 'inspector', 'notes', 'createdAt', 'updatedAt'
                ];
                sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
                sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
            }
            
            const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
            const values = headers.map(key => payload[key] || '');
            sheet.appendRow(values);
            
            return { success: true, message: 'تم إضافة معدات الحريق بنجاح' };
        } catch (error) {
            return { success: false, message: error.toString() };
        }
    },
    
    /**
     * إضافة معدات الحماية الشخصية (PPE)
     */
    addPPE: function(payload, spreadsheetId) {
        try {
            const spreadsheet = SpreadsheetApp.openById(spreadsheetId);
            const sheet = spreadsheet.getSheetByName('PPE') || spreadsheet.insertSheet('PPE');
            
            if (sheet.getLastRow() === 0) {
                const headers = [
                    'id', 'receiptNumber', 'employeeName', 'employeeCode', 'employeeNumber',
                    'equipmentType', 'quantity', 'receiptDate', 'status',
                    'createdAt', 'updatedAt'
                ];
                sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
                sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
            }
            
            const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
            const values = headers.map(key => payload[key] || '');
            sheet.appendRow(values);
            
            return { success: true, message: 'تم إضافة معدات الحماية الشخصية بنجاح' };
        } catch (error) {
            return { success: false, message: error.toString() };
        }
    },
    
    /**
     * إضافة مخزون العيادة
     */
    addClinicInventory: function(payload, spreadsheetId) {
        try {
            const spreadsheet = SpreadsheetApp.openById(spreadsheetId);
            const sheet = spreadsheet.getSheetByName('ClinicInventory') || spreadsheet.insertSheet('ClinicInventory');
            
            if (sheet.getLastRow() === 0) {
                const headers = [
                    'id', 'medicationName', 'quantity', 'expiryDate', 'location',
                    'createdAt', 'updatedAt'
                ];
                sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
                sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
            }
            
            const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
            const values = headers.map(key => payload[key] || '');
            sheet.appendRow(values);
            
            return { success: true, message: 'تم إضافة مخزون العيادة بنجاح' };
        } catch (error) {
            return { success: false, message: error.toString() };
        }
    }
};

