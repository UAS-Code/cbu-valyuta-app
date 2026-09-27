// src/components/CurrencyModal.tsx
import { Check, Search, X } from 'lucide-react-native';
import React, { useState } from 'react';
import { FlatList, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Currency } from '../types/currency';
import { FlagIcon } from './FlagIcon';

interface CurrencyModalProps {
    visible: boolean;
    currencies: Currency[];
    selectedCode: string;
    onSelect: (curr: Currency) => void;
    onClose: () => void;
}

export const CurrencyModal: React.FC<CurrencyModalProps> = ({
    visible,
    currencies,
    selectedCode,
    onSelect,
    onClose,
}) => {
    const [search, setSearch] = useState('');

    const filtered = currencies.filter(
        (c) =>
            c.code.toLowerCase().includes(search.toLowerCase()) ||
            c.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <Modal visible={visible} animationType="slide" transparent>
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>Валютани танланг</Text>
                        <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
                            <X size={20} color="#fff" />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.searchBox}>
                        <Search size={18} color="rgba(255,255,255,0.6)" />
                        <TextInput
                            style={styles.searchInput}
                            placeholder="Қидириш (USD, Евро...)"
                            placeholderTextColor="rgba(255,255,255,0.5)"
                            value={search}
                            onChangeText={setSearch}
                        />
                    </View>

                    <FlatList
                        data={filtered}
                        keyExtractor={(item) => item.code}
                        showsVerticalScrollIndicator={false}
                        renderItem={({ item }) => {
                            const isSelected = item.code === selectedCode;
                            return (
                                <TouchableOpacity
                                    style={[
                                        styles.modalItem,
                                        isSelected && styles.modalItemSelected,
                                    ]}
                                    onPress={() => {
                                        onSelect(item);
                                        onClose();
                                    }}
                                >
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <FlagIcon country={item.country} size={36} />
                                        <View style={{ marginLeft: 12 }}>
                                            <Text style={styles.itemCode}>{item.code}</Text>
                                            <Text style={styles.itemName}>{item.name}</Text>
                                        </View>
                                    </View>
                                    {isSelected && <Check size={20} color="#34d399" />}
                                </TouchableOpacity>
                            );
                        }}
                    />
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(2, 15, 10, 0.75)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: 'rgba(8, 35, 24, 0.85)',
        borderTopLeftRadius: 28,
        borderTopRightRadius: 28,
        padding: 16,
        maxHeight: '80%',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.15)',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 14,
    },
    modalTitle: { fontSize: 18, fontWeight: 'bold', color: '#fff' },
    closeBtn: {
        width: 34,
        height: 34,
        borderRadius: 17,
        backgroundColor: 'rgba(255,255,255,0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.15)',
    },
    searchBox: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.08)',
        borderRadius: 14,
        paddingHorizontal: 12,
        height: 46,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.12)',
    },
    searchInput: { flex: 1, marginLeft: 8, fontSize: 14, color: '#fff' },
    modalItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 8,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255, 255, 255, 0.06)',
        borderRadius: 12,
        marginBottom: 4,
    },
    modalItemSelected: {
        backgroundColor: 'rgba(52, 211, 153, 0.12)',
        borderColor: 'rgba(52, 211, 153, 0.3)',
        borderWidth: 1,
    },
    itemCode: { fontSize: 16, fontWeight: 'bold', color: '#fff' },
    itemName: { fontSize: 12, color: 'rgba(255,255,255,0.6)', marginTop: 2, maxWidth: 200 },
});
