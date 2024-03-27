// import {View, Text, StyleSheet} from 'react-native';
// import React from 'react';
// import Button from './componnt/Button';
// import GettingCalling from './componnt/GettingCalling';
// import Video from './componnt/Video';

// const App = () => {
//   return (
//     <View style={style.container}>
//       {/* <Button inconName="video" backgroundColor="grey" /> */}
//       {/* <GettingCalling /> */}
//       <Video />
//     </View>
//   );
// };

// export default App;
// const style = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
// });

// import React from 'react';
// import {NavigationContainer} from '@react-navigation/native';
// import {createStackNavigator} from '@react-navigation/stack';

// import LoginScreen from './screens/LoginScreen';
// import CallScreen from './screens/CallScreen';
// import {SafeAreaView} from 'react-native-safe-area-context';

// const Stack = createStackNavigator();

// const App = () => {
//   return (
//     <NavigationContainer>
//       <Stack.Navigator>
//         <Stack.Screen
//           name="Login"
//           component={LoginScreen}
//           options={{headerShown: false}}
//         />
//         <Stack.Screen name="Call" component={CallScreen} />
//       </Stack.Navigator>
//     </NavigationContainer>
//   );
// };

// export default App;

// import React, {useEffect, useState} from 'react';
// import {
//   View,
//   StyleSheet,
//   Dimensions,
//   TouchableOpacity,
//   Text,
// } from 'react-native';
// import {RTCPeerConnection, RTCView, mediaDevices} from 'react-native-webrtc';
// import io from 'socket.io-client';

// const signalingServerUrl = 'YOUR_SIGNALING_SERVER_URL';

// export default function App() {
//   const [localStream, setLocalStream] = useState(null);
//   const [remoteStream, setRemoteStream] = useState(null);
//   const [socket, setSocket] = useState(null);
//   const [peerConnection, setPeerConnection] = useState(null);
//   useEffect(() => {
//     const startLocalStream = async () => {
//       const stream = await mediaDevices.getUserMedia({
//         audio: true,
//         video: true,
//       });
//       setLocalStream(stream);
//     };
//     startLocalStream();
//   }, []);
//   useEffect(() => {
//     const socket = io.connect(signalingServerUrl);
//     setSocket(socket);
//     return () => {
//       socket.disconnect();
//       setSocket(null);
//     };
//   }, []);
//   useEffect(() => {
//     if (socket) {
//       socket.on('offer', async offer => {
//         const remotePeerConnection = new RTCPeerConnection();
//         setPeerConnection(remotePeerConnection);
//         // Add local stream to peer connection
//         localStream.getTracks().forEach(track => {
//           remotePeerConnection.addTrack(track, localStream);
//         });
//         // Set remote description and create answer
//         await remotePeerConnection.setRemoteDescription(offer);
//         const answer = await remotePeerConnection.createAnswer();
//         await remotePeerConnection.setLocalDescription(answer);
//         socket.emit('answer', answer);
//       });
//       socket.on('answer', async answer => {
//         await peerConnection.setRemoteDescription(answer);
//       });
//       socket.on('candidate', candidate => {
//         peerConnection.addIceCandidate(candidate);
//       });
//     }
//   }, [socket]);
//   return (
//     <View style={styles.container}>
//       {localStream && (
//         <RTCView streamURL={localStream.toURL()} style={styles.localVideo} />
//       )}

//       {remoteStream && (
//         <RTCView streamURL={remoteStream.toURL()} style={styles.remoteVideo} />
//       )}
//       <TouchableOpacity style={styles.btn}>
//         <Text>Call Cut</Text>
//       </TouchableOpacity>
//       <TouchableOpacity style={styles.btn2}>
//         <Text>Call Cut</Text>
//       </TouchableOpacity>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#F5FCFF',
//   },
//   localVideo: {
//     width: Dimensions.get('window').width,
//     height: Dimensions.get('screen').height,
//   },
//   remoteVideo: {
//     flex: 1,
//   },
//   btn: {
//     width: 50,
//     height: 50,
//     backgroundColor: 'red',
//     borderRadius: 50,
//     position: 'absolute',
//     justifyContent: 'center',
//     alignItems: 'center',
//     bottom: 50,
//     left: 100,
//   },
//   btn2: {
//     width: 50,
//     height: 50,
//     backgroundColor: 'green',
//     borderRadius: 50,
//     position: 'absolute',
//     justifyContent: 'center',
//     bottom: 50,
//     left: 200,
//   },
// });

// import React, {useState, useEffect} from 'react';
// import {View, Button} from 'react-native';
// import {RTCPeerConnection, RTCView, mediaDevices} from 'react-native-webrtc';

// const App = () => {
//   const [localStream, setLocalStream] = useState(null);
//   const [remoteStream, setRemoteStream] = useState(null);
//   const [peerConnection, setPeerConnection] = useState(null);
//   const [socket, setSocket] = useState(null);

//   useEffect(() => {
//     const initialize = async () => {
//       const stream = await mediaDevices.getUserMedia({
//         audio: true,
//         video: true,
//       });
//       setLocalStream(stream);
//     };
//     initialize();

//     // Connect to signaling server
//     const ws = new WebSocket('ws://your_signaling_server_url');
//     ws.onopen = () => {
//       setSocket(ws);
//     };

//     // Handle incoming signaling messages
//     ws.onmessage = event => {
//       const message = JSON.parse(event.data);
//       handleSignalingMessage(message);
//     };

//     return () => {
//       if (ws) {
//         ws.close();
//       }
//     };
//   }, []);

//   const handleSignalingMessage = message => {
//     const {type, data} = message;
//     switch (type) {
//       case 'offer':
//         handleOffer(data);
//         break;
//       case 'answer':
//         handleAnswer(data);
//         break;
//       case 'candidate':
//         handleCandidate(data);
//         break;
//       default:
//         break;
//     }
//   };

//   const handleOffer = async offer => {
//     const pc = new RTCPeerConnection();
//     pc.addStream(localStream);

//     pc.onaddstream = event => {
//       setRemoteStream(event.stream);
//     };

//     pc.setRemoteDescription(new RTCSessionDescription(offer));

//     const answer = await pc.createAnswer();
//     await pc.setLocalDescription(answer);

//     // Send answer to remote peer
//     sendSignalingMessage({type: 'answer', data: answer});

//     setPeerConnection(pc);
//   };

//   // const handleOffer = async () => {
//   //   try {
//   //     const pc = new RTCPeerConnection();
//   //     pc.addStream(localStream);

//   //     pc.onaddstream = event => {
//   //       setRemoteStream(event.stream);
//   //     };

//   //     // Create offer
//   //     const offer = await pc.createOffer();
//   //     await pc.setLocalDescription(offer);

//   //     // Send offer to remote peer
//   //     sendSignalingMessage({type: 'offer', data: offer});

//   //     setPeerConnection(pc);
//   //   } catch (error) {
//   //     console.error('Error starting call:', error);
//   //     // Handle error gracefully, e.g., display error message to user
//   //   }
//   // };

//   const handleAnswer = answer => {
//     peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
//   };

//   const handleCandidate = candidate => {
//     peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
//   };

//   const sendSignalingMessage = message => {
//     socket.send(JSON.stringify(message));
//   };

//   const startCall = async () => {
//     const pc = new RTCPeerConnection();
//     pc.addStream(localStream);

//     pc.onaddstream = event => {
//       setRemoteStream(event.stream);
//     };

//     // Send offer to remote peer
//     const offer = await pc.createOffer();
//     await pc.setLocalDescription(offer);
//     sendSignalingMessage({type: 'offer', data: offer});

//     setPeerConnection(pc);
//   };

//   const hangupCall = () => {
//     if (peerConnection) {
//       peerConnection.close();
//       setPeerConnection(null);
//     }
//     setLocalStream(null);
//     setRemoteStream(null);
//   };

//   return (
//     <View>
//       <RTCView streamURL={localStream ? localStream.toURL() : null} />
//       <RTCView streamURL={remoteStream ? remoteStream.toURL() : null} />
//       <Button title="Start Call" onPress={startCall} />
//       <Button title="Hang Up" onPress={hangupCall} />
//     </View>
//   );
// };

// export default App;

// import React, {useState, useEffect} from 'react';
// import {View, Button} from 'react-native';
// import {RTCView, mediaDevices} from 'react-native-webrtc';

// const VideoCallScreen = () => {
//   const [localStream, setLocalStream] = useState(null);
//   const [remoteStream, setRemoteStream] = useState(null);

//   useEffect(() => {
//     const initialize = async () => {
//       const stream = await mediaDevices.getUserMedia({
//         audio: true,
//         video: true,
//       });
//       setLocalStream(stream);
//     };
//     initialize();
//   }, []);

//   return (
//     <View>
//       <RTCView streamURL={localStream ? localStream.toURL() : null} />
//       <RTCView streamURL={remoteStream ? remoteStream.toURL() : null} />
//       <Button title="Start Call" />
//       <Button title="Hang Up" />
//     </View>
//   );
// };

// export default VideoCallScreen;

// import {
//   View,
//   Text,
//   KeyboardAvoidingView,
//   StyleSheet,
//   SafeAreaView,
//   Button,
// } from 'react-native';
// import React, {useRef, useState} from 'react';
// import {RTCPeerConnection, mediaDevices} from 'react-native-webrtc';
// import firestore from '@react-native-firebase/firestore';

// const App = () => {
//   const [remoteStream, setRemoteStream] = useState(null);
//   const [localStream, setLocalStream] = useState(null);
//   const [webcamStarted, setWebcamStarted] = useState(false);
//   const [channelId, setChannelId] = useState(null);
//   const pc = useRef();
//   const servers = {
//     iceServers: [
//       {
//         urls: [
//           'stun:stun1.l.google.com:19302',
//           'stun:stun2.l.google.com:19302',
//         ],
//       },
//     ],
//     iceCandidatePoolSize: 10,
//   };

//   const startWebcam = async () => {
//     // pc.current = new RTCPeerConnection(servers);
//     // const local = await mediaDevices.getUserMedia({
//     pc.current = new RTCPeerConnection(servers);
//     const local = await mediaDevices.getUserMedia({
//       video: true,
//       audio: true,
//     });
//     // pc.current.addStream(local);
//     // setLocalStream(local);
//     pc.current.addStream(local);
//     setLocalStream(local);

//     const remote = new MediaStream();
//     setRemoteStream(remote);

//     // Push tracks from local stream to peer connection
//     local.getTracks().forEach(track => {
//       pc.current.getLocalStreams()[0].addTrack(track);
//     });
//     // Pull tracks from peer connection, add to remote video stream
//     pc.current.ontrack = event => {
//       event.streams[0].getTracks().forEach(track => {
//         remote.addTrack(track);
//       });
//     };

//     pc.current.onaddstream = event => {
//       setRemoteStream(event.stream);
//     };
//   };

//   const startCall = async () => {
//     const channelDoc = firestore().collection('channels').doc();
//     const offerCandidates = channelDoc.collection('offerCandidates');
//     const answerCandidates = channelDoc.collection('answerCandidates');

//     setChannelId(channelDoc.id);

//     pc.current.onicecandidate = async event => {
//       if (event.candidate) {
//         await offerCandidates.add(event.candidate.toJSON());
//       }
//     };
//     //create offer
//     const offerDescription = await pc.current.createOffer();
//     await pc.current.setLocalDescription(offerDescription);

//     const offer = {
//       sdp: offerDescription.sdp,
//       type: offerDescription.type,
//     };

//     await channelDoc.set({offer});

//     // Listen for remote answer
//     channelDoc.onSnapshot(snapshot => {
//       const data = snapshot.data();
//       if (!pc.current.currentRemoteDescription && data?.answer) {
//         const answerDescription = new RTCSessionDescription(data.answer);
//         pc.current.setRemoteDescription(answerDescription);
//       }
//     });
//     // When answered, add candidate to peer connection
//     answerCandidates.onSnapshot(snapshot => {
//       snapshot.docChanges().forEach(change => {
//         if (change.type === 'added') {
//           const data = change.doc.data();
//           pc.current.addIceCandidate(new RTCIceCandidate(data));
//         }
//       });
//     });
//   };

//   const joinCall = async () => {
//     const channelDoc = firestore().collection('channels').doc(channelId);
//     const offerCandidates = channelDoc.collection('offerCandidates');
//     const answerCandidates = channelDoc.collection('answerCandidates');

//     pc.current.onicecandidate = async event => {
//       if (event.candidate) {
//         await answerCandidates.add(event.candidate.toJSON());
//       }
//     };

//     const channelDocument = await channelDoc.get();
//     const channelData = channelDocument.data();

//     const offerDescription = channelData.offer;

//     await pc.current.setRemoteDescription(
//       new RTCSessionDescription(offerDescription),
//     );

//     const answerDescription = await pc.current.createAnswer();
//     await pc.current.setLocalDescription(answerDescription);

//     const answer = {
//       type: answerDescription.type,
//       sdp: answerDescription.sdp,
//     };

//     await channelDoc.update({answer});

//     offerCandidates.onSnapshot(snapshot => {
//       snapshot.docChanges().forEach(change => {
//         if (change.type === 'added') {
//           const data = change.doc.data();
//           pc.current.addIceCandidate(new RTCIceCandidate(data));
//         }
//       });
//     });
//   };

//   return (
//     <KeyboardAvoidingView style={styles.body} behavior="position">
//       <SafeAreaView>
//         {localStream && (
//           <RTCView
//             streamURL={localStream?.toURL()}
//             style={styles.stream}
//             objectFit="cover"
//             mirror
//           />
//         )}

//         {remoteStream && (
//           <RTCView
//             streamURL={remoteStream?.toURL()}
//             style={styles.stream}
//             objectFit="cover"
//             mirror
//           />
//         )}
//         <View style={styles.buttons}>
//           {!webcamStarted && (
//             <Button title="Start webcam" onPress={startWebcam} />
//           )}
//           {webcamStarted && <Button title="Start call" onPress={startCall} />}
//           {webcamStarted && (
//             <View style={{flexDirection: 'row'}}>
//               <Button title="Join call" onPress={joinCall} />
//               <TextInput
//                 value={channelId}
//                 placeholder="callId"
//                 minLength={45}
//                 style={{borderWidth: 1, padding: 5}}
//                 onChangeText={newText => setChannelId(newText)}
//               />
//             </View>
//           )}
//         </View>
//       </SafeAreaView>
//     </KeyboardAvoidingView>
//   );
// };

// export default App;
// const styles = StyleSheet.create({
//   body: {flex: 1, backgroundColor: '#fff'},
//   stream: {width: 200, height: 200, backgroundColor: 'pink'},
//   buttons: {width: '100%', height: 100, backgroundColor: 'pink'},
// });

import React, {useRef} from 'react';

import {
  Button,
  KeyboardAvoidingView,
  SafeAreaView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';

import {
  RTCPeerConnection,
  RTCIceCandidate,
  RTCSessionDescription,
  RTCView,
  MediaStream,
  mediaDevices,
} from 'react-native-webrtc';
import {useState} from 'react';

import firestore from '@react-native-firebase/firestore';

const App = () => {
  const [remoteStream, setRemoteStream] = useState(null);
  const [webcamStarted, setWebcamStarted] = useState(false);
  const [localStream, setLocalStream] = useState(null);
  const [channelId, setChannelId] = useState(null);
  const pc = useRef();
  const servers = {
    iceServers: [
      {
        urls: [
          'stun:stun1.l.google.com:19302',
          'stun:stun2.l.google.com:19302',
        ],
      },
    ],
    iceCandidatePoolSize: 10,
  };

  const startWebcam = async () => {
    pc.current = new RTCPeerConnection(servers);
    const local = await mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });

    pc.current.addStream(local);
    setLocalStream(local);
    const remote = new MediaStream();
    setRemoteStream(remote);

    // Push tracks from local stream to peer connection
    local.getTracks().forEach(track => {
      console.log(pc.current.getLocalStreams());
      pc.current.getLocalStreams()[0].addTrack(track);
    });

    // Pull tracks from remote stream, add to video stream
    pc.current.ontrack = event => {
      event.streams[0].getTracks().forEach(track => {
        remote.addTrack(track);
      });
    };

    pc.current.onaddstream = event => {
      setRemoteStream(event.stream);
    };

    setWebcamStarted(true);
  };

  const startCall = async () => {
    const channelDoc = firestore().collection('channels').doc();
    const offerCandidates = channelDoc.collection('offerCandidates');
    const answerCandidates = channelDoc.collection('answerCandidates');

    setChannelId(channelDoc.id);

    pc.current.onicecandidate = async event => {
      if (event.candidate) {
        await offerCandidates.add(event.candidate.toJSON());
      }
    };

    //create offer
    const offerDescription = await pc.current.createOffer();
    await pc.current.setLocalDescription(offerDescription);

    const offer = {
      sdp: offerDescription.sdp,
      type: offerDescription.type,
    };

    await channelDoc.set({offer});

    // Listen for remote answer
    channelDoc.onSnapshot(snapshot => {
      const data = snapshot.data();
      if (!pc.current.currentRemoteDescription && data?.answer) {
        const answerDescription = new RTCSessionDescription(data.answer);
        pc.current.setRemoteDescription(answerDescription);
      }
    });

    // When answered, add candidate to peer connection
    answerCandidates.onSnapshot(snapshot => {
      snapshot.docChanges().forEach(change => {
        if (change.type === 'added') {
          const data = change.doc.data();
          pc.current.addIceCandidate(new RTCIceCandidate(data));
        }
      });
    });
  };

  const joinCall = async () => {
    const channelDoc = firestore().collection('channels').doc(channelId);
    const offerCandidates = channelDoc.collection('offerCandidates');
    const answerCandidates = channelDoc.collection('answerCandidates');

    pc.current.onicecandidate = async event => {
      if (event.candidate) {
        await answerCandidates.add(event.candidate.toJSON());
      }
    };

    const channelDocument = await channelDoc.get();
    const channelData = channelDocument.data();

    const offerDescription = channelData.offer;

    await pc.current.setRemoteDescription(
      new RTCSessionDescription(offerDescription),
    );

    const answerDescription = await pc.current.createAnswer();
    await pc.current.setLocalDescription(answerDescription);

    const answer = {
      type: answerDescription.type,
      sdp: answerDescription.sdp,
    };

    await channelDoc.update({answer});

    offerCandidates.onSnapshot(snapshot => {
      snapshot.docChanges().forEach(change => {
        if (change.type === 'added') {
          const data = change.doc.data();
          pc.current.addIceCandidate(new RTCIceCandidate(data));
        }
      });
    });
  };

  return (
    <KeyboardAvoidingView style={styles.body} behavior="position">
      <SafeAreaView>
        {localStream && (
          <RTCView
            streamURL={localStream?.toURL()}
            style={styles.stream}
            objectFit="cover"
            mirror
          />
        )}

        {remoteStream && (
          <RTCView
            streamURL={remoteStream?.toURL()}
            style={styles.stream}
            objectFit="cover"
            mirror
          />
        )}
        <View style={styles.buttons}>
          {!webcamStarted && (
            <Button title="Start webcam" onPress={startWebcam} />
          )}
          {webcamStarted && <Button title="Start call" onPress={startCall} />}
          {webcamStarted && (
            <View style={{flexDirection: 'row'}}>
              <Button title="Join call" onPress={joinCall} />
              <TextInput
                value={channelId}
                placeholder="callId"
                minLength={45}
                style={{borderWidth: 1, padding: 5}}
                onChangeText={newText => setChannelId(newText)}
              />
            </View>
          )}
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  body: {
    backgroundColor: '#fff',

    justifyContent: 'center',
    alignItems: 'center',
    ...StyleSheet.absoluteFill,
  },
  stream: {
    flex: 2,
    width: 200,
    height: 200,
  },
  buttons: {
    alignItems: 'flex-start',
    flexDirection: 'column',
  },
});

export default App;

// import {View, Text} from 'react-native';
// import React, {useEffect} from 'react';
// import firestore from '@react-native-firebase/firestore';

// const App = () => {
//   useEffect(() => {
//     firestore()
//       .collection('Users')
//       .add({
//         name: 'virendra',
//         age: 22,
//       })
//       .then(response => console.log('all is ok', response))
//       .catch(err => console.log('not work', err));
//   }, []);

//   return (
//     <View>
//       <Text>App</Text>
//     </View>
//   );
// };

// export default App;
