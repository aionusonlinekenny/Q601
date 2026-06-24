@echo off
title myh5_kuafu Cross-Server
cd my_kuafu
D:\MYh5\Java\bin\java.exe -server -Duser.timezone=Asia/Shanghai -Dsun.jnu.encoding=UTF-8 -Dcom.sun.management.jmxremote.ssl=false -jar server.jar
pause
