#!/usr/bin/env python3
"""
Comprehensive testing script for SurakshaPath Disaster Management Platform
Tests all features systematically and identifies any issues
"""
import requests
import json
import time
import os
from datetime import datetime

class SurakshaPathTester:
    def __init__(self, base_url="http://localhost:8000"):
        self.base_url = base_url
        self.session = requests.Session()
        self.admin_token = None
        self.user_token = None
        self.test_results = []
        # UUIDs from seed data
        self.state_id = "189555c1-aa7e-468e-938d-788de57cc113"
        self.district_id = "b3defb29-20dc-479f-b9b5-b69e2661999f"
        
    def log_test(self, test_name, status, details=""):
        """Log test results"""
        result = {
            "test": test_name,
            "status": status,
            "details": details,
            "timestamp": datetime.now().isoformat()
        }
        self.test_results.append(result)
        status_icon = "✅" if status == "PASS" else "❌" if status == "FAIL" else "⚠️"
        print(f"{status_icon} {test_name}: {status}")
        if details:
            print(f"   Details: {details}")
    
    def test_health_check(self):
        """Test backend health"""
        try:
            response = self.session.get(f"{self.base_url}/healthz")
            if response.status_code == 200:
                self.log_test("Backend Health Check", "PASS", "Backend is running")
                return True
            else:
                self.log_test("Backend Health Check", "FAIL", f"Status: {response.status_code}")
                return False
        except Exception as e:
            self.log_test("Backend Health Check", "FAIL", str(e))
            return False
    
    def test_admin_login(self):
        """Test admin authentication"""
        try:
            payload = {
                "email": "admin@surakshapath.in",
                "password": "Admin@123"
            }
            response = self.session.post(f"{self.base_url}/auth/login", json=payload)
            if response.status_code == 200:
                data = response.json()
                self.admin_token = data.get("access_token")
                self.session.headers.update({"Authorization": f"Bearer {self.admin_token}"})
                self.log_test("Admin Login", "PASS", "Admin authenticated successfully")
                return True
            else:
                self.log_test("Admin Login", "FAIL", f"Status: {response.status_code}, Response: {response.text}")
                return False
        except Exception as e:
            self.log_test("Admin Login", "FAIL", str(e))
            return False
    
    def test_user_login(self):
        """Test user authentication"""
        try:
            payload = {
                "email": "user@surakshapath.in", 
                "password": "User@123"
            }
            # Create new session for user
            user_session = requests.Session()
            response = user_session.post(f"{self.base_url}/auth/login", json=payload)
            if response.status_code == 200:
                data = response.json()
                self.user_token = data.get("access_token")
                self.log_test("User Login", "PASS", "User authenticated successfully")
                return True, user_session
            else:
                self.log_test("User Login", "FAIL", f"Status: {response.status_code}, Response: {response.text}")
                return False, None
        except Exception as e:
            self.log_test("User Login", "FAIL", str(e))
            return False, None
    
    def test_sos_creation(self, user_session):
        """Test SOS creation from user side"""
        try:
            # Get user token first
            payload = {
                "email": "user@surakshapath.in", 
                "password": "User@123"
            }
            auth_response = user_session.post(f"{self.base_url}/auth/login", json=payload)
            if auth_response.status_code != 200:
                self.log_test("SOS Creation (User)", "FAIL", "User authentication failed")
                return None
                
            user_token = auth_response.json().get("access_token")
            headers = {"Authorization": f"Bearer {user_token}"}
            
            payload = {
                "message": "Test SOS - Emergency flood situation",
                "severity": "high",
                "latitude": 20.5937,
                "longitude": 78.9629,
                "state_id": self.state_id,  # Use UUID
                "district_id": self.district_id,
                "meta": {"people": 2, "water_level": "high"}
            }
            response = user_session.post(f"{self.base_url}/sos", json=payload, headers=headers)
            if response.status_code == 200:
                sos_data = response.json()
                self.log_test("SOS Creation (User)", "PASS", f"SOS created with ID: {sos_data.get('id')}")
                return sos_data
            else:
                self.log_test("SOS Creation (User)", "FAIL", f"Status: {response.status_code}, Response: {response.text}")
                return None
        except Exception as e:
            self.log_test("SOS Creation (User)", "FAIL", str(e))
            return None
    
    def test_admin_sos_visibility(self):
        """Test admin can see SOS requests"""
        try:
            response = self.session.get(f"{self.base_url}/sos")
            if response.status_code == 200:
                sos_list = response.json()
                if len(sos_list) > 0:
                    self.log_test("Admin SOS Visibility", "PASS", f"Admin can see {len(sos_list)} SOS requests")
                    return sos_list
                else:
                    self.log_test("Admin SOS Visibility", "FAIL", "No SOS requests found")
                    return []
            else:
                self.log_test("Admin SOS Visibility", "FAIL", f"Status: {response.status_code}")
                return []
        except Exception as e:
            self.log_test("Admin SOS Visibility", "FAIL", str(e))
            return []
    
    def test_damage_report(self, user_session):
        """Test damage report creation"""
        try:
            # Get user token first
            payload = {
                "email": "user@surakshapath.in", 
                "password": "User@123"
            }
            auth_response = user_session.post(f"{self.base_url}/auth/login", json=payload)
            if auth_response.status_code != 200:
                self.log_test("Damage Report Creation", "FAIL", "User authentication failed")
                return None
                
            user_token = auth_response.json().get("access_token")
            headers = {"Authorization": f"Bearer {user_token}"}
            
            # Create a test image file with unique name
            import uuid
            test_image_path = f"test_damage_{uuid.uuid4()}.jpg"
            with open(test_image_path, "wb") as f:
                f.write(b"fake_image_data_for_testing")
            
            payload = {
                "state_id": self.state_id,
                "district_id": self.district_id, 
                "title": "Test Damage Report",
                "description": "Test damage from flood",
                "latitude": 20.5937,
                "longitude": 78.9629
            }
            
            with open(test_image_path, "rb") as f:
                files = {"files": (test_image_path, f, "image/jpeg")}
                response = user_session.post(f"{self.base_url}/damage-reports", data=payload, files=files, headers=headers)
            
            # Clean up test file
            try:
                os.remove(test_image_path)
            except:
                pass  # Ignore cleanup errors
            
            if response.status_code == 200:
                report_data = response.json()
                self.log_test("Damage Report Creation", "PASS", f"Report created with ID: {report_data.get('id')}")
                return report_data
            else:
                self.log_test("Damage Report Creation", "FAIL", f"Status: {response.status_code}, Response: {response.text}")
                return None
        except Exception as e:
            self.log_test("Damage Report Creation", "FAIL", str(e))
            return None
    
    def test_volunteer_registration(self, user_session):
        """Test volunteer registration"""
        try:
            # Get user token first
            payload = {
                "email": "user@surakshapath.in", 
                "password": "User@123"
            }
            auth_response = user_session.post(f"{self.base_url}/auth/login", json=payload)
            if auth_response.status_code != 200:
                self.log_test("Volunteer Registration", "FAIL", "User authentication failed")
                return None
                
            user_token = auth_response.json().get("access_token")
            headers = {"Authorization": f"Bearer {user_token}"}
            
            payload = {
                "full_name": "Test Volunteer",
                "phone": "+91-9876543210",
                "skills": ["first_aid", "rescue_support"],
                "availability": "daily_evening",
                "latitude": 20.5937,
                "longitude": 78.9629,
                "state_id": self.state_id,
                "district_id": self.district_id
            }
            response = user_session.post(f"{self.base_url}/volunteers", json=payload, headers=headers)
            if response.status_code == 200:
                volunteer_data = response.json()
                self.log_test("Volunteer Registration", "PASS", f"Volunteer registered with ID: {volunteer_data.get('id')}")
                return volunteer_data
            else:
                self.log_test("Volunteer Registration", "FAIL", f"Status: {response.status_code}, Response: {response.text}")
                return None
        except Exception as e:
            self.log_test("Volunteer Registration", "FAIL", str(e))
            return None
    
    def test_shelter_management(self):
        """Test shelter listing and capacity update"""
        try:
            # Test shelter listing
            response = self.session.get(f"{self.base_url}/shelters")
            if response.status_code == 200:
                shelters = response.json()
                if len(shelters) > 0:
                    self.log_test("Shelter Listing", "PASS", f"Found {len(shelters)} shelters")
                    
                    # Test capacity update
                    shelter_id = shelters[0]["id"]
                    update_payload = {"available_capacity": 100}
                    update_response = self.session.patch(f"{self.base_url}/shelters/{shelter_id}/capacity", json=update_payload)
                    if update_response.status_code == 200:
                        self.log_test("Shelter Capacity Update", "PASS", "Capacity updated successfully")
                        return True
                    else:
                        self.log_test("Shelter Capacity Update", "FAIL", f"Status: {update_response.status_code}")
                        return False
                else:
                    self.log_test("Shelter Listing", "FAIL", "No shelters found")
                    return False
            else:
                self.log_test("Shelter Listing", "FAIL", f"Status: {response.status_code}")
                return False
        except Exception as e:
            self.log_test("Shelter Management", "FAIL", str(e))
            return False
    
    def test_news_system(self):
        """Test AI news system"""
        try:
            response = self.session.get(f"{self.base_url}/news/ai-disaster-updates?limit=5")
            if response.status_code == 200:
                news_data = response.json()
                items = news_data.get("items", [])
                self.log_test("AI News System", "PASS", f"Retrieved {len(items)} news items")
                return True
            else:
                self.log_test("AI News System", "FAIL", f"Status: {response.status_code}")
                return False
        except Exception as e:
            self.log_test("AI News System", "FAIL", str(e))
            return False
    
    def test_user_profile(self):
        """Test user profile management"""
        try:
            response = self.session.get(f"{self.base_url}/users/me")
            if response.status_code == 200:
                profile = response.json()
                self.log_test("User Profile", "PASS", f"Profile retrieved for {profile.get('email')}")
                return True
            else:
                self.log_test("User Profile", "FAIL", f"Status: {response.status_code}")
                return False
        except Exception as e:
            self.log_test("User Profile", "FAIL", str(e))
            return False
    
    def run_all_tests(self):
        """Run comprehensive test suite"""
        print("🚀 Starting SurakshaPath Comprehensive Testing")
        print("=" * 60)
        
        # Basic connectivity
        if not self.test_health_check():
            print("❌ Backend is not running. Please start the backend server first.")
            return False
        
        # Authentication tests
        if not self.test_admin_login():
            print("❌ Admin login failed. Cannot proceed with admin tests.")
            return False
        
        user_success, user_session = self.test_user_login()
        if not user_success:
            print("❌ User login failed. Cannot proceed with user tests.")
            return False
        
        # Feature tests
        sos_data = self.test_sos_creation(user_session)
        self.test_admin_sos_visibility()
        self.test_damage_report(user_session)
        volunteer_data = self.test_volunteer_registration(user_session)
        self.test_shelter_management()
        self.test_news_system()
        self.test_user_profile()
        
        # Summary
        print("\n" + "=" * 60)
        print("📊 TEST SUMMARY")
        print("=" * 60)
        
        passed = len([r for r in self.test_results if r["status"] == "PASS"])
        failed = len([r for r in self.test_results if r["status"] == "FAIL"])
        total = len(self.test_results)
        
        print(f"Total Tests: {total}")
        print(f"✅ Passed: {passed}")
        print(f"❌ Failed: {failed}")
        print(f"Success Rate: {(passed/total*100):.1f}%" if total > 0 else "0%")
        
        if failed > 0:
            print("\n❌ FAILED TESTS:")
            for result in self.test_results:
                if result["status"] == "FAIL":
                    print(f"   - {result['test']}: {result['details']}")
        
        # Save detailed results
        with open("test_results.json", "w") as f:
            json.dump(self.test_results, f, indent=2)
        print(f"\n📄 Detailed results saved to: test_results.json")
        
        return failed == 0

if __name__ == "__main__":
    tester = SurakshaPathTester()
    success = tester.run_all_tests()
    
    if success:
        print("\n🎉 All tests passed! SurakshaPath is working correctly.")
    else:
        print("\n⚠️ Some tests failed. Please check the issues above.")
