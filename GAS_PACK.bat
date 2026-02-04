@echo off
setlocal EnableDelayedExpansion
echo [INFO] MERAKIT ULANG DATA4.DAT (FULL SYSTEM)...

:: KUNCI DIES IRAE
set "KEY=ap+s)4u86wzj(uaz"

:: 1. SET PATH (PENTING BIAR GAK ERROR PATH)
set "ROOT=%~dp0"
cd /d "%ROOT%"

:: 2. BERSIH-BERSIH
if exist data4_MOD.dat del data4_MOD.dat
if exist list_data4.txt del list_data4.txt

:: 3. PASTIKAN FOLDER SUMBER ADA
if not exist "data.src\system" (
    echo [ERROR] Folder 'data.src\system' GAK KETEMU!
    echo Script ini harus dijalankan di folder 'romfs' hasil dump.
    pause
    exit /b
)

:: 4. BIKIN DAFTAR FILE (KOMPOSISI DATA4 ASLI)
echo Mengumpulkan file system...
dir /b /s "data.src\system\*" >> list_data4.txt

echo Mengumpulkan file screen...
dir /b /s "data.src\screen\*" >> list_data4.txt

echo Mengumpulkan file extra...
dir /b /s "data.src\extra\*" >> list_data4.txt

echo Mengumpulkan file mask...
dir /b /s "data.src\picture\mask\*" >> list_data4.txt

:: 5. PACKING ULANG
:: Kita pakai root "data.src\" biar struktur di dalam dat jadi "system\..."
echo Sedang membungkus data4_MOD.dat (Tungguin, agak lama)...
maliedat.exe -s 2048:1 -k !KEY! -p "%ROOT%data.src\\" list_data4.txt data4_MOD.dat

echo.
if exist data4_MOD.dat (
    echo [SUKSES] DATA4 BARU UDAH JADI!
    echo Nama filenya: data4_MOD.dat
    echo.
    echo CARA PASANG:
    echo 1. Rename 'data4_MOD.dat' jadi 'data4.dat'.
    echo 2. Copy ke folder Mod Yuzu lu (Gantikan data4.dat yang lama).
    echo 3. HAPUS 'data5.dat' (JANGAN PAKE DATA5 LAGI).
) else (
    echo [GAGAL] Cek error di atas.
)

:: Hapus list sampah
del list_data4.txt
pause