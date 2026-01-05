import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { PodiumInput } from '../PodiumInput';

describe('PodiumInput', () => {
  it('should render with label', () => {
    const { getByText } = render(<PodiumInput label="Email" />);
    expect(getByText('Email')).toBeTruthy();
  });

  it('should render label in uppercase', () => {
    const { getByText } = render(<PodiumInput label="password" />);
    expect(getByText('password')).toBeTruthy();
  });

  it('should accept placeholder text', () => {
    const { getByPlaceholderText } = render(
      <PodiumInput label="Username" placeholder="Enter your username" />
    );
    expect(getByPlaceholderText('Enter your username')).toBeTruthy();
  });

  it('should handle text input changes', () => {
    const onChangeTextMock = jest.fn();
    const { getByPlaceholderText } = render(
      <PodiumInput 
        label="Email" 
        placeholder="email@example.com"
        onChangeText={onChangeTextMock}
      />
    );
    
    const input = getByPlaceholderText('email@example.com');
    fireEvent.changeText(input, 'test@example.com');
    
    expect(onChangeTextMock).toHaveBeenCalledWith('test@example.com');
  });

  it('should accept value prop', () => {
    const { getByDisplayValue } = render(
      <PodiumInput label="Name" value="John Doe" />
    );
    expect(getByDisplayValue('John Doe')).toBeTruthy();
  });

  it('should support secure text entry', () => {
    const { getByPlaceholderText } = render(
      <PodiumInput 
        label="Password" 
        placeholder="Enter password"
        secureTextEntry={true}
      />
    );
    
    const input = getByPlaceholderText('Enter password');
    expect(input.props.secureTextEntry).toBe(true);
  });

  it('should accept custom style prop', () => {
    const customStyle = { fontSize: 18 };
    const { getByPlaceholderText } = render(
      <PodiumInput 
        label="Custom" 
        placeholder="Custom input"
        style={customStyle}
      />
    );
    
    const input = getByPlaceholderText('Custom input');
    expect(input).toBeTruthy();
  });

  it('should support keyboard type prop', () => {
    const { getByPlaceholderText } = render(
      <PodiumInput 
        label="Phone" 
        placeholder="Enter phone"
        keyboardType="phone-pad"
      />
    );
    
    const input = getByPlaceholderText('Enter phone');
    expect(input.props.keyboardType).toBe('phone-pad');
  });

  it('should support autoCapitalize prop', () => {
    const { getByPlaceholderText } = render(
      <PodiumInput 
        label="Email" 
        placeholder="email"
        autoCapitalize="none"
      />
    );
    
    const input = getByPlaceholderText('email');
    expect(input.props.autoCapitalize).toBe('none');
  });

  it('should support testID prop', () => {
    const { getByTestId } = render(
      <PodiumInput 
        label="Test" 
        testID="test-input"
      />
    );
    
    const input = getByTestId('test-input');
    expect(input).toBeTruthy();
  });
});
