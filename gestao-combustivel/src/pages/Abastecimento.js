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
import { insertGasto, getGastos, updateGasto, deleteGasto } from '../services/Gastos.Services';

const Abastecimento = ({ route }) => {
  const navigation = useNavigation();
  const { item } = route.params ? route.params : {};
  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [tipo, setTipo] = useState('gas');

  const [preco, setPreco] = useState('');
  const [valor, setValor] = useState('');
  const [odometro, setOdometro] = useState('');
  const [data, setData] = useState('');

  useEffect(() => {
    if (item) {
      setTipo(item.tipo == 0 ? 'gas' : 'eta');
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

  const handleSalvar = async () => {
    try {
      // Validação dos campos obrigatórios
      if (!preco || !valor || !odometro || !data) {
        Alert.alert(
          "Campos obrigatórios", 
          "Por favor, preencha todos os campos antes de salvar.",
          [{ text: "OK" }]
        );
        return;
      }

      // Validação se os campos não estão vazios (apenas espaços)
      if (preco.trim() === '' || valor.trim() === '' || odometro.trim() === '') {
        Alert.alert(
          "Campos inválidos", 
          "Por favor, preencha todos os campos com valores válidos.",
          [{ text: "OK" }]
        );
        return;
      }

      // Converter strings para números
      const precoNumerico = parseFloat(preco.replace(',', '.'));
      const valorNumerico = parseFloat(valor.replace(',', '.'));
      const odometroNumerico = parseFloat(odometro);

      // Validar se as conversões foram bem-sucedidas
      if (isNaN(precoNumerico) || isNaN(valorNumerico) || isNaN(odometroNumerico)) {
        Alert.alert(
          "Valores inválidos", 
          "Por favor, insira valores numéricos válidos nos campos de preço, valor e odômetro.",
          [{ text: "OK" }]
        );
        return;
      }

      // Validar se os valores são positivos
      if (precoNumerico <= 0 || valorNumerico <= 0 || odometroNumerico <= 0) {
        Alert.alert(
          "Valores inválidos", 
          "Por favor, insira valores maiores que zero.",
          [{ text: "OK" }]
        );
        return;
      }

      const gastoData = {
        tipo: tipo === 'gas' ? 0 : 1,
        data: data,
        preco: precoNumerico,
        valor: valorNumerico,
        odometro: odometroNumerico,
      };

      if (item) {
        // Editando um gasto existente
        await updateGasto({
          ...gastoData,
          id: item.id,
        });
        console.log("Gasto atualizado:", gastoData);
      } else {
        // Criando um novo gasto
        const result = await insertGasto(gastoData);
        console.log("Gasto inserido:", gastoData, "Result:", result);
      }
      
      console.log("Gasto salvo. Voltando para a tela de Gastos...");
      navigation.goBack();
    } catch (error) {
      console.error("Erro ao salvar o gasto:", error);
      Alert.alert(
        "Erro", 
        "Não foi possível salvar o gasto. Tente novamente.",
        [{ text: "OK" }]
      );
    }
  };

  const handleExcluir = () => {
    Alert.alert(
      "Confirmar exclusão",
      "Tem certeza que deseja excluir este abastecimento? Esta ação não pode ser desfeita.",
      [
        {
          text: "Cancelar",
          style: "cancel"
        },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteGasto(item.id);
              console.log("Gasto excluído com sucesso");
              navigation.goBack();
            } catch (error) {
              console.error("Erro ao excluir o gasto:", error);
              Alert.alert(
                "Erro", 
                "Não foi possível excluir o abastecimento. Tente novamente.",
                [{ text: "OK" }]
              );
            }
          }
        }
      ]
    );
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
            <Text style={styles.inputLabel}>Data *</Text>
            <Button
              mode="outlined"
              onPress={showDatePicker}
              style={styles.dateButton}
              contentStyle={styles.dateButtonContent}
              icon="calendar"
            >
              {data || 'Selecione a data'}
            </Button>
          </View>

          <Input
            label="Preço por litro *"
            value={preco}
            onChangeText={(text) => setPreco(text)}
            left={<TextInput.Icon icon="currency-brl" />}
            keyboardType="numeric"
            placeholder="Ex: 5.89"
          />

          <Input
            label="Valor total *"
            value={valor}
            onChangeText={(text) => setValor(text)}
            left={<TextInput.Icon icon="currency-brl" />}
            keyboardType="numeric"
            placeholder="Ex: 50.00"
          />

          <Input
            label="Odômetro *"
            value={odometro}
            onChangeText={(text) => setOdometro(text)}
            left={<TextInput.Icon icon="speedometer" />}
            keyboardType="numeric"
            placeholder="Ex: 15000"
          />

          <Text style={styles.requiredFieldsNote}>
            * Campos obrigatórios
          </Text>

          <Button mode="contained" style={styles.button} onPress={handleSalvar}>
            {item ? 'Atualizar' : 'Salvar'}
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
  requiredFieldsNote: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
    marginBottom: 16,
    textAlign: 'center',
  },
});

export default Abastecimento;