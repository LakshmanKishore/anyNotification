import React from 'react';
import { TouchableOpacity, Text, View, StyleSheet } from 'react-native';

const Plus = ({ press }) => {
    return (
        <View>
            <TouchableOpacity
                style={styles.btn}
                onPress={press} >
                <Text style={styles.btntxt}>+</Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    btn: {
        backgroundColor: '#4CAF50',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 60,
        width: 60,
        height: 60,
        paddingBottom: 6,
    },
    btntxt: {
        fontSize: 60,
        color: '#fff',
        textAlign: 'center',
    },
})

export default Plus;