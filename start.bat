@echo off
title Bin Salmeen System Starter

echo ===============================
echo ✅ تشغيل السيرفر Backend...
echo ===============================
cd backend
start /B node server.js

timeout /t 2 > nul

echo ===============================
echo ✅ تشغيل الواجهة Frontend...
echo ===============================
cd ..\frontend
start /B npm start

timeout /t 5 > nul

echo ===============================
echo ✅ فتح المتصفح تلقائيًا...
echo ===============================
start http://localhost:3000

echo ===============================
echo ✅ النظام يعمل بالكامل الآن!
echo لا تغلق هذه النافذة
echo ===============================

pause
