import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';

interface MarcadorColor {
  color: string;
  marker?: mapboxgl.Marker;
  centro?: [number, number];
}

@Component({
  selector: 'app-marcadores',
  templateUrl: './marcadores.component.html',
  styles: [`
    .list-group {
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 1000;
    }
    li {
      cursor: pointer;
    }
  `
  ]
})
export class MarcadoresComponent implements AfterViewInit {

  @ViewChild('mapa') divMapa!: ElementRef;

  mapa!: mapboxgl.Map;
  zoomLevel: number = 15;
  center: [number, number] = [-84.10351579665297, 9.85561855950197];
  // Arreglo de marcadores
  marcadores: MarcadorColor[] = [];

  ngAfterViewInit(): void {

    
    this.mapa = new mapboxgl.Map({
      container: this.divMapa.nativeElement,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: this.center,
      zoom: this.zoomLevel
    });

    this.getLocalStorage();
    
  }
  
  irMarcador(marker:mapboxgl.Marker) {
    this.mapa.flyTo({
      center: marker!.getLngLat(),
      zoom: 18
    })
  }
  
  agregarMarcador() {
    
    const color = "#xxxxxx".replace(/x/g, y => (Math.random() * 16 | 0).toString(16));
    
    const nuevoMarcador = new mapboxgl.Marker({
      draggable: true,
      color: color
    })
      .setLngLat(this.center)
      .addTo(this.mapa);
    
    this.marcadores.push({
      color,
      marker: nuevoMarcador
    });

    this.SetLocalStorage();

    nuevoMarcador.on('dragend', () => {
      this.SetLocalStorage();
    })
  }

  borrarMarcador(index:number) {
    this.marcadores[index].marker?.remove();
    this.marcadores.splice(index, 1);
    this.SetLocalStorage();
  }

  SetLocalStorage() {

    const lnglatArr: MarcadorColor[] = [];
    this.marcadores.forEach(m => {
      const color = m.color;
      const { lng, lat } = m.marker!.getLngLat();

      lnglatArr.push({
        color: m.color,
        centro: [lng, lat]
      })
    })
    localStorage.setItem('marcadores', JSON.stringify(lnglatArr))
  }

  getLocalStorage() {
    if (!localStorage.getItem('marcadores')) {
      return;
    }
    const lnglatArr: MarcadorColor[] = JSON.parse(localStorage.getItem('marcadores')!);
    
    lnglatArr.forEach(m => {
      const newMarker = new mapboxgl.Marker({
        color: m.color,
        draggable: true
      })
        .setLngLat(m.centro!)
        .addTo(this.mapa);
      
      this.marcadores.push({
        marker: newMarker,
        color: m.color
      })
      newMarker.on('dragend', () => {
        this.SetLocalStorage();
      })

    } )


  }

}
