/**
 * Google Apps Script for HSE System
 * 
 * تعليمات الاستخدام:
 * 1. افتح https://script.google.com
 * 2. أنشئ مشروع جديد
 * 3. انسخ هذا الكود والصقه
 * 4. أنشئ جدول Google Sheets جديد (أو استخدم جدول موجود)
 * 5. انسخ معرف الجدول من الرابط وأضفه في SPREADSHEET_ID
 * 6. انشر التطبيق: Deploy → New Deployment → Web App
 * 7. اختر "Execute as: Me" و "Who has access: Anyone"
 * 8. انسخ رابط الويب والصقه في إعدادات التطبيق
 * 
 * ملاحظة مهمة:
 * - الكود سيقوم بإنشاء جميع الأوراق المطلوبة تلقائياً عند أول استخدام
 * - لا حاجة لإنشاء الأوراق يدوياً - سيتم إنشاؤها مع الرؤوس الافتراضية تلقائياً
 */

// معرف جدول Google Sheets (سيتم تحديثه من الإعدادات)
// يمكن تركها فارغة والتمرير من التطبيق، أو إدخال المعرف هنا
const SPREADSHEET_ID = 'YOUR_SPREADSHEET_ID_HERE'; // استبدل بمعرف جدولك (اختياري)

// الأوراق المطلوبة (سيتم إنشاؤها تلقائياً)
const REQUIRED_SHEETS = ['Users', 'Incidents', 'NearMiss', 'PTW', 'Training', 'ClinicVisits', 'Medications', 'SickLeave', 'Injuries', 'ClinicInventory', 'FireEquipment', 'PPE', 'Violations', 'Contractors', 'Employees', 'BehaviorMonitoring', 'ChemicalSafety', 'DailyObservations', 'ISODocuments', 'ISOProcedures', 'ISOForms', 'SOPJHA', 'RiskAssessments', 'LegalDocuments', 'HSEAudits', 'HSENonConformities', 'HSECorrectiveActions', 'HSEObjectives', 'HSERiskAssessments', 'EnvironmentalAspects', 'EnvironmentalMonitoring', 'Sustainability', 'CarbonFootprint', 'WasteManagement', 'EnergyEfficiency', 'WaterManagement', 'RecyclingPrograms'];

/**
 * إعداد CORS headers
 * ملاحظة: عند نشر Google Apps Script كـ Web App مع "Who has access: Anyone"
 * يجب إضافة CORS headers يدوياً للطلبات من مصادر خارجية
 */
function setCorsHeaders(output) {
    if (!output) {
        output = ContentService.createTextOutput('');
    }
    
    // Google Apps Script يدعم CORS تلقائياً عند نشر Web App بشكل صحيح
    // لا حاجة لإضافة headers يدوياً - فقط تأكد من النشر مع "Who has access: Anyone"
    try {
        return output.setMimeType(ContentService.MimeType.JSON);
    } catch (e) {
        return output;
    }
}

/**
 * ملاحظة مهمة عن CORS:
 * عند نشر Google Apps Script كـ Web App:
 * 1. يجب اختيار "Who has access: Anyone" (أو "Anyone with Google account")
 * 2. Google Apps Script سيدعم CORS تلقائياً
 * 3. لا حاجة لإضافة headers يدوياً
 * 
 * إذا استمرت مشكلة CORS:
 * - تأكد من نشر Web App وليس Script Editor
 * - تأكد من استخدام URL الذي ينتهي بـ /exec
 * - جرب حذف النشر القديم وإنشاء نشر جديد
 */

/**
 * معالجة طلبات POST
 */
function doPost(e) {
    try {
        // معالجة JSON من text/plain أو application/json
        let postData;
        
        if (!e || !e.postData || !e.postData.contents) {
            return ContentService.createTextOutput(JSON.stringify({
                success: false,
                message: 'No data received'
            })).setMimeType(ContentService.MimeType.JSON);
        }
        
        // Parse JSON data
        postData = JSON.parse(e.postData.contents);
        const action = postData.action;
        const payload = postData.data || postData;

        let result = { success: false, message: '' };

        switch (action) {
            case 'saveToSheet':
                // التأكد من تمرير spreadsheetId بشكل صحيح
                const spreadsheetId = payload.spreadsheetId || SPREADSHEET_ID;
                result = saveToSheet(payload.sheetName, payload.data, spreadsheetId);
                break;
            case 'appendToSheet':
                result = appendToSheet(payload.sheetName, payload.data, payload.spreadsheetId || SPREADSHEET_ID);
                break;
            case 'initializeSheets':
                result = initializeSheets(payload.spreadsheetId || SPREADSHEET_ID);
                break;
            case 'readFromSheet':
                result = { success: true, data: readFromSheet(payload.sheetName || payload, payload.spreadsheetId || SPREADSHEET_ID) };
                break;
            // Users
            case 'addUser':
                result = addUserToSheet(payload);
                break;
            // Incidents
            case 'addIncident':
                result = addIncidentToSheet(payload);
                break;
            // NearMiss
            case 'addNearMiss':
                result = addNearMissToSheet(payload);
                break;
            // PTW
            case 'addPTW':
                result = addPTWToSheet(payload);
                break;
            // Training
            case 'addTraining':
                result = addTrainingToSheet(payload);
                break;
            // Clinic
            case 'addClinicVisit':
                result = addClinicVisitToSheet(payload);
                break;
            case 'addMedication':
                result = addMedicationToSheet(payload);
                break;
            case 'addSickLeave':
                result = addSickLeaveToSheet(payload);
                break;
            case 'addInjury':
                result = addInjuryToSheet(payload);
                break;
            // Violations
            case 'addViolation':
                result = addViolationToSheet(payload);
                break;
            // Contractors
            case 'addContractor':
                result = addContractorToSheet(payload);
                break;
            // Employees
            case 'addEmployee':
                result = addEmployeeToSheet(payload);
                break;
            // Behavior Monitoring
            case 'addBehavior':
                result = addBehaviorToSheet(payload);
                break;
            // Chemical Safety
            case 'addChemicalSafety':
                result = addChemicalSafetyToSheet(payload);
                break;
            // Daily Observations
            case 'addObservation':
                result = addObservationToSheet(payload);
                break;
            // ISO Documents
            case 'addISODocument':
                result = addISODocumentToSheet(payload);
                break;
            case 'addISOProcedure':
                result = addISOProcedureToSheet(payload);
                break;
            case 'addISOForm':
                result = addISOFormToSheet(payload);
                break;
            case 'addSOPJHA':
                result = addSOPJHAToSheet(payload);
                break;
            // Risk Assessment
            case 'addRiskAssessment':
                result = addRiskAssessmentToSheet(payload);
                break;
            // Legal Documents
            case 'addLegalDocument':
                result = addLegalDocumentToSheet(payload);
                break;
            // HSE Modules
            case 'addHSEAudit':
                result = addHSEAuditToSheet(payload);
                break;
            case 'addHSENonConformity':
                result = addHSENonConformityToSheet(payload);
                break;
            case 'addHSECorrectiveAction':
                result = addHSECorrectiveActionToSheet(payload);
                break;
            case 'addHSEObjective':
                result = addHSEObjectiveToSheet(payload);
                break;
            case 'addHSERiskAssessment':
                result = addHSERiskAssessmentToSheet(payload);
                break;
            // Environmental Modules
            case 'addEnvironmentalAspect':
                result = addEnvironmentalAspectToSheet(payload);
                break;
            case 'addEnvironmentalMonitoring':
                result = addEnvironmentalMonitoringToSheet(payload);
                break;
            case 'addSustainability':
                result = addSustainabilityToSheet(payload);
                break;
            case 'addCarbonFootprint':
                result = addCarbonFootprintToSheet(payload);
                break;
            case 'addWasteManagement':
                result = addWasteManagementToSheet(payload);
                break;
            case 'addEnergyEfficiency':
                result = addEnergyEfficiencyToSheet(payload);
                break;
            case 'addWaterManagement':
                result = addWaterManagementToSheet(payload);
                break;
            case 'addRecyclingProgram':
                result = addRecyclingProgramToSheet(payload);
                break;
            // Equipment Modules
            case 'addFireEquipment':
                result = addFireEquipmentToSheet(payload);
                break;
            case 'addPPE':
                result = addPPEToSheet(payload);
                break;
            case 'addClinicInventory':
                result = addClinicInventoryToSheet(payload);
                break;
            default:
                result = { success: false, message: 'Action not recognized: ' + action };
        }

        const output = ContentService.createTextOutput(JSON.stringify(result));
        return setCorsHeaders(output);
    } catch (error) {
        const errorOutput = ContentService.createTextOutput(JSON.stringify({
            success: false,
            message: error.toString()
        }));
        return setCorsHeaders(errorOutput);
    }
}

/**
 * معالجة طلبات GET
 */
function doGet(e) {
    try {
        const action = e.parameter.action;
        const sheetName = e.parameter.sheetName;
        const spreadsheetId = e.parameter.spreadsheetId || SPREADSHEET_ID;

        if (action === 'getData' && sheetName) {
            const data = readFromSheet(sheetName, spreadsheetId);
            const output = ContentService.createTextOutput(JSON.stringify({
                success: true,
                data: data
            }));
            return setCorsHeaders(output);
        }

        const output = ContentService.createTextOutput(JSON.stringify({
            success: false,
            message: 'Invalid request'
        }));
        return setCorsHeaders(output);
    } catch (error) {
        const errorOutput = ContentService.createTextOutput(JSON.stringify({
            success: false,
            message: error.toString()
        }));
        return setCorsHeaders(errorOutput);
    }
}

/**
 * معالجة طلبات OPTIONS (لـ CORS Preflight)
 * هذا مهم جداً للتعامل مع CORS من Netlify
 */
function doOptions() {
    try {
        return ContentService.createTextOutput('')
            .setMimeType(ContentService.MimeType.JSON);
    } catch (e) {
        return ContentService.createTextOutput(JSON.stringify({
            success: false,
            message: e.toString()
        })).setMimeType(ContentService.MimeType.JSON);
    }
}

/**
 * إنشاء ورقة جديدة مع الرؤوس الافتراضية
 */
function createSheetWithHeaders(spreadsheet, sheetName) {
    try {
        let sheet = spreadsheet.getSheetByName(sheetName);
        
        if (!sheet) {
            sheet = spreadsheet.insertSheet(sheetName);
            
            // إضافة الرؤوس الافتراضية حسب نوع الورقة
            const headers = getDefaultHeaders(sheetName);
            if (headers.length > 0) {
                sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
                // تنسيق الرؤوس
                const headerRange = sheet.getRange(1, 1, 1, headers.length);
                headerRange.setFontWeight('bold');
                headerRange.setBackground('#f0f0f0');
                headerRange.setFontSize(11);
            }
        }
        
        return sheet;
    } catch (error) {
        Logger.log('Error creating sheet: ' + error.toString());
        throw error;
    }
}

/**
 * الحصول على الرؤوس الافتراضية لكل ورقة
 */
function getDefaultHeaders(sheetName) {
    const headersMap = {
        'Users': ['id', 'name', 'email', 'password', 'role', 'department', 'active', 'photo', 'permissions', 'lastLogin', 'lastLogout', 'isOnline', 'loginHistory', 'createdAt', 'updatedAt'],
        'Incidents': ['id', 'isoCode', 'title', 'description', 'location', 'date', 'severity', 'reportedBy', 'employeeCode', 'employeeNumber', 'status', 'createdAt', 'updatedAt'],
        'NearMiss': ['id', 'title', 'description', 'location', 'date', 'reportedBy', 'status', 'createdAt', 'updatedAt'],
        'PTW': ['id', 'workType', 'workDescription', 'location', 'department', 'startDate', 'endDate', 'responsible', 'status', 'approvals', 'requiredPPE', 'riskAssessment', 'riskNotes', 'createdAt', 'updatedAt'],
        'Training': ['id', 'name', 'trainer', 'startDate', 'participants', 'participantsCount', 'status', 'createdAt', 'updatedAt'],
        'ClinicVisits': ['id', 'personType', 'employeeCode', 'employeeNumber', 'employeeName', 'contractorName', 'externalName', 'visitDate', 'reason', 'diagnosis', 'treatment', 'createdAt', 'updatedAt'],
        'Medications': ['id', 'name', 'type', 'quantity', 'expiryDate', 'createdAt', 'updatedAt'],
        'SickLeave': ['id', 'personType', 'employeeCode', 'employeeNumber', 'employeeName', 'contractorName', 'externalName', 'startDate', 'endDate', 'reason', 'medicalNotes', 'status', 'createdAt', 'updatedAt'],
        'Injuries': ['id', 'personType', 'employeeCode', 'employeeNumber', 'employeeName', 'personName', 'injuryDate', 'injuryType', 'injuryLocation', 'injuryDescription', 'actionsTaken', 'treatment', 'createdAt', 'updatedAt'],
        'ClinicInventory': ['id', 'medicationName', 'quantity', 'expiryDate', 'location', 'createdAt', 'updatedAt'],
        'FireEquipment': ['id', 'equipmentNumber', 'equipmentType', 'location', 'checkDate', 'status', 'inspector', 'notes', 'createdAt', 'updatedAt'],
        'PPE': ['id', 'receiptNumber', 'employeeName', 'employeeCode', 'employeeNumber', 'equipmentType', 'quantity', 'receiptDate', 'status', 'createdAt', 'updatedAt'],
        'Violations': ['id', 'isoCode', 'personType', 'employeeId', 'employeeName', 'employeeCode', 'employeeNumber', 'contractorId', 'contractorName', 'violationType', 'violationDate', 'severity', 'actionTaken', 'status', 'photo', 'createdAt', 'updatedAt'],
        'Contractors': ['id', 'name', 'serviceType', 'contractNumber', 'startDate', 'endDate', 'status', 'contactPerson', 'phone', 'email', 'createdAt', 'updatedAt'],
        'Employees': ['id', 'name', 'employeeNumber', 'sapId', 'job', 'department', 'branch', 'location', 'gender', 'nationalId', 'birthDate', 'hireDate', 'position', 'email', 'phone', 'photo', 'createdAt', 'updatedAt'],
        'BehaviorMonitoring': ['id', 'isoCode', 'employeeId', 'employeeCode', 'employeeNumber', 'employeeName', 'behaviorType', 'date', 'rating', 'description', 'photo', 'createdAt', 'updatedAt'],
        'ChemicalSafety': ['id', 'isoCode', 'chemicalName', 'trainer', 'date', 'status', 'description', 'createdAt', 'updatedAt'],
        'DailyObservations': ['id', 'isoCode', 'supervisor', 'date', 'observationType', 'status', 'description', 'correctiveAction', 'images', 'createdAt', 'updatedAt'],
        'ISODocuments': ['id', 'isoCode', 'name', 'type', 'version', 'department', 'createdAt', 'updatedAt'],
        'ISOProcedures': ['id', 'isoCode', 'name', 'department', 'version', 'createdAt', 'updatedAt'],
        'ISOForms': ['id', 'isoCode', 'name', 'type', 'createdAt', 'updatedAt'],
        'SOPJHA': ['id', 'isoCode', 'type', 'title', 'department', 'issueDate', 'status', 'version', 'procedures', 'hazards', 'requiredPPE', 'createdAt', 'updatedAt'],
        'RiskAssessments': ['id', 'isoCode', 'activity', 'location', 'date', 'status', 'riskLevel', 'correctiveActions', 'createdAt', 'updatedAt'],
        'LegalDocuments': ['id', 'isoCode', 'documentName', 'documentType', 'documentNumber', 'issuedBy', 'issueDate', 'expiryDate', 'alertDays', 'status', 'description', 'documentLink', 'createdAt', 'updatedAt'],
        'HSEAudits': ['id', 'type', 'date', 'auditor', 'status', 'description', 'createdAt', 'updatedAt'],
        'HSENonConformities': ['id', 'date', 'description', 'status', 'createdAt', 'updatedAt'],
        'HSECorrectiveActions': ['id', 'description', 'responsible', 'dueDate', 'status', 'createdAt', 'updatedAt'],
        'HSEObjectives': ['id', 'name', 'description', 'dueDate', 'responsible', 'status', 'createdAt', 'updatedAt'],
        'HSERiskAssessments': ['id', 'activity', 'location', 'date', 'riskLevel', 'status', 'createdAt', 'updatedAt'],
        'EnvironmentalAspects': ['id', 'name', 'description', 'impact', 'createdAt', 'updatedAt'],
        'EnvironmentalMonitoring': ['id', 'aspect', 'date', 'value', 'unit', 'status', 'createdAt', 'updatedAt'],
        'Sustainability': ['id', 'name', 'description', 'startDate', 'status', 'createdAt', 'updatedAt'],
        'CarbonFootprint': ['id', 'date', 'source', 'co2Equivalent', 'description', 'createdAt', 'updatedAt'],
        'WasteManagement': ['id', 'date', 'wasteType', 'quantity', 'disposalMethod', 'createdAt', 'updatedAt'],
        'EnergyEfficiency': ['id', 'date', 'department', 'energyConsumption', 'efficiencyPercentage', 'notes', 'createdAt', 'updatedAt'],
        'WaterManagement': ['id', 'date', 'usageType', 'quantity', 'waterSource', 'createdAt', 'updatedAt'],
        'RecyclingPrograms': ['id', 'programName', 'materialType', 'recyclingRate', 'status', 'description', 'createdAt', 'updatedAt']
    };
    
    return headersMap[sheetName] || [];
}

/**
 * حفظ بيانات في ورقة معينة (استبدال كامل)
 */
function saveToSheet(sheetName, data, spreadsheetId = SPREADSHEET_ID) {
    try {
        // التحقق من صحة spreadsheetId
        if (!spreadsheetId || spreadsheetId === 'YOUR_SPREADSHEET_ID_HERE' || spreadsheetId.trim() === '') {
            return { success: false, message: 'معرف Google Sheets غير محدد. يرجى إدخال معرف الجدول في الإعدادات.' };
        }
        
        const spreadsheet = SpreadsheetApp.openById(spreadsheetId);
        
        // إنشاء الورقة مع الرؤوس إذا لم تكن موجودة
        const sheet = createSheetWithHeaders(spreadsheet, sheetName);
        
        // إذا كانت البيانات مصفوفة فارغة أو غير موجودة
        if (!data || (Array.isArray(data) && data.length === 0)) {
            // التأكد من وجود رؤوس على الأقل
            const headers = getDefaultHeaders(sheetName);
            let existingHeaders = [];
            try {
                const lastColumn = sheet.getLastColumn();
                if (lastColumn > 0) {
                    existingHeaders = sheet.getRange(1, 1, 1, lastColumn).getValues()[0];
                }
            } catch (e) {
                existingHeaders = [];
            }
            
            if (headers && headers.length > 0 && (existingHeaders.length === 0 || existingHeaders[0] === '' || JSON.stringify(existingHeaders) !== JSON.stringify(headers))) {
                sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
                // تنسيق الرؤوس
                const headerRange = sheet.getRange(1, 1, 1, headers.length);
                headerRange.setFontWeight('bold');
                headerRange.setBackground('#f0f0f0');
            }
            return { success: true, message: 'تم حفظ البيانات بنجاح (لا توجد بيانات للحفظ)' };
        }

        // مسح البيانات الموجودة (لكن نبقى على الرؤوس)
        const lastRow = sheet.getLastRow();
        if (lastRow > 1) {
            sheet.deleteRows(2, lastRow - 1);
        }

        // إذا كانت البيانات مصفوفة من الكائنات
        if (Array.isArray(data) && data.length > 0) {
            // استخدام الرؤوس الافتراضية من getDefaultHeaders أولاً (إذا كانت موجودة)
            let headers = getDefaultHeaders(sheetName);
            
            // إذا لم تكن هناك رؤوس افتراضية أو كانت فارغة، نستخدم المفاتيح من البيانات
            if (!headers || headers.length === 0) {
                headers = Object.keys(data[0]);
            }
            
            // التأكد من أن الرؤوس موجودة في الورقة
            let existingHeaders = [];
            try {
                const lastColumn = sheet.getLastColumn();
                if (lastColumn > 0) {
                    existingHeaders = sheet.getRange(1, 1, 1, lastColumn).getValues()[0];
                }
            } catch (e) {
                // إذا كانت الورقة فارغة تماماً
                existingHeaders = [];
            }
            
            // إذا كانت الرؤوس موجودة مختلفة، نحدّثها
            if (existingHeaders.length === 0 || existingHeaders[0] === '' || JSON.stringify(existingHeaders) !== JSON.stringify(headers)) {
                sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
                // تنسيق الرؤوس
                const headerRange = sheet.getRange(1, 1, 1, headers.length);
                headerRange.setFontWeight('bold');
                headerRange.setBackground('#f0f0f0');
            }
            
            // كتابة البيانات - نستخدم الرؤوس المحددة لضمان الترتيب الصحيح
            const values = data.map(item => headers.map(header => {
                const value = item[header];
                // معالجة القيم المعقدة (مصفوفات، كائنات)
                if (value === null || value === undefined) return '';
                if (Array.isArray(value)) return JSON.stringify(value);
                if (typeof value === 'object') return JSON.stringify(value);
                return String(value);
            }));
            
            if (values.length > 0) {
                sheet.getRange(2, 1, values.length, headers.length).setValues(values);
            }
        } else if (typeof data === 'object' && data !== null) {
            // إذا كانت البيانات كائن واحد
            let headers = getDefaultHeaders(sheetName);
            
            // إذا لم تكن هناك رؤوس افتراضية، نستخدم المفاتيح من البيانات
            if (!headers || headers.length === 0) {
                headers = Object.keys(data);
            }
            
            let existingHeaders = [];
            try {
                const lastColumn = sheet.getLastColumn();
                if (lastColumn > 0) {
                    existingHeaders = sheet.getRange(1, 1, 1, lastColumn).getValues()[0];
                }
            } catch (e) {
                existingHeaders = [];
            }
            
            // إذا كانت الرؤوس موجودة مختلفة، نحدّثها
            if (existingHeaders.length === 0 || existingHeaders[0] === '' || JSON.stringify(existingHeaders) !== JSON.stringify(headers)) {
                sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
                // تنسيق الرؤوس
                const headerRange = sheet.getRange(1, 1, 1, headers.length);
                headerRange.setFontWeight('bold');
                headerRange.setBackground('#f0f0f0');
            }
            
            const rowValues = headers.map(h => {
                const value = data[h];
                if (value === null || value === undefined) return '';
                if (Array.isArray(value)) return JSON.stringify(value);
                if (typeof value === 'object') return JSON.stringify(value);
                return String(value);
            });
            
            sheet.getRange(2, 1, 1, headers.length).setValues([rowValues]);
        }

        return { success: true, message: 'تم حفظ البيانات بنجاح' };
    } catch (error) {
        return { success: false, message: error.toString() };
    }
}

/**
 * إضافة بيانات جديدة إلى نهاية الورقة (بدون استبدال)
 */
function appendToSheet(sheetName, data, spreadsheetId = SPREADSHEET_ID) {
    try {
        const spreadsheet = SpreadsheetApp.openById(spreadsheetId);
        
        // إنشاء الورقة مع الرؤوس إذا لم تكن موجودة
        const sheet = createSheetWithHeaders(spreadsheet, sheetName);

        // الحصول على آخر صف
        const lastRow = sheet.getLastRow();
        const startRow = lastRow === 0 ? 2 : lastRow + 1;

        if (Array.isArray(data)) {
            // إذا كانت مصفوفة من الكائنات
            if (data.length > 0) {
                // استخدام الرؤوس الافتراضية من getDefaultHeaders أولاً (إذا كانت موجودة)
                let headers = getDefaultHeaders(sheetName);
                
                // إذا لم تكن هناك رؤوس افتراضية، نستخدم المفاتيح من البيانات
                if (!headers || headers.length === 0) {
                    headers = Object.keys(data[0]);
                }
                
                // التأكد من وجود الرؤوس
                let existingHeaders = [];
                try {
                    const lastColumn = sheet.getLastColumn();
                    if (lastColumn > 0) {
                        existingHeaders = sheet.getRange(1, 1, 1, lastColumn).getValues()[0];
                    }
                } catch (e) {
                    existingHeaders = [];
                }
                
                if (existingHeaders.length === 0 || existingHeaders[0] === '' || JSON.stringify(existingHeaders) !== JSON.stringify(headers)) {
                    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
                    // تنسيق الرؤوس
                    const headerRange = sheet.getRange(1, 1, 1, headers.length);
                    headerRange.setFontWeight('bold');
                    headerRange.setBackground('#f0f0f0');
                }
                
                // كتابة البيانات - نستخدم الرؤوس المحددة
                const values = data.map(item => headers.map(header => {
                    const value = item[header];
                    if (value === null || value === undefined) return '';
                    if (Array.isArray(value)) return JSON.stringify(value);
                    if (typeof value === 'object') return JSON.stringify(value);
                    return String(value);
                }));
                
                if (values.length > 0) {
                    sheet.getRange(startRow, 1, values.length, headers.length).setValues(values);
                }
            }
        } else if (typeof data === 'object' && data !== null) {
            // إذا كان كائن واحد
            let headers = getDefaultHeaders(sheetName);
            
            if (!headers || headers.length === 0) {
                headers = Object.keys(data);
            }
            
            // التأكد من وجود الرؤوس
            let existingHeaders = [];
            try {
                const lastColumn = sheet.getLastColumn();
                if (lastColumn > 0) {
                    existingHeaders = sheet.getRange(1, 1, 1, lastColumn).getValues()[0];
                }
            } catch (e) {
                existingHeaders = [];
            }
            
            if (existingHeaders.length === 0 || existingHeaders[0] === '' || JSON.stringify(existingHeaders) !== JSON.stringify(headers)) {
                sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
                // تنسيق الرؤوس
                const headerRange = sheet.getRange(1, 1, 1, headers.length);
                headerRange.setFontWeight('bold');
                headerRange.setBackground('#f0f0f0');
            }
            
            const rowValues = headers.map(h => {
                const value = data[h];
                if (value === null || value === undefined) return '';
                if (Array.isArray(value)) return JSON.stringify(value);
                if (typeof value === 'object') return JSON.stringify(value);
                return String(value);
            });
            
            sheet.getRange(startRow, 1, 1, headers.length).setValues([rowValues]);
        }

        return { success: true, message: 'تم إضافة البيانات بنجاح' };
    } catch (error) {
        return { success: false, message: error.toString() };
    }
}

/**
 * قراءة بيانات من ورقة
 */
function readFromSheet(sheetName, spreadsheetId = SPREADSHEET_ID) {
    try {
        const spreadsheet = SpreadsheetApp.openById(spreadsheetId);
        const sheet = spreadsheet.getSheetByName(sheetName);

        if (!sheet) {
            return [];
        }

        const data = sheet.getDataRange().getValues();
        if (data.length === 0 || data.length === 1) {
            return []; // لا توجد بيانات أو فقط رؤوس
        }

        const headers = data[0];
        const rows = data.slice(1);

        return rows.map(row => {
            const obj = {};
            headers.forEach((header, index) => {
                obj[header] = row[index] !== undefined && row[index] !== null ? row[index] : '';
            });
            return obj;
        });
    } catch (error) {
        Logger.log('Error reading from sheet: ' + error.toString());
        return [];
    }
}

/**
 * إضافة مستخدم جديد
 */
function addUserToSheet(userData) {
    const sheetName = 'Users';
    return appendToSheet(sheetName, userData);
}

/**
 * إنشاء جميع الأوراق المطلوبة تلقائياً
 * هذه الدالة ستنشئ جميع الأوراق مع الرؤوس الافتراضية
 */
function initializeSheets(spreadsheetId = SPREADSHEET_ID) {
    try {
        if (!spreadsheetId || spreadsheetId === 'YOUR_SPREADSHEET_ID_HERE') {
            return { success: false, message: 'معرف Google Sheets غير محدد' };
        }
        
        const spreadsheet = SpreadsheetApp.openById(spreadsheetId);
        let createdSheets = [];
        let existingSheets = [];
        
        REQUIRED_SHEETS.forEach(sheetName => {
            const sheet = spreadsheet.getSheetByName(sheetName);
            if (!sheet) {
                createSheetWithHeaders(spreadsheet, sheetName);
                createdSheets.push(sheetName);
            } else {
                // إذا كانت الورقة موجودة، نتأكد من وجود الرؤوس
                const existingHeaders = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
                if (existingHeaders.length === 0 || existingHeaders[0] === '') {
                    const headers = getDefaultHeaders(sheetName);
                    if (headers.length > 0) {
                        sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
                        const headerRange = sheet.getRange(1, 1, 1, headers.length);
                        headerRange.setFontWeight('bold');
                        headerRange.setBackground('#f0f0f0');
                        headerRange.setFontSize(11);
                    }
                    createdSheets.push(sheetName + ' (تم إضافة الرؤوس)');
                } else {
                    existingSheets.push(sheetName);
                }
            }
        });
        
        let message = 'تم إنشاء جميع الأوراق بنجاح';
        if (createdSheets.length > 0) {
            message += '\nالأوراق المنشأة: ' + createdSheets.join(', ');
        }
        if (existingSheets.length > 0) {
            message += '\nالأوراق الموجودة: ' + existingSheets.join(', ');
        }
        
        return { success: true, message: message, created: createdSheets, existing: existingSheets };
    } catch (error) {
        return { success: false, message: error.toString() };
    }
}

/**
 * إضافة حادث جديد
 */
function addIncidentToSheet(incidentData) {
    const sheetName = 'Incidents';
    return appendToSheet(sheetName, incidentData);
}

/**
 * إضافة حادث وشيك
 */
function addNearMissToSheet(nearMissData) {
    const sheetName = 'NearMiss';
    return appendToSheet(sheetName, nearMissData);
}

/**
 * إضافة تصريح عمل
 */
function addPTWToSheet(ptwData) {
    const sheetName = 'PTW';
    return appendToSheet(sheetName, ptwData);
}

/**
 * إضافة تدريب
 */
function addTrainingToSheet(trainingData) {
    const sheetName = 'Training';
    return appendToSheet(sheetName, trainingData);
}

/**
 * إضافة زيارة عيادة
 */
function addClinicVisitToSheet(visitData) {
    const sheetName = 'ClinicVisits';
    return appendToSheet(sheetName, visitData);
}

/**
 * إضافة دواء
 */
function addMedicationToSheet(medicationData) {
    const sheetName = 'Medications';
    return appendToSheet(sheetName, medicationData);
}

/**
 * إضافة إجازة مرضية
 */
function addSickLeaveToSheet(sickLeaveData) {
    const sheetName = 'SickLeave';
    return appendToSheet(sheetName, sickLeaveData);
}

/**
 * إضافة إصابة
 */
function addInjuryToSheet(injuryData) {
    const sheetName = 'Injuries';
    return appendToSheet(sheetName, injuryData);
}

/**
 * إضافة مخالفة
 */
function addViolationToSheet(violationData) {
    const sheetName = 'Violations';
    return appendToSheet(sheetName, violationData);
}

/**
 * إضافة مقاول
 */
function addContractorToSheet(contractorData) {
    const sheetName = 'Contractors';
    return appendToSheet(sheetName, contractorData);
}

/**
 * إضافة موظف
 */
function addEmployeeToSheet(employeeData) {
    const sheetName = 'Employees';
    return appendToSheet(sheetName, employeeData);
}

/**
 * إضافة سجل مراقبة سلوك
 */
function addBehaviorToSheet(behaviorData) {
    const sheetName = 'BehaviorMonitoring';
    return appendToSheet(sheetName, behaviorData);
}

/**
 * إضافة سجل سلامة كيميائية
 */
function addChemicalSafetyToSheet(chemicalData) {
    const sheetName = 'ChemicalSafety';
    return appendToSheet(sheetName, chemicalData);
}

/**
 * إضافة ملاحظة يومية
 */
function addObservationToSheet(observationData) {
    const sheetName = 'DailyObservations';
    return appendToSheet(sheetName, observationData);
}

/**
 * إضافة وثيقة ISO
 */
function addISODocumentToSheet(documentData) {
    const sheetName = 'ISODocuments';
    return appendToSheet(sheetName, documentData);
}

/**
 * إضافة إجراء ISO
 */
function addISOProcedureToSheet(procedureData) {
    const sheetName = 'ISOProcedures';
    return appendToSheet(sheetName, procedureData);
}

/**
 * إضافة نموذج ISO
 */
function addISOFormToSheet(formData) {
    const sheetName = 'ISOForms';
    return appendToSheet(sheetName, formData);
}

/**
 * إضافة SOP/JHA
 */
function addSOPJHAToSheet(sopData) {
    const sheetName = 'SOPJHA';
    return appendToSheet(sheetName, sopData);
}

/**
 * إضافة تقييم مخاطر
 */
function addRiskAssessmentToSheet(riskData) {
    const sheetName = 'RiskAssessments';
    return appendToSheet(sheetName, riskData);
}

/**
 * إضافة وثيقة قانونية
 */
function addLegalDocumentToSheet(documentData) {
    const sheetName = 'LegalDocuments';
    return appendToSheet(sheetName, documentData);
}

/**
 * إضافة تدقيق HSE
 */
function addHSEAuditToSheet(auditData) {
    const sheetName = 'HSEAudits';
    return appendToSheet(sheetName, auditData);
}

/**
 * إضافة عدم مطابقة HSE
 */
function addHSENonConformityToSheet(nonConformityData) {
    const sheetName = 'HSENonConformities';
    return appendToSheet(sheetName, nonConformityData);
}

/**
 * إضافة إجراء تصحيحي HSE
 */
function addHSECorrectiveActionToSheet(actionData) {
    const sheetName = 'HSECorrectiveActions';
    return appendToSheet(sheetName, actionData);
}

/**
 * إضافة هدف HSE
 */
function addHSEObjectiveToSheet(objectiveData) {
    const sheetName = 'HSEObjectives';
    return appendToSheet(sheetName, objectiveData);
}

/**
 * إضافة تقييم مخاطر HSE
 */
function addHSERiskAssessmentToSheet(riskData) {
    const sheetName = 'HSERiskAssessments';
    return appendToSheet(sheetName, riskData);
}

/**
 * إضافة جانب بيئي
 */
function addEnvironmentalAspectToSheet(aspectData) {
    const sheetName = 'EnvironmentalAspects';
    return appendToSheet(sheetName, aspectData);
}

/**
 * إضافة مراقبة بيئية
 */
function addEnvironmentalMonitoringToSheet(monitoringData) {
    const sheetName = 'EnvironmentalMonitoring';
    return appendToSheet(sheetName, monitoringData);
}

/**
 * إضافة برنامج استدامة
 */
function addSustainabilityToSheet(sustainabilityData) {
    const sheetName = 'Sustainability';
    return appendToSheet(sheetName, sustainabilityData);
}

/**
 * إضافة بصمة كربونية
 */
function addCarbonFootprintToSheet(footprintData) {
    const sheetName = 'CarbonFootprint';
    return appendToSheet(sheetName, footprintData);
}

/**
 * إضافة إدارة النفايات
 */
function addWasteManagementToSheet(wasteData) {
    const sheetName = 'WasteManagement';
    return appendToSheet(sheetName, wasteData);
}

/**
 * إضافة كفاءة الطاقة
 */
function addEnergyEfficiencyToSheet(energyData) {
    const sheetName = 'EnergyEfficiency';
    return appendToSheet(sheetName, energyData);
}

/**
 * إضافة إدارة المياه
 */
function addWaterManagementToSheet(waterData) {
    const sheetName = 'WaterManagement';
    return appendToSheet(sheetName, waterData);
}

/**
 * إضافة برنامج إعادة التدوير
 */
function addRecyclingProgramToSheet(programData) {
    const sheetName = 'RecyclingPrograms';
    return appendToSheet(sheetName, programData);
}

/**
 * إضافة معدات الحريق
 */
function addFireEquipmentToSheet(equipmentData) {
    const sheetName = 'FireEquipment';
    return appendToSheet(sheetName, equipmentData);
}

/**
 * إضافة معدات الحماية الشخصية (PPE)
 */
function addPPEToSheet(ppeData) {
    const sheetName = 'PPE';
    return appendToSheet(sheetName, ppeData);
}

/**
 * إضافة مخزون العيادة
 */
function addClinicInventoryToSheet(inventoryData) {
    const sheetName = 'ClinicInventory';
    return appendToSheet(sheetName, inventoryData);
}

