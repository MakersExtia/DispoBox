package com.example.asus.extiaboxtest.tools.retrofit.settings;

import com.example.asus.extiaboxtest.constants.Constants;
import com.example.asus.extiaboxtest.tools.retrofit.interfaces.WebServicesInterface;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

import retrofit2.Retrofit;
import retrofit2.converter.gson.GsonConverterFactory;

/**
 * Created by sviatoslav on 26/10/2016.
 */

//Pour retrofit V2
public class ServerServicesProvider {

    WebServicesInterface webServicesInterface;
    //Server endpoint setted by user
    private String endPoint;

    public ServerServicesProvider(){
        endPoint = Constants.URL_DEFAULT;
    }

    public WebServicesInterface getWebServicesInterface() {
        return webServicesInterface;
    }

    public void setWebServicesInterface(WebServicesInterface webServicesInterface) {
        this.webServicesInterface = webServicesInterface;
    }

    public String getEndPoint() {
        return endPoint;
    }

    public void setEndPoint(String endPoint) {
        this.endPoint = endPoint;
    }

    public void createWebInterface(){
        //Should be called in Application's onCreate()
        Gson gson = new GsonBuilder()
                .setDateFormat("yyyy-MM-dd HH:mm:ss")
                .create();
        Retrofit retrofit = new Retrofit.Builder()
                .addConverterFactory(GsonConverterFactory.create(gson))
                .baseUrl(endPoint)
                .build();
        webServicesInterface = retrofit.create(WebServicesInterface.class);
    }
}
