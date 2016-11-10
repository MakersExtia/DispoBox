package com.example.asus.extiaboxtest.models;

import android.graphics.drawable.Drawable;

/**
 * Created by Asus on 04/11/2016.
 */

public class MenuData {
    private Drawable img;
    private String title;

    public MenuData(){}

    public MenuData(Drawable img, String title){
        this.title = title;
        this.img = img;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public Drawable getImg() {
        return img;
    }

    public void setImg(Drawable img) {
        this.img = img;
    }
}
