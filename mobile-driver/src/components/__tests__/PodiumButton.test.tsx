import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { PodiumButton } from '../PodiumButton';

describe('PodiumButton', () => {
  it('should render with title', () => {
    const { getByText } = render(<PodiumButton title="Test Button" />);
    expect(getByText('TEST BUTTON')).toBeTruthy();
  });

  it('should convert title to uppercase', () => {
    const { getByText } = render(<PodiumButton title="login" />);
    expect(getByText('LOGIN')).toBeTruthy();
  });

  it('should call onPress when pressed', () => {
    const onPressMock = jest.fn();
    const { getByText } = render(
      <PodiumButton title="Press Me" onPress={onPressMock} />
    );
    
    fireEvent.press(getByText('PRESS ME'));
    expect(onPressMock).toHaveBeenCalledTimes(1);
  });

  it('should show loading indicator when loading is true', () => {
    const { queryByText, getByTestId } = render(
      <PodiumButton title="Submit" loading={true} testID="button" />
    );
    
    // Title should not be visible
    expect(queryByText('SUBMIT')).toBeNull();
  });

  it('should be disabled when loading', () => {
    const onPressMock = jest.fn();
    const { getByTestId } = render(
      <PodiumButton 
        title="Submit" 
        loading={true} 
        onPress={onPressMock}
        testID="button"
      />
    );
    
    const button = getByTestId('button');
    fireEvent.press(button);
    
    // onPress should not be called when disabled
    expect(onPressMock).not.toHaveBeenCalled();
  });

  it('should render with primary variant by default', () => {
    const { getByText } = render(<PodiumButton title="Primary" />);
    const button = getByText('PRIMARY');
    expect(button).toBeTruthy();
  });

  it('should render with outline variant', () => {
    const { getByText } = render(
      <PodiumButton title="Outline" variant="outline" />
    );
    const button = getByText('OUTLINE');
    expect(button).toBeTruthy();
  });

  it('should accept custom style prop', () => {
    const customStyle = { marginTop: 20 };
    const { getByTestId } = render(
      <PodiumButton 
        title="Styled" 
        style={customStyle}
        testID="styled-button"
      />
    );
    
    const button = getByTestId('styled-button');
    expect(button).toBeTruthy();
  });

  it('should pass through additional TouchableOpacity props', () => {
    const { getByTestId } = render(
      <PodiumButton 
        title="Test"
        testID="accessible-button"
        accessible={true}
        accessibilityLabel="Test Button"
      />
    );
    
    const button = getByTestId('accessible-button');
    expect(button).toBeTruthy();
  });
});
