export const ENDPOINT_REGISTRY = [
  {
    id: 'roi',
    route: '/analysis/roi',
    apiPath: '/analysis/roi',
    method: 'GET' as const,
    params: [],
    description: 'Calculate return on investment (ROI) for properties. Shows rental yield and investment returns.',
    label: 'ROI Analysis',
    icon: 'TrendingUp',
  },
  {
    id: 'average-price',
    route: '/analysis/average-price',
    apiPath: '/analysis/average-price/:location',
    method: 'GET' as const,
    params: [{ name: 'location', type: 'string', description: 'Area/location name (e.g., "New Cairo", "Sheikh Zayed")' }],
    description: 'Average property price for a specific location/area.',
    label: 'Average Price by Location',
    icon: 'MapPin',
  },
  {
    id: 'property-counts',
    route: '/analysis/property-counts',
    apiPath: '/analysis/property-counts',
    method: 'GET' as const,
    params: [],
    description: 'Count of properties grouped by type for each area.',
    label: 'Property Counts',
    icon: 'BarChart3',
  },
  {
    id: 'price-by-type',
    route: '/analysis/price-by-type',
    apiPath: '/analysis/average-price-by-type',
    method: 'GET' as const,
    params: [],
    description: 'Average prices grouped by property type (Apartment, Villa, House, Condo, Townhouse).',
    label: 'Price by Type',
    icon: 'Home',
  },
  {
    id: 'installments',
    route: '/analysis/installments',
    apiPath: '/analysis/installments-by-area',
    method: 'GET' as const,
    params: [],
    description: 'Installment payment periods and plans grouped by area.',
    label: 'Installment Plans',
    icon: 'Calendar',
  },
  {
    id: 'downpayment',
    route: '/analysis/downpayment',
    apiPath: '/analysis/downpayment-percentage',
    method: 'GET' as const,
    params: [],
    description: 'Down payment percentage (downpayment / total cost) by area.',
    label: 'Down Payment Analysis',
    icon: 'Percent',
  },
  {
    id: 'properties',
    route: '/properties',
    apiPath: '/properties',
    method: 'GET' as const,
    params: [],
    description: 'Browse and filter all available properties. Find properties by type, area, price, bedrooms, bathrooms.',
    label: 'Property Finder',
    icon: 'Search',
  },
] as const;

export type EndpointId = typeof ENDPOINT_REGISTRY[number]['id'];

export const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/analysis', label: 'Analysis' },
  { href: '/properties', label: 'Properties' },
] as const;

export const PROPERTY_TYPES = ['Apartment', 'House', 'Condo', 'Townhouse', 'Villa'] as const;
export type PropertyType = typeof PROPERTY_TYPES[number];

export const AREAS = ['New Cairo', 'Sheikh Zayed', 'North Coast', 'Nasr City', '6th of October', 'Heliopolis', 'Maadi'] as const;
