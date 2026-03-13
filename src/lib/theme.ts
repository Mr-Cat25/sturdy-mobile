// Sturdy palette — source of truth
export const colors = {
  // Semantic tokens
  background: '#F7F3EC',
  paper: '#FFFDF9',
  primary: '#3C5A73',
  text: '#1E2430',
  textSecondary: '#4B5563',
  sage: '#7C9A87',
  amber: '#D9A441',
  clay: '#C98B6B',
  danger: '#B85C4B',
  border: '#E8E0D5',

  // Legacy aliases (kept for backward compatibility)
  cream: '#F7F3EC',
  white: '#FFFDF9',
  black: '#1E2430',
  gray: '#4B5563',
  grayLight: '#9CA3AF',
  teal: '#3C5A73',
  tealLight: '#E8F4F8',
  red: '#B85C4B',
  redLight: '#FFF0EF',
  amberLight: '#FFF0D9',
};

export const spacing = { xs: 4, sm: 8, md: 16, lg: 24, xl: 32, xxl: 48 };
export const radius = { sm: 8, md: 16, lg: 24, xl: 32, full: 999 };

export const shadow = {
  card: {
    shadowColor: '#1E2430',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  soft: {
    shadowColor: '#1E2430',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
};
