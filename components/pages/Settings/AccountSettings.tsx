import React, { useState } from 'react';
import { UserIcon, PlusIcon } from '../../common/icons';

const accountsData = [
    { id: '1', name: 'DukeofRealms', uuid: '8d3b4e2a-1b9c-4f7d-8a6e-3c5d7f9a1b2c' },
    { id: '2', name: 'GuestUser123', uuid: 'f4a7b8e1-5c6d-4e8f-9a1b-2c3d4e5f6a7b' },
];

const AccountSettings: React.FC = () => {
    const [activeAccountId, setActiveAccountId] = useState(accountsData[0].id);

    return (
        <div>
            <div className="flex justify-between items-center mb-6 pb-2 border-b-2 border-white/10">
                <h2 className="font-display text-xl font-bold uppercase tracking-wider text-white">
                    Accounts
                </h2>
                <div className="flex items-center gap-2">
                    <button className="px-4 py-2 rounded-md bg-slate-700 hover:bg-slate-600 transition-colors text-sm font-semibold uppercase tracking-wider">
                        Log Out
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 rounded-md bg-starmade-accent hover:bg-starmade-accent-hover transition-colors text-sm font-bold uppercase tracking-wider">
                        <PlusIcon className="w-5 h-5" />
                        Add Account
                    </button>
                </div>
            </div>
            
            <div className="space-y-3">
                {accountsData.map(account => {
                    const isActive = account.id === activeAccountId;

                    if (isActive) {
                        return (
                            <div key={account.id} className="flex items-center gap-4 p-4 rounded-lg bg-starmade-accent/20 border border-starmade-accent/80">
                                <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center border border-slate-600">
                                    <UserIcon className="w-8 h-8 text-slate-300" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-lg font-bold text-white">{account.name}</h3>
                                    <p className="text-sm text-gray-400">UUID: {account.uuid}</p>
                                </div>
                                <div>
                                    <span className="px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full bg-green-500/30 text-green-300">
                                        Active
                                    </span>
                                </div>
                            </div>
                        );
                    }

                    return (
                        <button
                            key={account.id}
                            onClick={() => setActiveAccountId(account.id)}
                            className="w-full flex items-center gap-4 p-4 rounded-lg bg-black/20 border border-white/10 text-left transition-colors hover:bg-white/5 hover:border-white/20"
                        >
                            <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center border border-slate-700">
                                <UserIcon className="w-8 h-8 text-slate-400" />
                            </div>
                            <div className="flex-1">
                                <h3 className="text-lg font-semibold text-gray-300">{account.name}</h3>
                                <p className="text-sm text-gray-500">UUID: {account.uuid}</p>
                            </div>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default AccountSettings;