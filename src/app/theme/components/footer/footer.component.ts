import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  //Everest Hawk Inc.26 Mosley Crescent, Brampton, ON L6Y 5C7, 43.660017, -79.769326
  public lat: number = 43.660017;
  public lng: number = -79.769326;
  public zoom: number = 12;

  constructor() { }

  ngOnInit() { }

  subscribe(){ }

}