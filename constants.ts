import { AngleShot, StyleOption } from "./types";
import { Camera, Zap, Coffee, Shirt, Sun, Snowflake, Layers, Search, User, Aperture } from "lucide-react";

export const FOOD_STYLES: StyleOption[] = [
  { id: 'high_contrast_macro', name: 'High Contrast & Macro', description: 'Detail Tajam, Berani', previewColor: 'bg-zinc-800' },
  { id: 'rustic_warmth', name: 'Rustic Warmth', description: 'Hangat, Kayu Alami', previewColor: 'bg-amber-700' },
  { id: 'clean_white', name: 'Clean White Studio', description: 'Bersih, Minimalis, Modern', previewColor: 'bg-slate-100' },
  { id: 'vibrant_pop', name: 'Vibrant Pop', description: 'Warna Cerah, Menarik', previewColor: 'bg-pink-500' },
  { id: 'mood_dark', name: 'Mood & Dark Academia', description: 'Gelap, Elegan, Misterius', previewColor: 'bg-gray-900' },
  { id: 'fresh_natural', name: 'Fresh & Natural Light', description: 'Segar, Cahaya Matahari', previewColor: 'bg-sky-300' },
  { id: 'frozen_motion', name: 'Frozen Motion', description: 'Dinamis, Aksi Cairan', previewColor: 'bg-blue-500' },
];

export const FASHION_STYLES: StyleOption[] = [
  { id: 'street_candid', name: 'Street Style Candid', description: 'Urban, Santai, Alami', previewColor: 'bg-zinc-600' },
  { id: 'minimalist_studio', name: 'Minimalist Studio Look', description: 'Bersih, Fokus Produk', previewColor: 'bg-stone-200' },
  { id: 'editorial', name: 'Editorial/High Fashion', description: 'Mewah, Artistik, Berani', previewColor: 'bg-purple-700' },
  { id: 'soft_focus', name: 'Aesthetic Soft Focus', description: 'Lembut, Romantis, Mimpi', previewColor: 'bg-rose-200' },
  { id: 'dynamic_action', name: 'Dynamic Action Shot', description: 'Gerak, Energi, Sporty', previewColor: 'bg-orange-500' },
  { id: 'texture_focus', name: 'Detail Texture Focus', description: 'Material, Zoom, Tajam', previewColor: 'bg-teal-700' },
  { id: 'vintage_film', name: 'Vintage/Film Grain', description: 'Retro, Klasik, Berkarakter', previewColor: 'bg-yellow-600' },
];

export const FOOD_ANGLES: AngleShot[] = [
  { id: 'macro', name: 'The Close-up (Macro)', description: 'Extreme close up detailing texture and freshness.' },
  { id: 'overhead', name: 'The Overhead (Flat Lay)', description: 'Top-down view showing arrangement.' },
  { id: 'angle_45', name: 'The 45-Degree Angle', description: 'Standard appetizing diner perspective.' },
  { id: 'side', name: 'The Side Profile', description: 'Eye-level view showing height and layers.' },
  { id: 'action', name: 'The Action Shot', description: 'Dynamic shot with splash, steam, or pour.' },
  { id: 'context', name: 'Contextual Lifestyle', description: 'Placed in a dining setting.' } // Added 6th for consistency
];

export const FASHION_ANGLES: AngleShot[] = [
  { id: 'full_body', name: 'Full Body Shot', description: 'Complete outfit view from head to toe.' },
  { id: 'back_side', name: 'Back View / Side Profile', description: 'Showing the cut and fit from alternative angles.' },
  { id: 'mid_shot', name: 'Mid-Shot (Chest-to-Thigh)', description: 'Focus on the garment fit on torso.' },
  { id: 'close_up', name: 'Close-up Detail', description: 'Highlighting fabric, stitching, or buttons.' },
  { id: 'accessory', name: 'Accessory Focus', description: 'Styled with complementary items.' },
  { id: 'interaction', name: 'Contextual Prop Interaction', description: 'Model interacting with environment/props.' },
];

export const ASPECT_RATIOS = [
  { id: '4:5', label: '4:5 (Potret Sosial)', value: '4:5' },
  { id: '9:16', label: '9:16 (Story/Reels)', value: '9:16' },
  { id: '16:9', label: '16:9 (Lanskap Luas)', value: '16:9' },
];

export const ETHNICITIES = ['Southeast Asian', 'East Asian', 'Caucasian', 'European', 'Latin', 'Abstract Mannequin'];
export const POSES = ['Standing Casual', 'Dynamic Movement', 'Sitting Elegant', 'Close-up Detail'];
