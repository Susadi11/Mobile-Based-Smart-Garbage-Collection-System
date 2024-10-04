
import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert, Platform } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import * as Print from 'expo-print';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

type RouteParams = {
    params: {
        formData: {
            name: string;
            phone: string;
            email: string;
            amount: number; // Assuming amount is numeric
            date: string;
            time: string;
            urbanCouncil: string;
            unitPrice: number; // Added unitPrice
        };
        invoiceNumber: string;
        totalPrice: number;
        
    };
};

const Invoice = ({ route, navigation }: { route: RouteProp<RouteParams, 'params'>, navigation: any }) => {
    const { formData, invoiceNumber,totalPrice } = route.params; // Retrieve data passed via navigation
 
    
    
   
    const generateReport = async () => {
        const order = {
            name: formData.name,
            phone: formData.phone,
            email: formData.email,
            amount: formData.amount,
            date: formData.date,
            time: formData.time,
            urbanCouncil: formData.urbanCouncil,
            totalPrice: totalPrice,
            invoiceNumber: invoiceNumber,
        };

        const htmlContent = `
            <html>
                <head>
                    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
                    <style>
                        body {
                            font-family: 'Helvetica';
                            padding: 20px;
                            background-color: #f8f8f8;
                        }
                        .receipt {
                            background-color: #fff;
                            padding: 20px;
                            border-radius: 10px;
                            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                        }
                        h1 {
                            text-align: center;
 
                        }
                        .section {
                            margin-bottom: 20px;
                        }
                        .section-title {
                            font-size: 18px;
                            font-weight: bold;
                            margin-bottom: 10px;
                        }
                        .item {
                            display: flex;
                            justify-content: space-between;
                            padding: 5px 0;
                            font-size: 16px;
 
                        }
                        .footer {
                            margin-top: 20px;
                            text-align: center;
                            font-size: 16px;
                            color: #4b5563;
                        }
                        .thank-you {
                            font-weight: bold;
 
                        }
                    </style>
                </head>
                <body>
                    <div class="receipt">
 
                        <h1>Order Invoice</h1>
 
                        <div class="section">
                            <div class="section-title">Invoice Details</div>
                            <div class="item"><span>Invoice #:</span><span>${order.invoiceNumber}</span></div>
                            <div class="item"><span>Date:</span><span>${order.date}</span></div>
                            <div class="item"><span>Time:</span><span>${order.time}</span></div>
                        </div>
                        <div class="section">
                            <div class="section-title">Bill To:</div>
                            <div class="item"><span>Name:</span><span>${order.name}</span></div>
                            <div class="item"><span>Phone:</span><span>${order.phone}</span></div>
                            <div class="item"><span>Email:</span><span>${order.email}</span></div>
                            <div class="item"><span>Pickup Location:</span><span>${order.urbanCouncil}</span></div>
                        </div>
                        <div class="section">
                            <div class="section-title">Order Details:</div>
                            <div class="item"><span>Product Order:</span><span>${order.amount}</span></div>
                        </div>
                        <div class="section">
                            <div class="item"><strong>Total Amount:</strong><strong>Rs ${order.totalPrice.toFixed(2)}</strong></div>
                        </div>
                        <div class="footer">
                            <div class="thank-you">Thank you for your business!</div>
                            <div>Please Collect Your Order from your Selected Urban Council.</div>
                        </div>
                    </div>
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

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.invoiceContainer}>
                <Text style={styles.headerText}>Order Invoice</Text>
                <View style={styles.divider} />
                <View style={styles.invoiceHeader}>
                    <Text style={styles.titleText}>Pickup Details</Text>
                    <View>
                        <Text style={styles.infoText}>Invoice #: {invoiceNumber}</Text>
                        <Text style={styles.infoText}>Date: {formData.date}</Text>
                        <Text style={styles.infoText}>Time: {formData.time}</Text>
                    </View>
                </View>

                <View style={styles.billToSection}>
                    <Text style={styles.subTitleText}>Bill To:</Text>
                    <View>
                    <Text style={styles.text}>Name: {formData.name}</Text>
                    <Text style={styles.text}>Phone: {formData.phone}</Text>
                    <Text style={styles.text}>Pickup Location: {formData.urbanCouncil}</Text>
                    <Text style={styles.text}>Email: {formData.email}</Text>
                                        
                </View>
                </View>

                <View style={styles.table}>
                    <View style={styles.tableHeader}>
                        <Text style={styles.tableHeaderText}>Description</Text>
                        <Text style={styles.footerTextRight}>Quantity</Text>
                    </View>

                    <View style={styles.tableRow}>
                        <Text style={styles.text}>Product Order</Text>
                        <Text style={styles.footerTextRight}>{formData.amount}</Text>
                    </View>

                    <View style={styles.tableFooter}>
                        <Text style={styles.footerText}>Total Amount</Text>
                        <Text style={styles.footerTextRight}>Rs {totalPrice.toFixed(2)}</Text>
                    </View>
                </View>

                <Text style={styles.thankYouText}>Thank you for your Order!</Text>
                <Text style={styles.smallText}>Please Collect Your Order from your Selected Urban Council.</Text>

                <TouchableOpacity style={styles.button} onPress={generateReport}>
                    <Text style={styles.buttonText}>Download Invoice</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.button1} onPress={() => navigation.navigate('StorePage')}>
                    <Text style={styles.buttonText1}>Go to Home</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: '#f8f8f8',
        flexGrow: 1,
        fontFamily: 'Inter_400Regular', // Set the regular Inter font
    },
    invoiceContainer: {
        backgroundColor: '#fff',
        borderRadius: 10,
        borderColor:'#10b981',
        padding: 20,
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowRadius: 10,
        elevation: 5,
        fontFamily: 'Inter_400Regular',
    },
    headerText: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 10,
        fontFamily: 'Inter_400Regular',
    },
    divider: {
        height: 1,
        backgroundColor: '#10b981',
        marginVertical: 10,
    },
    invoiceHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
        color:'#10b981',
        fontFamily: 'Inter_400Regular',
    },
    titleText: {
        fontSize: 18,
        fontWeight: 'bold',
        fontFamily: 'Inter_400Regular',
    },
    infoText: {
        fontSize: 16,
        fontFamily: 'Inter_400Regular',
    },
    billToSection: {
        marginBottom: 10,
    },
    subTitleText: {
        fontSize: 16,
        fontWeight:'bold',
        marginTop: 10,
        marginBottom: 5,
        fontFamily: 'Inter_400Regular',
    },
    text: {
        fontSize: 13,
        fontFamily: 'Inter_400Regular',
    },
    table: {
        marginVertical: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        
    },
    tableHeader: {
        backgroundColor: '#f1f1f1',
        padding: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        fontFamily: 'Inter_400Regular',
    },
    tableHeaderText: {
        fontSize: 16,
        fontWeight: 'bold',
        fontFamily: 'Inter_400Regular',
    },
    tableRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    tableFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 10,
        borderTopWidth: 1,
        borderTopColor: '#ccc',
        backgroundColor: '#f9f9f9',
    },
    footerText: {
        fontSize: 16,
        fontWeight: 'bold',
        padding: 10,
        fontFamily: 'Inter_400Regular',
    },
    footerTextRight: {
        fontSize: 16,
        fontWeight: 'bold',
        padding: 10,
        fontFamily: 'Inter_400Regular',
    },
    thankYouText: {
        fontSize: 19,
        fontWeight: 'bold',
        textAlign: 'center',
        marginVertical: 10,
        marginTop: 25,
        color:'#4CAF50',
        fontFamily: 'Inter_400Regular',
    },
    smallText: {
        fontSize: 14,
        textAlign: 'center',
        color: '#4b5563',
        fontFamily: 'Inter_400Regular',
    },
    button: {
        backgroundColor: '#4CAF50',
        borderRadius: 5,
        padding: 15,
        alignItems: 'center',
        marginTop: 20,
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontFamily: 'Inter_400Regular',
    },
    button1: {
        backgroundColor: '#33bbff',
        borderRadius: 5,
        padding: 15,
        alignItems: 'center',
        marginTop: 20,
    },
    buttonText1: {
        color: '#fff',
        fontWeight: 'bold',
        fontFamily: 'Inter_400Regular',
    },
});

export default Invoice;