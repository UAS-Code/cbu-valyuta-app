// cbu-valyuta-app/App.tsx
import { useCallback, useEffect, useState } from 'react';
import { Alert, StatusBar, StyleSheet } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Background } from './src/components/Background';
import { SplashScreen } from './src/components/SplashScreen';
import { ConverterScreen } from './src/screens/ConverterScreen';
import { RatesScreen } from './src/screens/RatesScreen';
import { fetchCBURatesFromAPI, getTodayDateString, UZS_CURRENCY } from './src/services/cbuApi';
import { Currency, ScreenMode } from './src/types/currency';

export default function App() {
    const [isSplashVisible, setIsSplashVisible] = useState(true);
    const [screen, setScreen] = useState<ScreenMode>('rates');
    const [currencies, setCurrencies] = useState<Currency[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [rawDateStr, setRawDateStr] = useState<string>(getTodayDateString());

    const [fromCurrency, setFromCurrency] = useState<Currency>(UZS_CURRENCY);
    const [toCurrency, setToCurrency] = useState<Currency>(UZS_CURRENCY);

    const loadData = useCallback(async (isRefresh = false) => {
        try {
            if (isRefresh) {
                setRefreshing(true);
            } else {
                setLoading(true);
            }

            const res = await fetchCBURatesFromAPI();

            if (!res || !res.currencies || res.currencies.length === 0) {
                throw new Error('Maʼlumot kelmadi');
            }

            setCurrencies(res.currencies);
            setRawDateStr(res.dateStr);

            setFromCurrency((prev) => {
                const found = res.currencies.find((c) => c.code === prev.code);
                if (found) return found;
                return res.currencies.find((c) => c.code === 'USD') || res.currencies[0];
            });
        } catch (e) {
            Alert.alert('Хатолик', 'Курсларни янгилаб бўлмади. Интернет алоқасини текширинг.');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, []);

    useEffect(() => {
        loadData(false);
    }, [loadData]);

    const allCurrencies = [UZS_CURRENCY, ...currencies];

    return (
        <SafeAreaProvider>
            <SafeAreaView style={styles.safeArea} edges={['top', 'bottom', 'left', 'right']}>
                <StatusBar barStyle="light-content" backgroundColor="#021610" />

                <Background>
                    {screen === 'rates' ? (
                        <RatesScreen
                            currencies={currencies}
                            rawDateStr={rawDateStr}
                            loading={loading}
                            refreshing={refreshing}
                            onRefresh={() => loadData(true)}
                            onSelectCurrency={(curr) => {
                                setFromCurrency(curr);
                                setToCurrency(UZS_CURRENCY);
                                setScreen('converter');
                            }}
                            onOpenConverter={() => setScreen('converter')}
                        />
                    ) : (
                        <ConverterScreen
                            currencies={allCurrencies}
                            initialFromCurrency={fromCurrency}
                            initialToCurrency={toCurrency}
                            onBack={() => setScreen('rates')}
                        />
                    )}

                    {isSplashVisible && <SplashScreen onFinish={() => setIsSplashVisible(false)} />}
                </Background>
            </SafeAreaView>
        </SafeAreaProvider>
    );
}

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#021610' },
});
