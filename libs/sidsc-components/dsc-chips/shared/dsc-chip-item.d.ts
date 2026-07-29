export interface DscChipItem {
    label: string;
    value?: number;
    icon?: string;
    avatar?: string;
    altAvatar?: string;
    selected?: boolean;
    disabled?: boolean;
    imageShape?: 'rounded' | 'rectangular' | 'square';
    size?: 'standard' | 'small';
}
