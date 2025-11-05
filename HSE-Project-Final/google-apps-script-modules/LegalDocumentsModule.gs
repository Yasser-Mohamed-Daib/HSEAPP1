/**
 * Legal Documents Module - Google Apps Script
 * إدارة الوثائق القانونية
 */

const LegalDocumentsModule = {
    /**
     * إضافة وثيقة قانونية
     */
    addLegalDocument: function(payload, spreadsheetId) {
        try {
            const spreadsheet = SpreadsheetApp.openById(spreadsheetId);
            const sheet = spreadsheet.getSheetByName('LegalDocuments') || spreadsheet.insertSheet('LegalDocuments');
            
            if (sheet.getLastRow() === 0) {
                const headers = [
                    'id', 'isoCode', 'documentName', 'documentType', 'documentNumber',
                    'issuedBy', 'issueDate', 'expiryDate', 'alertDays', 'status',
                    'description', 'documentLink', 'createdAt', 'updatedAt'
                ];
                sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
                sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
            }
            
            const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
            const values = headers.map(key => payload[key] || '');
            sheet.appendRow(values);
            
            return { success: true, message: 'تم إضافة الوثيقة القانونية بنجاح' };
        } catch (error) {
            return { success: false, message: error.toString() };
        }
    },
    
    /**
     * تحديث وثيقة قانونية
     */
    updateLegalDocument: function(payload, spreadsheetId) {
        try {
            const spreadsheet = SpreadsheetApp.openById(spreadsheetId);
            const sheet = spreadsheet.getSheetByName('LegalDocuments');
            
            if (!sheet) {
                return { success: false, message: 'LegalDocuments sheet not found' };
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
                    return { success: true, message: 'تم تحديث الوثيقة القانونية بنجاح' };
                }
            }
            
            return { success: false, message: 'Legal Document not found' };
        } catch (error) {
            return { success: false, message: error.toString() };
        }
    }
};

