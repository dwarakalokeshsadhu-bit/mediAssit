import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { PatientProfile } from '../models/PatientProfile.js';
import { DoctorProfile } from '../models/DoctorProfile.js';
import { Department } from '../models/Department.js';
import { logAudit } from '../services/auditService.js';
import { sendPasswordResetCode } from '../services/emailService.js';

const generateToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET || 'medassist_super_secret_jwt_key_2026_capstone_secure',
    {
      expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    }
  );
};

// @desc    Register a new patient or user
// @route   POST /api/auth/register
export const register = async (req, res, next) => {
  try {
    const {
      name,
      email,
      password,
      role = 'patient',
      phone,
      dateOfBirth,
      gender,
      bloodGroup,
      address,
      emergencyContact,
      allergies,
      chronicConditions,
      specialization,
      departmentId,
      consultationFee,
      roomNumber,
    } = req.body;

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'A user with this email address already exists.',
      });
    }

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password,
      role,
      phone: phone || '',
    });

    let profile = null;

    if (role === 'patient') {
      const patientCount = await PatientProfile.countDocuments();
      const mrn = `MRN-${new Date().getFullYear()}-${String(patientCount + 1).padStart(4, '0')}`;

      profile = await PatientProfile.create({
        user: user._id,
        mrn,
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : undefined,
        gender: gender || 'male',
        bloodGroup: bloodGroup || 'Unknown',
        address: address || {},
        emergencyContact: emergencyContact || {},
        allergies: allergies || [],
        chronicConditions: chronicConditions || [],
      });
    } else if (role === 'doctor') {
      let dept = departmentId;
      if (!dept) {
        const defaultDept = await Department.findOne();
        dept = defaultDept?._id;
      }

      profile = await DoctorProfile.create({
        user: user._id,
        department: dept,
        specialization: specialization || 'General Medicine',
        consultationFee: consultationFee || 500,
        roomNumber: roomNumber || 'Room 101',
      });
    }

    const token = generateToken(user._id);

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    await logAudit({
      actor: user,
      action: 'USER_REGISTERED',
      resource: 'User',
      resourceId: user._id,
      details: { email: user.email, role: user.role },
    });

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        avatar: user.avatar,
      },
      profile,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    User Login
// @route   POST /api/auth/login
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password.',
      });
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Your account has been deactivated. Please consult your administrator.',
      });
    }

    user.lastLogin = new Date();
    await user.save();

    let profile = null;
    if (user.role === 'patient') {
      profile = await PatientProfile.findOne({ user: user._id });
    } else if (user.role === 'doctor') {
      profile = await DoctorProfile.findOne({ user: user._id }).populate('department');
    }

    const token = generateToken(user._id);

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    await logAudit({
      actor: user,
      action: 'USER_LOGIN',
      resource: 'User',
      resourceId: user._id,
      details: { email: user.email, role: user.role },
    });

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        avatar: user.avatar,
      },
      profile,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get Current Logged in User Profile
// @route   GET /api/auth/me
export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    let profile = null;

    if (user.role === 'patient') {
      profile = await PatientProfile.findOne({ user: user._id });
    } else if (user.role === 'doctor') {
      profile = await DoctorProfile.findOne({ user: user._id }).populate('department');
    }

    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        avatar: user.avatar,
      },
      profile,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Logout user / clear cookie
// @route   POST /api/auth/logout
export const logout = async (req, res) => {
  res.cookie('token', '', {
    httpOnly: true,
    expires: new Date(0),
  });

  if (req.user) {
    await logAudit({
      actor: req.user,
      action: 'USER_LOGOUT',
      resource: 'User',
      resourceId: req.user._id,
    });
  }

  res.json({
    success: true,
    message: 'Logged out successfully',
  });
};

// @desc    Request Password Reset Verification Code
// @route   POST /api/auth/forgot-password
export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Please provide your registered email address.',
      });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'No registered user found with this email address.',
      });
    }

    // Generate random 6-digit verification code
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

    // Set code and expiration (15 minutes)
    user.resetPasswordCode = verificationCode;
    user.resetPasswordExpires = new Date(Date.now() + 15 * 60 * 1000);
    await user.save();

    // Dispatch email
    const emailResult = await sendPasswordResetCode(user.email, verificationCode, user.name);

    await logAudit({
      actor: user,
      action: 'PASSWORD_RESET_REQUESTED',
      resource: 'User',
      resourceId: user._id,
      details: { email: user.email, emailSent: emailResult.sent },
    });

    res.json({
      success: true,
      message: emailResult.sent
        ? 'A 6-digit verification code has been dispatched to your email address.'
        : 'A 6-digit verification code has been generated.',
      email: user.email,
      emailSent: emailResult.sent,
      previewCode: !emailResult.sent ? verificationCode : undefined,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Verify Password Reset Verification Code
// @route   POST /api/auth/verify-reset-code
export const verifyResetCode = async (req, res, next) => {
  try {
    const { email, code } = req.body;

    if (!email || !code) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both your email and the 6-digit verification code.',
      });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() }).select(
      '+resetPasswordCode +resetPasswordExpires'
    );

    if (!user || !user.resetPasswordCode || user.resetPasswordCode !== code.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Invalid verification code. Please check and try again.',
      });
    }

    if (user.resetPasswordExpires < new Date()) {
      return res.status(400).json({
        success: false,
        message: 'The verification code has expired. Please request a new code.',
      });
    }

    res.json({
      success: true,
      message: 'Verification code confirmed. You can now choose a new password.',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Reset Password using Verification Code
// @route   POST /api/auth/reset-password
export const resetPassword = async (req, res, next) => {
  try {
    const { email, code, newPassword } = req.body;

    if (!email || !code || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Please provide your email, verification code, and new password.',
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 6 characters long.',
      });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() }).select(
      '+password +resetPasswordCode +resetPasswordExpires'
    );

    if (!user || !user.resetPasswordCode || user.resetPasswordCode !== code.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Invalid verification code. Please request a new code.',
      });
    }

    if (user.resetPasswordExpires < new Date()) {
      return res.status(400).json({
        success: false,
        message: 'The verification code has expired. Please request a new code.',
      });
    }

    // Update password (pre-save hook will hash it with bcrypt)
    user.password = newPassword;
    user.resetPasswordCode = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    await logAudit({
      actor: user,
      action: 'PASSWORD_RESET_COMPLETED',
      resource: 'User',
      resourceId: user._id,
      details: { email: user.email },
    });

    res.json({
      success: true,
      message: 'Your password has been successfully reset. You may now log in.',
    });
  } catch (error) {
    next(error);
  }
};
