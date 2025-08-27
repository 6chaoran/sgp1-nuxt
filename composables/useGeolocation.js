import { ref } from 'vue'

export function useGeolocation() {
  const lat = ref(null)
  const lon = ref(null)
  const error = ref(null)
  const loading = ref(false)

  const getLoc = () => {
    if (!navigator.geolocation) {
      error.value = "Geolocation is not supported by your browser"
      return
    }

    loading.value = true
    navigator.geolocation.getCurrentPosition(
      (position) => {
        lat.value = position.coords.latitude
        lon.value = position.coords.longitude
        error.value = null
        loading.value = false
      },
      (err) => {
        switch (err.code) {
          case err.PERMISSION_DENIED:
            error.value = "User denied the request for Geolocation."
            break
          case err.POSITION_UNAVAILABLE:
            error.value = "Location information is unavailable."
            break
          case err.TIMEOUT:
            error.value = "The request to get user location timed out."
            break
          default:
            error.value = "An unknown error occurred."
        }
        loading.value = false
      }
    )
  }

  return { lat, lon, error, loading, getLoc }
}


