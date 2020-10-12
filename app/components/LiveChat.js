import React,{PureComponent} from 'react'
import {FlatList, View, Text, StyleSheet} from 'react-native'

export default class LiveChat extends PureComponent{

    constructor(props){
        super(props)

    }

    _renderItems(item) {
        console.log("item", item)
        return (
          <View style={styles.itemOuterLayout}>
            <View style={styles.itemLayout}>
              <Text style={styles.messageTextStyle}>{item}</Text>
            </View>
          </View>
        )
      }

    render(){
        return (
            <View style={{ flex: 1, flexDirection: 'row' }}>
              <View style={{ flex: 0.8 }}>
                <FlatList
                  inverted
                  style={{ marginBottom: hp('10%') }}
                  data={Data}
                  extraData={messageData}
                  keyExtractor={(item, index) => index.toString()}
                  renderItem={({ item }) => this._renderItems(item)} />
              </View>
            </View>
          )
    }
}


const styles = StyleSheet.create({
    itemOuterLayout: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
      },
      itemLayout: {
        marginLeft: hp('1%'),
        padding: hp('1%'),
        marginTop: hp('1%'),
        borderRadius: hp('1%'),
        backgroundColor: '#808080',
        opacity: 0.5,
      },
      messageTextStyle: {
        color: 'white',
        fontSize: wp('4%'),
        paddingLeft: wp('1%'),
        fontWeight: "bold"
      }
})

