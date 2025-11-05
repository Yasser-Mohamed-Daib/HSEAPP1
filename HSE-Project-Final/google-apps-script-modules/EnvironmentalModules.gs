/**
 * Environmental Modules - Google Apps Script
 * إدارة الأنشطة البيئية
 */

const EnvironmentalModules = {
    /**
     * إضافة جانب بيئي
     */
    addEnvironmentalAspect: function(payload, spreadsheetId) {
        try {
            const spreadsheet = SpreadsheetApp.openById(spreadsheetId);
            const sheet = spreadsheet.getSheetByName('EnvironmentalAspects') || spreadsheet.insertSheet('EnvironmentalAspects');
            
            if (sheet.getLastRow() === 0) {
                const headers = [
                    'id', 'name', 'description', 'impact',
                    'createdAt', 'updatedAt'
                ];
                sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
                sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
            }
            
            const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
            const values = headers.map(key => payload[key] || '');
            sheet.appendRow(values);
            
            return { success: true, message: 'تم إضافة الجانب البيئي بنجاح' };
        } catch (error) {
            return { success: false, message: error.toString() };
        }
    },
    
    /**
     * إضافة مراقبة بيئية
     */
    addEnvironmentalMonitoring: function(payload, spreadsheetId) {
        try {
            const spreadsheet = SpreadsheetApp.openById(spreadsheetId);
            const sheet = spreadsheet.getSheetByName('EnvironmentalMonitoring') || spreadsheet.insertSheet('EnvironmentalMonitoring');
            
            if (sheet.getLastRow() === 0) {
                const headers = [
                    'id', 'aspect', 'date', 'value', 'unit', 'status',
                    'createdAt', 'updatedAt'
                ];
                sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
                sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
            }
            
            const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
            const values = headers.map(key => payload[key] || '');
            sheet.appendRow(values);
            
            return { success: true, message: 'تم إضافة المراقبة البيئية بنجاح' };
        } catch (error) {
            return { success: false, message: error.toString() };
        }
    },
    
    /**
     * إضافة برنامج استدامة
     */
    addSustainability: function(payload, spreadsheetId) {
        try {
            const spreadsheet = SpreadsheetApp.openById(spreadsheetId);
            const sheet = spreadsheet.getSheetByName('Sustainability') || spreadsheet.insertSheet('Sustainability');
            
            if (sheet.getLastRow() === 0) {
                const headers = [
                    'id', 'name', 'description', 'startDate', 'status',
                    'createdAt', 'updatedAt'
                ];
                sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
                sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
            }
            
            const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
            const values = headers.map(key => payload[key] || '');
            sheet.appendRow(values);
            
            return { success: true, message: 'تم إضافة برنامج الاستدامة بنجاح' };
        } catch (error) {
            return { success: false, message: error.toString() };
        }
    },
    
    /**
     * إضافة بصمة كربونية
     */
    addCarbonFootprint: function(payload, spreadsheetId) {
        try {
            const spreadsheet = SpreadsheetApp.openById(spreadsheetId);
            const sheet = spreadsheet.getSheetByName('CarbonFootprint') || spreadsheet.insertSheet('CarbonFootprint');
            
            if (sheet.getLastRow() === 0) {
                const headers = [
                    'id', 'date', 'source', 'co2Equivalent', 'description',
                    'createdAt', 'updatedAt'
                ];
                sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
                sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
            }
            
            const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
            const values = headers.map(key => payload[key] || '');
            sheet.appendRow(values);
            
            return { success: true, message: 'تم إضافة البصمة الكربونية بنجاح' };
        } catch (error) {
            return { success: false, message: error.toString() };
        }
    },
    
    /**
     * إضافة إدارة النفايات
     */
    addWasteManagement: function(payload, spreadsheetId) {
        try {
            const spreadsheet = SpreadsheetApp.openById(spreadsheetId);
            const sheet = spreadsheet.getSheetByName('WasteManagement') || spreadsheet.insertSheet('WasteManagement');
            
            if (sheet.getLastRow() === 0) {
                const headers = [
                    'id', 'date', 'wasteType', 'quantity', 'disposalMethod',
                    'createdAt', 'updatedAt'
                ];
                sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
                sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
            }
            
            const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
            const values = headers.map(key => payload[key] || '');
            sheet.appendRow(values);
            
            return { success: true, message: 'تم إضافة إدارة النفايات بنجاح' };
        } catch (error) {
            return { success: false, message: error.toString() };
        }
    },
    
    /**
     * إضافة كفاءة الطاقة
     */
    addEnergyEfficiency: function(payload, spreadsheetId) {
        try {
            const spreadsheet = SpreadsheetApp.openById(spreadsheetId);
            const sheet = spreadsheet.getSheetByName('EnergyEfficiency') || spreadsheet.insertSheet('EnergyEfficiency');
            
            if (sheet.getLastRow() === 0) {
                const headers = [
                    'id', 'date', 'department', 'energyConsumption', 'efficiencyPercentage', 'notes',
                    'createdAt', 'updatedAt'
                ];
                sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
                sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
            }
            
            const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
            const values = headers.map(key => payload[key] || '');
            sheet.appendRow(values);
            
            return { success: true, message: 'تم إضافة كفاءة الطاقة بنجاح' };
        } catch (error) {
            return { success: false, message: error.toString() };
        }
    },
    
    /**
     * إضافة إدارة المياه
     */
    addWaterManagement: function(payload, spreadsheetId) {
        try {
            const spreadsheet = SpreadsheetApp.openById(spreadsheetId);
            const sheet = spreadsheet.getSheetByName('WaterManagement') || spreadsheet.insertSheet('WaterManagement');
            
            if (sheet.getLastRow() === 0) {
                const headers = [
                    'id', 'date', 'usageType', 'quantity', 'waterSource',
                    'createdAt', 'updatedAt'
                ];
                sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
                sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
            }
            
            const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
            const values = headers.map(key => payload[key] || '');
            sheet.appendRow(values);
            
            return { success: true, message: 'تم إضافة إدارة المياه بنجاح' };
        } catch (error) {
            return { success: false, message: error.toString() };
        }
    },
    
    /**
     * إضافة برنامج إعادة التدوير
     */
    addRecyclingProgram: function(payload, spreadsheetId) {
        try {
            const spreadsheet = SpreadsheetApp.openById(spreadsheetId);
            const sheet = spreadsheet.getSheetByName('RecyclingPrograms') || spreadsheet.insertSheet('RecyclingPrograms');
            
            if (sheet.getLastRow() === 0) {
                const headers = [
                    'id', 'programName', 'materialType', 'recyclingRate', 'status', 'description',
                    'createdAt', 'updatedAt'
                ];
                sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
                sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
            }
            
            const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
            const values = headers.map(key => payload[key] || '');
            sheet.appendRow(values);
            
            return { success: true, message: 'تم إضافة برنامج إعادة التدوير بنجاح' };
        } catch (error) {
            return { success: false, message: error.toString() };
        }
    }
};

