import { shuffle } from "../functions/util";
import { Enchantment, EnchantmentRate } from "../types/tiles";

export const DefaultEnchantmentRate: EnchantmentRate = {
    [Enchantment.BASE]: 0.7,
    [Enchantment.FOIL]: 0.1,
    [Enchantment.HOLOGRAPHIC]: 0.07,
    [Enchantment.POLYCHROME]: 0.05,
    [Enchantment.NEGATIVE]: 0.08,
};

export const BoostedEnchantmentRate: EnchantmentRate = {
    [Enchantment.BASE]: 0.5,
    [Enchantment.FOIL]: 0.18,
    [Enchantment.HOLOGRAPHIC]: 0.12,
    [Enchantment.POLYCHROME]: 0.1,
    [Enchantment.NEGATIVE]: 0.1,
};
