import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class API_URL {

  public static URLS = {

   getKeyStat: "5c04dd7f330000e900d01e32",
   getCourses: "5c04e5553300005700d01e4e",
   getTopEmployees: "5c04e6cf3300002900d01e56",
   getTotalNoOfBadges: "5c04e7333300007800d01e5d",
   getTopResorts: "5c04ea753300006a00d01e6e",
   getBadgesAndCertification: '5c04eb4a330000e900d01e70',
   getReservationByResort: '5c04eba63300007900d01e71'
  }

}
