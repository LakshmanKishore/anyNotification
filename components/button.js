import React from 'react';
import { TouchableOpacity, Text, View, StyleSheet } from 'react-native';

const Mybttn = ({ title, press }) => {
    return (
        <View>
            <TouchableOpacity
                style={styles.btn}
                onPress={press} >
                <Text style={styles.btntxt}>{title}</Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    btn: {
        backgroundColor:'#2ecc71',
        width:250,
        height:50,
        marginTop:50,
        justifyContent:'center',
        alignItems:'center',
        borderRadius:20,
    },
    btntxt: {
        fontSize:25,
        fontWeight:'bold',
        color:'#fff',
    },
})

export default Mybttn;