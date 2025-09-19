import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Keyboard,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";

const themeColors = {
  background: "#121212",
  text: "#EAEAEA",
  primary: "#BDB2FF",
  placeholder: "#555",
  inputBackground: "#2E2E2E",
  borderColor: "#444",
};

export default function App() {
  const [count, setCount] = useState(0);
  const [limit, setLimit] = useState(10);
  const [limitInput, setLimitInput] = useState("10");

  useEffect(() => {
    const loadLimit = async () => {
      try {
        const savedLimit = await AsyncStorage.getItem("@contador_limit");
        if (savedLimit !== null) {
          const numericLimit = parseInt(savedLimit, 10);
          setLimit(numericLimit);
          setLimitInput(String(numericLimit));
        }
      } catch (error) {
        console.error("Falha ao carregar o limite.", error);
      }
    };
    loadLimit();
  }, []);

  const handleIncrement = () => {
    if (count < limit) setCount(count + 1);
    else
      Alert.alert(
        "Limite Atingido!",
        `O número máximo de pessoas (${limit}) já foi alcançado.`
      );
  };

  const handleDecrement = () => {
    if (count > 0) setCount(count - 1);
  };

  const handleReset = () => setCount(0);

  const handleSetLimit = async () => {
    const newLimit = parseInt(limitInput, 10);
    if (!isNaN(newLimit) && newLimit > 0) {
      setLimit(newLimit);
      try {
        await AsyncStorage.setItem("@contador_limit", String(newLimit));
        Alert.alert("Sucesso!", "Novo limite salvo.");
        Keyboard.dismiss();
      } catch (error) {
        Alert.alert("Erro", "Não foi possível salvar o novo limite.");
        console.error("Falha ao salvar o limite.", error);
      }
    } else {
      Alert.alert(
        "Valor Inválido",
        "Por favor, insira um número válido e maior que zero."
      );
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <StatusBar barStyle="light-content" />

        <Text style={styles.title}>Contador de Pessoas</Text>
        <Text style={styles.limitInfo}>Limite: {limit} pessoas</Text>
        <Text style={[styles.count, count >= limit && styles.limitReachedText]}>
          {count}
        </Text>

        <View style={styles.buttonsContainer}>
          <TouchableOpacity style={styles.button} onPress={handleDecrement}>
            <Text style={styles.buttonText}>-</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.resetButton]}
            onPress={handleReset}
          >
            <Text style={styles.buttonText}>Zerar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={handleIncrement}>
            <Text style={styles.buttonText}>+</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Definir novo limite:</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={limitInput}
            onChangeText={setLimitInput}
            placeholder="Ex: 20"
            placeholderTextColor={themeColors.placeholder}
          />
          <TouchableOpacity style={styles.saveButton} onPress={handleSetLimit}>
            <Text style={styles.saveButtonText}>Salvar Limite</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: themeColors.background,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: themeColors.text,
    marginBottom: 20,
  },
  limitInfo: {
    fontSize: 18,
    color: themeColors.text,
    marginBottom: 40,
  },
  count: {
    fontSize: 120,
    fontWeight: "bold",
    color: themeColors.primary,
    marginBottom: 40,
  },
  limitReachedText: {
    color: "#dc3545",
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginBottom: 50,
  },
  button: {
    backgroundColor: themeColors.primary,
    width: 80,
    height: 80,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 40,
  },
  resetButton: {
    backgroundColor: "#6c757d",
    width: 100,
  },
  buttonText: {
    color: "#fff",
    fontSize: 30,
    fontWeight: "bold",
  },
  inputContainer: {
    width: "80%",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: themeColors.borderColor,
    paddingTop: 20,
  },
  inputLabel: {
    fontSize: 16,
    color: themeColors.text,
    marginBottom: 10,
  },
  input: {
    width: "100%",
    height: 50,
    borderColor: themeColors.borderColor,
    color: themeColors.text,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 18,
    textAlign: "center",
    backgroundColor: themeColors.inputBackground,
    marginBottom: 15,
  },
  saveButton: {
    backgroundColor: "#28a745",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
