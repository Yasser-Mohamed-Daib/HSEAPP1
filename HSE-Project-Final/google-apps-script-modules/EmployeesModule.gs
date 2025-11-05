/**
 * Employees Module - Google Apps Script
 * إدارة الموظفين
 */

const EmployeesModule = {
    /**
     * إضافة موظف جديد
     */
    addEmployee: function(payload, spreadsheetId) {
        try {
            const spreadsheet = SpreadsheetApp.openById(spreadsheetId);
            const sheet = spreadsheet.getSheetByName('Employees') || spreadsheet.insertSheet('Employees');
            
            if (sheet.getLastRow() === 0) {
                const headers = [
                    'id', 'name', 'employeeNumber', 'sapId', 'job', 'department',
                    'branch', 'location', 'gender', 'nationalId', 'birthDate',
                    'hireDate', 'position', 'email', 'phone', 'photo',
                    'createdAt', 'updatedAt'
                ];
                sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
                sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
            }
            
            const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
            const values = headers.map(key => payload[key] || '');
            sheet.appendRow(values);
            
            return { success: true, message: 'تم إضافة الموظف بنجاح' };
        } catch (error) {
            return { success: false, message: error.toString() };
        }
    },
    
    /**
     * تحديث موظف
     */
    updateEmployee: function(payload, spreadsheetId) {
        try {
            const spreadsheet = SpreadsheetApp.openById(spreadsheetId);
            const sheet = spreadsheet.getSheetByName('Employees');
            
            if (!sheet) {
                return { success: false, message: 'Employees sheet not found' };
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
                    return { success: true, message: 'تم تحديث الموظف بنجاح' };
                }
            }
            
            return { success: false, message: 'Employee not found' };
        } catch (error) {
            return { success: false, message: error.toString() };
        }
    }
};

