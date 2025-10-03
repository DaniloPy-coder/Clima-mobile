import { StatusBar } from 'expo-status-bar';
import { Platform, Text, View, KeyboardAvoidingView, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Button } from './src/components/Button';
import { Input } from './src/components/Input';
import { ResultCard } from './src/components/ResultCard';
import { styles } from './App.styles';
import { currencies } from './src/constants/currencies';
import { useState } from 'react';
import { exchangeRateApi } from './src/services/api';
import { convertCurrency } from './utils/convertCurrency';

export default function App() {
  const [amount, setAmount] = useState("")
  const [fromCurrency, setFromCurrency] = useState("USD")
  const [toCurrency, setToCurrency] = useState("BRL")
  const [result, setResult] = useState("")
  const [loading, setLoading] = useState(false)
  const [exchangeRate, setExchangeRate] = useState(null)

  async function fetchExchangeRate() {

    try {
      setLoading(true)
      if (!amount) return

      const data = await exchangeRateApi(fromCurrency)
      const rate = data.rates[toCurrency]
      setExchangeRate(rate)

      const convertedAmount = convertCurrency(amount, rate)

      setResult(convertedAmount)
    } catch (err) {
      alert("Erro, tente novamente")
    } finally {
      setLoading(false)
    }
  }

  function swapCurrency() {
    setFromCurrency(toCurrency)
    setToCurrency(fromCurrency)
    setResult("")
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >

      <ScrollView style={styles.scrollView}>

        <View style={styles.content}>
          <StatusBar style="light" />

          <View style={styles.header}>
            <Text style={styles.title}>Conversor de Moedas</Text>
            <Text style={styles.subtitle}>
              Converta valores entre diferentes moedas
            </Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.label}>De:</Text>
            <View style={styles.currencyGrid}>
              {currencies.map(currency => (
                <Button
                  variant='primary'
                  key={currency.code}
                  currency={currency}
                  onPress={() => setFromCurrency(currency.code)}
                  isSelected={fromCurrency === currency.code}
                >
                </Button>
              ))}

            </View>

            <Input label="Valor: " value={amount} onChangeText={setAmount} />

            <TouchableOpacity style={styles.swapButton} onPress={swapCurrency}>
              <Text style={styles.swapButtonText}>
                ↑↓
              </Text>
            </TouchableOpacity>

            <Text style={styles.label}>Para:</Text>
            <View style={styles.currencyGrid}>
              {currencies.map(currency => (
                <Button
                  variant='secondary'
                  key={currency.code}
                  currency={currency}
                  onPress={() => setToCurrency(currency.code)}
                  isSelected={toCurrency === currency.code}
                >
                </Button>
              ))}
            </View>
          </View>

          <TouchableOpacity
            style={[styles.convertButton, (!amount || loading) && styles.convertButtonDisable]}
            onPress={fetchExchangeRate}
            disabled={!amount || loading}
          >

            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.swapButtonText}>
                Converter
              </Text>
            )}
          </TouchableOpacity>

          <ResultCard exchangeRate={exchangeRate} result={result} fromCurrency={fromCurrency} toCurrency={toCurrency} currencies={currencies} />
        </View>
      </ScrollView>
    </KeyboardAvoidingView >
  );
}
