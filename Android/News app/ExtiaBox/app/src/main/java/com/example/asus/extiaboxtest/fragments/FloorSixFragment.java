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
import android.widget.EditText;
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

public class FloorSixFragment extends Fragment {

    private MainActivity mActivity;
    private Context mContext;

    private RelativeLayout loadingScreenRL;
    private SwipeRefreshLayout swipeContainerSRL;
    private CoordinatorLayout clFclMaincontent;

    private ServerServicesProvider mServicesProvider;
    private List<Salle> mSalleList;

    private ImageView floorSix;
    private LinearLayout layoutFloorSix;
    private TextView tvSalle61, tvSalle62, tvSalle63, tvSalle64, tvSalle65, tvSalle66, tvSalle67, tvSalle68;
    private Button btnGoFloorFour;

    //Constructeur
    public FloorSixFragment() {

    }

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.fragment_floor_six, container, false);

        mActivity = (MainActivity) getActivity();
        mContext = mActivity.getApplicationContext();

        // modification du titre de l'acitivity en fonction du fragment courant
        mActivity.setTitle(getResources().getString(R.string.item_menu_floor_six));

        loadingScreenRL = (RelativeLayout) view.findViewById(R.id.rl_loadingscreen);
        swipeContainerSRL = (SwipeRefreshLayout) view.findViewById(R.id.srl_orders_list);
        clFclMaincontent = (CoordinatorLayout) view.findViewById(R.id.cl_fcl_maincontent);
        layoutFloorSix = (LinearLayout) view.findViewById(R.id.ll_parent_view_floor_six);

        tvSalle61 = (TextView) view.findViewById(R.id.tv_salle_6_1);
        tvSalle62 = (TextView) view.findViewById(R.id.tv_salle_6_2);
        tvSalle63 = (TextView) view.findViewById(R.id.tv_salle_6_3);
        tvSalle64 = (TextView) view.findViewById(R.id.tv_salle_6_4);
        tvSalle65 = (TextView) view.findViewById(R.id.tv_salle_6_5);
        tvSalle66 = (TextView) view.findViewById(R.id.tv_salle_6_6);
        tvSalle67 = (TextView) view.findViewById(R.id.tv_salle_6_7);
        tvSalle68 = (TextView) view.findViewById(R.id.tv_salle_6_8);

        btnGoFloorFour = (Button) view.findViewById(R.id.btn_go_floor_four);

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

                        case "61":
                            changeColorSalle(salle, tvSalle61);
                            break;
                        case "62":
                            changeColorSalle(salle, tvSalle62);
                            break;
                        case "63":
                            changeColorSalle(salle, tvSalle63);
                            break;
                        case "64":
                            changeColorSalle(salle, tvSalle64);
                            break;
                        case "65":
                            changeColorSalle(salle, tvSalle65);
                            break;
                        case "66":
                            changeColorSalle(salle, tvSalle66);
                            break;
                        case "67":
                            changeColorSalle(salle, tvSalle67);
                            break;
                        case "68":
                            changeColorSalle(salle, tvSalle68);
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

        // bouton pour aller sur la vue du 4eme étage
        btnGoFloorFour.setOnClickListener(new View.OnClickListener() {
            public void onClick(View v) {
                mActivity.showFragment(new FloorFourFragment());
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
}
