package fr.extia.extiabox;

import java.io.Serializable;

// Objet représentant une box
// TODO : ajouter les infos utiles, notamment le nom de la salle
public class ResultItem implements Serializable {
	
	private static final long serialVersionUID = 42L;
	
	// The id of the item
	public String itemId;
	
	// The id of the parent folder
	public int currentState;
	
}