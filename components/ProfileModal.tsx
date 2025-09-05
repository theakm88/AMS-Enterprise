import React, { useState, useRef } from 'react';
import type { User } from '../types';
import { UploadIcon, AmsLogo } from './icons/Icons';

interface ProfileModalProps {
    user: User;
    onClose: () => void;
    onSave: (user: User) => void;
}

const ProfileModal: React.FC<ProfileModalProps> = ({ user, onClose, onSave }) => {
    const [formData, setFormData] = useState<User>(user);
    const logoInputRef = useRef<HTMLInputElement>(null);
    const photoInputRef = useRef<HTMLInputElement>(null);

    const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, fileType: 'logo' | 'photo') => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const result = reader.result as string;
                if (fileType === 'logo') {
                    setFormData(prev => ({ ...prev, companyLogoUrl: result }));
                } else {
                    setFormData(prev => ({ ...prev, profilePictureUrl: result }));
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center p-4 animate-fade-in">
            <div className="bg-surface rounded-lg shadow-2xl w-full max-w-lg animate-slide-up">
                <div className="p-6 border-b border-border">
                    <h2 className="text-xl font-bold text-text-primary">Edit Profile</h2>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="p-6 space-y-6">
                        {/* Image Uploads */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
                            <div className="flex flex-col items-center space-y-2">
                                <label className="text-sm font-medium text-text-secondary">Company Logo</label>
                                <div className="h-24 w-24 rounded-lg bg-surface-hover flex items-center justify-center overflow-hidden border border-border">
                                    {formData.companyLogoUrl ? <img src={formData.companyLogoUrl} alt="Company Logo" className="h-full w-full object-contain" /> : <AmsLogo className="h-12 w-12 text-text-secondary" />}
                                </div>
                                <input type="file" accept="image/*" ref={logoInputRef} onChange={(e) => handleFileChange(e, 'logo')} className="hidden" />
                                <button type="button" onClick={() => logoInputRef.current?.click()} className="text-sm text-primary hover:underline">Change Logo</button>
                            </div>
                             <div className="flex flex-col items-center space-y-2">
                                <label className="text-sm font-medium text-text-secondary">Your Photo</label>
                                <img src={formData.profilePictureUrl} alt="Profile" className="h-24 w-24 rounded-full object-cover border-2 border-border" />
                                <input type="file" accept="image/*" ref={photoInputRef} onChange={(e) => handleFileChange(e, 'photo')} className="hidden" />
                                <button type="button" onClick={() => photoInputRef.current?.click()} className="text-sm text-primary hover:underline">Change Photo</button>
                            </div>
                        </div>

                        {/* Text Inputs */}
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-text-secondary">Full Name</label>
                            <input type="text" name="name" id="name" value={formData.name} onChange={handleTextChange} className="mt-1 block w-full rounded-md border-border bg-background text-text-primary shadow-sm focus:border-primary focus:ring-primary sm:text-sm" required />
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-text-secondary">Email Address</label>
                            <input type="email" name="email" id="email" value={formData.email} onChange={handleTextChange} className="mt-1 block w-full rounded-md border-border bg-background text-text-primary shadow-sm focus:border-primary focus:ring-primary sm:text-sm" required />
                        </div>
                        <div>
                            <label htmlFor="role" className="block text-sm font-medium text-text-secondary">Role</label>
                            <input type="text" name="role" id="role" value={formData.role} className="mt-1 block w-full rounded-md border-border bg-surface-hover text-text-secondary shadow-sm sm:text-sm" readOnly />
                        </div>
                    </div>
                    <div className="flex justify-end space-x-3 p-6 bg-background rounded-b-lg">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-text-secondary bg-surface hover:bg-surface-hover border border-border rounded-md">Cancel</button>
                        <button type="submit" className="px-4 py-2 text-sm font-medium text-text-on-primary bg-primary rounded-md hover:bg-primary-focus focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">Save Changes</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProfileModal;
