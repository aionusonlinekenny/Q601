@echo off
title myh5_s2
cd "%~dp0my_s2"
"%~dp0Java\bin\java.exe" -server -XX:-UseSplitVerifier -Duser.timezone=Asia/Shanghai -Dsun.jnu.encoding=UTF-8 -Dcom.sun.management.jmxremote.ssl=false -jar server.jar
pause
