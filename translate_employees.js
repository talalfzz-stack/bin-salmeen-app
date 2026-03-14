const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'features', 'employees', 'components', 'Employees.js');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Add import
if (!content.includes('useLanguage')) {
    content = content.replace(
        /import '\.\/Employees\.css';/,
        `import { useLanguage } from '../../../context/LanguageContext';\nimport './Employees.css';`
    );
}

// 2. Add hook
if (!content.includes('const { t } = useLanguage();')) {
    content = content.replace(
        /export default function Employees\(\{ user \}\) \{/,
        `export default function Employees({ user }) {\n  const { t } = useLanguage();`
    );
}

// 3. Replacements
const replacements = [
    // Alerts
    { search: /alert\(`✅ تم تسجيل حضور \$\{employees\.find\(e => e\.id === empId\)\.name\}`\);/g, replace: `alert(t('attendanceRecorded', { name: employees.find(e => e.id === empId).name }) || \`✅ تم تسجيل حضور \${employees.find(e => e.id === empId).name}\`);` },
    { search: /alert\(`✅ تم تسجيل انصراف \$\{employees\.find\(e => e\.id === empId\)\.name\}`\);/g, replace: `alert(t('departureRecorded', { name: employees.find(e => e.id === empId).name }) || \`✅ تم تسجيل انصراف \${employees.find(e => e.id === empId).name}\`);` },
    { search: /alert\(`✅ تم إضافة الموظف \$\{newEmployee\.name\} بنجاح`\);/g, replace: `alert(t('employeeAddedSuccess', { name: newEmployee.name }) || \`✅ تم إضافة الموظف \${newEmployee.name} بنجاح\`);` },
    { search: /alert\(`✅ تم إضافة إنذار للموظف \$\{getEmployeeName\(parseInt\(formData\.get\('employeeId'\)\)\)\}`\);/g, replace: `alert(t('warningAddedSuccess', { name: getEmployeeName(parseInt(formData.get('employeeId'))) }) || \`✅ تم إضافة إنذار للموظف \${getEmployeeName(parseInt(formData.get('employeeId')))}\`);` },
    { search: /alert\('لا توجد بيانات للتصدير'\);/g, replace: `alert(t('noDataToExport') || 'لا توجد بيانات للتصدير');` },
    { search: /alert\(`✅ تم تصدير \$\{dataToExport\.length\} سجل بنجاح`\);/g, replace: `alert(t('exportSuccess', { count: dataToExport.length }) || \`✅ تم تصدير \${dataToExport.length} سجل بنجاح\`);` },
    { search: /filename = 'الموظفين';/g, replace: `filename = t('employees') || 'الموظفين';` },
    { search: /filename = 'الحضور_والانصراف';/g, replace: `filename = t('attendanceLog') || 'الحضور_والانصراف';` },
    { search: /filename = 'الانذارات';/g, replace: `filename = t('warnings') || 'الانذارات';` },

    // Header Texts
    { search: /<h1>إدارة الموظفين والحضور<\/h1>/g, replace: `<h1>{t('employeesAndAttendanceManagement') || 'إدارة الموظفين والحضور'}</h1>` },
    { search: /<p>نظام متكامل لمتابعة حضور وإنصراف الموظفين<\/p>/g, replace: `<p>{t('employeesManagementDesc') || 'نظام متكامل لمتابعة حضور وإنصراف الموظفين'}</p>` },
    { search: /<span>إضافة موظف<\/span>/g, replace: `<span>{t('addEmployee') || 'إضافة موظف'}</span>` },
    { search: /<span>تصدير<\/span>/g, replace: `<span>{t('export') || 'تصدير'}</span>` },

    // Stats
    { search: /<span className="stat-label">إجمالي الموظفين<\/span>/g, replace: `<span className="stat-label">{t('totalEmployeesCount') || 'إجمالي الموظفين'}</span>` },
    { search: /<span className="stat-label">حاضر اليوم<\/span>/g, replace: `<span className="stat-label">{t('presentToday') || 'حاضر اليوم'}</span>` },
    { search: /<span className="stat-label">متأخر اليوم<\/span>/g, replace: `<span className="stat-label">{t('lateToday') || 'متأخر اليوم'}</span>` },
    { search: /<span className="stat-label">غائب اليوم<\/span>/g, replace: `<span className="stat-label">{t('absentToday') || 'غائب اليوم'}</span>` },
    { search: /<span className="stat-label">إنذارات نشطة<\/span>/g, replace: `<span className="stat-label">{t('activeWarnings') || 'إنذارات نشطة'}</span>` },
    { search: /<div className="stat-trend">\+12% هذا الشهر<\/div>/g, replace: `<div className="stat-trend">+12% {t('thisMonth') || 'هذا الشهر'}</div>` },

    // Search & Tabs
    { search: /placeholder="بحث عن موظف\.\.\."/g, replace: `placeholder={t('searchEmployee') || 'بحث عن موظف...'}` },
    { search: /<span>الحضور<\/span>/g, replace: `<span>{t('attendance') || 'الحضور'}</span>` },
    { search: /<span>الموظفين<\/span>/g, replace: `<span>{t('employees') || 'الموظفين'}</span>` },
    { search: /<span>الإنذارات<\/span>/g, replace: `<span>{t('warnings') || 'الإنذارات'}</span>` },

    // Table Headers
    { search: /<th>الموظف<\/th>/g, replace: `<th>{t('employee') || 'الموظف'}</th>` },
    { search: /<th>القسم<\/th>/g, replace: `<th>{t('department') || 'القسم'}</th>` },
    { search: /<th>الوردية<\/th>/g, replace: `<th>{t('shift') || 'الوردية'}</th>` },
    { search: /<th>تسجيل الدخول<\/th>/g, replace: `<th>{t('checkInTime') || 'تسجيل الدخول'}</th>` },
    { search: /<th>تسجيل الخروج<\/th>/g, replace: `<th>{t('checkOutTime') || 'تسجيل الخروج'}</th>` },
    { search: /<th>الحالة<\/th>/g, replace: `<th>{t('status') || 'الحالة'}</th>` },
    { search: /<th>الإجراءات<\/th>/g, replace: `<th>{t('actions') || 'الإجراءات'}</th>` },
    { search: /<th>الوظيفة<\/th>/g, replace: `<th>{t('jobTitle') || 'الوظيفة'}</th>` },
    { search: /<th>الجوال<\/th>/g, replace: `<th>{t('mobile') || 'الجوال'}</th>` },
    { search: /<th>النوع<\/th>/g, replace: `<th>{t('type') || 'النوع'}</th>` },
    { search: /<th>التاريخ<\/th>/g, replace: `<th>{t('date') || 'التاريخ'}</th>` },
    { search: /<th>السبب<\/th>/g, replace: `<th>{t('reason') || 'السبب'}</th>` },

    // Status Badges in Tables
    { search: /\{todayAttendance\?\.status === 'present' \? '✅ حاضر' :/g, replace: `{todayAttendance?.status === 'present' ? '✅ ' + (t('presentStatus') || 'حاضر') :` },
    { search: /todayAttendance\?\.status === 'late' \? '⚠️ متأخر' : '❌ غائب'\}/g, replace: `todayAttendance?.status === 'late' ? '⚠️ ' + (t('lateStatus') || 'متأخر') : '❌ ' + (t('absentStatus') || 'غائب')}` },
    { search: /\{emp\.status === 'active' \? 'نشط' : 'غير نشط'\}/g, replace: `{emp.status === 'active' ? (t('active') || 'نشط') : (t('inactive') || 'غير نشط')}` },
    { search: /<span className="warning-status-badge">نشط<\/span>/g, replace: `<span className="warning-status-badge">{t('active') || 'نشط'}</span>` },

    // Warning types
    { search: /\{warning\.type === 'late' \? '⏰ تأخير' : '❌ غياب'\}/g, replace: `{warning.type === 'late' ? '⏰ ' + (t('lateStatus') || 'تأخير') : '❌ ' + (t('absentStatus') || 'غياب')}` },

    // Action Button Titles
    { search: /title="تسجيل حضور"/g, replace: `title={t('checkIn') || 'تسجيل حضور'}` },
    { search: /title="تسجيل انصراف"/g, replace: `title={t('checkOut') || 'تسجيل انصراف'}` },
    { search: /title="إنذار"/g, replace: `title={t('issueWarning') || 'إنذار'}` },
    { search: /title="تعديل"/g, replace: `title={t('edit') || 'تعديل'}` },

    // Modals Add Employee
    { search: /<h3>إضافة موظف جديد<\/h3>/g, replace: `<h3>{t('addNewEmployee') || 'إضافة موظف جديد'}</h3>` },
    { search: /<p>أدخل بيانات الموظف كاملة<\/p>/g, replace: `<p>{t('enterFullEmployeeData') || 'أدخل بيانات الموظف كاملة'}</p>` },
    { search: /<h4>المعلومات الشخصية<\/h4>/g, replace: `<h4>{t('personalInformation') || 'المعلومات الشخصية'}</h4>` },
    { search: /<span>الاسم الكامل<\/span>/g, replace: `<span>{t('fullName') || 'الاسم الكامل'}</span>` },
    { search: /placeholder="أدخل اسم الموظف الرباعي"/g, replace: `placeholder={t('enterFullName') || 'أدخل اسم الموظف الرباعي'}` },
    { search: /<span>الجنس<\/span>/g, replace: `<span>{t('gender') || 'الجنس'}</span>` },
    { search: /-- اختر --/g, replace: `{t('select') || '-- اختر --'}` },
    { search: /<option value="male">ذكر<\/option>/g, replace: `<option value="male">{t('male') || 'ذكر'}</option>` },
    { search: /<option value="female">أنثى<\/option>/g, replace: `<option value="female">{t('female') || 'أنثى'}</option>` },
    { search: /<h4>معلومات الاتصال<\/h4>/g, replace: `<h4>{t('contactInformation') || 'معلومات الاتصال'}</h4>` },
    { search: /<span>رقم الجوال<\/span>/g, replace: `<span>{t('mobileNumber') || 'رقم الجوال'}</span>` },
    { search: /<span>البريد الإلكتروني<\/span>/g, replace: `<span>{t('email') || 'البريد الإلكتروني'}</span>` },
    { search: /<h4>المعلومات الوظيفية<\/h4>/g, replace: `<h4>{t('jobInformation') || 'المعلومات الوظيفية'}</h4>` },
    { search: /-- اختر القسم --/g, replace: `{t('selectDepartment') || '-- اختر القسم --'}` },
    { search: /<option value="الإنتاج">🏭 الإنتاج<\/option>/g, replace: `<option value="الإنتاج">🏭 {t('production') || 'الإنتاج'}</option>` },
    { search: /<option value="الجودة">✅ الجودة<\/option>/g, replace: `<option value="الجودة">✅ {t('quality') || 'الجودة'}</option>` },
    { search: /<option value="الصيانة">🔧 الصيانة<\/option>/g, replace: `<option value="الصيانة">🔧 {t('maintenance') || 'الصيانة'}</option>` },
    { search: /<option value="المالية">💰 المالية<\/option>/g, replace: `<option value="المالية">💰 {t('finance') || 'المالية'}</option>` },
    { search: /<option value="المشتريات">🛒 المشتريات<\/option>/g, replace: `<option value="المشتريات">🛒 {t('purchases') || 'المشتريات'}</option>` },
    { search: /<span>المسمى الوظيفي<\/span>/g, replace: `<span>{t('jobTitle') || 'المسمى الوظيفي'}</span>` },
    { search: /placeholder="مثال: مشغل ماكينة"/g, replace: `placeholder={t('exMachineOperator') || 'مثال: مشغل ماكينة'}` },
    { search: /<option value="صباحي">🌅 صباحي<\/option>/g, replace: `<option value="صباحي">🌅 {t('morningShift') || 'صباحي'}</option>` },
    { search: /<option value="مسائي">🌙 مسائي<\/option>/g, replace: `<option value="مسائي">🌙 {t('eveningShift') || 'مسائي'}</option>` },
    { search: /<span>الراتب<\/span>/g, replace: `<span>{t('salary') || 'الراتب'}</span>` },
    { search: /<span>تاريخ التعيين<\/span>/g, replace: `<span>{t('hireDate') || 'تاريخ التعيين'}</span>` },
    { search: /<option value="active">🟢 نشط<\/option>/g, replace: `<option value="active">🟢 {t('active') || 'نشط'}</option>` },
    { search: /<option value="inactive">🔴 غير نشط<\/option>/g, replace: `<option value="inactive">🔴 {t('inactive') || 'غير نشط'}</option>` },

    // Footer Save/Cancel
    { search: /إلغاء\n/g, replace: `{t('cancel') || 'إلغاء'}\n` },
    { search: /حفظ بيانات الموظف\n/g, replace: `{t('saveEmployeeData') || 'حفظ بيانات الموظف'}\n` },

    // Warnings Modal
    { search: /<h4>⚠️ إضافة إنذار<\/h4>/g, replace: `<h4>⚠️ {t('addWarning') || 'إضافة إنذار'}</h4>` },
    { search: /<label>الموظف<\/label>/g, replace: `<label>{t('employee') || 'الموظف'}</label>` },
    { search: /<option value="">اختر الموظف<\/option>/g, replace: `<option value="">{t('selectEmployee') || 'اختر الموظف'}</option>` },
    { search: /<label>نوع الإنذار<\/label>/g, replace: `<label>{t('warningType') || 'نوع الإنذار'}</label>` },
    { search: /<option value="late">⏰ تأخير<\/option>/g, replace: `<option value="late">⏰ {t('lateStatus') || 'تأخير'}</option>` },
    { search: /<option value="absence">❌ غياب<\/option>/g, replace: `<option value="absence">❌ {t('absentStatus') || 'غياب'}</option>` },
    { search: /<label>السبب<\/label>/g, replace: `<label>{t('reason') || 'السبب'}</label>` },
    { search: /placeholder="اكتب سبب الإنذار\.\.\."/g, replace: `placeholder={t('writeWarningReason') || 'اكتب سبب الإنذار...'}` },
    { search: /<label>الإجراء<\/label>/g, replace: `<label>{t('action') || 'الإجراء'}</label>` },
    { search: /<option value="تنبيه شفهي">تنبيه شفهي<\/option>/g, replace: `<option value="تنبيه شفهي">{t('verbalWarning') || 'تنبيه شفهي'}</option>` },
    { search: /<option value="إنذار كتابي">إنذار كتابي<\/option>/g, replace: `<option value="إنذار كتابي">{t('writtenWarning') || 'إنذار كتابي'}</option>` },
    { search: /<option value="إنذار نهائي">إنذار نهائي<\/option>/g, replace: `<option value="إنذار نهائي">{t('finalWarning') || 'إنذار نهائي'}</option>` },
    { search: /⚠️ حفظ الإنذار/g, replace: `⚠️ {t('saveWarning') || 'حفظ الإنذار'}` },
    { search: /❌ إلغاء/g, replace: `❌ {t('cancel') || 'إلغاء'}` }
];

replacements.forEach(rep => {
    content = content.replace(rep.search, rep.replace);
});

fs.writeFileSync(filePath, content, 'utf8');
console.log('Employees.js successfully updated.');
