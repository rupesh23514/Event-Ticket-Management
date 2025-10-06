import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../hooks/useToast';
import { useForm } from 'react-hook-form';
import { Loader2, Camera } from 'lucide-react';
import axios from 'axios';

const ProfilePage = () => {
  const { user, updateProfile } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [profileImage, setProfileImage] = useState(user?.profileImage || '');
  const [imageFile, setImageFile] = useState(null);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  
  const { register, handleSubmit, formState: { errors }, reset, watch } = useForm({
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      phoneNumber: user?.phoneNumber || '',
    }
  });

  const { 
    register: registerPassword, 
    handleSubmit: handleSubmitPassword, 
    formState: { errors: passwordErrors }, 
    reset: resetPassword,
    watch: watchPassword,
  } = useForm();
  
  const password = watchPassword('password');

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setProfileImage(URL.createObjectURL(file));
    }
  };

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      
      let updatedProfileImage = user?.profileImage;
      
      // Upload image if changed
      if (imageFile) {
        const formData = new FormData();
        formData.append('file', imageFile);
        
        const uploadResponse = await axios.post('/api/users/upload-image', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        
        updatedProfileImage = uploadResponse.data.url;
      }
      
      // Update profile
      await updateProfile({
        name: data.name,
        phoneNumber: data.phoneNumber,
        profileImage: updatedProfileImage,
      });
      
      toast({
        title: "Success",
        description: "Your profile has been updated",
      });
    } catch (error) {
      console.error('Profile update error:', error);
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to update profile",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const onPasswordSubmit = async (data) => {
    try {
      setIsLoading(true);
      
      await axios.put('/api/users/change-password', {
        currentPassword: data.currentPassword,
        newPassword: data.password,
      });
      
      toast({
        title: "Success",
        description: "Your password has been updated",
      });
      
      resetPassword();
      setShowPasswordForm(false);
    } catch (error) {
      console.error('Password update error:', error);
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to update password",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Your Profile</h1>
      
      <div className="space-y-8">
        {/* Profile Information */}
        <div className="bg-card p-6 rounded-lg border">
          <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
            <div className="flex flex-col items-center gap-2">
              <div className="relative group">
                <div className="h-32 w-32 rounded-full overflow-hidden border-2 border-primary">
                  {profileImage ? (
                    <img 
                      src={profileImage} 
                      alt={user?.name} 
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="h-full w-full bg-secondary flex items-center justify-center">
                      <span className="text-4xl font-bold">
                        {user?.name?.charAt(0).toUpperCase() || 'U'}
                      </span>
                    </div>
                  )}
                </div>
                <label 
                  htmlFor="profileImage" 
                  className="absolute bottom-0 right-0 bg-primary text-white p-2 rounded-full cursor-pointer"
                >
                  <Camera size={16} />
                  <input 
                    id="profileImage" 
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    onChange={handleImageChange}
                  />
                </label>
              </div>
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Role: {user?.role}</p>
                {user?.isEmailVerified ? (
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                    Verified
                  </span>
                ) : (
                  <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                    Not Verified
                  </span>
                )}
              </div>
            </div>
            
            <form onSubmit={handleSubmit(onSubmit)} className="flex-1 space-y-4 w-full">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-1">
                    Full Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-primary"
                    {...register('name', { 
                      required: 'Name is required',
                      minLength: { 
                        value: 2, 
                        message: 'Name must be at least 2 characters' 
                      } 
                    })}
                  />
                  {errors.name && (
                    <p className="text-destructive text-xs mt-1">{errors.name.message}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-1">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    className="w-full p-2 border rounded bg-muted"
                    disabled
                    {...register('email')}
                  />
                  <p className="text-xs text-muted-foreground mt-1">Email cannot be changed</p>
                </div>
              </div>
              
              <div>
                <label htmlFor="phoneNumber" className="block text-sm font-medium mb-1">
                  Phone Number
                </label>
                <input
                  id="phoneNumber"
                  type="tel"
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-primary"
                  {...register('phoneNumber', {
                    pattern: {
                      value: /^[0-9+\-() ]+$/,
                      message: 'Invalid phone number format'
                    }
                  })}
                />
                {errors.phoneNumber && (
                  <p className="text-destructive text-xs mt-1">{errors.phoneNumber.message}</p>
                )}
              </div>
              
              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90 flex items-center"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="animate-spin mr-2 h-4 w-4" />
                      Saving...
                    </>
                  ) : (
                    'Save Changes'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
        
        {/* Password Section */}
        <div className="bg-card p-6 rounded-lg border">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Password</h2>
            <button
              type="button"
              onClick={() => setShowPasswordForm(!showPasswordForm)}
              className="text-primary hover:underline"
            >
              {showPasswordForm ? 'Cancel' : 'Change Password'}
            </button>
          </div>
          
          {showPasswordForm ? (
            <form onSubmit={handleSubmitPassword(onPasswordSubmit)} className="space-y-4">
              <div>
                <label htmlFor="currentPassword" className="block text-sm font-medium mb-1">
                  Current Password
                </label>
                <input
                  id="currentPassword"
                  type="password"
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-primary"
                  {...registerPassword('currentPassword', { 
                    required: 'Current password is required' 
                  })}
                />
                {passwordErrors.currentPassword && (
                  <p className="text-destructive text-xs mt-1">{passwordErrors.currentPassword.message}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="password" className="block text-sm font-medium mb-1">
                  New Password
                </label>
                <input
                  id="password"
                  type="password"
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-primary"
                  {...registerPassword('password', { 
                    required: 'Password is required',
                    minLength: {
                      value: 8,
                      message: 'Password must be at least 8 characters'
                    }
                  })}
                />
                {passwordErrors.password && (
                  <p className="text-destructive text-xs mt-1">{passwordErrors.password.message}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium mb-1">
                  Confirm New Password
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-primary"
                  {...registerPassword('confirmPassword', { 
                    required: 'Please confirm your password',
                    validate: value => value === password || 'Passwords do not match'
                  })}
                />
                {passwordErrors.confirmPassword && (
                  <p className="text-destructive text-xs mt-1">{passwordErrors.confirmPassword.message}</p>
                )}
              </div>
              
              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90 flex items-center"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="animate-spin mr-2 h-4 w-4" />
                      Updating...
                    </>
                  ) : (
                    'Update Password'
                  )}
                </button>
              </div>
            </form>
          ) : (
            <p className="text-muted-foreground">
              For your security, we recommend changing your password regularly.
            </p>
          )}
        </div>
        
        {/* Account Information */}
        <div className="bg-card p-6 rounded-lg border">
          <h2 className="text-xl font-semibold mb-4">Account Information</h2>
          
          <div className="space-y-2 text-sm">
            <div className="flex justify-between py-2 border-b">
              <span className="text-muted-foreground">Account Created</span>
              <span>{new Date(user?.createdAt).toLocaleDateString()}</span>
            </div>
            
            <div className="flex justify-between py-2 border-b">
              <span className="text-muted-foreground">Authentication Method</span>
              <span className="capitalize">{user?.authProvider || 'Email'}</span>
            </div>
            
            <div className="flex justify-between py-2">
              <span className="text-muted-foreground">User ID</span>
              <span className="text-xs text-muted-foreground">{user?._id}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;