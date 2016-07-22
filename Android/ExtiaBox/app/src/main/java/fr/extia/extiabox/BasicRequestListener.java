package fr.extia.extiabox;

import java.util.ArrayList;

// Interface utilisé pour les actions de l'activité en fonction du retour du serveur
public interface BasicRequestListener {
    void onTaskCompleted(ArrayList<ResultItem> items);
    void onTaskFailed(String error);
}
