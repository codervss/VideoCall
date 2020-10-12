import React, {Component} from 'react';
import {
  View,
  StyleSheet,
  Button,
  ImageBackground,
  FlatList,
  Text,
  Image,
} from 'react-native';
import Modal from 'react-native-modal';
import ChatComponent from './app/components/ChatComponent';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import VideoComponent from './app/components/VideoComponent';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isModalVisible: false,
    };
  }

  _handleMessageValue(text) {
    this.array.push(text);
    this.array.reverse();

    this.setState({messageData: [...this.array]});
  }

  // _renderItems(item) {
  //   console.log("item", item)
  //   return (
  //     <View style={styles.itemOuterLayout}>
  //       <View style={styles.itemLayout}>
  //         <Text style={styles.messageTextStyle}>{item}</Text>
  //       </View>
  //     </View>
  //   )
  // }

  // _renderMessage() {
  //   const { messageData } = this.state
  //   return (
  //     <View style={{ flex: 1, flexDirection: 'row' }}>
  //       <View style={{ flex: 0.8 }}>
  //         <FlatList
  //           inverted
  //           style={{ marginBottom: hp('10%') }}
  //           data={Data}
  //           extraData={messageData}
  //           keyExtractor={(item, index) => index.toString()}
  //           renderItem={({ item }) => this._renderItems(item)} />
  //       </View>
  //     </View>
  //   )
  // }

  render() {
    const {isModalVisible} = this.state;

    return isModalVisible ? (
      <VideoComponent goBack={()=>this.setState({isModalVisible : false})} />
    ) :
    (
      <View style={styles.container}>
        <Button
            title="Show modal"
            onPress={() => this.setState({isModalVisible: !isModalVisible})}
          />
      </View>
    )
      
  }
}
export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backgroundImageStyle: {
    flex: 1,
    justifyContent: 'center',
  },
});
