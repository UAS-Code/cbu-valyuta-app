// src/screens/ConverterScreen.tsx

import { ArrowLeft, ArrowUpDown, Delete, TrendingDown, TrendingUp } from 'lucide-react-native';
import React, { useMemo, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { CurrencyModal } from '../components/CurrencyModal';
import { FlagIcon } from '../components/FlagIcon';
import { Currency } from '../types/currency';

interface ConverterScreenProps {
    currencies: Currency[];
    initialFromCurrency: Currency;
    initialToCurrency: Currency;
    onBack: () => void;
}

export const ConverterScreen: React.FC<ConverterScreenProps> = ({
    currencies,
    initialFromCurrency,
    initialToCurrency,
    onBack,
}) => {
    const [fromCurrency, setFromCurrency] = useState<Currency>(initialFromCurrency);
    const [toCurrency, setToCurrency] = useState<Currency>(initialToCurrency);
    const [amountStr, setAmountStr] = useState('1000');
    const [modalType, setModalType] = useState<'from' | 'to' | null>(null);

    const numericAmount = useMemo(() => parseFloat(amountStr) || 0, [amountStr]);

    const convertedValue = useMemo(() => {
        if (numericAmount === 0) return 0;
        const fromUnit = fromCurrency.code === 'UZS' ? 1 : fromCurrency.unitRate;
        const toUnit = toCurrency.code === 'UZS' ? 1 : toCurrency.unitRate;
        return (numericAmount * fromUnit) / toUnit;
    }, [numericAmount, fromCurrency, toCurrency]);

    const exchangeRateInfo = useMemo(() => {
        const fromUnit = fromCurrency.code === 'UZS' ? 1 : fromCurrency.unitRate;
        const toUnit = toCurrency.code === 'UZS' ? 1 : toCurrency.unitRate;
        return fromUnit / toUnit;
    }, [fromCurrency, toCurrency]);

    const diffValue = useMemo(() => {
        if (fromCurrency.code === 'UZS') return 0;
        return Number(fromCurrency.diff) || 0;
    }, [fromCurrency]);

    const isPositiveDiff = diffValue >= 0;

    const popularCodes = ['USD', 'EUR', 'RUB', 'GBP', 'CNY', 'KZT', 'JPY', 'KRW', 'TRY', 'CHF'];

    const sortedCurrencies = useMemo(() => {
        const popular = currencies.filter((c) => popularCodes.includes(c.code));
        const others = currencies.filter((c) => !popularCodes.includes(c.code));
        popular.sort((a, b) => popularCodes.indexOf(a.code) - popularCodes.indexOf(b.code));
        return [...popular, ...others];
    }, [currencies]);

    const handleKeyPress = (char: string) => {
        if (char === 'C') {
            setAmountStr('0');
            return;
        }
        if (char === 'DEL') {
            setAmountStr((prev) => (prev.length <= 1 ? '0' : prev.slice(0, -1)));
            return;
        }
        if (char === '.') {
            if (!amountStr.includes('.')) setAmountStr((prev) => prev + '.');
            return;
        }
        if (char === 'Convert') {
            return;
        }
        if (amountStr === '0') {
            setAmountStr(char);
        } else if (amountStr.length < 12) {
            setAmountStr((prev) => prev + char);
        }
    };

    const swapCurrencies = () => {
        const temp = fromCurrency;
        setFromCurrency(toCurrency);
        setToCurrency(temp);
    };

    return (
        <View style={styles.flex}>
            {/* Header */}
            <View style={styles.header}>
                <View style={styles.headerTop}>
                    <TouchableOpacity style={styles.headerBtn} onPress={onBack}>
                        <ArrowLeft size={20} color="#fff" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Валюта конвертери</Text>
                    <View style={{ width: 40 }} />
                </View>
            </View>

            <View style={styles.contentContainer}>
                {/* Asosiy Glass Quti */}
                <View style={styles.mainCardBox}>
                    {/* FROM */}
                    <TouchableOpacity
                        style={styles.calcCardActive}
                        onPress={() => setModalType('from')}
                    >
                        <View style={styles.calcCardHeader}>
                            <View style={styles.currencyLeft}>
                                <FlagIcon country={fromCurrency.country} size={32} />
                                <Text style={styles.calcCode}>{fromCurrency.code}</Text>
                            </View>
                            <Text
                                style={styles.calcAmountActive}
                                numberOfLines={1}
                                adjustsFontSizeToFit
                            >
                                {numericAmount.toLocaleString('en-US')}
                            </Text>
                        </View>
                        <Text style={styles.calcSubName}>{fromCurrency.name}</Text>
                    </TouchableOpacity>

                    {/* Swap Button */}
                    <View style={styles.swapWrapper}>
                        <TouchableOpacity style={styles.swapBtn} onPress={swapCurrencies}>
                            <ArrowUpDown size={20} color="#fff" />
                        </TouchableOpacity>
                    </View>

                    {/* TO */}
                    <TouchableOpacity
                        style={styles.calcCardInactive}
                        onPress={() => setModalType('to')}
                    >
                        <View style={styles.calcCardHeader}>
                            <View style={styles.currencyLeft}>
                                <FlagIcon country={toCurrency.country} size={32} />
                                <Text style={styles.calcCode}>{toCurrency.code}</Text>
                            </View>
                            <Text
                                style={styles.calcAmountInactive}
                                numberOfLines={1}
                                adjustsFontSizeToFit
                            >
                                {convertedValue.toLocaleString('en-US', {
                                    minimumFractionDigits: 0,
                                    maximumFractionDigits: 2,
                                })}
                            </Text>
                        </View>
                        <Text style={styles.calcSubName}>{toCurrency.name}</Text>
                    </TouchableOpacity>

                    {/* Kurs Info */}
                    <View style={styles.rateInfoFooter}>
                        <Text style={styles.rateInfoText}>
                            1 {fromCurrency.code} ={' '}
                            {exchangeRateInfo.toLocaleString('en-US', {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                            })}{' '}
                            {toCurrency.code}
                        </Text>
                        <View style={styles.trendRow}>
                            {isPositiveDiff ? (
                                <TrendingUp size={14} color="#34d399" />
                            ) : (
                                <TrendingDown size={14} color="#f87171" />
                            )}
                            <Text
                                style={[
                                    styles.trendText,
                                    { color: isPositiveDiff ? '#34d399' : '#f87171' },
                                ]}
                            >
                                {isPositiveDiff ? `+${diffValue}` : diffValue}
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Klaviatura (Glassmorphic keys) */}
                <View style={styles.keypad}>
                    {[
                        ['1', '2', '3'],
                        ['4', '5', '6'],
                        ['7', '8', '9'],
                        ['.', '0', 'DEL'],
                        ['C', 'Convert'],
                    ].map((row, idx) => (
                        <View key={idx} style={styles.keypadRow}>
                            {row.map((btn) => {
                                const isBigActionBtn = btn === 'Convert';
                                const isClearBtn = btn === 'C';

                                return (
                                    <TouchableOpacity
                                        key={btn}
                                        style={[
                                            styles.keyBtn,
                                            isBigActionBtn && styles.keyBtnConvert,
                                            isClearBtn && styles.keyBtnSpecial,
                                        ]}
                                        onPress={() => handleKeyPress(btn)}
                                    >
                                        {btn === 'DEL' ? (
                                            <Delete size={22} color="#fff" />
                                        ) : isBigActionBtn ? (
                                            <Text style={styles.keyTextConvert}>
                                                Конвертация қилиш
                                            </Text>
                                        ) : (
                                            <Text
                                                style={[
                                                    styles.keyText,
                                                    isClearBtn && styles.keyTextRed,
                                                ]}
                                            >
                                                {btn}
                                            </Text>
                                        )}
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                    ))}
                </View>
            </View>

            {/* Валюта танлаш модали */}
            <CurrencyModal
                visible={modalType !== null}
                currencies={sortedCurrencies}
                selectedCode={modalType === 'from' ? fromCurrency.code : toCurrency.code}
                onSelect={(c) => {
                    if (modalType === 'from') setFromCurrency(c);
                    if (modalType === 'to') setToCurrency(c);
                }}
                onClose={() => setModalType(null)}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    flex: { flex: 1 },
    header: {
        backgroundColor: 'rgba(5, 30, 20, 0.65)',
        padding: 16,
        paddingBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255, 255, 255, 0.1)',
    },
    headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#fff' },
    headerBtn: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.2)',
    },
    contentContainer: { flex: 1, padding: 16, justifyContent: 'space-between' },
    mainCardBox: {
        backgroundColor: 'rgba(255, 255, 255, 0.08)',
        borderRadius: 24,
        padding: 14,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.18)',
    },
    calcCardActive: {
        backgroundColor: 'rgba(16, 185, 129, 0.15)',
        padding: 12,
        borderRadius: 16,
        borderWidth: 1.5,
        borderColor: '#34d399',
    },
    calcCardInactive: {
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        padding: 12,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.12)',
    },
    calcCardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    currencyLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
    calcCode: { fontSize: 18, fontWeight: '900', color: '#fff' },
    calcAmountActive: {
        fontSize: 24,
        fontWeight: '900',
        color: '#fff',
        maxWidth: '55%',
        textAlign: 'right',
    },
    calcAmountInactive: {
        fontSize: 24,
        fontWeight: '900',
        color: 'rgba(255,255,255,0.85)',
        maxWidth: '55%',
        textAlign: 'right',
    },
    calcSubName: { fontSize: 11, color: 'rgba(255,255,255,0.6)', marginTop: 2, fontWeight: '500' },
    swapWrapper: { alignItems: 'center', marginVertical: -12, zIndex: 10 },
    swapBtn: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#059669',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 3,
        borderColor: 'rgba(8, 35, 24, 0.9)',
    },
    rateInfoFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 12,
        paddingTop: 10,
        borderTopWidth: 1,
        borderTopColor: 'rgba(255, 255, 255, 0.1)',
    },
    rateInfoText: { fontSize: 12, fontWeight: '700', color: 'rgba(255,255,255,0.8)' },
    trendRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
    trendText: { fontSize: 12, fontWeight: '700' },
    keypad: { marginTop: 4 },
    keypadRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
    keyBtn: {
        flex: 1,
        height: 56,
        backgroundColor: 'rgba(255, 255, 255, 0.08)',
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 3,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.12)',
    },
    keyBtnSpecial: {
        backgroundColor: 'rgba(248, 113, 113, 0.15)',
        borderColor: 'rgba(248, 113, 113, 0.3)',
    },
    keyBtnConvert: {
        flex: 2.1,
        backgroundColor: '#059669',
        borderRadius: 16,
        borderColor: '#34d399',
        borderWidth: 1,
    },
    keyText: { fontSize: 20, fontWeight: '800', color: '#fff' },
    keyTextRed: { color: '#f87171' },
    keyTextConvert: { fontSize: 15, fontWeight: 'bold', color: '#ffffff' },
});
