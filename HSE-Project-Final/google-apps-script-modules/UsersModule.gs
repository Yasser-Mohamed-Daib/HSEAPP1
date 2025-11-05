/**
 * Users Module - Google Apps Script
 * إدارة المستخدمين
 */

const UsersModule = {
    /**
     * إضافة مستخدم جديد
     */
    addUser: function(payload, spreadsheetId) {
        try {
            const spreadsheet = SpreadsheetApp.openById(spreadsheetId);
            const sheet = spreadsheet.getSheetByName('Users') || spreadsheet.insertSheet('Users');
            
            // إضافة رؤوس إذا لم تكن موجودة
            if (sheet.getLastRow() === 0) {
                const headers = ['id', 'name', 'email', 'password', 'role', 'department', 'active', 'createdAt'];
                sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
                sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
            }
            
            // إضافة المستخدم
            const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
            const values = headers.map(key => payload[key] || '');
            sheet.appendRow(values);
            
            return { success: true, message: 'تم إضافة المستخدم بنجاح' };
        } catch (error) {
            return { success: false, message: error.toString() };
        }
    },
    
    /**
     * تحديث مستخدم
     */
    updateUser: function(payload, spreadsheetId) {
        try {
            const spreadsheet = SpreadsheetApp.openById(spreadsheetId);
            const sheet = spreadsheet.getSheetByName('Users');
            
            if (!sheet) {
                return { success: false, message: 'Users sheet not found' };
            }
            
            const data = sheet.getDataRange().getValues();
            const headers = data[0];
            const idIndex = headers.indexOf('id');
            
            if (idIndex === -1) {
                return { success: false, message: 'ID column not found' };
            }
            
            // البحث عن المستخدم وتحديثه
            for (let i = 1; i < data.length; i++) {
                if (data[i][idIndex] === payload.id) {
                    headers.forEach((header, colIndex) => {
                        if (payload.hasOwnProperty(header)) {
                            sheet.getRange(i + 1, colIndex + 1).setValue(payload[header]);
                        }
                    });
                    return { success: true, message: 'تم تحديث المستخدم بنجاح' };
                }
            }
            
            return { success: false, message: 'User not found' };
        } catch (error) {
            return { success: false, message: error.toString() };
        }
    },
    
    /**
     * حذف مستخدم
     */
    deleteUser: function(payload, spreadsheetId) {
        try {
            const spreadsheet = SpreadsheetApp.openById(spreadsheetId);
            const sheet = spreadsheet.getSheetByName('Users');
            
            if (!sheet) {
                return { success: false, message: 'Users sheet not found' };
            }
            
            const data = sheet.getDataRange().getValues();
            const headers = data[0];
            const idIndex = headers.indexOf('id');
            
            if (idIndex === -1) {
                return { success: false, message: 'ID column not found' };
            }
            
            // البحث عن المستخدم وحذفه
            for (let i = 1; i < data.length; i++) {
                if (data[i][idIndex] === payload.id) {
                    sheet.deleteRow(i + 1);
                    return { success: true, message: 'تم حذف المستخدم بنجاح' };
                }
            }
            
            return { success: false, message: 'User not found' };
        } catch (error) {
            return { success: false, message: error.toString() };
        }
    }
};

