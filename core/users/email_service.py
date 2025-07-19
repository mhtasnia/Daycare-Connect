from django.core.mail import send_mail
from django.conf import settings
from django.template.loader import render_to_string
from django.utils.html import strip_tags

class EmailService:
    @staticmethod
    def send_otp_email(email, otp_code, purpose='registration'):
        """Send OTP email to user"""
        try:
            subject_map = {
                'registration': 'Verify Your Email - Daycare Connect',
                'login': 'Login Verification - Daycare Connect',
                'password_reset': 'Password Reset - Daycare Connect',
            }
            
            subject = subject_map.get(purpose, 'Verification Code - Daycare Connect')
            
            # Create email context
            context = {
                'otp_code': otp_code,
                'purpose': purpose,
                'email': email,
                'app_name': 'Daycare Connect',
                'support_email': 'support@daycareconnect.com',
            }
            
            # Render HTML email template
            html_message = render_to_string('emails/otp_email.html', context)
            plain_message = strip_tags(html_message)
            
            # Send email
            send_mail(
                subject=subject,
                message=plain_message,
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[email],
                html_message=html_message,
                fail_silently=False,
            )
            
            return True
            
        except Exception as e:
            return False

    @staticmethod
    def send_welcome_email(email, user_type):
        """Send welcome email after successful registration"""
        try:
            subject = f"Welcome to Daycare Connect!"
            
            context = {
                'email': email,
                'user_type': user_type,
                'app_name': 'Daycare Connect',
                'login_url': 'http://localhost:3000/parent/login' if user_type == 'parent' else 'http://localhost:3000/daycare/login',
            }
            
            html_message = render_to_string('emails/welcome_email.html', context)
            plain_message = strip_tags(html_message)
            
            send_mail(
                subject=subject,
                message=plain_message,
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[email],
                html_message=html_message,
                fail_silently=False,
            )
            
            return True
            
        except Exception as e:
            return False