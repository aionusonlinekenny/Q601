@echo off
title myh5_s3
cd "%~dp0my_s3"
"%~dp0Java\bin\java.exe" -server -Duser.timezone=Asia/Shanghai -Dsun.jnu.encoding=UTF-8 -Dcom.sun.management.jmxremote.ssl=false -jar server.jar
pause
