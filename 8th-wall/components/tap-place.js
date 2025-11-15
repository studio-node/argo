/**
 * This A-Frame component, when attached to a mesh (like ground),
 * listens for clicks on that mesh. On click, it will:
 * 1. Validate the click and the component's data.
 * 2. Create a new 3D model at the click position.
 * 3. Send the new model's placement data to the parent Vue app
 * for persistence in Supabase.
 */
export const tapPlaceComponent = {
    schema: {
      modelUrl: {type: 'string'},
    },
    init() {
      // Prefer a wayspot that's actually above this element
      let wayspot = this.el.closest('#wayspot')
      if (!wayspot) {
        wayspot = document.getElementById('wayspot')
      }
      const mesh = this.el
      if (!wayspot) {
        console.error('TapPlace: No element with id="wayspot" found.')
        return
      }
      mesh.addEventListener('click', (event) => {
        const glbUrl = this.data.modelUrl
        if (!glbUrl) {
          console.error('TapPlace: No modelUrl provided.')
          return
        }
        if (
          !event.detail ||
          !event.detail.intersection ||
          !event.detail.intersection.point
        ) {
          console.error('TapPlace: No intersection point on click event.')
          return
        }
        const sceneEl = wayspot.sceneEl || this.el.sceneEl
        if (!sceneEl) {
          console.warn(
            'TapPlace: No sceneEl found for wayspot or element. Skipping placement.'
          )
          return
        }
        const touchPoint = event.detail.intersection.point
        // Position in wayspot-local space (for persistence)
        const localPoint = wayspot.object3D.worldToLocal(touchPoint.clone())
        const pos = {
          x: localPoint.x,
          y: localPoint.y,
          z: localPoint.z,
        }
        // Get the model's quaternion for rotation
        const newElement = document.createElement('a-entity')
        // Set rotation with a random Y angle.
        // We will convert this to a quaternion for persistence.
        const rotEuler = {
          x: 0,
          y: Math.random() * 360,
          z: 0,
        }
        // Set scale
        const scl = {
          x: 0.5,
          y: 0.5,
          z: 0.5,
        }
        newElement.setAttribute('position', `${pos.x} ${pos.y} ${pos.z}`)
        newElement.setAttribute('rotation', `${rotEuler.x} ${rotEuler.y} ${rotEuler.z}`)
        newElement.setAttribute('gltf-model', glbUrl)
        newElement.setAttribute('scale', `${scl.x} ${scl.y} ${scl.z}`)
        newElement.setAttribute('shadow', {cast: true, receive: false})
        newElement.addEventListener('model-loaded', () => {
          console.log(
            '%c[8THWALL]  Model loaded successfully',
            'color:#4caf50; font-weight:bold;',
            glbUrl
          )
        })
        newElement.addEventListener('model-error', (e) => {
          console.error(
            '%c[8THWALL]  Model failed to load',
            'color:red; font-weight:bold;',
            glbUrl,
            e.detail
          )
        })
        // Prefer parenting to wayspot, but only if it's actually in a scene
        if (wayspot.sceneEl) {
          wayspot.appendChild(newElement)
        } else {
          console.warn(
            'TapPlace: wayspot has no sceneEl; attaching directly to scene instead.'
          )
          sceneEl.appendChild(newElement)
        }
        // ---
        // --- START: Fixes for Persistence ---
        // ---
        // FIX 1: Get the current VPS ID from the wayspot.
        // This assumes your 'wayspot' entity has a component (like 'named-wayspot')
        // that stores the 'wayspotId' string.
        const currentVpsId = wayspot.getAttribute('named-wayspot')?.wayspotId
        if (!currentVpsId) {
          console.error('TapPlace: Could not find currentVpsId on wayspot.')
          return
        }
        // Get the rotation as a quaternion. This is more reliable for storage.
        const rotQuaternion = newElement.object3D.quaternion
        const placement = {
          modelUrl: glbUrl,
          position: pos,
          rotation: {  // Send the quaternion
            x: rotQuaternion.x,
            y: rotQuaternion.y,
            z: rotQuaternion.z,
            w: rotQuaternion.w,
          },
          scale: scl,
        }
        console.log('--- PLACEMENT CREATED ---')
        console.log('Model URL:', placement.modelUrl)
        console.log('VPS ID:', currentVpsId)  // Log the ID
        console.log('Position:', pos.x, pos.y, pos.z)
        console.log('-------------------------')
        try {
          window.parent.postMessage(
            {
              type: 'EIGHTHWALL_PLACEMENT',  // <-- FIX 2: Match listener in Vue
              payload: {
                placement,
                vpsId: currentVpsId,         // <-- FIX 3: Add vpsId to the payload
              },
            },
            '*'
          )
          console.log(
            '%c[8THWALL] EIGHTHWALL_PLACEMENT SENT TO PARENT',
            'color:#4caf50; font-weight:bold;',
            placement
          )
        } catch (e) {
          console.error('TapPlace: Failed to post placement to parent:', e)
        }
      })
    },
  }
  