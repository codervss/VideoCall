import React, { PureComponent } from 'react';
import { View, PermissionsAndroid, Platform, StyleSheet, TouchableOpacity } from 'react-native'
import {
  TwilioVideoLocalView,
  TwilioVideoParticipantView,
  TwilioVideo
} from 'react-native-twilio-video-webrtc'
import MIcon from 'react-native-vector-icons/MaterialIcons';
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const CALL_STATUS = {
    DISCONNECTED : 'disconnected',
    CONNECTING : 'connecting',
    CONNECTED : 'connected'
}

export async function GetAllPermissions() {
  
  try {
    if (Platform.OS === "android") {
      const userResponse = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.CAMERA,
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
      ]);  

      return userResponse;
    }
  } catch (err) {
    console.log(err);
  }
  return null;
}

class VideoComponent extends PureComponent {
    constructor(props){
        super(props)
        this.state = {
            isAudioEnabled: true,
            isVideoEnabled: true,
            isButtonDisplay: true,
            status: CALL_STATUS.DISCONNECTED,
            participants: new Map(),
            videoTracks: new Map(),
            token: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiIsImN0eSI6InR3aWxpby1mcGE7dj0xIn0.eyJqdGkiOiJTSzEzMGQ3NTZiNzEyMzY4MTk4NGEwM2U2OTZkNzM2MjY2LTE2MDI0ODk0ODciLCJpc3MiOiJTSzEzMGQ3NTZiNzEyMzY4MTk4NGEwM2U2OTZkNzM2MjY2Iiwic3ViIjoiQUNiNzU5M2MxOWY3NzI1OTkxNzAwMDVkNThmNjIwYmVhNiIsImV4cCI6MTYwMjQ5MzA4NywiZ3JhbnRzIjp7ImlkZW50aXR5IjoiVGVzdCIsInZpZGVvIjp7InJvb20iOiJUZXN0In19fQ.Gl2dQNoSRoGWiVa2FiG8I8PMpNgR4YiKaIymNJFStv0',
            messageData: []
          }
    }

    componentWillMount() {
      GetAllPermissions();
    }

    componentDidMount(){
        this._onConnectButtonPress()
    }
  
    _onConnectButtonPress = () => {
      this.refs.twilioVideo.connect({ accessToken: this.state.token })
      this.setState({status: CALL_STATUS.CONNECTING})
    }
  
    _onEndButtonPress = () => {
      this.props.goBack()
      this.refs.twilioVideo.disconnect()
    }
  
    _onMuteButtonPress = () => {
      this.refs.twilioVideo.setLocalAudioEnabled(!this.state.isAudioEnabled)
        .then(isEnabled => this.setState({isAudioEnabled: isEnabled}))
    }
  
    _onFlipButtonPress = () => {
      this.refs.twilioVideo.flipCamera()
    }
  
    _onRoomDidConnect = ({ roomName, error }) => {
      console.log('onRoomDidConnect: ', roomName);
  
      this.setState({ status: CALL_STATUS.CONNECTED });
    };
  
    _onRoomDidDisconnect = ({roomName, error}) => {
      console.log("ERROR: ", error)
  
      this.setState({status: CALL_STATUS.DISCONNECTED})
    }
  
    _onRoomDidFailToConnect = (error) => {
      console.log("ERROR: ", error)
  
      this.setState({status: CALL_STATUS.DISCONNECTED})
    }
  
    _onParticipantAddedVideoTrack = ({participant, track}) => {
      console.log("onParticipantAddedVideoTrack: ", participant, track)
  
      this.setState({
        videoTracks: new Map([
          ...this.state.videoTracks,
          [track.trackSid, { participantSid: participant.sid, videoTrackSid: track.trackSid }]
        ]),
      });
    }
  
    _onParticipantRemovedVideoTrack = ({participant, track}) => {
      console.log("onParticipantRemovedVideoTrack: ", participant, track)
  
      const videoTracks = this.state.videoTracks
      videoTracks.delete(track.trackSid)
  
      this.setState({videoTracks: { ...videoTracks }})
    }
  
    render() {
      return (
        <View style={{flex : 1}}>

          <View
              style = {
                {
                  display: this.state.isButtonDisplay ? "flex" : "none",
                  position: "absolute",
                  left: 0,
                  top: 0,
                  right: 0,
                  height: 100,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-evenly",
                  zIndex: this.state.isButtonDisplay ? 2 : 0,
                }
              } >

              <TouchableOpacity
                style={
                    {
                      display: this.state.isButtonDisplay ? "flex" : "none",
                      width: 60,
                      height: 60,
                      marginLeft: 10,
                      marginRight: 10,
                      borderRadius: 100 / 2,
                      backgroundColor: 'grey',
                      justifyContent: 'center',
                      alignItems: "center"
                    }
                  }
                onPress={()=>{}}>
                < MIcon name ={"chat"} size={24} color='#fff' />
              </TouchableOpacity>

                </View>

        {
          (this.state.status === CALL_STATUS.CONNECTED || this.state.status === CALL_STATUS.CONNECTING) &&
            <View style={styles.callContainer}>
            {
              this.state.status === CALL_STATUS.CONNECTED &&
              <View style={styles.remoteGrid}>
                <TouchableOpacity style = {styles.remoteVideo} onPress={()=>{this.setState({isButtonDisplay:!this.state.isButtonDisplay})}} >
                {
                  Array.from(this.state.videoTracks, ([trackSid, trackIdentifier]) => {
                    return (
                        <TwilioVideoParticipantView
                          style={styles.remoteVideo}
                          key={trackSid}
                          trackIdentifier={trackIdentifier}
                        />
                    )
                  })
                }
                </TouchableOpacity>
                <TwilioVideoLocalView
                  enabled={true}
                  style = {this.state.isButtonDisplay ? styles.localVideoOnButtonEnabled : styles.localVideoOnButtonDisabled} 
                />
              </View>
            }
            <View
              style = {
                {
                  display: this.state.isButtonDisplay ? "flex" : "none",
                  position: "absolute",
                  left: 0,
                  bottom: 0,
                  right: 0,
                  height: 100,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-evenly",
                  zIndex: this.state.isButtonDisplay ? 2 : 0,
                }
              } >
              <TouchableOpacity
                style={
                    {
                      display: this.state.isButtonDisplay ? "flex" : "none",
                      width: 60,
                      height: 60,
                      marginLeft: 10,
                      marginRight: 10,
                      borderRadius: 100 / 2,
                      backgroundColor: 'grey',
                      justifyContent: 'center',
                      alignItems: "center"
                    }
                  }
                onPress={this._onMuteButtonPress}>
                < MIcon name ={this.state.isAudioEnabled ? "mic" : "mic-off"} size={24} color='#fff' />
              </TouchableOpacity>
               <TouchableOpacity
                style={
                    {
                      display: this.state.isButtonDisplay ? "flex" : "none",
                      width: 60,
                      height: 60,
                      marginLeft: 10,
                      marginRight: 10,
                      borderRadius: 100 / 2,
                      backgroundColor: 'grey',
                      justifyContent: 'center',
                      alignItems: "center"
                    }
                  }
                onPress={this._onEndButtonPress}>
                < MIcon name = "call-end" size={28} color='#fff' />
              </TouchableOpacity>
              <TouchableOpacity
                style={
                    {
                      display: this.state.isButtonDisplay ? "flex" : "none",
                      width: 60,
                      height: 60,
                      marginLeft: 10,
                      marginRight: 10,
                      borderRadius: 100 / 2,
                      backgroundColor: 'grey',
                      justifyContent: 'center',
                      alignItems: "center"
                    }
                  }
                onPress={this._onFlipButtonPress}>
                < MCIcon name = "rotate-3d" size={28} color='#fff' />
              </TouchableOpacity>
            </View>
          
          </View>
        }
  
          <TwilioVideo
            ref="twilioVideo"
            onRoomDidConnect={ this._onRoomDidConnect }
            onRoomDidDisconnect={ this._onRoomDidDisconnect }
            onRoomDidFailToConnect= { this._onRoomDidFailToConnect }
            onParticipantAddedVideoTrack={ this._onParticipantAddedVideoTrack }
            onParticipantRemovedVideoTrack= { this._onParticipantRemovedVideoTrack }
          />
        </View>
      );
    }
  } 

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: 'white'
    },
    callContainer: {
      flex: 1,
      position: "absolute",
      bottom: 0,
      top: 0,
      left: 0,
      right: 0,
      minHeight:"100%"
    },
    welcome: {
      fontSize: 30,
      textAlign: 'center',
      paddingTop: 40
    },
    input: {
      height: 50,
      borderWidth: 1,
      marginRight: 70,
      marginLeft: 70,
      marginTop: 50,
      textAlign: 'center',
      backgroundColor: 'white'
    },
    button: {
      marginTop: 100
    },
    localVideoOnButtonEnabled: {
      bottom: ("40%"),
      width: "35%",
      left: "64%",
      height: "25%",
      zIndex: 2,
    },
    localVideoOnButtonDisabled: {
      bottom: ("30%"),
      width: "35%",
      left: "64%",
      height: "25%",
      zIndex: 2,
    },
    remoteGrid: {
      flex: 1,
      flexDirection: "column",
    },
    remoteVideo: {
      width: wp("100%"),
      height: hp("100%"),
      zIndex: 1,
    },
    optionsContainer: {
      position: "absolute",
      left: 0,
      bottom: 0,
      right: 0,
      height: 100,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-evenly",
      zIndex: 2,
    },
    optionButton: {
      width: 60,
      height: 60,
      marginLeft: 10,
      marginRight: 10,
      borderRadius: 100 / 2,
      backgroundColor: 'grey',
      justifyContent: 'center',
      alignItems: "center"
    },
    spacing: {
      padding: 10
    },
    inputLabel: {
      fontSize: 18
    },
    buttonContainer: {
      height: 45,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 20,
      width: wp('90%'),
      borderRadius: 30,
    },
    loginButton: {
      backgroundColor: "#1E3378",
      width: wp('90%'),
      justifyContent: 'center',
      alignItems: 'center',
      marginLeft: 20,
      marginTop: 10
    },
    Buttontext: {
      color: 'white',
      fontWeight: '500',
      fontSize: 18
    },
    inputBox: {
      borderBottomColor: '#cccccc',
      fontSize: 16,
      width: wp("95%"),
      borderBottomWidth:1
    },
  });

  export default VideoComponent