export interface BusinessHours {
  start: string; // HH:mm
  end: string; // HH:mm
}

const toMinutes = (time: string): number => {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
};

export const isWithinBusinessHours = (
  date: Date,
  hours?: BusinessHours
): boolean => {
  if (!hours?.start || !hours?.end) return true;

  const currentMinutes = date.getHours() * 60 + date.getMinutes();
  const startMinutes = toMinutes(hours.start);
  const endMinutes = toMinutes(hours.end);

  // Handles start < end (e.g., 08:00-18:00) and overnight windows (22:00-06:00)
  if (startMinutes <= endMinutes) {
    return currentMinutes >= startMinutes && currentMinutes <= endMinutes;
  }

  return currentMinutes >= startMinutes || currentMinutes <= endMinutes;
};

export interface CostCenterPolicy {
  allowed_categories: string[];
  spending_limit_per_ride: number;
  business_hours?: BusinessHours;
}

export const validateCostCenterPolicy = (
  policy: CostCenterPolicy
): { valid: boolean; message?: string } => {
  if (!policy.allowed_categories || policy.allowed_categories.length === 0) {
    return {
      valid: false,
      message: "Selecione ao menos uma categoria permitida.",
    };
  }

  if (!policy.spending_limit_per_ride || policy.spending_limit_per_ride <= 0) {
    return {
      valid: false,
      message: "Defina um limite por corrida maior que zero.",
    };
  }

  if (policy.business_hours) {
    const { start, end } = policy.business_hours;
    if (!start || !end) {
      return { valid: false, message: "Informe horário inicial e final." };
    }
    const startMinutes = toMinutes(start);
    const endMinutes = toMinutes(end);
    if (startMinutes === endMinutes) {
      return {
        valid: false,
        message: "Horário inicial e final não podem ser iguais.",
      };
    }
  }

  return { valid: true };
};
