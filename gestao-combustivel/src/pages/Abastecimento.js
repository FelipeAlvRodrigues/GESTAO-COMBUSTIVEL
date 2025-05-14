import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Platform, Alert } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import {
  RadioButton,
  Text,
  TextInput,
  Button,
  Appbar,
  Portal,
  Modal,
} from 'react-native-paper';
import Header from '../components/Header';
import Container from '../components/Container';
import Body from '../components/Body';
import Input from '../components/Input';

const Abastecimento = ({route}) => {
  const navigation = useNavigation();
  const {item} =route.params? route.params: {};
  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [tipo, setTipo] = useState('gas');
  
  const [preco, setPreco] = useState('');
  const [valor, setValor] = useState('');
  const [odometro, setOdometro] = useState('');
  const [data, setData] = useState('');

  useEffect(() =>{
    if(item){
      setTipo(item.tipo == 0? 'gas': 'eta');
      setData(item.data);
      setPreco(item.preco.toFixed(2));
      setValor(item.valor.toFixed(2));
      setOdometro(item.odometro.toFixed(0));

    }
  }, [item]);

  // Log quando o componente monta
  useEffect(() => {
    console.log('Componente Abastecimento montado');
    // Definir a data inicial formatada
    const hoje = new Date();
    setDate(hoje);
    setData(hoje.toLocaleDateString('pt-BR'));
    console.log('Data inicial definida:', hoje.toLocaleDateString('pt-BR'));
  }, []);

  // Log quando show muda
  useEffect(() => {
    console.log('Estado do show mudou para:', show);
  }, [show]);

  const showDatePicker = () => {
    console.log('Botão de data clicado, tentando mostrar o picker');
    if (Platform.OS === 'ios') {
      // No iOS, vamos mostrar o DatePicker em um modal
      setModalVisible(true);
    } else {
      // No Android, usamos o DateTimePicker padrão
      setShow(true);
    }
  };

  const onChange = (event, selectedDate) => {
    console.log('onChange chamado', event, selectedDate);
    
    // Fecha o picker padrão no Android
    setShow(false);
    
    if (selectedDate) {
      setDate(selectedDate);
      // Formata a data para exibição
      const formattedDate = selectedDate.toLocaleDateString('pt-BR');
      setData(formattedDate);
      console.log('Data selecionada e formatada:', formattedDate);
    } else {
      console.log('Nenhuma data selecionada ou ação cancelada');
    }
  };

  // Função para confirmar a data no modal (iOS)
  const handleConfirmDate = () => {
    setModalVisible(false);
    const formattedDate = date.toLocaleDateString('pt-BR');
    setData(formattedDate);
    console.log('Data confirmada no modal:', formattedDate);
  };

  const handleSalvar = () => {
    console.log('Salvar');
    // Verificação para debug
    if (!data) {
      Alert.alert('Atenção', 'Selecione uma data antes de salvar');
    }
  };

  const handleExcluir = () => {
    console.log('Excluir');
  };

  return (
    <SafeAreaProvider>
      <Container>
        <Header title={'Abastecimento'} goBack={() => navigation.goBack()}>
          <Appbar.Action icon="check" onPress={handleSalvar} />
        {
          item && 
          <Appbar.Action icon="trash-can" onPress={handleExcluir} />
        }
        </Header>
        <Body>
          <View style={styles.containerRadio}>
            <View style={styles.containerRadioItem}>
              <RadioButton
                value="gas"
                status={tipo === 'gas' ? 'checked' : 'unchecked'}
                color={'red'}
                onPress={() => setTipo('gas')}
              />
              <Text>Gasolina</Text>
            </View>
            
            <View style={styles.containerRadioItem}>
              <RadioButton
                value="eta"
                status={tipo === 'eta' ? 'checked' : 'unchecked'}
                color={'green'}
                onPress={() => setTipo('eta')}
              />
              <Text>Etanol</Text>
            </View>
          </View>
          
          {/* Removemos o botão de teste já que agora temos uma solução melhor */}
          
          {/* MÉTODO 1: Renderização condicional para Android */}
          {show && Platform.OS === 'android' && (
            <DateTimePicker
              testID="dateTimePicker"
              value={date}
              mode="date"
              is24Hour={true}
              display="default"
              onChange={onChange}
            />
          )}
          
          {/* MÉTODO 2: Modal para iOS */}
          <Portal>
            <Modal
              visible={modalVisible}
              onDismiss={() => setModalVisible(false)}
              contentContainerStyle={styles.modalContainer}
            >
              <Text style={styles.modalTitle}>Selecione uma data</Text>
              <DateTimePicker
                testID="dateTimePickerIOS"
                value={date}
                mode="date"
                is24Hour={true}
                display="spinner"
                onChange={(e, selectedDate) => {
                  if (selectedDate) setDate(selectedDate);
                }}
                style={{ width: 300, height: 200 }}
              />
              <View style={styles.modalButtons}>
                <Button onPress={() => setModalVisible(false)}>Cancelar</Button>
                <Button onPress={handleConfirmDate} mode="contained">Confirmar</Button>
              </View>
            </Modal>
          </Portal>
          
          {/* Campo de entrada para a data - Implementação Alternativa */}
          <View style={styles.dateInputContainer}>
            <Text style={styles.inputLabel}>Data</Text>
            <Button 
              mode="outlined"
              onPress={showDatePicker}
              style={styles.dateButton}
              contentStyle={styles.dateButtonContent}
              icon="calendar"
            >
              {data}
            </Button>
          </View>
          
          {/* Código original comentado para referência 
          <TouchableOpacity 
            onPress={showDatePicker} 
            activeOpacity={0.6}
            style={styles.dateInputContainer}
          >
            <Input
              label="Data"
              value={data}
              left={<TextInput.Icon icon="calendar" />}
              editable={false}
              right={<TextInput.Icon icon="chevron-down" />}
              style={styles.dateInput}
            />
          </TouchableOpacity>
          */}
          
          <Input
            label="Preço"
            value={preco}
            onChangeText={(text) => setPreco(text)}
            left={<TextInput.Icon icon="currency-brl" />}
            keyboardType="numeric"
          />
          
          <Input
            label="Valor"
            value={valor}
            onChangeText={(text) => setValor(text)}
            left={<TextInput.Icon icon="currency-brl" />}
            keyboardType="numeric"
          />
          
          <Input
            label="Odomêtro"
            value={odometro}
            onChangeText={(text) => setOdometro(text)}
            left={<TextInput.Icon icon="camera-timer" />}
            keyboardType="numeric"
          />
          
          <Button mode="contained" style={styles.button} onPress={handleSalvar}>
            Salvar
          </Button>
          
          {item && (
          <Button
            mode="contained"
            buttonColor={'red'}
            style={styles.button}
            onPress={handleExcluir}>
            Excluir
          </Button>
        )}

        </Body>
      </Container>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  containerRadio: {
    flexDirection: 'row',
    margin: 8,
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  containerRadioItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  button: {
    marginBottom: 8,
  },
  dateInputContainer: {
    marginBottom: 16,
    width: '100%',
  },
  dateInput: {
    width: '100%',
  },
  dateButton: {
    width: '100%',
    borderColor: '#ccc',
    borderWidth: 1,
    marginTop: 4,
  },
  dateButtonContent: {
    height: 50,
    justifyContent: 'flex-start',
  },
  inputLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
    margin: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 20,
  },
});

export default Abastecimento;