export interface Listing {
  id: string;
  title: string;
  description: string;
  price: number;
  isFree: boolean;
  isRescue: boolean;
  quantity: number;
  category: 'meal' | 'groceries' | 'snacks' | 'drinks' | 'baked';
  tags: string[];
  seller: {
    name: string;
    avatar: string;
  };
  pickupHub: string;
  pickupTime: string;
  expiresAt: Date;
  image: string;
  createdAt: Date;
}

export interface Request {
  id: string;
  listingId: string;
  buyerName: string;
  buyerAvatar: string;
  quantity: number;
  status: 'pending' | 'accepted' | 'completed' | 'declined';
  createdAt: Date;
}

export interface ImpactStats {
  mealsShared: number;
  studentsFed: number;
  moneySaved: number;
  foodRescued: number;
  co2Avoided: number;
  activeHubs: number;
}

export const campusHubs = [
  'Library',
  'Student Union',
  'West Dorm',
  'East Dorm',
  'Community Fridge',
  'Engineering Building',
  'Arts Center',
  'Sports Complex',
];

export const foodTags = [
  'Vegetarian',
  'Vegan',
  'Contains Dairy',
  'Gluten-Free',
  'Spicy',
  'Nut-Free',
  'Halal',
  'Kosher',
  'Best Eaten Tonight',
  'Homemade',
  'Organic',
  'High Protein',
];

const now = new Date();

export const mockListings: Listing[] = [
  {
    id: '1',
    title: 'Homemade Butter Chicken with Rice',
    description: 'Authentic butter chicken made with fresh spices, served with basmati rice. Made this morning!',
    price: 8,
    isFree: false,
    isRescue: true,
    quantity: 3,
    category: 'meal',
    tags: ['Contains Dairy', 'Spicy', 'Homemade', 'Best Eaten Tonight'],
    seller: { name: 'Priya M.', avatar: 'PM' },
    pickupHub: 'Student Union',
    pickupTime: '5:00 PM - 7:00 PM',
    expiresAt: new Date(now.getTime() + 2 * 60 * 60 * 1000),
    image: '/images/butter-chicken.jpg',
    createdAt: new Date(now.getTime() - 3 * 60 * 60 * 1000),
  },
  {
    id: '2',
    title: 'Fresh Vegetable Stir Fry',
    description: 'Colorful veggie stir fry with tofu. Perfect for a healthy dinner!',
    price: 6,
    isFree: false,
    isRescue: false,
    quantity: 2,
    category: 'meal',
    tags: ['Vegan', 'Gluten-Free', 'High Protein'],
    seller: { name: 'Alex K.', avatar: 'AK' },
    pickupHub: 'Library',
    pickupTime: '6:00 PM - 8:00 PM',
    expiresAt: new Date(now.getTime() + 24 * 60 * 60 * 1000),
    image: '/images/stir-fry.jpg',
    createdAt: new Date(now.getTime() - 1 * 60 * 60 * 1000),
  },
  {
    id: '3',
    title: 'Surplus Bananas & Apples',
    description: 'Got too much fruit from the farmers market! 5 bananas and 4 apples, all organic.',
    price: 0,
    isFree: true,
    isRescue: true,
    quantity: 1,
    category: 'groceries',
    tags: ['Vegan', 'Organic', 'Best Eaten Tonight'],
    seller: { name: 'Jordan L.', avatar: 'JL' },
    pickupHub: 'Community Fridge',
    pickupTime: 'Anytime today',
    expiresAt: new Date(now.getTime() + 1 * 60 * 60 * 1000),
    image: '/images/fruits.jpg',
    createdAt: new Date(now.getTime() - 30 * 60 * 1000),
  },
  {
    id: '4',
    title: 'Homemade Chocolate Chip Cookies',
    description: 'Batch of 12 soft chocolate chip cookies. Baked fresh this afternoon!',
    price: 5,
    isFree: false,
    isRescue: false,
    quantity: 4,
    category: 'baked',
    tags: ['Contains Dairy', 'Homemade'],
    seller: { name: 'Sam W.', avatar: 'SW' },
    pickupHub: 'West Dorm',
    pickupTime: '4:00 PM - 9:00 PM',
    expiresAt: new Date(now.getTime() + 48 * 60 * 60 * 1000),
    image: '/images/cookies.jpg',
    createdAt: new Date(now.getTime() - 2 * 60 * 60 * 1000),
  },
  {
    id: '5',
    title: 'Leftover Pasta Carbonara',
    description: 'Made too much pasta! Creamy carbonara with bacon, enough for 2 servings.',
    price: 4,
    isFree: false,
    isRescue: true,
    quantity: 2,
    category: 'meal',
    tags: ['Contains Dairy', 'Best Eaten Tonight', 'Homemade'],
    seller: { name: 'Maria G.', avatar: 'MG' },
    pickupHub: 'East Dorm',
    pickupTime: '7:00 PM - 9:00 PM',
    expiresAt: new Date(now.getTime() + 3 * 60 * 60 * 1000),
    image: '/images/pasta.jpg',
    createdAt: new Date(now.getTime() - 45 * 60 * 1000),
  },
  {
    id: '6',
    title: 'Fresh Sushi Rolls (6 pieces)',
    description: 'California rolls and spicy tuna, made with fresh ingredients from the Asian market.',
    price: 10,
    isFree: false,
    isRescue: false,
    quantity: 3,
    category: 'meal',
    tags: ['Contains Dairy', 'High Protein'],
    seller: { name: 'Ken T.', avatar: 'KT' },
    pickupHub: 'Student Union',
    pickupTime: '5:30 PM - 7:30 PM',
    expiresAt: new Date(now.getTime() + 6 * 60 * 60 * 1000),
    image: '/images/sushi.jpg',
    createdAt: new Date(now.getTime() - 90 * 60 * 1000),
  },
  {
    id: '7',
    title: 'Unopened Oat Milk (Half Gallon)',
    description: 'Moving out and have unopened oat milk. Expires in 2 weeks!',
    price: 0,
    isFree: true,
    isRescue: false,
    quantity: 1,
    category: 'drinks',
    tags: ['Vegan', 'Nut-Free'],
    seller: { name: 'Chris P.', avatar: 'CP' },
    pickupHub: 'Engineering Building',
    pickupTime: '12:00 PM - 6:00 PM',
    expiresAt: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000),
    image: '/images/oat-milk.jpg',
    createdAt: new Date(now.getTime() - 4 * 60 * 60 * 1000),
  },
  {
    id: '8',
    title: 'Falafel Wrap Combo',
    description: 'Homemade falafel wraps with hummus, fresh veggies, and tahini sauce.',
    price: 7,
    isFree: false,
    isRescue: true,
    quantity: 2,
    category: 'meal',
    tags: ['Vegan', 'Halal', 'Homemade', 'Best Eaten Tonight'],
    seller: { name: 'Ahmed R.', avatar: 'AR' },
    pickupHub: 'Arts Center',
    pickupTime: '6:00 PM - 8:00 PM',
    expiresAt: new Date(now.getTime() + 90 * 60 * 1000),
    image: '/images/falafel.jpg',
    createdAt: new Date(now.getTime() - 20 * 60 * 1000),
  },
  {
    id: '9',
    title: 'Granola Bars (Box of 12)',
    description: 'Sealed box of protein granola bars. Great for study sessions!',
    price: 8,
    isFree: false,
    isRescue: false,
    quantity: 2,
    category: 'snacks',
    tags: ['Vegetarian', 'High Protein'],
    seller: { name: 'Taylor S.', avatar: 'TS' },
    pickupHub: 'Library',
    pickupTime: '10:00 AM - 8:00 PM',
    expiresAt: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000),
    image: '/images/granola.jpg',
    createdAt: new Date(now.getTime() - 5 * 60 * 60 * 1000),
  },
  {
    id: '10',
    title: 'Thai Green Curry',
    description: 'Authentic Thai green curry with vegetables and jasmine rice. Mild spice level.',
    price: 9,
    isFree: false,
    isRescue: false,
    quantity: 2,
    category: 'meal',
    tags: ['Vegan', 'Gluten-Free', 'Homemade'],
    seller: { name: 'Nina P.', avatar: 'NP' },
    pickupHub: 'Student Union',
    pickupTime: '5:00 PM - 8:00 PM',
    expiresAt: new Date(now.getTime() + 12 * 60 * 60 * 1000),
    image: '/images/curry.jpg',
    createdAt: new Date(now.getTime() - 2.5 * 60 * 60 * 1000),
  },
];

export const mockRequests: Request[] = [
  {
    id: 'r1',
    listingId: '1',
    buyerName: 'Emily Chen',
    buyerAvatar: 'EC',
    quantity: 1,
    status: 'pending',
    createdAt: new Date(now.getTime() - 15 * 60 * 1000),
  },
  {
    id: 'r2',
    listingId: '1',
    buyerName: 'Marcus J.',
    buyerAvatar: 'MJ',
    quantity: 2,
    status: 'pending',
    createdAt: new Date(now.getTime() - 10 * 60 * 1000),
  },
  {
    id: 'r3',
    listingId: '4',
    buyerName: 'Lisa Wong',
    buyerAvatar: 'LW',
    quantity: 1,
    status: 'accepted',
    createdAt: new Date(now.getTime() - 60 * 60 * 1000),
  },
];

export const mockImpactStats: ImpactStats = {
  mealsShared: 12847,
  studentsFed: 4293,
  moneySaved: 38541,
  foodRescued: 2156,
  co2Avoided: 8624,
  activeHubs: 8,
};

export const myListings = mockListings.filter(l => ['1', '4', '7'].includes(l.id));

export function getTimeRemaining(expiresAt: Date): string {
  const now = new Date();
  const diff = expiresAt.getTime() - now.getTime();
  
  if (diff <= 0) return 'Expired';
  
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  
  if (hours > 24) {
    const days = Math.floor(hours / 24);
    return `${days}d left`;
  }
  if (hours > 0) {
    return `${hours}h ${minutes}m left`;
  }
  return `${minutes}m left`;
}

export function isUrgent(expiresAt: Date): boolean {
  const now = new Date();
  const diff = expiresAt.getTime() - now.getTime();
  return diff <= 3 * 60 * 60 * 1000; // 3 hours or less
}

export function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(diff / (1000 * 60 * 60));

  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export interface LeaderboardEntry {
  name: string;
  avatar: string;
  meals: number;
  badge: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  completed: boolean;
}

export interface UserStats {
  mealsShared: number;
  moneySaved: number;
  itemsRescued: number;
  rank: number;
}

export const leaderboard: LeaderboardEntry[] = [
  { name: 'Priya M.', avatar: 'PM', meals: 47, badge: 'Gold Rescuer' },
  { name: 'Alex K.', avatar: 'AK', meals: 38, badge: 'Silver Sharer' },
  { name: 'Jordan L.', avatar: 'JL', meals: 31, badge: 'Bronze Hero' },
  { name: 'Sam W.', avatar: 'SW', meals: 28, badge: 'Rising Star' },
  { name: 'Maria G.', avatar: 'MG', meals: 24, badge: 'Newcomer' },
];

export const achievements: Achievement[] = [
  { id: 'first-share', title: 'First Share', description: 'Shared your first meal', completed: true },
  { id: '10-meals', title: '10 Meals Club', description: 'Shared 10 meals', completed: true },
  { id: 'zero-waste', title: 'Zero Waste Hero', description: 'Rescued 5 items', completed: true },
  { id: 'community', title: 'Community Builder', description: 'Help 25 students', completed: false },
  { id: 'legend', title: 'Campus Legend', description: 'Share 100 meals', completed: false },
];

export const currentUserStats: UserStats = {
  mealsShared: 156,
  moneySaved: 423,
  itemsRescued: 89,
  rank: 12,
};

export const weeklyGoal = {
  target: 500,
  current: 387,
};

export const hubActivity = campusHubs.map((hub, index) => ({
  name: hub,
  activity: [78, 92, 65, 88, 45, 72, 56, 83][index] || 50,
  exchanges: [47, 52, 38, 44, 22, 35, 28, 41][index] || 30,
}));
