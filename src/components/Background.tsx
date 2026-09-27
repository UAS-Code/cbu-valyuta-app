// cbu-valyuta-app/src/components/Background.tsx
import React, { ReactNode } from 'react';
import { Dimensions, StyleSheet, View, ViewStyle } from 'react-native';

interface BackgroundProps {
    children?: ReactNode;
    style?: ViewStyle;
    backgroundColor?: string;
}

const { width, height } = Dimensions.get('window');

export const Background: React.FC<BackgroundProps> = ({
    children,
    style,
    backgroundColor = '#031911',
}) => {
    return (
        <View style={[styles.container, { backgroundColor }, style]}>
            {/* Glassmorphism uchun yorug'lik dog'lari (Orqa fonni jonlantirish uchun) */}
            <View style={styles.glowOrb1} />
            <View style={styles.glowOrb2} />
            <View style={styles.glowOrb3} />

            {children}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        position: 'relative',
        overflow: 'hidden',
    },
    glowOrb1: {
        position: 'absolute',
        top: -80,
        left: -50,
        width: 250,
        height: 250,
        borderRadius: 125,
        backgroundColor: 'rgba(16, 185, 129, 0.25)',
        opacity: 0.6,
    },
    glowOrb2: {
        position: 'absolute',
        bottom: 100,
        right: -80,
        width: 300,
        height: 300,
        borderRadius: 150,
        backgroundColor: 'rgba(5, 150, 105, 0.2)',
        opacity: 0.5,
    },
    glowOrb3: {
        position: 'absolute',
        top: '40%',
        left: '20%',
        width: 200,
        height: 200,
        borderRadius: 100,
        backgroundColor: 'rgba(52, 211, 153, 0.12)',
        opacity: 0.4,
    },
});
