package net.ar90n.imagemeta;

import com.facebook.react.ReactActivity;
import com.sbugert.rnadmob.RNAdMobPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.AirMaps.AirPackage;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;

import java.util.Arrays;
import java.util.List;

import android.content.Intent;
import android.os.Bundle;
import android.support.annotation.Nullable;

import com.airbnb.android.react.maps.MapsPackage;

public class MainActivity extends ReactActivity {
    private final String IMAGE_TAG_KEY = "ImageTag";

    @Override
    protected  @Nullable Bundle getLaunchOptions() {
        String action = getIntent().getAction();
        String type = getIntent().getType();

        Bundle initialProps = null;
        if ((Intent.ACTION_SEND.equals(action))
          &&(type != null)
          &&(type.startsWith("image/")))
        {
            Bundle intent_bundle = getIntent().getExtras();
            if(intent_bundle.containsKey(Intent.EXTRA_STREAM))
            {
                String uri_str = intent_bundle.getParcelable(Intent.EXTRA_STREAM).toString();
                initialProps = new Bundle();
                initialProps.putString(IMAGE_TAG_KEY, uri_str) ;
            }
        }

        return initialProps;
    }

    @Override
    protected String getMainComponentName() {
        return "ImageMeta";
    }

    @Override
    protected boolean getUseDeveloperSupport() {
        return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
        return Arrays.<ReactPackage>asList(
            new MainReactPackage(),
            new RNAdMobPackage(),
            new VectorIconsPackage(),
            new AirPackage(),
            new MapsPackage()
        );
    }
}
