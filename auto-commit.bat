@echo off
cd /d %~dp0

git add .
git commit -m "Changed dark styling in calendar view"
git push origin main