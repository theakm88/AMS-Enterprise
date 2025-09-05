import React from 'react';

const Reports = () => {
    return (
        <div className="bg-surface rounded-xl shadow-lg p-6 sm:p-8 text-center">
            <h2 className="text-2xl font-bold text-text-primary mb-4">End-of-Day Reports</h2>
            <p className="text-text-secondary mb-6">Generate and export daily, weekly, or monthly collection reports.</p>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
                <button className="w-full sm:w-auto px-5 py-2.5 text-sm font-medium text-text-on-primary bg-primary rounded-md hover:bg-primary-focus">
                    Generate Today's Report
                </button>
                 <button className="w-full sm:w-auto px-5 py-2.5 text-sm font-medium text-text-secondary bg-surface-hover rounded-md hover:bg-border">
                    Export to PDF
                </button>
            </div>
            <p className="text-xs text-text-secondary/60 mt-8">Report generation and export functionality will be available in a future update.</p>
        </div>
    );
};

export default Reports;