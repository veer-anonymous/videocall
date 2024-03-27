import {View, Text, StyleSheet, Image} from 'react-native';
import React from 'react';
import Button from './Button';

interface Props {
  hangup: () => void;
  join: () => void;
}
export default function GettingCalling(props: Props) {
  return (
    <View style={styles.container}>
      <Image
        source={require('../src/images/wallper.jpg')}
        style={styles.image}
      />
      <View style={styles.bContainer}>
        <Button
          inconName="phone"
          backgroundColor="green"
          onPress={props.join}
          style={styles.button}
        />
        <Button
          inconName="phone"
          backgroundColor="red"
          onPress={props.join}
          style={styles.button}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    position: 'absolute',
    resizeMode: 'cover',
    width: '100%',
    height: '100%',
  },
  bContainer: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 10,
  },
  button: {
    marginLeft: 30,
  },
});
