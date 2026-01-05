import { COLORS, GLOBAL_STYLES, MAP_STYLE_DARK } from '../index';

describe('Theme', () => {
  describe('COLORS', () => {
    it('should have all required color values', () => {
      expect(COLORS).toBeDefined();
      expect(COLORS.background).toBe('#0F1115');
      expect(COLORS.surface).toBe('#181B21');
      expect(COLORS.primary).toBe('#D4AF37');
      expect(COLORS.textPrimary).toBe('#FFFFFF');
      expect(COLORS.success).toBe('#10B981');
      expect(COLORS.danger).toBe('#EF4444');
    });

    it('should have valid hex color codes', () => {
      const hexColorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
      const rgbaColorRegex = /^rgba?\(/;
      
      Object.entries(COLORS).forEach(([_key, value]) => {
        expect(
          hexColorRegex.test(value as string) || rgbaColorRegex.test(value as string)
        ).toBe(true);
      });
    });
  });

  describe('GLOBAL_STYLES', () => {
    it('should have container styles', () => {
      expect(GLOBAL_STYLES.container).toBeDefined();
      expect(GLOBAL_STYLES.container.flex).toBe(1);
      expect(GLOBAL_STYLES.container.backgroundColor).toBe(COLORS.background);
    });

    it('should have card styles', () => {
      expect(GLOBAL_STYLES.card).toBeDefined();
      expect(GLOBAL_STYLES.card.backgroundColor).toBe(COLORS.surface);
      expect(GLOBAL_STYLES.card.borderRadius).toBe(16);
    });

    it('should have text styles', () => {
      expect(GLOBAL_STYLES.title).toBeDefined();
      expect(GLOBAL_STYLES.subtitle).toBeDefined();
      expect(GLOBAL_STYLES.title.color).toBe(COLORS.textPrimary);
      expect(GLOBAL_STYLES.subtitle.color).toBe(COLORS.textSecondary);
    });

    it('should have shadow styles', () => {
      expect(GLOBAL_STYLES.shadow).toBeDefined();
      expect(GLOBAL_STYLES.shadow.shadowColor).toBe('#000');
      expect(GLOBAL_STYLES.shadow.elevation).toBe(10);
    });
  });

  describe('MAP_STYLE_DARK', () => {
    it('should be an array of map style objects', () => {
      expect(Array.isArray(MAP_STYLE_DARK)).toBe(true);
      expect(MAP_STYLE_DARK.length).toBeGreaterThan(0);
    });

    it('should have valid map style structure', () => {
      MAP_STYLE_DARK.forEach((style) => {
        expect(style).toHaveProperty('stylers');
        expect(Array.isArray(style.stylers)).toBe(true);
      });
    });

    it('should contain geometry element type', () => {
      const hasGeometry = MAP_STYLE_DARK.some(
        (style) => style.elementType === 'geometry'
      );
      expect(hasGeometry).toBe(true);
    });
  });
});
