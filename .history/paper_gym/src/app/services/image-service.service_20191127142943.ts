import { Observable } from "rxjs";
import { Injectable } from "@angular/core";
import { AngularFirestore } from "@angular/fire/firestore";
import { AngularFireStorage } from "@angular/fire/storage";
import { Exercise } from "../models/Exercise";
import { AuthService } from "./auth.service";
@Injectable({
  providedIn: "root"
})
export class ImageServiceService {
  constructor(
    private _afs: AngularFirestore,
    private _afStorage: AngularFireStorage,
    private _authService: AuthService
  ) {}

  async uploadImage(imageFile: Blob) {
    const imageId = this.generateId(20) + ".jpg";
    const currentUser = this._authService.getUserStored();
    let imagePath = `IMAGES/${currentUser.uid}/${imageId}`;
    let url: string = await this._afStorage
      .ref(imagePath)
      .put(imageFile)
      .then(fileSnapshot => {
        return fileSnapshot.ref.getDownloadURL().then(url => url);
      })
      .catch(error => console.log(`[UPLOAD IMG ERROR] => ${error}`));
    console.log(`Upload image url => ${url}; imageid => ${imageId}`);
    return {download_url: url, image_id: imageId};
  }

  private generateId(length: number): string {
    var result = "";
    var characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }
}
