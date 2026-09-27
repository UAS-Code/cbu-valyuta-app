// src/services/cbuApi.ts

import AsyncStorage from '@react-native-async-storage/async-storage';
import { Currency } from '../types/currency';

export interface CBUApiItem {
    id: number;
    Code: string;
    Ccy: string;
    CcyNm_RU: string;
    CcyNm_UZ: string;
    CcyNm_UZC: string;
    CcyNm_EN: string;
    Nominal: string;
    Rate: string;
    Diff: string;
    Date: string;
}

const STORAGE_KEY = 'cbu_rates_data_v2';

export const UZS_CURRENCY: Currency = {
    code: 'UZS',
    name: 'Ўзбекистон сўми',
    rate: 1.0,
    nominal: 1,
    unitRate: 1.0,
    diff: 0,
    diffPercent: 0,
    isUp: true,
    symbol: "so'm",
    country: 'uz',
};

const CURRENCY_META: Record<string, { symbol: string; country: string; defaultNominal?: number }> =
    {
        USD: { symbol: '$', country: 'us' },
        EUR: { symbol: '€', country: 'eu' },
        RUB: { symbol: '₽', country: 'ru' },
        GBP: { symbol: '£', country: 'gb' },
        JPY: { symbol: '¥', country: 'jp', defaultNominal: 1 },
        CHF: { symbol: 'Fr', country: 'ch' },
        CNY: { symbol: '¥', country: 'cn' },
        KRW: { symbol: '₩', country: 'kr', defaultNominal: 1 },
        KZT: { symbol: '₸', country: 'kz' },
        TRY: { symbol: '₺', country: 'tr' },
        AED: { symbol: 'د.إ', country: 'ae' },
        SAR: { symbol: '﷼', country: 'sa' },
        CAD: { symbol: 'CA$', country: 'ca' },
        AUD: { symbol: 'AU$', country: 'au' },
        INR: { symbol: '₹', country: 'in' },
        SGD: { symbol: 'S$', country: 'sg' },
        MYR: { symbol: 'RM', country: 'my' },
        QAR: { symbol: 'QR', country: 'qa' },
        KGS: { symbol: 'сом', country: 'kg' },
        TJS: { symbol: 'смн', country: 'tj' },
        TMT: { symbol: 'TMT', country: 'tm' },
        AZN: { symbol: '₼', country: 'az' },
        GEL: { symbol: '₾', country: 'ge' },
        AMD: { symbol: '֏', country: 'am' },
        BYN: { symbol: 'Br', country: 'by' },
        MDL: { symbol: 'L', country: 'md' },
        UAH: { symbol: '₴', country: 'ua' },
        PLN: { symbol: 'zł', country: 'pl' },
        SEK: { symbol: 'kr', country: 'se' },
        NOK: { symbol: 'kr', country: 'no' },
        DKK: { symbol: 'kr', country: 'dk' },
        EGP: { symbol: 'E£', country: 'eg' },
        ILS: { symbol: '₪', country: 'il' },
        IRR: { symbol: '﷼', country: 'ir' },
        KWD: { symbol: 'KD', country: 'kw' },
        BHD: { symbol: 'BD', country: 'bh' },
        OMR: { symbol: 'OMR', country: 'om' },
        PKR: { symbol: 'Rs', country: 'pk' },
        BRL: { symbol: 'R$', country: 'br' },
        ZAR: { symbol: 'R', country: 'za' },
        THB: { symbol: '฿', country: 'th' },
        VND: { symbol: '₫', country: 'vn' },
        IDR: { symbol: 'Rp', country: 'id' },
        PHP: { symbol: '₱', country: 'ph' },
        MXN: { symbol: 'Mex$', country: 'mx' },
        NZD: { symbol: 'NZ$', country: 'nz' },
        HUF: { symbol: 'Ft', country: 'hu' },
        CZK: { symbol: 'Kč', country: 'cz' },
        XDR: { symbol: 'SDR', country: 'imf' },
    };

function transformCBUItem(item: CBUApiItem): Currency {
    const code = item.Ccy.toUpperCase();
    const meta = CURRENCY_META[code] || { symbol: code, country: 'default' };
    const nominal = parseInt(item.Nominal, 10) || meta.defaultNominal || 1;
    const rate = parseFloat(item.Rate) || 0;
    const unitRate = nominal > 0 ? rate / nominal : rate;
    const diff = parseFloat(item.Diff) || 0;
    const prevRate = rate - diff;
    const diffPercent = prevRate > 0 ? (diff / prevRate) * 100 : 0;

    return {
        code,
        name: item.CcyNm_UZC || item.CcyNm_UZ || code,
        rate,
        nominal,
        unitRate,
        diff,
        diffPercent: Math.abs(diffPercent),
        isUp: diff >= 0,
        symbol: meta.symbol,
        country: meta.country,
        date: item.Date,
    };
}

export function getTodayDateString(): string {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear();
    return `${day}.${month}.${year}`;
}

export function formatCBUDate(dateRaw: string): string {
    if (!dateRaw) {
        const now = new Date();
        return formatParts(now.getDate(), now.getMonth(), now.getFullYear());
    }
    const parts = dateRaw.split('.');
    if (parts.length === 3) {
        const day = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10) - 1;
        const year = parseInt(parts[2], 10);
        return formatParts(day, month, year);
    }
    return dateRaw;
}

function formatParts(day: number, month: number, year: number): string {
    const monthsUzCyrillic = [
        'Январь',
        'Февраль',
        'Март',
        'Апрель',
        'Май',
        'Июнь',
        'Июль',
        'Август',
        'Сентябрь',
        'Октябрь',
        'Ноябрь',
        'Декабрь',
    ];
    return `${day} ${monthsUzCyrillic[month] || ''}, ${year}`;
}

export async function fetchCBURatesFromAPI(): Promise<{ currencies: Currency[]; dateStr: string }> {
    try {
        const response = await fetch('https://cbu.uz/uz/arkhiv-kursov-valyut/json/');
        if (!response.ok) throw new Error(`HTTP error ${response.status}`);
        const rawItems: CBUApiItem[] = await response.json();
        if (!Array.isArray(rawItems) || rawItems.length === 0) {
            throw new Error('Марказий банк маълумотлари бўш қайтди');
        }

        const transformed: Currency[] = rawItems.map(transformCBUItem);
        const dateStr = rawItems[0]?.Date || getTodayDateString();

        await AsyncStorage.setItem(
            STORAGE_KEY,
            JSON.stringify({
                currencies: transformed,
                dateStr,
                savedAt: Date.now(),
            })
        );

        return { currencies: transformed, dateStr };
    } catch (error) {
        const cached = await AsyncStorage.getItem(STORAGE_KEY);
        if (cached) {
            const parsed = JSON.parse(cached);
            return { currencies: parsed.currencies, dateStr: parsed.dateStr };
        }
        throw error;
    }
}
