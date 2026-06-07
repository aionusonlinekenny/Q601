@echo off
cd /d "%~dp0.."

:: Install Pillow if not already present (needed for Sprites tab)
python -c "import PIL" 2>nul || (
    echo Installing Pillow for sprite editing...
    python -m pip install Pillow --quiet
)

python tools\translation_editor.py
pause
