/**
 * Clinic Module - Google Apps Script
 * إدارة عيادة الشركة
 */

const ClinicModule = {
    /**
     * إضافة زيارة عيادة
     */
    addClinicVisit: function(payload, spreadsheetId) {
        try {
            const spreadsheet = SpreadsheetApp.openById(spreadsheetId);
            const sheet = spreadsheet.getSheetByName('ClinicVisits') || spreadsheet.insertSheet('ClinicVisits');
            
            if (sheet.getLastRow() === 0) {
                const headers = [
                    'id', 'employeeId', 'employeeName', 'date', 'reason', 'diagnosis',
                    'treatment', 'doctor', 'nextVisit', 'createdAt'
                ];
                sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
                sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
            }
            
            const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
            const values = headers.map(key => payload[key] || '');
            sheet.appendRow(values);
            
            return { success: true, message: 'تم إضافة زيارة العيادة بنجاح' };
        } catch (error) {
            return { success: false, message: error.toString() };
        }
    },
    
    /**
     * إضافة دواء
     */
    addMedication: function(payload, spreadsheetId) {
        try {
            const spreadsheet = SpreadsheetApp.openById(spreadsheetId);
            const sheet = spreadsheet.getSheetByName('Medications') || spreadsheet.insertSheet('Medications');
            
            if (sheet.getLastRow() === 0) {
                const headers = [
                    'id', 'employeeId', 'employeeName', 'medicationName', 'dosage',
                    'frequency', 'duration', 'prescribedBy', 'date', 'createdAt'
                ];
                sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
                sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
            }
            
            const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
            const values = headers.map(key => payload[key] || '');
            sheet.appendRow(values);
            
            return { success: true, message: 'تم إضافة الدواء بنجاح' };
        } catch (error) {
            return { success: false, message: error.toString() };
        }
    },
    
    /**
     * إضافة إجازة مرضية
     */
    addSickLeave: function(payload, spreadsheetId) {
        try {
            const spreadsheet = SpreadsheetApp.openById(spreadsheetId);
            const sheet = spreadsheet.getSheetByName('SickLeave') || spreadsheet.insertSheet('SickLeave');
            
            if (sheet.getLastRow() === 0) {
                const headers = [
                    'id', 'employeeId', 'employeeName', 'startDate', 'endDate',
                    'days', 'reason', 'doctor', 'status', 'createdAt'
                ];
                sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
                sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
            }
            
            const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
            const values = headers.map(key => payload[key] || '');
            sheet.appendRow(values);
            
            return { success: true, message: 'تم إضافة الإجازة المرضية بنجاح' };
        } catch (error) {
            return { success: false, message: error.toString() };
        }
    },
    
    /**
     * إضافة إصابة
     */
    addInjury: function(payload, spreadsheetId) {
        try {
            const spreadsheet = SpreadsheetApp.openById(spreadsheetId);
            const sheet = spreadsheet.getSheetByName('Injuries') || spreadsheet.insertSheet('Injuries');
            
            if (sheet.getLastRow() === 0) {
                const headers = [
                    'id', 'employeeId', 'employeeName', 'date', 'type', 'location',
                    'severity', 'description', 'treatment', 'doctor', 'createdAt'
                ];
                sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
                sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
            }
            
            const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
            const values = headers.map(key => payload[key] || '');
            sheet.appendRow(values);
            
            return { success: true, message: 'تم إضافة الإصابة بنجاح' };
        } catch (error) {
            return { success: false, message: error.toString() };
        }
    }
};

