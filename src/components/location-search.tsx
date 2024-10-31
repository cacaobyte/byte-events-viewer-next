"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api"
import { Loader2, MapPin, MapPinOff, X } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const libraries = ["places"]

const guatemalaBounds = {
  north: 17.8152,
  south: 13.7373,
  west: -92.2413,
  east: -88.2232,
}

function useDebounce(value: string, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

interface LocationSearchProps {
  onChange?: (location: string | null) => void
  value?: string
  defaultValue?: string
}

// Ejemplo de uso:
// <LocationSearch
//   defaultValue="14.9122,-89.5342"
//   onChange={(location) => console.log(location)}
// />

export default function LocationSearch({
  onChange,
  value,
  defaultValue,
}: LocationSearchProps) {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: "AIzaSyCzdyX2__m8QikLSrUm7cLqwSr02lEb-M4",
    libraries: libraries as any,
  })

  const [map, setMap] = useState<google.maps.Map | null>(null)
  const [center, setCenter] = useState({ lat: 14.6349, lng: -90.5069 })
  const [markerPosition, setMarkerPosition] = useState<{
    lat: number
    lng: number
  } | null>(null)
  const [inputValue, setInputValue] = useState("")
  const [coordinates, setCoordinates] = useState<string | null>(null)
  const [address, setAddress] = useState("")

  const debouncedInputValue = useDebounce(inputValue, 300)
  const [predictions, setPredictions] = useState<
    google.maps.places.AutocompletePrediction[]
  >([])
  const [isSearching, setIsSearching] = useState(false)
  const [showMap, setShowMap] = useState(false)
  const [locationSelected, setLocationSelected] = useState(false)

  const autocompleteService =
    useRef<google.maps.places.AutocompleteService | null>(null)
  const placesService = useRef<google.maps.places.PlacesService | null>(null)
  const geocoder = useRef<google.maps.Geocoder | null>(null)
  const sessionToken =
    useRef<google.maps.places.AutocompleteSessionToken | null>(null)

  const parseCoordinates = (
    coordString: string
  ): { lat: number; lng: number } | null => {
    const parts = coordString.split(",").map((part) => parseFloat(part))
    return parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])
      ? { lat: parts[0], lng: parts[1] }
      : null
  }

  const stringifyCoordinates = (coords: {
    lat: number
    lng: number
  }): string => {
    return `${coords.lat},${coords.lng}`
  }

  const searchInitialLocation = useCallback(
    (initialValue: string) => {
      const coords = parseCoordinates(initialValue)
      if (coords) {
        setCoordinates(initialValue)
        setCenter(coords)
        setMarkerPosition(coords)
        setLocationSelected(true)
        setShowMap(true)
        if (map) {
          map.panTo(coords)
          map.setZoom(15)
        }
        if (geocoder.current) {
          geocoder.current.geocode({ location: coords }, (results, status) => {
            if (status === "OK" && results && results[0]) {
              setAddress(results[0].formatted_address)
              setInputValue(results[0].formatted_address)
            }
          })
        }
      }
    },
    [map]
  )

  useEffect(() => {
    if (isLoaded && (value || defaultValue)) {
      const initialCoords = value || defaultValue
      if (initialCoords) {
        searchInitialLocation(initialCoords)
      }
    }
  }, [isLoaded, value, defaultValue, searchInitialLocation])

  useEffect(() => {
    if (debouncedInputValue.length > 2) {
      fetchPredictions(debouncedInputValue)
    } else {
      setPredictions([])
    }
  }, [debouncedInputValue])

  const onLoad = useCallback((map: google.maps.Map) => {
    setMap(map)
    placesService.current = new window.google.maps.places.PlacesService(map)
    map.setOptions({
      gestureHandling: "cooperative",
    })
  }, [])

  const onUnmount = useCallback(() => {
    setMap(null)
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setAddress(newValue)
    setInputValue(newValue)
    setLocationSelected(false)
    setCoordinates(null)
    setMarkerPosition(null)
    onChange?.(null)
    if (newValue.length > 2) {
      fetchPredictions(newValue)
    } else {
      setPredictions([])
    }
  }

  const fetchPredictions = (input: string) => {
    if (autocompleteService.current && sessionToken.current) {
      setIsSearching(true)
      autocompleteService.current.getPlacePredictions(
        {
          input,
          sessionToken: sessionToken.current,
          bounds: guatemalaBounds,
          componentRestrictions: { country: "gt" },
          types: ["geocode", "establishment"],
        },
        (predictions, status) => {
          setIsSearching(false)
          if (
            status === google.maps.places.PlacesServiceStatus.OK &&
            predictions &&
            predictions.length > 0
          ) {
            setPredictions(predictions)
          } else {
            console.error("Autocomplete prediction error:", status)
            setPredictions([])
          }
        }
      )
    } else {
      console.error("Autocomplete service or session token not available")
    }
  }

  const handlePredictionClick = (
    prediction: google.maps.places.AutocompletePrediction
  ) => {
    setAddress(prediction.description)
    setPredictions([])
    setLocationSelected(true)
    setShowMap(true)
    if (placesService.current) {
      placesService.current.getDetails(
        {
          placeId: prediction.place_id,
          fields: ["geometry", "formatted_address"],
        },
        (place, status) => {
          if (
            status === google.maps.places.PlacesServiceStatus.OK &&
            place &&
            place.geometry &&
            place.geometry.location
          ) {
            const newPos = {
              lat: place.geometry.location.lat(),
              lng: place.geometry.location.lng(),
            }
            const coordString = stringifyCoordinates(newPos)
            setCoordinates(coordString)
            setMarkerPosition(newPos)
            setCenter(newPos)
            setAddress(place.formatted_address || prediction.description)
            setInputValue(place.formatted_address || prediction.description)
            onChange?.(coordString)
            if (map) {
              map.panTo(newPos)
              map.setZoom(15)
            }
          }
        }
      )
    }
  }

  const handleMapClick = (e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      const newPos = {
        lat: e.latLng.lat(),
        lng: e.latLng.lng(),
      }
      setMarkerPosition(newPos)
      setCenter(newPos)
      updateInputFromCoordinates(newPos)
      setLocationSelected(true)
    }
  }

  const updateInputFromCoordinates = (coordinates: {
    lat: number
    lng: number
  }) => {
    if (geocoder.current) {
      geocoder.current.geocode({ location: coordinates }, (results, status) => {
        if (status === "OK" && results && results[0]) {
          const formattedAddress = results[0].formatted_address
          setAddress(formattedAddress)
          setInputValue(formattedAddress)
        }
      })
    }
    const coordString = stringifyCoordinates(coordinates)
    setCoordinates(coordString)
    setCenter(coordinates)
    onChange?.(coordString)
    setLocationSelected(true)
    if (map) {
      map.panTo(coordinates)
      map.setZoom(15)
    }
  }

  const clearInput = () => {
    setAddress("")
    setInputValue("")
    setCoordinates(null)
    setMarkerPosition(null)
    setPredictions([])
    setLocationSelected(false)
    setShowMap(false)
    setCenter({ lat: 14.6349, lng: -90.5069 })
    if (map) {
      map.setZoom(8)
    }
    onChange?.(null)
  }

  const toggleMap = () => {
    setShowMap((prev) => !prev)
  }

  useEffect(() => {
    if (isLoaded && !autocompleteService.current) {
      autocompleteService.current =
        new window.google.maps.places.AutocompleteService()
      geocoder.current = new window.google.maps.Geocoder()
      sessionToken.current =
        new window.google.maps.places.AutocompleteSessionToken()
    }
  }, [isLoaded])

  if (loadError) return <div>Error loading maps</div>
  if (!isLoaded)
    return (
      <div className="flex h-[600px] items-center justify-center">
        <Loader2 className="size-8 animate-spin" />
      </div>
    )

  return (
    <div className="w-full" data-show-map={showMap}>
      <div className="relative">
        <Label htmlFor="location" className="mb-2 block">
          Ubicación
        </Label>
        <div className="relative flex items-center gap-2">
          <Input
            id="location"
            type="text"
            placeholder="Buscar ubicación..."
            value={address}
            onChange={handleInputChange}
            className="pr-20"
            autoComplete="off"
          />
          {inputValue && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-10"
              onClick={clearInput}
            >
              <X className="size-4" />
            </Button>
          )}
          <Button size="icon" type="button" onClick={toggleMap}>
            {showMap ? (
              <MapPinOff className="size-4" />
            ) : (
              <MapPin className="size-4" />
            )}
          </Button>
          {isSearching && (
            <Loader2 className="text-muted-foreground absolute right-20 top-1/2 size-4 -translate-y-1/2 animate-spin" />
          )}
        </div>
        {!locationSelected &&
          inputValue.length > 2 &&
          (predictions.length > 0 ||
            (!isSearching && predictions.length === 0)) && (
            <ul className="bg-background border-input absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md border">
              {predictions.length > 0 ? (
                predictions.map((prediction) => (
                  <li
                    key={prediction.place_id}
                    className={cn(
                      "hover:bg-accent hover:text-accent-foreground cursor-pointer px-4 py-2",
                      "focus:bg-accent focus:text-accent-foreground focus:outline-none"
                    )}
                    onClick={() => handlePredictionClick(prediction)}
                    tabIndex={0}
                  >
                    {prediction.description}
                  </li>
                ))
              ) : (
                <li className="text-muted-foreground px-4 py-2">
                  No se encontraron resultados
                </li>
              )}
            </ul>
          )}
      </div>
      <div
        className={cn(
          "w-full overflow-hidden rounded-md transition-all duration-500 ease-in-out [[data-show-map=false]_&]:h-0 [[data-show-map=true]_&]:mt-2 [[data-show-map=true]_&]:h-[400px]"
        )}
      >
        <GoogleMap
          mapContainerStyle={{ width: "100%", height: "100%" }}
          center={center}
          zoom={8}
          onLoad={onLoad}
          onUnmount={onUnmount}
          onClick={handleMapClick}
          options={{
            streetViewControl: false,
            mapTypeControl: false,
          }}
        >
          {markerPosition && (
            <Marker
              position={markerPosition}
              draggable={true}
              onDragEnd={(e) => {
                if (e.latLng) {
                  const newPos = {
                    lat: e.latLng.lat(),
                    lng: e.latLng.lng(),
                  }
                  setMarkerPosition(newPos)
                  setCenter(newPos)
                  updateInputFromCoordinates(newPos)
                  map?.setZoom(15)
                  setLocationSelected(true)
                }
              }}
            />
          )}
        </GoogleMap>
      </div>
    </div>
  )
}
