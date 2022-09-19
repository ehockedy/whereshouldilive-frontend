import { PropsWithChildren, useEffect, useMemo } from 'react'
import { createPortal } from 'react-dom'

// Reference: https://betterprogramming.pub/building-a-custom-google-maps-marker-react-component-like-airbnb-in-next-js-52fb37ccfabb

// Use factory function to create this, since google API not available until loaded by MapWrapper
// so import fails if declared outside this function here.
const createOverlay = (
  position: google.maps.LatLng,
  container: HTMLElement,
  pane: keyof google.maps.MapPanes,
) => {
  class CustomOverlay extends google.maps.OverlayView {
    private position: google.maps.LatLng;
    private container: HTMLElement;
    private pane: keyof google.maps.MapPanes;

    constructor(position: google.maps.LatLng, container: HTMLElement, pane: keyof google.maps.MapPanes) {
      super();

      this.position = position;
      this.container = container;
      this.pane = pane
    }

    onAdd(): void {
      const pane = this.getPanes()?.[this.pane];
      pane?.appendChild(this.container);
    }

    onRemove(): void {
      if (this.container.parentNode !== null) {
        this.container.parentNode.removeChild(this.container)
      }
    }

    draw(): void {
      const projection = this.getProjection()
      const point = projection.fromLatLngToDivPixel(this.position)
      if (point === null) {
        return
      }

      // TODO use getBoundingClientRect() to offset
      this.container.style.transform = `translate(${point.x}px, ${point.y}px)`
    }
  }
  return new CustomOverlay(position, container, pane);
}

type OverlayProps = PropsWithChildren<{
  position: google.maps.LatLng
  pane?: keyof google.maps.MapPanes
  map: google.maps.Map
  zIndex?: number
}>

const OverlayView = ({
  position,
  pane = 'floatPane',
  map,
  zIndex,
  children,
}: OverlayProps) => {
  const container = useMemo(() => {
    const div = document.createElement('div')
    div.style.position = 'absolute'
    return div
  }, [])

  const overlay = useMemo(() => {
    return createOverlay(position, container, pane)
  }, [container, pane, position])

  useEffect(() => {
    overlay?.setMap(map)
    return () => overlay?.setMap(null)
  }, [map, overlay])

  // to move the container to the foreground and background
  // useEffect(() => {
  //   container.style.zIndex = `${zIndex}`
  // }, [zIndex, container])

  return createPortal(children, container)
}


export default OverlayView;