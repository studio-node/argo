/**
 * A-Frame component that listens for initialization data from the parent Vue app.
 * Stores the received data (user ID and placed objects) on the window object
 * for access by other components like tap-place.js
 */
export const initDataHandlerComponent = {
  schema: {
    // No props needed - component just listens for messages
  },
  
  init() {
    console.log(
      '%c[8THWALL] Init data handler component initialized',
      'color:#3f51b5; font-weight:bold;'
    )

    // Set up message listener
    const handleMessage = (event) => {
      // Security: Check origin if needed
      // if (event.origin !== 'https://your-vue-app-domain.com') return

      const eventData = event.data

      // Handle INIT_DATA messages from parent Vue app
      if (eventData && eventData.type === 'INIT_DATA') {
        const { userId, placedObjects } = eventData.payload || {}

        if (!userId) {
          console.warn('[8THWALL] Init data received but userId is missing')
          return
        }

        // Store data on window object for global access
        window._initData = {
          userId,
          placedObjects: placedObjects || []
        }

        console.log(
          '%c[8THWALL] Init data received and stored',
          'color:#4caf50; font-weight:bold;',
          {
            userId,
            placedObjectsCount: placedObjects?.length || 0
          }
        )

        // Log placed objects for debugging
        if (placedObjects && placedObjects.length > 0) {
          console.log(
            '%c[8THWALL] Placed objects:',
            'color:#9c27b0; font-weight:bold;',
            placedObjects
          )
        }
      }
    }

    // Add event listener
    window.addEventListener('message', handleMessage)

    // Store cleanup function for potential future use
    this.messageHandler = handleMessage
  },

  remove() {
    // Clean up listener if component is removed
    if (this.messageHandler) {
      window.removeEventListener('message', this.messageHandler)
    }
  }
}

