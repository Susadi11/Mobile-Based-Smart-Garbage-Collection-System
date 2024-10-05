import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import NumbOfSmartDustbin from '@/components/Admin/SmartDustbin/NumbOfSmartDustbin';

const   NumOfSmartDustbin: React.FC = () => {
  return (
      <View style={styles.container}>
          <NumbOfSmartDustbin />
      </View>
  );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
       
    },
    title: {
        marginTop: 30,
        color: 'black',
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
    }
});

export default NumOfSmartDustbin;
