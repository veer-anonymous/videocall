import {View, Text, StyleSheet} from 'react-native';
import React from 'react';
import {MediaStream, RTCView} from 'react-native-webrtc';
import Button from './Button';

interface Props {
  hangup: () => void;
  localStream?: MediaStream | null;
  remoteStream?: MediaStream | null;
}
function BUttonContainer(props: Props) {
  return (
    <View style={styles.bContainer}>
      <Button inconName="phone" backgroundColor="red" onPress={props.hangup} />
    </View>
  );
}
export default function Video(props: Props) {
  // On call we will just display the local stream
  if (props.localStream && !props.remoteStream) {
    return (
      <View style={styles.container}>
        <RTCView
          streamURL={props.localStream.toURL()}
          objectFit={'cover'}
          style={styles.video}
        />
        <BUttonContainer hangup={props.hangup} />
      </View>
    );
  }
  // Once the call is connected we will display
  // local Stream on top of remote stream
  if (props.localStream && props.remoteStream) {
    return (
      <View style={styles.container}>
        <RTCView
          streamURL={props.remoteStream.toURL()}
          objectFit={'cover'}
          style={styles.videoCall}
        />
        <RTCView
          streamURL={props.localStream.toURL()}
          objectFit={'cover'}
          style={styles.video}
        />
        <BUttonContainer hangup={props.hangup} />
      </View>
    );
  }
  return <BUttonContainer hangup={props.hangup} />;
}
// rst
const styles = StyleSheet.create({
  bContainer: {
    flexDirection: 'row',
    bottom: 30,
  },
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    alignSelf: 'center',
  },
  video: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  videoCall: {
    position: 'absolute',
    width: 100,
    height: 150,
    top: 0,
    left: 20,
    elevation: 20,
  },
});

// import {View, Text} from 'react-native';
// import React from 'react';

// const Video = () => {
//   return (
//     <View>
//       <Text>Video</Text>
//     </View>
//   );
// };

// export default Video;
