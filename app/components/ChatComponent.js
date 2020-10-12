import React, { Component } from 'react';
import { View, StyleSheet, TextInput, TouchableOpacity, Image } from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

class ChatComponent extends Component {

    constructor(props) {
        super(props)
        this.state = {
            messageData:''
        }
    }

    _onSendButtonPress() {
        var sendMessage=this.state.messageData
        this.setState({messageData:''})
        this.props.messageValue(sendMessage);      
    }

    render() {
        return (
            <View style={styles.bottomView}>
                <View style={styles.textInputViewStyle}>
                    <TextInput placeholder="Say Something"
                        placeholderTextColor="white"
                        style={styles.textInputStyle}
                        onChangeText={(text) => { this.setState({ messageData: text }) }}>
                    </TextInput>
                </View>
                <TouchableOpacity style={styles.sendIconViewStyle} onPress={() => this._onSendButtonPress()}>
                    <Image
                        source={require('../res/Images/send.png')}
                        style={{
                            height: hp('3%'), width: hp('3%'), tintColor: 'white'
                        }}
                    ></Image>
                </TouchableOpacity>
            </View>
        )
    }
}
export default ChatComponent

const styles = StyleSheet.create({
    bottomView: {
        width: '100%',
        height: hp('7%'),
        //backgroundColor: 'transparent',
        backgroundColor: '#808080',
        opacity: 0.7,
        flexDirection: 'row',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute', 
        bottom: 0, 
    },
    textInputViewStyle: {
        flex: 0.8
    },
    textInputStyle: {
        margin: hp('1%'),
        color: 'white',
        fontWeight: "bold",
        alignItems: 'center'

    },
    sendIconViewStyle: {
        flex: 0.2,
        alignItems: 'flex-end',
        paddingRight: wp('2%')
    }
});