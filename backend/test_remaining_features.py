#!/usr/bin/env python3
"""
Test remaining features: Risk Zones, AI Features, WebSocket functionality
"""
import requests
import json
import asyncio
import websockets
import time
from datetime import datetime

class RemainingFeaturesTester:
    def __init__(self, base_url="http://localhost:8000"):
        self.base_url = base_url
        self.session = requests.Session()
        self.admin_token = None
        self.test_results = []
        
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
    
    def setup_admin_session(self):
        """Setup admin authentication"""
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
                return True
            return False
        except:
            return False
    
    def test_risk_zones(self):
        """Test risk zones functionality"""
        try:
            response = self.session.get(f"{self.base_url}/risk-zones")
            if response.status_code == 200:
                zones = response.json()
                self.log_test("Risk Zones API", "PASS", f"Retrieved {len(zones)} risk zones")
                return True
            else:
                self.log_test("Risk Zones API", "FAIL", f"Status: {response.status_code}")
                return False
        except Exception as e:
            self.log_test("Risk Zones API", "FAIL", str(e))
            return False
    
    def test_ai_features(self):
        """Test AI prediction endpoints"""
        # Test with proper query parameters
        ai_tests = [
            ("/ai/flood-prediction?state_id=189555c1-aa7e-468e-938d-788de57cc113&district_id=b3defb29-20dc-479f-b9b5-b69e2661999f", "Flood Prediction"),
            ("/ai/resource-optimizer?state_id=189555c1-aa7e-468e-938d-788de57cc113&district_id=b3defb29-20dc-479f-b9b5-b69e2661999f", "Resource Optimizer")
        ]
        
        # For damage assessment, we need a report ID first
        try:
            # Get existing damage reports
            reports_response = self.session.get(f"{self.base_url}/damage-reports")
            if reports_response.status_code == 200 and reports_response.json():
                report_id = reports_response.json()[0]["id"]
                ai_tests.append((f"/ai/damage-assessment?report_id={report_id}", "Damage Assessment"))
            else:
                ai_tests.append(("/ai/damage-assessment?report_id=test-id", "Damage Assessment (Test)"))
        except:
            ai_tests.append(("/ai/damage-assessment?report_id=test-id", "Damage Assessment (Test)"))
        
        success_count = 0
        for endpoint, name in ai_tests:
            try:
                response = self.session.get(f"{self.base_url}{endpoint}")
                if response.status_code == 200:
                    self.log_test(f"AI Feature: {name}", "PASS", "AI endpoint responding")
                    success_count += 1
                else:
                    self.log_test(f"AI Feature: {name}", "FAIL", f"Status: {response.status_code}")
            except Exception as e:
                self.log_test(f"AI Feature: {name}", "FAIL", str(e))
        
        return success_count == len(ai_tests)
    
    async def test_websocket_sos_feed(self):
        """Test WebSocket SOS feed"""
        try:
            uri = "ws://localhost:8000/ws/sos-feed"
            async with websockets.connect(uri) as websocket:
                # Wait for connection
                await asyncio.sleep(1)
                
                # Create a test SOS to trigger WebSocket message
                sos_payload = {
                    "message": "WebSocket Test SOS",
                    "severity": "medium",
                    "latitude": 20.5937,
                    "longitude": 78.9629,
                    "state_id": "189555c1-aa7e-468e-938d-788de57cc113",
                    "district_id": "b3defb29-20dc-479f-b9b5-b69e2661999f",
                    "meta": {"test": True}
                }
                
                # Create SOS in separate thread
                import threading
                def create_sos():
                    time.sleep(0.5)  # Small delay
                    try:
                        requests.post(f"{self.base_url}/sos", json=sos_payload, 
                                    headers={"Authorization": f"Bearer {self.admin_token}"})
                    except:
                        pass
                
                threading.Thread(target=create_sos, daemon=True).start()
                
                # Listen for WebSocket message
                try:
                    message = await asyncio.wait_for(websocket.recv(), timeout=3.0)
                    data = json.loads(message)
                    if data.get("event") == "sos_created":
                        self.log_test("WebSocket SOS Feed", "PASS", "Real-time SOS broadcast working")
                        return True
                    else:
                        self.log_test("WebSocket SOS Feed", "FAIL", f"Unexpected event: {data.get('event')}")
                        return False
                except asyncio.TimeoutError:
                    self.log_test("WebSocket SOS Feed", "FAIL", "No message received within timeout")
                    return False
                    
        except Exception as e:
            self.log_test("WebSocket SOS Feed", "FAIL", str(e))
            return False
    
    async def test_websocket_shelter_updates(self):
        """Test WebSocket shelter updates"""
        try:
            uri = "ws://localhost:8000/ws/shelter-updates"
            async with websockets.connect(uri) as websocket:
                await asyncio.sleep(1)
                
                # Get a shelter to update
                shelters_response = self.session.get(f"{self.base_url}/shelters")
                if shelters_response.status_code != 200 or not shelters_response.json():
                    self.log_test("WebSocket Shelter Updates", "SKIP", "No shelters available")
                    return True
                
                shelter = shelters_response.json()[0]
                
                # Update shelter capacity to trigger WebSocket message
                import threading
                def update_shelter():
                    time.sleep(0.5)
                    try:
                        requests.patch(f"{self.base_url}/shelters/{shelter['id']}/capacity", 
                                    json={"available_capacity": 50},
                                    headers={"Authorization": f"Bearer {self.admin_token}"})
                    except:
                        pass
                
                threading.Thread(target=update_shelter, daemon=True).start()
                
                # Listen for WebSocket message
                try:
                    message = await asyncio.wait_for(websocket.recv(), timeout=3.0)
                    data = json.loads(message)
                    if data.get("event") == "capacity_updated":
                        self.log_test("WebSocket Shelter Updates", "PASS", "Real-time shelter updates working")
                        return True
                    else:
                        self.log_test("WebSocket Shelter Updates", "FAIL", f"Unexpected event: {data.get('event')}")
                        return False
                except asyncio.TimeoutError:
                    self.log_test("WebSocket Shelter Updates", "FAIL", "No message received within timeout")
                    return False
                    
        except Exception as e:
            self.log_test("WebSocket Shelter Updates", "FAIL", str(e))
            return False
    
    def test_user_registration(self):
        """Test new user registration"""
        try:
            import uuid
            unique_email = f"testuser_{uuid.uuid4().hex[:8]}@test.com"
            
            payload = {
                "email": unique_email,
                "password": "Test@123",
                "full_name": "Test User",
                "phone": "+91-1234567890",
                "state_id": "189555c1-aa7e-468e-938d-788de57cc113",
                "district_id": "b3defb29-20dc-479f-b9b5-b69e2661999f"
            }
            
            response = self.session.post(f"{self.base_url}/auth/register", json=payload)
            if response.status_code == 200:
                self.log_test("User Registration", "PASS", f"New user registered: {unique_email}")
                return True
            else:
                self.log_test("User Registration", "FAIL", f"Status: {response.status_code}, Response: {response.text}")
                return False
        except Exception as e:
            self.log_test("User Registration", "FAIL", str(e))
            return False
    
    async def run_all_tests(self):
        """Run all remaining feature tests"""
        print("🚀 Testing Remaining SurakshaPath Features")
        print("=" * 50)
        
        if not self.setup_admin_session():
            print("❌ Admin authentication failed")
            return False
        
        # Test synchronous features
        self.test_risk_zones()
        self.test_ai_features()
        self.test_user_registration()
        
        # Test WebSocket features
        await self.test_websocket_sos_feed()
        await self.test_websocket_shelter_updates()
        
        # Summary
        print("\n" + "=" * 50)
        print("📊 REMAINING FEATURES TEST SUMMARY")
        print("=" * 50)
        
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
        
        return failed == 0

if __name__ == "__main__":
    tester = RemainingFeaturesTester()
    success = asyncio.run(tester.run_all_tests())
    
    if success:
        print("\n🎉 All remaining features tested successfully!")
    else:
        print("\n⚠️ Some remaining features have issues.")
