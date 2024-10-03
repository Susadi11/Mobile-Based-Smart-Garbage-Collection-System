import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

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
                    style: "destructive", // Red color for destructive actions
                },
            ],
            { cancelable: true }
        );
    };

    const deleteOrder = async (orderId: string) => {
        try {
            await deleteDoc(doc(db, 'orders', orderId));
            setOrders((prevOrders) => prevOrders.filter((order) => order.id !== orderId));
            Alert.alert('Success', 'Order deleted successfully');
        } catch (error) {
            console.error('Error deleting order: ', error);
            Alert.alert('Error', 'Failed to delete order');
        }
    };

    if (loading) {
        return <ActivityIndicator size="large" color="#6A64F1" style={styles.loader} />;
    }

    return (
        <ScrollView contentContainerStyle={styles.container}>
            {orders.length === 0 ? (
                <Text>No orders found</Text>
            ) : (
                orders.map((order) => (
                    <View key={order.id} style={styles.card}>
                        <View style={styles.header}>
                            <Text style={styles.title}>Invoice Number: {order.invoiceNumber}</Text>
                            <TouchableOpacity onPress={() => confirmDeleteOrder(order.id)}>
                                <MaterialIcons name="delete" size={24} color="#e63946" />
                            </TouchableOpacity>
                        </View>
                        <View style={styles.subtitle}>
                            <Text style={styles.details}>Name: {order.name}</Text>
                            <Text style={styles.details}>Phone: {order.phone}</Text>
                            <Text style={styles.details}>Email: {order.email}</Text>
                            <Text style={styles.details}>Amount: {order.amount}</Text>
                            <Text style={styles.details}>Total Price: ${order.totalPrice.toFixed(2)}</Text>
                            <Text style={styles.details}>Date: {order.date}</Text>
                            <Text style={styles.details}>Time: {order.time}</Text>
                            <Text style={styles.details}>Urban Council: {order.urbanCouncil}</Text>
                        </View>
                    </View>
                ))
            )}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        padding: 12,
        gap: 12,
    },
    loader: {
        marginTop: 50,
    },
    card: {
        backgroundColor: '#f3f4f6',
        borderLeftWidth: 8,
        borderLeftColor: '#22c55e',
        borderRadius: 8,
        padding: 12,
        width: '90%',
        marginVertical: 6,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    title: {
        fontSize: 18,
        fontWeight: '600',
        color: '#000',
    },
    subtitle: {
        paddingTop: 6,
    },
    details: {
        fontSize: 12,
        color: '#6b7280',
        fontWeight: '300',
    },
});

export default OrderList;
