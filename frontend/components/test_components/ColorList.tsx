import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';

interface ColorListProps {
    color: string;
}

const ColorList: React.FC<ColorListProps> = ({ color }) => {
    return (
        <ScrollView contentContainerStyle={styles.container}>
            {[1, 0.9, 0.8, 0.7, 0.6, 0.5, 0.4, 0.3, 0.2, 0.1].map((opacity) => (
                <View
                    key={opacity}
                    style={[styles.color, { backgroundColor: color, opacity }]}
                />
            ))}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    color: {
        width: '100%',
        height: 150,
        borderRadius: 25,
        marginBottom: 15,
    },
    container: {
        paddingHorizontal: 20,
        paddingTop: 10,
        paddingBottom: 100,
    }
});

export default ColorList;
