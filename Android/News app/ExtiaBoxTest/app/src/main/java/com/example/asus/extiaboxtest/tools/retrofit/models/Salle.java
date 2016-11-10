package com.example.asus.extiaboxtest.tools.retrofit.models;

import com.example.asus.extiaboxtest.constants.Constants;
import com.google.gson.annotations.SerializedName;

/**
 * Created by Asus on 03/11/2016.
 */

public class Salle {
    //id de la salle
    @SerializedName(Constants.SALLE_ID)
    private String id;

    //nom de la sallle
    @SerializedName(Constants.SALLE_NAME)
    private String name;

    //etat du capteur de mouvement 0 == green (disponible), 1 == rouge (indisponible), else == gris (autre)
    @SerializedName(Constants.SALLE_STATE)
    private int state;

    //etage ou se trouve la salle
    private int etage;

    //constructeur
    public Salle(String id, String name, int state) {
        this.id = id;
        this.name = name;
        this.state = state;
    }

    //getter et setter
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public int getState() {
        return state;
    }

    public void setState(int state) {
        this.state = state;
    }

    public int getEtage() { return etage; }

    public void setEtage(int etage) { this.etage = etage; }
}
