# Hướng Dẫn Cài Đặt Server Game Tân Ma Vực H5 (MYH5) bằng XAMPP

> **Game:** Tân Ma Vực - H5 Mobile Game - Phiên bản Tây Phương Thần Kỳ  
> **Hệ điều hành:** Windows (khuyến nghị Windows Server 2012 / Windows 10)  
> **Web server:** XAMPP thay cho phpStudy gốc

---

## Mục Lục

1. [Yêu Cầu Hệ Thống](#1-yêu-cầu-hệ-thống)
2. [Cấu Trúc Thư Mục](#2-cấu-trúc-thư-mục)
3. [Cài Đặt XAMPP](#3-cài-đặt-xampp)
4. [Cấu Hình Apache và Thư Mục Web](#4-cấu-hình-apache-và-thư-mục-web)
5. [Cài Đặt và Cấu Hình MySQL](#5-cài-đặt-và-cấu-hình-mysql)
6. [Import Database](#6-import-database)
7. [Cập Nhật IP Trong File Cấu Hình](#7-cập-nhật-ip-trong-file-cấu-hình)
8. [Cập Nhật IP Trong Database](#8-cập-nhật-ip-trong-database)
9. [Cập Nhật Cổng Trong Cấu Hình Java Server](#9-cập-nhật-cổng-trong-cấu-hình-java-server)
10. [Khởi Động Server Game (Java)](#10-khởi-động-server-game-java)
11. [Khởi Động và Kiểm Tra](#11-khởi-động-và-kiểm-tra)
12. [Thông Tin Cổng Mạng](#12-thông-tin-cổng-mạng)
13. [Trang Quản Trị GM](#13-trang-quản-trị-gm)
14. [Xử Lý Lỗi Thường Gặp](#14-xử-lý-lỗi-thường-gặp)

---

## 1. Yêu Cầu Hệ Thống

| Thành phần | Yêu cầu |
|---|---|
| Hệ điều hành | Windows 7 / 10 / Server 2012 trở lên (64-bit) |
| RAM | Tối thiểu 4GB, khuyến nghị 8GB+ |
| XAMPP | Phiên bản có PHP **5.6.x** (bắt buộc dùng PHP 5.6) |
| Java | JRE đã có sẵn trong thư mục `MYH5\Java\` |
| MySQL | 5.5+ (có trong XAMPP) |
| Cổng mở | **80**, 3306, 8025, 8026, 8027, 8081, 8082, 8083 |

> **QUAN TRỌNG:** Game sử dụng hàm `mysql_connect` của PHP đã bị loại bỏ từ PHP 7.0 trở đi. Bắt buộc phải dùng **XAMPP với PHP 5.6**. Tải XAMPP phiên bản cũ tại: `https://sourceforge.net/projects/xampp/files/XAMPP%20Windows/5.6.40/`

---

## 2. Cấu Trúc Thư Mục

Sau khi giải nén, toàn bộ source code phải đặt tại `D:\MYH5\` theo cấu trúc sau:

```
D:\MYH5\
├── Java\                   ← Java Runtime có sẵn (dùng để chạy server game)
├── my_s1\                  ← Server game Khu 1
│   ├── data\               ← File cấu hình kết nối DB, cổng TCP
│   │   ├── gameserver.properties  ← ⚠️ Cần sửa cổng web tại đây
│   │   └── morningGlory_data.xml  ← Cấu hình kết nối MySQL
│   ├── conf\               ← File cấu hình game (JSON)
│   └── server.jar          ← File chạy server
├── my_s2\                  ← Server game Khu 2
├── my_s3\                  ← Server game Khu 3
├── my_web\                 ← Code PHP của website game
│   ├── api\
│   │   └── config.php      ← ⚠️ Cần sửa IP tại đây
│   ├── platform\
│   │   ├── config.php      ← Cấu hình kết nối DB platform
│   │   └── getServerPage.php ← ⚠️ Cần sửa IP tại đây
│   ├── gm\                 ← Trang quản trị GM
│   └── index.php           ← Trang chủ game
├── 环境\
│   └── sql\                ← File SQL để import database
│       ├── myh5_pl.sql     ← Database platform (đăng nhập)
│       ├── myh5_s1.sql     ← Database server khu 1
│       └── myh5_log.sql    ← Database log
├── 【2】启动一区.bat        ← Khởi động Khu 1
├── 【3】启动二区.bat        ← Khởi động Khu 2
└── 【4】启动三区.bat        ← Khởi động Khu 3
```

---

## 3. Cài Đặt XAMPP

1. Tải **XAMPP 5.6.40** (phiên bản PHP 5.6) từ SourceForge
2. Cài đặt XAMPP vào đường dẫn mặc định: `C:\xampp\`
3. Trong quá trình cài đặt, chọn cài đặt **Apache** và **MySQL** (không cần FileZilla, Mercury...)
4. Sau khi cài xong, **chưa khởi động** Apache - cần cấu hình thư mục web trước

> **Lợi ích khi dùng cổng 80:** XAMPP mặc định đã chạy Apache trên cổng 80, **không cần sửa cổng**. URL game sẽ là `http://IP/` gọn hơn so với `http://IP:81/`.

---

## 4. Cấu Hình Apache và Thư Mục Web

Cần trỏ Apache đến thư mục `D:\MYH5\my_web\` thay vì htdocs mặc định.

### Bước 4.1 - Sửa DocumentRoot trong `httpd.conf`

Mở file: `C:\xampp\apache\conf\httpd.conf`

Tìm 2 dòng sau:
```
DocumentRoot "C:/xampp/htdocs"
<Directory "C:/xampp/htdocs">
```

Sửa thành:
```
DocumentRoot "D:/MYH5/my_web"
<Directory "D:/MYH5/my_web">
```

### Bước 4.2 - Cấp quyền truy cập thư mục

Trong cùng file `httpd.conf`, bên trong khối `<Directory "D:/MYH5/my_web">`, đảm bảo có:
```apache
Options Indexes FollowSymLinks Includes ExecCGI
AllowOverride All
Require all granted
```

### Bước 4.3 - Kiểm tra cổng (không cần sửa)

Cổng 80 là mặc định của XAMPP. Chỉ cần đảm bảo không có phần mềm nào khác chiếm cổng 80 (IIS, Skype...).  
Kiểm tra bằng cmd: `netstat -ano | findstr :80`

> **Lưu ý:** Nếu thư mục `D:\MYH5\` chưa tồn tại, hãy đặt source code vào đúng đường dẫn trước khi cấu hình.

---

## 5. Cài Đặt và Cấu Hình MySQL

### Bước 5.1 - Đổi mật khẩu root MySQL về `123456`

Game sử dụng mật khẩu mặc định `123456` cho tài khoản `root`. XAMPP mặc định MySQL không có mật khẩu, cần đặt lại.

1. Mở **XAMPP Control Panel**, khởi động **MySQL**
2. Mở **phpMyAdmin**: `http://localhost/phpmyadmin`
3. Vào tab **SQL** và chạy lệnh:
```sql
SET PASSWORD FOR 'root'@'localhost' = PASSWORD('123456');
FLUSH PRIVILEGES;
```

### Bước 5.2 - Cấu hình phpMyAdmin sau khi đặt mật khẩu

Mở file: `C:\xampp\phpMyAdmin\config.inc.php`

Tìm dòng:
```php
$cfg['Servers'][$i]['password'] = '';
```
Sửa thành:
```php
$cfg['Servers'][$i]['password'] = '123456';
```

---

## 6. Import Database

Game cần **5 database** (schema) trong MySQL:

| Tên Database | File SQL | Mô tả |
|---|---|---|
| `myh5_pl` | `环境\sql\myh5_pl.sql` | Database platform, đăng nhập, danh sách server |
| `myh5_s1` | `环境\sql\myh5_s1.sql` | Database Khu 1 |
| `myh5_s2` | `环境\sql\myh5_s1.sql` | Database Khu 2 (import lại cùng file myh5_s1) |
| `myh5_s3` | `环境\sql\myh5_s1.sql` | Database Khu 3 (import lại cùng file myh5_s1) |
| `myh5_log` | `环境\sql\myh5_log.sql` | Database log |

### Cách import qua phpMyAdmin:

1. Mở `http://localhost/phpmyadmin`
2. **Tạo 5 database mới:**
   - Nhấn **New** ở sidebar trái
   - Nhập tên database (vd: `myh5_pl`), chọn Collation: `utf8_general_ci`
   - Nhấn **Create**
   - Lặp lại cho `myh5_s1`, `myh5_s2`, `myh5_s3`, `myh5_log`

3. **Import SQL vào từng database:**
   - Chọn database `myh5_pl` ở sidebar trái → tab **Import** → chọn file → **Go**
   - `myh5_s1` → import `myh5_s1.sql`
   - `myh5_s2` → import `myh5_s1.sql` (dùng cùng file, import lại)
   - `myh5_s3` → import `myh5_s1.sql` (dùng cùng file, import lại)
   - `myh5_log` → import `myh5_log.sql`

### Cách import qua dòng lệnh (nhanh hơn):

Mở **Command Prompt** (cmd) và chạy từng lệnh:
```bat
"C:\xampp\mysql\bin\mysql.exe" -u root -p123456 myh5_pl < "D:\MYH5\环境\sql\myh5_pl.sql"
"C:\xampp\mysql\bin\mysql.exe" -u root -p123456 myh5_s1 < "D:\MYH5\环境\sql\myh5_s1.sql"
"C:\xampp\mysql\bin\mysql.exe" -u root -p123456 myh5_s2 < "D:\MYH5\环境\sql\myh5_s1.sql"
"C:\xampp\mysql\bin\mysql.exe" -u root -p123456 myh5_s3 < "D:\MYH5\环境\sql\myh5_s1.sql"
"C:\xampp\mysql\bin\mysql.exe" -u root -p123456 myh5_log < "D:\MYH5\环境\sql\myh5_log.sql"
```

---

## 7. Cập Nhật IP Trong File Cấu Hình

Thay toàn bộ IP gốc bằng **IP thực của máy chủ** của bạn.

> **Tìm IP máy chủ:** Mở cmd gõ `ipconfig`, lấy địa chỉ `IPv4 Address` (ví dụ: `192.168.1.100`)

### File 1: `D:\MYH5\my_web\api\config.php`

Mở file, tìm dòng:
```php
$clientip = 'http://106.12.121.18:81/myh5_cilent/';
```
Sửa thành (cổng 80 không cần ghi vào URL):
```php
$clientip = 'http://192.168.1.100/myh5_cilent/';
```

### File 2: `D:\MYH5\my_web\platform\getServerPage.php`

Mở file, thay toàn bộ `106.12.121.18` bằng IP của bạn trong 3 dòng JSON:
```json
"ip": "106.12.121.18",
```
Sửa thành:
```json
"ip": "192.168.1.100",
```
(Có 3 chỗ tương ứng với 3 khu server - sửa hết cả 3)

---

## 8. Cập Nhật IP Trong Database

Sau khi import xong database, cần cập nhật IP trong bảng `cfg_server` của database `myh5_pl`.

### Cách 1 - Dùng phpMyAdmin:

1. Mở phpMyAdmin, chọn database `myh5_pl`
2. Chọn bảng `cfg_server` → tab **SQL**
3. Chạy lệnh (thay `192.168.1.100` bằng IP của bạn):
```sql
UPDATE cfg_server SET ip = '192.168.1.100' WHERE id IN (1, 2, 3);
```

### Cách 2 - Dùng dòng lệnh:

```bat
"C:\xampp\mysql\bin\mysql.exe" -u root -p123456 myh5_pl -e "UPDATE cfg_server SET ip='192.168.1.100';"
```

### Kiểm tra lại:
```sql
SELECT id, name, port, http_port, ip FROM cfg_server;
```
Kết quả đúng:
| id | name | port | http_port | ip |
|---|---|---|---|---|
| 1 | Khu 1 | 8025 | 8081 | 192.168.1.100 |
| 2 | Khu 2 | 8026 | 8082 | 192.168.1.100 |
| 3 | Khu 3 | 8027 | 8083 | 192.168.1.100 |

---

## 9. Cập Nhật Cổng Trong Cấu Hình Java Server

Source gốc cấu hình Java server gọi về web qua cổng 81. Vì bạn dùng cổng 80, cần sửa 3 file `gameserver.properties`.

### File `D:\MYH5\my_s1\data\gameserver.properties`

Tìm dòng:
```
newbee.morningGlory.http.HttpService.HttpWebUrl = http://127.0.0.1:81/platform/services.php
```
Sửa thành:
```
newbee.morningGlory.http.HttpService.HttpWebUrl = http://127.0.0.1/platform/services.php
```

### File `D:\MYH5\my_s2\data\gameserver.properties` - sửa tương tự

### File `D:\MYH5\my_s3\data\gameserver.properties` - sửa tương tự

> Cổng 80 là cổng HTTP mặc định, không cần ghi vào URL (trình duyệt và HTTP client tự hiểu).

---

## 10. Khởi Động Server Game (Java)

Server game sử dụng Java có sẵn trong thư mục `D:\MYH5\Java\`.

### Cấu hình kết nối database (kiểm tra lại trước khi chạy):

Mỗi khu server có file cấu hình riêng. Kiểm tra các file sau (thường không cần sửa nếu dùng mật khẩu `123456`):

**Khu 1:** `D:\MYH5\my_s1\data\morningGlory_data.xml`
```xml
<driver-url>jdbc:mysql://127.0.0.1:3306/myh5_s1?...</driver-url>
<property name="user" value="root" />
<property name="password" value="123456" />
```

**Khu 2:** `D:\MYH5\my_s2\data\morningGlory_data.xml` → kết nối tới `myh5_s2`  
**Khu 3:** `D:\MYH5\my_s3\data\morningGlory_data.xml` → kết nối tới `myh5_s3`

### Khởi động từng khu:

Chạy theo thứ tự, mỗi khu mở một cửa sổ cmd riêng:

**Khu 1** - Nhấp đúp vào `D:\MYH5\【2】启动一区.bat`  
Hoặc tự chạy trong cmd:
```bat
cd /d D:\MYH5\my_s1
D:\MYH5\Java\bin\java.exe -server -Duser.timezone=Asia/Shanghai -Dsun.jnu.encoding=UTF-8 -jar server.jar
```

**Khu 2** - Nhấp đúp vào `D:\MYH5\【3】启动二区.bat`  
**Khu 3** - Nhấp đúp vào `D:\MYH5\【4】启动三区.bat`

> **Lưu ý:** Chờ mỗi khu hiển thị thông báo khởi động thành công trước khi chạy khu tiếp theo.

---

## 11. Khởi Động và Kiểm Tra

### Thứ tự khởi động đúng:

```
1. Khởi động XAMPP Control Panel
   ├── Start MySQL  (cổng 3306)
   └── Start Apache (cổng 80)

2. Khởi động server game:
   ├── Chạy 【2】启动一区.bat  → Server Khu 1 (cổng 8025, 8081)
   ├── Chạy 【3】启动二区.bat  → Server Khu 2 (cổng 8026, 8082)
   └── Chạy 【4】启动三区.bat  → Server Khu 3 (cổng 8027, 8083)
```

### Kiểm tra hoạt động:

| Kiểm tra | URL | Kết quả mong đợi |
|---|---|---|
| Trang game | `http://192.168.1.100/` | Hiển thị trang chủ game |
| Trang GM | `http://192.168.1.100/gm/` | Hiển thị trang đăng nhập GM |
| API server list | `http://192.168.1.100/platform/getServerPage.php` | JSON danh sách khu |
| Khu 1 HTTP | `http://192.168.1.100:8081/` | Server Khu 1 phản hồi |

---

## 12. Thông Tin Cổng Mạng

| Dịch vụ | Cổng | Mô tả |
|---|---|---|
| Apache (Web) | **80** | Trang web game, API (cổng HTTP mặc định) |
| MySQL | **3306** | Cơ sở dữ liệu |
| Khu 1 - TCP | **8025** | Kết nối game client Khu 1 |
| Khu 1 - HTTP | **8081** | HTTP nội bộ Khu 1 |
| Khu 2 - TCP | **8026** | Kết nối game client Khu 2 |
| Khu 2 - HTTP | **8082** | HTTP nội bộ Khu 2 |
| Khu 3 - TCP | **8027** | Kết nối game client Khu 3 |
| Khu 3 - HTTP | **8083** | HTTP nội bộ Khu 3 |

> **Firewall:** Mở tất cả các cổng trên trong Windows Firewall và/hoặc router.  
> Vào: `Control Panel → Windows Defender Firewall → Advanced Settings → Inbound Rules → New Rule`

---

## 13. Trang Quản Trị GM

| Thông tin | Giá trị |
|---|---|
| URL GM Panel | `http://YOUR_IP/gm/` |
| Mã xác thực GM | `syymw.com` |
| Tài khoản DB | root / 123456 |

Chức năng GM Panel:
- Nạp tiền ảo (Mắt Thần) cho tài khoản game
- Gửi vật phẩm qua hòm thư trong game
- Quản lý người chơi theo khu

---

## 14. Xử Lý Lỗi Thường Gặp

### Lỗi: `mysql_connect()` không hoạt động
**Nguyên nhân:** Đang dùng PHP 7.x  
**Giải pháp:** Tải và cài XAMPP với PHP **5.6.x**

### Lỗi: Apache không khởi động được
**Nguyên nhân:** Cổng 80 bị chiếm bởi IIS, Skype, hoặc phần mềm khác  
**Kiểm tra:** Mở cmd gõ `netstat -ano | findstr :80`  
**Giải pháp:** Tắt IIS (`net stop W3SVC`), tắt Skype, hoặc tắt phần mềm đang dùng cổng 80

### Lỗi: "数据库连接失败" (Kết nối database thất bại)
**Nguyên nhân:** Sai mật khẩu MySQL hoặc MySQL chưa chạy  
**Kiểm tra:** Đảm bảo MySQL trong XAMPP đang chạy và mật khẩu root là `123456`

### Lỗi: Server game (Java) báo lỗi kết nối DB
**Nguyên nhân:** Database `myh5_s1/s2/s3` chưa được tạo hoặc import  
**Giải pháp:** Kiểm tra lại bước Import Database (Bước 6)

### Lỗi: Trang game hiển thị nhưng không chọn được server
**Nguyên nhân:** IP trong database `cfg_server` chưa được cập nhật  
**Giải pháp:** Thực hiện lại Bước 8 - cập nhật IP trong database

### Lỗi: Client không kết nối được vào game
**Nguyên nhân:** Cổng 8025/8026/8027 bị chặn bởi firewall  
**Giải pháp:** Mở các cổng TCP này trong Windows Firewall

### Lỗi: Java server không gọi được về web (lỗi xác thực login)
**Nguyên nhân:** `gameserver.properties` vẫn còn cấu hình cổng 81  
**Giải pháp:** Kiểm tra lại Bước 9 - sửa `:81` thành không có cổng trong 3 file `gameserver.properties`

---

## Tóm Tắt Nhanh

```
1.  Cài XAMPP 5.6.x (PHP 5.6 - bắt buộc)
2.  Sửa DocumentRoot → D:/MYH5/my_web trong httpd.conf
3.  Đặt mật khẩu MySQL root = 123456
4.  Tạo 5 database: myh5_pl, myh5_s1, myh5_s2, myh5_s3, myh5_log
5.  Import SQL từ thư mục 环境\sql\
6.  Sửa IP trong my_web\api\config.php         (bỏ :81, thay IP)
7.  Sửa IP trong my_web\platform\getServerPage.php (thay IP)
8.  UPDATE cfg_server SET ip = 'YOUR_IP' trong MySQL
9.  Sửa :81 → bỏ cổng trong 3 file my_s*/data/gameserver.properties
10. Khởi động XAMPP (MySQL + Apache cổng 80)
11. Chạy bat file: 启动一区 → 启动二区 → 启动三区
12. Mở http://YOUR_IP/ để chơi game
    Mở http://YOUR_IP/gm/ để vào GM panel (mã: syymw.com)
```

---

*Hướng dẫn này dành cho mục đích học tập và nghiên cứu cá nhân.*
