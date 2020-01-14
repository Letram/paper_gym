import { Component, OnInit      } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

// Models
import { Exercise } from 'src/app/models/Exercise';

// Services
import { ExerciseService     } from 'src/app/services/exercise.service';
import { ImageServiceService } from 'src/app/services/image-service.service';

// Image Picker
import { ImagePicker } from '@ionic-native/image-picker/ngx';

// Camera
import {Camera, CameraOptions} from "@ionic-native/camera/ngx"
// jQuery
declare var $: any;

@Component({
  selector: 'app-add',
  templateUrl: './add.page.html',
  styleUrls: ['./add.page.scss']
})
export class AddPage implements OnInit {

  public newExercise: Exercise;

  public errorMessage = 'De algo hay que morir';

  public muscleGroup: string;
  
  public dayNames: string[];
  public imagesPicked: string[];
  public imagesPickedAux: any = [];
  public userMuscleGroups: string[];

  private disabledSubmitButton = false;

  private _editingId: string = "";
  private _isEdited: boolean = false;
  private _userExercises: Exercise[];
  private _imagePicked: File;
  private _imagesPicked: any[];
  private _imagePickerOptions: any;

  // ─────────────── //
  //     METHODS     //
  // ─────────────── //

  constructor( private _router: Router, private _route: ActivatedRoute, private _imagePicker: ImagePicker, private _camera: Camera, private _exerciseService: ExerciseService, private _imageService: ImageServiceService ) {
    this.dayNames    = [ 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday' ];
    this.newExercise = new Exercise();
    this.muscleGroup = '';
  }

  ngOnInit() {
    
    // console.log("Add exercise page init...");
    
    this.newExercise = new Exercise();
    
    // console.log(this.newExercise);
    // console.log({arr: this.newExercise.days, length: this.newExercise.days.length});

    this.muscleGroup = "";
    this._exerciseService.getMuscleGroups().subscribe(
      userMuscleGroupsObject => {
        if ( userMuscleGroupsObject !== undefined ) {
          if (userMuscleGroupsObject.MUSCLEGROUPS) {
            this.userMuscleGroups = userMuscleGroupsObject.MUSCLEGROUPS;
          }
        }
        // console.log(this.userMuscleGroups);
      },
      error =>
        console.log(`[ADD PAGE ERR {RETRIEVING USER MUSCLEGROUPS}] => ${error}`)
    );

    this._route.queryParams.subscribe( _ => {
      
      if ( this._router.getCurrentNavigation().extras.state && this._router.getCurrentNavigation().extras.state.edit ) {
        
        let navigationExercise = this._router.getCurrentNavigation().extras.state.exercise;

        this._isEdited = this._router.getCurrentNavigation().extras.state.edit;
        this._editingId = navigationExercise.id;

        this.newExercise = Object.assign(this.newExercise, navigationExercise);
        
        this.muscleGroup = "";
        this.imagesPicked = this.newExercise.images;
        this.imagesPickedAux = [... this.newExercise.images];
        console.log({exercise: this.newExercise, images: this.imagesPickedAux});
      }
    });

    this._exerciseService.getExercises().subscribe(
      response => {
        this._userExercises = [];
        for (let i = 0; i < response.length; i++) {
          let exerciseAux = response[i].payload.doc.data();
          exerciseAux.id = response[i].payload.doc.id;
          // console.log({ exerciseAux, id: response[i].payload.doc.id });
          this._userExercises.push(exerciseAux);
        }
        // console.log(this._userExercises);
        if ( !response ) {
          console.log("No exercises available yet...");
        }

        // console.log( this._userExercises );
      },
      error => {
        console.log(`[ ADD PAGE ERROR ] » ${ error }`);
      }
    );
  }

  async onAddExercise() {

    if ( this.checkEmptyFields( this.newExercise.name, '.required', true )) {
      return;
    }

    // Bloqueamos el botón para evitar que el usuario haga clic repetidamente y se inserte más de una vez el mismo ejercicio
    this.disabledSubmitButton = true;

    // Creation of a new exercise
    if ( !this._isEdited ) {

      await this._exerciseService.createExercise( this.newExercise, this._imagesPicked)
        .then(() => {
          this.muscleGroup = '';
          this.newExercise = new Exercise();
          this._router.navigate([ 'home' ]);
        });

    // Updating existing exercise
    } else {
      this.newExercise.images.forEach((element) => {
        if(!this.imagesPickedAux.find(image => image.id == element.id))
          this._imageService.removeImage(element.id).then();
      });
      this.newExercise.images = [... this.imagesPickedAux];
      await this._exerciseService.updateExercise( this.newExercise, this._editingId )
        .then(() => {
          this._router.navigate([ 'home' ]);
        });

    }

    // Desbloqueamos el botón tras haberse insertado el ejercicio
    this.disabledSubmitButton = false;

  }

  selectDay( day: number ) {
    this.newExercise.days[ day ] = !this.newExercise.days[ day ];
  }

  // ──────────────────── //
  //     MUSCLE GROUP     //
  // ──────────────────── //

  addMuscleGroup() {

    if ( this.checkEmptyFields( this.muscleGroup, '.muscle-group .input' )) {
      return;
    }

    this.newExercise.muscleGroups.push( this.muscleGroup );

    // Añadimos el grupo muscular a la BD en el caso de que no se haya hecho anteriormente.
    if ( this.userMuscleGroups && this.userMuscleGroups.indexOf( this.muscleGroup ) === -1 ) {
      this.userMuscleGroups.push( this.muscleGroup );
      this._exerciseService.updateMuscleGroup( this.userMuscleGroups );
    }

    // Vaciamos el campo
    this.muscleGroup = '';

  }

  removeMuscleGroup( muscleGroupToRemove: string ): void {

    // Eliminamos el grupo muscular
    this.newExercise.muscleGroups.splice( this.newExercise.muscleGroups.findIndex( exerciseMuscleGroup => exerciseMuscleGroup == muscleGroupToRemove ), 1 );

    // ¿?
    if ( this._userExercises.filter( userExercise => userExercise.muscleGroups.indexOf( muscleGroupToRemove ) !== -1 ).length <= 1 ) {
      this.userMuscleGroups.splice( this.userMuscleGroups.indexOf( muscleGroupToRemove ), 1);
      this._exerciseService.updateMuscleGroup( this.userMuscleGroups );
    }
  }

  takePicture(){
    $("#submit_btn").attr("disabled", true);
    let cameraOptions: CameraOptions = {
      destinationType: this._camera.DestinationType.DATA_URL,
      encodingType: this._camera.EncodingType.JPEG,
      mediaType: this._camera.MediaType.PICTURE,
      correctOrientation: true,
      targetWidth: 300
    }

    this._camera.getPicture(cameraOptions).then(
      (base64Image) => {
        let blob: Blob = this.getBlob(base64Image, ".jpg");
        this._imageService.uploadImage(blob).then(response => {
          //response is an object with a download_url and an image_id attributes
          console.log({response});

          this.newExercise.images.push({
            url: response.download_url,
            id: response.image_id
          });
          this.imagesPickedAux.push({
            url: response.download_url,
            id: response.image_id
          });

          // Enabling the submit button once the upload of the image has finished.
            $('#submit_btn').removeAttr("disabled");
          });
      },
      error => {
        console.log( `[ERROR TAKING A PICTURE] => ${error}` );
      }
    );

  }

  // ────────────── //
  //     IMAGES     //
  // ────────────── //

  //https://stackoverflow.com/questions/55853879/convert-image-uri-to-file-or-blob/55858622#55858622

  /**
   * To upload images:
   *  1.- Get the base64 encoded img from ImagePicker
   *  2.- Convert the base64 img into Blob file and give it a name.
   *
   *  3a.- Save those objects of {name, blob} in an array of data to be uploaded to Firebase Storage as it accepts blob files.
   *  OR
   *  3b.- Upload each image to Firebase once they are selected. We will have to wait for the data {img_url, img_id}
   */
  pickImages() {
    // Prevent the user to upload the same exercise more than one time disabling the button
    $("#submit_btn").attr("disabled", true);
    this.imagesPicked = [];
    this.imagesPickedAux = [];
    this._imagesPicked = [];
    this._imagePickerOptions = {
      //only works on android => maximum pictures to be picked
      maximumImagesCount: 4,
      //maximum width of the image. this will keep aspect-ratio no matter what
      width: 300,
      // quality of resized image, defaults to 100
      quality: 50,
      // output type, defaults to FILE_URIs.
      // available options are
      // window.imagePicker.OutputType.FILE_URI (0) or
      // window.imagePicker.OutputType.BASE64_STRING (1)
      outputType: 1
    };
    this.imagesPicked = [];

    // Step 1.
    this._imagePicker.getPictures(this._imagePickerOptions).then(
      results => {
        for (let i = 0; i < results.length; i++) {
          //this.imagesPicked.push(`data:image/jpeg;base64,${results[i]}`);

          // Step 2.
          let blob: Blob = this.getBlob(results[i], ".jpg");
          // Step 3a.
          //this._imagesPicked.push({name: `image${i}.jpg`, blob})
          //Step 3b
          this._imageService.uploadImage(blob).then(response => {
            //response is an object with a download_url and an image_id attributes
            console.log({response});

            this.newExercise.images.push({
              url: response.download_url,
              id: response.image_id
            });
            this.imagesPickedAux.push({
              url: response.download_url,
              id: response.image_id
            });

            // Enabling the submit button once the upload of the image has finished.
            if(i === results.length-1){
              $('#submit_btn').removeAttr("disabled");
            }
          });
        }
        console.log(this._imagesPicked);
      },
      error => console.log(error)
    );
  }

  removeImage(imageIndex) {
    this.imagesPickedAux.splice(imageIndex, 1);
    console.log(this.imagesPickedAux);
    /*
    let imageId = this.newExercise.images[imageIndex].id;
    this._imageService.removeImage(imageId).then(() => {
      this.newExercise.images.splice(imageIndex, 1);
    });
    */
  }

  imagePicked( event: any ) {
    this._imagePicked = event.target.files[0];
  }

  private getBlob(
    b64Data: string,
    contentType: string,
    sliceSize: number = 512
  ): Blob {
    contentType = contentType || "";
    sliceSize = sliceSize || 512;
    let byteCharacters = atob(b64Data);
    let byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      let slice = byteCharacters.slice(offset, offset + sliceSize);

      let byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      let byteArray = new Uint8Array(byteNumbers);

      byteArrays.push(byteArray);
    }
    let blob = new Blob(byteArrays, { type: contentType });
    return blob;
  }

  // ─────────────────── //
  //     VALIDATIONS     //
  // ─────────────────── //

  checkEmptyFields( text: string, selector: string, isSubmit: boolean = false ): boolean {

    const VALUE = text.trim();

    if ( VALUE === '' ) {
      this.highlightBorder( selector );

      if ( isSubmit ) {
        this.showErrorMessage( 'You have to write the exercise name' );
      }
    }

    return VALUE === '';

  }

  highlightBorder( selector: string ) {

    // Resaltamos la entrada
    $( `${ selector }` ).addClass( 'red-border' );

    // Dejamos de resaltar la entrada pasado un tiempo
    setTimeout( () => {
      $( `${ selector }` ).removeClass( 'red-border' );
    }, 250);

  }

  showErrorMessage( message: string ) {

    this.errorMessage = message;

    // Mostramos el mensaje de error
    $( '.error-message' ).css( 'opacity', '1');

    // Ocultamos el mensaje de error pasado un tiempo
    setTimeout( () => {
      $( '.error-message' ).css( 'opacity', '0');
    }, 2500);

  }
}