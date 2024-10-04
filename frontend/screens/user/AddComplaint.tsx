import * as React from 'react';
import { View,Text,TouchableOpacity,StyleSheet, ScrollView} from 'react-native';
import Form from '@/components/vindi/Form';


const AddComplaint: React.FC =() => {

    return(

        
        
        <View style={styles.container}>
       
       
            
                <Form/>
            


        </View>
        


    );
};

const styles = StyleSheet.create({
    container: {
        flex: 0,
        
        
        
    
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
      
        paddingVertical: 10,
      },
      header: {
        width: '100%',
        height: 80,
        backgroundColor: '#4CAF50',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 4,
        
      },
      
    
      headerTitle: {
        fontSize: 25,
        color: 'white',
        fontWeight:'bold',
       
      },


});

export default AddComplaint;

