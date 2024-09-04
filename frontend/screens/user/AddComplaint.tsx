import * as React from 'react';
import { View,Text,TouchableOpacity,StyleSheet, ScrollView} from 'react-native';
import Form from '@/components/vindi/Form';

const AddComplaint: React.FC =() => {

    return(

        
        <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.container}>
            
                <Form/>
            


        </View>
        </ScrollView>


    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        
    
    },
    title: {
        marginTop: 30,
        color: 'black',
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 2,
    },
    scrollContent: {
        alignItems: 'center',
        paddingVertical: 10,
      },


});

export default AddComplaint;

