import { NgModule } from '@angular/core';
import { StatusBar } from "@ionic-native/status-bar/ngx";
import { AppComponent  } from "./app.component";
import { SplashScreen  } from "@ionic-native/splash-screen/ngx";
import { BrowserModule, HAMMER_GESTURE_CONFIG } from "@angular/platform-browser";
import { AppRoutingModule   } from "./app-routing.module";
import { RouteReuseStrategy } from "@angular/router";
import { IonicModule, IonicRouteStrategy } from "@ionic/angular";

// Firebase
import { firebaseConfig            } from "../environments/firebaseconfig";
import { AngularFireModule         } from "@angular/fire";
import { AngularFireAuthModule     } from "@angular/fire/auth";
import { AngularFirestoreModule    } from "@angular/fire/firestore";
import { AngularFireStorageModule  } from "@angular/fire/storage";
import { AngularFireDatabaseModule } from "@angular/fire/database";

// Image Picker
import { ImagePicker } from "@ionic-native/image-picker/ngx";

// Gesture config
import {IonicGestureConfig} from "./utils/IonicGestureConfig";
import {LongPressModule} from "ionic-long-press";
@NgModule({
  declarations: [
    AppComponent,
  ],
  entryComponents: [],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireAuthModule,
    AngularFirestoreModule,
    AngularFireStorageModule,
    AngularFireDatabaseModule,
    IonicModule.forRoot({ animated: false }),
    AngularFireModule.initializeApp(firebaseConfig),
    LongPressModule
  ],
  providers: [
    StatusBar,
    ImagePicker,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    { provide: HAMMER_GESTURE_CONFIG, useClass: IonicGestureConfig}
  ],
  bootstrap: [ AppComponent ],
})
export class AppModule {}
