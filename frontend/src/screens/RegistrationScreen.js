import React, { useState } from 'react';

import { useDispatch } from 'react-redux';
import { register } from '../actions/index';

import { View, StyleSheet } from 'react-native';
import { Title, IconButton } from 'react-native-paper';

import FormInput from '../components/FormInput';
import FormButton from '../components/FormButton';

export default function RegistrationScreen({ navigation }) {
  const dispatch = useDispatch();

  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const registerHandler = async () => {
    await dispatch(register(email, username, password));
  };

  return (
    <View style={styles.container}>
      <Title style={styles.titleText}>Register</Title>
      <FormInput
        labelName='Username'
        value={username}
        autoCapitalize='none'
        onChangeText={username => setUsername(username)}
      />
      <FormInput
        labelName='Email'
        value={email}
        autoCapitalize='none'
        onChangeText={userEmail => setEmail(userEmail)}
      />
      <FormInput
        labelName='Password'
        value={password}
        secureTextEntry={true}
        onChangeText={userPassword => setPassword(userPassword)}
      />
      <FormButton
        title='Signup'
        modeValue='contained'
        labelStyle={styles.loginButtonLabel}
        onPress={() => registerHandler()}
      />
      <IconButton
        icon='keyboard-backspace'
        size={30}
        style={styles.navButton}
        color='#6646ee'
        onPress={() => navigation.goBack()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f5f5f5',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  titleText: {
    fontSize: 24,
    marginBottom: 10
  },
  loginButtonLabel: {
    fontSize: 22
  },
  navButtonText: {
    fontSize: 18
  },
  navButton: {
    marginTop: 10
  }
});
