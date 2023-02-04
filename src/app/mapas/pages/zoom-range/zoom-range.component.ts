import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';

@Component({
  selector: 'app-zoom-range',
  templateUrl: './zoom-range.component.html',
  styles: [`
  .row {
    background-color: white;
    position: fixed;
    bottom: 50px;
    left: 50px;
    padding: 10px;
    border-radius: 5px;
    z-index: 999;
  }
  .fixed-width {
    width: 480px;
  }
`
  ]
})
export class ZoomRangeComponent implements AfterViewInit, OnDestroy {

  @ViewChild('mapa') divMapa!: ElementRef;

  mapa!: mapboxgl.Map;
  zoomLevel: number = 20;
  center: [number, number] = [-84.10351579665297, 9.85561855950197];
  ngOnDestroy(): void {
    this.mapa.off('zoom', () => {});
    this.mapa.off('zoomend', () => {});
    this.mapa.off('move', () => {});
  }
  ngAfterViewInit(): void {
    this.mapa = new mapboxgl.Map({
      container: this.divMapa.nativeElement,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: this.center,
      zoom: this.zoomLevel
    });
    this.mapa.on('zoom', (ev) => {
      const zoomActual = this.mapa.getZoom();
      this.zoomLevel = zoomActual;
    })
    this.mapa.on('zoomend', (ev) => {
      if (this.mapa.getZoom() > 18) {
        this.mapa.zoomTo(18);
      }
    })
    this.mapa.on('move', (event) => {
      const target = event.target;
      const { lng, lat } = target.getCenter();
      this.center = [ lng, lat ];
    })
  }
  zoomIn() {
    this.mapa.zoomIn();
  }
  zoomOut() {
    this.mapa.zoomOut();
  }
  zoomCambio( value: string ) {
    this.mapa.zoomTo(Number(value));
  }
}
