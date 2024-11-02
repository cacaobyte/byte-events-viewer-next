"use client"

import { useState } from "react"
import Image from "next/image"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { CalendarDays, Clock, Heart, MapPin, Share2, Users } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import useFetch from "@/hooks/use-fetch"
import { getDecryptedToken } from "@/lib/utils"

interface EventCardProps {
  id: string
  title: string
  date: Date
  endDate?: Date
  location: string
  imageUrl: string
  organizerName: string
  organizerAvatar: string
  category: string
  attendees: number
  price: number
  isFree: boolean
  isFavorite: boolean
  onRefresh?: () => void
}

interface SuscribedResponse {
  status: string
}

export default function EventCard({
  id = "1",
  title = "Concierto de Rock en el Parque",
  date = new Date(2023, 7, 15, 20, 0),
  endDate,
  location = "Parque Central, Ciudad de México",
  imageUrl = "/placeholder.svg?height=400&width=600",
  organizerName = "Eventos Rockeros",
  organizerAvatar = "/placeholder.svg?height=40&width=40",
  category = "Música",
  attendees = 250,
  price = 500,
  isFree = false,
  isFavorite = false,
  onRefresh,
}: EventCardProps) {
  // const [isFavorite, setIsFavorite] = useState(false)

  const formatDate = (date: Date) => {
    return format(date, "d 'de' MMMM, yyyy", { locale: es })
  }

  const formatTime = (date: Date) => {
    return format(date, "HH:mm")
  }

  // Usar el hook useFetch para la solicitud POST
  const [, , error, fetchData] = useFetch<SuscribedResponse>("/manager/tickets/events/subscribe", "POST");

  const handleSuscribed = async () => {
    try {
      const response = await fetchData({
        headers: {
          Authorization: `Bearer ${getDecryptedToken()}`,
        },
        body: {
        isSuscribed: !isFavorite,
        idEvent: id
        }
      });

      console.log("response:", response)

      if (onRefresh) {
        onRefresh();
      }
    } catch (error) {
      console.log("error:", error)
    }
  }

  return (
    <Card className="w-full">
      <CardHeader className="p-0">
        <div className="relative">
          <img
            src={imageUrl}
            alt={title}
            className="h-48 w-full rounded-t-lg object-cover"
          />
          <div className="absolute right-2 top-2 flex gap-2">
            <Badge variant="secondary" className="bg-black/50 text-white">
              {category}
            </Badge>
            {/* {price === 0 || isFree ? (
              <Badge variant="secondary" className="bg-green-500 text-white">
                Gratis
              </Badge>
            ) : (
              <Badge variant="secondary" className="bg-blue-500 text-white">
                ${price}
              </Badge>
            )} */}
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <h2 className="mb-2 line-clamp-2 text-lg font-bold">{title}</h2>
        <div className="text-muted-foreground mb-2 flex items-center text-sm">
          <CalendarDays className="mr-2 size-4" />
          {formatDate(date)}
          {endDate && ` - ${formatDate(endDate)}`}
        </div>
        <div className="text-muted-foreground mb-2 flex items-center text-sm">
          <Clock className="mr-2 size-4" />
          {formatTime(date)}
          {endDate && ` - ${formatTime(endDate)}`}
        </div>
        <div className="text-muted-foreground mb-2 flex items-center text-sm">
          <MapPin className="mr-2 size-4" />
          {location}
        </div>
        <div className="text-muted-foreground flex items-center text-sm">
          <Users className="mr-2 size-4" />
          {attendees} asistentes
        </div>
      </CardContent>
      <CardFooter className="bg-muted/50 flex items-center justify-between p-4">
        <div className="flex items-center space-x-2">
          <Avatar className="size-8 border">
            <AvatarImage src={organizerAvatar} alt={organizerName} />
            <AvatarFallback>{organizerName.charAt(0)}</AvatarFallback>
          </Avatar>
          <span className="text-sm font-semibold">{organizerName}</span>
        </div>
        <div className="flex space-x-2">
          {/* <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsFavorite(!isFavorite)}
                >
                  <Heart
                    className={`size-4 ${isFavorite ? "fill-red-500 text-red-500" : ""}`}
                  />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>
                  {isFavorite ? "Quitar de favoritos" : "Agregar a favoritos"}
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider> */}
          {/* <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Share2 className="size-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Compartir evento</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider> */}
          <Button className={`${!isFavorite ? 'bg-blue-500' : 'bg-red-500'}`} size="sm" onClick={handleSuscribed}>
            {isFavorite ? 'Desuscribirme' : 'Suscribirme'}
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}
