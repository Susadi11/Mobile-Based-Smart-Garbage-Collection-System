import * as React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import ListNavbar from '@/components/vindi/ListNavBar';
import CardGrid from '@/components/vindi/CardGrid';

const ComplainDash: React.FC = () => {
  return (
      <View style={styles.container}>
         <View style={styles.header}>
        <Text style={styles.headerTitle}>Complaint Dashboard</Text>
      </View>
        <ListNavbar/>
        <Text style={styles.text2}>Summery of Complaints</Text>
        <CardGrid/>
        
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
        marginBottom: 2,
    },
    header: {
        width: '100%',
        height: 60,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 4,
        
      },
      text2:{
        fontSize:20,
        marginTop:30,
        fontWeight: "bold",
        marginLeft:20,

      },
      headerTitle: {
        fontSize: 20,
        color: 'black',
      },
});

export default ComplainDash;