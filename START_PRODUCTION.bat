@echo off
echo ========================================
echo   SurakshaPath - Production Startup
echo ========================================
echo.

echo [1/3] Starting Backend Server...
cd backend
start "SurakshaPath Backend" cmd /k "uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload"

echo [2/3] Waiting for backend to start...
timeout /t 5 /nobreak >nul

echo [3/3] Starting Frontend Server...
cd ../frontend
start "SurakshaPath Frontend" cmd /k "npm run dev"

echo.
echo ========================================
echo   SurakshaPath is Starting...
echo ========================================
echo.
echo Backend: http://localhost:8000
echo Frontend: http://localhost:5173
echo API Docs: http://localhost:8000/docs
echo.
echo Default Admin: admin@surakshapath.in / Admin@123
echo Default User: user@surakshapath.in / User@123
echo.
echo Press any key to open the application in browser...
pause >nul
start http://localhost:5173

echo.
echo 🎉 SurakshaPath Production Ready!
echo ========================================
