/**
 * A-Frame component that loads and displays placed objects from window._initData
 * when a wayspot is found. Only loads objects that match the current location's vps_location_id.
 */
export const loadPlacedObjectsComponent = {
  schema: {
    // No props needed - component reads from window._initData
  },
  
  init() {
    console.log(
      '%c[8THWALL] Load placed objects component initialized',
      'color:#3f51b5; font-weight:bold;'
    )

    const wayspot = this.el
    // Get wayspot name from named-wayspot component
    const namedWayspotData = wayspot.getAttribute('named-wayspot')
    const wayspotName = namedWayspotData?.name || namedWayspotData
    
    if (!wayspotName) {
      console.warn('[8THWALL] Load placed objects: No wayspot name found')
      return
    }

    this.wayspotName = wayspotName
    this.objectsLoaded = false // Track if objects have been loaded to avoid duplicates

    // Wait for wayspot to be found before loading objects
    const foundWayspot = ({detail}) => {
      if (wayspotName !== detail.name) {
        return
      }

      console.log(
        '%c[8THWALL] Wayspot found, loading placed objects',
        'color:#4caf50; font-weight:bold;',
        { wayspotName }
      )

      // Wait a bit for init data to be available, then load objects
      this.loadObjectsForLocation()
    }

    this.el.sceneEl.addEventListener('xrprojectwayspotfound', foundWayspot)
    this.foundHandler = foundWayspot
  },

  loadObjectsForLocation() {
    // Prevent loading objects multiple times
    if (this.objectsLoaded) {
      return
    }

    // Check if init data is available, retry if not
    if (!window._initData) {
      console.warn('[8THWALL] Init data not yet available, will retry...')
      setTimeout(() => this.loadObjectsForLocation(), 500)
      return
    }

    const { placedObjects, vps_location_id } = window._initData

    if (!vps_location_id) {
      console.warn(
        '%c[8THWALL] No vps_location_id provided in init data, skipping object loading',
        'color:#ff9800; font-weight:bold;'
      )
      return
    }

    if (!placedObjects || placedObjects.length === 0) {
      console.log('[8THWALL] No placed objects to load')
      this.objectsLoaded = true
      return
    }

    // Filter placed objects by vps_location_id
    const filteredObjects = placedObjects.filter(
      obj => obj.vps_location_id === vps_location_id
    )

    console.log(
      '%c[8THWALL] Filtered placed objects for location',
      'color:#9c27b0; font-weight:bold;',
      {
        totalObjects: placedObjects.length,
        filteredCount: filteredObjects.length,
        vps_location_id
      }
    )

    // Load each filtered object
    filteredObjects.forEach((obj) => {
      this.createPlacedObjectEntity(obj)
    })

    this.objectsLoaded = true
  },

  createPlacedObjectEntity(placedObject) {
    const wayspot = this.el
    const sceneEl = wayspot.sceneEl

    if (!sceneEl) {
      console.error('[8THWALL] No sceneEl found for wayspot')
      return
    }

    // Get model URL from the placed object
    // The placed object should have a model relation with model_path
    const modelUrl = placedObject.model?.model_path || placedObject.model_path
    
    if (!modelUrl) {
      console.warn('[8THWALL] Placed object missing model URL:', placedObject)
      return
    }

    // Create entity for the placed object
    const entity = document.createElement('a-entity')
    
    // Set position (convert from JSON to A-Frame format)
    const pos = placedObject.position
    entity.setAttribute('position', `${pos.x} ${pos.y} ${pos.z}`)
    
    // Set rotation from quaternion
    const rot = placedObject.rotation
    if (rot.w !== undefined) {
      // Quaternion format
      const quaternion = new THREE.Quaternion(rot.x, rot.y, rot.z, rot.w)
      entity.object3D.quaternion.copy(quaternion)
    } else {
      // Euler format (fallback)
      entity.setAttribute('rotation', `${rot.x || 0} ${rot.y || 0} ${rot.z || 0}`)
    }
    
    // Set scale
    const scale = placedObject.scale
    entity.setAttribute('scale', `${scale.x} ${scale.y} ${scale.z}`)
    
    // Set model
    entity.setAttribute('gltf-model', modelUrl)
    entity.setAttribute('shadow', { cast: true, receive: false })
    
    // Add event listeners
    entity.addEventListener('model-loaded', () => {
      console.log(
        '%c[8THWALL] Placed object model loaded',
        'color:#4caf50; font-weight:bold;',
        { modelUrl, id: placedObject.id }
      )
    })
    
    entity.addEventListener('model-error', (e) => {
      console.error(
        '%c[8THWALL] Placed object model failed to load',
        'color:red; font-weight:bold;',
        { modelUrl, id: placedObject.id, error: e.detail }
      )
    })

    // Attach to wayspot
    wayspot.appendChild(entity)
    
    console.log(
      '%c[8THWALL] Created placed object entity',
      'color:#4caf50; font-weight:bold;',
      { id: placedObject.id, modelUrl }
    )
  },

  remove() {
    // Clean up event listener
    if (this.foundHandler) {
      this.el.sceneEl.removeEventListener('xrprojectwayspotfound', this.foundHandler)
    }
  }
}

