import React, { useState, useEffect, useRef } from 'react';
import { Form, Button, Alert, Spinner } from 'react-bootstrap';
import { FaEnvelope, FaClock, FaShieldAlt } from 'react-icons/fa';
import axios from 'axios';

function OTPVerification({ 
  email, 
  purpose = 'registration', 
  onVerificationSuccess, 
  onResendOTP,
  isLoading = false 
}) {
  const [otpCode, setOtpCode] = useState(['', '', '', '', '', '']);
  const [errors, setErrors] = useState({});
  const [isVerifying, setIsVerifying] = useState(false);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes in seconds
  const [canResend, setCanResend] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState('info');

  const inputRefs = useRef([]);

  useEffect(() => {
    // Start countdown timer
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          setCanResend(true);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    // Focus first input on mount
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleInputChange = (index, value) => {
    // Only allow digits
    if (!/^\d*$/.test(value)) return;

    const newOtpCode = [...otpCode];
    newOtpCode[index] = value;
    setOtpCode(newOtpCode);

    // Clear errors when user starts typing
    if (errors.otp_code) {
      setErrors({});
    }

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    // Handle backspace
    if (e.key === 'Backspace' && !otpCode[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    
    // Handle paste
    if (e.key === 'v' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      navigator.clipboard.readText().then((text) => {
        const digits = text.replace(/\D/g, '').slice(0, 6);
        const newOtpCode = [...otpCode];
        for (let i = 0; i < digits.length && i < 6; i++) {
          newOtpCode[i] = digits[i];
        }
        setOtpCode(newOtpCode);
        
        // Focus the next empty input or the last one
        const nextIndex = Math.min(digits.length, 5);
        inputRefs.current[nextIndex]?.focus();
      });
    }
  };

  const handleVerifyOTP = async () => {
    const otpString = otpCode.join('');
    
    if (otpString.length !== 6) {
      setErrors({ otp_code: 'Please enter the complete 6-digit code' });
      return;
    }

    setIsVerifying(true);
    setErrors({});

    try {
      const response = await axios.post(
        'http://localhost:8000/api/user-auth/verify-otp/',
        {
          email,
          otp_code: otpString,
          purpose
        }
      );

      setAlertType('success');
      setAlertMessage('Email verified successfully!');
      setShowAlert(true);

      // Call success callback
      if (onVerificationSuccess) {
        onVerificationSuccess(otpString);
      }

    } catch (error) {
      if (error.response?.data) {
        const errorData = error.response.data;
        if (errorData.non_field_errors) {
          setErrors({ otp_code: errorData.non_field_errors[0] });
        } else if (errorData.otp_code) {
          setErrors({ otp_code: errorData.otp_code[0] });
        } else {
          setErrors({ otp_code: 'Verification failed. Please try again.' });
        }
      } else {
        setErrors({ otp_code: 'Network error. Please try again.' });
      }
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendOTP = async () => {
    if (!canResend) return;

    try {
      await axios.post('http://localhost:8000/api/user-auth/send-otp/', {
        email,
        purpose
      });

      setAlertType('info');
      setAlertMessage('New verification code sent to your email!');
      setShowAlert(true);
      setTimeLeft(600); // Reset timer
      setCanResend(false);
      setOtpCode(['', '', '', '', '', '']); // Clear current OTP
      
      // Focus first input
      inputRefs.current[0]?.focus();

      if (onResendOTP) {
        onResendOTP();
      }

    } catch (error) {
      setAlertType('danger');
      setAlertMessage('Failed to resend code. Please try again.');
      setShowAlert(true);
    }
  };

  return (
    <div className="otp-verification-container">
      <div className="text-center mb-4">
        <div className="otp-icon mb-3">
          <FaShieldAlt size={48} color="#f48fb1" />
        </div>
        <h4 className="otp-title">Verify Your Email</h4>
        <p className="otp-subtitle">
          We've sent a 6-digit verification code to
        </p>
        <div className="email-display">
          <FaEnvelope className="me-2" />
          <strong>{email}</strong>
        </div>
      </div>

      {showAlert && (
        <Alert 
          variant={alertType} 
          className="mb-4"
          onClose={() => setShowAlert(false)}
          dismissible
        >
          {alertMessage}
        </Alert>
      )}

      <Form>
        <Form.Group className="mb-4">
          <Form.Label className="text-center d-block mb-3">
            Enter Verification Code
          </Form.Label>
          <div className="otp-input-container">
            {otpCode.map((digit, index) => (
              <Form.Control
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                maxLength="1"
                value={digit}
                onChange={(e) => handleInputChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className={`otp-input ${errors.otp_code ? 'is-invalid' : ''}`}
                disabled={isLoading || isVerifying}
              />
            ))}
          </div>
          {errors.otp_code && (
            <div className="invalid-feedback d-block text-center mt-2">
              {errors.otp_code}
            </div>
          )}
        </Form.Group>

        <div className="text-center mb-4">
          <Button
            onClick={handleVerifyOTP}
            disabled={isLoading || isVerifying || otpCode.join('').length !== 6}
            className="btn-otp-verify"
            size="lg"
          >
            {isVerifying ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" />
                Verifying...
              </>
            ) : (
              'Verify Email'
            )}
          </Button>
        </div>

        <div className="otp-footer text-center">
          <div className="timer-container mb-3">
            <FaClock className="me-2" />
            {timeLeft > 0 ? (
              <span>Code expires in {formatTime(timeLeft)}</span>
            ) : (
              <span className="text-danger">Code has expired</span>
            )}
          </div>

          <div className="resend-container">
            <span className="text-muted">Didn't receive the code? </span>
            <Button
              variant="link"
              onClick={handleResendOTP}
              disabled={!canResend || isLoading}
              className="resend-link p-0"
            >
              Resend Code
            </Button>
          </div>
        </div>
      </Form>

      <style jsx>{`
        .otp-verification-container {
          max-width: 400px;
          margin: 0 auto;
          padding: 2rem;
        }

        .otp-icon {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 80px;
          height: 80px;
          background: rgba(244, 143, 177, 0.1);
          border-radius: 50%;
          margin: 0 auto;
        }

        .otp-title {
          color: #23395d;
          font-weight: 700;
          margin-bottom: 0.5rem;
        }

        .otp-subtitle {
          color: #666;
          margin-bottom: 1rem;
        }

        .email-display {
          background: rgba(244, 143, 177, 0.1);
          padding: 0.75rem 1rem;
          border-radius: 10px;
          color: #23395d;
          display: inline-flex;
          align-items: center;
        }

        .otp-input-container {
          display: flex;
          justify-content: center;
          gap: 0.5rem;
        }

        .otp-input {
          width: 50px !important;
          height: 50px !important;
          text-align: center !important;
          font-size: 1.5rem !important;
          font-weight: bold !important;
          border: 2px solid rgba(244, 143, 177, 0.3) !important;
          border-radius: 10px !important;
          background: rgba(255, 255, 255, 0.9) !important;
        }

        .otp-input:focus {
          border-color: #f48fb1 !important;
          box-shadow: 0 0 0 0.2rem rgba(244, 143, 177, 0.25) !important;
        }

        .btn-otp-verify {
          background: linear-gradient(45deg, #f48fb1, #ce93d8) !important;
          border: none !important;
          color: white !important;
          padding: 12px 40px !important;
          font-weight: 600 !important;
          border-radius: 50px !important;
          box-shadow: 0 4px 15px rgba(244, 143, 177, 0.3) !important;
          transition: all 0.3s ease !important;
          width: 100%;
        }

        .btn-otp-verify:hover:not(:disabled) {
          transform: translateY(-2px) !important;
          box-shadow: 0 6px 20px rgba(244, 143, 177, 0.4) !important;
        }

        .btn-otp-verify:disabled {
          opacity: 0.6 !important;
          transform: none !important;
        }

        .timer-container {
          color: #666;
          font-size: 0.9rem;
        }

        .resend-link {
          color: #f48fb1 !important;
          font-weight: 600 !important;
          text-decoration: none !important;
        }

        .resend-link:hover:not(:disabled) {
          color: #ce93d8 !important;
          text-decoration: underline !important;
        }

        .resend-link:disabled {
          color: #ccc !important;
          cursor: not-allowed !important;
        }

        @media (max-width: 576px) {
          .otp-verification-container {
            padding: 1rem;
          }
          
          .otp-input {
            width: 40px !important;
            height: 40px !important;
            font-size: 1.2rem !important;
          }
          
          .otp-input-container {
            gap: 0.25rem;
          }
        }
      `}</style>
    </div>
  );
}

export default OTPVerification;