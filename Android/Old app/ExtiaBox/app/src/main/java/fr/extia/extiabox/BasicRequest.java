package fr.extia.extiabox;

import android.os.AsyncTask;
import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.apache.http.StatusLine;
import org.apache.http.client.ClientProtocolException;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpUriRequest;
import org.apache.http.impl.client.DefaultHttpClient;
import org.apache.http.client.methods.HttpGet;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.ArrayList;

// TODO : remplacer les librairies dépréciées
public class BasicRequest extends AsyncTask<Object, Void, String> {
	
	// JSON Node names
	private static final String TAG_DATA = "data";
    private static final String TAG_ID = "id";
    private static final String TAG_STATE = "state";
    
    String serverUrl;

	public BasicRequestListener listener;

	// Paramètre non utilisé pour l'instant
	private int currentFloor;
    
	public BasicRequest(String serverUrl, BasicRequestListener listener, int currentFloor) {
		this.listener = listener;
		this.serverUrl = serverUrl;
		this.currentFloor = currentFloor;
	}

    // Appel du serveur en asynchrone, et récupération des données
    protected String doInBackground(Object... params) {

		StringBuilder builder = new StringBuilder();
	    HttpClient client = new DefaultHttpClient();
	    HttpUriRequest request = buildRequest();
	    try {
	    	HttpResponse response = (HttpResponse) client.execute(request);
	    	StatusLine statusLine = response.getStatusLine();
	    	int statusCode = statusLine.getStatusCode();
	    	if (statusCode == 200) {
	    		HttpEntity entity = response.getEntity();
	    		InputStream content = entity.getContent();
	    		BufferedReader reader = new BufferedReader(new InputStreamReader(content));
	    		String line;
	    		while ((line = reader.readLine()) != null) {
	    			builder.append(line);
	    		}
	    	}
	    	else {
	    		listener.onTaskFailed(String.valueOf(statusCode));
	    	}
	    } catch (ClientProtocolException e) {
	    	listener.onTaskFailed("error : " + e.getMessage());
	    } catch (IOException e) {
	    	listener.onTaskFailed("error : " + e.getMessage());
	    }
	    return builder.toString();
	    
    }

	public HttpUriRequest buildRequest() {
		String urlString = serverUrl;
		HttpGet httpGet = new HttpGet(urlString);
		httpGet.setHeader("Accept", "application/json");
		return httpGet;
	}
    
    // TODO : traiter le cas où les données sont vides ou incorrectes
    protected void onPostExecute(String result) {
		if (result.length()>0) {
    		ArrayList<ResultItem> items = getItemListFromJsonString(result);
	    	listener.onTaskCompleted(items);
    	}
    }

	// Traitement du JSON et récupération de données utiles
    public ArrayList<ResultItem> getItemListFromJsonString(String jsonString) {
		ArrayList<ResultItem> items = new ArrayList<>();
		try {
			JSONObject json = new JSONObject(jsonString);
			JSONArray data = json.getJSONArray(TAG_DATA);
			// TODO : utiliser le premier item pour connaitre l'état du réseau
			for(int i = 1; i < data.length(); i++){
				JSONObject itemJson = data.getJSONObject(i);
				ResultItem item = itemFromJsonObject(itemJson);
				items.add(item);
			}
		} catch (JSONException e) {
			listener.onTaskFailed("error : " + e.getMessage());
		}
		// TODO : sélectionner les informations utiles en fonction de l'étage (currentFloor)
		return items;
	}
    
    // Transformation des données JSON en item
    // TODO : trier le tableau en fonction des itemsId
    public ResultItem itemFromJsonObject(JSONObject object) {
    	ResultItem item = new ResultItem();
    	try {
    		item.itemId = object.getString(TAG_ID);
    		item.currentState = object.getInt(TAG_STATE);
    	} catch (JSONException e) {
        	listener.onTaskFailed("error : " + e.getMessage());
        	return null;
        }
    	return item;
    }
}
