@echo off
cd /d %~dp0

git add .
git commit -m "Changed dark styling for calendar"
git push origin main