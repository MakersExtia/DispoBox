package com.example.asus.extiaboxtest.fragments;

import android.content.Context;
import android.os.Bundle;
import android.support.design.widget.CoordinatorLayout;
import android.support.design.widget.Snackbar;
import android.support.v4.app.Fragment;
import android.support.v4.content.ContextCompat;
import android.support.v4.widget.SwipeRefreshLayout;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.RelativeLayout;
import android.widget.TextView;

import com.example.asus.extiaboxtest.R;
import com.example.asus.extiaboxtest.activities.MainActivity;
import com.example.asus.extiaboxtest.tools.retrofit.models.Salle;
import com.example.asus.extiaboxtest.tools.retrofit.services.GetAllBoxes;
import com.example.asus.extiaboxtest.tools.retrofit.settings.ServerServicesProvider;

import java.util.List;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

/**
 * Created by Asus on 03/11/2016.
 */

public class FloorFourFragment extends Fragment {

    private MainActivity mActivity;
    private Context mContext;

    private RelativeLayout loadingScreenRL;
    private SwipeRefreshLayout swipeContainerSRL;
    private CoordinatorLayout clFclMaincontent;

    private ServerServicesProvider mServicesProvider;
    private List<Salle> mSalleList;

    private ImageView floorFour;
    private LinearLayout layoutFloorFour;
    private TextView tvSalle41, tvSalle42, tvSalle43, tvSalle44, tvSalle45, tvSalle46, tvSalle47;
    private Button btnGoFloorSix;

    //Constructeur
    public FloorFourFragment() {

    }

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.fragment_floor_four, container, false);

        mActivity = (MainActivity) getActivity();
        mContext = mActivity.getApplicationContext();

        // modification du titre de l'acitivity en fonction du fragment courant
        mActivity.setTitle(getResources().getString(R.string.item_menu_floor_four));

        loadingScreenRL = (RelativeLayout) view.findViewById(R.id.rl_loadingscreen);
        swipeContainerSRL = (SwipeRefreshLayout) view.findViewById(R.id.srl_orders_list);
        clFclMaincontent = (CoordinatorLayout) view.findViewById(R.id.cl_fcl_maincontent);
        layoutFloorFour = (LinearLayout) view.findViewById(R.id.ll_parent_view_floor_four);

        tvSalle41 = (TextView) view.findViewById(R.id.tv_salle_4_1);
        tvSalle42 = (TextView) view.findViewById(R.id.tv_salle_4_2);
        tvSalle43 = (TextView) view.findViewById(R.id.tv_salle_4_3);
        tvSalle44 = (TextView) view.findViewById(R.id.tv_salle_4_4);
        tvSalle45 = (TextView) view.findViewById(R.id.tv_salle_4_5);
        tvSalle46 = (TextView) view.findViewById(R.id.tv_salle_4_6);
        tvSalle47 = (TextView) view.findViewById(R.id.tv_salle_4_7);

        btnGoFloorSix = (Button) view.findViewById(R.id.btn_go_floor_six);

        mServicesProvider = mActivity.getServerServicesProvider();

        synchronizeContent();
        synchronizeListener();

        return view;
    }

    public void synchronizeContent() {

        loadingScreenRL.setVisibility(View.VISIBLE);

        try {
            Call<GetAllBoxes> callGetOrdersForCustomer = mServicesProvider.getWebServicesInterface().getAllBoxes();
            callGetOrdersForCustomer.enqueue(new Callback<GetAllBoxes>() {
                @Override
                public void onResponse(Call<GetAllBoxes> getUnivListResponse, Response<GetAllBoxes> response) {
                    if(response.isSuccessful()) {
                        if(response.body().getListSalle() != null){
                            if(response.body().getListSalle().size() > 0){
                                mSalleList = response.body().getListSalle();

                                refreshView();
                            } else {
                                Snackbar.make(clFclMaincontent, "Empty list message from array : " + response.raw(), Snackbar.LENGTH_INDEFINITE).show();
                                View errorMessageView = mActivity.getLayoutInflater().inflate(R.layout.view_empty_list_message, null, false);
                                loadingScreenRL.setVisibility(View.GONE);
                                mActivity.addContentView(errorMessageView, new LinearLayout.LayoutParams(LinearLayout.LayoutParams.MATCH_PARENT, LinearLayout.LayoutParams.MATCH_PARENT));
                            }
                        } else {
                            Snackbar.make(clFclMaincontent, "Unknown message from server : " + response.raw(), Snackbar.LENGTH_INDEFINITE).show();
                            View errorMessageView = mActivity.getLayoutInflater().inflate(R.layout.view_unknown_message, null, false);
                            loadingScreenRL.setVisibility(View.GONE);
                            mActivity.addContentView(errorMessageView, new LinearLayout.LayoutParams(LinearLayout.LayoutParams.MATCH_PARENT, LinearLayout.LayoutParams.MATCH_PARENT));
                        }
                    } else {
                        swipeContainerSRL.setRefreshing(false);
                        //Server error
                        Snackbar.make(clFclMaincontent, "Server error GetAllBoxes : " + response.message(), Snackbar.LENGTH_INDEFINITE)
                                .setAction(getResources().getString(R.string.try_again), new View.OnClickListener() {
                                    @Override
                                    public void onClick(View v) {
                                        synchronizeContent();
                                    }
                                })
                                .show();
                    }
                }

                @Override
                public void onFailure(Call<GetAllBoxes> call, Throwable t) {
                    Log.e(this.getClass().getName(), "Retrofit error : " + t);

                    Snackbar.make(clFclMaincontent, "Erreur dans GetAllBoxes", Snackbar.LENGTH_SHORT).show();
                    View errorMessageView = mActivity.getLayoutInflater().inflate(R.layout.view_error_message, null, false);
                    loadingScreenRL.setVisibility(View.GONE);
                    mActivity.addContentView(errorMessageView, new LinearLayout.LayoutParams(LinearLayout.LayoutParams.MATCH_PARENT, LinearLayout.LayoutParams.MATCH_PARENT));
                }
            });
        } catch (Exception ex) {
            //ex.printStackTrace();
            if (mActivity != null) {
                Snackbar.make(clFclMaincontent, "Erreur dans GetAllBoxes", Snackbar.LENGTH_SHORT).show();
                View errorMessageView = mActivity.getLayoutInflater().inflate(R.layout.view_error_message, null, false);
                loadingScreenRL.setVisibility(View.GONE);
                mActivity.addContentView(errorMessageView, new LinearLayout.LayoutParams(LinearLayout.LayoutParams.MATCH_PARENT, LinearLayout.LayoutParams.MATCH_PARENT));
            }
        }

    }

    public void refreshView() {

        swipeContainerSRL.setRefreshing(false);
        loadingScreenRL.setVisibility(View.GONE);

        if(mSalleList != null && mSalleList.size() > 0){
            for(Salle salle : mSalleList){
                if(!"0".equals(salle.getId())){

                    switch(salle.getId()) {

                        case "41":
                            changeColorSalle(salle, tvSalle41);
                            break;
                        case "42":
                            changeColorSalle(salle, tvSalle42);
                            break;
                        case "43":
                            changeColorSalle(salle, tvSalle43);
                            break;
                        case "44":
                            changeColorSalle(salle, tvSalle44);
                            break;
                        case "45":
                            changeColorSalle(salle, tvSalle45);
                            break;
                        case "46":
                            changeColorSalle(salle, tvSalle46);
                            break;
                        case "47":
                            changeColorSalle(salle, tvSalle47);
                            break;
                        default:
                    }
                }
            }
        }

    }

    // fonction qui permet le changement de couleur de la salle
    public void changeColorSalle(Salle salle, TextView textView){
        if(salle.getState() == 0){
            textView.setBackgroundColor(ContextCompat.getColor(mContext, R.color.salleColorGreen));
        } else if (salle.getState() == 1){
            textView.setBackgroundColor(ContextCompat.getColor(mContext, R.color.salleColorRed));
        } else {
            textView.setBackgroundColor(ContextCompat.getColor(mContext, R.color.salleColor));
        }
    }

    public void synchronizeListener() {

        // bouton pour aller sur la vue du 6eme étage
        btnGoFloorSix.setOnClickListener(new View.OnClickListener() {
            public void onClick(View v) {
                mActivity.showFragment(new FloorSixFragment());
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

        swipeContainerSRL.setColorSchemeResources(
                R.color.colorPrimary,
                R.color.colorPrimaryDark,
                R.color.colorAccent);
    }
}
