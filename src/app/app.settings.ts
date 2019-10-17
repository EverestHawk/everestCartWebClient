import { Injectable } from '@angular/core';

export class Settings {
    constructor(public name: string,
                public theme: string) { }
}

@Injectable()
export class AppSettings {
    public settings = new Settings(
        'EverestCart - Handicrafts at its best',  // Title
        'red'     // green, blue, red, pink, purple, grey
    )
}