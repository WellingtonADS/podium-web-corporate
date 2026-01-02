/**
 * Formata um valor de telefone para o padrão brasileiro (XX) XXXXX-XXXX
 * Aceita qualquer entrada com 10-11 dígitos
 */
export const formatPhone = (value: string): string => {
  // Remove tudo que não é dígito
  const digits = value.replace(/\D/g, "");

  // Aceita apenas 10 ou 11 dígitos
  if (digits.length < 10 || digits.length > 11) {
    return value;
  }

  // Formata para (XX) XXXXX-XXXX (10 dígitos) ou (XX) XXXXX-XXXX (11 dígitos)
  if (digits.length === 10) {
    return digits.replace(/(\d{2})(\d{4})(\d{4})/, "($1) $2-$3");
  }

  // 11 dígitos
  return digits.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
};

/**
 * Valida um telefone brasileiro
 * Retorna true se tem 10 ou 11 dígitos
 */
export const isValidPhone = (phone: string): boolean => {
  const digits = phone.replace(/\D/g, "");
  return digits.length === 10 || digits.length === 11;
};
