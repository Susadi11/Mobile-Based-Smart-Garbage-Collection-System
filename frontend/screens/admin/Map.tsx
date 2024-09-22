import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import { getFirestore, collection, onSnapshot } from 'firebase/firestore';
import { app } from '../../firebaseConfig';

interface WasteSchedule {
  id: string;
  name: string;
  scheduleType: string;
  garbageTypes: string;
  pickupTime: string;
  pickupDate: string;
  location: { latitude: number; longitude: number };
}

const Map: React.FC = () => {
    const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
    const [wasteSchedules, setWasteSchedules] = useState<WasteSchedule[]>([]);

    const firestore = getFirestore(app);

    useEffect(() => {
        const requestLocationPermission = async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                console.log('Location permission denied');
                return;
            }
            getCurrentLocation();
        };
        requestLocationPermission();

        // Subscribe to waste schedules
        const unsubscribe = onSnapshot(collection(firestore, 'wasteSchedules'), (snapshot) => {
            const schedules: WasteSchedule[] = [];
            snapshot.forEach((doc) => {
                schedules.push({ id: doc.id, ...doc.data() } as WasteSchedule);
            });
            setWasteSchedules(schedules);
        });

        return () => unsubscribe();
    }, []);

    const getCurrentLocation = async () => {
        try {
            const { coords } = await Location.getCurrentPositionAsync({
                accuracy: Location.Accuracy.High,
            });
            setLocation({
                latitude: coords.latitude,
                longitude: coords.longitude,
            });
        } catch (error) {
            console.warn(error);
        }
    };

    const mapStyle = [
        {
            "elementType": "geometry",
            "stylers": [
                {
                    "color": "#0b0909"
                }
            ]
        },
        {
            "elementType": "labels.icon",
            "stylers": [
                {
                    "visibility": "on"
                }
            ]
        },
        {
            "elementType": "labels.text.fill",
            "stylers": [
                {
                    "color": "#616161"
                }
            ]
        },
        {
            "elementType": "labels.text.stroke",
            "stylers": [
                {
                    "color": "#f5f5f5"
                }
            ]
        },
        {
            "featureType": "administrative",
            "elementType": "geometry",
            "stylers": [
                {
                    "color": "#ffbe29"
                },
                {
                    "weight": 0.5
                }
            ]
        },
        {
            "featureType": "administrative.land_parcel",
            "stylers": [
                {
                    "visibility": "off"
                }
            ]
        },
        {
            "featureType": "administrative.land_parcel",
            "elementType": "labels.text.fill",
            "stylers": [
                {
                    "color": "#bdbdbd"
                }
            ]
        },
        {
            "featureType": "landscape",
            "elementType": "geometry",
            "stylers": [
                {
                    "color": "#94cd9e"
                }
            ]
        },
        {
            "featureType": "poi",
            "elementType": "geometry",
            "stylers": [
                {
                    "color": "#000000"
                }
            ]
        },
        {
            "featureType": "poi",
            "elementType": "labels.text.fill",
            "stylers": [
                {
                    "color": "#000000"
                }
            ]
        },
        {
            "featureType": "poi.park",
            "elementType": "geometry",
            "stylers": [
                {
                    "color": "#62a56f"
                }
            ]
        },
        {
            "featureType": "poi.park",
            "elementType": "labels.text.fill",
            "stylers": [
                {
                    "color": "#2e7137"
                }
            ]
        },
        {
            "featureType": "road",
            "elementType": "geometry",
            "stylers": [
                {
                    "color": "#ffffff"
                }
            ]
        },
        {
            "featureType": "road.arterial",
            "elementType": "labels.text.fill",
            "stylers": [
                {
                    "color": "#757575"
                }
            ]
        },
        {
            "featureType": "road.highway",
            "elementType": "geometry",
            "stylers": [
                {
                    "color": "#8d153a"
                }
            ]
        },
        {
            "featureType": "road.highway",
            "elementType": "labels.text.fill",
            "stylers": [
                {
                    "color": "#616161"
                }
            ]
        },
        {
            "featureType": "road.local",
            "elementType": "labels.text.fill",
            "stylers": [
                {
                    "color": "#9e9e9e"
                }
            ]
        },
        {
            "featureType": "transit.line",
            "elementType": "geometry",
            "stylers": [
                {
                    "color": "#e5e5e5"
                }
            ]
        },
        {
            "featureType": "transit.station",
            "elementType": "geometry",
            "stylers": [
                {
                    "color": "#eeeeee"
                }
            ]
        },
        {
            "featureType": "water",
            "elementType": "geometry",
            "stylers": [
                {
                    "color": "#4c80d2"
                }
            ]
        },
        {
            "featureType": "water",
            "elementType": "labels.text.fill",
            "stylers": [
                {
                    "color": "#456ba3"
                }
            ]
        }
    ];

    return (
        <View style={styles.container}>
            <MapView
                provider={PROVIDER_GOOGLE}
                customMapStyle={mapStyle}
                style={styles.map}
                initialRegion={{
                    latitude: 7.8731,
                    longitude: 80.7718,
                    latitudeDelta: 2.5,
                    longitudeDelta: 2.5,
                }}
                showsUserLocation={true}
                followsUserLocation={true}
            >
                {wasteSchedules.map((schedule) => (
                    <Marker
                        key={schedule.id}
                        coordinate={schedule.location}
                        title={schedule.name}
                        description={`${schedule.scheduleType} - ${schedule.garbageTypes}`}
                        pinColor="red"
                    />
                ))}
            </MapView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    map: {
        ...StyleSheet.absoluteFillObject,
    },
    markerContainer: {
        width: 80,
        height: 60,
        alignItems: 'center',
    },
    markerPin: {
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: 'red',
        borderWidth: 2,
        borderColor: 'white',
    },
    markerTextContainer: {
        backgroundColor: 'white',
        borderRadius: 10,
        paddingHorizontal: 8,
        paddingVertical: 4,
        marginTop: 5,
    },
    markerText: {
        color: 'black',
        fontWeight: 'bold',
        fontSize: 12,
    },
    infoContainer: {
        position: 'absolute',
        bottom: 20,
        left: 20,
        right: 20,
        padding: 16,
        borderRadius: 16,
        overflow: 'hidden',
        borderColor: 'rgba(255, 255, 255, 0.5)',
        borderWidth: 1,
    },
    infoText: {
        color: 'white',
        fontSize: 14,
        marginBottom: 4,
        textShadowColor: 'rgba(0, 0, 0, 0.75)',
        textShadowOffset: {width: -1, height: 1},
        textShadowRadius: 10
    },
});

export default Map;