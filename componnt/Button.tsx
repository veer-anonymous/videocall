// import {View, Text, StyleSheet} from 'react-native';
// import React from 'react';

// const Button = () => {
//   return (
//     <View style={style.container}>
//       <Text>Button</Text>
//     </View>
//   );
// };

// export default Button;
// const style = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
// });
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/FontAwesome5';
// import Icon from 'react-native-vector-icons/FontAwesome5';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import Feather from 'react-native-vector-icons/Feather';

interface Props {
  onPress?: any;
  inconName: string;
  backgroundColor: string;
  style?: any;
}

export default function Button(props: Props) {
  return (
    <View>
      <TouchableOpacity
        onPress={props.onPress}
        style={[
          {backgroundColor: props.backgroundColor},
          props.style,
          styles.button,
        ]}>
        <Icon name={props.inconName} color={'white'} size={20} />
        {/* <FontAwesome5Icon name="video" color={'white'} size={22} /> */}
        {/* <Feather name="video" color={'green'} size={25} /> */}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 60,
    height: 60,
    padding: 10,
    elevation: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 100,
  },
});
