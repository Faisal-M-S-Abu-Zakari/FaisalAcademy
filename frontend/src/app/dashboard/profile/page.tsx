'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Card } from '../../../components/ui/Card';
import api from '../../../lib/api';

export default function ProfilePage() {
  const { user, login } = useAuth();
  
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [photoFile, setPhotoFile] = useState<File | null>(null);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setBio(user.bio || '');
      setPhotoUrl(user.photoUrl || '');
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMsg('');
    setErrorMsg('');
    setLoading(true);

    try {
      let finalPhotoUrl = photoUrl;

      // If they selected a new file, upload it first
      if (photoFile) {
        const formData = new FormData();
        formData.append('image', photoFile);

        // Make sure api wrapper uses correct config for multipart
        const uploadRes = await api.post('/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });

        if (uploadRes.data.success) {
          // The API returns the public URL inside .data.url e.g. /uploads/image.png
          // It's technically relative to the backend. Since the frontend connects to /api via proxy or direct cors,
          // Let's assume absolute backend URI.
          finalPhotoUrl = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}${uploadRes.data.data.url}`;
        }
      }

      const res = await api.put('/auth/me', {
        name,
        bio,
        photoUrl: finalPhotoUrl
      });

      if (res.data.success) {
        setSuccessMsg('Profile updated successfully!');
        const currentToken = localStorage.getItem('token');
        if (currentToken) {
          window.location.reload(); 
        }
      }
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  if (!user) return <div className="text-center py-20">Loading...</div>;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">My Profile</h1>
      
      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {successMsg && <div className="bg-green-50 p-4 rounded text-green-700">{successMsg}</div>}
          {errorMsg && <div className="bg-red-50 p-4 rounded text-red-700">{errorMsg}</div>}
          
          <div className="flex items-center space-x-6 mb-6">
            <div className="shrink-0">
              <img 
                className="h-24 w-24 object-cover rounded-full border-2 border-indigo-100" 
                src={photoFile ? URL.createObjectURL(photoFile) : (photoUrl || 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png')} 
                alt="Profile photo" 
              />
            </div>
            <div className="w-full">
              <label className="block text-sm font-medium text-gray-700 mb-1">Upload Photo</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files && e.target.files.length > 0) {
                    setPhotoFile(e.target.files[0]);
                  }
                }}
                className="block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-md file:border-0
                  file:text-sm file:font-semibold
                  file:bg-indigo-50 file:text-indigo-700
                  hover:file:bg-indigo-100 cursor-pointer"
              />
              <p className="text-sm text-gray-500 mt-1">Select a new profile image (max 5MB).</p>
            </div>
          </div>
          
          <Input
            label="Name"
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Bio
            </label>
            <textarea
              className="w-full rounded-md border border-gray-300 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 min-h-[100px]"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell us a little about yourself"
              maxLength={500}
            />
          </div>

          <div className="pt-4 border-t border-gray-100">
            <Button type="submit" disabled={loading} className="w-full sm:w-auto">
              {loading ? 'Saving...' : 'Save Profile'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
