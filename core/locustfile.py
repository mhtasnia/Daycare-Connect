from locust import HttpUser, task, between
import random
import string

class WebsiteUser(HttpUser):
    wait_time = between(1, 3)

    def generate_email(self):
        return f"testuser{random.randint(1000, 9999)}@example.com"

    def generate_otp(self, email):
        # Send OTP first
        self.client.post("/api/user-auth/send-otp/", json={"email": email, "purpose": "registration"})
        
        # 🛠️ You need a way to fetch OTP from database or expose a test-only endpoint that returns it.
        # For now, return a placeholder that will cause verify to fail unless manually patched.
        return "123456"  # Replace with actual OTP in dev env

    @task
    def register_parent_flow(self):
        email = self.generate_email()
        otp_code = self.generate_otp(email)

        # (Optional) Verify OTP
        self.client.post("/api/user-auth/verify-otp/", json={
            "email": email,
            "otp_code": otp_code,
            "purpose": "registration"
        })

        # Try to register
        response = self.client.post("/api/user-auth/parents/register/", json={
            "email": email,
            "password": "Testpass123",
            "confirm_password": "Testpass123",
            "full_name": "Load Tester",
            "otp_code": otp_code
        })

        if response.status_code != 201:
            print("❌ Parent registration failed:", response.text)
