export interface DscMenu {
    title: string;
    disabled?: boolean;
    icon?: string;
    url?: string;
    externalUrl?: string;
    children?: DscMenu[];
    customActiveCondition?: (menu: DscMenu) => boolean;
    data?: any;
    defaultSelected?: boolean;
}
