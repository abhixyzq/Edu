/**
 * Single source of truth for all Gem Packages and In-App monetization.
 * Both client Store UI and server-side Razorpay payment verification use this config.
 */

export interface GemPackageConfig {
  id: string;
  name: string;
  gems: number;
  bonusGems: number;
  priceInr: number; // in Rupees
  pricePaise: number; // in Paise for Razorpay (e.g. 2900 for ₹29)
  badge?: string;
  popular?: boolean;
  icon: string;
  description: string;
}

export const GEM_PACKAGES_CONFIG: Record<string, GemPackageConfig> = {
  'pack-starter': {
    id: 'pack-starter',
    name: 'Handful of Gems',
    gems: 100,
    bonusGems: 0,
    priceInr: 29,
    pricePaise: 2900,
    icon: '💎',
    description: 'Perfect for a quick life refill or streak protection.',
  },
  'pack-scholar': {
    id: 'pack-scholar',
    name: 'Scholar Pouch',
    gems: 350,
    bonusGems: 50,
    priceInr: 79,
    pricePaise: 7900,
    badge: 'Popular',
    popular: true,
    icon: '💎✨',
    description: 'Great for weekly chapter revisions & practice tests.',
  },
  'pack-chest': {
    id: 'pack-chest',
    name: "Topper's Chest",
    gems: 1000,
    bonusGems: 250,
    priceInr: 199,
    pricePaise: 19900,
    badge: 'Best Value 🔥',
    popular: true,
    icon: '👑💎',
    description: 'Most loved by serious board & competitive exam aspirants.',
  },
  'pack-vault': {
    id: 'pack-vault',
    name: 'Master Vault',
    gems: 2500,
    bonusGems: 800,
    priceInr: 399,
    pricePaise: 39900,
    badge: 'Mega Pack',
    icon: '🏆💎',
    description: 'Maximum savings with bonus gems. Never run out of test lives.',
  },
};
