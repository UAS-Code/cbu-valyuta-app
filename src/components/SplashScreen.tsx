// FILE: cbu-valyuta-app/src/components/SplashScreen.tsx

import { ArrowRightLeft, ShieldCheck, TrendingUp } from 'lucide-react-native';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Platform, StyleSheet, Text, View } from 'react-native';

interface SplashScreenProps {
    onFinish: () => void;
    isLoadingData?: boolean;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
    const [activeSymbolIndex, setActiveSymbolIndex] = useState(0);
    const [progress, setProgress] = useState(15);
    const [statusText, setStatusText] = useState('Марказий банк тизимига уланмоқда...');

    const fadeAnim = useRef(new Animated.Value(1)).current;
    const scaleAnim = useRef(new Animated.Value(1)).current;

    const currencyPairs = [
        { from: 'USD', symbol: '$', to: 'UZS', name: 'АҚШ Доллари' },
        { from: 'EUR', symbol: '€', to: 'UZS', name: 'Евро' },
        { from: 'RUB', symbol: '₽', to: 'UZS', name: 'Россия Рубли' },
        { from: 'GBP', symbol: '£', to: 'UZS', name: 'Фунт Стерлинг' },
        { from: 'CNY', symbol: '¥', to: 'UZS', name: 'Хитой Юани' },
    ];

    useEffect(() => {
        const symbolInterval = setInterval(() => {
            setActiveSymbolIndex((prev) => (prev + 1) % currencyPairs.length);
        }, 450);
        return () => clearInterval(symbolInterval);
    }, [currencyPairs.length]);

    useEffect(() => {
        const p1 = setTimeout(() => {
            setProgress(55);
            setStatusText('Фаол кунлик курслар базаси олинмоқда...');
        }, 600);

        const p2 = setTimeout(() => {
            setProgress(88);
            setStatusText('74 та жаҳон валютаси синхронланмоқда...');
        }, 1200);

        const p3 = setTimeout(() => {
            setProgress(100);
            setStatusText('База муваффақиятли янгиланди');
        }, 1700);

        const finishTimeout = setTimeout(() => {
            Animated.parallel([
                Animated.timing(fadeAnim, {
                    toValue: 0,
                    duration: 1000,
                    useNativeDriver: true,
                }),
                Animated.timing(scaleAnim, {
                    toValue: 1,
                    duration: 1000,
                    useNativeDriver: Platform.OS !== 'web',
                }),
            ]).start(() => {
                onFinish();
            });
        }, 2200);

        return () => {
            clearTimeout(p1);
            clearTimeout(p2);
            clearTimeout(p3);
            clearTimeout(finishTimeout);
        };
    }, [onFinish, fadeAnim, scaleAnim]);

    const currentPair = currencyPairs[activeSymbolIndex];

    return (
        <Animated.View
            style={[
                styles.container,
                {
                    opacity: fadeAnim,
                    transform: [{ scale: scaleAnim }],
                },
            ]}
        >
            <View style={styles.topBadgeContainer}>
                <View style={styles.shieldBadge}>
                    <ShieldCheck size={16} color="#34d399" />
                    <Text style={styles.shieldText}>ЎзР Марказий банки</Text>
                </View>
            </View>

            <View style={styles.centerCore}>
                <View style={styles.orbitContainer}>
                    <View style={[styles.satelliteBadge, styles.satTop]}>
                        <Text style={styles.satText}>USD $</Text>
                    </View>
                    <View style={[styles.satelliteBadge, styles.satBottom]}>
                        <Text style={styles.satText}>EUR €</Text>
                    </View>
                    <View style={[styles.satelliteBadge, styles.satLeft]}>
                        <Text style={styles.satText}>RUB ₽</Text>
                    </View>
                    <View style={[styles.satelliteBadge, styles.satRight]}>
                        <Text style={styles.satText}>UZS сўм</Text>
                    </View>

                    <View style={styles.medallionOuter}>
                        <View style={styles.medallionInner}>
                            <Text style={styles.symbolText}>{currentPair.symbol}</Text>
                            <View style={styles.exchangeRow}>
                                <Text style={styles.pairText}>{currentPair.from}</Text>
                                <ArrowRightLeft size={12} color="#34d399" />
                                <Text style={styles.uzsText}>UZS</Text>
                            </View>
                        </View>
                    </View>
                </View>

                <View style={styles.titleContainer}>
                    <Text style={styles.mainTitle}>ВАЛЮТА КУРСЛАРИ</Text>
                    <Text style={styles.subTitle}>Марказий банк расмий синхронизацияси</Text>
                </View>

                <View style={styles.trendPill}>
                    <TrendingUp size={14} color="#34d399" />
                    <Text style={styles.trendName}>{currentPair.name}</Text>
                    <Text style={styles.trendDot}>● Фаол</Text>
                </View>
            </View>

            <View style={styles.bottomContainer}>
                <View style={styles.progressBarBg}>
                    <View style={[styles.progressBarFill, { width: `${progress}%` }]} />
                </View>
                <Text style={styles.statusText}>{statusText}</Text>
            </View>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 50,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 32,
        backgroundColor: '#021610',
    },
    topBadgeContainer: {
        paddingTop: 24,
        alignItems: 'center',
    },
    shieldBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        paddingHorizontal: 14,
        paddingVertical: 6,
        borderRadius: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.08)',
        borderWidth: 1,
        borderColor: 'rgba(52, 211, 153, 0.3)',
    },
    shieldText: {
        color: '#6ee7b7',
        fontSize: 12,
        fontWeight: '600',
    },
    centerCore: {
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 'auto',
    },
    orbitContainer: {
        width: 176,
        height: 176,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
    },
    satelliteBadge: {
        position: 'absolute',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 12,
        backgroundColor: 'rgba(10, 40, 28, 0.85)',
        borderWidth: 1,
        borderColor: 'rgba(52, 211, 153, 0.4)',
    },
    satTop: { top: -4 },
    satBottom: { bottom: -4 },
    satLeft: { left: -12 },
    satRight: { right: -12 },
    satText: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#a7f3d0',
    },
    medallionOuter: {
        width: 128,
        height: 128,
        borderRadius: 24,
        backgroundColor: 'rgba(16, 185, 129, 0.25)',
        padding: 4,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: 'rgba(52, 211, 153, 0.4)',
    },
    medallionInner: {
        width: '100%',
        height: '100%',
        borderRadius: 20,
        backgroundColor: 'rgba(4, 30, 20, 0.9)',
        borderWidth: 1,
        borderColor: 'rgba(52, 211, 153, 0.3)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    symbolText: {
        fontSize: 36,
        fontWeight: '800',
        color: '#ffffff',
    },
    exchangeRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        marginTop: 4,
    },
    pairText: {
        fontSize: 11,
        fontWeight: 'bold',
        color: 'rgba(110, 231, 183, 0.9)',
    },
    uzsText: {
        fontSize: 11,
        fontWeight: 'bold',
        color: '#fde047',
    },
    titleContainer: {
        marginTop: 28,
        alignItems: 'center',
    },
    mainTitle: {
        fontSize: 20,
        fontWeight: '900',
        color: '#ffffff',
        letterSpacing: -0.5,
    },
    subTitle: {
        fontSize: 12,
        fontWeight: '500',
        color: 'rgba(110, 231, 183, 0.8)',
        marginTop: 4,
    },
    trendPill: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.08)',
        borderWidth: 1,
        borderColor: 'rgba(52, 211, 153, 0.3)',
        marginTop: 16,
    },
    trendName: {
        fontSize: 12,
        color: '#e2e8f0',
        fontWeight: '600',
    },
    trendDot: {
        fontSize: 10,
        color: '#34d399',
        fontWeight: 'bold',
        marginLeft: 4,
    },
    bottomContainer: {
        width: '100%',
        maxWidth: 300,
        paddingBottom: 16,
        alignItems: 'center',
    },
    progressBarBg: {
        width: '100%',
        height: 6,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 999,
        borderWidth: 1,
        borderColor: 'rgba(52, 211, 153, 0.2)',
        overflow: 'hidden',
    },
    progressBarFill: {
        height: '100%',
        backgroundColor: '#34d399',
        borderRadius: 999,
    },
    statusText: {
        fontSize: 11,
        color: 'rgba(110, 231, 183, 0.7)',
        fontWeight: '500',
        marginTop: 8,
        textAlign: 'center',
        height: 16,
    },
});
