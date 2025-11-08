export type ItemType = 'latest' | 'release' | 'dev' | 'archive' | 'pre';

export interface ManagedItem {
  id: string;
  name: string;
  version: string;
  type: ItemType;
  icon: string;
  path: string;
  lastPlayed: string;
  port?: string;
}

export type Page = 'Play' | 'Installations' | 'News' | 'Settings';

export type SettingsSection = 'launcher' | 'accounts' | 'about' | 'defaults';

export type PageProps = 
    | { initialSection?: SettingsSection } 
    | { initialTab?: 'installations' | 'servers' }
    | {};