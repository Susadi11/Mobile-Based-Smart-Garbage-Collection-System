import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, ActivityIndicator, Alert, Platform } from 'react-native';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import * as Print from 'expo-print';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

interface Order {
  id: string;
  name: string;
  phone: string;
  email: string;
  amount: string;
  date: string;
  time: string;
  urbanCouncil: string;
  totalPrice: number;
  invoiceNumber: string;
}

const OrderList = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'orders'));
        const orderList: Order[] = [];
        querySnapshot.forEach((doc) => {
          const orderData = doc.data() as Order;
          orderList.push({ ...orderData, id: doc.id });
        });
        setOrders(orderList);
      } catch (error) {
        console.error('Error fetching orders: ', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const confirmDeleteOrder = (orderId: string) => {
    Alert.alert(
      "Confirm Deletion",
      "Are you sure you want to delete this order?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: () => deleteOrder(orderId),
          style: "destructive",
        },
      ],
    );
  };

  const deleteOrder = async (orderId: string) => {
    try {
      await deleteDoc(doc(db, 'orders', orderId));
      setOrders(orders.filter(order => order.id !== orderId));
      Alert.alert('Success', 'Order deleted successfully');
    } catch (error) {
      console.error('Error deleting order:', error);
      Alert.alert('Error', 'Failed to delete the order.');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const generateReport = async () => {
    let tableRows = '';
    orders.forEach((order) => {
      tableRows += `
        <tr>
          <td>${order.name}</td>
          <td>${order.phone}</td>
          <td>${order.email}</td>
          <td>${order.amount}</td>
          <td>${order.urbanCouncil}</td>
          <td>${formatDate(order.date)}</td>
          <td>${order.time}</td>
          <td>${order.totalPrice}</td>
          <td>${order.invoiceNumber}</td>
        </tr>
      `;
    });

    const htmlContent = `
      <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
          <style>
            body { font-family: 'Helvetica'; padding: 20px; }
            h1 { text-align: center; color: #10b981; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; font-weight: bold; }
            tr:nth-child(even) { background-color: #f9f9f9; }
          </style>
        </head>
        <body>
          <h1>Order List Report</h1>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Phone</th>
                <th>Email</th>
                <th>Amount</th>
                <th>Urban Council</th>
                <th>Date</th>
                <th>Time</th>
                <th>Total Price</th>
                <th>Invoice Number</th>
              </tr>
            </thead>
            <tbody>
              ${tableRows}
            </tbody>
          </table>
        </body>
      </html>
    `;

    try {
      const { uri } = await Print.printToFileAsync({ html: htmlContent });
      const fileName = 'OrderListReport.pdf';

      if (Platform.OS === 'android') {
        const permissions = await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();

        if (permissions.granted) {
          const base64 = await FileSystem.readAsStringAsync(uri, { encoding: FileSystem.EncodingType.Base64 });
          await FileSystem.StorageAccessFramework.createFileAsync(permissions.directoryUri, fileName, 'application/pdf')
            .then(async (createdUri) => {
              await FileSystem.writeAsStringAsync(createdUri, base64, { encoding: FileSystem.EncodingType.Base64 });
              Alert.alert('Success', `Report downloaded to your device as ${fileName}`);
            })
            .catch((e) => {
              console.error(e);
              Alert.alert('Error', 'Failed to save the file.');
            });
        } else {
          Alert.alert('Permission denied', 'Unable to save the file without permission.');
        }
      } else {
        // For iOS and other platforms
        await Sharing.shareAsync(uri, { UTI: '.pdf', mimeType: 'application/pdf' });
      }

    } catch (error) {
      console.error('Error generating PDF:', error);
      Alert.alert('Error', 'Failed to generate and download PDF. Please try again.');
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#047857" />
        <Text>Loading Orders...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.pageTitle}>Orders to Pack</Text>
      </View>

      <TouchableOpacity style={styles.button} onPress={generateReport}>
        <Text style={styles.buttonText}>Generate Report</Text>
      </TouchableOpacity>

      {orders.map((order) => (
        <View key={order.id} style={styles.orderItem}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={styles.orderTitle}>{order.invoiceNumber}</Text>
            <TouchableOpacity onPress={() => confirmDeleteOrder(order.id)}>
              <MaterialIcons name="delete" size={28} color="red" />
            </TouchableOpacity>
          </View>
          <Text style={styles.orderDetails}>Name: {order.name}</Text>
          <Text style={styles.orderDetails}>Phone: {order.phone}</Text>
          <Text style={styles.orderDetails}>Email: {order.email}</Text>
          <Text style={styles.orderDetails}>Amount: {order.amount}</Text>
          <Text style={styles.orderDetails}>Urban Council: {order.urbanCouncil}</Text>
          <Text style={styles.orderDetails}>Collecting Date: {formatDate(order.date)}</Text>
          <Text style={styles.orderDetails}>Collecting Time: {order.time}</Text>
          <Text style={styles.orderDetails}>Total Price: {order.totalPrice}</Text>
          

         
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: '#f3f4f6',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginLeft: 100,
    color: 'black',
   },
  button: {
    backgroundColor: '#4CAF50',
    padding: 12,
    borderRadius: 10,
    marginVertical: 16,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  orderItem: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 30,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 30,
    elevation: 3,
    borderColor: '#e5e7eb',
    borderWidth: 1,
  },
  orderTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#047857',
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  orderDetails: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 8,
  },
 });
export default OrderList;
