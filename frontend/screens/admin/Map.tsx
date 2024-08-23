import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Alert, Text, Image } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import Slider from '@react-native-community/slider';
import { BlurView } from 'expo-blur';
import attractions from '../../assets/data_scripts/attractions.json';
import ColorList from "../../components/test_components/ColorList";

interface Attraction {
    name: string;
    latitude: number;
    longitude: number;
    description?: string;
}

const Map: React.FC = () => {
    const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
    const [radius, setRadius] = useState(5); // default to 5 km
    const [filteredAttractions, setFilteredAttractions] = useState<Attraction[]>([]);
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

    const getCurrentLocation = async () => {
        try {
            const { coords } = await Location.getCurrentPositionAsync({
                accuracy: Location.Accuracy.High,
            });
            const currentLocation = {
                latitude: coords.latitude,
                longitude: coords.longitude,
            };
            setLocation(currentLocation);
            console.log('Current location:', currentLocation);
        } catch (error) {
            console.warn(error);
            Alert.alert('Error', 'Failed to get current location');
        }
    };

    useEffect(() => {
        const requestLocationPermission = async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Location permission denied');
                return;
            }
            getCurrentLocation();
        };
        requestLocationPermission();
    }, []);

    useEffect(() => {
        if (location) {
            const nearbyAttractions = attractions.attractions.filter((attraction: Attraction) => {
                const distance = getDistanceFromLatLonInKm(
                    location.latitude,
                    location.longitude,
                    attraction.latitude,
                    attraction.longitude
                );
                return distance <= radius;
            });
            setFilteredAttractions(nearbyAttractions);
        }
    }, [location, radius]);

    const getDistanceFromLatLonInKm = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
        const R = 6371; // Radius of the earth in km
        const dLat = deg2rad(lat2 - lat1);
        const dLon = deg2rad(lon2 - lon1);
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = R * c; // Distance in km
        return distance;
    };

    const deg2rad = (deg: number): number => {
        return deg * (Math.PI / 180);
    };

    return (
        <View style={styles.container}>
            <ColorList color={"#d8b357"} />
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
                {filteredAttractions.map((attraction, index) => (
                    <Marker
                        key={index}
                        coordinate={{ latitude: attraction.latitude, longitude: attraction.longitude }}
                        title={attraction.name}
                        description={attraction.description}
                    >
                        <Image source={require('../../assets/icons/MapPin2.png')} style={{height: 35, width:35 }} />
                    </Marker>
                ))}
            </MapView>
            <BlurView intensity={60} style={styles.sliderContainer}>
                <Slider
                    style={styles.slider}
                    minimumValue={10}
                    maximumValue={500}
                    step={1}
                    value={radius}
                    onValueChange={(value) => setRadius(value)}
                    minimumTrackTintColor="#3f51b5"
                    maximumTrackTintColor="rgba(255, 255, 255, 0.8)"
                    thumbTintColor="#3f51b5"
                />
                <Text style={styles.sliderValue}>{radius} km</Text>
            </BlurView>
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
    sliderContainer: {
        position: 'absolute',
        bottom: 120,
        left: 20,
        right: 20,
        padding: 16,
        borderRadius: 16,
        overflow: 'hidden',
        borderColor: 'rgba(255, 255, 255, 0.5)',
        borderWidth: 1,
    },
    slider: {
        width: '100%',
        height: 40,
    },
    sliderText: {
        color: 'black',
        fontSize: 16,
        marginBottom: 8
    },
    sliderValue: {
        textAlign: 'center',
        marginTop: 8,
        fontSize: 16,
        color: 'white',
        textShadowColor: 'rgba(0, 0, 0, 0.75)',
        textShadowOffset: {width: -1, height: 1},
        textShadowRadius: 10
    },
});

export default Map;