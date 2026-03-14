const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'features', 'maintenance', 'components', 'Maintenance.js');
let content = fs.readFileSync(filePath, 'utf8');

const replacements = [
    { search: /<FaCheckCircle \/> إكمال/g, replace: `<FaCheckCircle /> {t('complete') || 'إكمال'}` },
    { search: /<FaPlay \/> بدء/g, replace: `<FaPlay /> {t('start') || 'بدء'}` },
    { search: /<th>الإجراءات<\/th>/g, replace: `<th>{t('actions') || 'الإجراءات'}</th>` },
    { search: /<span>آخر تنفيذ: (.*?)<\/span>/g, replace: `<span>{t('lastPerformed') || 'آخر تنفيذ'}: $1</span>` },
    { search: /<span>الاستحقاق: (.*?)<\/span>/g, replace: `<span>{t('dueDate') || 'الاستحقاق'}: $1</span>` },
    { search: /<h4>قائمة التحقق:<\/h4>/g, replace: `<h4>{t('checklist') || 'قائمة التحقق:'}</h4>` },
    { search: /<span className="no-data">لا توجد مهام مستحقة قريباً<\/span>/g, replace: `<span className="no-data">{t('noUpcomingTasks') || 'لا توجد مهام مستحقة قريباً'}</span>` },
    { search: /<FaIndustry \/> \{machine\?\.name \|\| 'غير محدد'\}/g, replace: `<FaIndustry /> {machine?.name || t('unspecified') || 'غير محدد'}` },
    { search: /<GiFactory \/> الآلات/g, replace: `<GiFactory /> {t('machines') || 'الآلات'}` },
    { search: /<h2><FaTools \/> إدارة أدوات الصيانة<\/h2>/g, replace: `<h2><FaTools /> {t('toolsManagement') || 'إدارة أدوات الصيانة'}</h2>` },
    { search: /<h2><GiFactory \/> إدارة الآلات<\/h2>/g, replace: `<h2><GiFactory /> {t('machinesManagement') || 'إدارة الآلات'}</h2>` },
    { search: /<h2><FaCalendarAlt \/> مهام الصيانة الأسبوعية<\/h2>/g, replace: `<h2><FaCalendarAlt /> {t('weeklyMaintenanceTasks') || 'مهام الصيانة الأسبوعية'}</h2>` },
    { search: /<h2><FaCalendarCheck \/> مهام الصيانة الشهرية<\/h2>/g, replace: `<h2><FaCalendarCheck /> {t('monthlyMaintenanceTasks') || 'مهام الصيانة الشهرية'}</h2>` },
    { search: /<h2><FaHistory \/> مهام الصيانة السنوية<\/h2>/g, replace: `<h2><FaHistory /> {t('yearlyMaintenanceTasks') || 'مهام الصيانة السنوية'}</h2>` },
    { search: /<FaTrash \/> حذف/g, replace: `<FaTrash /> {t('delete') || 'حذف'}` },
    { search: /<FaEdit \/> تعديل/g, replace: `<FaEdit /> {t('edit') || 'تعديل'}` },
    { search: /<p><strong>الموديل:<\/strong>/g, replace: `<p><strong>{t('model') || 'الموديل'}:</strong>` },
    { search: /<p><strong>الرقم التسلسلي:<\/strong>/g, replace: `<p><strong>{t('serialNumber') || 'الرقم التسلسلي'}:</strong>` },
    { search: /<p><strong>الشركة المصنعة:<\/strong>/g, replace: `<p><strong>{t('manufacturer') || 'الشركة المصنعة'}:</strong>` },
    { search: /<p><strong>تاريخ الشراء:<\/strong>/g, replace: `<p><strong>{t('purchaseDate') || 'تاريخ الشراء'}:</strong>` },
    { search: /<p><strong>آخر صيانة:<\/strong>/g, replace: `<p><strong>{t('lastMaintenanceDate') || 'آخر صيانة'}:</strong>` },
    { search: /<p><strong>الصيانة القادمة:<\/strong>/g, replace: `<p><strong>{t('nextMaintenanceDate') || 'الصيانة القادمة'}:</strong>` },
    { search: /<p><strong>الموقع:<\/strong>/g, replace: `<p><strong>{t('location') || 'الموقع'}:</strong>` },
    { search: /<h4>المواصفات الفنية:<\/h4>/g, replace: `<h4>{t('technicalSpecs') || 'المواصفات الفنية'}:</h4>` }
];

replacements.forEach(({ search, replace }) => {
    content = content.replace(search, replace);
});

fs.writeFileSync(filePath, content, 'utf8');
console.log('Replacements done successfully!');
