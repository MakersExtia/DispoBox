package com.example.asus.extiaboxtest.activities;

import android.content.Context;
import android.content.SharedPreferences;
import android.content.res.Configuration;
import android.os.Bundle;
import android.support.v4.app.Fragment;
import android.support.v4.app.FragmentManager;
import android.support.v4.app.FragmentTransaction;
import android.support.v4.content.ContextCompat;
import android.support.v4.widget.DrawerLayout;
import android.support.v7.app.ActionBarDrawerToggle;
import android.support.v7.app.AppCompatActivity;
import android.support.v7.widget.Toolbar;
import android.view.Gravity;
import android.view.View;
import android.view.Menu;
import android.view.MenuItem;
import android.view.Window;
import android.view.WindowManager;
import android.view.inputmethod.InputMethodManager;
import android.widget.AdapterView;
import android.widget.ListView;

import com.example.asus.extiaboxtest.R;
import com.example.asus.extiaboxtest.adapters.MenuAdapter;
import com.example.asus.extiaboxtest.constants.Constants;
import com.example.asus.extiaboxtest.fragments.FloorFourFragment;
import com.example.asus.extiaboxtest.fragments.FloorSixFragment;
import com.example.asus.extiaboxtest.fragments.MainFragment;
import com.example.asus.extiaboxtest.fragments.SettingFragment;
import com.example.asus.extiaboxtest.models.MenuData;
import com.example.asus.extiaboxtest.tools.retrofit.settings.ServerServicesProvider;

import java.util.ArrayList;
import java.util.List;

public class MainActivity extends AppCompatActivity {

    Toolbar mToolbar;
    DrawerLayout mDrawerLayout;
    ActionBarDrawerToggle mDrawerToggle;

    ListView mListeMenu;
    List<MenuData> mItemMenu = new ArrayList<MenuData>();
    MenuAdapter mAdapter;

    SharedPreferences sharedPreferences;
    SharedPreferences.Editor editor;

    String UrlWebservice;

    // controller pour la connexion au serveur
    static ServerServicesProvider mServicesProvider;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        // chargement des composants du layout
        mToolbar = (Toolbar) findViewById(R.id.toolbar);
        mDrawerLayout = (DrawerLayout) findViewById(R.id.dl_drawerLayout);
        mListeMenu = (ListView) findViewById(R.id.lv_liste_menu);

        setSupportActionBar(mToolbar);

        // afficher le bouton retour dans la toolbart
        getSupportActionBar().setHomeButtonEnabled(true);
        getSupportActionBar().setDisplayHomeAsUpEnabled(true);

        // changement de la couleur de la status bar
        changeColorStatusBar();

        // chargement des items du menuè drawer dans la listView
        loadItemMenuDrawer();

        // chargement de la variable présente dans les préférences data pour IP qui contact les webservices via retrofit V2
        initUrlIpWithPreferenceData();

        // chargement des listener pour les events
        synchronizeListener();

        // afficher le Main fragment (home)
        showFragment(new MainFragment());

//        FloatingActionButton fab = (FloatingActionButton) findViewById(R.id.fab);
//        fab.setOnClickListener(new View.OnClickListener() {
//            @Override
//            public void onClick(View view) {
//
//            }
//        });

    }

    // fonction qui permet de cacher ou d'afficher la mToolbar
    private void showHideToolbar() {
        if(mToolbar.getAlpha() == 1){
            //hide
            mToolbar.animate()
                    .alpha(0) //la rendre invisible
                    .translationY(-mToolbar.getHeight()) //la déplacer vers le haut
                    .start();
        }
        else{
            //show
            mToolbar.animate()
                    .alpha(1) //la rendre visible
                    .translationY(0) //retour à la position d'origine
                    .start();
        }
    }

    // fonction pour le changement de fragment a partir de l'activity principale
    public void showFragment(Fragment fragment) {
        if (fragment == null)
            return;

        FragmentManager fm = getSupportFragmentManager();
        FragmentTransaction ft = fm.beginTransaction();

        //Transition
        ft.setCustomAnimations(android.R.anim.slide_in_left, android.R.anim.slide_out_right);
        ft.replace(R.id.fl_content_frame, fragment);
        ft.addToBackStack(null);
        ft.commit();
    }

    // fonction qui permet de cacher le clavier android
    public void hideKeyboard(){
        View view = this.getCurrentFocus();
        if (view != null) {
            InputMethodManager imm = (InputMethodManager)getSystemService(Context.INPUT_METHOD_SERVICE);
            imm.hideSoftInputFromWindow(view.getWindowToken(), 0);
        }
    }

    public void initUrlIpWithPreferenceData(){
        String dataIP = "";
        sharedPreferences = getApplicationContext().getSharedPreferences(Constants.PREF_KEY_NAME, Context.MODE_PRIVATE);
        dataIP = sharedPreferences.getString(Constants.PREF_KEY_IP, "");

        if(dataIP != null && !dataIP.isEmpty()){
            UrlWebservice = dataIP;
        } else {
            UrlWebservice = Constants.URL_DEFAULT;
        }
    }

    // fonction qui permet le de contacter un web service via la librairie retrofit V2
    public ServerServicesProvider getServerServicesProvider(){
        if(mServicesProvider == null){
            mServicesProvider = new ServerServicesProvider();
            mServicesProvider.setEndPoint(UrlWebservice);
            mServicesProvider.createWebInterface();
        }

        return mServicesProvider;
    }

    // fonction qui permet le chargement des items du menuè drawer dans la listView
    public void loadItemMenuDrawer(){
        MenuData iteamMenuHome = new MenuData(
                ContextCompat.getDrawable(this, R.drawable.ic_menu_item_home),
                getResources().getString(R.string.item_menu_home));

        MenuData iteamMenuFloorFour = new MenuData(
                ContextCompat.getDrawable(this, R.drawable.ic_menu_item_floor_four),
                getResources().getString(R.string.item_menu_floor_four));

        MenuData iteamMenuFloorSix = new MenuData(
                ContextCompat.getDrawable(this, R.drawable.ic_menu_item_floor_six),
                getResources().getString(R.string.item_menu_floor_six));

        MenuData iteamMenuSetting = new MenuData(
                ContextCompat.getDrawable(this, R.drawable.ic_menu_item_setting),
                getResources().getString(R.string.item_menu_setting));

        mItemMenu.add(iteamMenuHome);
        mItemMenu.add(iteamMenuFloorFour);
        mItemMenu.add(iteamMenuFloorSix);
        mItemMenu.add(iteamMenuSetting);

        mAdapter = new MenuAdapter(this, mItemMenu);
        mListeMenu.setAdapter(mAdapter);

        // chargement du menu Drawer
        mDrawerToggle = new ActionBarDrawerToggle(this, mDrawerLayout,0,0);
        mDrawerLayout.addDrawerListener(mDrawerToggle);
    }

    // fonction qui permet le changement de la couleur de la status bar
    public void changeColorStatusBar(){
        Window window = this.getWindow();
        // clear FLAG_TRANSLUCENT_STATUS flag:
        window.clearFlags(WindowManager.LayoutParams.FLAG_TRANSLUCENT_STATUS);
        // add FLAG_DRAWS_SYSTEM_BAR_BACKGROUNDS flag to the window
        window.addFlags(WindowManager.LayoutParams.FLAG_DRAWS_SYSTEM_BAR_BACKGROUNDS);
        // finally change the color
        window.setStatusBarColor(this.getResources().getColor(R.color.colorPrimaryDark));
    }

    // fonction qui permet de charger les listener
    public void synchronizeListener(){
        //event suite au click sur le bouton du menu drawer
        mToolbar.setNavigationOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                //ouverture du menu drawer
                openDrawerMenu();
            }
        });

        mListeMenu.setOnItemClickListener(new AdapterView.OnItemClickListener() {
            @Override
            public void onItemClick(AdapterView<?> parent, final View view, int position, long id) {
                //final String item = (String) parent.getItemAtPosition(position);
                //Toast.makeText(MainActivity.this, "item : " + item, Toast.LENGTH_SHORT).show();

                switch (position) {
                    case 0:
                        closeDrawerMenu();
                        showFragment(new MainFragment());
                        break;
                    case 1:
                        closeDrawerMenu();
                        showFragment(new FloorFourFragment());
                        break;
                    case 2:
                        closeDrawerMenu();
                        showFragment(new FloorSixFragment());
                        break;
                    case 3:
                        closeDrawerMenu();
                        showFragment(new SettingFragment());
                        break;
                    default:
                        closeDrawerMenu();
                        showFragment(new MainFragment());
                        break;
                }

                //MenuData itemMenu = mAdapter.getItem(position);
                //Toast.makeText(MainActivity.this, "pos : " + position + " title : " + itemMenu.getTitle(), Toast.LENGTH_SHORT).show();

                /*
                view.animate().setDuration(2000).alpha(0).withEndAction(new Runnable() {
                    @Override
                    public void run() {
                        list.remove(item);
                        mAdapter.notifyDataSetChanged();
                        view.setAlpha(1);
                    }
                });
                */
            }
        });
    }

    // fonction qui permet l'ouverture du menu Drawer
    public void openDrawerMenu(){
        mDrawerLayout.openDrawer(Gravity.LEFT);
    }

    // fonction qui permet la fermeture du menu Drawer
    public void closeDrawerMenu(){
        mDrawerLayout.closeDrawer(Gravity.LEFT);
    }

    //nécéssaire pour le chargement du menu Drawer
    @Override
    protected void onPostCreate(Bundle savedInstanceState) {
        super.onPostCreate(savedInstanceState);
        // synchroniser le mDrawerToggle après la restauration via onRestoreInstanceState
        mDrawerToggle.syncState();
    }

    @Override
    public void onConfigurationChanged(Configuration newConfig) {
        super.onConfigurationChanged(newConfig);
        mDrawerToggle.onConfigurationChanged(newConfig);
    }

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        // Inflate the menu; this adds items to the action bar if it is present.
        getMenuInflater().inflate(R.menu.menu_main, menu);
        return true;
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        // Handle action bar item clicks here. The action bar will
        // automatically handle clicks on the Home/Up button, so long
        // as you specify a parent activity in AndroidManifest.xml.
        int id = item.getItemId();

        //noinspection SimplifiableIfStatement
        if (id == R.id.action_settings) {
            showFragment(new SettingFragment());
            return true;
        }

        return super.onOptionsItemSelected(item);
    }

    public String getUrlWebservice() {
        return UrlWebservice;
    }

    public void setUrlWebservice(String urlWebservice) {
        UrlWebservice = urlWebservice;
    }
}
