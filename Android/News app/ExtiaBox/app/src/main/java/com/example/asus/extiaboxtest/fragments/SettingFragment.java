package com.example.asus.extiaboxtest.fragments;

import android.content.Context;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.support.design.widget.CoordinatorLayout;
import android.support.design.widget.Snackbar;
import android.support.v4.app.Fragment;
import android.support.v4.widget.SwipeRefreshLayout;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.view.inputmethod.InputMethodManager;
import android.widget.Button;
import android.widget.EditText;
import android.widget.RelativeLayout;
import android.widget.Toast;

import com.example.asus.extiaboxtest.R;
import com.example.asus.extiaboxtest.activities.MainActivity;
import com.example.asus.extiaboxtest.constants.Constants;

/**
 * Created by Asus on 04/11/2016.
 */

public class SettingFragment extends Fragment {

    private MainActivity mActivity;
    private Context mContext;

    private RelativeLayout loadingScreenRL;
    private SwipeRefreshLayout swipeContainerSRL;
    private CoordinatorLayout clFclMaincontent;

    private SharedPreferences sharedPreferences;
    private SharedPreferences.Editor editor;

    private Button btnSaveIp;
    private EditText etDataIP;

    String dataIP = "";

    //Constructeur
    public SettingFragment() {

    }

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.fragment_setting, container, false);

        mActivity = (MainActivity) getActivity();
        mContext = mActivity.getApplicationContext();

        // modification du titre de l'acitivity en fonction du fragment courant
        mActivity.setTitle(getResources().getString(R.string.item_menu_setting));

        // chargement des composants du layout
        loadingScreenRL = (RelativeLayout) view.findViewById(R.id.rl_loadingscreen);
        swipeContainerSRL = (SwipeRefreshLayout) view.findViewById(R.id.srl_orders_list);
        clFclMaincontent = (CoordinatorLayout) view.findViewById(R.id.cl_fcl_maincontent);
        btnSaveIp = (Button) view.findViewById(R.id.btn_save_ip);
        etDataIP = (EditText) view.findViewById(R.id.et_data_ip);

        // chargement des données
        synchronizeContent();

        // chargement des listener pour les events
        synchronizeListener();

        return view;
    }

    public void synchronizeContent() {

        loadingScreenRL.setVisibility(View.VISIBLE);

        // chargement de l'IP via les SharedPreference (moins complexe que de passer par une base SQLite)
        sharedPreferences = mContext.getSharedPreferences(Constants.PREF_KEY_NAME, Context.MODE_PRIVATE);
        dataIP = sharedPreferences.getString(Constants.PREF_KEY_IP, "");

        // modification de la variable qui au passage n'est plus constante pour des besoins de dynamisme pour le changement de l'ip
        mActivity.setUrlWebservice(dataIP);

        // ajout des données dans la vue
        refreshView();
    }

    public void refreshView() {

        swipeContainerSRL.setRefreshing(false);
        loadingScreenRL.setVisibility(View.GONE);

        if(!dataIP.isEmpty()){
            etDataIP.setText(dataIP);
        }
    }

    public void synchronizeListener() {

        // bouton pour enregistrer dans les préférences data la nouvelle IP
        btnSaveIp.setOnClickListener(new View.OnClickListener() {
            public void onClick(View v) {

                saveDataIp();
            }
        });

        swipeContainerSRL.setOnRefreshListener(new SwipeRefreshLayout.OnRefreshListener() {
            @Override
            public void onRefresh() {
                // Your code to refresh the list here.
                // Make sure you call swipeContainer.setRefreshing(false)
                // once the network request has completed successfully.
                synchronizeContent();
            }
        });

        swipeContainerSRL.setColorSchemeResources(R.color.colorPrimary, R.color.colorPrimaryDark, R.color.colorAccent);
    }

    public void saveDataIp(){
        String dataSave = etDataIP.getText().toString();

        if(dataSave.isEmpty()){

            // affichage a l'utilisateur que l'IP qui à entré est vide
            Snackbar.make(clFclMaincontent, getResources().getString(R.string.data_empty), Snackbar.LENGTH_LONG).show();

        } else {
            // enregistrement de l'IP grace au SharedPreferences
            sharedPreferences = mContext.getSharedPreferences(Constants.PREF_KEY_NAME, Context.MODE_PRIVATE);

            editor = sharedPreferences.edit();
            editor.putString(Constants.PREF_KEY_IP, dataSave);
            editor.commit();

            // cache le clavier android
            mActivity.hideKeyboard();

            // affichage a l'utilisateur que l'IP qui à entré est bien sauvegardé
            Snackbar.make(clFclMaincontent, getResources().getString(R.string.data_save), Snackbar.LENGTH_LONG).show();

            // rechargement de la vue pour afficher la nouvelle IP dans le champ texte
            synchronizeContent();
        }
    }


}
