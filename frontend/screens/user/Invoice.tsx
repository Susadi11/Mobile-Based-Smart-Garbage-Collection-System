import React from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import { Card, Title, Paragraph } from 'react-native-paper'; // Importing components from react-native-paper
import { RouteProp } from '@react-navigation/native';


type RouteParams = {
    params: {
        formData: {
            name: string;
            phone: string;
            email: string;
            amount: string;
            date: string;
            time: string;
            urbanCouncil: string;
        };
        invoiceNumber: string;
        totalPrice: number;
    };
};

const Invoice = ({ route }: { route: RouteProp<RouteParams, 'params'> }) => {
    const { formData, invoiceNumber, totalPrice } = route.params; // Retrieve data passed via navigation

    return (
        <ScrollView contentContainerStyle={styles.container}>
          <View style={styles.invoiceContainer}>
            <Text style={styles.headerText}>Order Invoice </Text>
            <View style={styles.divider} />
            <View style={styles.invoiceHeader}>
              <Text style={styles.titleText}>Pickup Details</Text>
              <View>
                <Text style={styles.infoText}>Date: {formData.date}</Text>
                <Text style={styles.infoText}>Time: {formData.time}</Text>
                <Text style={styles.infoText}>Invoice #: {invoiceNumber}</Text>
              </View>
            </View>
    
            <View style={styles.billToSection}>
              <Text style={styles.subTitleText}>Bill To:</Text>
              <Text style={styles.text}>Nmae:{formData.name}</Text>
              <Text style={styles.text}>Phone: {formData.phone}</Text>
              <Text style={styles.text}>Pickup Location:{formData.urbanCouncil}</Text>
              <Text style={styles.text}>Email:{formData.email}</Text>
            </View>
    
            <View style={styles.table}>
              <View style={styles.tableHeader}>
                <Text style={styles.tableHeaderText}>Description</Text>
                <Text style={styles.tableHeaderTextRight}>Quantity</Text>
              </View>
    
              <View style={styles.tableRow}>
                <Text style={styles.text}>Product Order</Text>
                <Text style={styles.textRight}>{formData.amount}</Text>
              </View>
    
              <View style={styles.tableFooter}>
                <Text style={styles.footerText}>Total Amount</Text>
                <Text style={styles.footerTextRight}>Rs {totalPrice.toFixed(2)}</Text>
              </View>
            </View>

            <Text style={styles.thankYouText}>Thank you for your business!</Text>
            <Text style={styles.smallText}>Please Collect Your Order from your Selected Urban Council.</Text>

            
          </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f8f8f8',
    flexGrow: 1,
  },
  invoiceContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 2,
    marginBottom: 20,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#1e40af',
    marginBottom: 10,
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginBottom: 10,
  },
  invoiceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  titleText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  infoText: {
    color: '#4b5563',
  },
  billToSection: {
    marginBottom: 20,
  },
  subTitleText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  text: {
    color: '#4b5563',
    marginBottom: 5,
  },
  table: {
    marginBottom: 20,
  },
  tableHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingBottom: 10,
  },
  tableHeaderText: {
    fontWeight: 'bold',
    color: '#4b5563',
  },
  tableHeaderTextRight: {
    fontWeight: 'bold',
    color: '#4b5563',
    textAlign: 'right',
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  textRight: {
    color: '#4b5563',
    textAlign: 'right',
  },
  tableFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    paddingTop: 10,
  },
  footerText: {
    fontWeight: 'bold',
    color: '#4b5563',
  },
  footerTextRight: {
    fontWeight: 'bold',
    color: '#4b5563',
    textAlign: 'right',
  },
  thankYouText: {
    color: '#4b5563',
    marginBottom: 5,
    textAlign: 'center',
  },
  smallText: {
    color: '#6b7280',
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#fff',
    marginTop: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 2,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  }
});

export default Invoice;
