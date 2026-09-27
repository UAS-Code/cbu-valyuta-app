// cbu-valyuta-app/src/components/FlagIcon.tsx

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const EMOJI_FLAGS: Record<string, string> = {
    uz: '🇺🇿',
    us: '🇺🇸',
    eu: '🇪🇺',
    ru: '🇷🇺',
    gb: '🇬🇧',
    jp: '🇯🇵',
    ch: '🇨🇭',
    cn: '🇨🇳',
    kr: '🇰🇷',
    kz: '🇰🇿',
    tr: '🇹🇷',
    ae: '🇦🇪',
    sa: '🇸🇦',
    ca: '🇨🇦',
    au: '🇦🇺',
    in: '🇮🇳',
    sg: '🇸🇬',
    my: '🇲🇾',
    qa: '🇶🇦',
    kg: '🇰🇬',
    tj: '🇹🇯',
    tm: '🇹🇲',
    az: '🇦🇿',
    ge: '🇬🇪',
    am: '🇦🇲',
    by: '🇧🇾',
    md: '🇲🇩',
    ua: '🇺🇦',
    pl: '🇵🇱',
    se: '🇸🇪',
    no: '🇳🇴',
    dk: '🇩🇰',
    eg: '🇪🇬',
    il: '🇮🇱',
    ir: '🇮🇷',
    kw: '🇰🇼',
    bh: '🇧🇭',
    om: '🇴🇲',
    pk: '🇵🇰',
    br: '🇧🇷',
    za: '🇿🇦',
    th: '🇹🇭',
    vn: '🇻🇳',
    id: '🇮🇩',
    ph: '🇵🇭',
    mx: '🇲🇽',
    nz: '🇳🇿',
    hu: '🇭🇺',
    cz: '🇨🇿',
    imf: '🌐',
};

export const FlagIcon: React.FC<{ country: string; size?: number }> = ({ country, size = 40 }) => {
    const emoji = EMOJI_FLAGS[country.toLowerCase()] || '🏳️';
    return (
        <View style={[styles.container, { width: size, height: size, borderRadius: size / 2 }]}>
            <Text style={{ fontSize: size * 0.52 }}>{emoji}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.2)',
    },
});
