package com.example.asus.extiaboxtest.fragments;

import android.content.Context;
import android.os.Bundle;
import android.support.design.widget.CoordinatorLayout;
import android.support.v4.app.Fragment;
import android.support.v4.widget.SwipeRefreshLayout;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.LinearLayout;
import android.widget.RelativeLayout;
import com.example.asus.extiaboxtest.R;
import com.example.asus.extiaboxtest.activities.MainActivity;

/**
 * Created by Asus on 03/11/2016.
 */

public class MainFragment extends Fragment {

    private MainActivity mActivity;
    private Context mContext;

    private RelativeLayout loadingScreenRL;
    private SwipeRefreshLayout swipeContainerSRL;
    private CoordinatorLayout clFclMaincontent;

    private Button btnGoFloorFour, btnGoFloorSix;

    //Constructeur
    public MainFragment() {

    }

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.fragment_main, container, false);

        mActivity = (MainActivity) getActivity();
        mContext = mActivity.getApplicationContext();

        // modification du titre de l'acitivity en fonction du fragment courant
        mActivity.setTitle(getResources().getString(R.string.item_menu_home));

        loadingScreenRL = (RelativeLayout) view.findViewById(R.id.rl_loadingscreen);
        swipeContainerSRL = (SwipeRefreshLayout) view.findViewById(R.id.srl_orders_list);
        clFclMaincontent = (CoordinatorLayout) view.findViewById(R.id.cl_fcl_maincontent);

        btnGoFloorFour = (Button) view.findViewById(R.id.btn_go_floor_four);
        btnGoFloorSix = (Button) view.findViewById(R.id.btn_go_floor_six);

        synchronizeContent();
        synchronizeListener();

        return view;
    }

    public void synchronizeContent() {

        loadingScreenRL.setVisibility(View.VISIBLE);

        refreshView();
    }

    public void refreshView() {

        swipeContainerSRL.setRefreshing(false);
        loadingScreenRL.setVisibility(View.GONE);

    }

    public void synchronizeListener() {

        // bouton pour aller sur la vue du 4eme étage
        btnGoFloorFour.setOnClickListener(new View.OnClickListener() {
            public void onClick(View v) {
                mActivity.showFragment(new FloorFourFragment());
            }
        });

        // bouton pour aller sur la vue du 6eme étage
        btnGoFloorSix.setOnClickListener(new View.OnClickListener() {
            public void onClick(View v) {
                mActivity.showFragment(new FloorSixFragment());
            }
        });

        // event pour actualiser la page via un swipe vers le bas
        swipeContainerSRL.setOnRefreshListener(new SwipeRefreshLayout.OnRefreshListener() {
            @Override
            public void onRefresh() {
                // Your code to refresh the list here.
                // Make sure you call swipeContainer.setRefreshing(false)
                // once the network request has completed successfully.
                synchronizeContent();
            }
        });

        // configuration des couleurs du swipe
        swipeContainerSRL.setColorSchemeResources(R.color.colorPrimary, R.color.colorPrimaryDark, R.color.colorAccent);
    }
}
