@echo off
title myh5_s1
cd "%~dp0my_s1"
"%~dp0Java\bin\java.exe" -server -XX:-UseSplitVerifier -Duser.timezone=Asia/Shanghai -Dsun.jnu.encoding=UTF-8 -Dcom.sun.management.jmxremote.ssl=false -jar server.jar
pause
