// cbu-valyuta-app/src/types/currency.ts
export interface Currency {
    code: string;
    name: string; // Ўзбек кирилл
    rate: number;
    nominal: number;
    unitRate: number;
    diff: number;
    diffPercent: number;
    isUp: boolean;
    symbol: string;
    country: string;
    date?: string;
}

export type ScreenMode = 'rates' | 'converter';
