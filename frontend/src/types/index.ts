export type TourType = 'WANDERUNG' | 'SKITOUR' | 'KLETTERSTEIG' | 'HOCHTOUR' | 'SCHNEESCHUH'

export type Difficulty =
  | 'T1' | 'T2' | 'T3' | 'T4' | 'T5' | 'T6' | 'T6_PLUS'
  | 'WT1' | 'WT2' | 'WT3' | 'WT4' | 'WT5' | 'WT6'
  | 'K1' | 'K2' | 'K3' | 'K4' | 'K5' | 'K6'
  | 'WS' | 'ZS' | 'S' | 'SS' | 'AS'

export const TOUR_TYPE_LABELS: Record<TourType, string> = {
  WANDERUNG:    'Wanderung',
  SKITOUR:      'Skitour',
  KLETTERSTEIG: 'Klettersteig',
  HOCHTOUR:     'Hochtour',
  SCHNEESCHUH:  'Schneeschuhtour',
}

export const DIFFICULTIES_BY_TYPE: Record<TourType, Difficulty[]> = {
  WANDERUNG:    ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T6_PLUS'],
  SKITOUR:      ['WT1', 'WT2', 'WT3', 'WT4', 'WT5', 'WT6'],
  KLETTERSTEIG: ['K1', 'K2', 'K3', 'K4', 'K5', 'K6'],
  HOCHTOUR:     ['WS', 'ZS', 'S', 'SS', 'AS'],
  SCHNEESCHUH:  ['WT1', 'WT2', 'WT3', 'WT4', 'WT5', 'WT6'],
}

export function difficultyLabel(d: Difficulty): string {
  return d.replace('_PLUS', '+')
}

export function difficultyRisk(d: Difficulty): 1 | 2 | 3 | 4 {
  if (['T1','T2','WT1','WT2','K1','K2','WS'].includes(d)) return 1
  if (['T3','T4','WT3','WT4','K3','ZS'].includes(d))       return 2
  if (['T5','WT5','K4','K5','S','SS'].includes(d))         return 3
  return 4
}

export interface Region {
  id:      number
  name:    string
  country: string
}

export interface Photo {
  id:           number
  url:          string
  originalName: string
  caption:      string | null
  sortOrder:    number
  cover:        boolean
  createdAt:    string
}

export interface GpxFile {
  id:           number
  downloadUrl:  string
  originalName: string
  createdAt:    string
}

export interface TourSummary {
  id:           number
  slug:         string
  title:        string
  tourType:     TourType
  difficulty:   Difficulty
  region:       Region | null
  elevationUp:  number | null
  distanceKm:   number | null
  durationMin:  number | null
  tourDate:     string | null
  coverPhotoUrl: string | null
  published:    boolean
}

export interface TourDetail extends TourSummary {
  summary:       string | null
  description:   string | null
  elevationDown: number | null
  startLocation: string | null
  endLocation:   string | null
  bestSeason:    string | null
  createdAt:     string
  updatedAt:     string
  photos:        Photo[]
  gpxFile:       GpxFile | null
}

export interface TourWritePayload {
  title:         string
  tourType:      TourType
  difficulty:    Difficulty
  regionId:      number | null
  summary:       string
  description:   string
  elevationUp:   number | null
  elevationDown: number | null
  distanceKm:    number | null
  durationMin:   number | null
  startLocation: string
  endLocation:   string
  bestSeason:    string
  tourDate:      string | null
}

export interface Page<T> {
  content:          T[]
  totalElements:    number
  totalPages:       number
  number:           number
  size:             number
}

export interface TypeStat {
  tourType: TourType
  count:    number
  km:       number
}

export interface Stats {
  totalTours:         number
  totalKm:            number
  totalElevationUp:   number
  totalDurationHours: number
  byType:             TypeStat[]
}

export interface PostSummary {
  id:            number
  slug:          string
  title:         string
  summary:       string | null
  coverImageUrl: string | null
  published:     boolean
  createdAt:     string
}

export interface PostDetail extends PostSummary {
  content:   string
  updatedAt: string
}

export interface PostWritePayload {
  title:   string
  summary: string
  content: string
}
