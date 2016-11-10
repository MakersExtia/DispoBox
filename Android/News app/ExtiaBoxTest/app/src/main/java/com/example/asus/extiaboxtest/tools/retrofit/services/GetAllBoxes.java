package com.example.asus.extiaboxtest.tools.retrofit.services;

import com.example.asus.extiaboxtest.constants.Constants;
import com.example.asus.extiaboxtest.tools.retrofit.models.Salle;
import com.google.gson.annotations.SerializedName;

import java.util.List;

/**
 * Created by Asus on 03/11/2016.
 */

//classe qui permet la lecture du web service getAllBoxes
public class GetAllBoxes {

    //code si < 0 = quelque chose va mal avec l'action
    @SerializedName(Constants.WS_GETBOX_CODE)
    private int code;

    //message général (utiliser quand il y a une erreur)
    @SerializedName(Constants.WS_GETBOX_MESSAGE)
    private String message;

    //list des salles
    @SerializedName(Constants.WS_GETBOX_LISTSALLE)
    private List<Salle> listSalle;

    //constructeur
    public GetAllBoxes(int code, String message, List<Salle> listSalle) {
        this.code = code;
        this.message = message;
        this.listSalle = listSalle;
    }

    //getter et setter
    public int getCode() {
        return code;
    }

    public void setCode(int code) {
        this.code = code;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public List<Salle> getListSalle() {
        return listSalle;
    }

    public void setListSalle(List<Salle> listSalle) {
        this.listSalle = listSalle;
    }
}
