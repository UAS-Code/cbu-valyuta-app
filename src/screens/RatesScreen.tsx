// cbu-valyuta-app/src/screens/RatesScreen.tsx

import { ArrowUpDown, Search, Star, TrendingDown, TrendingUp, X } from 'lucide-react-native';
import React, { useMemo, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { FlagIcon } from '../components/FlagIcon';
import { formatCBUDate } from '../services/cbuApi';
import { Currency } from '../types/currency';

interface RatesScreenProps {
    currencies: Currency[];
    rawDateStr: string;
    loading: boolean;
    refreshing: boolean;
    onRefresh: () => void;
    onSelectCurrency: (currency: Currency) => void;
    onOpenConverter: () => void;
}

export const RatesScreen: React.FC<RatesScreenProps> = ({
    currencies,
    rawDateStr,
    loading,
    refreshing,
    onRefresh,
    onSelectCurrency,
    onOpenConverter,
}) => {
    const [searchQuery, setSearchQuery] = useState('');

    const popularCodes = ['USD', 'EUR', 'RUB', 'GBP', 'CNY', 'KZT', 'JPY', 'KRW', 'TRY', 'CHF'];

    const { popularList, otherList } = useMemo(() => {
        const q = searchQuery.toLowerCase().trim();

        let filteredCurrencies = currencies;
        if (q.length > 0) {
            filteredCurrencies = currencies.filter(
                (c) => c.code.toLowerCase().includes(q) || c.name.toLowerCase().includes(q)
            );
        }

        const popular = filteredCurrencies.filter((c) => popularCodes.includes(c.code));
        const others = filteredCurrencies.filter((c) => !popularCodes.includes(c.code));

        popular.sort((a, b) => popularCodes.indexOf(a.code) - popularCodes.indexOf(b.code));

        return { popularList: popular, otherList: others };
    }, [currencies, searchQuery]);

    const sections = useMemo(() => {
        const data: any[] = [];
        if (popularList.length > 0) {
            data.push({ type: 'header', title: 'Энг оммабоп валюталар' });
            data.push(...popularList.map((item) => ({ type: 'popular_item', data: item })));
        }
        if (otherList.length > 0) {
            data.push({ type: 'header', title: 'Бошқа валюталар' });
            data.push(...otherList.map((item) => ({ type: 'other_item', data: item })));
        }
        return data;
    }, [popularList, otherList]);

    return (
        <View style={styles.flex}>
            {/* Header (Glassmorphism) */}
            <View style={styles.header}>
                <View style={styles.headerTop}>
                    <View>
                        <Text style={styles.headerTitle}>Валюта курслари</Text>
                        <Text style={styles.headerDate}>{formatCBUDate(rawDateStr)}</Text>
                    </View>
                    <TouchableOpacity style={styles.headerBtn} onPress={onOpenConverter}>
                        <ArrowUpDown size={20} color="#fff" />
                    </TouchableOpacity>
                </View>

                {/* Қидирув (Glassmorphism) */}
                <View style={styles.searchBox}>
                    <Search size={18} color="rgba(255,255,255,0.6)" />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Валютани қидириш (USD, Евро...)"
                        placeholderTextColor="rgba(255,255,255,0.5)"
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                    {searchQuery.length > 0 && (
                        <TouchableOpacity onPress={() => setSearchQuery('')}>
                            <X size={18} color="rgba(255,255,255,0.6)" />
                        </TouchableOpacity>
                    )}
                </View>
            </View>

            {/* Рўйхат */}
            {loading ? (
                <View style={styles.center}>
                    <ActivityIndicator size="large" color="#34d399" />
                    <Text style={{ marginTop: 10, color: 'rgba(255,255,255,0.7)' }}>
                        Юкланмоқда...
                    </Text>
                </View>
            ) : (
                <FlatList
                    data={sections}
                    keyExtractor={(item, index) =>
                        item.type === 'header' ? `header-${index}` : item.data.code
                    }
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                    contentContainerStyle={{ padding: 16, paddingBottom: 30 }}
                    showsVerticalScrollIndicator={false}
                    renderItem={({ item }) => {
                        if (item.type === 'header') {
                            return <Text style={styles.sectionHeader}>{item.title}</Text>;
                        }

                        const currency = item.data;
                        const isPopular = item.type === 'popular_item';

                        return (
                            <TouchableOpacity
                                style={[styles.card, isPopular && styles.popularCard]}
                                onPress={() => onSelectCurrency(currency)}
                            >
                                <View style={styles.cardLeft}>
                                    {isPopular ? (
                                        <View style={styles.flagWithStarContainer}>
                                            <FlagIcon country={currency.country} size={42} />
                                            <View style={styles.starBadge}>
                                                <Star size={12} color="#fff" fill="#f59e0b" />
                                            </View>
                                        </View>
                                    ) : (
                                        <FlagIcon country={currency.country} size={42} />
                                    )}
                                    <View style={{ marginLeft: 12 }}>
                                        <Text style={styles.cardCode}>{currency.code}</Text>
                                        <Text style={styles.cardName}>{currency.name}</Text>
                                    </View>
                                </View>

                                <View style={styles.cardRight}>
                                    <Text style={styles.cardRate}>
                                        {currency.rate.toLocaleString('en-US', {
                                            minimumFractionDigits: 2,
                                        })}{' '}
                                        сўм
                                    </Text>
                                    <View style={styles.diffRow}>
                                        {currency.isUp ? (
                                            <TrendingUp size={14} color="#34d399" />
                                        ) : (
                                            <TrendingDown size={14} color="#f87171" />
                                        )}
                                        <Text
                                            style={[
                                                styles.cardDiff,
                                                { color: currency.isUp ? '#34d399' : '#f87171' },
                                            ]}
                                        >
                                            {currency.diff > 0
                                                ? `+${currency.diff}`
                                                : currency.diff}
                                        </Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        );
                    }}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    flex: { flex: 1 },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    header: {
        backgroundColor: 'rgba(5, 30, 20, 0.65)',
        padding: 16,
        paddingBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255, 255, 255, 0.1)',
    },
    headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#fff' },
    headerDate: { fontSize: 12, color: '#34d399', marginTop: 2 },
    headerBtn: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.2)',
    },
    searchBox: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.08)',
        borderRadius: 14,
        paddingHorizontal: 12,
        marginTop: 14,
        height: 46,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.15)',
    },
    searchInput: { flex: 1, marginLeft: 8, fontSize: 14, color: '#fff' },
    sectionHeader: {
        fontSize: 13,
        fontWeight: '800',
        color: '#6ee7b7',
        marginTop: 16,
        marginBottom: 8,
        letterSpacing: 0.8,
        textTransform: 'uppercase',
    },
    card: {
        backgroundColor: 'rgba(255, 255, 255, 0.07)',
        borderRadius: 18,
        padding: 14,
        marginBottom: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.12)',
    },
    popularCard: {
        backgroundColor: 'rgba(16, 185, 129, 0.12)',
        borderColor: 'rgba(52, 211, 153, 0.35)',
    },
    flagWithStarContainer: {
        position: 'relative',
    },
    starBadge: {
        position: 'absolute',
        bottom: -2,
        right: -2,
        borderRadius: 8,
        width: 18,
        height: 18,
        backgroundColor: 'rgba(0,0,0,0.6)',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)',
    },
    cardLeft: { flexDirection: 'row', alignItems: 'center' },
    cardCode: { fontSize: 16, fontWeight: 'bold', color: '#fff' },
    cardName: { fontSize: 12, color: 'rgba(255,255,255,0.6)', marginTop: 2, maxWidth: 150 },
    cardRight: { alignItems: 'flex-end' },
    cardRate: { fontSize: 16, fontWeight: 'bold', color: '#34d399' },
    diffRow: { flexDirection: 'row', alignItems: 'center', marginTop: 2 },
    cardDiff: { fontSize: 12, fontWeight: '600', marginLeft: 4 },
});
