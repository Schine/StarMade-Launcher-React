import React, { useState, useEffect } from 'react';
import CustomDropdown from '../../common/CustomDropdown';
import { FolderIcon, MonitorIcon } from '../../common/icons';

// Component for a consistent setting row layout
const SettingRow: React.FC<{ title: string; description: string; children: React.ReactNode }> = ({ title, description, children }) => (
    <div className="flex justify-between items-center bg-black/20 p-4 rounded-lg border border-white/10">
        <div>
            <h3 className="font-semibold text-white">{title}</h3>
            <p className="text-sm text-gray-400 max-w-sm">{description}</p>
        </div>
        <div className="min-w-[300px] flex justify-end">
            {children}
        </div>
    </div>
);


const MIN_MEMORY = 2048; // 2GB
const MAX_MEMORY = 16384; // 16GB
const STEP = 1024; // 1GB
const resolutions = ["1280x720", "1920x1080", "2560x1440", "3840x2160"];
const resolutionOptions = resolutions.map(res => ({ value: res, label: res }));

// Form component for settings
const DefaultSettingsForm: React.FC<{ isServer: boolean }> = ({ isServer }) => {
    const [gameDir, setGameDir] = useState(isServer ? 'C:\\Games\\StarMade\\Servers\\default' : 'C:\\Games\\StarMade\\Instances\\default');
    const [resolution, setResolution] = useState('1920x1080');
    const [port, setPort] = useState('4242');
    const [javaMemory, setJavaMemory] = useState(4096);
    const [javaPath, setJavaPath] = useState('C:\\Program Files\\Java\\jdk-17\\bin\\javaw.exe');
    const [jvmArgs, setJvmArgs] = useState('-Xms4G -Xmx4G');

    // Sync JVM args with memory slider
    useEffect(() => {
        const memoryInGB = javaMemory / 1024;
        setJvmArgs(prevArgs => {
            const otherArgs = prevArgs.split(' ').filter(arg => !arg.startsWith('-Xm')).join(' ');
            return `-Xms${memoryInGB}G -Xmx${memoryInGB}G ${otherArgs}`.trim();
        });
    }, [javaMemory]);

    // Sync memory slider with JVM args
    useEffect(() => {
        const xmxMatch = jvmArgs.match(/-Xmx(\d+)G/i);
        if (xmxMatch && xmxMatch[1]) {
            const memoryInGB = parseInt(xmxMatch[1]);
            const memoryInMB = memoryInGB * 1024;
            if (memoryInMB >= MIN_MEMORY && memoryInMB <= MAX_MEMORY) {
                setJavaMemory(memoryInMB);
            }
        }
    }, [jvmArgs]);

    const handleMemoryChange = (value: number) => {
        const clampedValue = Math.max(MIN_MEMORY, Math.min(MAX_MEMORY, value));
        const snappedValue = Math.round(clampedValue / STEP) * STEP;
        setJavaMemory(snappedValue);
    };

    const getMemoryMarkers = () => {
        const markers = [];
        const interval = MAX_MEMORY <= 16384 ? 2048 : 4096;
        for (let i = MIN_MEMORY; i <= MAX_MEMORY; i += interval) {
            markers.push(i);
        }
        return markers;
    };
    const memoryPercentage = ((javaMemory - MIN_MEMORY) / (MAX_MEMORY - MIN_MEMORY)) * 100;
    const markers = getMemoryMarkers();

    return (
        <div className="space-y-4">
            <SettingRow title="Game Directory" description="The default folder where new installations will be created.">
                <div className="flex w-full">
                  <input type="text" value={gameDir} onChange={e => setGameDir(e.target.value)} className="flex-1 bg-slate-900/80 border border-slate-700 rounded-l-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-starmade-accent" />
                  <button className="bg-slate-800/80 border-t border-b border-r border-slate-700 px-4 rounded-r-md hover:bg-slate-700/80"><FolderIcon className="w-5 h-5 text-gray-400" /></button>
                </div>
            </SettingRow>

            {!isServer && (
                <SettingRow title="Resolution" description="The default screen resolution for new installations.">
                    <CustomDropdown
                        className="w-full"
                        options={resolutionOptions}
                        value={resolution}
                        onChange={setResolution}
                        icon={<MonitorIcon className="w-5 h-5 text-gray-400" />}
                    />
                </SettingRow>
            )}

            {isServer && (
                 <SettingRow title="Port" description="The default network port for new servers.">
                    <input type="text" value={port} onChange={e => setPort(e.target.value)} className="w-full bg-slate-900/80 border border-slate-700 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-starmade-accent" />
                </SettingRow>
            )}

            <SettingRow title="Java Memory Allocation" description="Set the default RAM allocated to new instances.">
                <div className="flex items-center gap-4 w-full">
                    <div className="flex-1 px-3">
                        <div className="relative">
                            <div className="h-2 bg-slate-800/80 rounded-full border border-slate-700 overflow-hidden">
                                <div className="h-full bg-gradient-to-r from-starmade-accent/60 to-starmade-accent transition-all duration-150" style={{ width: `${memoryPercentage}%` }} />
                            </div>
                            <input type="range" min={MIN_MEMORY} max={MAX_MEMORY} step={STEP} value={javaMemory} onChange={(e) => handleMemoryChange(parseInt(e.target.value))} className="absolute top-0 w-full h-2 opacity-0 cursor-pointer" style={{ margin: 0 }} />
                            <div className="absolute top-1/2 w-5 h-5 bg-starmade-accent rounded-full border-2 border-white shadow-lg transform -translate-y-1/2 -translate-x-1/2 pointer-events-none transition-all duration-150" style={{ left: `${memoryPercentage}%` }}>
                                <div className="absolute inset-0 rounded-full bg-white/20" />
                            </div>
                        </div>
                        <div className="relative mt-2 h-4">
                            {markers.map((marker) => {
                                const markerPos = ((marker - MIN_MEMORY) / (MAX_MEMORY - MIN_MEMORY)) * 100;
                                return (
                                    <div key={marker} className="absolute flex flex-col items-center transform -translate-x-1/2" style={{ left: `${markerPos}%` }}>
                                        <div className="w-px h-2 bg-slate-600" />
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <input type="number" value={javaMemory} onChange={(e) => handleMemoryChange(parseInt(e.target.value))} min={MIN_MEMORY} max={MAX_MEMORY} step={STEP} className="w-24 bg-slate-900/80 border border-slate-700 rounded-md px-3 py-2 text-center focus:outline-none focus:ring-2 focus:ring-starmade-accent" />
                        <span className="text-sm text-gray-400">MB</span>
                    </div>
                </div>
            </SettingRow>

            <SettingRow title="JVM Arguments" description="Java arguments for advanced users. Memory is managed above.">
                <textarea value={jvmArgs} onChange={e => setJvmArgs(e.target.value)} rows={2} className="w-full bg-slate-900/80 border border-slate-700 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-starmade-accent font-mono text-sm"></textarea>
            </SettingRow>

            <SettingRow title="Java Executable Path" description="The default Java executable used for new instances.">
                 <div className="flex w-full">
                  <input type="text" value={javaPath} onChange={e => setJavaPath(e.target.value)} className="flex-1 bg-slate-900/80 border border-slate-700 rounded-l-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-starmade-accent" />
                  <button className="bg-slate-800/80 border-t border-b border-r border-slate-700 px-4 rounded-r-md hover:bg-slate-700/80"><FolderIcon className="w-5 h-5 text-gray-400" /></button>
                </div>
            </SettingRow>
        </div>
    );
}

// Tab button component, localized for this page
const TabButton: React.FC<{ isActive: boolean; onClick: () => void; children: React.ReactNode }> = ({ isActive, onClick, children }) => (
    <button
        onClick={onClick}
        className={`
            font-display text-lg font-bold uppercase tracking-wider transition-colors duration-200 relative pb-2 px-1
            ${isActive ? 'text-white' : 'text-gray-500 hover:text-gray-300'}
        `}
    >
        {children}
        {isActive && (
            <div className="absolute bottom-0 left-0 w-full h-1 bg-starmade-accent rounded-full shadow-[0_0_8px_0px_#227b86]"></div>
        )}
    </button>
);


// Main component for the "Default Settings" page
const DefaultSettings: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'installations' | 'servers'>('installations');

    return (
        <div className="h-full flex flex-col">
            <div className="flex justify-between items-center mb-6 pb-2 border-b-2 border-white/10 flex-shrink-0">
                <h2 className="font-display text-xl font-bold uppercase tracking-wider text-white">
                    Default Settings
                </h2>
                <p className="text-sm text-gray-400">Configure default values for new installations and servers.</p>
            </div>
            <div className="flex items-center gap-6 mb-6 flex-shrink-0">
                <TabButton isActive={activeTab === 'installations'} onClick={() => setActiveTab('installations')}>
                    Installations
                </TabButton>
                <TabButton isActive={activeTab === 'servers'} onClick={() => setActiveTab('servers')}>
                    Servers
                </TabButton>
            </div>
            <div className="flex-grow overflow-y-auto pr-4 -mr-4">
               {activeTab === 'installations' ? <DefaultSettingsForm isServer={false} /> : <DefaultSettingsForm isServer={true} />}
            </div>
        </div>
    );
};

export default DefaultSettings;
