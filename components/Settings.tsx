import React from 'react';
import { useOutletContext } from 'react-router-dom';

interface SettingsContext {
  openProfileModal: () => void;
}

const Settings = () => {
    const { openProfileModal } = useOutletContext<SettingsContext>();

    return (
        <div className="bg-surface rounded-xl shadow-lg p-6 sm:p-8">
            <h2 className="text-2xl font-bold text-text-primary mb-4">Settings</h2>
            <p className="text-text-secondary mb-6">Manage your profile, notification preferences, and other application settings.</p>
            <div className="mt-6 border-t border-border pt-6">
                <h3 className="text-lg font-semibold text-text-primary">Profile Information</h3>
                <p className="text-text-secondary mt-2 mb-4">Update your photo, name, and company logo.</p>
                <button 
                    onClick={openProfileModal}
                    className="px-4 py-2 text-sm font-medium text-text-on-primary bg-primary rounded-md hover:bg-primary-focus"
                >
                    Edit Profile
                </button>
            </div>
             <p className="text-xs text-text-secondary/60 mt-8">More settings for notifications and data management will be available in future updates.</p>
        </div>
    );
};

export default Settings;