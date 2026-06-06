@echo off
title myh5_s2 www.syymw.com
cd my_s2
D:\MYh5\Java\bin\java.exe -server -Duser.timezone=Asia/Shanghai -Dsun.jnu.encoding=UTF-8 -Dcom.sun.management.jmxremote.ssl=false -jar server.jar
pause