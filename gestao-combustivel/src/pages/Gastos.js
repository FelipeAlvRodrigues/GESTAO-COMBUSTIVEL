import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, RefreshControl } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { List, Text, FAB } from 'react-native-paper';

import Header from '../components/Header';
import Container from '../components/Container';
import Body from '../components/Body';
import { getGastos } from '../services/Gastos.Services';
import { useIsFocused, useNavigation } from '@react-navigation/native';

const Gastos = () => {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const [gastos, setGastos] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const carregarGastos = async () => {
    try {
      setRefreshing(true);
      const dados = await getGastos();
      console.log("Gastos carregados:", dados); // 🔥 Confirma que os dados foram carregados corretamente
      setGastos(dados);
    } catch (error) {
      console.error("Erro ao carregar gastos:", error);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (isFocused) {
      carregarGastos(); // 🔥 Garante atualização ao voltar para a tela
    }
  }, [isFocused]);

  const renderItem = ({ item }) => {
    // Garantir que os valores sejam números antes de usar toFixed
    const valorFormatado = typeof item.valor === 'number' ? item.valor.toFixed(2) : parseFloat(item.valor || 0).toFixed(2);
    const precoFormatado = typeof item.preco === 'number' ? item.preco.toFixed(2) : parseFloat(item.preco || 0).toFixed(2);
    const odometroFormatado = typeof item.odometro === 'number' ? item.odometro.toFixed(0) : parseFloat(item.odometro || 0).toFixed(0);
    
    return (
      <List.Item
        title={`R$ ${valorFormatado} (R$ ${precoFormatado})`}
        description={`${odometroFormatado} km`}
        left={(props) => (
          <List.Icon
            {...props}
            color={item.tipo === 0 ? 'red' : 'green'}
            icon="gas-station"
          />
        )}
        right={(props) => (
          <Text {...props} style={{ alignSelf: 'center' }}>
            {item.data}
          </Text>
        )}
        onPress={() => navigation.navigate('Abastecimento', { item })}
      />
    );
  };

  return (
    <SafeAreaProvider>
      <Container>
        <Header title={'Fuel Manager'} />
        <Body>
          <FlatList
            data={gastos}
            renderItem={renderItem}
            keyExtractor={(item) => item.id.toString()}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={carregarGastos} />
            }
            ListEmptyComponent={() => (
              <Text style={styles.emptyText}>Nenhum abastecimento registrado</Text>
            )}
          />
          <FAB
            icon="plus"
            style={styles.fab}
            onPress={() => navigation.navigate('Abastecimento')}
          />
        </Body>
      </Container>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: '#666',
  },
});

export default Gastos;