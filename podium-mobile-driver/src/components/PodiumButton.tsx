import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, TouchableOpacityProps } from 'react-native';

interface PodiumButtonProps extends TouchableOpacityProps {
  title: string;
  loading?: boolean;
  variant?: 'primary' | 'outline';
}

export const PodiumButton: React.FC<PodiumButtonProps> = ({ 
  title, 
  loading, 
  variant = 'primary', 
  style, 
  ...rest 
}) => {
  const isOutline = variant === 'outline';
  
  return (
    <TouchableOpacity 
      style={[
        styles.button, 
        isOutline ? styles.buttonOutline : styles.buttonPrimary,
        style
      ]} 
      disabled={loading}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator color={isOutline ? "#D4AF37" : "#000"} />
      ) : (
        <Text style={[styles.text, isOutline ? styles.textOutline : styles.textPrimary]}>
          {title.toUpperCase()}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    height: 55,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    marginVertical: 8,
  },
  buttonPrimary: {
    backgroundColor: '#D4AF37', // Dourado
    shadowColor: '#D4AF37',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  buttonOutline: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#D4AF37',
  },
  text: {
    fontWeight: 'bold',
    fontSize: 16,
    letterSpacing: 1,
  },
  textPrimary: {
    color: '#0b1437', // Azul Escuro
  },
  textOutline: {
    color: '#D4AF37',
  }
});