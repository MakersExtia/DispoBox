package com.example.asus.extiaboxtest.tools.retrofit.interfaces;

import com.example.asus.extiaboxtest.tools.retrofit.services.GetAllBoxes;

import retrofit2.Call;
import retrofit2.http.GET;

//import retrofit.Callback;

/**
 * Created by sviatoslav on 26/10/2016.
 */
public interface WebServicesInterface {

    //web service qui permet de récupérer l'état des capteurs de mouvement dans les salles
    @GET("/dispobox/?action=getAllBoxes")
    Call<GetAllBoxes> getAllBoxes();
}
