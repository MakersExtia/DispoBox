package fr.extia.extiabox;


import android.app.AlertDialog;
import android.graphics.Color;
import android.graphics.Point;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.util.Log;
import android.view.Display;
import android.view.View;
import android.widget.Button;
import android.widget.ImageView;

import java.util.ArrayList;



public class MainActivity extends AppCompatActivity implements BasicRequestListener {

    public ArrayList<Integer> views;

    // définition de l'étage, uniquement graphique pour l'instant (6ème étage non connecté)
    private int currentFloor;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        // bouton de connection au serveur
        Button buttonConnect = (Button)findViewById(R.id.refreshButton);
        buttonConnect.setOnClickListener(new View.OnClickListener() {
            public void onClick(View v) {
                checkValue();
            }
        });

        // bouton de passage au 4ème étage
        Button buttonForth = (Button)findViewById(R.id.forthButton);
        buttonForth.setOnClickListener(new View.OnClickListener() {
            public void onClick(View v) {
                gotoForth();
            }
        });

        // bouton de passage au 6ème étage
        Button buttonSixth = (Button)findViewById(R.id.sixthButton);
        buttonSixth.setOnClickListener(new View.OnClickListener() {
            public void onClick(View v) {
                gotoSixth();
            }
        });

        // création de la liste des vues, utilisées pour rendre l'information
        createViewList();
    }

    @Override
    protected void onResume() {
        super.onResume();
        // Par défaut, affichage du 4ème étage
        // TODO : mémoriser le dernier choix de l'utilisateur
        currentFloor = 4;
        setInterface();
    }

    public void gotoForth(){
        if(currentFloor==4) return;
        currentFloor = 4;
        setInterface();
        // TODO : refaire un appel serveur en précisant l'étage, ou remettre l'interface par défaut
    }

    public void gotoSixth(){
        if(currentFloor==6) return;
        currentFloor = 6;
        setInterface();
        // TODO : refaire un appel serveur en précisant l'étage, ou remettre l'interface par défaut
    }

    private void createViewList() {
        // Création d'un liste contenant les ids des vues
        views = new ArrayList<>();
        views.add(R.id.testScreen1);
        views.add(R.id.testScreen2);
        views.add(R.id.testScreen3);
        views.add(R.id.testScreen4);
        views.add(R.id.testScreen5);
        views.add(R.id.testScreen6);
    }

    public void setInterface() {
        // TODO : placement absolu des vues, à adapter aux différents formats d'écran
        View parentView = findViewById(R.id.parentView);
        int screenWidth = parentView.getWidth();
        int screenHeight = parentView.getHeight();
        if(screenWidth==0) {
            Display display = getWindowManager().getDefaultDisplay();
            Point size = new Point();
            display.getSize(size);
            screenWidth = size.x;
            screenHeight = size.y - 96;;
        }
        ImageView backgroundView = (ImageView)findViewById(R.id.backgroundView);
        if(currentFloor==6) {
            backgroundView.setImageResource(R.drawable.plan6);
            int xStart = 415*screenWidth/1500;
            int yStart = 325*screenHeight/870;
            int xMargin = 75*screenWidth/1500;
            int yMargin = 220*screenHeight/870;
            for(int i=0;i<views.size();i++) {
                View colorView = findViewById(views.get(i));
                colorView.setX(xStart + xMargin*(i%3));
                colorView.setY(yStart + yMargin*(i/3));
            }
        }
        else if(currentFloor==4) {
            backgroundView.setImageResource(R.drawable.plan4);
            int xStart = 515*screenWidth/1767;
            int yStart = 260*screenHeight/930;
            int xMargin = 90*screenWidth/1767;
            int yMargin = 275*screenHeight/930;
            for(int i=0;i<views.size();i++) {
                View colorView = findViewById(views.get(i));
                colorView.setX(xStart + xMargin*(i%3));
                colorView.setY(yStart + yMargin*(i/3));
            }
        }
    }

    public void checkValue() {
        // TODO : ip du serveur est fixée en dur, à améliorer.
        new BasicRequest("http://190.23.0.10/dispobox/?action=getAllBoxes", this, currentFloor).execute();
    }

    public void onTaskCompleted(ArrayList<ResultItem> items){
        // Code couleur :
        // . Vert pour une salle libre
        // . Rouge pour une salle occupée
        // . Gris pour une absence de signal
        for(int i = 0; i < items.size(); i++){
            int color;
            if(items.get(i).currentState==0) color = Color.GREEN;
            else if(items.get(i).currentState==1) color = Color.RED;
            else color = Color.GRAY;
            findViewById(views.get(i)).setBackgroundColor(color);
        }
    }

    public void onTaskFailed(String errorMessage){
        // Message d'erreur affiché en cas de problème de connection au serveur
        AlertDialog dialog = new AlertDialog.Builder(this)
        .setTitle("Error")
        .setMessage(errorMessage)
        .create();
        dialog.show();
        dialog.setCanceledOnTouchOutside(true);
    }
}
