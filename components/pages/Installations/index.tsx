import React, { useState, useEffect } from 'react';
import { PlusIcon, CloseIcon } from '../../common/icons';
import InstallationForm from '../../common/InstallationForm';
import ItemCard from '../../common/ItemCard';
import type { ManagedItem } from '../../../types';
import type { Page, PageProps } from '../../../types';
import PageContainer from '../../common/PageContainer';

const initialInstallations: ManagedItem[] = [
  {
    id: '1',
    name: 'Latest Release',
    version: '0.203.175',
    type: 'latest',
    icon: 'latest',
    path: 'C:\\Games\\StarMade\\Instances\\latest-release',
    lastPlayed: '2 hours ago',
  },
  {
    id: '2',
    name: 'Dev Build',
    version: '24w14a',
    type: 'dev',
    icon: 'dev',
    path: 'C:\\Games\\StarMade\\Instances\\dev-build',
    lastPlayed: '3 days ago',
  },
  {
    id: '3',
    name: 'Legacy Version',
    version: '1.0',
    type: 'archive',
    icon: 'archive',
    path: 'C:\\Games\\StarMade\\Instances\\archive-1.0',
    lastPlayed: 'Over a year ago',
  },
];

const defaultInstallation: ManagedItem = {
  id: '',
  name: 'New Installation',
  version: '0.203.175',
  type: 'release',
  icon: 'release',
  path: 'C:\\Games\\StarMade\\Instances\\new-installation',
  lastPlayed: 'Never',
};

const initialServers: ManagedItem[] = [
  {
    id: 's1',
    name: 'Official EU Server',
    version: '0.203.175',
    type: 'latest',
    icon: 'server',
    path: 'C:\\Games\\StarMade\\Servers\\official-eu',
    lastPlayed: 'Online',
    port: '4242',
  },
  {
    id: 's2',
    name: 'Creative Build World',
    version: '24w14a',
    type: 'dev',
    icon: 'cube',
    path: 'C:\\Games\\StarMade\\Servers\\creative-build',
    lastPlayed: '5 minutes ago',
    port: '27015',
  },
  {
    id: 's3',
    name: 'Legacy PvP Arena',
    version: '1.0',
    type: 'archive',
    icon: 'bolt',
    path: 'C:\\Games\\StarMade\\Servers\\pvp-legacy',
    lastPlayed: 'Offline',
    port: '4243',
  },
];

const defaultServer: ManagedItem = {
  id: '',
  name: 'New Server',
  version: '0.203.175',
  type: 'release',
  icon: 'server',
  path: 'C:\\Games\\StarMade\\Servers\\new-server',
  lastPlayed: 'Never',
  port: '4242',
};

interface InstallationsProps {
  initialTab?: 'installations' | 'servers';
  onNavigate: (page: Page, props?: PageProps) => void;
}

const Installations: React.FC<InstallationsProps> = ({ initialTab, onNavigate }) => {
    const [activeTab, setActiveTab] = useState<'installations' | 'servers'>(initialTab || 'installations');
    
    const [view, setView] = useState<'list' | 'form'>('list');
    const [activeItem, setActiveItem] = useState<ManagedItem | null>(null);
    const [isNew, setIsNew] = useState(false);

    const [installations, setInstallations] = useState<ManagedItem[]>(initialInstallations);
    const [servers, setServers] = useState<ManagedItem[]>(initialServers);

    useEffect(() => {
        if (initialTab && initialTab !== activeTab) {
            setActiveTab(initialTab);
            setView('list');
            setActiveItem(null);
        }
    }, [initialTab]);

    const { items, setItems, defaultItem, itemTypeName, cardActionButtonText, cardStatusLabel } = activeTab === 'installations' 
    ? { 
        items: installations, 
        setItems: setInstallations, 
        defaultItem: defaultInstallation, 
        itemTypeName: 'Installation', 
        cardActionButtonText: 'Play', 
        cardStatusLabel: 'Last played' 
      }
    : { 
        items: servers, 
        setItems: setServers, 
        defaultItem: defaultServer, 
        itemTypeName: 'Server', 
        cardActionButtonText: 'Start', 
        cardStatusLabel: 'Status' 
      };
    
    const handleEdit = (item: ManagedItem) => {
        setActiveItem(item);
        setIsNew(false);
        setView('form');
    };

    const handleCreateNew = () => {
        setActiveItem({ ...defaultItem, id: Date.now().toString() });
        setIsNew(true);
        setView('form');
    };

    const handleSave = (savedData: ManagedItem) => {
        if (isNew) {
            setItems(prev => [savedData, ...prev]);
        } else {
            setItems(prev => prev.map(inst => inst.id === savedData.id ? savedData : inst));
        }
        setView('list');
        setActiveItem(null);
    };

    const handleCancel = () => {
        setView('list');
        setActiveItem(null);
    };
    
    const handleTabChange = (tab: 'installations' | 'servers') => {
        if (tab !== activeTab) {
            setActiveTab(tab);
            setView('list');
            setActiveItem(null);
        }
    }
    
    const TabButton: React.FC<{ isActive: boolean; onClick: () => void; children: React.ReactNode }> = ({ isActive, onClick, children }) => (
        <button
            onClick={onClick}
            className={`
                font-display text-2xl font-bold uppercase tracking-wider transition-colors duration-200 relative pb-2 px-1
                ${isActive ? 'text-white' : 'text-gray-500 hover:text-gray-300'}
            `}
        >
            {children}
            {isActive && (
                <div className="absolute bottom-0 left-0 w-full h-1 bg-starmade-accent rounded-full shadow-[0_0_8px_0px_#227b86]"></div>
            )}
        </button>
    );

    const renderContent = () => {
        if (view === 'form' && activeItem) {
            return (
                <InstallationForm
                    key={activeItem.id}
                    item={activeItem}
                    isNew={isNew}
                    onSave={handleSave}
                    onCancel={handleCancel}
                    itemTypeName={itemTypeName}
                />
            );
        }

        return (
            <div className="h-full flex flex-col">
                <div className="flex justify-between items-center mb-6 flex-shrink-0 pr-4">
                    <div className="flex items-center gap-6">
                        <TabButton isActive={activeTab === 'installations'} onClick={() => handleTabChange('installations')}>
                            Installations
                        </TabButton>
                        <TabButton isActive={activeTab === 'servers'} onClick={() => handleTabChange('servers')}>
                            Servers
                        </TabButton>
                    </div>
                    <button
                        onClick={handleCreateNew}
                        className="
                        flex items-center gap-2 px-4 py-2 rounded-md border border-white/20
                        text-white font-semibold uppercase tracking-wider text-sm
                        hover:bg-white/10 hover:border-white/30 transition-colors
                    ">
                        <PlusIcon className="w-5 h-5" />
                        <span>New {itemTypeName}</span>
                    </button>
                </div>
                <div className="flex-grow space-y-4 overflow-y-auto pr-4">
                    {items.map((item, index) => (
                        <ItemCard 
                            key={item.id} 
                            item={item} 
                            isFeatured={index === 0} 
                            onEdit={handleEdit}
                            actionButtonText={cardActionButtonText}
                            statusLabel={cardStatusLabel}
                        />
                    ))}
                </div>
            </div>
        );
    }
    
    return (
      <PageContainer onClose={() => onNavigate('Play')}>
        {renderContent()}
      </PageContainer>
    );
};

export default Installations;