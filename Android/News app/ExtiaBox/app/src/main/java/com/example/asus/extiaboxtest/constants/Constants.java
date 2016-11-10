package com.example.asus.extiaboxtest.constants;

import android.content.Context;
import android.content.SharedPreferences;

import com.example.asus.extiaboxtest.tools.retrofit.models.Salle;
import com.google.gson.annotations.SerializedName;

import java.util.List;

/**
 * Created by Asus on 03/11/2016.
 */

public class Constants {

    // url webszervice = http://150.16.21.40/dispobox/?action=getAllBoxes

    // constante pour l'utilisation de l'url pour retrofit
    public static final String URL_DEFAULT = "http://150.16.21.40/";

    // constante pour le model de la classe Salle
    public static final String SALLE_ID = "id";
    public static final String SALLE_NAME = "name";
    public static final String SALLE_STATE = "state";

    // constante pour le model du retour sur le webservice getAllBoxes
    public static final String WS_GETBOX_CODE = "code";
    public static final String WS_GETBOX_MESSAGE = "message";
    public static final String WS_GETBOX_LISTSALLE = "data";

    // constante pour les preferences data
    public final static String PREF_KEY_NAME = "setting_pref";
    public final static String PREF_KEY_IP = "ip_data";
}
