"use client"

import React from "react"

import { ContentLayout } from "@/components/admin-panel/content-layout"
import PlaceholderContent from "@/components/demo/placeholder-content"

export default function HomePage() {
  return (
    <>
      <ContentLayout title="Home">
        <PlaceholderContent />
        {/* <PlaceholderContent />
        <PlaceholderContent />
        <PlaceholderContent />
        <PlaceholderContent /> */}
      </ContentLayout>
    </>
  )
}
