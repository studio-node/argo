// PostMessage protocol for 8th Wall Studio communication

export const MESSAGE_TYPES = {
  // From Studio to Parent
  VPS_LOCATION_DETECTED: 'VPS_LOCATION_DETECTED',
  PLACEMENT_SUCCESS: 'PLACEMENT_SUCCESS',
  TAP_POSITION: 'TAP_POSITION',
  
  // From Parent to Studio
  PLACE_MODEL: 'PLACE_MODEL',
  LOAD_PLACED_OBJECTS: 'LOAD_PLACED_OBJECTS',
  CLEAR_SCENE: 'CLEAR_SCENE'
}

export function createMessage(type, payload) {
  return {
    type,
    payload,
    timestamp: Date.now()
  }
}

export function isValidMessage(message) {
  return message && message.type && Object.values(MESSAGE_TYPES).includes(message.type)
}

