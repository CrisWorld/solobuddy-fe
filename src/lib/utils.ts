import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
// export const formatPrice = (price: number) => {
//     return price.toLocaleString("vi-VN", { style: "currency", currency: "VND" })
// }
export const createRegexPattern = (searchTerm: string): string => {
  return `.*${searchTerm.trim()}.*`;
};

// Backend constants
export const vehicleTypes = ['car', 'van', 'bus', 'motorcycle', 'bicycle', 'walking', 'other']
export const specialtyTypes = [
  'historical-tours',
  'cultural-tours',
  'adventure-tours',
  'food-tours',
  'nature-tours',
  'city-tours',
  'museum-tours',
  'photography-tours',
  'religious-tours',
  'shopping-tours',
]
export const favourites = [
  'Photography',
  'Reading Books',
  'Cooking',
  'Hiking',
  'Cycling',
  'Listening to Music',
  'Traveling',
  'Swimming',
  'Drawing & Painting',
  'Yoga & Meditation',
]
export const languages = ['english', 'vietnamese', 'thai', 'french', 'spanish', 'chinese', 'japanese', 'korean']
export const locations = ['vietnam', 'thailand', 'france', 'spain', 'china', 'japan', 'korea', 'usa', 'uk', 'germany']
export const countries = ["vietnam", "thailand", "france", "spain", "china", "japan", "korea", "usa", "uk", "germany"]
// Utility functions to format display text
export const formatSpecialty = (specialty: string): string => {
  if (!specialty) return ''
  return specialty
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

export const formatLanguage = (language: string): string => {
  if (!language) return ''
  return language.charAt(0).toUpperCase() + language.slice(1)
}

export const formatLocation = (location: string): string => {
  if (!location) return ''
  const locationMap: { [key: string]: string } = {
    'usa': 'USA',
    'uk': 'UK',
    'vietnam': 'Vietnam',
    'thailand': 'Thailand',
    'france': 'France',
    'spain': 'Spain',
    'china': 'China',
    'japan': 'Japan',
    'korea': 'Korea',
    'germany': 'Germany'
  }
  return locationMap[location.toLowerCase()] || location.charAt(0).toUpperCase() + location.slice(1)
}

export const formatVehicle = (vehicle: string): string => {
  if (!vehicle) return ''
  const vehicleMap: { [key: string]: string } = {
    'motorcycle': 'Motorcycle',
    'car': 'Car',
    'van': 'Van',
    'bus': 'Bus',
    'bicycle': 'Bicycle',
    'walking': 'Walking',
    'other': 'Other'
  }
  return vehicleMap[vehicle.toLowerCase()] || vehicle.charAt(0).toUpperCase() + vehicle.slice(1)
}

export const formatFavourite = (favourite: string): string => {
  if (!favourite) return ''
  return favourite
}

// Utility functions to format arrays
export const formatSpecialties = (specialties: string[]): string => {
  if (!specialties || specialties.length === 0) return ''
  return specialties.map(formatSpecialty).join(', ')
}

export const formatLanguages = (languageList: string[]): string => {
  if (!languageList || languageList.length === 0) return ''
  return languageList.map(formatLanguage).join(', ')
}

// Price formatting
export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price)
}

// Experience years formatting
export const formatExperienceYears = (years: number): string => {
  if (years === 1) return '1 year'
  return `${years} years`
}

// Rating formatting
export const formatRating = (rating: number): string => {
  return rating.toFixed(1)
}