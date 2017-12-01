package com.inmap;

import android.app.Application;

import com.facebook.react.ReactApplication;
import com.showlocationservicesdialogbox.LocationServicesDialogBoxPackage;
import com.reactnative.photoview.PhotoViewPackage;
import fr.bamlab.rnimageresizer.ImageResizerPackage;
import com.devfd.RNGeocoder.RNGeocoderPackage;
import com.airbnb.android.react.maps.MapsPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;
import com.imagepicker.ImagePickerPackage;
import com.RNFetchBlob.RNFetchBlobPackage;    

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
            new LocationServicesDialogBoxPackage(),
            new PhotoViewPackage(),
            new ImageResizerPackage(),
            new RNGeocoderPackage(),
            new MapsPackage(),
            new ImagePickerPackage(),
            new RNFetchBlobPackage()
      );
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
  }
}
