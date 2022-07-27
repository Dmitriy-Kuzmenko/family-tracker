import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { View, StyleSheet } from 'react-native';

import { Title } from 'react-native-paper';

import FormInput from '../components/FormInput';
import FormButton from '../components/FormButton';

import { login } from '../actions/index';

export default function LoginScreen({ navigation }) {
  const dispatch = useDispatch();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const loginHandler = async () => {
    await dispatch(login(username, password));
  }

  return (
    <View style={styles.container}>
      <Title style={styles.titleText}>Welcome to Location app</Title>
      <FormInput
        labelName='Username'
        value={username}
        autoCapitalize='none'
        onChangeText={username => setUsername(username)}
      />
      <FormInput
        labelName='Password'
        value={password}
        secureTextEntry={true}
        onChangeText={userPassword => setPassword(userPassword)}
      />
      <FormButton
        title='Login'
        modeValue='contained'
        labelStyle={styles.loginButtonLabel}
        onPress={() => loginHandler()}
      />
      <FormButton
        title='New user? Join here'
        modeValue='text'
        uppercase={false}
        labelStyle={styles.navButtonText}
        onPress={() => navigation.navigate('RegistrationScreen', {})}
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
    fontSize: 16
  }
});
