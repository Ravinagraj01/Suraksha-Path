#!/usr/bin/env python3
"""
Install all required dependencies for the SurakshaPath backend
"""
import subprocess
import sys

def install_package(package):
    """Install a single package"""
    try:
        subprocess.check_call([sys.executable, "-m", "pip", "install", package])
        print(f"✅ Successfully installed: {package}")
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ Failed to install {package}: {e}")
        return False

def main():
    """Install all required packages"""
    packages = [
        "sqlalchemy==2.0.41",
        "alembic==1.16.4", 
        "pydantic==2.11.7",
        "pydantic-settings==2.10.1",
        "email-validator==2.2.0",
        "python-jose[cryptography]==3.5.0",
        "passlib[bcrypt]==1.7.4",
        "python-multipart==0.0.20",
        "slowapi==0.1.9",
        "websockets==15.0.1",
        "httpx==0.28.1",
        "pytest==8.4.1",
        "psycopg[binary]==3.2.10"
    ]
    
    print("🚀 Installing SurakshaPath Backend Dependencies...")
    print("=" * 50)
    
    failed_packages = []
    for package in packages:
        if not install_package(package):
            failed_packages.append(package)
    
    print("=" * 50)
    if failed_packages:
        print(f"❌ Failed to install {len(failed_packages)} packages:")
        for pkg in failed_packages:
            print(f"   - {pkg}")
    else:
        print("✅ All packages installed successfully!")
        print("🎉 SurakshaPath backend is ready to run!")

if __name__ == "__main__":
    main()
