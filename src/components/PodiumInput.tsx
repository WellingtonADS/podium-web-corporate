import React from 'react';
import { TextInput, View, Text, StyleSheet, TextInputProps } from 'react-native';

interface PodiumInputProps extends TextInputProps {
  label: string;
  icon?: string; // Placeholder para ícone futuro
}

export const PodiumInput: React.FC<PodiumInputProps> = ({ label, style, ...rest }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TextInput 
        style={[styles.input, style]} 
        placeholderTextColor="#5a6b8c"
        {...rest} 
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: 16,
  },
  label: {
    color: '#D4AF37',
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 6,
    marginLeft: 4,
    textTransform: 'uppercase',
  },
  input: {
    backgroundColor: '#111c44',
    borderWidth: 1,
    borderColor: '#2b3a5a',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#FFF',
  },
});
