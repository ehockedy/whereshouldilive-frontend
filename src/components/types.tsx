export const TransportModes = ['driving', 'public_transport', 'cycling', 'walking'] as const
export type TransportMode = typeof TransportModes[number]; 

