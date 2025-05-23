import React, { useState } from 'react';
import { StyleSheet, View, Alert } from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';
import Container from '../components/Container';
import Body from '../components/Body';
import Input from '../components/Input';
import Logo from '../components/Logo';

const Login = () => {

  const [email, setEmail] = useState('klebersouza@pucminas.br');
  const [password, setPassword] = useState('pucminas');


  return (
    <Container>


      
      <View style={styles.header}>
        <Logo></Logo>
      </View>



      <Body>
        <Input
          label="Email"
          value={email}
          onChangeText={(text) => setEmail(text)}
          left={<TextInput.Icon icon="account" />}
        />
        <Input
          label="Senha"
          value={password}
          secureTextEntry
          onChangeText={(text) => setPassword(text)}
          left={<TextInput.Icon icon="key" />}
        />
        <Button style={styles.button} mode="contained"   onPress={()=> console.log('Pressed')} >Login </Button>
        <Button  style={styles.button} mode="outlined" onPress={()=> console.log('Pressed')} >Registrar </Button>
      </Body>
    </Container>
  );
};

const styles = StyleSheet.create({
  button: {
    marginBottom: 8,
  },
  textHeader: {
    textAlign: 'center',
  },
  header: {
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 12
  },
});

export default Login;